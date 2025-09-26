/* eslint-disable @typescript-eslint/no-explicit-any */
export type AssetTypeKeys =
  | "social-banner"
  | "social-post"
  | "quote-card"
  | "featured-post"
  | "mockup-post"
  | "textimg-post"
  | "social-carousel";

// Use your existing Design type instead of creating a new one
export interface Design {
  id: string;
  templateId: number;
  assetType: string; // Keep as string to match your existing API
  styleId: number;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export function isValidAssetType(
  assetType: string
): assetType is AssetTypeKeys {
  const validTypes: AssetTypeKeys[] = [
    "social-banner",
    "social-post",
    "quote-card",
    "featured-post",
    "mockup-post",
    "textimg-post",
    "social-carousel",
  ];
  return validTypes.includes(assetType as AssetTypeKeys);
}

export interface Category {
  type: AssetTypeKeys;
  title: string;
  description: string;
  icon: string;
}

export interface Template {
  id: string;
  templateId: number;
  assetType: AssetTypeKeys;
  title: string;
  isPremium: boolean;
}
