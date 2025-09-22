// components/instant-branding/social-carousel/social-carousel-template-3/SocialCarouselTemplate3.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import BackgroundElement from "../../components/BackgroundElement";
import Title from "../../components/Title";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";
import HighlightedText from "../../components/HighlightedText";

export type SlidePosition = "first" | "middle" | "last";

interface SocialCarouselTemplate3Props extends ComponetProps {
  slidePosition?: SlidePosition;
  actualSlideIndex?: number;
}

function SocialCarouselTemplate3({
  data,
  brand,
  className = "",
  headshot,
  style,
  slidePosition,
  actualSlideIndex,
}: SocialCarouselTemplate3Props) {
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
      <div className="relative h-full w-full p-[6rem] flex flex-col ">
        <div className="h-full w-full flex items-center justify-left">
          {/*middle section*/}
          <div className="flex flex-col justify-left w-full">
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "6rem",
                  lineHeight: "1.1",
                  marginBottom: "1.5rem",
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
                  marginBottom: "2rem",
                }}
              />
            )}

            {data.screenshotUrl && (
              <div className="overflow-hidden ">
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
            className="absolute right-0 bottom-0"
            style={{
              fontSize: "1.75rem",
              color: brand.config.colors.textColor,
              lineHeight: 1.1,
            }}
          >
            Swipe &gt;&gt;
          </div>
        </div>
      </div>
    </div>
  );
}

// Middle Slide Layout - Content Focus
function MiddleSlideLayout({
  data,
  style,
  brand,
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
      <div className="relative h-full w-full p-[6rem] flex flex-col ">
        <div className="h-full w-full flex items-center justify-left">
          {/*middle section*/}
          <div className="flex flex-col justify-left w-full">
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "6rem",
                  lineHeight: "1.1",
                  marginBottom: "1.5rem",
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
                  marginBottom: "2rem",
                }}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-end relative">
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
            className="absolute right-0 bottom-0"
            style={{
              fontSize: "1.75rem",
              color: brand.config.colors.textColor,
              lineHeight: 1.1,
            }}
          >
            Swipe &gt;&gt;
          </div>
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
      <div className="relative h-full w-full p-[6rem] flex flex-col ">
        <div className="h-full w-full flex items-center justify-left">
          {/*middle section*/}
          <div className="flex flex-col justify-left w-full">
            {data.title && (
              <Title
                data={data}
                config={config}
                className="text-left"
                customStyles={{
                  fontSize: "6rem",
                  lineHeight: "1.1",
                  marginBottom: "1.5rem",
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
                  marginBottom: "2rem",
                }}
              />
            )}

            {data.highlightedText && (
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  fontSize: "1.75rem",
                  lineHeight: "1.1",
                  padding: "1.5rem 2.5rem",
                  borderRadius: "0",
                }}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-end">
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
    </div>
  );
}

export default SocialCarouselTemplate3;
