// QuoteCardTemplate2.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";

const QuoteCardTemplate2 = ({
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

      <div className="relative h-full w-full p-[9.125rem] flex flex-col">
        {/*middle section*/}
        <div className="flex flex-grow items-center justify-center w-full">
          <div
            className="flex-col"
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "40px",
              minWidth: "640px",
              border: "4px solid black",
              boxShadow: `10px 10px 0px 0px rgba(0, 0, 0, 1)`,
            }}
          >
            {/* BrandMark */}
            <BrandMark
              config={config}
              data={data}
              classname="pb-[2.5rem]"
              customStyles={{
                color: "#000000",
                imgHeight: "70px",
                imgWidth: "70px",
              }}
            />

            {/* Main content grid - for social post layout */}
            <div className="h-full flex text-left">
              {data.description && (
                <Description
                  data={data}
                  config={config}
                  customStyles={{
                    textAlign: "left",
                    fontSize: "1.75rem",
                    lineHeight: "1.1",
                    color: "#121212",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCardTemplate2;
