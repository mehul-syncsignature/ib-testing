// app/api/designs/delete-design/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { designs } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await request.json()) as { designId: string };

    if (!body?.designId) {
      return NextResponse.json(
        { success: false, error: "Design ID is required" },
        { status: 400 }
      );
    }

    // Delete design from database - ensure user owns the design
    const deleteResult = await serverDb
      .delete(designs)
      .where(
        and(
          eq(designs.id, body.designId),
          eq(designs.userId, user.id) // Ensure user owns the design
        )
      )
      .returning({ id: designs.id });

    if (!deleteResult.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Design not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      designId: body.designId,
      message: "Design deleted successfully",
    });
  } catch (error) {
    return handleAuthError(error);
  }
}