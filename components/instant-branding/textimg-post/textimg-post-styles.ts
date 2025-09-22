// components/instant-branding/featured-post/featured-post-styles.ts

import { Style } from "@/contexts/AssetContext/types";

interface textimgPostStylesType {
  [key: number]: Style;
}

export const textimgPostStyles: textimgPostStylesType = {
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
        highlightedTextbuttonRadius: "0px",
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
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
        backgroundBackdropName: "svg3",
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
  4: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "svg4",
        backgroundBackdropSize: "contain",
        backgroundBackdropColor: "secondaryColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: `0px`,
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
        backgroundBackdropName: "svg5",
        backgroundBackdropSize: "contain",
        backgroundBackdropColor: "secondaryColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: `0px`,
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  6: {
    config: {
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonTextColor: "secondary",
      },
      backgroundStyle: {
        type: "linear",
        gradient:
          "radial-gradient(79.63% 63.7% at 50% 50%, {{primaryColor}} 0%, {{secondaryColor}} 100%)",
      },
    },
  },
  7: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "svg8",
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
        backgroundBackdropName: "svg10",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "highlight",
        highlightedTextbuttonRadius: "0px",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  11: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "svg12",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonTextColor: "secondary",
        highlightedTextbuttonRadius: "0px",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
} as const;

export type FeaturedPostStyleKey = keyof typeof textimgPostStyles;
