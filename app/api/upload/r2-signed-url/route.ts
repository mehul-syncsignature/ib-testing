// app/api/upload/r2-signed-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleAuthError } from "@/lib/auth-helpers";
import {
  generateR2SignedUrl,
  generateUserAssetKeyR2,
  isValidImageType,
  isValidFileSize,
} from "@/lib/cloudflare-r2";

interface R2SignedUrlRequest {
  filename: string;
  contentType: string;
  fileSize?: number;
  expiresIn?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: R2SignedUrlRequest = await request.json();
    const { filename, contentType, fileSize, expiresIn = 300 } = body;

    // Validate required fields
    if (!filename || !contentType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: filename and contentType",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidImageType(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Only JPEG, PNG, WebP images and PDF files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size if provided
    if (fileSize && !isValidFileSize(fileSize)) {
      return NextResponse.json(
        {
          success: false,
          error: "File size too large. Maximum allowed size is 10MB.",
        },
        { status: 400 }
      );
    }

    // Get authenticated user
    const user = await requireAuth();

    // Generate user-specific R2 key
    const r2Key = generateUserAssetKeyR2(user.id, filename);

    // Generate signed URL
    const signedUrlResponse = await generateR2SignedUrl({
      key: r2Key,
      contentType,
      expiresIn,
    });

    return NextResponse.json({
      success: true,
      data: {
        signedUrl: signedUrlResponse.signedUrl,
        key: signedUrlResponse.key,
        publicUrl: signedUrlResponse.publicUrl,
        expiresIn,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}