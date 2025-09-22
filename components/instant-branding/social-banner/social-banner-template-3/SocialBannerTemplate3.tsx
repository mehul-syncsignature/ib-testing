// components/instant-branding/social-banner/social-banner-template-3/SocialBannerTemplate3.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackdropElement from "../../components/BackdropElement";
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import Description from "../../components/Description";
import HighlightedText from "../../components/HighlightedText";
import HeadshotImage from "../../components/HeadshotImage";
import BackgroundElement from "../../components/BackgroundElement";

function SocialBannerTemplate3({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) {
  const config = style.config;

  const { height, width } = getAssetDimensions("social-banner");

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
      {/* Background and Backdrop Elements based on Template 2 structure */}
      <BackgroundElement
        config={config}
        className={className}
        type="social-banner"
      />

      <div
        className={`relative flex`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* CTA button section (Column 1) */}
        <div
          style={{
            width: "520px",
            paddingTop: "45px",
            paddingLeft: "45px",
          }}
        >
          {data.ctaText && <CTAButton data={data} config={config} />}
        </div>

        {/* Content section (Column 2) */}
        <div
          className="flex items-center"
          style={{
            width: "40%",
          }}
        >
          <div // Content block
            className="flex justify-space-evenly p-4"
          >
            {/* Inner content area */}
            <div className="flex flex-col">
              {/* Title and Description container */}
              {data.title && (
                <Title
                  data={data}
                  config={config}
                  className="text-left"
                  customStyles={{
                    fontSize: "2.625rem",
                    lineHeight: "1.1",
                    paddingBottom: "1rem",
                  }}
                />
              )}
              {data.description && (
                <Description
                  data={data}
                  config={config}
                  className="text-left"
                  customStyles={{
                    fontSize: "2rem",
                    lineHeight: "1.1",
                    paddingBottom: "1.1rem",
                  }}
                />
              )}
              {/* Highlighted text container */}
              {data.highlightedText && (
                <HighlightedText data={data} config={config} />
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            width: "30%",
            position: "relative",
          }}
        >
          {data.imageUrl && (
            <>
              <BackdropElement
                config={config}
                className={className}
                type="social-banner"
                customStyles={{
                  headshotBackdropPosition: "right bottom",
                }}
              />
              <HeadshotImage
                data={data}
                className="left-[15px]"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate3;
