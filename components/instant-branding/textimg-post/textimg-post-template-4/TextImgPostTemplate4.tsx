// TextImgPostTemplate4.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";
import HeadshotImage from "../../components/HeadshotImage";

const TextImgPostTemplate4 = ({
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

      <div className="absolute h-full w-full p-[3.75rem] pb-0 flex-col flex justify-between">
        <div className="h-[10%] pl-[1.125rem] pt-[1.125rem] pb-[3.8rem] flex">
          {/* BrandMark */}
          <BrandMark
            data={data}
            config={config}
            customStyles={{
              imgHeight: "60px",
              imgWidth: "60px",
              nameFontSize: "2rem",
            }}
          />
        </div>
        {/* Main content grid - for social post layout */}
        <div className="h-[90%] flex flex-col content-evenly">
          <div className="h-[35%] ml-[1.875rem] mr-[1.875rem] content-center">
            {data.title && (
              <Title
                data={data}
                config={config}
                customStyles={{
                  textAlign: "center",
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
                  textAlign: "center",
                  fontSize: "3.625rem",
                  lineHeight: "1.1",
                  paddingBottom: "30px",
                }}
              />
            )}
          </div>

          <div className="h-[65%] mt-[1.875rem] flex items-end ">
            <div className="overflow-hidden rounded-[1.5rem]">
              <HeadshotImage
                data={data}
                className="absolute top-[420px] -left-0"
                customStyles={{
                  height: "85%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextImgPostTemplate4;
