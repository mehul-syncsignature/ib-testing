"use client";

import React, { useEffect, useRef, useState, createRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAssetContext } from "@/contexts/AssetContext";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAppContext } from "@/contexts/AppContext";
import { templateData } from "@/common/constants/template-data";
import { CarouselSlide, Data } from "@/contexts/AssetContext/types";
import { useCanvasRef, useCarouselRefs } from "@/hooks/canvas";
import TemplateWrapper from "@/components/TemplateWrapper";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSlidePosition } from "@/common/utils";
interface SocialCarouselWrapperProps {
  templateId?: string;
}

const SocialCarouselWrapper: React.FC<SocialCarouselWrapperProps> = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { canvasRef } = useCanvasRef();
  const { carouselSlideRefs } = useCarouselRefs();
  const [scale, setScale] = useState(1);
  
  const searchParams = useSearchParams();
  const designId = searchParams.get('designId');

  // Context hooks
  const {
    state: {
      currentSlideIndex,
      slides,
      currentStyle,
      templateId,
      currentAssetType,
    },
    setCurrentSlideIndex,
    setSlides,
  } = useAssetContext();

  const {
    state: { brand },
  } = useBrandContext();
  const {
    state: { headshot },
  } = useAppContext();

  useEffect(() => {
    const isCarouselAsset = currentAssetType === "social-carousel";
    
    if (!isCarouselAsset) {
      return;
    }

    if (!designId) {
      if (slides.length === 0 || slides.length === 1 && slides[0].id === "slide-1") {
        initializeCarouselSlides();
      } else {
        syncRefsWithSlides();
      }
    } else {
      if (slides.length > 0) {
        syncRefsWithSlides();
      }
    }
  }, [designId, currentAssetType, templateId, slides.length]);

  const syncRefsWithSlides = () => {
    carouselSlideRefs.length = 0;
    slides.forEach(() => 
      carouselSlideRefs.push(createRef<HTMLDivElement | null>())
    );
  };

  const initializeCarouselSlides = () => {
    const carouselData = templateData["social-carousel"]?.[templateId];

    if (!carouselData) {
      return;
    }

    const initialSlides: CarouselSlide[] = [
      {
        id: `slide-first-${Date.now()}`,
        templateId: templateId,
        data: { ...carouselData.first },
      },
      {
        id: `slide-middle-${Date.now() + 1}`,
        templateId: templateId,
        data: { ...carouselData.middle },
      },
      {
        id: `slide-last-${Date.now() + 2}`,
        templateId: templateId,
        data: { ...carouselData.last },
      },
    ];
    carouselSlideRefs.length = 0;
    initialSlides.map(() =>
      carouselSlideRefs.push(createRef<HTMLDivElement | null>())
    );
    setSlides(initialSlides);
    setCurrentSlideIndex(0);
  };

  const originalWidth = 1080;
  const originalHeight = 1350;
  const totalSlides = slides.length;

  const isLinkedInCarousel = currentAssetType === "social-carousel";

  const canAddSlideAt = (position: number) => {
    if (isLinkedInCarousel) {
      return position > 0 && position < totalSlides;
    }
    return true;
  };

  const canDeleteSlide = (slideIndex: number) => {
    if (isLinkedInCarousel) {
      return slideIndex !== 0 && slideIndex !== totalSlides - 1;
    }
    return totalSlides > 1;
  };

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current?.parentElement) {
        const parentWidth = wrapperRef.current.parentElement.clientWidth;
        const newScale = Math.min(1, (parentWidth / originalWidth) * 0.45);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const getCurrentSlideData = () => {
    return slides[currentSlideIndex]?.data || null;
  };

  const getSlideDataByIndex = (index: number): Data | null => {
    return slides[index]?.data || null;
  };

  const navigateToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
    }
  };

  const addSlideAt = (position: number) => {
    if (!canAddSlideAt(position)) {
      console.warn('Cannot add slide at position', position);
      return;
    }

    const carouselData = templateData["social-carousel"]?.[templateId];
    const middleSlideData = carouselData?.middle || {};
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      templateId: templateId,
      data: {
        ...middleSlideData,
        title: "Your content goes here",
        description: "Add your content description here",
      },
    };

    const newSlides = [...slides];
    newSlides.splice(position, 0, newSlide);
    
    carouselSlideRefs.splice(position, 0, createRef());
    
    setSlides(newSlides);
    setCurrentSlideIndex(position);
    
  };

  const deleteSlide = (slideIndex: number) => {
    if (!canDeleteSlide(slideIndex)) {
      console.warn('Cannot delete slide at index', slideIndex);
      return;
    }

    const newSlides = slides.filter((_, index) => index !== slideIndex);
    
    carouselSlideRefs.splice(slideIndex, 1);

    let newIndex = currentSlideIndex;
    if (slideIndex <= currentSlideIndex && currentSlideIndex > 0) {
      newIndex = currentSlideIndex - 1;
    } else if (currentSlideIndex >= newSlides.length) {
      newIndex = newSlides.length - 1;
    }
    
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, newIndex));
    
  };

  const currentSlideData = getCurrentSlideData();

  if (!currentSlideData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">Loading carousel...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full h-full flex flex-col gap-1">
      {/* Main carousel display */}
      <div className="h-[80%] flex items-center justify-center bg-[#FCFCFC] rounded-xl">
        <div
          style={{
            transform: scale < 1 ? `scale(${scale - .04})` : "none",
            transformOrigin: "center center",
          }}
        >
          <div ref={canvasRef}>
            <TemplateWrapper
              assetType="social-carousel"
              templateNumber={templateId}
              data={currentSlideData}
              style={currentStyle}
              brand={brand}
              headshot={headshot}
              slidePosition={getSlidePosition(currentSlideIndex, totalSlides)}
            />
          </div>
        </div>
      </div>

      {/* Horizontal slide strip with previews */}
      <div className="h-[20%] flex items-center bg-[#FCFCFC] p-3 rounded-lg gap-2 overflow-x-auto scrollbar-thin-custom">
        {slides.map((slide, index) => (
          <React.Fragment key={slide.id}>
            {/* Add button before each slide (except first) */}
            {index > 0 && canAddSlideAt(index) && (
              <div className="flex-shrink-0 flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => addSlideAt(index)}
                  className="w-5 h-5 rounded-full border-2 border-dashed border-blue-300 text-blue-500 hover:border-blue-500 hover:bg-blue-50 mb-2"
                  title="Add slide here"
                >
                  <Plus size={16} />
                </Button>
              </div>
            )}

            {/* Slide preview */}
            <div className="flex-shrink-0 flex flex-col items-center">
              {/* Slide thumbnail with actual template preview */}
              <div
                onClick={() => navigateToSlide(index)}
                className={`
                  relative w-25 h-32 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden group
                  ${
                    index === currentSlideIndex
                      ? "ring-2 ring-primary shadow-lg"
                      : "border border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }
                `}
              >
                {/* Template preview */}
                <div
                  className="w-full h-full"
                  style={{
                    transform: "scale(0.095)",
                    transformOrigin: "top left",
                    width: `${originalWidth}px`,
                    height: `${originalHeight}px`,
                  }}
                >
                  <TemplateWrapper
                    assetType="social-carousel"
                    templateNumber={templateId}
                    data={
                      index === currentSlideIndex
                        ? currentSlideData
                        : slide?.data
                    }
                    style={currentStyle}
                    brand={brand}
                    headshot={headshot}
                    slidePosition={getSlidePosition(index, totalSlides)}
                    actualSlideIndex={index}
                  />
                </div>
                {/* Delete button (appears on hover) */}
                {canDeleteSlide(index) && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(index);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete slide"
                  >
                    <Trash2 size={12} />
                  </Button>
                )}

                {/* Current slide indicator */}
                {index === currentSlideIndex && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>

              {/* Slide label */}
              <div className="text-xs text-center text-gray-600 mt-2 font-medium">
                {index === 0 && isLinkedInCarousel
                  ? "Intro"
                  : index === totalSlides - 1 && isLinkedInCarousel
                  ? "CTA"
                  : `Slide ${index + 1}`}{" "}
                of {totalSlides}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Hidden full-size slides for export */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        {slides.map((slide, index) => {
          const slideDataForExport = getSlideDataByIndex(index);
          return (
            <div
              key={`export-${slide.id}`}
              ref={carouselSlideRefs[index]}
              style={{
                width: `${originalWidth}px`,
                height: `${originalHeight}px`,
              }}
            >
              {slideDataForExport && (
                <TemplateWrapper
                  assetType="social-carousel"
                  templateNumber={templateId}
                  data={slideDataForExport}
                  style={currentStyle}
                  brand={brand}
                  headshot={headshot}
                  slidePosition={getSlidePosition(index, totalSlides)}
                  actualSlideIndex={index}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialCarouselWrapper;