// components/AssetBento/PublicAssetBento.tsx .

"use client";
import { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SectionConfig,
  UNIFIED_BENTO_CONFIG,
} from "@/common/constants/unified-bento-config";
import { useAppContext } from "@/contexts/AppContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthDialogHandle } from "@/components/Auth/AuthDialog";
import AssetBento from "@/components/AssetBento/components/AssetBento";

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

interface PublicAssetBentoProps {
  authDialogRef?: RefObject<AuthDialogHandle | null>;
}

const PublicAssetBento: React.FC<PublicAssetBentoProps> = ({
  authDialogRef,
}) => {
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

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize sectionsData with UNIFIED_BENTO_CONFIG if empty
  useEffect(() => {
    if (sectionsData.length === 0) {
      setSectionsData(UNIFIED_BENTO_CONFIG);
    }
    setIsInitializing(false);
  }, [sectionsData.length, setSectionsData]);

  useEffect(() => {
    router.prefetch(`/editor/${currentAssetType}`);
  }, [router]);

  if (isInitializing) {
    return <AssetBentoSkeleton />;
  }

  // Always use sectionsData since it's now guaranteed to have data
  const sectionsToRender = sectionsData;

  const handleAssetClick = (
    sectionId: string,
    assetKey: keyof SectionConfig["assets"]
  ) => {
    if (isSignedIn) {
      const section = sectionsToRender.find((s) => s.id === sectionId);
      const assetConfig = section?.assets[assetKey];

      if (!assetConfig) return;

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

      router.push(`/editor/${assetType}`);
    } else {
      authDialogRef?.current?.setAuthView("signUp");
      authDialogRef?.current?.open();
    }
  };

  return (
    <>
      <div className="bg-[#FCFCFC] rounded-[8px] p-6">
        {sectionsToRender.map((sectionConfig) => {
          // may be usefull in future
          // const visibility = getVisibilityConfig(sectionConfig.id);

          // if (!visibility?.isVisible) return null;

          return (
            <div key={sectionConfig.id} className="mb-4">
              <AssetBento
                sectionConfig={sectionConfig}
                brand={brand}
                userImageUrl={dataConfig.imageUrl}
                onAssetClick={(assetKey) =>
                  handleAssetClick(sectionConfig.id, assetKey)
                }
                isBlurred={false}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PublicAssetBento;
