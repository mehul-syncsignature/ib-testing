// TextImgPostTemplate3.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import Title from "../../components/Title";
import BackgroundElement from "../../components/BackgroundElement";

const TextImgPostTemplate3 = ({
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

      <div className="absolute h-full w-full p-[3.75rem] flex-col content-evenly">
        {/* Main content grid - for social post layout */}
        <div className="ml-[1.875rem] mr-[1.875rem] content-center">
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
        </div>
        <div className="mt-[1.875rem]">
          <div
            className="overflow-hidden rounded-[1.5rem]"
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
  );
};

export default TextImgPostTemplate3;
