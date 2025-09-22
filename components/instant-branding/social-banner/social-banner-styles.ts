// components/instant-branding/social-banner/social-banner-styles.ts

import { Style } from "@/contexts/AssetContext/types";

interface socialBannerStylesType {
  [key: number]: Style;
}

export const socialBannerStyles: socialBannerStylesType = {
  1: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "",
        backgroundBackdropPosition: "",
        backgroundBackdropColor: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "0px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "secondaryColor",
        headshotBackdropName: "ellipse",
        headshotBackdropPosition: "right bottom",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  2: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropName: "wave",
        backgroundBackdropPosition: "left bottom",
        backgroundBackdropSize: "contain",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonTextColor: "highlight",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropPosition: "right bottom",
        headshotBackdropName: "ellipse",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  3: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "multipleCircles",
        backgroundBackdropSize: "contain",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonRadius: `0px`,
      },
      headshotBackdropConfig: {
        headshotBackdropPosition: "",
        headshotBackdropSize: "",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  4: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "triangles_tl_br",
        backgroundBackdropPosition: "center center",
        backgroundBackdropSize: "contain",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: `0px`,
      },
      headshotBackdropConfig: {
        headshotBackdropPosition: "",
        headshotBackdropSize: "",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  5: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "noise",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonTextColor: "highlight",
        highlightedTextbuttonRadius: "0px",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  6: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "svg6",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
      },
      headshotBackdropConfig: {
        headshotBackdropPosition: "",
        headshotBackdropSize: "",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  7: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropColor: "secondaryColor",
        backgroundBackdropName: "svg7",
        backgroundBackdropPosition: "center",
        backgroundBackdropSize: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "",
        headshotBackdropName: "",
        headshotBackdropPosition: "",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}} ",
      },
    },
  },
  8: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropPosition: "",
        backgroundBackdropSize: "",
      },
      headshotBackdropConfig: {
        headshotBackdropPosition: "",
        headshotBackdropSize: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonTextColor: "secondary",
      },
      backgroundStyle: {
        type: "linear",
        gradient:
          "linear-gradient(90deg,{{primaryColor}} 37.12%, {{secondaryColor}} 100%)",
      },
    },
  },
  9: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "svg9",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "secondaryColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonRadius: `0px`,
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  10: {
    config: {
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonRadius: `0px`,
      },
      headshotBackdropConfig: {
        headshotBackdropPosition: "",
        headshotBackdropSize: "",
      },
      backgroundStyle: {
        type: "solid",
        gradient:
          "linear-gradient(180deg, {{primaryColor}} 0%, {{secondaryColor}} 100%)",
      },
    },
  },
} as const;

export type FeaturedPostStyleKey = keyof typeof socialBannerStyles;
