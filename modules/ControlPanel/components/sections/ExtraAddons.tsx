/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { templateData } from "@/common/constants/template-data";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAssetContext } from "@/contexts/AssetContext";
import { useBrandContext } from "@/contexts/BrandContext";

export const SettingsSection = () => {
  const {
    state: { currentAssetType, templateId: currentTemplateId },
  } = useAssetContext();

  const {
    state: {
      brand: {
        config: { monochrome },
      },
    },
    setMonochrome,
  } = useBrandContext();

  const isAvailableField = (field: string) => {
    if (!currentAssetType || !currentTemplateId) return false;
    const templateFields = templateData[currentAssetType][currentTemplateId];
    if (!templateFields) return false;
    return field in templateFields;
  };

  if (!isAvailableField("imageUrl")) {
    return null;
  }

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="monochrome-toggle"
          className="text-sm font-medium cursor-pointer"
        >
          Monochrome
        </Label>
        <Switch
          id="background-toggle"
          checked={monochrome}
          onCheckedChange={(checked) => setMonochrome(checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
};
