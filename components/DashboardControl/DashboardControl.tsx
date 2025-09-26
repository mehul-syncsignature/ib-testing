/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DashboardControl.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useBrandContext } from "@/contexts/BrandContext";
import { Brand } from "@/contexts/BrandContext/types";
import { Folder, PanelsLeftBottom, Sparkles } from "lucide-react";
import { defaultBrand } from "@/contexts/BrandContext/helpers/initialState";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useDeleteBrand, useUpsertBrand } from "@/hooks/brand";
import { toast } from "sonner";
import { loadBrandFonts } from "@/lib/fonts";
import CreateBrandDialog, {
  CreateBrandDialogHandle,
} from "./components/CreateBrandDialog";
import AuthDialog, { AuthDialogHandle } from "@/components/Auth/AuthDialog";
import BrandSwitcher from "@/components/BrandSwitcher";
import { omit } from "lodash";

const DashboardControl = () => {
  const router = useRouter();
  const pathname = usePathname();
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
    router.prefetch("/app/brand-setup");
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

  const navigationItems = [
    {
      id: "design-templates",
      label: "DESIGN TEMPLATES",
      icon: PanelsLeftBottom,
      href: "/app/design-templates",
    },
    {
      id: "ai-tools",
      label: "AI TOOLS",
      icon: Sparkles,
      href: "/app/ai-tools",
    },
    {
      id: "my-assets",
      label: "MY ASSETS",
      icon: Folder,
      href: "/app/my-assets",
    },
  ];

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

      router.push(`/app/brand-setup`);
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
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === "design-templates" 
                ? pathname.startsWith("/app/design-templates")
                : pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full text-left flex gap-2 p-4 rounded-[.5rem] font-normal cursor-pointer ${
                    isActive
                      ? "bg-[#22808D] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className={isActive ? "text-white" : "text-primary"} />
                  {item.label}
                </Link>
              );
            })}
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
