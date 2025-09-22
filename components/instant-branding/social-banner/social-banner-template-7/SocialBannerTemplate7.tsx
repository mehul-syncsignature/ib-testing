import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils"; // Assuming processText is here

// Import reusable components used in Template4 and Template6
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";
import Description from "../../components/Description";
import HeadshotImage from "../../components/HeadshotImage";
import BackgroundElement from "../../components/BackgroundElement";
import BackdropElement from "../../components/BackdropElement";
import HighlightedText from "../../components/HighlightedText";

function SocialBannerTemplate7({
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
                templateId="7"
                className={className}
                customStyles={{
                  headshotBackdropPosition: "center bottom",
                  left: "37%",
                }}
              />

              {/* Headshot Image Section */}
              <HeadshotImage
                data={data}
                customStyles={{
                  height: "120%",
                }}
              />
            </>
          )}
        </div>

        {/* Main Content Section (Title, Subtitle, Description) */}
        {/* main content */}
        <div
          style={{
            width: "50%",
            alignContent: "center",
          }}
        >
          <div className="p-5">
            {data.subTitle && (
              <Subtitle
                data={data}
                config={config}
                className="text-center"
                customStyles={{
                  fontSize: "1.75rem",
                  lineHeight: "1.1",
                }}
              />
            )}

            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-center"
                customStyles={{
                  fontSize: "3.75rem",
                  lineHeight: "1.1",
                }}
              />
            )}

            {data.description && (
              <Description
                data={data}
                config={config}
                isItalic={false}
                className="text-center"
                customStyles={{
                  fontSize: "1.75rem",
                  lineHeight: "1.1",
                }}
              />
            )}

            {data.highlightedText && (
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  highlightedTextbuttonType: "bordered",
                  highlightedTextbuttonColor: "highlight",
                  fontSize: "1.374rem",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate7;
