/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isEqual } from "lodash";
import { useRouter } from "next/navigation";

import { useUpsertBrand } from "@/hooks/brand";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAppContext } from "@/contexts/AppContext";

import ColorControl from "./components/ColorControl";
import FontControl from "./components/FontControl";
import PhotoControl from "./components/PhotoControl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fontOptions } from "./components/FontFamilyDropdown";
import { loadBrandFonts } from "@/lib/fonts";
import { Brand } from "@/contexts/BrandContext/types";
import {
  ConfirmationDialog,
  ConfirmationDialogHandle,
} from "@/components/ConfirmationDialog/ConfirmationDialog";

const BrandControls: React.FC = () => {
  const {
    state: { currentUser, isSignedIn },
  } = useAppContext();
  const {
    state: { brand, brands, isDirty },
    setIsDirty,
    setName,
    setBrandMark,
  } = useBrandContext();

  const router = useRouter();
  const originalPush = useRef(router.push);
  const originalReplace = useRef(router.replace);
  const originalBack = useRef(router.back);
  const [upsertBrand, { loading }] = useUpsertBrand();
  const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
  const [originalBrand, setOriginalBrand] = useState<Brand | null>(null);

  useEffect(() => {
    if (brands && brand) {
      const foundBrand = brands.find((b: Brand) => b.id === brand.id);
      setOriginalBrand(foundBrand || null);
    }
  }, [brands, brand, setOriginalBrand]);

  useEffect(() => {
    if (originalBrand && brand) {
      const hasChanges =
        !isEqual(brand.name, originalBrand.name) ||
        !isEqual(brand.config.colors, originalBrand.config.colors) ||
        !isEqual(
          brand.config.originalColors,
          originalBrand.config.originalColors
        ) ||
        !isEqual(brand.config.typography, originalBrand.config.typography) ||
        !isEqual(brand.config.isDarkMode, originalBrand.config.isDarkMode) ||
        !isEqual(brand.config.monochrome, originalBrand.config.monochrome) ||
        !isEqual(brand.brandMark, originalBrand.brandMark);
      setIsDirty(hasChanges);
    } else {
      setIsDirty(true);
    }
  }, [brand, originalBrand, setIsDirty]);

  useEffect(() => {
    fontOptions.forEach((font) => {
      const typography = {
        primaryFont: font.primary,
        secondaryFont: font.secondary,
      };
      loadBrandFonts(typography);
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (isDirty) {
      router.push = (() => {
        handleAttemptSave();
        return Promise.resolve();
      }) as any;

      router.replace = (() => {
        handleAttemptSave();
        return Promise.resolve();
      }) as any;

      router.back = (() => {
        handleAttemptSave();
      }) as any;
    } else {
      router.push = originalPush.current;
      router.replace = originalReplace.current;
      router.back = originalBack.current;
    }

    return () => {
      router.push = originalPush.current;
      router.replace = originalReplace.current;
      router.back = originalBack.current;
    };
  }, [isDirty, router]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isDirty) {
        event.preventDefault();
        window.history.pushState(null, "", window.location.href);
        handleAttemptSave();
      }
    };

    if (isDirty) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  const handleSaveBrand = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to save a brand.");
      return;
    }
    if (!brand.name.trim()) {
      toast.error("Please enter a brand name.");
      return;
    }

    const brandToSave = {
      ...(brand.id ? { id: brand.id } : {}),
      name: brand.name.trim(),
      config: brand.config,
      socialLinks: brand.socialLinks || {},
      brandImages: brand.brandImages || [],
      infoQuestions: brand.infoQuestions || {},
      brandMark: {
        name: brand.brandMark?.name || "Your Name",
        socialHandle: brand.brandMark?.socialHandle || "@yourhandle",
        website: brand.brandMark?.website || "",
        logoUrl: brand.brandMark?.logoUrl || "",
        headshotUrl: brand.brandMark?.headshotUrl || "",
        companyName: brand.brandMark?.companyName || "",
        headshotGradient: brand.brandMark?.headshotGradient || "solid-primary",
      },
    };

    try {
      const apiResponse = await upsertBrand(brandToSave);
      if (apiResponse) {
        const action = apiResponse.action === "created" ? "created" : "updated";
        toast.success(`Brand ${action} successfully!`);

        setIsDirty(false);
        setOriginalBrand({ ...brand, name: brand.name.trim() });
        originalPush.current("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save brand: ${errorMessage}`);
    }
  };

  const handleAttemptSave = () => {
    confirmationDialogRef.current?.open();
  };

  const handleConfirmationSave = async () => {
    await handleSaveBrand();
  };

  const handleConfirmationCancel = () => {
    confirmationDialogRef.current?.close();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto scrollbar-thin-custom p-4 space-y-8">
        {isSignedIn && (
          <div className="space-y-2">
            <Label
              htmlFor="brand-name"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Brand Name
            </Label>
            <Input
              id="brand-name"
              type="text"
              value={brand.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Awesome Brand"
            />
          </div>
        )}

        <ColorControl />
        <FontControl />
        <PhotoControl />
        {isSignedIn && (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="brand-name"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Name
              </Label>
              <Input
                id="brand-name"
                type="text"
                value={brand.brandMark?.name || ""}
                onChange={(e) =>
                  setBrandMark({ ...brand.brandMark, name: e.target.value })
                }
                placeholder="e.g., James Carter"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="brand-name"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                social-handle / role
              </Label>
              <Input
                id="brand-name"
                type="text"
                value={brand.brandMark?.socialHandle || ""}
                onChange={(e) =>
                  setBrandMark({
                    ...brand.brandMark,
                    socialHandle: e.target.value,
                  })
                }
                placeholder="e.g., @jamescarter"
              />
            </div>
          </>
        )}
      </div>

      {isSignedIn && (
        <div className="flex-shrink-0 p-4 space-y-3 border-t bg-background cursor-pointer">
          <div className="flex gap-2">
            <Button
              onClick={handleSaveBrand}
              disabled={!brand.name.trim() || loading || !isDirty}
              className="flex-1"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      <ConfirmationDialog
        ref={confirmationDialogRef}
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to save or cancel?"
        onOk={handleConfirmationSave}
        onCancel={handleConfirmationCancel}
        label="Save"
      />
    </div>
  );
};

export default BrandControls;
