// modules/Brand/components/BrandControls/components/SidebarFooter.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown, Loader2, Palette, Plus } from "lucide-react";
import { useBrandContext } from "@/contexts/BrandContext";

interface SidebarFooterProps {
  isBrandListOpen: boolean;
  setIsBrandListOpen: (open: boolean) => void;
  handleBrandSelect: (brandId: string) => void;
  handleCreateNewBrand: () => void;
  handleSaveBrand: () => void;
  saveLoading: boolean;
}

const SidebarFooter = ({
  isBrandListOpen,
  setIsBrandListOpen,
  handleBrandSelect,
  handleCreateNewBrand,
  handleSaveBrand,
  saveLoading,
}: SidebarFooterProps) => {
  const {
    state: { brand, brands },
  } = useBrandContext();

  // Derive state from BrandContext
  const isCreatingNew = brand.id === "default" || brand.id === "new";
  const activeBrandId = brand.id;
  const brandNameInput = brand.name;

  const renderBrandSelectionContent = () => {
    if (!brands || brands.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground mb-4">No brands configured.</p>
          <Button onClick={handleCreateNewBrand} className="w-full gap-2">
            <Plus /> Create First Brand
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Your Brands</h4>
          <Button
            onClick={handleCreateNewBrand}
            size="sm"
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <Plus className="w-3 h-3" /> New
          </Button>
        </div>
        <Separator />
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-1">
            {brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandSelect(brand.id!)}
                role="button"
                tabIndex={0}
                aria-label={`Select brand ${brand.name}`}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  activeBrandId === brand.id
                    ? "bg-accent border border-primary/20"
                    : "hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Palette className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{brand.name}</span>
                </div>
                {activeBrandId === brand.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const selectedBrandName = (() => {
    if (isCreatingNew) return "Creating New Brand";

    if (activeBrandId && brands?.length > 0) {
      const found = brands.find((b) => b.id === activeBrandId);
      if (found) return found.name;
    }

    return brandNameInput || "Select a Brand";
  })();

  return (
    <div className="flex-shrink-0 p-4 space-y-3 border-t bg-background">
      <Popover open={isBrandListOpen} onOpenChange={setIsBrandListOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isBrandListOpen}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{selectedBrandName}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-4" align="start">
          {renderBrandSelectionContent()}
        </PopoverContent>
      </Popover>

      <Button
        onClick={handleSaveBrand}
        disabled={saveLoading || !brandNameInput?.trim()}
        className="w-full"
      >
        {saveLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {saveLoading
          ? "Saving..."
          : isCreatingNew
          ? "Create Brand"
          : "Update Brand"}
      </Button>
    </div>
  );
};

export default SidebarFooter;
