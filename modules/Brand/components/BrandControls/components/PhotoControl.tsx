// modules/Brand/components/BrandControls/components/PhotoControl.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/DraggerWithCrop/ImageUploader";
import { Shuffle, User } from "lucide-react";
import { gradientTypes } from "@/common/constants/gradients";
import { useAssetContext } from "@/contexts/AssetContext";
import { useBrandContext } from "@/contexts/BrandContext";
import ImageViewer from "@/components/DraggerWithCrop/ImageViewer";

const PhotoControl = () => {
  const {
    state: { dataConfig },
    setDataConfig,
  } = useAssetContext();
  const {
    state: {
      brand: {
        brandMark,
        config: { isDarkMode, monochrome },
      },
    },
    setMonochrome,
    setBrandMark,
  } = useBrandContext();

  const [removeBackground, setRemoveBackground] = useState<boolean>(true);
  const gradientIndexRef = useRef(2);

  const handleImageUploadComplete = (url: string) => {
    const newData = {
      ...dataConfig,
      imageUrl: url,
    };
    setDataConfig(newData);
    setBrandMark({
      ...brandMark,
      headshotUrl: url,
    });
  };

  const handleRandomizeGradient = () => {
    const length = gradientTypes.length - (isDarkMode ? 1 : 0);
    gradientIndexRef.current = (gradientIndexRef.current + 1) % length;
    const nextGradientType = gradientTypes[gradientIndexRef.current];

    setBrandMark({
      ...brandMark,
      headshotGradient: nextGradientType,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />{" "}
          <span className="font-medium text-sm">YOUR PHOTO</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleRandomizeGradient}
        >
          <Shuffle className="w-4 h-4" />
        </Button>
      </div>

      {brandMark.headshotUrl && dataConfig.imageUrl ? (
        <ImageViewer
          imageUrl={brandMark.headshotUrl || dataConfig.imageUrl}
          onRemove={() => {
            setBrandMark({ ...brandMark, headshotUrl: "" });
            setDataConfig({
              ...dataConfig,
              imageUrl: "https://assets.dev.instantbranding.ai/dummy.png",
            });
          }}
        />
      ) : (
        <ImageUploader
          bucketName="dropzone-upload"
          onUploadComplete={handleImageUploadComplete}
          highQuality
          isAdjustablePosition={false}
          removeBackground={removeBackground}
          setRemoveBackground={setRemoveBackground}
          aspectRatio={1 / 1}
          // uploadToS3
        />
      )}
      <div className="flex items-center justify-between pt-2">
        <Label
          htmlFor="monochrome-toggle"
          className="text-sm font-medium cursor-pointer"
        >
          Monochrome
        </Label>
        <Switch
          id="monochrome-toggle"
          checked={monochrome}
          onCheckedChange={(checked) => setMonochrome(checked)}
        />
      </div>
    </div>
  );
};

export default PhotoControl;
