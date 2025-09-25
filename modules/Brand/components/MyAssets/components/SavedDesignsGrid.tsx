"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isCarouselDesign, reconstructCarouselSlides } from "@/hooks/designs";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { AssetTypeKeys, Data, Design } from "@/contexts/AssetContext/types";
import { getAllStylesByType } from "../../BrandSection/utils";
import { getAssetDimensions } from "@/common/utils";
import { SavedDesignCard } from "./SavedDesignCard";
import { AssetTypeFilter } from "./AssetTypeFilter";
import { EmptyState } from "./EmptyState";

interface SavedDesignsGridProps {
  designs: Design[];
}

export const SavedDesignsGrid: React.FC<SavedDesignsGridProps> = ({
  designs,
}) => {
  const [selectedAssetType, setSelectedAssetType] = useState<
    AssetTypeKeys | "all"
  >("all");
  const router = useRouter();

  const {
    state: { brand },
  } = useBrandContext();
  const {
    setCurrentAssetType,
    setStyleId,
    setTemplateId,
    setDataConfig,
    setCurrentStyle,
    setSlides,
  } = useAssetContext();

  const filteredDesigns = useMemo(() => {
    return selectedAssetType === "all"
      ? designs
      : designs.filter((d) => d.assetType === selectedAssetType);
  }, [designs, selectedAssetType]);

  const designCounts = useMemo(() => {
    const counts: Record<AssetTypeKeys | "all", number> = {
      all: designs.length,
      "social-banner": 0,
      "social-post": 0,
      "quote-card": 0,
      "featured-post": 0,
      "mockup-post": 0,
      "textimg-post": 0,
      "social-carousel": 0,
    };
    designs.forEach((design) => {
      const assetType = design.assetType as AssetTypeKeys;
      if (counts.hasOwnProperty(assetType)) {
        counts[assetType]++;
      }
    });
    return counts;
  }, [designs]);

  const gridClasses = useMemo(() => {
    let classes = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ";

    if (selectedAssetType !== "all") {
      const dimensions = getAssetDimensions(selectedAssetType);
      const aspectRatio = dimensions.width / dimensions.height;
      if (aspectRatio > 2) {
        classes = "grid grid-cols-1 xl:grid-cols-2 gap-6";
      }
    }
    return classes;
  }, [selectedAssetType]);

  // const handleDeleteDesign = async (designId: string) => {
  //   try {
  //     await deleteDesign(designId);
  //     setDesigns(prev => prev.filter(d => d.id !== designId));
  //     toast.success('Design deleted successfully');
  //   } catch {
  //     toast.error('Failed to delete design');
  //   }
  // };

  const handleEditDesign = (design: Design) => {
    flushSync(() => {
      setCurrentAssetType(design.assetType as AssetTypeKeys);
      setStyleId(design.styleId);
      setTemplateId(design.templateId.toString());

      const allStyles = getAllStylesByType(
        design.assetType as AssetTypeKeys,
        design.templateId.toString()
      );
      const styleConfig = allStyles[design.styleId];
      if (styleConfig) {
        setCurrentStyle(styleConfig);
      }

      if (isCarouselDesign(design)) {
        const reconstructedSlides = reconstructCarouselSlides(
          design.data,
          design.templateId.toString()
        );
        setSlides(reconstructedSlides);
      } else {
        setDataConfig(design.data as Data);
      }
    });

    router.push(`/editor/${design.assetType}?designId=${design.id}`);
  };

  return (
    <div className="space-y-8">
      <AssetTypeFilter
        selectedType={selectedAssetType}
        onTypeChange={setSelectedAssetType}
        designCounts={designCounts}
      />
      <AnimatePresence mode="wait">
        {filteredDesigns.length === 0 ? (
          <EmptyState selectedType={selectedAssetType} />
        ) : (
          <motion.div
            key={`grid-${selectedAssetType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={gridClasses}
          >
            {filteredDesigns.map((design, index) => (
              <SavedDesignCard
                key={design.id}
                design={design}
                brand={brand}
                index={index}
                onEdit={handleEditDesign}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
