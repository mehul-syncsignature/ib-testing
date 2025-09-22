// lib/cloudflare-r2.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Create R2 client instance (R2 is S3-compatible)
const r2Client = new S3Client({
  region: "auto", // R2 uses 'auto' as region
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export interface R2SignedUrlOptions {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds, default 300 (5 minutes)
}

export interface R2SignedUrlResponse {
  signedUrl: string;
  key: string;
  publicUrl: string;
}

/**
 * Fetches R2 asset URL based on environment
 * @param key Asset key/filename without extension
 * @param extension File extension (e.g., 'svg', 'png', 'jpg')
 * @returns Environment-appropriate R2 asset URL
 */
export const fetchR2Asset = (key: string, extension?: string): string => {
  // Use custom domain if provided, otherwise use R2 public URL
  let domain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 
    `${process.env.CLOUDFLARE_R2_BUCKET_NAME}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  
  // Remove https:// prefix if it's already included in the domain
  if (domain.startsWith('https://')) {
    domain = domain.replace('https://', '');
  }
  
  if (key && extension) return `https://${domain}/${key}.${extension}`;
  else if (key) return `https://${domain}/${key}`;
  else return "";
};

/**
 * Generate a signed URL for uploading files to Cloudflare R2
 * @param options - Configuration for the signed URL
 * @returns Promise with signed URL and metadata
 */
export async function generateR2SignedUrl(
  options: R2SignedUrlOptions
): Promise<R2SignedUrlResponse> {
  const { key, contentType, expiresIn = 300 } = options;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

  // Validate required environment variables
  if (!bucketName) {
    throw new Error("CLOUDFLARE_R2_BUCKET_NAME environment variable is required");
  }

  if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    throw new Error("CLOUDFLARE_R2_ACCOUNT_ID environment variable is required");
  }

  if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    throw new Error("Cloudflare R2 credentials are required");
  }

  try {
    // Create the command for PUT operation
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      // Note: R2 doesn't support ACL in the same way as S3, but it can be configured at bucket level
    });

    // Generate the signed URL
    const signedUrl = await getSignedUrl(r2Client, putObjectCommand, {
      expiresIn,
    });

    // Construct the public URL (without query parameters)
    const publicUrl = fetchR2Asset(key);

    return {
      signedUrl,
      key,
      publicUrl,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating R2 signed URL:", error);
    throw new Error(
      `Failed to generate R2 signed URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generate a user-specific R2 key for file uploads
 * @param userId - The user's ID
 * @param filename - Original filename
 * @returns Formatted R2 key
 */
export function generateUserAssetKeyR2(userId: string, filename: string): string {
  // Add timestamp to prevent filename conflicts
  const timestamp = Date.now();

  // Clean the filename to ensure it's URL-safe
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

  return `user-assets/${userId}/${timestamp}-${cleanFilename}`;
}

// Re-export validation functions from aws-s3.ts to maintain consistency
export { isValidImageType, isValidFileSize } from "./aws-s3";

export { r2Client };