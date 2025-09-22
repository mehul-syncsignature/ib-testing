import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";

import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";

import HighlightedText from "../../components/HighlightedText";
import BackgroundElement from "../../components/BackgroundElement";
import Subtitle from "../../components/Subtitle";

function SocialBannerTemplate10({
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

      {/* Main content */}
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
            width: "900px",
            fontFamily: brand.config.typography.secondaryFont,
            paddingTop: "45px",
            paddingLeft: "45px",
          }}
        >
          {data.ctaText && <CTAButton data={data} config={config} />}
        </div>

        {/* Right section - Title, Description, and Follow Me button */}
        <div
          className="h-full w-full"
          style={{
            alignItems: "center",
            display: "flex",
            paddingRight: "80px",
          }}
        >
          <div
            className="flex-col items-end"
            style={{
              justifyItems: "right",
            }}
          >
            {/* Title */}
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-right"
                customStyles={{
                  fontSize: "5rem",
                  lineHeight: "1.1",
                  marginBottom: `8px`,
                }}
              />
            )}

            {/* Description text */}
            {data.subTitle && (
              <Subtitle
                data={data}
                config={config}
                className="text-right"
                customStyles={{
                  fontSize: "2rem",
                  lineHeight: "1.1",
                  marginBottom: `8px`,
                }}
              />
            )}

            {/* Highlighted text */}
            {data.highlightedText && (
              <div className="">
                <HighlightedText
                  data={data}
                  config={config}
                  customStyles={{
                    fontSize: "1.25rem",
                    padding: "12px 32px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate10;
