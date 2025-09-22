/* eslint-disable @typescript-eslint/no-explicit-any */
// components/common/HeadshotImage.tsx
import { Data } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface HeadshotImageProps {
  data: Data;
  dimensions?: {
    width: number;
    height: number;
  };
  className?: string;
  borderRadius?: string;
  customStyles?: any;
}

const HeadshotImage: React.FC<HeadshotImageProps> = ({
  data,
  dimensions = { width: 500, height: 500 },
  className = "relative overflow-hidden rounded-lg",
  customStyles = {},
}) => {
  const { imageUrl, imageAlt, headshotPosition, headshotScale, headshotOpacity } = data;
  const {
    state: {
      brand: {
        config: { monochrome },
      },
    },
  } = useBrandContext();

  // Use template-specific positioning if available, otherwise fall back to global headshot
  const position = headshotPosition  || { x: 0, y: 0 };
  const scale = headshotScale ||  1;
  const opacity = headshotOpacity !== undefined ? headshotOpacity : 1;
  return (
    <div className="h-full w-full">
      {imageUrl && (
        <div
          className={cn("relative overflow-hidden w-full h-full", className)}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={imageAlt || ""}
              width={dimensions.width}
              height={dimensions.height}
              priority
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: `grayscale(${monochrome ? 1 : 0})`,
                opacity: opacity,
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease-out,filter 0.3s ease",
                ...customStyles,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HeadshotImage;
