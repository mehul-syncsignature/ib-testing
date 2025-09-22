// contexts/AssetContext/helpers/initialState.ts
import { AssetState, ASSET_CONFIG, AssetTypeKeys, Data } from "../types";
import { fetchAwsAsset } from "@/lib/aws-s3";

// Default data config
const defaultDataConfig: Data = {
  description:
    "Your all-in-one personal brand OS — from strategy to content, made simple.",
  title: "Build a Memorable Personal Brand, Without Hiring a Team",
  subTitle: "Meet the Tool Behind 10,000+ Personal Brands",
  imageUrl: fetchAwsAsset("dummy", "png"),
  imageAlt: "Platform overview",
  ctaText: "JOIN OUR COMMUNITY",
  highlightedText: "Start Free Trial",
  showBrandMark: false,
  // Template-specific headshot positioning
  headshotPosition: { x: 0, y: 0 },
  headshotScale: 1,
  headshotOpacity: 1,
};

// Default carousel slide data
const defaultSlideData: Data = {
  description:
    "Your all-in-one personal brand OS — from strategy to content, made simple.",
  title: "Build a Memorable Personal Brand, Without Hiring a Team",
  subTitle: "Meet the Tool Behind 10,000+ Personal Brands",
  imageUrl: fetchAwsAsset("dummy", "png"),
  imageAlt: "Platform overview",
  ctaText: "JOIN OUR COMMUNITY",
  highlightedText: "Start Free Trial",
  showBrandMark: false,
  // Template-specific headshot positioning
  headshotPosition: { x: 0, y: 0 },
  headshotScale: 1,
  headshotOpacity: 1,
};

const firstAssetType = Object.keys(ASSET_CONFIG)[0] as AssetTypeKeys;
const styleObject = ASSET_CONFIG[firstAssetType];
const firstStyleKey = Object.keys(styleObject)[0];
const firstStyle =
  styleObject[Number(firstStyleKey) as keyof typeof styleObject];

export const initialState: AssetState = {
  dataConfig: defaultDataConfig,
  currentAssetType: firstAssetType,
  currentStyle: firstStyle || null,
  styleId: Number(firstStyleKey),
  templateId: "1",
  // Carousel state
  currentSlideIndex: 0,
  slides: [
    {
      id: "slide-1",
      templateId: "1",
      data: {
        ...defaultSlideData,
        title: "Success & Failure",
        description:
          "The biggest misconception people have is that they are the odd one out and everyone else is sorted!",
      },
    },
  ],
};
