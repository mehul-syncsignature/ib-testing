// components/instant-branding/social-carousel/social-carousel-template-4/SocialCarouselTemplate4.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import BackgroundElement from "../../components/BackgroundElement";
import Title from "../../components/Title";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";

export type SlidePosition = "first" | "middle" | "last";

interface SocialCarouselTemplate4Props extends ComponetProps {
  slidePosition?: SlidePosition;
  actualSlideIndex?: number;
}

function SocialCarouselTemplate4({
  data,
  brand,
  className = "",
  headshot,
  style,
  slidePosition,
  actualSlideIndex,
}: SocialCarouselTemplate4Props) {
  const config = style.config;
  const { height, width } = getAssetDimensions("social-carousel");

  // Always call the hook to avoid hook ordering issues
  const {
    state: { currentSlideIndex, slides },
  } = useAssetContext();

  // Determine slide position - use prop if provided, otherwise fall back to context
  let currentSlidePosition: SlidePosition = "first";
  const slideIndexForSvg =
    actualSlideIndex !== undefined ? actualSlideIndex : currentSlideIndex; // Use prop if provided, otherwise context

  if (slidePosition) {
    currentSlidePosition = slidePosition;
  } else {
    // Fallback to context for backward compatibility
    const totalSlides = slides.length;
    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === totalSlides - 1;

    if (isFirstSlide) currentSlidePosition = "first";
    else if (isLastSlide) currentSlidePosition = "last";
    else currentSlidePosition = "middle";
  }

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
      {/* Background Element */}
      <BackgroundElement
        config={config}
        className={className}
        type="social-carousel"
        slideIndex={slideIndexForSvg}
        slideCount={slides.length}
      />

      {/* Conditional Content Based on Slide Position */}
      {currentSlidePosition === "first" && (
        <FirstSlideLayout
          data={data}
          brand={brand}
          style={style}
          headshot={headshot}
          width={width}
          height={height}
        />
      )}

      {currentSlidePosition === "middle" && (
        <MiddleSlideLayout
          data={data}
          brand={brand}
          style={style}
          headshot={headshot}
          width={width}
          height={height}
        />
      )}

      {currentSlidePosition === "last" && (
        <LastSlideLayout
          data={data}
          brand={brand}
          style={style}
          headshot={headshot}
          width={width}
          height={height}
        />
      )}
    </div>
  );
}

// First Slide Layout - Hero Introduction
function FirstSlideLayout({
  data,
  style,
  width,
  height,
}: ComponetProps & { width: number; height: number }) {
  const config = style.config;
  return (
    <div
      className={"relative"}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      <div className="relative h-full w-full p-[5rem] flex flex-col ">
        <div className="h-full w-full flex items-center justify-left">
          {/*middle section*/}
          <div className="flex-col self-end justify-items-center w-full pb-[2rem]">
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "8rem",
                  lineHeight: "1.1",
                  marginBottom: "3rem",
                }}
              />
            )}

            {data.screenshotUrl && (
              <div
                className="overflow-hidden"
                style={{
                  // boxShadow: `0px 12px 20px 0px rgba(0, 0, 0, 0.4)`,
                  borderRadius: "45.375rem",
                  height: "45.375rem",
                  width: "45.375rem",
                }}
              >
                <img
                  src={`${data.screenshotUrl}`}
                  className="h-full w-full"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                ></img>
              </div>
            )}
          </div>
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
  );
}

// Middle Slide Layout - Content Focus
function MiddleSlideLayout({
  data,
  style,
  width,
  height,
}: ComponetProps & { width: number; height: number }) {
  const config = style.config;
  return (
    <div
      className={"relative"}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      <div className="relative h-full w-full p-[5rem] flex flex-col ">
        <div className="h-full w-full flex flex-col align-center justify-center">
          {/*middle section*/}
          {data.title && (
            <Title
              data={data}
              config={config}
              className="text-left"
              customStyles={{
                fontSize: "5rem",
                lineHeight: "1.1",
                marginBottom: "12px",
              }}
            />
          )}

          {data.description && (
            <Description
              data={data}
              config={config}
              className="text-left"
              customStyles={{
                fontSize: "3rem",
                lineHeight: "1.1",
                marginBottom: "12px",
              }}
            />
          )}

          {data.screenshotUrl && (
            <div className="h-[50%] mt-[1.875rem]">
              <div
                className="overflow-hidden"
                style={{
                  // boxShadow: `0px 12px 20px 0px rgba(0, 0, 0, 0.4)`,
                  borderRadius: "1rem",
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
          )}
        </div>
      </div>
    </div>
  );
}

// Last Slide Layout - CTA and Contact
function LastSlideLayout({
  data,
  width,
  style,
  height,
}: ComponetProps & { width: number; height: number }) {
  const config = style.config;
  return (
    <div
      className={"relative"}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      {data.backgroundimgUrl && (
        <div
          className="absolute h-full w-full"
          style={{
            backgroundImage: `url(${data.backgroundimgUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: data?.headshotOpacity, // Low opacity for subtle effect
            zIndex: 0,
          }}
        />
      )}
      <div className="relative h-full w-full p-[6rem] flex items-baseline justify-center ">
        {/*middle section*/}
        <div className="flex flex-col items-center justify-left w-full">
          {/* Title and basic info */}
          {data.title && (
            <Title
              data={data}
              config={config}
              className="text-center"
              customStyles={{
                fontSize: "5rem",
                lineHeight: "1.1",
                marginBottom: "8rem",
                paddingTop: "10rem",
              }}
            />
          )}
          {data.description && (
            <Description
              data={data}
              config={config}
              className="text-center"
              customStyles={{
                fontSize: "2.5rem",
                lineHeight: "1.1",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialCarouselTemplate4;
