// components/TemplateLoader/utils/template-utils.ts
import React from "react";
import { ComponetProps } from "@/types";

export type AssetType = string;
export type TemplateNumber = number | string;

// Component cache to prevent duplicate loading
const componentCache: Record<string, React.ComponentType<ComponetProps>> = {};

/**
 * Gets a template component based on asset type and template number
 * Uses a cache to prevent repeated imports that could cause re-renders
 */
export function getTemplateComponent(
  assetType: AssetType,
  templateNumber: TemplateNumber
) {
  const componentKey = `${assetType}-template-${templateNumber}`;

  // Return from cache if available
  if (componentCache[componentKey]) {
    return componentCache[componentKey];
  }

  // Create lazy-loaded component
  const Component = React.lazy(() => {
    // Dynamic import path
    return import(
      `@/components/instant-branding/${assetType}/${assetType}-template-${templateNumber}`
    )
      .then((module) => {
        // Store in cache
        componentCache[componentKey] = module.default;
        return { default: module.default };
      })
      .catch((error) => {
        console.error(
          `Failed to load template component: ${componentKey}`,
          error
        );

        // Return fallback component
        const FallbackComponent = () => (
          <div className="p-4 border border-red-300 bg-red-50 text-red-500 rounded-md">
            Template not found: {componentKey}
          </div>
        );

        // Store fallback in cache to prevent repeated attempts
        componentCache[componentKey] = FallbackComponent;
        return { default: FallbackComponent };
      });
  });

  // Store in cache to avoid recreating the lazy component
  componentCache[componentKey] = Component;
  return Component;
}

/**
 * TemplateWrapper - A simple wrapper component for dynamic templates
 * This avoids the complexity that might lead to infinite loops
 */
export function TemplateWrapper({
  assetType,
  templateNumber,
  data,
  style,
  brand,
  className,
  headshot,
  slidePosition,
  actualSlideIndex,
}: {
  assetType: AssetType;
  templateNumber: TemplateNumber;
  slidePosition?: "first" | "middle" | "last";
  actualSlideIndex?: number;
} & ComponetProps) {
  // Get the component (should be stable across renders)
  const Component = getTemplateComponent(assetType, templateNumber);

  // Prepare props - include slidePosition and actualSlideIndex only for carousel templates
  const componentProps: ComponetProps & {
    slidePosition?: "first" | "middle" | "last";
    actualSlideIndex?: number;
  } = {
    data,
    style,
    brand,
    className: `select-none ${className ?? ""}`,
    headshot,
  };

  // Add slidePosition and actualSlideIndex props only for social-carousel templates
  if (assetType === "social-carousel") {
    if (slidePosition) componentProps.slidePosition = slidePosition;
    if (actualSlideIndex !== undefined)
      componentProps.actualSlideIndex = actualSlideIndex;
  }

  return (
    <React.Suspense fallback={<div className="p-4">Loading template...</div>}>
      <Component {...componentProps} />
    </React.Suspense>
  );
}
