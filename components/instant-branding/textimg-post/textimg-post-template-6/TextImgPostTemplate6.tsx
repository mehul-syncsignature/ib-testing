// TextImgPostTemplate6.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import HeadshotImage from "../../components/HeadshotImage";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";

const TextImgPostTemplate6 = ({
  data,
  brand,
  className = "",
  style,
}: ComponetProps) => {
  const config = style.config;

  const { height, width } = getAssetDimensions("textimg-post");
  //translate(245px, 190px) scale(1.3);

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

      {/* translate(-1.13636px, 14.7727px) scale(0.88) */}
      <div className="relative h-full w-full">
        <div className="absolute h-full w-full">
          <HeadshotImage
            data={data}
            className="absolute top-[450px] left-[200px] h-[88%]"
          />
        </div>
        <div className="absolute h-full w-full p-[3.75rem] pb-0 flex-col flex justify-between">
          <div className="h-[15%] pl-[1.125rem] pt-[1.125rem] pb-[3.8rem] flex">
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
          <div className="h-[85%] flex flex-col content-evenly">
            <div className="ml-[1.875rem] mr-[1.875rem] mt-[1.875rem]content-center">
              {data.title && (
                <Title
                  data={data}
                  config={config}
                  customStyles={{
                    textAlign: "left",
                    fontSize: "5rem",
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
                    fontSize: "3rem",
                    lineHeight: "1.1",
                    paddingBottom: "30px",
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

export default TextImgPostTemplate6;
