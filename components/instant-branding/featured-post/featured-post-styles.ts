// components/instant-branding/featured-post/featured-post-styles.ts

import { Style } from "@/contexts/AssetContext/types";

interface featuredPostStylesType {
  [key: number]: Style;
}

export const featuredPostStyles: featuredPostStylesType = {
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
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  2: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "noise",
        backgroundBackdropPosition: "",
        backgroundBackdropColor: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonTextColor: "highlight",
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
        backgroundBackdropName: "feetsvg11",
        backgroundBackdropSize: "contain",
        backgroundBackdropColor: "highlightColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
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
        backgroundBackdropName: "feetsvg4",
        backgroundBackdropPosition: "contain",
        backgroundBackdropColor: "secondaryColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: `0px`,
      },
      backgroundStyle: {
        type: "solid",
        gradient: " {{primaryColor}}",
      },
    },
  },
  5: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropPosition: "",
        backgroundBackdropSize: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonTextColor: "secondary",
      },
      backgroundStyle: {
        type: "solid",
        gradient:
          "linear-gradient(180deg, {{primaryColor}} 0%, {{secondaryColor}} 114.74%)",
      },
    },
  },
  6: {
    config: {
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
      },
      backgroundStyle: {
        type: "radial",
        gradient:
          "radial-gradient(92.6% 74.08% at 50% 50%, {{secondaryColor}} 0%, {{primaryColor}} 100%)",
      },
    },
  },
  7: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "featsvg23",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  8: {
    config: {
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonTextColor: "secondary",
        highlightedTextbuttonRadius: "0px",
      },
      backgroundStyle: {
        type: "radial",
        gradient:
          "radial-gradient(155.11% 122.11% at 106.94% -13.19%, {{highlightColor}} 2.12%, {{primaryColor}} 52.41%, {{secondaryColor}} 100%)",
      },
    },
  },
  9: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "featsvg26",
        backgroundBackdropPosition: "center center",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  10: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "featsvg27",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
} as const;

export type FeaturedPostStyleKey = keyof typeof featuredPostStyles;
