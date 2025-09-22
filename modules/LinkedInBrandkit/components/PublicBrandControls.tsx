/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { isEqual } from "lodash";

import { useBrandContext } from "@/contexts/BrandContext";
import { useAppContext } from "@/contexts/AppContext";

import { loadBrandFonts } from "@/lib/fonts";
import { Brand } from "@/contexts/BrandContext/types";
import { fontOptions } from "@/modules/Brand/components/BrandControls/components/FontFamilyDropdown";
import ColorControl from "@/modules/Brand/components/BrandControls/components/ColorControl";
import FontControl from "@/modules/Brand/components/BrandControls/components/FontControl";
import PhotoControl from "@/modules/Brand/components/BrandControls/components/PhotoControl";

const BrandControls: React.FC = () => {
  const {} = useAppContext();
  const {
    state: { brand, brands },
    setIsDirty,
  } = useBrandContext();

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto scrollbar-thin-custom p-4 space-y-8">
        <ColorControl />
        <FontControl />
        <PhotoControl />
      </div>
    </div>
  );
};

export default BrandControls;
