// QuoteCardTemplate1.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";

const QuoteCardTemplate1 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

  const { height, width } = getAssetDimensions("quote-card");

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
      {data.backgroundimgUrl && (
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundImage: `url(${data.backgroundimgUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: data?.headshotOpacity, // Low opacity for subtle effect
            zIndex: 0,
          }}
        />
      )}
      {/* Background elements */}
      <BackgroundElement
        type="quote-card"
        config={config}
        className={className}
      />

      <div
        className={
          "relative h-full w-full p-[9.125rem] flex items-center justify-center"
        }
      >
        {/*middle section*/}
        <div className="flex w-full">
          <div
            className="flex-col"
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              padding: "40px",
              minWidth: "640px",
              boxShadow: `12px 12px 0px 0px ${brand.config.colors.secondaryColor}`,
            }}
          >
            {/* BrandMark */}
            <BrandMark
              config={config}
              data={data}
              classname="pb-[2.5rem]"
              customStyles={{
                color: "#000000",
                imgHeight: "100px",
                imgWidth: "100px",
              }}
            />

            {/* Main content grid - for social post layout */}
            {data.description && (
              <Description
                data={data}
                config={config}
                customStyles={{
                  textAlign: "left",
                  fontSize: "2.5rem",
                  lineHeight: "1.1",
                  color: "#121212",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCardTemplate1;
