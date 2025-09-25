/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/BrandContext/types.ts

import { GradientType } from "@/common/constants/gradients";

// Individual brand configuration - aligned with database structure
export interface Brand {
  id?: string;
  name: string;
  config: {
    colors: {
      primaryColor: string;
      secondaryColor: string;
      highlightColor: string;
      textColor: string;
    };
    originalColors: {
      primaryColor: string;
      secondaryColor: string;
      highlightColor: string;
      textColor: string;
    };
    typography: {
      primaryFont: string;
      primaryFontWeight: number;
      primaryLetterSpacing: string;
      secondaryFont: string;
      secondaryFontWeight: number;
      secondaryLetterSpacing: string;
      highlightFont: string;
      highlightFontWeight: number;
      highlightLetterSpacing: string;
    };
    isDarkMode: boolean;
    monochrome: boolean;
  };
  socialLinks: Record<string, string>;
  brandImages: string[];
  infoQuestions: Record<string, any>;
  brandMark: {
    name: string;
    socialHandle: string;
    website: string;
    logoUrl: string;
    headshotUrl: string;
    headshotGradient: GradientType;
    companyName: string;
  };
}

// Context state
export interface BrandState {
  // Current brand configuration
  brand: Brand;
  // Array of all brands
  brands: Brand[];
  // Simple dirty state tracking
  isDirty: boolean;
}

export interface BrandContextType {
  state: BrandState;

  // Pure setters only
  setColors: (colors: Partial<Brand["config"]["colors"]>) => void;
  setOriginalColors: (
    originalColors: Partial<Brand["config"]["originalColors"]>
  ) => void;
  setTypography: (typography: Partial<Brand["config"]["typography"]>) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setMonochrome: (monochrome: boolean) => void;
  setBrand: (brand: Brand) => void;
  setBrands: (brands: Brand[]) => void;
  setName: (name: string) => void;
  setSocialLinks: (socialLinks: Partial<Brand["socialLinks"]>) => void;
  setBrandImages: (brandImages: string[]) => void;
  setInfoQuestions: (infoQuestions: Partial<Brand["infoQuestions"]>) => void;
  setBrandMark: (brandMark: Partial<Brand["brandMark"]>) => void;

  // Dirty state management
  setIsDirty: (isDirty: boolean) => void;
}
