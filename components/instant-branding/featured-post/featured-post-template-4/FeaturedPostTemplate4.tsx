// components/instant-branding/featured-post/featured-post-template-4/FeaturedPostTemplate4.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import HighlightedText from "../../components/HighlightedText";
import HeadshotImage from "../../components/HeadshotImage";
import BackgroundElement from "../../components/BackgroundElement";
import Subtitle from "../../components/Subtitle";
import BackdropElement from "../../components/BackdropElement";

const FeaturedPostTemplate4 = ({
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
      <BackgroundElement
        config={config}
        className={className}
        type="featured-post"
      />

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

      {/* Content section - Left side */}
      <div className="absolute inset-0 z-20">
        <div className="h-full w-[70%] content-center justify-items-left p-[5rem]">
          {/* Subtitle */}
          {data.subTitle && (
            <Subtitle
              data={data}
              config={config}
              className="text-left"
              customStyles={{
                fontSize: "2.5rem",
                lineHeight: "1.1",
                paddingBottom: "1.5rem",
                fontStyle: "italic",
              }}
            />
          )}

          {/* Title */}
          {data.title && (
            <Title
              data={data}
              config={config}
              className="pb-4"
              customStyles={{
                fontSize: "4.5rem",
                lineHeight: "1.1",
                paddingBottom: "1.5rem",
              }}
            />
          )}

          {/* Highlighted text */}
          {data.highlightedText && (
            <HighlightedText
              data={data}
              config={config}
              customStyles={{
                fontSize: "2.5rem",
                padding: "1rem 1.1rem",
                maxWidth: "45rem",
                textAlign: "left",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostTemplate4;
