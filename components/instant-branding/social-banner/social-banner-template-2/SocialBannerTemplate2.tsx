// components/instant-branding/social-banner/social-banner-template-2/SocialBannerTemplate2.tsx

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

function SocialBannerTemplate2({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) {
  const config = style.config;

  const { height, width } = getAssetDimensions("social-banner");

  // Dimensions

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
        type="social-banner"
      />

      <div
        className={`relative flex`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* CTA button section */}

        <div
          style={{
            width: `680px`,
            fontFamily: brand.config.typography.secondaryFont,
            paddingTop: "45px",
            paddingLeft: "45px",
          }}
        >
          {data.ctaText && <CTAButton data={data} config={config} />}
        </div>

        {/* Content section */}
        <div
          style={{
            width: "50%",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div className="p-4">
            {/* Description before Title */}

            {data.description && (
              <Description
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  lineHeight: "1.1",
                  fontSize: "1.8rem",
                  paddingBottom: "5px",
                }}
              />
            )}

            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "3.65rem",
                  lineHeight: "1.1",
                  paddingBottom: "15px",
                }}
              />
            )}

            {/* Highlighted text at the bottom */}
            {data.highlightedText && (
              <div className="w-full">
                {data.highlightedText && (
                  <HighlightedText data={data} config={config} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Headshot Component */}
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
                type="social-banner"
                className={className}
                customStyles={{
                  headshotBackdropPosition: "right bottom",
                }}
              />
              <HeadshotImage data={data} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate2;
