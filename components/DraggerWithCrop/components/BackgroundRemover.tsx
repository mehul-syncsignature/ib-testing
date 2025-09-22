"use client";

import React, { useState, useEffect } from "react";
import { BackgroundRemoverProps, ErrorResponse } from "../types";

const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({
  imageUrl,
  onProcessed,
  onError,
  apiKey,
}) => {
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const removeBackground = async () => {
      if (!imageUrl) return;

      setProcessingStatus("processing");
      setProgress(10);

      try {
        // Fetch the image as a blob
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        setProgress(30);

        // Create a FormData object
        const formData = new FormData();
        formData.append("image", imageBlob);

        // Add filename to help the API
        const filename = `image-${Date.now()}.png`;
        formData.append("filename", filename);

        // Add API key if provided
        if (apiKey) {
          formData.append("apiKey", apiKey);
        }

        setProgress(50);

        // Call the API
        const response = await fetch("/api/remove-background", {
          method: "POST",
          body: formData,
          headers: {
            // No need to set Content-Type as it will be set automatically for FormData
          },
        });

        setProgress(80);

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponse;
          throw new Error(errorData.error || "Failed to remove background");
        }

        // Get the processed image
        const processedImageBlob = await response.blob();
        const dataUrl = URL.createObjectURL(processedImageBlob);

        setProgress(100);
        setProcessingStatus("complete");
        onProcessed(dataUrl);
      } catch (error) {
        setProcessingStatus("error");
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    };

    removeBackground();
  }, [imageUrl, onProcessed, onError, apiKey]);

  return (
    <div className="w-full">
      {processingStatus === "processing" && (
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Removing background...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {processingStatus === "error" && (
        <div className="text-red-500 text-sm mt-2">
          There was an error processing your image. Please try again.
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
