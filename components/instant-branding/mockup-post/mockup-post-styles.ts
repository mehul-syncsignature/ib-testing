// components/instant-branding/featured-post/featured-post-styles.ts

import { Style } from "@/contexts/AssetContext/types";

interface mockupPostStylesType {
  [key: number]: Style;
}

export const mockupPostStyles: mockupPostStylesType = {
  1: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "linear",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "secondaryColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonTextColor: "primary",
        highlightedTextbuttonRadius: "6px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "secondaryColor",
        headshotBackdropName: "ellipse",
        headshotBackdropPosition: "right bottom",
      },
      backgroundStyle: {
        type: "linear",
        gradient: "{{primaryColor}}",
      },
    },
  },
} as const;

export type mockupPostStylesKey = keyof typeof mockupPostStyles;
