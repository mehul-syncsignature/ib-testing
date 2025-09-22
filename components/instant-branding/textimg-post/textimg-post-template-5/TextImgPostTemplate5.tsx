// TextImgPostTemplate5.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import HeadshotImage from "../../components/HeadshotImage";

const TextImgPostTemplate5 = ({
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

      <div className="relative h-full w-full">
        <div className="absolute h-full w-full">
          <HeadshotImage
            data={data}
            className="absolute left-[230px]"
            customStyles={{
              height: "100%",
            }}
          />
        </div>
        <div className="absolute h-full w-full">
          {/* Main content grid - for social post layout */}
          <div className="content-center p-[7.375rem] pt-[20rem] pr-[35rem]">
            {data.title && (
              <Title
                data={data}
                config={config}
                customStyles={{
                  textAlign: "left",
                  fontSize: "6rem",
                  lineHeight: "1.1",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextImgPostTemplate5;
