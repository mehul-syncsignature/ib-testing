// components/instant-branding/social-banner/social-banner-template-9/SocialBannerTemplate9.tsx

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

function SocialBannerTemplate9({
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

        {/* Left side - Headshot with light effect */}
        <div
          style={{
            width: "30%",
            position: "relative",
          }}
        >
          {data.imageUrl && (
            <>
              {/* Updated Headshot Backdrop Positioning */}
              <BackdropElement
                config={config}
                templateId="9"
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

        {/* main content */}
        <div
          style={{
            width: "50%",
            alignContent: "center",
          }}
        >
          <div className="p-5">
            {/* Title - "HEY THERE 👋" */}
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "3.125rem",
                  lineHeight: "1.1",
                  paddingBottom: "10px",
                }}
              />
            )}

            {/* Description text */}
            {data.description && (
              <Description
                data={data}
                config={config}
                isItalic={false}
                className="text-left"
                customStyles={{
                  fontSize: `1.875rem`,
                  lineHeight: `1.1`,
                  paddingBottom: "15px",
                }}
              />
            )}

            {/* Follow Me button */}
            {data.highlightedText && (
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  fontSize: "1.25rem",
                  padding: `16px 32px`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialBannerTemplate9;
