// contexts/AssetContext/helpers/actions.ts

import {
  AssetState,
  AssetTypeKeys,
  CarouselSlide,
  Data,
  Design,
  Style,
} from "../types";
import { Post } from "@/hooks/post";

export const actions = {
  // Asset styles actions
  setCurrentAssetType: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    assetType: AssetTypeKeys
  ) => {
    setState((state) => ({
      ...state,
      currentAssetType: assetType,
    }));
  },

  setStyleId: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    styleId: number
  ) => {
    setState((state) => {
      return {
        ...state,
        styleId,
      };
    });
  },

  setTemplateId: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    templateId: string
  ) => {
    setState((state) => ({
      ...state,
      templateId,
    }));
  },

  setCurrentStyle: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    style: Style
  ) => {
    setState((state) => ({
      ...state,
      currentStyle: style,
    }));
  },

  // Data config actions
  setDataConfig: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    content: Partial<Data>
  ) => {
    setState((state) => ({
      ...state,
      dataConfig: { ...state.dataConfig, ...content },
    }));
  },

  // Carousel actions (pure setters only)
  setCurrentSlideIndex: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    index: number
  ) => {
    setState((state) => ({
      ...state,
      currentSlideIndex: index,
    }));
  },

  setSlides: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    slides: CarouselSlide[]
  ) => {
    setState((state) => ({
      ...state,
      slides,
    }));
  },

  setSlideData: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    slideIndex: number,
    data: Partial<Data>
  ) => {
    setState((state) => {
      const newSlides = [...state.slides];
      if (newSlides[slideIndex]) {
        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          data: { ...newSlides[slideIndex].data, ...data },
        };
      }
      return {
        ...state,
        slides: newSlides,
      };
    });
  },

  // Design actions
  setDesigns: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    designs: Design[]
  ) => {
    setState((state) => ({
      ...state,
      designs,
    }));
  },

  // Post actions
  setPosts: (
    setState: React.Dispatch<React.SetStateAction<AssetState>>,
    posts: Post[]
  ) => {
    setState((state) => ({
      ...state,
      posts,
    }));
  },
};
