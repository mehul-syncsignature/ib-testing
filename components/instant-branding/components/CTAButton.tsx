/* eslint-disable @typescript-eslint/no-explicit-any */
import { processText } from "@/common/utils";
import { Data, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import React from "react";

interface CTAButtonProps {
  data: Data;
  config: StyleConfigs;
  customStyles?: any;
}

const CTAButton: React.FC<CTAButtonProps> = ({ data, customStyles = {} }) => {
  const {
    state: {
      brand,
      brand: {
        config: {
          colors: { secondaryColor },
          typography: { secondaryFont, secondaryFontWeight },
        },
      },
    },
  } = useBrandContext();

  const { ctaText } = data;

  return (
    <div
      className="inline-flex items-center gap-2"
      style={{
        padding: "16px 16px",
        fontSize: "1rem",
        fontWeight: secondaryFontWeight,
        backgroundColor: secondaryColor,
        color: "#FFFFFF",
        fontFamily: secondaryFont,
        maxWidth: "375px",
        wordBreak: "break-word",
        hyphens: "auto",
        borderRadius: "0px",
        display: "inline-block",
        ...customStyles,
      }}
      dangerouslySetInnerHTML={{
        __html: processText(ctaText, brand) ?? "",
      }}
    ></div>
  );
};

export default CTAButton;
