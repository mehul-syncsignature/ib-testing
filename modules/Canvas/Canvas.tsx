// Canvas.tsx
import { componentMap, ComponentType } from "@/common/utils/component-mapper";
import React, { Suspense } from "react";
import { useAssetContext } from "@/contexts/AssetContext";
import { useBrandContext } from "@/contexts/BrandContext";

export type CanvasProps = {
  type: ComponentType;
};

const Canvas = ({ type }: CanvasProps) => {
  const Component = componentMap[type];
  const {
    state: { brand },
  } = useBrandContext();
  const {
    state: { currentStyle, dataConfig },
  } = useAssetContext();

  // Add null check for Component
  if (!Component) {
    return <div>Component not found for type: {type}</div>;
  }

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      {currentStyle && (
        <Component
          data={{ ...dataConfig }}
          style={currentStyle}
          brand={brand}
        />
      )}
    </Suspense>
  );
};

export default Canvas;
