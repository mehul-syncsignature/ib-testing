// contexts/BrandContext/helpers/initialState.ts
import { BrandState, Brand } from "../types";

export const defaultBrand: Brand = {
  id: undefined, // Explicitly set to undefined to indicate this is not a saved brand
  name: "Default Brand",
  config: {
    colors: {
      textColor: "#FFFFFF",
      primaryColor: "#1B4332",
      secondaryColor: "#081C15",
      highlightColor: "#D8F3DC",
    },
    originalColors: {
      primaryColor: "#1B4332",
      secondaryColor: "#081C15",
      highlightColor: "#D8F3DC",
      textColor: "#FFFFFF",
    },
    typography: {
      primaryFont: "DM Serif Display",
      primaryFontWeight: 400,
      primaryLetterSpacing: "normal",
      secondaryFont: "DM Sans",
      secondaryFontWeight: 400,
      secondaryLetterSpacing: "normal",
      highlightFont: "DM Sans",
      highlightFontWeight: 700,
      highlightLetterSpacing: "normal",
    },
    isDarkMode: false,
    monochrome: false,
  },
  socialLinks: {},
  brandImages: [],
  infoQuestions: {},
  brandMark: {
    name: "",
    socialHandle: "@jamescarter",
    website: "",
    logoUrl: "",
    headshotUrl: "https://assets.dev.instantbranding.ai/dummy.png",
    headshotGradient: "solid-primary",
  },
};

export const initialState: BrandState = {
  brand: defaultBrand,
  brands: [defaultBrand],
  isDirty: false,
};
