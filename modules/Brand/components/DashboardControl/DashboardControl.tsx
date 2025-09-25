/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DashboardControl.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useBrandContext } from "@/contexts/BrandContext";
import { Brand } from "@/contexts/BrandContext/types";
import {
  Folder,
  PanelsLeftBottom,
  Sparkles,
} from "lucide-react";
import { defaultBrand } from "@/contexts/BrandContext/helpers/initialState";
import { useRouter } from "next/navigation";
import { useDeleteBrand, useUpsertBrand } from "@/hooks/brand";
import { toast } from "sonner";
import { loadBrandFonts } from "@/lib/fonts";
import CreateBrandDialog, {
  CreateBrandDialogHandle,
} from "./components/CreateBrandDialog";
import AuthDialog, { AuthDialogHandle } from "@/components/Auth/AuthDialog";
import BrandSwitcher from "@/components/BrandSwitcher";
import { omit } from "lodash";

interface DashboardControlProps {
  activeSection?: "brand" | "ai-tools" | "my-assets";
  onSectionChange?: (section: "brand" | "ai-tools" | "my-assets") => void;
}

const DashboardControl = ({
  activeSection = "brand",
  onSectionChange,
}: DashboardControlProps) => {
  const router = useRouter();
  const createBrandDialogRef = useRef<CreateBrandDialogHandle>(null);

  const {
    state: { brands, brand },
    setBrand,
  } = useBrandContext();
  const [deleteBrand] = useDeleteBrand();
  const [upsertBrand, { loading: upsertLoading }] = useUpsertBrand();

  // const {
  //   state: { isPremiumUser },
  // } = useAppContext();

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

  const handleBrandSelect = (brand: Brand) => {
    setBrand(brand);
  };

  const handleBrandEdit = (brand: Brand) => {
    setBrand(brand);
  };

  const authDialogRef = useRef<AuthDialogHandle>(null);

  const heandleCreateBrand = () => {
    // if (isPremiumUser) {
    createBrandDialogRef.current?.open();
    // } else {
    //   authDialogRef?.current?.setAuthView("signUp");
    //   authDialogRef?.current?.open();
    // }
  };

  const handleCreateBrandSubmit = async (brandName: string) => {
    try {
      const newBrand = {
        ...defaultBrand,
        name: brandName,
      };
      
      const brandToCreate = omit(newBrand, "id");
      
      await upsertBrand(brandToCreate);
      
      toast.success("Brand created successfully!");

      router.push(`/brand-setup`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create brand: ${errorMessage}`);
      throw error; 
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

      <div className="flex flex-col h-full select-none">
        <div className="flex-grow overflow-y-auto space-y-8">
          {/* Brand Dropdown Selector */}
          {brands && brands.length > 0 && (
            <BrandSwitcher
              brands={brands}
              currentBrand={brand}
              onBrandSelect={handleBrandSelect}
              onBrandEdit={handleBrandEdit}
              onBrandDelete={handleConfirmDelete}
              onCreateBrand={heandleCreateBrand}
              className="px-4 pt-4 mb-[8px]"
            />
          )}

          <div className="px-4 space-y-2">
            <div
              onClick={() => onSectionChange?.("brand")}
              className={`w-full text-left flex gap-2 p-4 rounded-[.5rem] font-norml cursor-pointer ${
                activeSection === "brand"
                  ? "bg-[#22808D] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <PanelsLeftBottom
                className={
                  activeSection === "brand" ? "text-white" : "text-primary"
                }
              />
              DESIGN TEMPLATES
            </div>

            <div
              onClick={() => onSectionChange?.("ai-tools")}
              className={`w-full text-left flex gap-2 p-4 rounded-[.5rem] font-normal cursor-pointer ${
                activeSection === "ai-tools"
                  ? "bg-[#22808D] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Sparkles
                className={
                  activeSection === "ai-tools" ? "text-white" : "text-primary"
                }
              />
              AI TOOLS
            </div>

            <div
              onClick={() => onSectionChange?.("my-assets")}
              className={`w-full text-left flex gap-2 p-4 rounded-[.5rem] font-normal cursor-pointer ${
                activeSection === "my-assets"
                  ? "bg-[#22808D] text-white"
                  : " text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Folder
                className={
                  activeSection === "my-assets" ? "text-white" : "text-primary"
                }
              />
              MY ASSETS
            </div>
          </div>
        </div>
      </div>

      {/* Create Brand Dialog */}
      <CreateBrandDialog
        ref={createBrandDialogRef}
        onSubmit={handleCreateBrandSubmit}
        loading={upsertLoading}
      />
    </>
  );
};

export default DashboardControl;
