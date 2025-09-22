// app/api/designs/route.ts
import { NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { designs } from "@/lib/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireAuth();

    // Fetch designs for the authenticated user using their User.id directly
    const designData = await serverDb
      .select()
      .from(designs)
      .where(eq(designs.userId, user.id))
      .orderBy(desc(designs.createdAt));

    return NextResponse.json({
      success: true,
      data: designData || [],
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
