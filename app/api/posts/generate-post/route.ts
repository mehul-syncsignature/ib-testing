import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { serverDb } from "@/lib/drizzle/server";
import { posts } from "@/lib/drizzle/schema";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";

// 1. Request validation schema
const generatePostSchema = z.object({
  hook: z.string().min(1, "Hook is required"),
  brandId: z.string().uuid("Invalid brand ID"),
});

// 2. Main function to generate the post using OpenAI
async function generatePost(hook: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = `You are an expert LinkedIn copywriter and social media strategist.

Your task is to expand the provided hook into a complete, engaging LinkedIn post. The final post should:
- Be written in a professional yet conversational tone.
- Be well-structured with short paragraphs and line breaks for easy readability on mobile.
- Be around 150-250 words.
- Conclude with a clear Call-To-Action (CTA) to encourage comments and engagement (e.g., "What's your take on this?", "Share your experience below.").
- Include 3-5 relevant and popular hashtags at the end.
- Stay on topic and elaborate on the promise of the initial hook.
- DO NOT use emojis.`;

  const userPrompt = `Expand this hook into a full LinkedIn post: "${hook}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    // 3. Define the expected JSON output shape for reliable parsing
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "linkedin_post_response",
        schema: {
          type: "object",
          properties: {
            post: {
              type: "string",
              description: "The fully generated LinkedIn post content.",
            },
          },
          required: ["post"],
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

  const parsedResponse = JSON.parse(content);
  return parsedResponse.post.trim();
}

// 4. The POST request handler for the API endpoint
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validatedData = generatePostSchema.parse(body);
    const { hook, brandId } = validatedData;

    // Generate the post content
    const postContent = await generatePost(hook);

    // Save the generated post to the database
    const [newPost] = await serverDb
      .insert(posts)
      .values({
        userId: user.id,
        brandId,
        content: postContent,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newPost, // Return the full post object
    });
  } catch (error) {
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

    // Handle authentication errors
    const authError = handleAuthError(error);
    if (authError) {
      return authError;
    }

    // Log the actual error for debugging on the server
    console.error("Error generating post:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An internal error occurred while generating the post.",
      },
      { status: 500 }
    );
  }
}
