// contexts/AssetContext/types.ts

import { featuredPostStyles } from "@/components/instant-branding/featured-post/featured-post-styles";
import { socialBannerStyles } from "@/components/instant-branding/social-banner/social-banner-styles";
import { socialPostStyles } from "@/components/instant-branding/social-post/social-post-styles";
import { quoteCardStyles } from "@/components/instant-branding/quote-card/quote-card-styles";
import { textimgPostStyles } from "@/components/instant-branding/textimg-post/textimg-post-styles";
import { mockupPostStyles } from "@/components/instant-branding/mockup-post/mockup-post-styles";
import { socialCarouselStyles } from "@/components/instant-branding/social-carousel/social-carousel-styles";
import { Position } from "@/types";
import { Post } from "@/hooks/post";

export type CarouselSlideForStorage = Omit<CarouselSlide, "id" | "templateId">;

export interface Design {
  id: string;
  brandId: string;
  userId: string;
  assetType: string;
  styleId: number;
  templateId: number;
  data: Data | CarouselSlideForStorage[];
  createdAt: string;
  updatedAt: string;
}

export interface StyleConfigs {
  backgroundBackdropConfig?: {
    backgroundBackdropColor?: string;
    backgroundBackdropName?: string;
    backgroundBackdropPosition?: string;
    backgroundBackdropSize?: string;
    continuous?: boolean;
  };
  highlightedTextStyle?: {
    highlightedTextbuttonType: "normal" | "bordered";
    highlightedTextbuttonColor: "primary" | "secondary" | "highlight";
    highlightedTextbuttonTextColor?: string;
    highlightedTextbuttonRadius?: string;
  };
  headshotBackdropConfig?: {
    headshotBackdropColor?: string;
    headshotBackdropName?: string;
    headshotBackdropPosition?: string;
    headshotBackdropSize?: string;
  };
  backgroundStyle: {
    type: string;
    gradient: string;
  };
}

export interface Style {
  style_key?: number;
  assetTypes?: string[];
  templateIds?: string[];
  config: StyleConfigs;
}

export interface Data {
  title?: TrustedHTML;
  subTitle?: TrustedHTML;
  description?: TrustedHTML;
  imageUrl?: string;
  imageAlt?: string;
  ctaText?: string;
  highlightedText?: string;
  screenshotUrl?: string;
  backgroundimgUrl?: string;
  opacity?: number;
  showBrandMark: boolean; // Main toggle only - individual toggles are local state
  // Template-specific headshot positioning
  headshotPosition?: Position;
  headshotScale?: number;
  headshotOpacity?: number;
}

const ASSET_CONFIG = {
  "social-banner": socialBannerStyles,
  "social-post": socialPostStyles,
  "featured-post": featuredPostStyles,
  "quote-card": quoteCardStyles,
  "textimg-post": textimgPostStyles,
  "mockup-post": mockupPostStyles,
  "social-carousel": socialCarouselStyles,
} as const;

export type AssetTypeKeys = keyof typeof ASSET_CONFIG;
export type StyleMapType = typeof ASSET_CONFIG;

// Carousel types
export interface CarouselSlide {
  id: string;
  templateId: string;
  data: Data;
}

// Asset styles state
export interface AssetStylesState {
  currentAssetType: AssetTypeKeys;
  styleMap: StyleMapType;
  assets: {
    [K in AssetTypeKeys]: {
      styleId: number;
      templateId: string;
      currentStyle: Style;
    };
  };
}

// Combined asset state
export interface AssetState {
  // Data config
  dataConfig: Data;
  // Individual states for direct access
  currentAssetType: AssetTypeKeys;
  currentStyle: Style;
  styleId: number;
  templateId: string;
  // Carousel state
  currentSlideIndex: number;
  slides: CarouselSlide[];
  // Designs state
  designs: Design[];
  // Post state
  posts: Post[];
}

export interface AssetContextType {
  state: AssetState;

  // Asset styles actions (pure setters only)
  setCurrentAssetType: (assetType: AssetTypeKeys) => void;
  setStyleId: (styleId: number, assetType?: AssetTypeKeys) => void;
  setTemplateId: (templateId: string, assetType?: AssetTypeKeys) => void;
  setCurrentStyle: (style: Style, assetType?: AssetTypeKeys) => void;
  // Data config actions
  setDataConfig: (content: Partial<Data>) => void;
  // Carousel actions (pure setters only)
  setCurrentSlideIndex: (index: number) => void;
  setSlides: (slides: CarouselSlide[]) => void;
  setSlideData: (slideIndex: number, data: Partial<Data>) => void;
  // Design actions
  setDesigns: (designs: Design[]) => void;
  // Post actions
  setPosts: (posts: Post[]) => void;
}

export { ASSET_CONFIG };
