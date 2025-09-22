import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { brands } from "@/lib/drizzle/schema";
// Remove unused eq import
import { Brand } from "@/contexts/BrandContext/types";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Parse request body
    const body = await request.json();
    const { brand } = body as { brand: Brand };

    if (!brand) {
      return NextResponse.json(
        { success: false, error: "Brand data is required" },
        { status: 400 }
      );
    }

    // Create or update the brand for the user using User.id directly
    const brandResult = await serverDb
      .insert(brands)
      .values({
        name: brand.name || "My Brand", // Use 'name' consistently
        config: brand.config || {},
        socialLinks: brand.socialLinks || {},
        brandImages: brand.brandImages || [],
        infoQuestions: brand.infoQuestions || {},
        brandMark: brand.brandMark || {},
        userId: user.id,
      })
      .returning();

    if (!brandResult.length) {
      return NextResponse.json(
        { success: false, error: "Failed to create brand" },
        { status: 500 }
      );
    }

    // Transform the result to match the expected Brand interface
    const createdBrand = brandResult[0];
    const transformedBrand = {
      id: createdBrand.id,
      name: createdBrand.name, // Use 'name' consistently
      config: createdBrand.config,
      social_links: createdBrand.socialLinks, // Transform to snake_case for API consistency
      brand_images: createdBrand.brandImages, 
      info_questions: createdBrand.infoQuestions,
      brand_mark: createdBrand.brandMark,
      user_id: createdBrand.userId, // Transform to snake_case for API consistency
      created_at: createdBrand.createdAt,
      updated_at: createdBrand.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "User dependencies handled successfully",
      data: {
        brand: transformedBrand,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
