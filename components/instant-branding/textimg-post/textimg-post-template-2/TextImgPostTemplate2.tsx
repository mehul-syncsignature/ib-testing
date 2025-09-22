// TextImgPostTemplate2.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";
import BrandMark from "../../components/BrandMark";
import Subtitle from "../../components/Subtitle";
import Description from "../../components/Description";

const TextImgPostTemplate2 = ({
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
              socialhandleFontSize: "1.8rem",
              nameFontSize: "2rem",
            }}
          />
        </div>
        {/* Main content grid - for social post layout */}
        <div className="h-[90%] flex-col flex justify-between text-left">
          <div className="h-[50%] ml-[1.875rem] mr-[1.875rem] content-center">
            {data.subTitle && (
              <Subtitle
                data={data}
                config={config}
                customStyles={{
                  textAlign: "center",
                  fontSize: "2rem",
                  lineHeight: "1.1",
                  paddingBottom: "28px",
                }}
              />
            )}

            {data.title && (
              <Title
                data={data}
                config={config}
                customStyles={{
                  textAlign: "center",
                  fontSize: "4.5rem",
                  lineHeight: "1.1",
                  paddingBottom: "28px",
                }}
              />
            )}

            {data.description && (
              <Description
                data={data}
                config={config}
                customStyles={{
                  textAlign: "center",
                  fontSize: "2rem",
                  lineHeight: "1.1",
                  paddingBottom: "28px",
                }}
              />
            )}
          </div>

          <div className="h-[50%] mt-[1.875rem]">
            <div
              className="overflow-hidden"
              style={{
                boxShadow: `0px 12px 20px 0px rgba(0, 0, 0, 0.4)`,
                borderTopRightRadius: "1.5rem",
                borderTopLeftRadius: "1.5rem",
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

export default TextImgPostTemplate2;
