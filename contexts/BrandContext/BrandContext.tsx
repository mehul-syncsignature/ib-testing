// contexts/BrandContext/BrandContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Brand, BrandContextType, BrandState } from "./types";
import { initialState } from "./helpers/initialState";
import { actions } from "./helpers/actions";

// Context
const BrandContext = createContext<BrandContextType | null>(null);

// Provider
function BrandContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BrandState>(initialState);

  const setColors = (colors: Partial<Brand["config"]["colors"]>) =>
    actions.setColors(setState, colors);
  const setOriginalColors = (
    originalColors: Partial<Brand["config"]["originalColors"]>
  ) => actions.setOriginalColors(setState, originalColors);
  const setTypography = (typography: Partial<Brand["config"]["typography"]>) =>
    actions.setTypography(setState, typography);
  const setIsDarkMode = (isDarkMode: boolean) =>
    actions.setIsDarkMode(setState, isDarkMode);
  const setMonochrome = (monochrome: boolean) =>
    actions.setMonochrome(setState, monochrome);
  const setBrand = (brand: Brand) => actions.setBrand(setState, brand);
  const setBrands = (brands: Brand[]) => actions.setBrands(setState, brands);
  const setName = (name: string) => actions.setName(setState, name);
  const setSocialLinks = (socialLinks: Partial<Brand["socialLinks"]>) =>
    actions.setSocialLinks(setState, socialLinks);
  const setBrandImages = (brandImages: string[]) =>
    actions.setBrandImages(setState, brandImages);
  const setInfoQuestions = (infoQuestions: Partial<Brand["infoQuestions"]>) =>
    actions.setInfoQuestions(setState, infoQuestions);
  const setBrandMark = (brandMark: Partial<Brand["brandMark"]>) =>
    actions.setBrandMark(setState, brandMark);
  const setIsDirty = (isDirty: boolean) =>
    actions.setIsDirty(setState, isDirty);

  const value: BrandContextType = {
    state,
    setColors,
    setOriginalColors,
    setTypography,
    setIsDarkMode,
    setMonochrome,
    setBrand,
    setBrands,
    setName,
    setSocialLinks,
    setBrandImages,
    setInfoQuestions,
    setBrandMark,
    setIsDirty,
  };

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

// Hook
const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrandContext must be used within BrandContextProvider");
  }
  return context;
};

export { BrandContext, BrandContextProvider, useBrandContext };
