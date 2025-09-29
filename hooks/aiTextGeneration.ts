// hooks/useAITextGeneration.ts - Updated types to match new structure
import { useState } from "react";
import useApi from "@/lib/api";
import { v4 as uuid } from "uuid";
import { useAppContext } from "@/contexts/AppContext";

// Types for the asset variants with generic slot names - match exact requirements
export interface TopBanner {
  title: string;
  description: string;
  ctaText: string;
  highlightedText: string;
}

export interface LeftCard {
  title: string;
  subTitle: string;
  highlightedText: string;
}

export interface RightCard {
  title: string;
  subTitle: string;
  description: string;
  highlightedText: string;
}

export interface SmallPost1 {
  title: string;
  description: string;
}

export interface SmallPost2 {
  title: string;
  description: string;
}

export interface BigPost {
  title: string;
}

export interface MiniPost1 {
  title: string;
  description: string;
}

export interface MiniPost2 {
  title: string;
  description: string;
}

export interface AssetVariant {
  topBanner: TopBanner;
  leftCard: LeftCard;
  rightCard: RightCard;
  smallPost1: SmallPost1;
  smallPost2: SmallPost2;
  bigPost: BigPost;
  miniPost1: MiniPost1;
  miniPost2: MiniPost2;
}

export interface GeneratedAssetVariants {
  id: string;
  whatDoYouOffer?: string;
  whoDoYouHelp?: string;
  keywords?: string[];
  promptType: string;
  createdAt: string;
  model?: string;
  assetVariants: [AssetVariant, AssetVariant, AssetVariant];
}

export interface GenerateAssetsRequest {
  whatDoYouOffer: string;
  whoDoYouHelp: string;
  promptType: "asset-variants";
  tempUserId?: string;
}

export interface GenerateAssetsResponse {
  success: boolean;
  data?: GeneratedAssetVariants;
  error?: string;
}

export interface GetFirstGeneratedResponse {
  success: boolean;
  data?: GeneratedAssetVariants | null;
  message?: string;
  error?: string;
}

// Custom hook for AI asset variants generation using questions
export const useGenerateAssetVariants = () => {
  const api = useApi();
  const { state: { isSignedIn } } = useAppContext();
  const [generatedVariants, setGeneratedVariants] =
    useState<GeneratedAssetVariants | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const generateAssetVariants = async (request: GenerateAssetsRequest) => {
    // Check authentication first
    if (!isSignedIn) {
      const authError = new Error("Authentication required. Please sign up to use AI features.");
      setHookError(authError);
      throw authError;
    }

    setLoading(true);
    setHookError(null);
    setGeneratedVariants(null);

    try {
      // Validate input
      if (!request.whatDoYouOffer.trim() || !request.whoDoYouHelp.trim()) {
        throw new Error("Both questions must be answered");
      }

      const tempUserId = uuid();

      const requestData: GenerateAssetsRequest = {
        whatDoYouOffer: request.whatDoYouOffer.trim(),
        whoDoYouHelp: request.whoDoYouHelp.trim(),
        promptType: "asset-variants" as const,
        tempUserId, // Include tempUserId in the request
      };

      // Use the existing useApi hook to make the request
      const response: GenerateAssetsResponse = await api.post(
        "/generate-text",
        requestData
      );

      if (response.success && response.data) {
        setGeneratedVariants(response.data);
        localStorage.setItem("tempUserId", tempUserId);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to generate asset variants");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error("Failed to generate asset variants");
      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const getFirstGeneratedContent = async (id: string | null) => {
    setLoading(true);
    setHookError(null);

    try {
      const response: GetFirstGeneratedResponse = await api.get(
        `/generate-text?id=${id}`
      );

      if (response.success) {
        if (response.data) {
          setGeneratedVariants(response.data);
          return response.data;
        } else {
          setGeneratedVariants(null);
          return null;
        }
      } else {
        throw new Error(response.error || "Failed to fetch generated content");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error("Failed to fetch generated content");
      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateAssetVariants,
    getFirstGeneratedContent,
    data: generatedVariants,
    loading,
    error,
    clearData: () => {
      setGeneratedVariants(null);
      setHookError(null);
    },
  } as const;
};
