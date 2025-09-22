import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { brands } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await request.json()) as { brandId: string };

    if (!body?.brandId) {
      return NextResponse.json(
        { success: false, error: "Brand ID is required" },
        { status: 400 }
      );
    }

    // Delete brand from database - ensure user owns the brand
    const deleteResult = await serverDb
      .delete(brands)
      .where(
        and(
          eq(brands.id, body.brandId),
          eq(brands.userId, user.id) // Ensure user owns the brand
        )
      )
      .returning({ id: brands.id });

    if (!deleteResult.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Brand not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brandId: body.brandId,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
