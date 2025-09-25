// hooks/useUnifiedDataConfig.ts

import { useAssetContext } from "@/contexts/AssetContext";
import { Data } from "@/contexts/AssetContext/types";
import { fetchAwsAsset } from "@/lib/aws-s3";

/**
 * Simplified unified hook that handles both regular assets and carousel slides
 * Routes data updates to the correct place based on current asset type
 */
export const useUnifiedDataConfig = () => {
  const {
    state: { currentAssetType, dataConfig, currentSlideIndex, slides },
    setDataConfig,
    setSlideData,
  } = useAssetContext();

  const isCarousel = currentAssetType === "social-carousel";

  // Get current data based on asset type
  const getCurrentData = (): Data => {
    if (isCarousel && slides[currentSlideIndex]) {
      return slides[currentSlideIndex].data;
    }
    return dataConfig;
  };

  // Unified update function that routes to correct place
  const updateData = (updates: Partial<Data>) => {
    if (isCarousel) {
      setSlideData(currentSlideIndex, updates);
    } else {
      setDataConfig(updates);
    }
  };

  // Individual field updaters (for backward compatibility)
  const updateTitle = (title: string) => updateData({ title });
  const updateSubTitle = (subTitle: string) => updateData({ subTitle });
  const updateDescription = (description: string) =>
    updateData({ description });
  const updateImageUrl = (imageUrl: string) => updateData({ imageUrl });
  const updateImageAlt = (imageAlt: string) => updateData({ imageAlt });
  const updateCtaText = (ctaText: string) => updateData({ ctaText });
  const updateHighlightedText = (highlightedText: string) =>
    updateData({ highlightedText });
  const updateScreenshotUrl = (screenshotUrl: string) =>
    updateData({ screenshotUrl });

  // Default data for reset
  const defaultData: Data = {
    description:
      "Your all-in-one personal brand OS — from strategy to content, made simple.",
    title: "Build a Memorable Personal Brand, Without Hiring a Team",
    subTitle: "Meet the Tool Behind 10,000+ Personal Brands",
    imageUrl: fetchAwsAsset("dummy", "png"),
    imageAlt: "Platform overview",
    ctaText: "JOIN OUR COMMUNITY",
    highlightedText: "Start Free Trial",
    showBrandMark: false,
  };

  const resetAllContent = () => updateData(defaultData);

  return {
    // Current data (automatically from correct source)
    data: getCurrentData(),

    // Unified update functions
    updateTitle,
    updateSubTitle,
    updateDescription,
    updateImageUrl,
    updateImageAlt,
    updateCtaText,
    updateHighlightedText,
    updateScreenshotUrl,

    // Bulk operations
    setData: updateData,
    resetAllContent,

    // Asset type info
    isCarousel,
    currentAssetType,
  };
};
