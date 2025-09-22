// app/api/brands/route.ts
import { NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { brands } from "@/lib/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireAuth();

    // Fetch brands for the authenticated user using their User.id directly
    const brandData = await serverDb
      .select()
      .from(brands)
      .where(eq(brands.userId, user.id))
      .orderBy(desc(brands.createdAt));

    return NextResponse.json({
      success: true,
      data: brandData || [],
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
