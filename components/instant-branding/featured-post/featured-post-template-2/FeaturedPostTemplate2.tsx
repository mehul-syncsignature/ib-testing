// components/instant-branding/featured-post/featured-post-template-2/FeaturedPostTemplate2.tsx

import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import Title from "../../components/Title";
import HighlightedText from "../../components/HighlightedText";

const FeaturedPostTemplate2 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

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
        <div className=" content-center w-full">
          <div className="flex-col items-center justify-items-center">
            {/* Left content area - titles */}
            {data.title && (
              <Title
                data={data}
                config={config}
                customStyles={{
                  fontSize: "8.075rem",
                  lineHeight: "1.1",
                  paddingBottom: "1rem",
                }}
              />
            )}
            {/* Right content area - sub-titles */}
            {data.highlightedText && (
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  fontSize: "2.118rem",
                  padding: "1rem 1.1rem",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostTemplate2;
