// modules/Brand/components/BrandControls/components/BrandHeader.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandHeaderProps {
  isCreatingNew: boolean;
  brandName: string;
  onBrandNameChange: (name: string) => void;
  isLoading: boolean;
}

const BrandHeader = ({
  isCreatingNew,
  brandName,
  onBrandNameChange,
  isLoading,
}: BrandHeaderProps) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="brand-name"
        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
      >
        {isCreatingNew ? "Create New Brand" : "Editing Brand"}
      </Label>
      <Input
        id="brand-name"
        type="text"
        value={brandName}
        onChange={(e) => onBrandNameChange(e.target.value)}
        placeholder="e.g., My Awesome Brand"
        disabled={isLoading}
        className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
};

export default BrandHeader;
