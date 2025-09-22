"use client";
import { BrandSectionHeader } from "./components/BrandSectionHeader";
import { CategoryCarousel } from "./components/CategoryCarousel";
import { TabNavigation } from "./components/TabNavigation";
// import { RecentDesignsGrid } from "./components/RecentDesignsGrid";
import { TemplatesGrid } from "./components/TemplatesGrid";
import { useEffect, useState } from "react";
import { isValidAssetType } from "./types";
import { useAssetContext } from "@/contexts/AssetContext";
import { getAllStylesByType } from "./utils";
import { useRouter } from "next/navigation";

const BrandSection = () => {
  const router = useRouter();

  const {
    state: { currentAssetType, templateId },
    setCurrentAssetType,
  } = useAssetContext();

  useEffect(() => {
    if (currentAssetType) {
      router.prefetch(`/editor/${currentAssetType}`);
    }
  }, [currentAssetType]);

  const [activeTab, setActiveTab] = useState<"recent" | "category">("category");

  // Get all styles for the current asset type
  const allStyles = getAllStylesByType(currentAssetType, templateId);
  const firstStyle = allStyles?.[1] || null;

  const handleCategoryChange = (selection: string) => {
    if (selection === "recent") {
      setActiveTab("recent");
    } else if (isValidAssetType(selection)) {
      setCurrentAssetType(selection);
      setActiveTab("category");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col p-6 bg-[#FCFCFC] rounded-[16px]">
        <BrandSectionHeader />

        <CategoryCarousel
          activeTab={activeTab}
          currentAssetType={currentAssetType}
          onCategoryChange={handleCategoryChange}
        />

        <TabNavigation
          activeTab={activeTab}
          currentAssetType={currentAssetType}
        />

        {/* {activeTab === "recent" ? (
          <RecentDesignsGrid />
        ) : ( */}
        <TemplatesGrid
          currentAssetType={currentAssetType}
          firstStyle={firstStyle}
        />
        {/* )} */}
      </div>
    </>
  );
};

export default BrandSection;
