// app/api/brands/[brandId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { brands } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Schema for validating update request
const updateBrandSchema = z.object({
  name: z.string().min(1).optional(),
  config: z.record(z.any()).optional(),
  socialLinks: z.record(z.any()).optional(),
  brandImages: z.array(z.string()).optional(),
  infoQuestions: z.record(z.any()).optional(),
  brandMark: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: "Brand ID is missing from the URL" },
        { status: 400 }
      );
    }

    // Fetch brand ensuring user owns it
    const brandData = await serverDb
      .select()
      .from(brands)
      .where(
        and(
          eq(brands.id, brandId),
          eq(brands.userId, user.id) // Ensure user owns the brand
        )
      )
      .limit(1);

    if (!brandData.length) {
      return NextResponse.json(
        { success: false, error: "Brand not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: brandData[0],
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: "Brand ID is missing from the URL" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const brandData = updateBrandSchema.parse(body);

    if (!brandData || Object.keys(brandData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: Partial<typeof brands.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (brandData.name !== undefined) {
      updateData.name = brandData.name;
    }
    if (brandData.config !== undefined) {
      updateData.config = brandData.config;
    }
    if (brandData.socialLinks !== undefined) {
      updateData.socialLinks = brandData.socialLinks;
    }
    if (brandData.brandImages !== undefined) {
      updateData.brandImages = brandData.brandImages;
    }
    if (brandData.infoQuestions !== undefined) {
      updateData.infoQuestions = brandData.infoQuestions;
    }
    if (brandData.brandMark !== undefined) {
      updateData.brandMark = brandData.brandMark;
    }

    // Update brand in database - ensure user owns it
    const updatedBrand = await serverDb
      .update(brands)
      .set(updateData)
      .where(
        and(
          eq(brands.id, brandId),
          eq(brands.userId, user.id) // Ensure user owns the brand
        )
      )
      .returning();

    if (!updatedBrand.length) {
      return NextResponse.json(
        { success: false, error: "Brand not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBrand[0],
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
