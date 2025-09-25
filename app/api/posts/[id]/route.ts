// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { posts } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const postData = await serverDb
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
      .limit(1);

    if (!postData.length) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: postData[0],
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
