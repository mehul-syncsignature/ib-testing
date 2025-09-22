// components/instant-branding/social-banner/social-banner-template-6/SocialBannerTemplate6.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackdropElement from "../../components/BackdropElement";
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import HeadshotImage from "../../components/HeadshotImage";
import BackgroundElement from "../../components/BackgroundElement";
import HighlightedText from "../../components/HighlightedText";

function SocialBannerTemplate6({
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

      {/* Highlighted text bar at bottom */}
      <div
        className={`relative flex`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          className="w-full flex justify-end absolute"
          style={{
            backgroundColor: brand.config.colors.highlightColor,
            bottom: "57px",
          }}
        >
          {data.highlightedText && (
            <HighlightedText
              data={data}
              config={config}
              customStyles={{
                fontSize: `1.438rem`,
                highlightedTextbuttonType: "bordered",
                highlightedTextColor: "primary",
                border: "0px",
              }}
            />
          )}
        </div>

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

          {/* headshot */}
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
                  templateId="6"
                  className={className}
                  customStyles={{
                    left: "37%",
                    headshotBackdropPosition: "center center",
                  }}
                />
                <HeadshotImage
                  data={data}
                  customStyles={{
                    height: "112%",
                  }}
                />
              </>
            )}
          </div>

          {/* Content section */}
          <div
            style={{
              width: "50%",
            }}
          >
            <div
              className="flex flex-col p-5 pt-12"
              style={{
                alignSelf: "start",
              }}
            >
              {/* Title Component */}
              {data.title && (
                <Title
                  data={data}
                  config={config}
                  className="text-center"
                  customStyles={{
                    fontSize: "2.813rem",
                    fontFamily: brand.config.typography.primaryFont,
                    fontWeight: brand.config.typography.primaryFontWeight,
                    lineHeight: "1.1",
                    alignContent: "space-evenly",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate6;
