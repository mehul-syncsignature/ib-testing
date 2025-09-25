// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { posts } from "@/lib/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    // Build where conditions
    const whereConditions = [eq(posts.userId, user.id)];
    if (brandId) {
      whereConditions.push(eq(posts.brandId, brandId));
    }

    const postData = await serverDb
      .select()
      .from(posts)
      .where(and(...whereConditions))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json({
      success: true,
      data: postData || [],
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
