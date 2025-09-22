// components/instant-branding/social-banner/social-banner-template-5/SocialBannerTemplate5.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackdropElement from "../../components/BackdropElement";
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import HeadshotImage from "../../components/HeadshotImage";
import BackgroundElement from "../../components/BackgroundElement";

function SocialBannerTemplate5({
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
            width: "520px",
            fontFamily: brand.config.typography.secondaryFont,
            paddingTop: "45px",
            paddingLeft: "45px",
          }}
        >
          {data.ctaText && <CTAButton data={data} config={config} />}
        </div>

        {/* Content section */}
        <div
          className="content-center"
          style={{
            width: "50%",
          }}
        >
          <div className="justify-space-evenly p-4">
            {/* Title Component */}
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-center"
                customStyles={{
                  fontSize: "3.375rem",
                  lineHeight: "1.1",
                }}
              />
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
              {/* Headshot backdrop */}
              <BackdropElement
                config={config}
                className={className}
                type="social-banner"
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

export default SocialBannerTemplate5;
