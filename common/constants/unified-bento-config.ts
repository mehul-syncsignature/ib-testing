/* eslint-disable @typescript-eslint/no-explicit-any */
// common/constants/unified-bento-config.ts

import { Data } from "@/contexts/AssetContext/types";
import { templateData } from "./template-data";
import { Headshot } from "@/contexts/AppContext/types";
import { fetchAwsAsset } from "@/lib/aws-s3";

// EXISTING INTERFACES - KEEP AS IS
export interface AssetConfig {
  assetType: string;
  templateId: string;
  styleKey: number;
  data: Data;
  headshot: Headshot;
}

// UPDATED: Use easy-to-identify slot names that don't imply specific asset types
export interface SectionConfig {
  id: string;
  theme: string;
  assets: {
    profilePicture: AssetConfig;
    topBanner: AssetConfig; // Top banner slot
    leftCard: AssetConfig; // Left card slot
    rightCard: AssetConfig; // Right card slot
    smallPost1: AssetConfig; // Small post slot 1
    smallPost2: AssetConfig; // Small post slot 2
    bigPost: AssetConfig; // Big post slot (showcase)
    miniPost1: AssetConfig; // Mini post slot 1
    miniPost2: AssetConfig; // Mini post slot 2
  };
}

export const HEADSHOT_CONFIG: Headshot = {
  imagePosition: { x: 0, y: 0 },
  imageScale: 1,
};

// UPDATED CONFIG WITH EASY-TO-IDENTIFY SLOT NAMES
export const UNIFIED_BENTO_CONFIG: SectionConfig[] = [
  {
    id: "section-1",
    theme: "personal-brand",
    assets: {
      profilePicture: {
        assetType: "profile-picture",
        templateId: "3",
        styleKey: 1,
        data: { showBrandMark: false },
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1.25,
          imagePosition: { x: 0, y: 30 },
        },
      },
      topBanner: {
        assetType: "social-banner",
        templateId: "3",
        styleKey: 1,
        data: templateData["social-banner"]["3"],
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1,
          imagePosition: { x: 20, y: 0 },
        },
      },
      leftCard: {
        assetType: "featured-post",
        templateId: "1",
        styleKey: 2,
        data: templateData["featured-post"]["1"],
        headshot: {
          ...HEADSHOT_CONFIG,
        },
      },
      rightCard: {
        assetType: "featured-post",
        templateId: "2",
        styleKey: 1,
        data: templateData["featured-post"]["2"],
        headshot: {
          ...HEADSHOT_CONFIG,
        },
      },
      smallPost1: {
        assetType: "textimg-post",
        templateId: "3",
        styleKey: 1,
        data: templateData["textimg-post"]["3"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      smallPost2: {
        assetType: "quote-card",
        templateId: "1",
        styleKey: 4,
        data: templateData["quote-card"]["1"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      bigPost: {
        assetType: "mockup-post",
        templateId: "3",
        styleKey: 1,
        data: templateData["mockup-post"]["3"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      miniPost1: {
        assetType: "social-post",
        templateId: "1",
        styleKey: 1,
        data: templateData["social-post"]["1"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      miniPost2: {
        assetType: "textimg-post",
        templateId: "4",
        styleKey: 1,
        data: templateData["textimg-post"]["4"],
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1.05,
          imagePosition: { x: 0, y: 25 },
        },
      },
    },
  },
  {
    id: "section-2",
    theme: "fitness",
    assets: {
      profilePicture: {
        assetType: "profile-picture",
        templateId: "3",
        styleKey: 1,
        data: { showBrandMark: false },
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1.25,
          imagePosition: { x: 0, y: 30 },
        },
      },
      topBanner: {
        assetType: "social-banner",
        templateId: "1",
        styleKey: 4,
        data: {
          title:
            "Transform Your Body,<font color={{highlightColor}}> Without Expensive Gym Memberships</font>",
          description:
            "Your complete fitness transformation system made simple.",
          imageUrl: fetchAwsAsset("dummy", "png"),
          imageAlt: "Fitness transformation results",
          ctaText: "JOIN THE CHALLENGE",
          highlightedText: "Try 7 Days Free",
          showBrandMark: false,
        },
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1.1,
          imagePosition: { x: 0, y: 20 },
        },
      },
      leftCard: {
        assetType: "featured-post",
        templateId: "3",
        styleKey: 1,
        data: templateData["featured-post"]["3"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      rightCard: {
        assetType: "featured-post",
        templateId: "4",
        styleKey: 1,
        data: templateData["featured-post"]["4"],
        headshot: {
          ...HEADSHOT_CONFIG,
        },
      },
      smallPost1: {
        assetType: "social-post", // Different asset type for same slot
        templateId: "2",
        styleKey: 2,
        data: templateData["social-post"]["2"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      smallPost2: {
        assetType: "social-post", // Different asset type for same slot
        templateId: "4",
        styleKey: 1,
        data: {
          imageUrl: fetchAwsAsset("dummy", "png"),
          title: `Every year, millions of people decide to get in shape. 🏋️‍♂️ `,
          description: `
              -  Less than 1% train with a clear purpose.<br>
              -  Less than 1% stay consistent for more than a few weeks.<br>
              -  Less than 1% achieve a genuine, lasting transformation.<br>
              -  Less than 1% make fitness a lifestyle, not just a temporary fix.<br>
            <br><b>Instead of asking "Can I finally get in shape?" ask "WHAT is my first step today?"</b>`,
          showBrandMark: false,
        },
        headshot: { ...HEADSHOT_CONFIG },
      },
      bigPost: {
        assetType: "mockup-post",
        templateId: "2",
        styleKey: 1,
        data: templateData["mockup-post"]["2"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      miniPost1: {
        assetType: "quote-card", // Different asset type for same slot
        templateId: "3",
        styleKey: 1,
        data: {
          description: `Put your workout on the calendar.
          <br><br>If it doesn't get scheduled, it doesn't get done.
          <br><br>Make your training session a non-negotiable appointment with yourself. 
          <br><br>I promise when you start treating it like one, you'll finally build the consistency needed to see real results.`,
          imageUrl: fetchAwsAsset("dummy", "png"),
          showBrandMark: true,
        },
        headshot: { ...HEADSHOT_CONFIG },
      },
      miniPost2: {
        assetType: "quote-card", // Different asset type for same slot
        templateId: "4",
        styleKey: 3,
        data: {
          description:
            "Your health is the only asset that compounds faster than the number on the scale drops.<br>Because it pays you in energy and confidence long before it pays you in pounds lost. <br><br>Ready to invest in yourself? <br>Follow me for daily deposits.",
          imageUrl: fetchAwsAsset("dummy", "png"),
          showBrandMark: true,
        },
        headshot: { ...HEADSHOT_CONFIG },
      },
    },
  },
  {
    id: "section-3",
    theme: "education",
    assets: {
      profilePicture: {
        assetType: "profile-picture",
        templateId: "3",
        styleKey: 1,
        data: { showBrandMark: false },
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1.25,
          imagePosition: { x: 0, y: 30 },
        },
      },
      topBanner: {
        assetType: "social-banner",
        templateId: "2",
        styleKey: 1,
        data: {
          title:
            "Master New Skills Fast,<font color={{highlightColor}}> Without Boring Lectures</font>",
          description:
            "Your personalized learning accelerator — from <font color={{highlightColor}}>courses to certifications,</font> made engaging.",
          imageUrl: fetchAwsAsset("dummy", "png"),
          imageAlt: "Student success story",
          ctaText: "UNLOCK YOUR POTENTIAL",
          highlightedText: "Access Free Course",
        },
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1.1,
          imagePosition: { x: 0, y: 20 },
        },
      },
      leftCard: {
        assetType: "featured-post",
        templateId: "5",
        styleKey: 3,
        data: templateData["featured-post"]["5"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      rightCard: {
        assetType: "featured-post",
        templateId: "6",
        styleKey: 4,
        data: templateData["featured-post"]["6"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      smallPost1: {
        assetType: "quote-card", // Different asset type for same slot
        templateId: "5",
        styleKey: 1,
        data: templateData["quote-card"]["5"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      smallPost2: {
        assetType: "quote-card",
        templateId: "6",
        styleKey: 4,
        data: {
          description:
            "Your knowledge is the only asset that compounds faster than your salary.",
        },
        headshot: { ...HEADSHOT_CONFIG },
      },
      bigPost: {
        assetType: "mockup-post",
        templateId: "4",
        styleKey: 1,
        data: templateData["mockup-post"]["4"],
        headshot: { ...HEADSHOT_CONFIG },
      },
      miniPost1: {
        assetType: "textimg-post", // Different asset type for same slot
        templateId: "2",
        styleKey: 1,
        data: {
          title: "92% of online learners never complete their courses.",
          description:
            "Your personalized learning accelerator — from <font color={{highlightColor}}>courses to certifications,</font> made engaging.",
          imageUrl: fetchAwsAsset("dummy", "png"),
          screenshotUrl: fetchAwsAsset("screenshot", "png"),
        },
        headshot: { ...HEADSHOT_CONFIG },
      },
      miniPost2: {
        assetType: "textimg-post",
        templateId: "5",
        styleKey: 2,
        data: {
          title: `How to<br>rank on<br><span data-rte-highlight="true" data-rte-highlight-name="Rounded Highlight" style="background-color: {{highlightColor}}; color: {{primaryColor}}; padding: 0px 13px; border-radius: 13px; box-decoration-break: clone; -webkit-box-decoration-break: clone; line-height: 1.2">ChatGPT</span>`,
          imageUrl: fetchAwsAsset("dummy", "png"),
        },
        headshot: {
          ...HEADSHOT_CONFIG,
          imageScale: 1,
          imagePosition: { x: 50, y: 0 },
        },
      },
    },
  },
];

// EXISTING HELPER FUNCTIONS - UPDATED WITH NEW SLOT NAMES
export const getAssetConfigById = (
  sectionId: string,
  assetKey: keyof SectionConfig["assets"]
): AssetConfig | null => {
  const section = UNIFIED_BENTO_CONFIG.find((s) => s.id === sectionId);
  return section?.assets[assetKey] || null;
};

export const getSectionConfig = (sectionId: string): SectionConfig | null => {
  return UNIFIED_BENTO_CONFIG.find((s) => s.id === sectionId) || null;
};

// ============================================================================
// AI MAPPING SYSTEM - MAPS AI DATA TO APPROPRIATE ASSET TYPES
// ============================================================================

// AI data structure mapping - direct 1:1 mapping to slot names
// UPDATED: Added profilePicture to the mapping
const AI_DATA_MAPPING = {
  profilePicture: "profilePicture", // Added profile picture mapping
  topBanner: "topBanner",
  leftCard: "leftCard",
  rightCard: "rightCard",
  smallPost1: "smallPost1",
  smallPost2: "smallPost2",
  bigPost: "bigPost",
  miniPost1: "miniPost1",
  miniPost2: "miniPost2",
};

// Helper function to get AI path for asset type and slot
function getAIPathForAssetType(
  assetType: string,
  defaultSlot: keyof typeof AI_DATA_MAPPING
): string {
  // Direct mapping to slot name - no complex logic needed
  return AI_DATA_MAPPING[defaultSlot];
}

// AI asset slot mappings for AI generation
// UPDATED: Added profilePicture to all section mappings
const AI_ASSET_SLOT_MAPPINGS = UNIFIED_BENTO_CONFIG.map((section) => ({
  sectionId: section.id,
  theme: section.theme,
  mapping: {
    profilePicture: {
      assetType: section.assets.profilePicture.assetType,
      templateId: section.assets.profilePicture.templateId,
      styleKey: section.assets.profilePicture.styleKey,
      aiPath: AI_DATA_MAPPING.profilePicture,
    },
    topBanner: {
      assetType: section.assets.topBanner.assetType,
      templateId: section.assets.topBanner.templateId,
      styleKey: section.assets.topBanner.styleKey,
      aiPath: AI_DATA_MAPPING.topBanner,
    },
    leftCard: {
      assetType: section.assets.leftCard.assetType,
      templateId: section.assets.leftCard.templateId,
      styleKey: section.assets.leftCard.styleKey,
      aiPath: AI_DATA_MAPPING.leftCard,
    },
    rightCard: {
      assetType: section.assets.rightCard.assetType,
      templateId: section.assets.rightCard.templateId,
      styleKey: section.assets.rightCard.styleKey,
      aiPath: AI_DATA_MAPPING.rightCard,
    },
    smallPost1: {
      assetType: section.assets.smallPost1.assetType,
      templateId: section.assets.smallPost1.templateId,
      styleKey: section.assets.smallPost1.styleKey,
      aiPath: getAIPathForAssetType(
        section.assets.smallPost1.assetType,
        "smallPost1"
      ),
    },
    smallPost2: {
      assetType: section.assets.smallPost2.assetType,
      templateId: section.assets.smallPost2.templateId,
      styleKey: section.assets.smallPost2.styleKey,
      aiPath: getAIPathForAssetType(
        section.assets.smallPost2.assetType,
        "smallPost2"
      ),
    },
    bigPost: {
      assetType: section.assets.bigPost.assetType,
      templateId: section.assets.bigPost.templateId,
      styleKey: section.assets.bigPost.styleKey,
      aiPath: AI_DATA_MAPPING.bigPost,
    },
    miniPost1: {
      assetType: section.assets.miniPost1.assetType,
      templateId: section.assets.miniPost1.templateId,
      styleKey: section.assets.miniPost1.styleKey,
      aiPath: getAIPathForAssetType(
        section.assets.miniPost1.assetType,
        "miniPost1"
      ),
    },
    miniPost2: {
      assetType: section.assets.miniPost2.assetType,
      templateId: section.assets.miniPost2.templateId,
      styleKey: section.assets.miniPost2.styleKey,
      aiPath: getAIPathForAssetType(
        section.assets.miniPost2.assetType,
        "miniPost2"
      ),
    },
  },
}));

// Helper function to get AI data - simplified since we use direct property access
function getNestedAIData(aiVariant: any, path: string): any {
  return aiVariant?.[path];
}

// Helper function to create AI-generated sections with precise data merging
// UPDATED: Now handles profilePicture with special logic for user image
export function createAISectionsFromVariants(
  aiVariants: any[],
  userImageUrl?: string
  // userName?: string, // Add userName parameter
  // userSocialHandle?: string // Add userSocialHandle parameter
): SectionConfig[] {
  if (!aiVariants.length || !AI_ASSET_SLOT_MAPPINGS.length) {
    return [];
  }

  return AI_ASSET_SLOT_MAPPINGS.map((sectionMapping, index) => {
    const variant = aiVariants[index % aiVariants.length];
    const assets = {} as SectionConfig["assets"];

    // Create each asset using precise data mapping
    Object.entries(sectionMapping.mapping).forEach(([slotKey, config]) => {
      const aiData = getNestedAIData(variant, config.aiPath);

      // Special handling for profile picture
      if (slotKey === "profilePicture") {
        // For profile picture, always use the original configuration from UNIFIED_BENTO_CONFIG
        const originalSection = UNIFIED_BENTO_CONFIG.find(
          (s) => s.id === sectionMapping.sectionId
        );
        const originalProfilePicture = originalSection?.assets.profilePicture;

        assets[slotKey as keyof SectionConfig["assets"]] = {
          ...originalProfilePicture!,
        };
        return;
      }

      // Get template defaults for this specific asset type and template
      const defaultTemplateData =
        templateData[config.assetType]?.[config.templateId] || {};

      // Merge ONLY the AI-generated fields with template defaults
      // AI data takes precedence, but template data provides fallbacks
      const mergedData = {
        ...defaultTemplateData,
        ...aiData,
        // Always preserve user image if provided (for non-profile-picture assets)
        imageUrl:
          userImageUrl || aiData?.imageUrl || defaultTemplateData.imageUrl,
      };

      assets[slotKey as keyof SectionConfig["assets"]] = {
        assetType: config.assetType,
        templateId: config.templateId,
        styleKey: config.styleKey,
        data: mergedData,
        headshot: HEADSHOT_CONFIG,
      };
    });

    return {
      id: `ai-${sectionMapping.sectionId}-${index + 1}`,
      theme: `ai-${sectionMapping.theme}`,
      assets,
    };
  });
}
