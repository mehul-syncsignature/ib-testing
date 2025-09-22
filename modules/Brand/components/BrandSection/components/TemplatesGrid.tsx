/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import TemplateWrapper from "@/components/TemplateWrapper";
import { getAssetDimensions } from "@/common/utils";
import { getAllStylesByType, getTemplateData } from "../utils";
import { useTemplateWidth } from "../hooks/useTemplateWidth";
import { ASSET_TEMPLATES } from "../constants";
import { AssetTypeKeys, isValidAssetType } from "../types";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { useUserAccessChecks } from "@/hooks/user";
import Link from "next/link";

interface TemplatesGridProps {
  currentAssetType: AssetTypeKeys;
  firstStyle: any;
}

// Coming Soon Component
// const ComingSoonPage = () => {
//   return (
//     <div className="flex items-center justify-center h-[60vh]">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
//         className="text-center"
//       >
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="mb-6"
//         >
//           <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
//             <Clock size={40} className="text-white" />
//           </div>
//         </motion.div>

//         <motion.h2
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="text-3xl font-bold text-gray-800 mb-3"
//         >
//           Coming Soon
//         </motion.h2>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="text-gray-600 text-lg mb-6 max-w-md mx-auto"
//         >
//           Social Carousel templates are currently in development. We&apos;re
//           working hard to bring you amazing templates soon!
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="text-sm text-gray-500"
//         >
//           Stay tuned for updates
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

export const TemplatesGrid = ({
  currentAssetType,
  firstStyle,
}: TemplatesGridProps) => {
  const templateContainerRef = useRef<HTMLDivElement>(null);
  const { templateWidth } = useTemplateWidth(templateContainerRef);
  const {
    state: { brand },
  } = useBrandContext();
  const {
    setStyleId,
    setTemplateId,
    setCurrentAssetType,
    setDataConfig,
    setCurrentStyle,
  } = useAssetContext();
  const { hasAccessToTemplate } = useUserAccessChecks();

  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show Coming Soon page for social-carousel
  // if (currentAssetType === "social-carousel") {
  //   return <ComingSoonPage />;
  // }

  const templates = ASSET_TEMPLATES[currentAssetType] || [];

  const dimensions = getAssetDimensions(currentAssetType);
  const aspectRatio = dimensions.width / dimensions.height;
  const isWideAsset = aspectRatio > 2;

  let gridClasses, columnCount;

  if (isWideAsset) {
    gridClasses = "grid grid-cols-1 xl:grid-cols-2 gap-4";
    columnCount = viewportWidth < 1280 ? 1 : 2;
  } else {
    let cols = 1;
    if (viewportWidth >= 1280) cols = 3;
    else if (viewportWidth >= 768) cols = 2;
    gridClasses = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";
    columnCount = cols;
  }

  const onTemplatePreview = (templateId: string) => {
    if (isValidAssetType(currentAssetType)) {
      setCurrentAssetType(currentAssetType);
      setStyleId(1);
      const allStyles = getAllStylesByType(currentAssetType, templateId);
      const selectedStyleConfig = allStyles[1];
      if (selectedStyleConfig) {
        setCurrentStyle(selectedStyleConfig);
      }
      setTemplateId(templateId);
      setDataConfig(getTemplateData(currentAssetType, templateId.toString()));
    }
  };

  // Get redirect URL for template
  const getTemplateRedirectUrl = () => {
    return `/editor/${currentAssetType}`;
  };

  return (
    <div className="max-h-[80vh] h-full overflow-auto scrollbar-thin-custom pb-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={`templates-${currentAssetType}`}
          ref={templateContainerRef}
          className={gridClasses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {templates.map((templateId, index) => {
            const dimensions = getAssetDimensions(currentAssetType);
            const gridGap = 16;
            const availableWidth =
              templateWidth > 0
                ? (templateWidth - gridGap * (columnCount - 1)) / columnCount
                : 480;

            const scale = availableWidth / dimensions.width;

            const scaledHeight = dimensions.height * scale;

            const showPremiumBadge = !hasAccessToTemplate(
              templateId,
              currentAssetType
            );

            return (
              <motion.div
                key={`${currentAssetType}-template-${templateId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.23, 1, 0.32, 1],
                }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <Link
                  href={getTemplateRedirectUrl()}
                  onClick={() => onTemplatePreview(String(templateId))}
                  prefetch={true}
                  className="group" // Add group for group-hover effects
                >
                  <div className="relative w-full cursor-pointer rounded-[8px] overflow-hidden bg-gray-50">
                    {/* This container now perfectly fits the scaled template */}
                    <div
                      className="w-full flex items-center justify-center"
                      style={{
                        height: `${scaledHeight}px`,
                      }}
                    >
                      <motion.div
                        className="transition-transform duration-300 ease-in-out"
                        style={{
                          width: dimensions.width,
                          height: dimensions.height,
                          transform: `scale(${scale})`,
                          transformOrigin: "center",
                          position: "relative",
                        }}
                      >
                        <TemplateWrapper
                          assetType={currentAssetType}
                          templateNumber={templateId}
                          data={getTemplateData(
                            currentAssetType,
                            templateId.toString()
                          )}
                          style={firstStyle}
                          brand={brand}
                          slidePosition={"first"}
                        />
                      </motion.div>
                    </div>
                    {showPremiumBadge && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-white text-primary px-2 py-0.5 rounded-sm text-xs font-bold flex items-center shadow-sm">
                          <Crown size={10} className="mr-1" />
                          Premium
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
