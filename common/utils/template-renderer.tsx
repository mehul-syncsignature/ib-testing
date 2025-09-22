// common/utils/template-renderer.tsx

import React from "react";

// Import all template components
import SocialBannerTemplate1 from "@/components/instant-branding/social-banner/social-banner-template-1";
import SocialBannerTemplate2 from "@/components/instant-branding/social-banner/social-banner-template-2";
import SocialBannerTemplate3 from "@/components/instant-branding/social-banner/social-banner-template-3";
import SocialBannerTemplate4 from "@/components/instant-branding/social-banner/social-banner-template-4";

import FeaturedPostTemplate1 from "@/components/instant-branding/featured-post/featured-post-template-1";
import FeaturedPostTemplate2 from "@/components/instant-branding/featured-post/featured-post-template-2";
import FeaturedPostTemplate3 from "@/components/instant-branding/featured-post/featured-post-template-3";
import FeaturedPostTemplate4 from "@/components/instant-branding/featured-post/featured-post-template-4";
import FeaturedPostTemplate5 from "@/components/instant-branding/featured-post/featured-post-template-5";
import FeaturedPostTemplate6 from "@/components/instant-branding/featured-post/featured-post-template-6";

import TextImgPostTemplate1 from "@/components/instant-branding/textimg-post/textimg-post-template-1";
import TextImgPostTemplate2 from "@/components/instant-branding/textimg-post/textimg-post-template-2";
import TextImgPostTemplate3 from "@/components/instant-branding/textimg-post/textimg-post-template-3";
import TextImgPostTemplate4 from "@/components/instant-branding/textimg-post/textimg-post-template-4";
import TextImgPostTemplate5 from "@/components/instant-branding/textimg-post/textimg-post-template-5";
import TextImgPostTemplate6 from "@/components/instant-branding/textimg-post/textimg-post-template-6";

import QuoteCardTemplate1 from "@/components/instant-branding/quote-card/quote-card-template-1";
import QuoteCardTemplate2 from "@/components/instant-branding/quote-card/quote-card-template-2";
import QuoteCardTemplate3 from "@/components/instant-branding/quote-card/quote-card-template-3";
import QuoteCardTemplate4 from "@/components/instant-branding/quote-card/quote-card-template-4";
import QuoteCardTemplate5 from "@/components/instant-branding/quote-card/quote-card-template-5";
import QuoteCardTemplate6 from "@/components/instant-branding/quote-card/quote-card-template-6";

import MockupPostTemplate1 from "@/components/instant-branding/mockup-post/mockup-post-template-1";
import MockupPostTemplate2 from "@/components/instant-branding/mockup-post/mockup-post-template-2";
import MockupPostTemplate3 from "@/components/instant-branding/mockup-post/mockup-post-template-3";
import MockupPostTemplate4 from "@/components/instant-branding/mockup-post/mockup-post-template-4";

import SocialPostTemplate1 from "@/components/instant-branding/social-post/social-post-template-1";
import SocialPostTemplate2 from "@/components/instant-branding/social-post/social-post-template-2";
import SocialPostTemplate3 from "@/components/instant-branding/social-post/social-post-template-3";
import SocialPostTemplate4 from "@/components/instant-branding/social-post/social-post-template-4";

// ADD THIS: Import Social Carousel Template
import SocialCarouselTemplate1 from "@/components/instant-branding/social-carousel/social-carousel-template-1";
import { Headshot } from "@/contexts/AppContext/types";
import { Data, Style } from "@/contexts/AssetContext/types";
import { Brand } from "@/contexts/BrandContext/types";

interface TemplateProps {
  data: Data;
  brand: Brand;
  headshot: Headshot;
  style: Style;
}

// Template component mapping
const TEMPLATE_COMPONENTS = {
  "social-banner": {
    "1": SocialBannerTemplate1,
    "2": SocialBannerTemplate2,
    "3": SocialBannerTemplate3,
    "4": SocialBannerTemplate4,
  },
  "featured-post": {
    "1": FeaturedPostTemplate1,
    "2": FeaturedPostTemplate2,
    "3": FeaturedPostTemplate3,
    "4": FeaturedPostTemplate4,
    "5": FeaturedPostTemplate5,
    "6": FeaturedPostTemplate6,
  },
  "textimg-post": {
    "1": TextImgPostTemplate1,
    "2": TextImgPostTemplate2,
    "3": TextImgPostTemplate3,
    "4": TextImgPostTemplate4,
    "5": TextImgPostTemplate5,
    "6": TextImgPostTemplate6,
  },
  "quote-card": {
    "1": QuoteCardTemplate1,
    "2": QuoteCardTemplate2,
    "3": QuoteCardTemplate3,
    "4": QuoteCardTemplate4,
    "5": QuoteCardTemplate5,
    "6": QuoteCardTemplate6,
  },
  "mockup-post": {
    "1": MockupPostTemplate1,
    "2": MockupPostTemplate2,
    "3": MockupPostTemplate3,
    "4": MockupPostTemplate4,
  },
  "social-post": {
    "1": SocialPostTemplate1,
    "2": SocialPostTemplate2,
    "3": SocialPostTemplate3,
    "4": SocialPostTemplate4,
  },
  // ADD THIS: Social Carousel Template Mapping
  "social-carousel": {
    "1": SocialCarouselTemplate1,
  },
} as const;

// Dynamic template renderer function
export const renderTemplate = (
  assetType: string,
  templateId: string,
  props: TemplateProps
): React.ReactElement | null => {
  const assetTemplates =
    TEMPLATE_COMPONENTS[assetType as keyof typeof TEMPLATE_COMPONENTS];

  if (!assetTemplates) {
    return null;
  }

  const TemplateComponent =
    assetTemplates[templateId as keyof typeof assetTemplates];

  if (!TemplateComponent) {
    return null;
  }

  return <TemplateComponent {...props} />;
};
