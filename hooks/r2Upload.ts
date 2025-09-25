// hooks/useR2Upload.ts
import { useState } from "react";
import axios from "axios";

interface R2SignedUrlResponse {
  signedUrl: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}

interface R2ApiResponse {
  success: boolean;
  data?: R2SignedUrlResponse;
  error?: string;
  details?: string;
}

interface UseR2UploadProps {
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (publicUrl: string) => void;
  // eslint-disable-next-line no-unused-vars
  onError?: (errorMessage: string) => void;
  // eslint-disable-next-line no-unused-vars
  onProgress?: (progress: number) => void;
}

interface R2UploadHook {
  // eslint-disable-next-line no-unused-vars
  uploadToR2: (file: File, filename?: string) => Promise<string>;
  loading: boolean;
  error: Error | null;
  progress: number;
}

export const useR2Upload = ({
  onSuccess,
  onError,
  onProgress,
}: UseR2UploadProps = {}): R2UploadHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadToR2 = async (file: File, filename?: string): Promise<string> => {
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

      // Step 1: Get signed URL from our R2 API
      const signedUrlResponse = await axios.post<R2ApiResponse>(
        "/api/upload/r2-signed-url",
        {
          filename: uploadFilename,
          contentType: file.type,
          fileSize: file.size,
          expiresIn: 300, // 5 minutes
        }
      );

      if (!signedUrlResponse.data.success || !signedUrlResponse.data.data) {
        throw new Error(
          signedUrlResponse.data.error || "Failed to get R2 signed URL"
        );
      }

      const { signedUrl, publicUrl } = signedUrlResponse.data.data;

      onProgress?.(30);
      setProgress(30);

      // Step 2: Upload file directly to R2 using signed URL
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
          : "Unknown error occurred during R2 upload";

      // eslint-disable-next-line no-console
      console.error("R2 upload error:", err);

      const error = new Error(errorMessage);
      setError(error);
      onError?.(errorMessage);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadToR2,
    loading,
    error,
    progress,
  };
};

// Re-export utility functions from useS3Upload for consistency
export { blobUrlToFile, detectMimeTypeFromBlob } from "./s3Upload";