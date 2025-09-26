// modules/Brand/components/BrandControls/components/FontControl.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CaseSensitive, Shuffle } from "lucide-react";
import FontFamilyDropdown, {
  FontFamilyRef,
  FontOption,
} from "./FontFamilyDropdown";
import { useBrandContext } from "@/contexts/BrandContext";

const FontControl = () => {
  const {
    state: { brand },
    setTypography,
  } = useBrandContext();
  const fontFamilyRef = useRef<FontFamilyRef>(null);

  const handleFontChange = (font: FontOption) => {
    setTypography({
      primaryFont: font.primary,
      secondaryFont: font.secondary || font.primary,
      primaryFontWeight: font.primaryFontWeight,
      secondaryFontWeight: font.secondaryFontWeight,
    });
  };

  const handleRandomizeFonts = () => {
    if (fontFamilyRef.current) {
      handleFontChange(fontFamilyRef.current.randomize());
    }
  };

  const defaultFont = {
    primary: brand?.config?.typography?.primaryFont,
    secondary: brand?.config?.typography?.secondaryFont,
    primaryFontWeight: brand?.config?.typography?.primaryFontWeight,
    secondaryFontWeight: brand?.config?.typography?.secondaryFontWeight,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CaseSensitive className="w-5 h-5" />{" "}
          <span className="font-medium text-sm">FONTS</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleRandomizeFonts}
        >
          <Shuffle className="w-4 h-4" />
        </Button>
      </div>
      <FontFamilyDropdown
        ref={fontFamilyRef}
        defaultFont={defaultFont}
        onChange={handleFontChange}
      />
    </div>
  );
};

export default FontControl;
