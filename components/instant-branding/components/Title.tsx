/* eslint-disable @typescript-eslint/no-explicit-any */
// Title.tsx
import React from "react";
import { processText } from "@/common/utils";
import { Data, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";

interface TitleProps {
  data: Data;
  config: StyleConfigs;
  className?: string;
  customStyles?: any;
}

const Title: React.FC<TitleProps> = ({
  data,
  className = "text-center",
  customStyles = {},
}) => {
  const {
    state: { brand },
  } = useBrandContext();

  const { title } = data;
  // const { textColor } = config;
  const {
    config: {
      typography: { primaryFont, primaryFontWeight },
    },
  } = brand;

  return (
    <div
      className={className}
      style={{
        fontFamily: primaryFont,
        color: brand.config.colors.textColor,
        fontWeight: primaryFontWeight,
        ...customStyles,
      }}
      dangerouslySetInnerHTML={{
        __html: processText(title, brand) ?? "",
      }}
    ></div>
  );
};

export default Title;
