/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ExportModal from "./components/ExportModal/ExportModal";
import { Download } from "lucide-react";
import TemplateWrapper from "@/components/TemplateWrapper";
import { templateData } from "@/common/constants/template-data";
import PremiumTemplate from "@/components/PremiumTemplate";
import { useUserAccessChecks } from "@/hooks/user";
import { getAssetDimensions, calculateScaleToFit } from "@/common/utils";
import SideBar from "@/components/SideBar";
import AuthDialog from "@/components/Auth";
import { AuthDialogHandle } from "@/components/Auth/AuthDialog";
import { useUpsertDesign, normalizeDesignForSave } from "@/hooks/designs";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { getAllStylesByType } from "../Brand/components/BrandSection/utils";
import { useBrandContext } from "@/contexts/BrandContext";

const StylePanel: React.FC = () => {
  const {
    state: { brand },
  } = useBrandContext();

  const params = useParams();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const itemContainerRef = useRef<HTMLDivElement>(null);

  const [selectedStyleKey, setSelectedStyleKey] = useState<number | null>(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dynamicScale, setDynamicScale] = useState<number>(1);

  const {
    state: { isSignedIn },
  } = useAppContext();
  const {
    state: {
      currentAssetType,
      styleId: currentStyleKey,
      slides,
      templateId: currentTemplateId,
      dataConfig,
    },
    setCurrentAssetType,
    setStyleId,
    setCurrentStyle, // Add setCurrentStyle
  } = useAssetContext();

  const [upsertDesign, { loading: savingDesign, error: savingDesignError }] =
    useUpsertDesign();

  const authDialogRef = useRef<AuthDialogHandle>(null);
  // Get all styles for the current asset type
  const allStyles = getAllStylesByType(currentAssetType, currentTemplateId);

  const { hasAccessToTemplate } = useUserAccessChecks();

  const FIXED_CONTAINER_HEIGHT = 180;

  const urlAssetType =
    (params?.type as string) || currentAssetType || "social-banner";

  useEffect(() => {
    if (urlAssetType !== currentAssetType) {
      setCurrentAssetType(urlAssetType as AssetTypeKeys);
    }
  }, [urlAssetType, currentAssetType]);

  useEffect(() => {
    if (currentStyleKey !== null && currentStyleKey !== undefined) {
      setSelectedStyleKey(currentStyleKey);
    }
  }, [currentStyleKey]);

  const stylesArray = Object.entries(allStyles || {}).map(([key, config]) => ({
    style_key: parseInt(key),
    config,
  }));

  const handleOnClick = (styleKey: number): void => {
    setSelectedStyleKey(styleKey);
    setStyleId(styleKey);

    // Also set the current style from the styles object
    const selectedStyleConfig = allStyles[styleKey];
    if (selectedStyleConfig) {
      setCurrentStyle(selectedStyleConfig);
    }
  };

  useEffect(() => {
    const updateContainerWidth = (): void => {
      if (itemContainerRef.current) {
        const containerWidth = itemContainerRef.current.clientWidth - 20;
        const containerHeight = FIXED_CONTAINER_HEIGHT - 20;

        const templateDimensions = getAssetDimensions(currentAssetType);
        const scale = calculateScaleToFit(
          templateDimensions.width,
          templateDimensions.height,
          containerWidth,
          containerHeight,
          10
        );

        setDynamicScale(scale);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(updateContainerWidth);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
      resizeObserver?.disconnect();
    };
  }, [currentAssetType]);

  const handleExportClick = () => {
    if (isSignedIn) {
      if (hasAccessToTemplate(Number(currentTemplateId), currentAssetType)) {
        setShowExportModal(true);
      } else {
        authDialogRef?.current?.setAuthView("signUp");
        authDialogRef?.current?.open();
      }
    } else {
      authDialogRef?.current?.setAuthView("signUp");
      authDialogRef?.current?.open();
    }
  };

  const getSelectedTemplateName = (): string => {
    if (selectedStyleKey === null) return currentAssetType;
    return `${currentAssetType}-template-${currentTemplateId}-style-${selectedStyleKey}`;
  };

  const handleSaveDesign = async () => {
    if (!isSignedIn) {
      authDialogRef?.current?.setAuthView("signUp");
      authDialogRef?.current?.open();
      return;
    }

    if (!brand?.id) {
      toast.error("Please select or create a brand first");
      return;
    }

    try {
      const designId = searchParams.get("designId");

      const designData = {
        ...(designId ? { id: designId } : {}), // Include ID for updates
        brandId: brand.id,
        assetType: currentAssetType,
        styleId: selectedStyleKey ?? currentStyleKey,
        templateId: Number(currentTemplateId),
        data: normalizeDesignForSave(currentAssetType, dataConfig, slides),
      };

      const result = await upsertDesign(designData);

      if (result.action === "created") {
        toast.success("Design saved successfully!");
      } else {
        toast.success("Design updated successfully!");
      }
    } catch (error) {
      console.error("Save design error:", error);
      toast.error("Failed to save design. Please try again.");
    }
  };

  const header = (
    <div className="flex gap-2 p-4">
      <Button
        className="flex-1"
        variant="outline"
        onClick={handleSaveDesign}
        disabled={savingDesign}
      >
        {savingDesign ? "Saving..." : "Save"}
      </Button>
      <Button className="flex-1 gap-2" onClick={handleExportClick}>
        <span>Export</span>
        <Download size={16} />
      </Button>
    </div>
  );

  const mainContent = (
    <div
      ref={containerRef}
      className="overflow-y-auto h-[calc(100vh_-_80px)] scrollbar-thin-custom px-4"
    >
      {stylesArray &&
        stylesArray.map((style, index: number) => {
          const defaultData = templateData[currentAssetType]?.["default"] || {};
          const templateSpecificData = currentTemplateId
            ? templateData[currentAssetType]?.[String(currentTemplateId)] || {}
            : {};
          const templateData_combined = {
            ...defaultData,
            ...templateSpecificData,
          };

          const templateDimensions = getAssetDimensions(currentAssetType);
          const styleKey = style.style_key || index;
          const isSelected = selectedStyleKey === styleKey;

          return (
            <div
              key={`${currentAssetType}-template-${currentTemplateId}-style-${styleKey}`}
              className="relative p-0 mx-0 px-0 cursor-pointer rounded-lg"
            >
              <div className="my-4 flex justify-center">
                <div
                  ref={itemContainerRef}
                  className={`
                    relative 
                    w-full 
                    max-w-[350px] 
                    h-[180px] 
                    mx-2 
                    rounded-[16px] 
                    group 
                    overflow-hidden 
                    bg-[#F1F3F3] 
                    flex 
                    items-center 
                    justify-center
                    ${
                      isSelected
                        ? "border-2 border-[#1F8C9B]"
                        : "border-2 border-transparent group-hover:border-[#1F8C9B]"
                    }
                  `}
                  onClick={() => handleOnClick(styleKey)}
                >
                  <div
                    style={{
                      width: `${templateDimensions.width * dynamicScale}px`,
                      height: `${templateDimensions.height * dynamicScale}px`,
                    }}
                    className="rounded-md relative overflow-hidden"
                  >
                    <PremiumTemplate
                      templateId={Number(currentTemplateId)}
                      assetType={currentAssetType}
                    >
                      <div
                        ref={isSelected ? bannerRef : null}
                        style={{
                          width: `${templateDimensions.width}px`,
                          height: `${templateDimensions.height}px`,
                          transform: `scale(${dynamicScale})`,
                          transformOrigin: "top left",
                          pointerEvents: "none",
                        }}
                      >
                        <TemplateWrapper
                          assetType={currentAssetType}
                          templateNumber={currentTemplateId}
                          data={templateData_combined}
                          style={style.config}
                          brand={brand}
                        />
                      </div>
                    </PremiumTemplate>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <>
      <AuthDialog showSignUpForm={false} ref={authDialogRef} />
      <div>
        <SideBar mainContent={mainContent} HeaderContent={header} />

        {bannerRef.current && (
          <ExportModal
            open={showExportModal}
            onClose={() => setShowExportModal(false)}
            templateName={getSelectedTemplateName()}
          />
        )}
      </div>
    </>
  );
};

export default StylePanel;
