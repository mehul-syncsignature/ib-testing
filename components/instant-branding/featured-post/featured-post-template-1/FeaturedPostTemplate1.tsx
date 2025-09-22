// components/instant-branding/featured-post/featured-post-template-1/FeaturedPostTemplate1.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import HeadshotImage from "../../components/HeadshotImage";
import HighlightedText from "../../components/HighlightedText";
import BackdropElement from "../../components/BackdropElement";

const FeaturedPostTemplate1 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

  const { height, width } = getAssetDimensions("featured-post");

  return (
    <div
      className={cn("relative", className)}
      style={{
        background: processText(style.config.backgroundStyle.gradient, brand),
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      {/* Background elements */}
      <BackgroundElement type="featured-post" config={config} />

      {/* Headshot Layer */}
      {data.imageUrl && (
        <div className="absolute inset-0 z-10">
          <BackdropElement
            config={config}
            className={className}
            type="featured-post"
            customStyles={{
              headshotBackdropPosition: "right bottom",
            }}
          />
          <HeadshotImage
            data={data}
            className="absolute left-[560px] top-0"
            customStyles={{
              height: "118%",
              width: "auto",
            }}
          />
        </div>
      )}

      {/* Title Text Layer - Above headshot */}
      <div className="absolute inset-0 z-20">
        <div className="h-full w-[70%] content-center justify-items-center p-[5rem]">
          {data.title && (
            <Title
              data={data}
              config={config}
              className="text-center pb-4"
              customStyles={{
                fontSize: "5.375rem",
                lineHeight: "1.1",
              }}
            />
          )}
          {data.highlightedText && (
            <HighlightedText
              data={data}
              config={config}
              customStyles={{
                fontSize: "2.118rem",
                padding: "1rem 1.1rem",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostTemplate1;
