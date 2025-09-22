/* eslint-disable @typescript-eslint/no-explicit-any */
// modules/Brand/components/BrandSection/utils/index.ts
import { AssetType } from "@/components/TemplateWrapper/TemplateWrapper";
import get from "lodash/get";
import startCase from "lodash/startCase";
import { templateData } from "@/common/constants/template-data";
import { ASSET_CONFIG, AssetTypeKeys } from "@/contexts/AssetContext/types";

// Default fallback templates
export const fallbackTemplates = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
];

interface TemplateStyleExclusion {
  [assetType: string]: {
    [templateId: string]: number[]; // Array of style IDs to exclude
  };
}

// Get template data by merging default and template-specific data
export const getTemplateData = (
  selectedCategory: AssetType,
  templateId: string
) => {
  if (selectedCategory === "social-carousel") {
    return { ...templateData[selectedCategory][templateId]["first"] };
  }
  const defaultData = get(templateData, [selectedCategory, "default"], {});
  const templateSpecificData = get(
    templateData,
    [selectedCategory, String(templateId)],
    {}
  );
  return { ...defaultData, ...templateSpecificData };
};

// Format category title for display
export const formatCategoryTitle = (category: AssetType): string => {
  return category === "social-banner"
    ? "Social Banner Templates"
    : `${startCase(category)} Templates`;
};

export const TEMPLATE_STYLE_EXCLUSIONS: TemplateStyleExclusion = {
  "social-banner": {
    "11": [2, 3, 4, 7, 8, 9, 10],
  },
  "social-post": {},
  "quote-card": {},
};

export const getAllStylesByType = (
  assetType: AssetTypeKeys,
  templateId?: string
) => {
  const templateStyles = ASSET_CONFIG[assetType] || {};
  const exclusions = TEMPLATE_STYLE_EXCLUSIONS[assetType] || {};

  // Get excluded style IDs for given template ID
  const excludedStyles =
    templateId && exclusions?.[templateId] ? exclusions[templateId] : [];

  // Filter out excluded styles
  const filteredStyles = Object.keys(templateStyles)
    .filter((styleId) => !excludedStyles.includes(Number(styleId)))
    .reduce((acc: Record<string, any>, styleId) => {
      acc[styleId] = templateStyles[Number(styleId)];
      return acc;
    }, {});

  return filteredStyles;
};
