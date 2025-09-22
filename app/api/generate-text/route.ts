import { NextRequest, NextResponse } from "next/server";
import ServerApi from "@/lib/serverApi";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { generatedContent } from "@/lib/drizzle/schema";
import { eq, desc } from "drizzle-orm";

function generateId(): string {
  return crypto.randomUUID();
}

const createContent = async (contentData: {
  userId?: string;
  keywords: string[];
  promptType: string;
  generatedText: string;
  model: string;
}) => {
  const result = await serverDb
    .insert(generatedContent)
    .values({
      id: generateId(),
      userId: contentData.userId,
      keywords: contentData.keywords,
      promptType: contentData.promptType,
      generatedText: contentData.generatedText,
      model: contentData.model,
    })
    .returning();

  return result[0];
};

const generateTextSchema = z.object({
  whatDoYouOffer: z.string().min(1, "What do you offer is required"),
  whoDoYouHelp: z.string().min(1, "Who do you help is required"),
  promptType: z.enum(["asset-variants"]),
  tempUserId: z.string().uuid().optional(), // Added tempUserId validation
});

async function generateAssetVariants(
  whatDoYouOffer: string,
  whoDoYouHelp: string
) {
  const workerUrl =
    process.env.CLOUDFLARE_WORKER_URL ||
    "https://workers-ai.neel-300.workers.dev";
  const apiKey = process.env.CLOUDFLARE_WORKER_API_KEY;

  const requestData = {
    whatDoYouOffer,
    whoDoYouHelp,
    keywords: [],
  };

  const data = await ServerApi.postExternal(
    workerUrl,
    requestData,
    apiKey
      ? {
          apiKey,
          apiKeyHeader: "Authorization",
          apiKeyPrefix: "Bearer",
          timeout: 100000,
        }
      : { timeout: 100000 }
  );

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || id === null) {
      // No user and no tempUserId
      return NextResponse.json({
        success: true,
        data: null,
        message: "No user or temporary user ID provided",
      });
    }

    // Get the first generated content for this user
    const contentData = await serverDb
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.userId, id))
      .orderBy(desc(generatedContent.createdAt))
      .limit(1);

    if (!contentData.length) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No generated content found",
      });
    }

    const content = contentData[0];

    // Parse the generated text if it's JSON
    let parsedVariants = null;
    try {
      const parsed = JSON.parse(content.generatedText);
      parsedVariants = parsed.variants || parsed;
    } catch (parseError) {
      console.log(parseError);
      parsedVariants = content.generatedText;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: content.id,
        keywords: content.keywords,
        promptType: content.promptType,
        createdAt: content.createdAt,
        model: content.model,
        assetVariants: parsedVariants,
      },
    });
  } catch (error) {
    console.error("Error fetching generated content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch generated content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST method - Updated to handle tempUserId
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { whatDoYouOffer, whoDoYouHelp, promptType, tempUserId } =
      generateTextSchema.parse(body);

    // Get the current user (optional now)
    const authUser = await getAuthenticatedUser();

    // Determine the userId to use
    let userId: string;
    let shouldCheckLimits = false;

    if (authUser) {
      // User is authenticated - use their real user ID and check limits
      userId = authUser.id;
      shouldCheckLimits = true;
    } else if (tempUserId) {
      // User is not authenticated but provided tempUserId - use tempUserId, no limits
      userId = tempUserId;
      shouldCheckLimits = false;
    } else {
      // No user and no tempUserId - reject request
      return NextResponse.json(
        {
          success: false,
          error: "Authentication or temporary user ID required",
        },
        { status: 401 }
      );
    }

    // --- START: FREE PLAN LIMIT CHECK (only for authenticated users) ---
    if (shouldCheckLimits) {
      const userPlanId = authUser!.planId || "1";

      // If they are on the free plan, enforce the limit
      if (userPlanId === "1") {
        const contentCount = await serverDb
          .select({ count: generatedContent.id })
          .from(generatedContent)
          .where(eq(generatedContent.userId, authUser!.id));

        if (contentCount.length >= 1) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Your free generation has been used. Please upgrade to create more content.",
            },
            { status: 403 }
          );
        }
      }
    }
    // --- END: FREE PLAN LIMIT CHECK ---

    // Generate the asset variants
    const assetVariants = await generateAssetVariants(
      whatDoYouOffer,
      whoDoYouHelp
    );

    // Save the generated content with the determined userId
    const savedContent = await createContent({
      userId: userId, // This will be either authUser.id or tempUserId
      keywords: [whatDoYouOffer, whoDoYouHelp],
      promptType: promptType,
      generatedText: JSON.stringify(assetVariants),
      model: "cloudflare-worker",
    });

    return NextResponse.json({
      success: true,
      data: {
        id: savedContent.id,
        whatDoYouOffer: whatDoYouOffer,
        whoDoYouHelp: whoDoYouHelp,
        promptType: promptType,
        createdAt: savedContent.createdAt,
        assetVariants: assetVariants.variants,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate asset variants",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
