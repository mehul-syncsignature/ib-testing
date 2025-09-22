/* eslint-disable @typescript-eslint/no-explicit-any */
// Subtitle.tsx
import { Data, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import React from "react";

interface SubtitleProps {
  data: Data;
  config: StyleConfigs;
  className?: string;
  customStyles?: any;
}

const Subtitle: React.FC<SubtitleProps> = ({
  data,
  className = "text-center",
  customStyles = {},
}) => {
  const {
    state: { brand },
  } = useBrandContext();

  const { subTitle } = data;
  const {
    config: {
      typography: { secondaryFont, secondaryFontWeight },
      colors: { textColor },
    },
  } = brand;

  return (
    <div
      className={className}
      style={{
        fontFamily: secondaryFont,
        color: textColor,
        fontWeight: secondaryFontWeight,
        // justifySelf: "center",
        ...customStyles,
      }}
      dangerouslySetInnerHTML={{ __html: subTitle ?? "" }}
    ></div>
  );
};

export default Subtitle;
