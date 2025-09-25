// app/api/posts/generate-hooks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

// Request validation schema
const generateHooksSchema = z.object({
  input: z.string().min(1, "Input is required"),
});

// Response interface
interface Hook {
  id: number;
  hook: string;
}

// Detect if input is a URL
function isUrl(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

// Generate hooks using OpenAI
async function generateHooks(input: string): Promise<Hook[]> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const isInputUrl = isUrl(input);

    const systemPrompt = `You are an expert social media content strategist and copywriter specializing in creating compelling hooks for LinkedIn and social media posts.

Your task is to generate 4 different engaging hooks based on the provided content. Each hook should:
- Be attention-grabbing and scroll-stopping
- Appeal to a professional LinkedIn audience
- Be concise and punchy (1-2 sentences max)
- Use different angles/approaches (question, statistic, bold statement, story starter, etc.)
- Drive engagement and encourage clicks/reads
- Be authentic and valuable, not clickbait

Hook Types to Mix:
1. Question Hook - Start with an intriguing question
2. Statement Hook - Bold, controversial, or surprising statement
3. Story Hook - Begin a compelling narrative
4. Statistic/Number Hook - Lead with surprising data or numbers

Make each hook unique and compelling while staying relevant to the content.`;

    const userPrompt = isInputUrl
      ? `Generate 4 engaging social media hooks based on this ${
          input.includes("youtube") ? "YouTube video" : "blog post/article"
        }: ${input}

Create hooks that would make people want to click and engage with content related to this link.`
      : `Generate 4 engaging social media hooks based on this content: ${input}

Create hooks that capture the essence of this content and make people want to read more.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "hooks_response",
          schema: {
            type: "object",
            properties: {
              hooks: {
                type: "array",
                items: {
                  type: "string",
                  maxLength: 200,
                },
                minItems: 4,
                maxItems: 4,
              },
            },
            required: ["hooks"],
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
    const hooks: Hook[] = parsedResponse.hooks.map(
      (hook: string, index: number) => ({
        id: index + 1,
        hook: hook.trim(),
      })
    );

    return hooks;
  } catch {
    // Fallback hooks if OpenAI fails
    const fallbackHooks: Hook[] = [
      {
        id: 1,
        hook: "What if I told you there's a simple way to transform your content strategy?",
      },
      {
        id: 2,
        hook: "Most people don't realize this one thing about content creation...",
      },
      {
        id: 3,
        hook: "Here's the story that changed everything about how I approach content.",
      },
      {
        id: 4,
        hook: "The data shows 90% of content creators are missing this crucial element.",
      },
    ];

    return fallbackHooks;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = generateHooksSchema.parse(body);
    const { input } = validatedData;

    // Generate hooks
    const hooks = await generateHooks(input);

    return NextResponse.json({
      success: true,
      data: hooks,
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

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate hooks",
      },
      { status: 500 }
    );
  }
}
