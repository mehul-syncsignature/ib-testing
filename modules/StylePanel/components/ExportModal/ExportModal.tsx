"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  CheckCircle2,
  FileText,
  Images,
} from "lucide-react";
import { useCanvasRef, useHeadshotRef, useCarouselRefs } from "@/hooks/canvas";
import {
  getAvailableExportPlatforms,
  getDefaultExportPlatforms,
  type ExportPlatform,
} from "./helpers/platform-config";
import { ExportParams, handleExport } from "./helpers/export-utils";
import { useAssetContext } from "@/contexts/AssetContext";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  templateName?: string;
  currentDimensions?: { width: number; height: number };
}

const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onClose,
  templateName = "Social-Banner",
}) => {
  const {
    state: { currentAssetType, slides },
  } = useAssetContext();

  const defaultExportPlatforms = getDefaultExportPlatforms(currentAssetType);

  const { carouselSlideRefs } = useCarouselRefs();

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    defaultExportPlatforms.map((p) => p.id)
  );
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [lastExportSuccess, setLastExportSuccess] = useState<boolean>(false);
  const [headshotAvailable, setHeadshotAvailable] = useState<boolean>(false);
  const [headshotAdded, setHeadshotAdded] = useState<boolean>(false);

  const fileType: "png" | "jpg" | "svg" = "png";
  const scale: number = 2;

  const { canvasRef } = useCanvasRef();
  const { headshotRef } = useHeadshotRef();

  const availableExportPlatforms = getAvailableExportPlatforms(
    defaultExportPlatforms,
    headshotAvailable
  );

  const getSlideCount = (): number => {
    if (currentAssetType === "social-carousel") {
      return slides.length;
    }
    return 1;
  };

  useEffect(() => {
    if (open && headshotRef.current && !headshotAdded) {
      const hasImage = headshotRef.current.querySelector("img") !== null;
      setHeadshotAvailable(hasImage);

      if (hasImage && !selectedPlatforms.includes("headshot")) {
        setSelectedPlatforms((prev) => [...prev, "headshot"]);
        setHeadshotAdded(true);
      }
    }

    if (!open) {
      setHeadshotAdded(false);
    }
  }, [open, headshotRef, headshotAdded, selectedPlatforms]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lastExportSuccess) {
      timer = setTimeout(() => {
        setLastExportSuccess(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [lastExportSuccess]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      setIsExporting(false);
      setExportProgress(0);
      setLastExportSuccess(false);
    } else {
      setIsExporting(false);
      setExportProgress(0);
      setLastExportSuccess(false);
      if (selectedPlatforms.length === 0 && defaultExportPlatforms.length > 0) {
        setSelectedPlatforms(defaultExportPlatforms.map((p) => p.id));
      }
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedPlatforms(availableExportPlatforms.map((p) => p.id));
    } else {
      setSelectedPlatforms([]);
    }
  };

  const onExport = async () => {
    setIsExporting(true);
    setLastExportSuccess(false);

    const exportParams: ExportParams = {
      selectedPlatforms,
      templateName,
      fileType,
      scale,
      canvasRef,
      headshotRef,
      onProgress: setExportProgress,
      carouselSlideRefs:
        currentAssetType === "social-carousel" ? carouselSlideRefs : [],
    };

    const success = await handleExport(exportParams);

    setIsExporting(false);
    if (success) {
      setLastExportSuccess(true);
    }
  };

  const getPlatformDisplayInfo = (platform: ExportPlatform) => {
    if (platform.id === "social-carousel-pdf") {
      const slideCount = getSlideCount();
      return {
        name: `PDF Carousel (${slideCount} slide${
          slideCount !== 1 ? "s" : ""
        })`,
        dimensions: "1080x1080px per page",
        icon: <FileText size={16} className="text-red-600" />,
      };
    }
    if (platform.id === "social-carousel-images") {
      const slideCount = getSlideCount();
      return {
        name: `Carousel Images (${slideCount} slide${
          slideCount !== 1 ? "s" : ""
        })`,
        dimensions: "1080x1080px each",
        icon: <Images size={16} className="text-blue-600" />,
      };
    }
    return {
      name: platform.name,
      dimensions: platform.dimensions,
      icon: null,
    };
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-[350px] sm:w-[400px] p-0 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <Download size={20} /> Export Options
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin-custom">
          <div className="space-y-3">
            <div className="space-y-2 border rounded-md p-3 bg-gray-50/50 max-h-60 overflow-y-auto scrollbar-thin-custom">
              {availableExportPlatforms.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2 pb-2 border-b mb-5 sticky top-0 bg-gray-50/80 backdrop-blur-sm -mt-3 -mx-3 pt-3 px-3">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedPlatforms.length ===
                          availableExportPlatforms.length &&
                        availableExportPlatforms.length > 0
                          ? true
                          : selectedPlatforms.length === 0
                          ? false
                          : false
                      }
                      disabled={isExporting}
                      onCheckedChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      Select all ({selectedPlatforms.length}/
                      {availableExportPlatforms.length})
                    </label>
                  </div>
                  {availableExportPlatforms.map((platform) => {
                    const displayInfo = getPlatformDisplayInfo(platform);
                    return (
                      <div
                        key={platform.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onCheckedChange={() => togglePlatform(platform.id)}
                          disabled={isExporting}
                        />
                        <label
                          htmlFor={platform.id}
                          className="text-sm cursor-pointer flex-1 flex items-center gap-2"
                        >
                          {displayInfo.icon}
                          <span>
                            {displayInfo.name}{" "}
                            <span className="text-xs text-gray-500">
                              ({displayInfo.dimensions})
                            </span>
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No platforms defined.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 mt-auto">
          {isExporting && exportProgress > 0 && (
            <div className="mb-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    lastExportSuccess ? "bg-green-500" : "bg-blue-500"
                  } transition-all duration-300 ease-in-out`}
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {exportProgress < 100
                  ? `Exporting ${
                      selectedPlatforms.length
                    } option(s)... ${Math.round(exportProgress)}%`
                  : "Processing complete!"}
              </p>
            </div>
          )}

          <Button
            className={`w-full h-10 text-base ${
              lastExportSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#00A0AE] hover:bg-[#008A96]"
            } text-white`}
            onClick={onExport}
            disabled={selectedPlatforms.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />{" "}
                Downloading...
              </>
            ) : lastExportSuccess ? (
              <>
                <CheckCircle2 size={18} className="mr-2" /> Download Successful
              </>
            ) : (
              <>
                Download ({selectedPlatforms.length}){" "}
                {selectedPlatforms.length > 1 ? "as ZIP" : ""}{" "}
                <Download size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExportModal;
