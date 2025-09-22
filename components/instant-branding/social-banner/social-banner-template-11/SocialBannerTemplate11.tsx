// components/instant-branding/social-banner/social-banner-template-11/SocialBannerTemplate11.tsx

import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import CTAButton from "../../components/CTAButton";
import Title from "../../components/Title";
import Description from "../../components/Description";
import HighlightedText from "../../components/HighlightedText";

function SocialBannerTemplate11({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) {
  const config = style.config;
  const { height, width } = getAssetDimensions("social-banner");

  const {
    config: {
      colors: { secondaryColor, primaryColor },
      typography: { secondaryFont, secondaryFontWeight },
    },
  } = brand;

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

      {/* Main content grid */}
      <div
        className={`relative flex`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Left section - CTA button with person icon */}
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

        {/* Right section - Content container */}
        <div
          className="h-full w-full"
          style={{
            alignItems: "center",
            display: "flex",
            paddingRight: "65px",
          }}
        >
          <div
            className={"p-8 rounded-2xl"}
            style={{
              justifyItems: "right",
              display: "flex",
              justifyContent: "space-evenly",
              background: secondaryColor,
            }}
          >
            <div
              className="flex flex-col gap-5 items-end"
              style={{
                alignSelf: "right",
              }}
            >
              {/* Title */}
              {data.title && (
                <Title
                  data={data}
                  config={config}
                  className="text-right"
                  customStyles={{
                    color: "#ffffff",
                    lineHeight: "1.1",
                    fontSize: "2.625rem",
                  }}
                />
              )}

              {/* Highlighted text */}
              {data.highlightedText && (
                <HighlightedText
                  data={data}
                  config={config}
                  customStyles={{
                    padding: `12px`,
                    borderRadius: `4px`,
                    lineHeight: "1.1",
                    fontSize: "1.5rem",
                    maxWidth: "60rem",
                    backgroundColor: primaryColor,
                    fontFamily: secondaryFont,
                    color: brand.config.colors.textColor,
                    fontWeight: secondaryFontWeight,
                  }}
                />
              )}

              {/* Description */}
              {data.description && (
                <Description
                  data={data}
                  config={config}
                  isItalic={true}
                  className="text-right"
                  customStyles={{
                    color: "#ffffff",
                    fontSize: `1.25rem`,
                    lineHeight: `1.1`,
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

export default SocialBannerTemplate11;
