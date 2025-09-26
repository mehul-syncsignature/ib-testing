// common/utils/index.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ASSET_CONFIG, AssetTypeKeys } from "@/contexts/AssetContext/types";
import { Brand } from "@/contexts/BrandContext/types";
import { useEffect, useRef } from "react";

/* background colors and gradient */

export const generateBackground = (
  style: { type: "solid" | "radial" | "linear"; config?: any },
  primaryColor: string
): string => {
  // Default fallback
  return primaryColor;
};

export type ButtonStyle = "normal" | "rounded" | "bordered";
export type ButtonColor = string;
export type FontColor = string;
export type BorderRadius = string;

/* button */

export const getButtonClasses = (
  style: ButtonStyle,
  color: string,
  fontColor: string,
  radius: string
) => {
  // Tailwind classes for layout and non-color styling
  const baseClasses = "";

  // Add border radius based on style
  const styleClass = style === "rounded" ? "rounded-full" : "";

  // Dynamic styles that will be applied inline
  const styles =
    style === "bordered"
      ? {
          backgroundColor: "transparent",
          color: color,
          border: `1px solid ${color}`,
          borderRadius: radius,
        }
      : {
          backgroundColor: color,
          color: fontColor,
          border: "none",
          borderRadius: radius,
        };
  return {
    className: `${baseClasses} ${styleClass}`,
    style: styles,
  };
};

/* responsive font size */

export default function useResponsiveText(
  content: TrustedHTML | undefined,
  maxWidth: number,
  maxHeight: number,
  initialFontSize: number, // Input in rem
  minFontSize: number = 0.75 // Input can be in rem or px
) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element || !content) return;

    // Convert minFontSize to rem if it's in px
    // const minFontSizeRem = minFontSize < 5 ? minFontSize : minFontSize / 16;

    const adjustFontSize = (): void => {
      // Start with initial font size in rem
      let currentFontSize = initialFontSize;
      element.style.fontSize = `${currentFontSize}rem`;

      // Check if text overflows container
      const isOverflowing = (): boolean =>
        element.scrollWidth > maxWidth + 10 ||
        element.scrollHeight > maxHeight + 10;

      // Reduce font size if needed
      if (isOverflowing()) {
        //   while (isOverflowing() && currentFontSize > minFontSizeRem) {
        currentFontSize = initialFontSize; // Reduce by 0.03125rem (0.5px at 16px base)
        element.style.fontSize = `${currentFontSize}rem`;
      }
      // }
    };

    // Run the adjustment
    adjustFontSize();

    // Handle window resizes
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [content, maxWidth, maxHeight, initialFontSize, minFontSize]);

  return textRef;
}

export const processText = (
  text: string | undefined | TrustedHTML,
  brand: Brand
): string => {
  if (!text) return "";

  const textString = text.toString();

  const {
    config: { colors },
  } = brand;

  return textString
    .replace(/{{primaryColor}}/g, colors?.primaryColor)
    .replace(/{{secondaryColor}}/g, colors?.secondaryColor)
    .replace(/{{highlightColor}}/g, colors?.highlightColor);
};

export const getAssetDimensions = (
  assetType: string
): { width: number; height: number } => {
  switch (assetType) {
    case "social-banner":
      return { width: 1584, height: 396 };
    case "social-post":
      return { width: 1080, height: 1350 };
    case "quote-card":
      return { width: 1080, height: 1350 };
    case "textimg-post":
      return { width: 1080, height: 1350 };
    case "featured-post":
      return { width: 1200, height: 627 };
    case "mockup-post":
      return { width: 1080, height: 1350 };
    case "social-carousel":
      return { width: 1080, height: 1350 };
    default:
      return { width: 1584, height: 396 }; // Default to social banner dimensions
  }
};

// Calculate scale to fit content within a container while maintaining aspect ratio
export const calculateScaleToFit = (
  contentWidth: number,
  contentHeight: number,
  containerWidth: number,
  containerHeight: number,
  padding = 0
): number => {
  const widthRatio = (containerWidth - padding * 1) / contentWidth;
  const heightRatio = (containerHeight - padding * 1) / contentHeight;
  // Return the smaller ratio to ensure the content fits within the container
  return Math.min(widthRatio, heightRatio);
};

export type SlidePosition = "first" | "middle" | "last";

export const getSlidePosition = (
  index: number,
  total: number
): SlidePosition => {
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  return "middle";
};

// Validate if the type is a valid asset type
export const isValidAssetType = (type: string): type is AssetTypeKeys => {
  return type in ASSET_CONFIG;
};
