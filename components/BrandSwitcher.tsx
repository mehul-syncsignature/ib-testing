"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BrandItem from "@/components/DashboardControl/components/BrandItem";
import { Brand } from "@/contexts/BrandContext/types";

interface BrandSwitcherProps {
  brands: Brand[];
  currentBrand: Brand | null;
  onBrandSelect: (brand: Brand) => void;
  onBrandEdit: (brand: Brand) => void;
  onBrandDelete: (brand: Brand) => void;
  onCreateBrand: () => void;
  className?: string;
}

const BrandSwitcher = ({
  brands,
  currentBrand,
  onBrandSelect,
  onBrandEdit,
  onBrandDelete,
  onCreateBrand,
  className = "",
}: BrandSwitcherProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleBrandClick = (brand: Brand) => {
    onBrandSelect(brand);
    setDropdownOpen(false);
  };

  const handleCreateBrand = () => {
    setDropdownOpen(false);
    onCreateBrand();
  };

  return (
    <div className={`${className}`}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex-shrink-2 p-4 w-full bg-[#F3F5F6CC] rounded-[0.5rem] cursor-pointer focus:outline-none focus:ring-0">
            {currentBrand && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
                    <div
                      className="w-1/3 h-full"
                      style={{
                        backgroundColor:
                          currentBrand?.config?.originalColors?.secondaryColor,
                      }}
                    />
                    <div
                      className="w-1/3 h-full"
                      style={{
                        backgroundColor:
                          currentBrand?.config?.originalColors?.primaryColor,
                      }}
                    />
                    <div
                      className="w-1/3 h-full"
                      style={{
                        backgroundColor:
                          currentBrand?.config?.originalColors?.highlightColor,
                      }}
                    />
                  </div>
                  <span className="text-[1rem] font-medium text-[#343B3F] truncate min-w-0">
                    {currentBrand.name}
                  </span>
                </div>
                <div className="font-normal">
                  {dropdownOpen ? (
                    <ChevronUp className="text-[#343B3F] font-normal" />
                  ) : (
                    <ChevronDown className="text-[#343B3F] font-normal" />
                  )}
                </div>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative max-h-64 overflow-y-auto scrollbar-hide w-[var(--radix-dropdown-menu-trigger-width)]">
          {brands.map((brandItem: Brand, index) => (
            <div
              key={brandItem.id || index}
              className="p-2 hover:bg-gray-50 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBrandClick(brandItem);
              }}
            >
              <div className="pb-2">
                <BrandItem
                  id={brandItem.id!}
                  name={brandItem.name}
                  isSelected={currentBrand?.id === brandItem.id}
                  colors={brandItem?.config?.originalColors}
                  onClick={() => {}}
                  onEdit={() => onBrandEdit(brandItem)}
                  onDelete={() => onBrandDelete(brandItem)}
                />
              </div>
            </div>
          ))}
          <div
            className="p-2 hover:bg-gray-50 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCreateBrand();
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] font-medium text-primary">
                + NEW BRAND KIT
              </span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BrandSwitcher;
