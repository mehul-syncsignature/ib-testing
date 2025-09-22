// components/instant-branding/social-carousel/social-carousel-template-2/SocialCarouselTemplate2.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import BackgroundElement from "../../components/BackgroundElement";
import Title from "../../components/Title";
import BrandMark from "../../components/BrandMark";
import Subtitle from "../../components/Subtitle";
import Description from "../../components/Description";

export type SlidePosition = "first" | "middle" | "last";

interface SocialCarouselTemplate2Props extends ComponetProps {
  slidePosition?: SlidePosition;
  actualSlideIndex?: number;
}

function SocialCarouselTemplate2({
  data,
  brand,
  className = "",
  headshot,
  style,
  slidePosition,
  actualSlideIndex,
}: SocialCarouselTemplate2Props) {
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
  brand,
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
      <div className="relative h-full w-full p-[4rem] flex flex-col ">
        {/* BrandMark */}
        <div
          style={{
            alignSelf: "end",
            fontSize: "1.75rem",
            color: brand.config.colors.textColor,
            lineHeight: 1.1,
          }}
        >
          Swipe &gt;&gt;
        </div>
        <div className="h-full w-full flex items-center justify-left">
          {/*middle section*/}
          <div className="flex justify-left w-full">
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "6rem",
                  lineHeight: "1.1",
                  marginBottom: "12px",
                }}
              />
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
  brand,
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
      <div className="relative h-full w-full p-[4rem] flex flex-col ">
        <div className="flex justify-between relative">
          {/* BrandMark */}
          <BrandMark
            data={data}
            config={config}
            customStyles={{
              imgHeight: "70px",
              imgWidth: "70px",
            }}
          />
          <div
            className="absolute right-0 top-0"
            style={{
              fontSize: "1.75rem",
              color: brand.config.colors.textColor,
              lineHeight: 1.1,
            }}
          >
            Swipe &gt;&gt;
          </div>
        </div>

        <div className="h-full w-full flex  flex-col items-left justify-center">
          {/*middle section*/}
          {data.subTitle && (
            <Subtitle
              data={data}
              config={config}
              className="text-left"
              customStyles={{
                fontSize: "5rem",
                lineHeight: "1.1",
                marginBottom: "1.5rem",
              }}
            />
          )}

          {data.screenshotUrl && (
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
      <div className="relative h-full w-full p-[4rem] flex flex-col ">
        <div className="flex justify-between">
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

        <div className="h-full w-full flex items-center justify-center">
          {/*middle section*/}
          <div className="flex flex-col items-left justify-left w-full">
            {/* Title and basic info */}
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "5.7rem",
                  lineHeight: "1.1",
                  marginBottom: "1rem",
                }}
              />
            )}

            {data.description && (
              <Description
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "2.5rem",
                  lineHeight: "1.1",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialCarouselTemplate2;
