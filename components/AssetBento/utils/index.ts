// components/AssetBento/utils/index.ts
import {
  ASSET_CONFIG,
  AssetTypeKeys,
  Style,
} from "@/contexts/AssetContext/types";

/**
 * Get a specific style by asset type and style key
 * Used in AssetBento components
 */
export const getStyleByTypeAndKey = (
  assetType: AssetTypeKeys,
  styleKey: number
): Style => {
  return (
    ASSET_CONFIG[assetType]?.[
      styleKey as keyof (typeof ASSET_CONFIG)[AssetTypeKeys]
    ] || null
  );
};
