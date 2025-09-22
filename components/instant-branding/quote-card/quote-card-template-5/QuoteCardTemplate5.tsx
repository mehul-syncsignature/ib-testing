// QuoteCardTemplate5.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";

const QuoteCardTemplate5 = ({
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
        {/* BrandMark */}
        <BrandMark
          data={data}
          config={config}
          customStyles={{
            imgHeight: "52px",
            imgWidth: "52px",
            nameFontSize: "2rem",
            socialhandleFontSize: "1.7rem",
          }}
        />

        <div className="h-full w-full flex items-center justify-center">
          {/*middle section*/}
          <div className="flex flex-grow items-center justify-bottom w-full ">
            <div
              className="flex-col"
              style={{
                minWidth: "640px",
              }}
            >
              {/* Main content grid - for social post layout */}
              <div className="flex-col text-center justify-items-center">
                <div
                  className="mb-2.5 top-[-4rem] left-[6rem] w-fit flex justify-center items-center"
                  style={{
                    background: brand.config.colors.highlightColor,
                    fontVariantCaps: "all-small-caps",
                  }}
                >
                  <div
                    className="font-bold px-5 pt-5 text-[330px]"
                    style={{
                      color: brand.config.colors.primaryColor, // Your teal color
                      lineHeight: "0.4",
                      alignSelf: "center",
                    }}
                  >
                    &ldquo;
                  </div>
                </div>
                {data.description && (
                  <Description
                    data={data}
                    config={config}
                    customStyles={{
                      fontSize: "5rem",
                      lineHeight: "1.1",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCardTemplate5;
