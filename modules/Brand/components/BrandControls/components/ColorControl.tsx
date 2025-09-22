// modules/Brand/components/BrandControls/components/ColorControl.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Moon, PaletteIcon, Shuffle, Sun } from "lucide-react";
import ColorPaletteDropdown, {
  ColorPaletteRef,
  ColorTrio,
  findColorTrioByColors,
} from "./ColorPaletteDropdown";
import { useBrandContext } from "@/contexts/BrandContext";

const ColorControl = () => {
  const {
    state: { brand },
    setColors,
    setIsDarkMode,
    setOriginalColors,
  } = useBrandContext();

  const colorPaletteRef = useRef<ColorPaletteRef>(null);

  const handleColorTrioChange = (trio: ColorTrio) => {
    const newOriginalColors = {
      primaryColor: trio.colors[1].value,
      secondaryColor: trio.colors[0].value,
      highlightColor: trio.colors[2].value,
    };
    setOriginalColors(newOriginalColors);

    if (brand?.config?.isDarkMode) {
      setColors({
        primaryColor: newOriginalColors.highlightColor,
        secondaryColor: newOriginalColors.primaryColor,
        highlightColor: newOriginalColors.primaryColor,
        textColor: "#000000",
      });
    } else {
      setColors({
        primaryColor: newOriginalColors.primaryColor,
        secondaryColor: newOriginalColors.secondaryColor,
        highlightColor: newOriginalColors.highlightColor,
        textColor: "#FFFFFF",
      });
    }
  };

  const handleModeChange = (mode: boolean) => {
    setIsDarkMode(mode);
    if (!brand?.config?.isDarkMode) {
      setColors({
        primaryColor: brand?.config?.originalColors.highlightColor,
        secondaryColor: brand?.config?.originalColors.primaryColor,
        highlightColor: brand?.config?.originalColors.primaryColor,
        textColor: "#000000",
      });
    } else {
      setColors({
        primaryColor: brand?.config?.originalColors.primaryColor,
        secondaryColor: brand?.config?.originalColors.secondaryColor,
        highlightColor: brand?.config?.originalColors.highlightColor,
        textColor: "#FFFFFF",
      });
    }
  };

  const handleRandomizeColors = () => {
    if (colorPaletteRef.current) {
      handleColorTrioChange(colorPaletteRef.current.randomize());
    }
  };

  const derivedSelectedColorTrio = brand?.config?.originalColors
    ? findColorTrioByColors(brand?.config?.originalColors)
    : undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PaletteIcon className="w-4 h-4" />
          <span className="font-medium text-sm">COLORS</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              handleModeChange(!brand?.config?.isDarkMode);
            }}
          >
            {!brand?.config?.isDarkMode ? (
              <Sun
                className={`h-5 w-5 rotate-0 scale-100 transition-all ${
                  !brand?.config?.isDarkMode ? "-rotate-90 scale-0" : ""
                }`}
              />
            ) : (
              <Moon
                className={`absolute h-5 w-5 rotate-90 scale-0 transition-all ${
                  brand?.config?.isDarkMode ? "rotate-0 scale-100" : ""
                }`}
              />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleRandomizeColors}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ColorPaletteDropdown
        ref={colorPaletteRef}
        defaultTrio={derivedSelectedColorTrio}
        onChange={handleColorTrioChange}
      />
    </div>
  );
};

export default ColorControl;
