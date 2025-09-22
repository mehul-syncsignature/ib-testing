"use client";

import React, { useRef, useEffect, useState } from "react";
import { ComponetProps } from "@/types";
import { useCanvasRef, useHeadshotRef } from "@/hooks/canvas";
import TemplateWrapper from "@/components/TemplateWrapper";
import { useAppContext } from "@/contexts/AppContext";
import { useAssetContext } from "@/contexts/AssetContext";
import BrandMarkHeadshotImage from "@/components/instant-branding/components/BrandMarkHeadshotImage";

export default function SocialBannerWrapper({
  data,
  style,
  brand,
}: ComponetProps) {
  const {
    state: { headshot },
  } = useAppContext();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { canvasRef } = useCanvasRef();
  const { headshotRef } = useHeadshotRef();

  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  const {
    state: { templateId },
  } = useAssetContext();
  const currentAssetType = "social-banner";

  const dimensions = {
    headshot: {
      height: 400,
      width: 400,
    },
  };

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const parentWidth = wrapperRef.current.parentElement?.clientWidth || 0;
        // LinkedIn banner dimensions (1584 x 396)
        const originalWidth = 1584;
        setContainerWidth(parentWidth);
        const newScale = Math.min(1, (parentWidth / originalWidth) * 0.8);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    // <div className="">
    <div ref={wrapperRef} className=" w-full flex justify-center relative ">
      {/* Simple LinkedIn mockup container */}
      <div
        className="rounded-lg shadow-md overflow-hidden bg-white "
        style={{
          width: containerWidth > 0 ? `${containerWidth}px` : "80%",
          maxWidth: "80%",
          aspectRatio: "1584 / 800", // Adjust height as needed
          position: "relative",
        }}
      >
        <div
          style={{
            transform: scale < 1 ? `scale(${scale})` : "none",
            transformOrigin: "top left",
            width: "1584px", // fixed width for scaling
            height: "600px", // fixed height for scaling
            position: "relative",
          }}
        >
          {/* LinkedIn banner area */}
          <div ref={canvasRef} className="relative">
            <TemplateWrapper
              headshot={headshot}
              assetType={currentAssetType}
              templateNumber={templateId}
              data={data}
              style={style}
              brand={brand}
            />
          </div>
          {/* Profile photo - positioned to overlap the banner */}

          <div className="absolute left-11 top-42.5 w-[320px] h-[320px] rounded-full overflow-hidden border-4 border-white shadow-md">
            <div ref={headshotRef} className="h-full w-full">
              <BrandMarkHeadshotImage
                className="object-cover w-full h-full"
                dimensions={dimensions.headshot}
              />
            </div>
          </div>
          <div className="relative top-30 left-16 pb-5">
            <div className="absolute">
              <h1 className="text-5xl font-bold text-gray-900">
                {brand?.brandMark?.name || "James Carter"}
              </h1>
              <p className="text-gray-700 md:text-3xl mt-1.5">
                Helping startups scale with AI-driven marketing strategies |
                Fractional CMO | Ex-Google
              </p>
              <div className="flex items-center text-gray-500 text-2xl mt-3">
                <span>Brooklyn, New York, United States</span>
                <span className="mx-2">•</span>
                <a
                  href="#"
                  className="text-[#0a66c2] font-medium hover:underline"
                >
                  Contact Info
                </a>
              </div>
              <div className="flex items-center text-gray-500 text-2xl mt-3">
                <span>825,394 followers</span>
                <span className="mx-2 ">•</span>
                <span className="text-[#0a66c2]">500+ connections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    //  </div>
  );
}
