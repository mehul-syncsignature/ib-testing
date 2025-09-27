// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { posts } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = (await request.json()) as {
      content?: string;
      imageUrl?: string;
      pdfUrl?: string;
      designId?: string;
    };

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists and belongs to user
    const existingPost = await serverDb
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
      .limit(1);

    if (!existingPost.length) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Update the post
    const updatedPost = await serverDb
      .update(posts)
      .set({
        content: body.content,
        imageUrl: body.imageUrl,
        pdfUrl: body.pdfUrl,
        designId: body.designId,
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedPost[0],
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
