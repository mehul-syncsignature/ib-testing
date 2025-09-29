// lib/aws-s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Create S3 client instance
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface SignedUrlOptions {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds, default 300 (5 minutes)
}

export interface SignedUrlResponse {
  signedUrl: string;
  key: string;
  publicUrl: string;
}

/**
 * Fetches AWS asset URL based on environment
 * @param key Asset key/filename without extension
 * @param extension File extension (e.g., 'svg', 'png', 'jpg')
 * @returns Environment-appropriate AWS asset URL
 */
export const fetchAwsAsset = (key: string, extension?: string): string => {
  const domain =
    process.env.NEXT_PUBLIC_NODE_ENV !== "production"
      ? "assets.dev.instantbranding.ai"
      : "assets.instantbranding.ai";
  if (key && extension) return `https://${domain}/${key}.${extension}`;
  else if (key) return `https://${domain}/${key}`;
  else return "";
};

/**
 * Generate a signed URL for uploading files to S3
 * @param options - Configuration for the signed URL
 * @returns Promise with signed URL and metadata
 */
export async function generateSignedUrl(
  options: SignedUrlOptions
): Promise<SignedUrlResponse> {
  const { key, contentType, expiresIn = 300 } = options;
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  // Validate required environment variables
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is required");
  }

  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION environment variable is required");
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are required");
  }

  try {
    // Create the command for PUT operation
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
    });

    // Generate the signed URL
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn,
    });

    // Construct the public URL (without query parameters)
    const publicUrl = fetchAwsAsset(key);

    return {
      signedUrl,
      key,
      publicUrl,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(
      `Failed to generate signed URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generate a user-specific S3 key for file uploads
 * @param userId - The user's ID
 * @param filename - Original filename
 * @returns Formatted S3 key
 */
export function generateUserAssetKey(userId: string, filename: string): string {
  // Add timestamp to prevent filename conflicts
  const timestamp = Date.now();

  // Clean the filename to ensure it's URL-safe
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

  return `user-assets/${userId}/${timestamp}-${cleanFilename}`;
}

/**
 * Validate file type for uploads (images and PDFs)
 * @param contentType - MIME type of the file
 * @returns boolean indicating if file type is allowed
 */
export function isValidImageType(contentType: string): boolean {
  const allowedTypes = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "image/webp",
    "application/pdf"  // Allow PDF files for carousel exports
  ];

  return allowedTypes.includes(contentType.toLowerCase());
}

/**
 * Validate file size for uploads
 * @param fileSize - Size of the file in bytes
 * @param maxSize - Maximum allowed size in bytes (default 10MB)
 * @returns boolean indicating if file size is acceptable
 */
export function isValidFileSize(
  fileSize: number,
  maxSize: number = 10 * 1024 * 1024
): boolean {
  return fileSize <= maxSize && fileSize > 0;
}

export { s3Client };
