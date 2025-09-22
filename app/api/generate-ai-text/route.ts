import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { generatedContent } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { Data, AssetTypeKeys } from "@/contexts/AssetContext/types";
import OpenAI from "openai";

function generateId(): string {
  return crypto.randomUUID();
}

const createContent = async (contentData: {
  userId?: string;
  assetType: string;
  keywords: string[];
  generatedContent: string;
  model: string;
}) => {
  const result = await serverDb
    .insert(generatedContent)
    .values({
      id: generateId(),
      userId: contentData.userId,
      keywords: contentData.keywords,
      promptType: `ai-content-${contentData.assetType}`,
      generatedText: contentData.generatedContent,
      model: contentData.model,
    })
    .returning();

  return result[0];
};

const generateAITextSchema = z.object({
  assetType: z.enum([
    "social-banner",
    "social-post",
    "featured-post",
    "quote-card",
    "textimg-post",
    "mockup-post",
    "social-carousel",
  ]),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  numberOfSlides: z.number().min(1).max(10).optional(), // Only for carousel
  tempUserId: z.string().uuid().optional(),
});

// Generate single Data object for regular assets
async function generateSingleContent(
  assetType: AssetTypeKeys,
  keywords: string[]
): Promise<Data> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const keywordsText = keywords.join(", ");

    const systemPrompt = `You are a world-class AI content strategist specializing in creating engaging and professional social media content. Your primary platform is LinkedIn.

Your task is to generate content for a ${assetType.replace(
      "-",
      " "
    )} template. Create content that provides maximum value to a professional audience.

Content Guidelines:
- Tone: Professional, authoritative, yet accessible and engaging
- Clarity: Write with extreme clarity, avoid jargon, be direct
- Value: Focus on providing actionable insights or compelling hooks
- Engagement: Create content that encourages professional interaction

Technical Constraints:
- Title: Clear, engaging headline that grabs attention (max 60 characters)
- SubTitle: Supporting headline that states the benefit or takeaway (max 80 characters)  
- Description: Impactful description that's scannable and easy to digest (max 200 characters)
- CtaText: Strong call-to-action that prompts engagement (max 30 characters)
- HighlightedText: Key highlight or value proposition (max 40 characters)
- ShowBrandMark: Always set to false

Make content highly relevant to the provided keywords and create engaging professional content.`;

    const userPrompt = `Topic: Create a compelling ${assetType.replace(
      "-",
      " "
    )} post for LinkedIn based on the following keywords.

Keywords: ${keywordsText}

Generate professional LinkedIn content that focuses on these topics with actionable insights and engagement.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "content_data",
          schema: {
            type: "object",
            properties: {
              title: { type: "string", maxLength: 60 },
              subTitle: { type: "string", maxLength: 80 },
              description: { type: "string", maxLength: 200 },
              ctaText: { type: "string", maxLength: 30 },
              highlightedText: { type: "string", maxLength: 40 },
              showBrandMark: { type: "boolean" },
            },
            required: [
              "title",
              "subTitle",
              "description",
              "ctaText",
              "highlightedText",
              "showBrandMark",
            ],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    const generatedData: Data = JSON.parse(content);
    return generatedData;
  } catch {
    // Fallback to mock data if OpenAI fails
    const keywordsText = keywords.join(", ");
    const mockData: Data = {
      title: `AI Generated Title for ${assetType}`,
      subTitle: `Subtitle based on: ${keywordsText}`,
      description: `Description for: ${keywordsText}`,
      ctaText: "Get Started Now",
      highlightedText: keywords[0],
      showBrandMark: false,
    };
    return mockData;
  }
}

// Generate array of Data objects for carousel
async function generateCarouselContent(
  numberOfSlides: number,
  keywords: string[]
): Promise<Data[]> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const keywordsText = keywords.join(", ");

    const systemPrompt = `You are a world-class AI content strategist specializing in creating engaging and professional social media content. Your primary platform is LinkedIn.

Your task is to generate ${numberOfSlides} slides for a LinkedIn carousel based on the provided keywords. The content must be structured logically to tell a compelling story and provide maximum value to a professional audience.

Structure Requirements:
1. Introduction Slide (The Hook): Create a powerful, attention-grabbing title with a concise subtitle that clearly states the benefit or main takeaway.
2. Content Slides (The Body): Deconstruct the topic into logical key points or steps. Each slide must have a clear heading and brief, impactful description.
3. Conclusion Slide (The Outro): Provide a concise summary with a strong, engaging call to action.

Content Guidelines:
- Tone: Professional, authoritative, yet accessible and engaging
- Clarity: Write with extreme clarity, avoid jargon, be direct
- Formatting: Use simple formatting for emphasis and readability
- Each slide should be scannable and easy to digest

Technical Constraints:
- Title: Clear, engaging headline (max 60 characters)
- SubTitle: Supporting headline or tagline (max 80 characters)  
- Description: Detailed description (max 200 characters)
- CtaText: Call-to-action button text (max 30 characters)
- HighlightedText: Key highlight or badge text (max 40 characters)
- ShowBrandMark: Always set to false

Create ${numberOfSlides} unique slides that work together as a cohesive LinkedIn carousel story.`;

    const userPrompt = `Topic: Create a LinkedIn carousel based on the following keywords.

Keywords: ${keywordsText}

Generate ${numberOfSlides} slides that follow the LinkedIn carousel structure:
1. Hook slide (introduction)
2. Value slides (body content)
3. CTA slide (conclusion)

Each slide should provide professional value and work together as a cohesive story around these keywords.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "carousel_slides",
          schema: {
            type: "object",
            properties: {
              slides: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", maxLength: 60 },
                    subTitle: { type: "string", maxLength: 80 },
                    description: { type: "string", maxLength: 200 },
                    ctaText: { type: "string", maxLength: 30 },
                    highlightedText: { type: "string", maxLength: 40 },
                    showBrandMark: { type: "boolean" },
                  },
                  required: [
                    "title",
                    "subTitle",
                    "description",
                    "ctaText",
                    "highlightedText",
                    "showBrandMark",
                  ],
                  additionalProperties: false,
                },
                minItems: numberOfSlides,
                maxItems: numberOfSlides,
              },
            },
            required: ["slides"],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    const parsedResponse = JSON.parse(content);
    return parsedResponse.slides as Data[];
  } catch {
    // Fallback to mock data if OpenAI fails
    const keywordsText = keywords.join(", ");

    const slides: Data[] = [];

    for (let i = 0; i < numberOfSlides; i++) {
      slides.push({
        title: `AI Slide ${i + 1}: Generated Content`,
        subTitle: `Slide ${i + 1} based on: ${keywordsText}`,
        description: `Slide ${i + 1} content for: ${keywordsText}`,
        ctaText: `Take Action ${i + 1}`,
        highlightedText: keywords[i % keywords.length],
        showBrandMark: false,
      });
    }

    return slides;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = generateAITextSchema.parse(body);
    const { assetType, keywords, numberOfSlides, tempUserId } = validatedData;

    // Get authenticated user (optional)
    const authUser = await getAuthenticatedUser();
    
    let userId: string | undefined;
    if (authUser) {
      userId = authUser.id;
    } else if (tempUserId) {
      userId = tempUserId;
    }

    // Generate content based on asset type
    let generatedContent: Data | Data[];
    let contentString: string;

    if (assetType === "social-carousel") {
      if (!numberOfSlides) {
        return NextResponse.json(
          {
            success: false,
            error: "numberOfSlides is required for carousel assets",
          },
          { status: 400 }
        );
      }

      generatedContent = await generateCarouselContent(
        numberOfSlides,
        keywords
      );
      contentString = JSON.stringify(generatedContent);
    } else {
      generatedContent = await generateSingleContent(assetType, keywords);
      contentString = JSON.stringify(generatedContent);
    }

    // Save to database
    try {
      await createContent({
        userId,
        assetType,
        keywords,
        generatedContent: contentString,
        model: "gpt-4o-2024-08-06",
      });
    } catch {
      // Continue anyway - don't fail the request if DB save fails
      // Database save is optional for this feature
    }

    return NextResponse.json({
      success: true,
      data: generatedContent,
    });
  } catch (error) {
    // Log error for debugging

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
        error: "Failed to generate AI content",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID parameter is required" },
        { status: 400 }
      );
    }

    // Get authenticated user using our auth helper
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get generated content using Drizzle
    const content = await serverDb
      .select()
      .from(generatedContent)
      .where(
        and(
          eq(generatedContent.id, id),
          eq(generatedContent.userId, authUser.id)
        )
      )
      .limit(1);

    if (!content.length) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(content[0].generatedText),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve content" },
      { status: 500 }
    );
  }
}
