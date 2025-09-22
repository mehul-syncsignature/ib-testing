/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DashboardControl.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useBrandContext } from "@/contexts/BrandContext";
import BrandItem from "./components/BrandItem";
import { Brand } from "@/contexts/BrandContext/types";
import { PaletteIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultBrand } from "@/contexts/BrandContext/helpers/initialState";
import { useRouter } from "next/navigation";
import { useDeleteBrand } from "@/hooks/brand";
import { toast } from "sonner";
import { loadBrandFonts } from "@/lib/fonts";
import CreateBrandDialog, {
  CreateBrandDialogHandle,
} from "./components/CreateBrandDialog";
import AuthDialog, { AuthDialogHandle } from "@/components/Auth/AuthDialog";
import { useAppContext } from "@/contexts/AppContext";

const DashboardControl = () => {
  const router = useRouter();
  const createBrandDialogRef = useRef<CreateBrandDialogHandle>(null);

  const {
    state: { brands, brand },
    setBrand,
  } = useBrandContext();
  const [deleteBrand] = useDeleteBrand();

  const {
    state: { isPremiumUser },
  } = useAppContext();

  // Load fonts when brand changes
  useEffect(() => {
    if (brand?.id) {
      const typography = {
        primaryFont: brand?.config.typography?.primaryFont,
        secondaryFont: brand?.config.typography?.secondaryFont,
        highlightFont: brand?.config.typography?.highlightFont,
      };
      loadBrandFonts(typography);
    }
  }, [brand]);

  // Initialize with first brand if no brand is selected
  useEffect(() => {
    router.prefetch("/brand-setup");
    if (brands && brands.length > 0 && !brand?.id) {
      const firstBrand = brands[0];
      setBrand(firstBrand);
    }
  }, [brands]);

  const handleBrandClick = (brand: Brand) => {
    setBrand(brand);
  };

  const handleBrandEdit = (brand: Brand) => {
    setBrand(brand);
  };

  const authDialogRef = useRef<AuthDialogHandle>(null);

  const heandleCreateBrand = () => {
    if (isPremiumUser) {
      createBrandDialogRef.current?.open();
    } else {
      authDialogRef?.current?.setAuthView("signUp");
      authDialogRef?.current?.open();
    }
  };

  const handleCreateBrandSubmit = async (brandName: string) => {
    try {
      // Create a new brand with the provided name
      const newBrand = {
        ...defaultBrand,
        name: brandName,
      };

      setBrand(newBrand);

      // Show success message
      // toast.success("Brand created successfully!");

      // Navigate to brand setup
      router.push(`/brand-setup`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create brand: ${errorMessage}`);
      throw error; // Re-throw to be handled by the dialog
    }
  };

  const handleConfirmDelete = async (brand: Brand) => {
    try {
      const apiResponse = await deleteBrand(brand.id!);

      if (apiResponse) {
        toast.success(`Brand deleted successfully!`);
        const firstBrand = brands[0];
        setBrand(firstBrand);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete brand: ${errorMessage}`);
    }
  };

  return (
    <>
      <AuthDialog showSignUpForm={false} ref={authDialogRef} />

      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto space-y-8">
          <div className="space-y-3">
            <div className="p-4 flex justify-between mb-0 pb-0">
              <div className="flex items-center gap-2 pb-0 mb-0">
                <PaletteIcon className="w-4 h-4" />
                <span className="font-medium text-sm">BRANDS</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={heandleCreateBrand}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {brands &&
              brands?.map((brandItem: Brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-2 p-4 w-fll m-0 border-b bg-background"
                >
                  <BrandItem
                    id={brandItem.id!}
                    name={brandItem.name}
                    isSelected={brand?.id === brandItem.id}
                    colors={brandItem?.config?.originalColors}
                    onClick={() => handleBrandClick(brandItem)}
                    onEdit={() => handleBrandEdit(brandItem)}
                    onDelete={() => handleConfirmDelete(brandItem)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Create Brand Dialog */}
      <CreateBrandDialog
        ref={createBrandDialogRef}
        onSubmit={handleCreateBrandSubmit}
      />
    </>
  );
};

export default DashboardControl;
