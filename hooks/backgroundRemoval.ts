/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef } from "react";

interface UseBackgroundRemovalProps {
  apiKey?: string;
  highQuality?: boolean;
  onSuccess: (processedImageUrl: string) => void;
  onError: (errorMessage: string) => void;
  onProgress?: (
    progressUpdate: number | ((prevProgress: number) => number)
  ) => void;
}

interface BackgroundRemovalHook {
  remove: (imageUrl: string) => Promise<void>;
  isProcessing: boolean;
}

export const useBackgroundRemoval = ({
  apiKey,
  highQuality,
  onSuccess,
  onError,
  onProgress,
}: UseBackgroundRemovalProps): BackgroundRemovalHook => {
  const [isProcessing, setIsProcessing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const remove = useCallback(
    async (imageUrl: string) => {
      if (!imageUrl) {
        onError("No image URL provided for background removal.");
        return;
      }

      // Clean up any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsProcessing(true);
      onProgress?.(0);

      let localProgressInterval: NodeJS.Timeout | null = null;

      try {
        onProgress?.(10);
        localProgressInterval = setInterval(() => {
          onProgress?.((prev) =>
            typeof prev === "number" && prev < 90 ? prev + 5 : 90
          );
        }, 150);

        // Fetch the image with timeout and abort signal
        const imageResponse = await fetch(imageUrl, {
          signal,
          // Adding a cache-busting query parameter to prevent cached responses
          headers: { "Cache-Control": "no-cache" },
        });

        if (!imageResponse.ok) {
          throw new Error(
            `Failed to fetch image for BG removal: ${imageResponse.status} ${imageResponse.statusText}`
          );
        }

        const imageBlob = await imageResponse.blob();
        onProgress?.(30);

        const formData = new FormData();
        formData.append("image", imageBlob);
        const filename = `image-${Date.now()}.${
          imageBlob.type.split("/")[1] || "png"
        }`;
        formData.append("filename", filename);

        if (apiKey) {
          formData.append("apiKey", apiKey);
        }

        if (highQuality !== undefined) {
          formData.append("highQuality", String(highQuality));
        }

        onProgress?.(50);

        // Add timeout for the API request
        const apiTimeout = 30000; // 30 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Background removal API request timed out")),
            apiTimeout
          );
        });

        // Make the API request with abort signal
        const fetchPromise = fetch("/api/remove-background", {
          method: "POST",
          body: formData,
          signal,
        });

        // Race between the API call and the timeout
        const response = (await Promise.race([
          fetchPromise,
          timeoutPromise,
        ])) as Response;
        onProgress?.(80);

        if (!response.ok) {
          let errorDetail = `API Error: ${response.status} ${response.statusText}`;
          try {
            const errorData: any = await response.json();
            errorDetail = errorData.error || errorDetail;
          } catch (e) {
            /* Response not JSON */
            console.warn("Could not parse error response as JSON", e);
          }
          throw new Error(errorDetail);
        }

        const processedImageBlob = await response.blob();
        const dataUrl = URL.createObjectURL(processedImageBlob);

        if (localProgressInterval) clearInterval(localProgressInterval);
        onProgress?.(100);
        onSuccess(dataUrl);
      } catch (err) {
        if (localProgressInterval) clearInterval(localProgressInterval);

        // Don't report errors if request was intentionally aborted
        if (signal.aborted) {
          return;
        }

        console.error("Background removal error:", err);
        onError(
          err instanceof Error ? err.message : "Unknown BG removal error"
        );
      } finally {
        setIsProcessing(false);
        abortControllerRef.current = null;
      }
    },
    [apiKey, highQuality, onSuccess, onError, onProgress]
  );

  return { remove, isProcessing };
};
