// components/instant-branding/social-banner/social-banner-template-4/SocialBannerTemplate4.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackdropElement from "../../components/BackdropElement";
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";
import Description from "../../components/Description";
import HighlightedText from "../../components/HighlightedText";
import HeadshotImage from "../../components/HeadshotImage";
import BackgroundElement from "../../components/BackgroundElement";

function SocialBannerTemplate4({
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
          style={{
            width: "50%",
            alignItems: "center",
            justifyContent: "right",
            display: "flex",
          }}
        >
          <div className="p-4">
            <div
              className="flex flex-col"
              style={{
                alignSelf: "center",
              }}
            >
              {/* Title Component */}
              {data.title && (
                <div>
                  <Title
                    data={data}
                    config={config}
                    className="text-center"
                    customStyles={{
                      lineHeight: "1.1",
                      fontSize: "2.625rem",
                      paddingBottom: "10px",
                    }}
                  />
                </div>
              )}

              {/* Subtitle Component */}
              {data.subTitle && (
                <div>
                  <Subtitle
                    data={data}
                    config={config}
                    className="text-center"
                    customStyles={{
                      paddingBottom: "10px",
                      lineHeight: "1.1",
                      fontSize: "2rem",
                    }}
                  />
                </div>
              )}

              {/* Description Component */}
              {data.description && (
                <Description
                  data={data}
                  config={config}
                  isItalic={true}
                  className="text-center"
                  customStyles={{
                    fontSize: `1.25rem`,
                    paddingBottom: "10px",
                    lineHeight: `1.1`,
                  }}
                />
              )}

              {/* Highlighted Text Component */}
              <div className="flex justify-center">
                {data.highlightedText && (
                  <HighlightedText data={data} config={config} />
                )}
              </div>
            </div>
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
                customStyles={{
                  headshotBackdropPosition: "right bottom",
                }}
              />
              <HeadshotImage  data={data} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate4;
