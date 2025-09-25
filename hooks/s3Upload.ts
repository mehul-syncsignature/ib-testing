// hooks/useS3Upload.ts
import { useState } from "react";
import axios from "axios";

interface SignedUrlResponse {
  signedUrl: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}

interface ApiResponse {
  success: boolean;
  data?: SignedUrlResponse;
  error?: string;
  details?: string;
}

interface UseS3UploadProps {
  onSuccess?: (publicUrl: string) => void;
  onError?: (errorMessage: string) => void;
  onProgress?: (progress: number) => void;
}

interface S3UploadHook {
  uploadToS3: (file: File, filename?: string) => Promise<string>;
  loading: boolean;
  error: Error | null;
  progress: number;
}

export const useS3Upload = ({
  onSuccess,
  onError,
  onProgress,
}: UseS3UploadProps = {}): S3UploadHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadToS3 = async (file: File, filename?: string): Promise<string> => {
    if (!file) {
      const errorMsg = "No file provided for upload";
      setError(new Error(errorMsg));
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Use provided filename or file.name
      const uploadFilename = filename || file.name;

      onProgress?.(10);
      setProgress(10);

      // Step 1: Get signed URL from our API
      const signedUrlResponse = await axios.post<ApiResponse>(
        "/api/upload/signed-url",
        {
          filename: uploadFilename,
          contentType: file.type,
          fileSize: file.size,
          expiresIn: 300, // 5 minutes
        }
      );

      if (!signedUrlResponse.data.success || !signedUrlResponse.data.data) {
        throw new Error(
          signedUrlResponse.data.error || "Failed to get signed URL"
        );
      }

      const { signedUrl, publicUrl } = signedUrlResponse.data.data;

      onProgress?.(30);
      setProgress(30);

      // Step 2: Upload file directly to S3 using signed URL
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // Map upload progress to 30-90% range
            const uploadProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 60 + 30
            );
            onProgress?.(uploadProgress);
            setProgress(uploadProgress);
          }
        },
      });

      onProgress?.(100);
      setProgress(100);

      // Success callback
      onSuccess?.(publicUrl);

      return publicUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unknown error occurred during upload";

      console.error("S3 upload error:", err);

      const error = new Error(errorMessage);
      setError(error);
      onError?.(errorMessage);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadToS3,
    loading,
    error,
    progress,
  };
};

// Utility function to convert blob URL to File
export const blobUrlToFile = async (
  blobUrl: string,
  filename: string,
  mimeType: string = "image/png"
): Promise<File> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    throw new Error(
      `Failed to convert blob URL to file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Utility function to detect file type from blob URL
export const detectMimeTypeFromBlob = async (
  blobUrl: string
): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return blob.type || "image/png";
  } catch (error) {
    console.warn("Could not detect MIME type, defaulting to image/png:", error);
    return "image/png";
  }
};
