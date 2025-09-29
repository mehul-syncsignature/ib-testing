// components/AssetBento/AssetBentoContainer.tsx

"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AssetBentoSection from "./components/AssetBento";
import { Skeleton } from "../ui/skeleton";
import AuthDialog, { AuthDialogHandle } from "../Auth/AuthDialog";
import {
  SectionConfig,
  UNIFIED_BENTO_CONFIG,
} from "@/common/constants/unified-bento-config";
import { useAppContext } from "@/contexts/AppContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import { saveUnauthenticatedBrand } from "@/utils/unauthenticatedStorage";

// type VisibilityConfig = {
//   isVisible: boolean;
//   isBlurred: boolean;
// };

const AssetBentoSkeleton = () => {
  return (
    <div className="p-6 max-w-[73vw] mx-auto">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="col-span-2 row-span-2">
          <Skeleton className="h-[800px] w-full rounded-lg" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default function AssetBentoContainer() {
  const router = useRouter();
  const {
    state: { brand },
  } = useBrandContext();

  const {
    state: { sectionsData, isSignedIn },
    setSectionsData,
  } = useAppContext();

  // NEW: Use simplified asset styles hook
  const {
    state: { dataConfig, currentAssetType },
    setCurrentAssetType,
    setStyleId,
    setTemplateId,
    setDataConfig,
  } = useAssetContext();

  const authDialogRef = useRef<AuthDialogHandle>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize sectionsData with UNIFIED_BENTO_CONFIG if empty
  useEffect(() => {
    if (sectionsData.length === 0) {
      setSectionsData(UNIFIED_BENTO_CONFIG);
    }
    setIsInitializing(false);
  }, [sectionsData.length, setSectionsData]);

  useEffect(() => {
    router.prefetch(`/app/editor/${currentAssetType}`);
  }, [router]);

  // const handleUpgradeClick = () => {
  //   authDialogRef?.current?.open();
  // };

  if (isInitializing) {
    return <AssetBentoSkeleton />;
  }

  // Always use sectionsData since it's now guaranteed to have data
  const sectionsToRender = sectionsData;

  const handleAssetClick = (
    sectionId: string,
    assetKey: keyof SectionConfig["assets"]
  ) => {
    const section = sectionsToRender.find((s) => s.id === sectionId);
    const assetConfig = section?.assets[assetKey];
    if (!assetConfig) return;

    // Save current brand changes to localStorage for unauthenticated users before navigation
    if (!isSignedIn && brand) {
      saveUnauthenticatedBrand(brand);
    }

    // NEW: Set asset configuration using simplified actions
    const assetType = assetConfig.assetType as AssetTypeKeys;
    // Set the asset type first
    setCurrentAssetType(assetType);
    // Then set the style and template for that asset type
    setStyleId(assetConfig.styleKey, assetType);
    setTemplateId(assetConfig.templateId, assetType);

    // Update data with user's image if available
    const updatedData = {
      ...assetConfig.data,
      imageUrl: brand?.brandMark?.headshotUrl || assetConfig.data.imageUrl,
    };
    setDataConfig(updatedData);
    router.push(`/app/editor/${assetType}`);
  };

  // Check if we're using default sections (not AI-generated)
  // const isUsingDefaultSections = sectionsToRender.some((section) =>
  //   section.id.startsWith("section-")
  // );

  return (
    <>
      <AuthDialog ref={authDialogRef} />
      <div className="bg-[#FCFCFC] rounded-[8px] p-6">
        {sectionsToRender.map((sectionConfig) => {
          // may be usefull in future
          // const visibility = getVisibilityConfig(sectionConfig.id);

          // if (!visibility?.isVisible) return null;

          return (
            <div key={sectionConfig.id} className="mb-4">
              <AssetBentoSection
                sectionConfig={sectionConfig}
                brand={brand}
                userImageUrl={dataConfig.imageUrl}
                onAssetClick={(assetKey) =>
                  handleAssetClick(sectionConfig.id, assetKey)
                }
                isBlurred={false}
              />
              {/* Show upgrade prompt for first section when using default sections */}
              {/* {index === 0 && !isPremiumUser && isUsingDefaultSections && (
                <div className="my-20 text-center">
                  <div className="rounded-lg p-8 mx-auto w-full">
                    <h2 className="text-4xl font-bold mb-3">
                      Your entire personal brand content library. One payment.
                    </h2>
                    <p className="mb-6 text-lg">
                      Pay once, get full access to your brand kit, editable
                      templates, and more for just{" "}
                      <span className="font-semibold">$49</span>
                    </p>
                    <Button onClick={handleUpgradeClick}>
                      DOWNLOAD BRAND ASSETS
                    </Button>
                  </div>
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </>
  );
}
