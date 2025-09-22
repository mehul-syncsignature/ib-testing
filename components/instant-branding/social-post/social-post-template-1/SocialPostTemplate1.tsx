// SocialPostTemplate1.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";

const SocialPostTemplate1 = ({
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
      <div className="absolute h-full w-full p-[90px] ">
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
      </div>

      <div className="absolute h-full w-full p-[90px] ">
        {/* Main content grid - for social post layout */}
        <div className="h-full flex justify-center items-center text-left">
          {data.title && (
            <Title
              data={data}
              config={config}
              customStyles={{
                textAlign: "left",
                fontSize: "7.5rem",
                lineHeight: "1.1",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialPostTemplate1;
