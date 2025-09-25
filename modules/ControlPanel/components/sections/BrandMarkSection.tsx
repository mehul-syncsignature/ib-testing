// modules/ControlPanel/components/sections/BrandMarkSection.tsx
"use client";

// import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUnifiedDataConfig } from "@/hooks/unifiedDataConfig";
import { useBrandContext } from "@/contexts/BrandContext";
import { User } from "lucide-react";

export const BrandMarkSection = () => {
  const { data, setData } = useUnifiedDataConfig();
  const {
    state: { brand },
  } = useBrandContext();

  // Main toggle from data (like title)
  const showBrandMark = data.showBrandMark ?? true;

  // Individual field toggles - LOCAL STATE (like title individual controls)
  // const [localToggles, setLocalToggles] = useState({
  //   showName: true,
  //   showSocialHandle: true,
  //   showWebsite: true,
  //   showLogo: true,
  //   showHeadshot: true,
  // });

  // Reset local toggles when main toggle is turned on (all fields ON by default)
  // useEffect(() => {
  //   if (showBrandMark) {
  //     setLocalToggles({
  //       showName: true,
  //       showSocialHandle: true,
  //       showWebsite: true,
  //       showLogo: true,
  //       showHeadshot: true,
  //     });
  //   }
  // }, [showBrandMark]);

  // Check what brand mark data is available
  const availableFields = {
    name: !!brand.brandMark.name?.trim(),
    socialHandle: !!brand.brandMark.socialHandle?.trim(),
    companyName: !!brand.brandMark.companyName?.trim(),
    website: !!brand.brandMark.website?.trim(),
    logo: !!brand.brandMark.logoUrl?.trim(),
    headshot: !!brand.brandMark.headshotUrl?.trim(),
  };

  const hasAnyBrandMarkData = Object.values(availableFields).some(Boolean);

  // Don't show if no brand mark data exists
  if (!hasAnyBrandMarkData) {
    return null;
  }

  // Main toggle handler
  const handleMainToggle = (checked: boolean) => {
    setData({ showBrandMark: checked });
  };

  // Individual field toggle handler (local state only)
  // const handleFieldToggle = (
  //   fieldName: keyof typeof localToggles,
  //   checked: boolean
  // ) => {
  //   setLocalToggles((prev) => ({
  //     ...prev,
  //     [fieldName]: checked,
  //   }));
  // };

  // // Field configurations
  // const fieldConfigs = [
  //   {
  //     key: "showName" as const,
  //     label: "Name",
  //     icon: User,
  //     available: availableFields.name,
  //     preview: brand.brandMark.name,
  //   },
  //   {
  //     key: "showSocialHandle" as const,
  //     label: "Social Handle",
  //     icon: Hash,
  //     available: availableFields.socialHandle,
  //     preview: brand.brandMark.socialHandle,
  //   },
  //   {
  //     key: "showWebsite" as const,
  //     label: "Website",
  //     icon: Globe,
  //     available: availableFields.website,
  //     preview: brand.brandMark.website,
  //   },
  //   {
  //     key: "showLogo" as const,
  //     label: "Logo",
  //     icon: ImageIcon,
  //     available: availableFields.logo,
  //     preview: "Logo Image",
  //   },
  //   {
  //     key: "showHeadshot" as const,
  //     label: "Photo",
  //     icon: Camera,
  //     available: availableFields.headshot,
  //     preview: "Profile Photo",
  //   },
  // ].filter((field) => field.available); // Only show available fields

  return (
    <div className="space-y-3">
      {/* Main Toggle - exactly like title */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor="brandmark-main-toggle"
          className="text-sm font-medium cursor-pointer flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Brand Mark
        </Label>
        <Switch
          id="brandmark-main-toggle"
          checked={showBrandMark}
          onCheckedChange={handleMainToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Individual Field Toggles - only show when main toggle is ON */}
      {/* {showBrandMark && fieldConfigs.length > 0 && (
        <div className="ml-6 space-y-2 border-l border-border pl-4">
          <div className="text-xs text-muted-foreground mb-2">
            Show/hide individual elements:
          </div>

          {fieldConfigs.map((field) => (
            <div key={field.key} className="flex items-center justify-between">
              <Label
                htmlFor={`brandmark-${field.key}`}
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                <field.icon className="w-3 h-3" />
                <span>{field.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({field.preview})
                </span>
              </Label>
              <Switch
                id={`brandmark-${field.key}`}
                checked={localToggles[field.key]}
                onCheckedChange={(checked) =>
                  handleFieldToggle(field.key, checked)
                }
                className="test-sm data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </div>
      )} */}

      {/* Status indicator when main toggle is OFF */}
      {/* {!showBrandMark && (
        <div className="text-xs text-muted-foreground ml-6">
          Brand mark is hidden for this template
        </div>
      )} */}
    </div>
  );
};
