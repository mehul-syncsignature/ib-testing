/* eslint-disable @typescript-eslint/no-explicit-any */
// Description.tsx
import React from "react";
import { processText } from "@/common/utils";
import { Data, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";

interface DescriptionProps {
  data: Data;
  config: StyleConfigs;
  isItalic?: boolean;
  className?: string;
  customStyles?: any;
}

const Description: React.FC<DescriptionProps> = ({
  data,
  isItalic = false,
  className = "text-center",
  customStyles = {},
}) => {
  const {
    state: { brand },
  } = useBrandContext();

  const { description } = data;
  const {
    config: {
      typography: { secondaryFont, secondaryFontWeight },
      colors: { textColor },
    },
  } = brand;

  return (
    <div
      className={`${className} ${isItalic ? "italic" : ""}`}
      style={{
        fontFamily: secondaryFont,
        color: textColor,
        fontWeight: secondaryFontWeight,
        fontSize: customStyles.fontSize,
        ...customStyles,
      }}
      dangerouslySetInnerHTML={{
        __html: processText(description, brand) ?? "",
      }}
    ></div>
  );
};

export default Description;
