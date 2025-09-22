// TextImgPostTemplate1.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import HighlightedText from "../../components/HighlightedText";
import BrandMark from "../../components/BrandMark";

const TextImgPostTemplate1 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

  const { height, width } = getAssetDimensions("textimg-post");

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
      <BackgroundElement type="social-post" config={config} />

      <div className="absolute h-full w-full p-[3.75rem] flex-col flex justify-between">
        <div className="h-[20%] pl-[1.125rem] pb-[3.8rem] flex">
          {/* BrandMark */}
          <BrandMark
            data={data}
            config={config}
            customStyles={{
              imgHeight: "120px",
              imgWidth: "120px",
              socialhandleFontSize: "2rem",
              nameFontSize: "2.2rem",
            }}
          />
        </div>
        {/* Main content grid - for social post layout */}
        <div className="h-[80%] flex-col flex justify-between text-left">
          <div className="ml-[1.875rem] mr-[1.875rem]">
            {data.title && (
              <Title
                data={data}
                config={config}
                customStyles={{
                  textAlign: "left",
                  fontSize: "3.75rem",
                  lineHeight: "1.1",
                  paddingBottom: "28px",
                }}
              />
            )}

            {data.highlightedText && (
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  fontSize: "2.25rem",
                  maxWidth: "58.25rem",
                  lineHeight: "1.1",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                }}
              />
            )}
          </div>
          <div className="mt-[1.875rem] mb-[1.875rem]">
            <div
              className="rounded-[1.5rem] overflow-hidden object-contain"
              style={{
                boxShadow: `0px 12px 20px 0px rgba(0, 0, 0, 0.4)`,
              }}
            >
              <img
                src={`${data.screenshotUrl}`}
                className="h-[600px] w-[1000px]"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextImgPostTemplate1;
