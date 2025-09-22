// SocialPostTemplate4.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import Description from "../../components/Description";
import BrandMark from "../../components/BrandMark";

const SocialPostTemplate4 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

  const { height, width } = getAssetDimensions("social-post");

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
        type="social-post"
        config={config}
        className={className}
      />

      <div className="relative h-full w-full p-[90px] flex-col items-center">
        {/* BrandMark */}
        <BrandMark
          data={data}
          config={config}
          classname="pb-[2.5rem]"
          customStyles={{
            imgHeight: "65px",
            imgWidth: "65px",
          }}
        />

        {/* Main content grid - for social post layout */}
        <div className="h-full flex-col flex justify-center text-left items-center">
          {data.title && (
            <Title
              data={data}
              config={config}
              customStyles={{
                textAlign: "left",
                fontSize: "4rem",
                lineHeight: "1.1",
                paddingBottom: "30px",
              }}
            />
          )}
          {data.description && (
            <Description
              data={data}
              config={config}
              customStyles={{
                textAlign: "left",
                fontSize: "2rem",
                lineHeight: "1.1",
                paddingBottom: "30px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialPostTemplate4;
