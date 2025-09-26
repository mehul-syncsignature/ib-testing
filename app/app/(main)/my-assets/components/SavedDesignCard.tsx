"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { isCarouselDesign } from "@/hooks/designs";
import { AssetTypeKeys, Data, Design } from "@/contexts/AssetContext/types";
import { Brand } from "@/contexts/BrandContext/types";
import TemplateWrapper from "@/components/TemplateWrapper";
import { getAssetDimensions } from "@/common/utils";
import { getAllStylesByType } from "../../design-templates/utils";
import { useTemplateWidth } from "../../design-templates/hooks/useTemplateWidth";

interface SavedDesignCardProps {
  design: Design;
  brand: Brand;
  index: number;
  onEdit: (design: Design) => void;
}

export const SavedDesignCard: React.FC<SavedDesignCardProps> = ({
  design,
  brand,
  index,
  onEdit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Replaced the useEffect/useState with the reusable useTemplateWidth hook
  const { templateWidth } = useTemplateWidth(containerRef);

  const dimensions = getAssetDimensions(design.assetType as AssetTypeKeys);

  // The scaling logic now uses `templateWidth` from the hook
  const scale = templateWidth > 0 ? templateWidth / dimensions.width : 0;
  const scaledHeight = dimensions.height * scale;

  const handleEdit = () => {
    // The carousel handling is done in the parent component (SavedDesignsGrid)
    // Parent will handle state updates and navigation synchronously
    onEdit(design);
  };

  const getTemplateData = (): Data => {
    if (isCarouselDesign(design)) {
      return design.data[0]?.data || ({} as Data);
    }
    return design.data as Data;
  };

  const getStyleConfig = () => {
    const allStyles = getAllStylesByType(
      design.assetType as AssetTypeKeys,
      design.templateId.toString()
    );
    return allStyles[design.styleId] || {};
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <div onClick={handleEdit} className="group block cursor-pointer">
        <div className="relative w-full cursor-pointer rounded-xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: scale > 0 ? `${scaledHeight}px` : `280px`,
            }}
          >
            {scale > 0 && (
              <div
                className="transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
                style={{
                  width: dimensions.width,
                  height: dimensions.height,
                  transform: `scale(${scale})`,
                  transformOrigin: "center",
                }}
              >
                <TemplateWrapper
                  assetType={design.assetType as AssetTypeKeys}
                  templateNumber={design.templateId}
                  data={getTemplateData()}
                  style={getStyleConfig()}
                  brand={brand}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
