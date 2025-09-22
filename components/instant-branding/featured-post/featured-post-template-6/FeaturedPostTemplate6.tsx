// components/instant-branding/featured-post/featured-post-template-6/FeaturedPostTemplate6.tsx

import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import Title from "../../components/Title";
import HighlightedText from "../../components/HighlightedText";
import Description from "../../components/Description";

const FeaturedPostTemplate6 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

  // Dimensions

  const { height, width } = getAssetDimensions("featured-post");

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
            type="featured-post"
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
        {/* Main content container with fixed width */}
        <div className="p-14.5 content-center w-full">
          <div className="flex-col align-middle">
            {/* Left content area - titles */}
            {data.title && (
              <Title
                data={data}
                config={config}
                customStyles={{
                  fontSize: "5rem",
                  lineHeight: "1.1",
                  paddingBottom: "1.5rem",
                  textAlign: "center",
                }}
              />
            )}

            {/* Left content area - titles */}
            {data.description && (
              <Description
                data={data}
                config={config}
                customStyles={{
                  fontSize: "3rem",
                  lineHeight: "1.1",
                  paddingBottom: "1.5rem",
                  textAlign: "center",
                }}
              />
            )}

            {/* Right content area - sub-titles */}
            {data.highlightedText && (
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  fontSize: "2.5rem",
                  padding: "1rem 1.1rem",
                  maxWidth: "45rem",
                  justifySelf: "center",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostTemplate6;
