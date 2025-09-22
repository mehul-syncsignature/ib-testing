// store/hooks/useCanvasRef.ts

import { createRef } from "react";

// Create global refs that will persist across component renders
const canvasRef = createRef<HTMLDivElement | null>();
const headshotRef = createRef<HTMLDivElement | null>();

// Global array to store carousel slide refs - same pattern as social banner
const carouselSlideRefs: React.RefObject<HTMLDivElement | null>[] = [];

export const useCanvasRef = () => {
  return {
    canvasRef,
  };
};

export const useHeadshotRef = () => {
  return {
    headshotRef,
  };
};

export const useCarouselRefs = () => {
  return {
    carouselSlideRefs,
  };
};
