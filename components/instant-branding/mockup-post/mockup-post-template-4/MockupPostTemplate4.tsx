// components/instant-branding/social-banner/social-banner-template-2/MockupPostTemplate4.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
// import { Mockup4 } from "@/public/mockup-background-svgs"; // Replaced with AWS asset key
import { modifySvg } from "@/common/utils/modify-svg";

function MockupPostTemplate4({
  data,
  brand,
  className = "",
  style,
}: // headshot,
ComponetProps) {
  const config = style.config;

  // Dimensions

  const { height, width } = getAssetDimensions("mockup-post");

  const bgsvg = modifySvg("mockup4", `${width}px`, `${height}px`);

  // const showHeadshot = isElementVisible("headshot");

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
      <div className="absolute right-0 top-0 h-full ">
        <div
          className="relative h-full w-full flex items-center justify-end"
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <div
            className={cn("relative", className)}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div className="absolute w-full h-full flex">{bgsvg}</div>
          </div>
        </div>
      </div>

      <div
        className={`relative`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Content section */}
        <div
          style={{
            display: "flex",
            marginTop: "19.75rem",
            marginLeft: "25.375rem",
            width: "21.875rem",
            height: "42.625rem",
            alignItems: "center",
            border: `0.5rem solid ${brand.config.colors.highlightColor}`,
          }}
        >
          {data.title && (
            <Title
              data={data}
              config={config}
              className="text-left"
              customStyles={{
                fontSize: "2.5rem",
                lineHeight: "1.1",
                padding: "2.5rem",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MockupPostTemplate4;
