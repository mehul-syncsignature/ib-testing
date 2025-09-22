// components/instant-branding/social-carousel/social-carousel-styles.ts

import { Style } from "@/contexts/AssetContext/types";

interface socialCarouselStylesType {
  [key: number]: Style;
}

export const socialCarouselStyles: socialCarouselStylesType = {
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
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "secondaryColor",
        headshotBackdropName: "ellipse",
        headshotBackdropPosition: "center",
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
        backgroundBackdropName: "flowPair7",
        backgroundBackdropPosition: "bottom",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "contain",
        continuous: true,
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropName: "stripes",
        headshotBackdropPosition: "center",
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
        backgroundBackdropName: "flowPair1",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "contain",
        continuous: true,
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
        backgroundBackdropName: "flowPair2",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "secondaryColor",
        backgroundBackdropSize: "contain",
        continuous: true,
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "primary",
        highlightedTextbuttonRadius: "15px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropName: "square",
        headshotBackdropPosition: "center",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  5: {
    config: {
      highlightedTextStyle: {
        highlightedTextbuttonType: "normal",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "30px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "secondaryColor",
        headshotBackdropName: "fullellipse",
        headshotBackdropPosition: "center",
      },
      backgroundStyle: {
        type: "gradient",
        gradient:
          "radial-gradient(circle at center, {{primaryColor}} 0%, {{highlightColor}} 100%)",
      },
    },
  },
  6: {
    config: {
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "primaryColor",
        headshotBackdropName: "rectangle",
        headshotBackdropPosition: "center",
      },
      backgroundStyle: {
        type: "gradient",
        gradient:
          "linear-gradient(45deg, {{secondaryColor}} 0%, {{primaryColor}} 50%, {{highlightColor}} 100%)",
      },
    },
  },
  7: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "flowPair6",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "contain",
        continuous: true,
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropName: "stripes",
        headshotBackdropPosition: "center",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  8: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "flowPair5",
        backgroundBackdropPosition: "bottom",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "contain",
        continuous: true,
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropName: "stripes",
        headshotBackdropPosition: "center",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
  9: {
    config: {
      backgroundBackdropConfig: {
        backgroundBackdropName: "flowPair4",
        backgroundBackdropPosition: "bottom",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "contain",
        continuous: true,
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropName: "stripes",
        headshotBackdropPosition: "center",
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
        backgroundBackdropName: "flowPair3",
        backgroundBackdropPosition: "center",
        backgroundBackdropColor: "highlightColor",
        backgroundBackdropSize: "",
        continuous: true,
      },
      highlightedTextStyle: {
        highlightedTextbuttonType: "bordered",
        highlightedTextbuttonColor: "secondary",
        highlightedTextbuttonRadius: "20px",
      },
      headshotBackdropConfig: {
        headshotBackdropColor: "highlightColor",
        headshotBackdropName: "stripes",
        headshotBackdropPosition: "center",
      },
      backgroundStyle: {
        type: "solid",
        gradient: "{{primaryColor}}",
      },
    },
  },
} as const;

export type SocialCarouselStyleKey = keyof typeof socialCarouselStyles;
