// app/api/auth/debug/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { serverDb } from "@/lib/drizzle/server";
import { users, nextAuthUsers } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get current session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        session: null,
        error: "No session found"
      });
    }

    // Check NextAuth user table
    const nextAuthUser = await serverDb
      .select()
      .from(nextAuthUsers)
      .where(eq(nextAuthUsers.id, session.user.id))
      .limit(1);

    // Check custom users table
    const customUser = await serverDb
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    // Also check by email
    const customUserByEmail = session.user.email 
      ? await serverDb
          .select()
          .from(users)
          .where(eq(users.email, session.user.email))
          .limit(1)
      : [];

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      nextAuthUser: nextAuthUser.length ? nextAuthUser[0] : null,
      customUser: customUser.length ? customUser[0] : null,
      customUserByEmail: customUserByEmail.length ? customUserByEmail[0] : null,
      mismatch: customUser.length && customUserByEmail.length 
        ? customUser[0].id !== customUserByEmail[0].id 
        : false,
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}