// components/instant-branding/social-carousel/social-carousel-template-1/SocialCarouselTemplate1.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ComponetProps } from "../../../../types";
import { getAssetDimensions, processText } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import BackgroundElement from "../../components/BackgroundElement";
import Title from "../../components/Title";
import BrandMark from "../../components/BrandMark";
import Description from "../../components/Description";
import { BadgeCheck } from "lucide-react";
import HighlightedText from "../../components/HighlightedText";
import BrandMarkHeadshotImage from "../../components/BrandMarkHeadshotImage";

export type SlidePosition = "first" | "middle" | "last";

interface SocialCarouselTemplate1Props extends ComponetProps {
  slidePosition?: SlidePosition;
  actualSlideIndex?: number;
}

function SocialCarouselTemplate1({
  data,
  brand,
  className = "",
  headshot,
  style,
  slidePosition,
  actualSlideIndex,
}: SocialCarouselTemplate1Props) {
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
      <div className="relative h-full w-full p-[7rem] flex flex-col ">
        <div className="h-full w-full flex  items-center justify-center">
          {/*middle section*/}
          <div className="flex items-center justify-center w-full">
            <div
              className="flex-col"
              style={{
                minWidth: "640px",
              }}
            >
              {/* Main content grid - for social post layout */}
              <div className=" relative flex-col text-center">
                <div className="bg-[#FFFFFF] rounded-[0.5rem]">
                  {data.title && (
                    <Title
                      data={data}
                      config={config}
                      customStyles={{
                        fontSize: "6.875rem",
                        lineHeight: "1.1",
                        color: "#000000",
                        padding: "50px 43px",
                      }}
                    />
                  )}
                </div>
                <div
                  className="absolute flex bottom-[-4rem]"
                  style={{
                    justifySelf: "anchor-center",
                  }}
                >
                  {data.highlightedText && (
                    <HighlightedText
                      data={data}
                      config={config}
                      customStyles={{
                        lineHeight: "1.1",
                        fontSize: "1.75rem",
                        transform: "rotate(-5deg)",
                        padding: "1.5rem 2.5rem",
                        borderRadius: "0.45763rem",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
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
      <div className="relative h-full w-full p-[7rem] flex flex-col ">
        <div className="h-full w-full flex items-center justify-center">
          {/*middle section*/}
          <div className="flex items-center justify-center w-full">
            {/* Title and basic info */}
            <div className="flex-row ">
              {data.title && (
                <Title
                  data={data}
                  config={config}
                  className="text-left"
                  customStyles={{
                    fontSize: "6.5rem",
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
                    fontSize: "2.5rem",
                    lineHeight: "1.1",
                    marginBottom: "15px",
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

// Last Slide Layout - CTA and Contact
function LastSlideLayout({
  data,
  brand,
  width,
  style,
  height,
}: ComponetProps & { width: number; height: number }) {
  const config = style.config;
  const {
    brandMark: { name, socialHandle, headshotUrl },
  } = brand;

  return (
    <div
      className="relative h-full flex flex-col items-center text-center gap-30"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        padding: "9.5rem",
      }}
    >
      {data.title && (
        <div className=" relative flex-col">
          {data.title && (
            <div className="bg-[#FFFFFF] p-[30px] max-h-[400px] rounded-[0.5rem]">
              <Title
                data={data}
                config={config}
                customStyles={{
                  fontSize: "6.575rem",
                  lineHeight: "1.1",
                  color: "#000000",
                }}
              />
            </div>
          )}

          {data.highlightedText && (
            <div
              className="absolute flex bottom-[-4rem]"
              style={{
                justifySelf: "anchor-center",
              }}
            >
              <HighlightedText
                data={data}
                config={config}
                customStyles={{
                  lineHeight: "1.1",
                  fontSize: "1.75rem",
                  transform: "rotate(-5deg)",
                  padding: "1.5rem 2.5rem",
                  borderRadius: "0.45763rem",
                }}
              />
            </div>
          )}
        </div>
      )}
      {/* Large Headshot */}
      {headshotUrl && (
        <>
          <div className="relative">
            <div
              className="relative rounded-full overflow-hidden border-2 border-white shadow-md"
              style={{
                width: "32.5rem",
                height: "32.5rem",
                border: "4px solid #FFFFFF",
              }}
            >
              <BrandMarkHeadshotImage className="object-cover w-full h-full" />
            </div>
            {(headshotUrl || name) && (
              <div
                className="absolute flex bottom-[-5rem]"
                style={{
                  justifySelf: "anchor-center",
                }}
              >
                <div
                  className=" justify-center bg-[#FFFFFF] rounded-[0.5rem] min-w-[25rem] flex flex-col items-center"
                  style={{
                    padding: "1.75rem 3.75rem",
                  }}
                >
                  {name && (
                    <div
                      className="text-[2.5rem] pb-[0.5rem]"
                      style={{
                        lineHeight: "1.1",
                        fontWeight: "600",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {name}
                      <BadgeCheck
                        fill="#1DA1F2"
                        stroke="#FFFFFF"
                        width="2rem"
                        height="2rem"
                      ></BadgeCheck>
                    </div>
                  )}
                  <div
                    className="text-[1.75rem]"
                    style={{
                      lineHeight: "1.1",
                      fontWeight: "400",
                    }}
                  >
                    {socialHandle}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SocialCarouselTemplate1;
