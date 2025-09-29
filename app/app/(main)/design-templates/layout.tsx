"use client";

import { isValidAssetType } from "@/common/utils";
import { useAssetContext } from "@/contexts/AssetContext";
import { BrandSectionHeader } from "@/app/app/(main)/design-templates/components/BrandSectionHeader";
import { GuidedSelectionHeader } from "@/app/app/(main)/design-templates/components/GuidedSelectionHeader";
import { CategoryCarousel } from "@/app/app/(main)/design-templates/components/CategoryCarousel";
import { TabNavigation } from "@/app/app/(main)/design-templates/components/TabNavigation";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const TemplateLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    state: { currentAssetType },
  } = useAssetContext();

  const params = useParams();
  const type = params.type as string;
  const { setCurrentAssetType } = useAssetContext();
  const pid = searchParams.get("pid");

  useEffect(() => {
    if (isValidAssetType(type)) {
      setCurrentAssetType(type);
    }
  }, [type]);

  const activeTab = "category";

  const handleCategoryChange = (selection: string) => {
    if (isValidAssetType(selection)) {
      const url = pid 
        ? `/app/design-templates/${selection}?pid=${pid}`
        : `/app/design-templates/${selection}`;
      router.push(url);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col p-6 bg-[#FCFCFC] rounded-[16px]">
        {pid ? <GuidedSelectionHeader /> : <BrandSectionHeader />}

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
