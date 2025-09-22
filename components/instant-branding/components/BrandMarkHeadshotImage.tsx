/* eslint-disable @typescript-eslint/no-explicit-any */
// components/common/BrandMarkHeadshotImageImage.tsx
import { getGradientStyle } from "@/common/constants/gradients";
import { useBrandContext } from "@/contexts/BrandContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface BrandMarkHeadshotImageProps {
  dimensions?: {
    width: number;
    height: number;
  };
  className?: string;
  borderRadius?: string;
  customStyles?: any;
}

const BrandMarkHeadshotImage: React.FC<BrandMarkHeadshotImageProps> = ({
  className = "relative overflow-hidden rounded-lg",
  customStyles = {},
  dimensions = { width: 500, height: 500 },
}) => {
  const {
    state: {
      brand: {
        config: {
          colors: { primaryColor, secondaryColor, highlightColor },
          monochrome,
        },
        brandMark: { headshotUrl, headshotGradient },
      },
    },
  } = useBrandContext();

  const gradient = getGradientStyle(
    headshotGradient,
    primaryColor,
    secondaryColor,
    highlightColor
  );

  return (
    <div
      className="w-full h-full"
      style={{
        background: `${gradient}`,
      }}
    >
      {/* {headshotUrl && ( */}
      <div className={cn("relative overflow-hidden w-full h-full", className)}>
        <Image
          src={headshotUrl || "https://assets.dev.instantbranding.ai/dummy.png"}
          alt={"headshotimg"}
          width={dimensions.width}
          height={dimensions.height}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `grayscale(${monochrome ? 1 : 0})`,
            transform: `translate(${0}px, ${0}px) scale(${1})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease-out, filter 0.3s ease",
            ...customStyles,
          }}
        />
      </div>
      {/* )} */}
    </div>
  );
};

export default BrandMarkHeadshotImage;
