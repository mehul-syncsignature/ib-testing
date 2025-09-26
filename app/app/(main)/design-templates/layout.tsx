"use client";

import { isValidAssetType } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import { BrandSectionHeader } from "@/app/app/(main)/design-templates/components/BrandSectionHeader";
import { CategoryCarousel } from "@/app/app/(main)/design-templates/components/CategoryCarousel";
import { TabNavigation } from "@/app/app/(main)/design-templates/components/TabNavigation";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const TemplateLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const {
    state: { currentAssetType },
  } = useAssetContext();

  const params = useParams();
  const type = params.type as string;
  const { setCurrentAssetType } = useAssetContext();

  useEffect(() => {
    if (isValidAssetType(type)) {
      setCurrentAssetType(type);
    }
  }, [type]);

  const activeTab = "category";

  const handleCategoryChange = (selection: string) => {
    if (isValidAssetType(selection)) {
      router.push(`/app/design-templates/${selection}`);
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
        {children}
      </div>
    </>
  );
};

export default TemplateLayout;
