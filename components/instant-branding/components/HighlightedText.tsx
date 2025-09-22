/* eslint-disable @typescript-eslint/no-explicit-any */
// HighlightedText.tsx
import React from "react";
import { processText } from "@/common/utils";
import { getButtonClasses } from "@/common/utils";
import { Data, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";

interface HighlightedTextProps {
  data: Data;
  config: StyleConfigs;

  customStyles?: any;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  data,
  config,
  customStyles = {},
}) => {
  const {
    state: { brand },
  } = useBrandContext();

  const { highlightedText } = data;
  const { highlightedTextStyle } = config;
  const {
    config: {
      colors: { primaryColor, secondaryColor, highlightColor },
      typography: { secondaryFont },
    },
  } = brand;

  // Highlighted text config
  const highlightedcolor: string =
    highlightedTextStyle?.highlightedTextbuttonColor === "primary"
      ? primaryColor
      : highlightedTextStyle?.highlightedTextbuttonColor === "secondary"
      ? secondaryColor
      : highlightColor;

  const highlightedTextfontcolor: string =
    highlightedTextStyle?.highlightedTextbuttonType == "normal"
      ? "#FFFFFF"
      : highlightedTextStyle?.highlightedTextbuttonTextColor === "secondary"
      ? secondaryColor
      : highlightedTextStyle?.highlightedTextbuttonColor === "primary"
      ? primaryColor
      : highlightColor;

  // Get button styles using the utility
  const buttonStyles = getButtonClasses(
    customStyles?.highlightedTextbuttonType ||
      highlightedTextStyle?.highlightedTextbuttonType ||
      "normal",
    highlightedcolor,
    highlightedTextfontcolor,
    highlightedTextStyle?.highlightedTextbuttonRadius || "0px"
  );

  return (
    <div
      className="text-center font-[700] h-fit w-[max-content] max-w-[40rem]"
      style={{
        ...buttonStyles.style,
        fontSize: "1.5rem",
        fontFamily: secondaryFont,
        padding: "14px",
        ...customStyles,
      }}
      dangerouslySetInnerHTML={{
        __html: processText(highlightedText, brand) ?? "",
      }}
    ></div>
  );
};

export default HighlightedText;
