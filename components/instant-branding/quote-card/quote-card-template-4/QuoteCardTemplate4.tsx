// QuoteCardTemplate4.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";

const QuoteCardTemplate4 = ({
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
      {/* Background elements */}
      <BackgroundElement
        type="quote-card"
        config={config}
        className={className}
      />

      <div className="relative h-full w-full p-[5.65rem] flex items-center justify-center">
        {/*middle section*/}
        <div className="flex flex-grow items-center justify-bottom w-full ">
          <div
            className="flex-col"
            style={{
              minWidth: "640px",
            }}
          >
            {/* Main content grid - for social post layout */}
            <div className="h-full flex text-left pb-[2.5rem]">
              {data.description && (
                <Description
                  data={data}
                  config={config}
                  customStyles={{
                    textAlign: "left",
                    fontSize: "2.3rem",
                    lineHeight: "1.1",
                  }}
                />
              )}
            </div>

            {/* BrandMark */}
            <BrandMark
              data={data}
              config={config}
              customStyles={{
                imgHeight: "70px",
                imgWidth: "70px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCardTemplate4;
