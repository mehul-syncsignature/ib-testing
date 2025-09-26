import { AssetTypeKeys } from "./types";

export const ASSET_CATEGORIES: AssetTypeKeys[] = [
  "social-banner",
  "quote-card",
  "social-carousel",
  "featured-post",
  "social-post",
  "textimg-post",
  "mockup-post",
];

export const ASSET_TEMPLATES = {
  "social-banner": [1, 2, 3, 4, 5, 8, 9, 10, 11],
  "social-post": [1, 2, 3, 4],
  "quote-card": [1, 2, 3, 4, 5, 6],
  "featured-post": [1, 2, 3, 4, 5, 6],
  "mockup-post": [1, 2, 3, 4],
  "textimg-post": [1, 2, 3, 4, 5, 6],
  "social-carousel": [1, 2, 3, 4],
} as const;
