// modules/Brand/components/RecentDesignsGrid.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// import TemplateWrapper from "@/components/TemplateWrapper";
import PremiumTemplate from "@/components/PremiumTemplate";
import { getAssetDimensions, calculateScaleToFit } from "@/common/utils";
import { useResponsive } from "../hooks/useResponsive";
import { useTemplateWidth } from "../hooks/useTemplateWidth";
import { AssetTypeKeys, isValidAssetType } from "../types";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAppContext } from "@/contexts/AppContext";
import { Loader2 } from "lucide-react";
import { useAssetContext } from "@/contexts/AssetContext";
// import { getAllStylesByType } from "../utils";

interface Design {
  id: string;
  asset_type: string;
  style_id: number;
  template_id: number;
  data: Record<string, unknown>;
}

export const RecentDesignsGrid = () => {
  const {
    state: { currentUser: user },
  } = useAppContext();
  const {
    state: { brand },
  } = useBrandContext();
  const templateContainerRef = useRef<HTMLDivElement>(null);
  const { columnCount } = useResponsive();
  const { templateWidth } = useTemplateWidth(templateContainerRef);
  const {
    // state: { templateId },
    setStyleId,
    setTemplateId,
    setCurrentAssetType,
    setDataConfig,
  } = useAssetContext();

  // const [fetchDesignsByBrand] = useGetDesignsByBrand();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<Set<string>>(new Set());

  const currentBrandId = brand.id;
  const isCreatingNew =
    currentBrandId === "default" || currentBrandId === "new";

  // Single effect to fetch designs
  useEffect(() => {
    const fetchDesigns = async () => {
      // Skip if no valid brand or already fetched
      if (
        !currentBrandId ||
        isCreatingNew ||
        !user ||
        fetchedRef.current.has(currentBrandId)
      ) {
        return;
      }

      setLoading(true);
      setError(null);
      fetchedRef.current.add(currentBrandId);

      try {
        // const fetchedDesigns = await fetchDesignsByBrand(currentBrandId);
        setDesigns([]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load designs";
        setError(errorMessage);
        fetchedRef.current.delete(currentBrandId);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const onRecentDesign = (design: Design) => {
    if (isValidAssetType(design.asset_type)) {
      setCurrentAssetType(design.asset_type);
      setStyleId(design.style_id);
      setTemplateId(design.template_id.toString());
      setDataConfig(design.data);
    }
  };

  const handleRetry = () => {
    if (currentBrandId) {
      fetchedRef.current.delete(currentBrandId);
      setError(null);
      // This will trigger the effect to re-run
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-500">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>Loading recent designs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-red-500 space-y-4">
        <p>Failed to load recent designs: {error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter valid designs directly in render
  const validDesigns = designs.filter((design: Design) =>
    isValidAssetType(design.asset_type)
  );

  if (validDesigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recent designs yet
          </h3>
          <p className="text-gray-500">
            Start creating your first design to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="max-h-[50vh] h-full overflow-auto scrollbar-thin-custom pb-5">
        <motion.div
          ref={templateContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {validDesigns.slice(0, 12).map((design: Design, index: number) => {
            const assetType = design.asset_type as AssetTypeKeys;
            const dimensions = getAssetDimensions(assetType);
            const gridGap = 16;
            const availableWidth =
              templateWidth > 0
                ? (templateWidth - gridGap * (columnCount - 1)) / columnCount
                : 400;

            const scale = calculateScaleToFit(
              dimensions.width,
              dimensions.height,
              availableWidth,
              150,
              20
            );

            // Get styles directly without caching
            // const designStyles = getAllStylesByType(assetType, templateId);
            // const designStyle = designStyles?.[design.style_id];

            return (
              <motion.div
                key={`recent-design-${design.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <Link
                  href={`/editor/${assetType}`}
                  onClick={() => onRecentDesign(design)}
                >
                  <PremiumTemplate
                    templateId={design.template_id}
                    assetType={assetType}
                    className="w-full cursor-pointer flex items-center justify-center rounded-[8px] border border-[#E8E8E8] bg-[#F1F3F3] overflow-hidden relative"
                  >
                    <div className="w-full h-[150px] flex items-center justify-center overflow-hidden">
                      <motion.div
                        style={{
                          width: dimensions.width,
                          height: dimensions.height,
                          transform: `scale(${scale})`,
                          transformOrigin: "center",
                          position: "relative",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 + index * 0.05,
                        }}
                      >
                        {/* <TemplateWrapper
                          assetType={assetType}
                          templateNumber={design.template_id}
                          // data={design.data}
                          style={designStyle}
                          brand={brand}
                        /> */}
                      </motion.div>
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Saved
                    </div>
                  </PremiumTemplate>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
