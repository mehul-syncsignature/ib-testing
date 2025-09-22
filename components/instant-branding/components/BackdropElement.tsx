/* eslint-disable @typescript-eslint/no-explicit-any */
// BackdropElement.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { modifySvg } from "@/common/utils/modify-svg";
import { headshotSvgMap } from "@/common/constants/svg-map";
import { AssetType } from "@/components/TemplateWrapper/TemplateWrapper";
import { getAssetDimensions } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import { useBrandContext } from "@/contexts/BrandContext";
import { StyleConfigs } from "@/contexts/AssetContext/types";

interface BackdropElementProps {
  config: StyleConfigs;
  className?: string;
  customStyles?: any;
  type?: AssetType;
  templateId?: string;
}

const BackdropElement: React.FC<BackdropElementProps> = ({
  config,
  className = "",
  customStyles,
  type,
  templateId,
}) => {
  const {
    state: { brand },
  } = useBrandContext();

  const {
    state: { currentAssetType },
  } = useAssetContext();

  const assetType = type || currentAssetType;

  const { headshotBackdropConfig } = config;
  const { height, width } = getAssetDimensions(assetType);

  const {
    config: {
      colors: { primaryColor, secondaryColor, highlightColor },
    },
  } = brand;

  const svgGroup = [6, 7, 8, 9].includes(Number(templateId))
    ? "center"
    : "right";

  const getBackdropName = () => {
    const originalName = headshotBackdropConfig?.headshotBackdropName;
    if (originalName === "ellipse") {
      return svgGroup === "center" ? "fullellipse" : "ellipse";
    }
    return originalName;
  };

  const backdropName = getBackdropName();

  const svg = modifySvg(
    backdropName && headshotSvgMap[assetType][backdropName || ""],
    `${width}px`,
    `${height}px`,
    headshotBackdropConfig?.headshotBackdropColor === "primaryColor"
      ? primaryColor
      : headshotBackdropConfig?.headshotBackdropColor === "secondayColor"
      ? secondaryColor
      : highlightColor,
    customStyles?.headshotBackdropPosition
  );

  return (
    <div className="absolute right-0 top-0 h-full">
      <div
        className="relative h-full w-full flex items-center justify-end"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          className={cn("relative", className)}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            ...customStyles,
          }}
        >
          <div className="absolute w-full h-full flex">{svg}</div>
        </div>
      </div>
    </div>
  );
};

export default BackdropElement;
