//app/api/brands/upsert-brand/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { brands } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Brand validation schema
const brandSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Brand name is required"), // Accept 'name' from frontend
  config: z.record(z.any()).default({}),
  social_links: z.record(z.any()).default({}), // Accept snake_case from frontend
  brand_images: z.array(z.string()).default([]), // Accept snake_case from frontend
  info_questions: z.record(z.any()).default({}), // Accept snake_case from frontend
  brand_mark: z.record(z.any()).default({}), // Accept snake_case from frontend
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate request body
    const validatedData = brandSchema.parse(body);

    // Use User.id directly for brand operations
    let data;
    let action: "created" | "updated";

    if (validatedData.id) {
      // UPDATE existing brand
      const updateResult = await serverDb
        .update(brands)
        .set({
          name: validatedData.name, // Use 'name' consistently
          config: validatedData.config,
          socialLinks: validatedData.social_links, // Map from snake_case
          brandImages: validatedData.brand_images, // Map from snake_case
          infoQuestions: validatedData.info_questions, // Map from snake_case
          brandMark: validatedData.brand_mark, // Map from snake_case
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(brands.id, validatedData.id),
            eq(brands.userId, user.id) // Ensure user owns the brand
          )
        )
        .returning();

      if (!updateResult.length) {
        return NextResponse.json(
          { success: false, error: "Brand not found or access denied" },
          { status: 404 }
        );
      }

      data = updateResult[0];
      action = "updated";
    } else {
      // CREATE new brand
      const createResult = await serverDb
        .insert(brands)
        .values({
          name: validatedData.name, // Use 'name' consistently
          config: validatedData.config,
          socialLinks: validatedData.social_links, // Map from snake_case
          brandImages: validatedData.brand_images, // Map from snake_case
          infoQuestions: validatedData.info_questions, // Map from snake_case
          brandMark: validatedData.brand_mark, // Map from snake_case
          userId: user.id,
        })
        .returning();

      data = createResult[0];
      action = "created";
    }

    return NextResponse.json({
      success: true,
      data,
      action,
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

    return handleAuthError(error);
  }
}
