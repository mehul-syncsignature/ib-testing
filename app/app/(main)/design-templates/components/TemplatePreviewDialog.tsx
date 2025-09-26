// modules/Brand/components/BrandSection/components/TemplatePreviewDialog.tsx

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TemplateWrapper from "@/components/TemplateWrapper";
import { AssetType } from "@/components/TemplateWrapper/TemplateWrapper";
import { templateData } from "@/common/constants/template-data";
import PremiumTemplate from "@/components/PremiumTemplate";
import { getAssetDimensions, calculateScaleToFit } from "@/common/utils";
import { map, get } from "lodash";
import { useAssetContext } from "@/contexts/AssetContext";
import { getAllStylesByType } from "../utils";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import { useRouter } from "next/navigation";

export interface TemplatePreviewDialogHandle {
  open: () => void;
  close: () => void;
  onTemplateChange: (id: string, styleKey: number, type: AssetType) => void;
}

const TemplatePreviewDialog = forwardRef<TemplatePreviewDialogHandle>(
  (props, ref) => {
    const {
      state: { brand },
    } = useBrandContext();
    const { setCurrentAssetType, setStyleId, setTemplateId, setDataConfig } =
      useAssetContext();

    const router = useRouter();
    // Simple state
    const [isOpen, setIsOpen] = useState(false);
    const [templateId, setTemplateIdLocal] = useState("");
    const [assetType, setAssetTypeLocal] = useState<AssetType>("social-banner");
    const [selectedStyleKey, setSelectedStyleKey] = useState(0);
    const [previewContainerWidth, setPreviewContainerWidth] =
      useState<number>(0);

    const previewContainerRef = useRef<HTMLDivElement>(null);

    // Get styles efficiently using lodash
    const stylesObject = getAllStylesByType(assetType as AssetTypeKeys);
    const styles = map(stylesObject, (styleData, key) => ({
      key: parseInt(key),
      data: styleData,
    }));

    // Get data efficiently
    const data = {
      ...get(templateData, [assetType, "default"], {}),
      ...get(templateData, [assetType, templateId], {}),
    };

    const assetDimensions = getAssetDimensions(assetType);
    const selectedStyle =
      styles.find((s) => s.key === selectedStyleKey + 1)?.data ||
      styles[0]?.data;

    // Restore scaling logic with container width measurement
    const measurePreviewContainer = () => {
      if (previewContainerRef.current) {
        setPreviewContainerWidth(previewContainerRef.current.clientWidth);
      }
    };

    // Calculate scales based on container measurements
    const calculateScales = () => {
      const previewContainerHeight = 300;
      const effectiveWidth = previewContainerWidth || 1200;

      const previewScale = calculateScaleToFit(
        assetDimensions.width,
        assetDimensions.height,
        effectiveWidth,
        previewContainerHeight,
        40
      );

      const thumbnailScale = calculateScaleToFit(
        assetDimensions.width,
        assetDimensions.height,
        256,
        128,
        20
      );

      return { previewScale, thumbnailScale };
    };

    const { previewScale, thumbnailScale } = calculateScales();

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        setTimeout(() => {
          measurePreviewContainer();
        }, 0);
      },
      close: () => setIsOpen(false),
      onTemplateChange: (id, styleKey, type) => {
        setTemplateIdLocal(id);
        setAssetTypeLocal(type);
        setSelectedStyleKey(styleKey);
      },
    }));

    // Use effect to measure container width
    useEffect(() => {
      const updateContainerWidth = () => {
        measurePreviewContainer();
      };

      if (typeof window !== "undefined") {
        window.addEventListener("resize", updateContainerWidth);

        const resizeObserver = new ResizeObserver(updateContainerWidth);
        if (previewContainerRef.current) {
          resizeObserver.observe(previewContainerRef.current);
        }

        return () => {
          window.removeEventListener("resize", updateContainerWidth);
          resizeObserver.disconnect();
        };
      }
    }, []);

    const handleNext = () => {
      if (selectedStyle && templateId) {
        setCurrentAssetType(assetType as AssetTypeKeys);
        setStyleId(selectedStyleKey + 1); // Convert to 1-based
        setTemplateId(templateId);
        setDataConfig(data);
      }

      router.prefetch(`/editor/${assetType}`);
      router.push(`/editor/${assetType}`);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[80%] h-[80%] rounded-2xl outline-none">
          <DialogTitle className="sr-only">Template Preview</DialogTitle>
          <div className="flex flex-col h-full">
            {/* Preview area */}
            <div className="h-[62%] w-full flex justify-center items-center">
              <div
                ref={previewContainerRef}
                className="relative bg-gray-100 rounded-md h-[300px] w-[70vw] flex justify-center items-center overflow-hidden"
              >
                {selectedStyle && (
                  <div
                    style={{
                      width: assetDimensions.width,
                      height: assetDimensions.height,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "center",
                    }}
                  >
                    <TemplateWrapper
                      assetType={assetType}
                      templateNumber={templateId}
                      brand={brand}
                      data={data}
                      style={selectedStyle}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Template styles */}
            <div className="h-[25%] w-[79vw] overflow-hidden flex items-center pl-3">
              <div className="w-full">
                <h3 className="text-xs uppercase text-gray-500 mb-2">
                  TEMPLATE STYLES
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin-custom">
                  {map(styles, (style, index) => (
                    <PremiumTemplate
                      key={style.key}
                      assetType={assetType}
                      onClick={() => setSelectedStyleKey(index)}
                      templateId={Number(templateId)}
                      className={`h-[8rem] w-64 flex-shrink-0 rounded-md border-2 ${
                        selectedStyleKey === index
                          ? "border-primary"
                          : "border-gray-200"
                      } transition-all overflow-hidden`}
                    >
                      <div className="h-full w-full bg-gray-100 rounded-md relative cursor-pointer flex justify-center items-center">
                        <div
                          style={{
                            width: assetDimensions.width,
                            height: assetDimensions.height,
                            transform: `scale(${thumbnailScale})`,
                            transformOrigin: "center",
                          }}
                        >
                          <TemplateWrapper
                            assetType={assetType}
                            templateNumber={templateId}
                            data={data}
                            style={style.data}
                            brand={brand}
                          />
                        </div>
                      </div>
                    </PremiumTemplate>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="h-[13%] px-5 flex justify-between items-center rounded-[16px] bg-[#F1F3F3] border-t border-[#E1E3E3]">
              <div className="max-w-lg">
                <p className="text-sm text-gray-500">
                  Clean templates to your personal editorial photos or images
                  with content neatly aligned to the left.
                </p>
              </div>
              <div>
                {selectedStyle && (
                  <div onClick={handleNext}>
                    <Button className="px-[5rem] py-2">Next</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

TemplatePreviewDialog.displayName = "TemplatePreviewDialog";

export default TemplatePreviewDialog;
