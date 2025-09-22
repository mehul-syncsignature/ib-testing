/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useApi from "@/lib/api";
import {
  Data,
  AssetTypeKeys,
  CarouselSlide,
} from "@/contexts/AssetContext/types";
import { useAssetContext } from "@/contexts/AssetContext";
import { useUnifiedDataConfig } from "./useUnifiedDataConfig";

export interface GenerateAIContentRequest {
  assetType: AssetTypeKeys;
  keywords: string[];
  numberOfSlides?: number; // Only for carousel
  tempUserId?: string;
}

export interface GenerateAIContentResponse {
  success: boolean;
  data?: Data | Data[]; // Single Data for regular assets, Data[] for carousel
  error?: string;
  details?: any;
}

export interface GetAIContentResponse {
  success: boolean;
  data?: Data | Data[];
  error?: string;
}

export const useAIContentGeneration = () => {
  const api = useApi();
  const { setData } = useUnifiedDataConfig();
  const {
    state: { currentAssetType },
    setSlides,
  } = useAssetContext();

  const [generatedContent, setGeneratedContent] = useState<
    Data | Data[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const generateAIContent = async (request: GenerateAIContentRequest) => {
    setLoading(true);
    setHookError(null);
    setGeneratedContent(null);

    try {
      if (!request.keywords.length) {
        throw new Error("At least one keyword is required");
      }

      if (request.assetType === "social-carousel" && !request.numberOfSlides) {
        throw new Error("Number of slides is required for carousel assets");
      }

      const requestData: GenerateAIContentRequest = {
        assetType: request.assetType,
        keywords: request.keywords.filter((k) => k.trim()),
        numberOfSlides: request.numberOfSlides,
      };

      // Make API call
      const response: GenerateAIContentResponse = await api.post(
        "/generate-ai-text",
        requestData
      );

      if (response.success && response.data) {
        setGeneratedContent(response.data);

        // Update the current asset's data based on type
        if (request.assetType === "social-carousel") {
          // For carousel, response.data should be Data[]
          const slidesData = response.data as Data[];

          // Create carousel slides with generated data
          const newSlides: CarouselSlide[] = slidesData.map(
            (slideData, index) => ({
              id: `slide-${index}`,
              templateId: "1", // Default template ID
              data: slideData,
            })
          );

          // Update the slides in context
          setSlides(newSlides);
        } else {
          // For regular assets, response.data should be Data
          const singleData = response.data as Data;

          // Update the current asset's data config
          setData(singleData);
        }

        return response.data;
      } else {
        throw new Error(response.error || "Failed to generate AI content");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to generate AI content");
      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const getAIContent = async (id: string) => {
    setLoading(true);
    setHookError(null);

    try {
      const response: GetAIContentResponse = await api.get(
        `/generate-ai-text?id=${id}`
      );

      if (response.success && response.data) {
        setGeneratedContent(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to retrieve AI content");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to retrieve AI content");
      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const applyGeneratedContent = () => {
    if (!generatedContent) {
      throw new Error("No generated content to apply");
    }

    // Apply the content based on current asset type
    if (currentAssetType === "social-carousel") {
      // For carousel, apply as slides
      const slidesData = generatedContent as Data[];
      const newSlides: CarouselSlide[] = slidesData.map((slideData, index) => ({
        id: `slide-${index}`,
        templateId: "1", // Default template ID
        data: slideData,
      }));
      setSlides(newSlides);
    } else {
      // For regular assets, apply as single data
      const singleData = generatedContent as Data;
      setData(singleData);
    }
  };

  const clearContent = () => {
    setGeneratedContent(null);
    setHookError(null);
  };

  return {
    generateAIContent,
    getAIContent,
    applyGeneratedContent,
    clearContent,
    data: generatedContent,
    loading,
    error,
    isCarousel: currentAssetType === "social-carousel",
    currentAssetType,
  } as const;
};

// Legacy export for backward compatibility
export const useAIContentGenerationLegacy = () => {
  const { generateAIContent, data, loading, error } = useAIContentGeneration();
  return [generateAIContent, { data, loading, error }] as const;
};
