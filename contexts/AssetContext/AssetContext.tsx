// contexts/AssetContext/AssetContext.tsx
import React, { createContext, useContext, useState } from "react";
import {
  AssetState,
  AssetContextType,
  AssetTypeKeys,
  CarouselSlide,
  Style,
  Data,
} from "./types";
import { initialState } from "./helpers/initialState";
import { actions } from "./helpers/actions";

// Context
const AssetContext = createContext<AssetContextType | null>(null);

// Provider
function AssetContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssetState>(initialState);

  // Pure action handlers (no logic)
  const setCurrentAssetType = (assetType: AssetTypeKeys) =>
    actions.setCurrentAssetType(setState, assetType);
  const setStyleId = (styleId: number) => actions.setStyleId(setState, styleId);
  const setTemplateId = (templateId: string) =>
    actions.setTemplateId(setState, templateId);
  const setCurrentStyle = (style: Style) =>
    actions.setCurrentStyle(setState, style);
  const setDataConfig = (content: Partial<Data>) =>
    actions.setDataConfig(setState, content);

  // Carousel action handlers (pure setters only)
  const setCurrentSlideIndex = (index: number) =>
    actions.setCurrentSlideIndex(setState, index);
  const setSlides = (slides: CarouselSlide[]) =>
    actions.setSlides(setState, slides);
  const setSlideData = (slideIndex: number, data: Partial<Data>) =>
    actions.setSlideData(setState, slideIndex, data);

  const value: AssetContextType = {
    state,

    // Pure setters only
    setCurrentAssetType,
    setStyleId,
    setTemplateId,
    setCurrentStyle,
    setDataConfig,
    // Carousel setters
    setCurrentSlideIndex,
    setSlides,
    setSlideData,
  };

  return (
    <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
  );
}

// Hook
const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssetContext must be used within AssetContextProvider");
  }
  return context;
};

export { AssetContext, AssetContextProvider, useAssetContext };
