// BackgroundElement.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { modifySvg } from "@/common/utils/modify-svg";
import { backgroundSvgMap } from "@/common/constants/svg-map";
import { getAssetDimensions } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import { AssetTypeKeys, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";

interface BackgroundElementProps {
  config: StyleConfigs;
  className?: string;
  type?: AssetTypeKeys;
  slideIndex?: number;
  slideCount?: number;
}

const BackgroundElement: React.FC<BackgroundElementProps> = ({
  config,
  className = "",
  type,
  slideIndex = 0,
  slideCount = 1,
}) => {
  const {
    state: {
      brand: {
        config: {
          colors: { primaryColor, secondaryColor, highlightColor },
        },
      },
    },
  } = useBrandContext();

  const {
    state: { currentAssetType },
  } = useAssetContext();
  const { backgroundBackdropConfig } = config;

  const { height, width } = getAssetDimensions(type || currentAssetType);

  // Check if continuous mode is enabled - only for social-carousel
  const assetType = type || currentAssetType;
  const isContinuous =
    assetType === "social-carousel" &&
    backgroundBackdropConfig?.continuous &&
    slideCount > 1;

  // For paired SVG system: determine which SVG pattern to use
  let svgPatternName = backgroundBackdropConfig?.backgroundBackdropName || "";

  if (isContinuous && svgPatternName.startsWith("flowPair")) {
    // Use paired system: odd slides get 'A', even slides get 'B'
    const isOddSlide = slideIndex % 2 === 0; // 0-indexed, so 0 is "first/odd"
    svgPatternName = svgPatternName + (isOddSlide ? "A" : "B");
  }

  // Standard dimensions - no complex offset calculations needed
  const svgWidth = width;
  const svgHeight = height;

  const bgsvg = modifySvg(
    svgPatternName && backgroundSvgMap[assetType][svgPatternName],
    `${svgWidth}px`,
    `${svgHeight}px`,
    backgroundBackdropConfig?.backgroundBackdropColor === "primaryColor"
      ? primaryColor
      : backgroundBackdropConfig?.backgroundBackdropColor === "secondaryColor"
      ? secondaryColor
      : highlightColor,
    backgroundBackdropConfig?.backgroundBackdropPosition,
    backgroundBackdropConfig?.backgroundBackdropSize
  );

  return (
    <div className={cn("absolute right-0 top-0 h-full", className)}>
      <div
        className="relative h-full flex items-center justify-end"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          overflow: "hidden", // This clips the SVG to slide boundaries
        }}
      >
        <div
          className="relative"
          style={{
            width: `${svgWidth}px`,
            height: "100%",
            position: "absolute",
            right: "0",
            top: "50%",
            transform: `translateY(-50%)`,
          }}
        >
          <div className="absolute w-full h-full flex">{bgsvg}</div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundElement;
