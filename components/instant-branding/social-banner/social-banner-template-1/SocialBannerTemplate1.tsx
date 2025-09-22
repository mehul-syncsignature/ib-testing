// components/instant-branding/social-banner/social-banner-template-1/SocialBannerTemplate1.tsx

import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";

import BackgroundElement from "../../components/BackgroundElement";
import BackdropElement from "../../components/BackdropElement";
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import Description from "../../components/Description";
import HighlightedText from "../../components/HighlightedText";
import HeadshotImage from "../../components/HeadshotImage";

function SocialBannerTemplate1({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) {
  const config = style.config;
  // Dimensions

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
      {/* background backdrop */}
      <div className="absolute right-0 top-0 h-full w-full">
        <div
          className="relative"
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Background elements */}
          <BackgroundElement
            config={config}
            className={className}
            type="social-banner"
          />
        </div>
      </div>
      <div
        className={`relative flex`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* JOIN OUR cta button at top left */}
        <div
          style={{
            width: `520px`,
            fontFamily: brand.config.typography.secondaryFont,
            paddingTop: "45px",
            paddingLeft: "45px",
          }}
        >
          {data.ctaText && <CTAButton data={data} config={config} />}
        </div>

        {/* Main content container with fixed width */}
        <div
          style={{
            width: "50%",
            alignContent: "center",
          }}
        >
          <div className="p-4">
            <div
              style={{
                display: `flex`,
              }}
            >
              {/* Left content area - titles */}
              {data.title && (
                <div style={{}}>
                  <Title
                    data={data}
                    config={config}
                    className="text-right"
                    customStyles={{
                      fontSize: "3rem",
                      lineHeight: "1.1",
                    }}
                  />
                </div>
              )}
              {/* Right content area - sub-titles */}
              <div className="ml-[20px]">
                {data.description && (
                  <Description
                    data={data}
                    config={config}
                    className="text-left"
                    customStyles={{
                      fontSize: "2rem",
                      lineHeight: "1.1",
                      marginBottom: "20px",
                    }}
                  />
                )}
                {data.highlightedText && (
                  <HighlightedText data={data} config={config} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Headshot with light effect */}

        <div
          style={{
            width: "30%",
            position: "relative",
          }}
        >
          {data?.imageUrl && (
            <>
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

export default SocialBannerTemplate1;
