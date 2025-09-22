import React from "react";

const SocialPostWrapper = React.lazy(
  () => import("@/modules/Canvas/components/SocialPostWrapper")
);
const SocialBannerWrapper = React.lazy(
  () => import("@/modules/Canvas/components/SocialBannerWrapper")
);
const QuoteCardWrapper = React.lazy(
  () => import("@/modules/Canvas/components/QuoteCardWrapper")
);
const FeaturedPostWrapper = React.lazy(
  () => import("@/modules/Canvas/components/FeaturedPostWrapper")
);
const MockupPostWrapper = React.lazy(
  () => import("@/modules/Canvas/components/MockupPostWrapper")
);
const TextimgPostWrapper = React.lazy(
  () => import("@/modules/Canvas/components/TextImgPostWrapper")
);
const SocialCarouselWrapper = React.lazy(
  () => import("@/modules/Canvas/components/SocialCarouselWrapper")
);

export const componentMap = {
  "social-post": SocialPostWrapper,
  "social-banner": SocialBannerWrapper,
  "quote-card": QuoteCardWrapper,
  "featured-post": FeaturedPostWrapper,
  "mockup-post": MockupPostWrapper,
  "textimg-post": TextimgPostWrapper,
  "social-carousel": SocialCarouselWrapper,
} as const;

export type ComponentType = keyof typeof componentMap;
