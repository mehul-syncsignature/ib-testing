/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required for password reset" },
        { status: 401 }
      );
    }

    // For NextAuth, password updates should be handled through the provider
    // This endpoint is now deprecated since we're using NextAuth
    return NextResponse.json(
      {
        error:
          "Password reset is handled through your authentication provider. Please use the forgot password link in the sign-in page.",
      },
      { status: 400 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
