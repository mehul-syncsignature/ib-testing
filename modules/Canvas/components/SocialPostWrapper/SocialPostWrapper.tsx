// modules/Canvas/components/SocialPostWrapper/SocialPostWrapper.tsx

import React, { useRef, useEffect, useState } from "react";
import { ComponetProps } from "@/types";
import { useCanvasRef } from "@/hooks/canvas";
import TemplateWrapper from "@/components/TemplateWrapper";
import { useAssetContext } from "@/contexts/AssetContext";

export default function SocialPostWrapper({
  data,
  style,
  brand,
}: ComponetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { canvasRef } = useCanvasRef();
  const [scale, setScale] = useState(1);

  const {
    state: { templateId },
  } = useAssetContext();
  const currentAssetType = "social-post";

  // Social post dimensions
  const originalWidth = 1080;
  const originalHeight = 1350;

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const parentWidth = wrapperRef.current.parentElement?.clientWidth || 0;
        const newScale = Math.min(1, (parentWidth / originalWidth) * 0.5);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="flex items-center justify-center overflow-hidden">
        <div
          style={{
            transform: scale < 1 ? `scale(${scale})` : "none",
            transformOrigin: "center center",
            width: `${originalWidth}px`,
            height: `${originalHeight}px`,
          }}
        >
          <div ref={canvasRef}>
            <TemplateWrapper
              assetType={currentAssetType}
              templateNumber={templateId}
              data={data}
              style={{
                ...style,
                // config: {
                //   ...style.config,
                //   width: originalWidth,
                //   height: originalHeight,
                // },
              }}
              brand={brand}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
