// QuoteCardTemplate6.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import Description from "../../components/Description";

const QuoteCardTemplate6 = ({
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

      <div className="relative h-full w-full p-[90px] ">
        <div className="h-full w-full flex items-center justify-center">
          {/*middle section*/}
          <div className="flex flex-grow items-center justify-center w-full">
            <div
              className="flex-col"
              style={{
                minWidth: "640px",
              }}
            >
              {/* Main content grid - for social post layout */}
              <div className=" relative flex-col text-center">
                <div
                  className="absolute top-[-4rem] left-[6rem] flex justify-center items-center"
                  style={{
                    background: brand.config.colors.highlightColor,
                    fontVariantCaps: "all-small-caps",
                  }}
                >
                  <div
                    className="font-bold px-3 pt-4 text-[200px]"
                    style={{
                      color: brand.config.colors.primaryColor, // Your teal color
                      lineHeight: "0.4",
                      alignSelf: "center",
                    }}
                  >
                    “
                  </div>
                </div>

                <div className="bg-[#FFFFFF]">
                  {data.description && (
                    <Description
                      data={data}
                      config={config}
                      customStyles={{
                        fontSize: "3rem",
                        lineHeight: "1.1",
                        color: "#000000",
                        padding: "50px 43px",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCardTemplate6;
