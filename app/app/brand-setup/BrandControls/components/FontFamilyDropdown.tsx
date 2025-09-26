// modules/Brand/components/BrandControls/components/FontFamilyDropdown.tsx

"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getFontFamily } from "@/lib/fonts";

export interface FontOption {
  primary: string;
  secondary: string;
  primaryFontWeight?: number;
  secondaryFontWeight?: number;
}

interface FontFamilyDropdownProps {
  defaultFont?: FontOption;
  onChange?: (font: FontOption) => void;
  className?: string;
}

export interface FontFamilyRef {
  fontOptions: FontOption[];
  selectedFont: FontOption;
  setSelectedFont: (font: FontOption) => void;
  randomize: () => FontOption;
}

// Your font options
export const fontOptions: FontOption[] = [
  {
    primary: "DM Serif Display",
    secondary: "DM Sans",
    primaryFontWeight: 400,
    secondaryFontWeight: 400,
  },
  {
    primary: "Oswald",
    secondary: "Source Sans 3",
    primaryFontWeight: 500,
    secondaryFontWeight: 400,
  },
  {
    primary: "Big Shoulders Display",
    secondary: "Inter",
    primaryFontWeight: 700,
    secondaryFontWeight: 400,
  },
  {
    primary: "Fjalla One",
    secondary: "Cantarell",
    primaryFontWeight: 400,
    secondaryFontWeight: 400,
  },
  {
    primary: "Syne",
    secondary: "Inter",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Yellowtail",
    secondary: "Lato",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Rubik",
    secondary: "Roboto Mono",
    primaryFontWeight: 500,
    secondaryFontWeight: 400,
  },
  {
    primary: "League Spartan",
    secondary: "Work Sans",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Anton",
    secondary: "Roboto",
    primaryFontWeight: 500,
    secondaryFontWeight: 400,
  },
  {
    primary: "Teko",
    secondary: "Ubuntu",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Philosopher",
    secondary: "Mulish",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Archivo Black",
    secondary: "Archivo",
    primaryFontWeight: 500,
    secondaryFontWeight: 200,
  },
  {
    primary: "Della Respira",
    secondary: "Open Sans",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Rozha One",
    secondary: "Questrial",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Bangers",
    secondary: "Oswald",
    primaryFontWeight: 500,
    secondaryFontWeight: 400,
  },
  {
    primary: "Bebas Neue",
    secondary: "Lato",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Poppins",
    secondary: "Inter",
    primaryFontWeight: 400,
    secondaryFontWeight: 400,
  },
  {
    primary: "Lora",
    secondary: "Ubuntu",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Playfair Display",
    secondary: "Chivo",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
  {
    primary: "Bricolage Grotesque",
    secondary: "Lato",
    primaryFontWeight: 600,
    secondaryFontWeight: 400,
  },
];

const FontFamilyDropdown = forwardRef<FontFamilyRef, FontFamilyDropdownProps>(
  ({ defaultFont, onChange, className = "" }, ref) => {
    const [selectedFont, setSelectedFont] = useState<FontOption>(
      defaultFont || fontOptions[0]
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const currentIndexRef = useRef<number>(0);

    useImperativeHandle(ref, () => ({
      fontOptions,
      selectedFont,
      setSelectedFont: (font: FontOption) => {
        setSelectedFont(font);
        if (onChange) onChange(font);
      },
      randomize: () => {
        currentIndexRef.current =
          (currentIndexRef.current + 1) % fontOptions.length;
        const nextFont = fontOptions[currentIndexRef.current];

        setSelectedFont(nextFont);
        if (onChange) onChange(nextFont);

        return nextFont;
      },
    }));

    const handleFontSelect = (font: FontOption): void => {
      setSelectedFont(font);
      setIsOpen(false);
      if (onChange) onChange(font);
    };

    return (
      <div className={`w-full ${className}`}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-full justify-between bg-white border-[#D9DBDB]"
              variant="secondary"
            >
              <span
                className="font-medium truncate"
                style={{
                  fontFamily: getFontFamily(selectedFont.primary),
                  fontWeight: selectedFont.primaryFontWeight || 400,
                }}
              >
                {selectedFont.primary}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-2 w-[335px] bg-white border border-gray-200 rounded-lg shadow-lg p-0"
            align="start"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="text-sm font-medium text-gray-500">
                TYPOGRAPHY STYLE
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="focus:outline-none p-1 -mr-1 rounded hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="py-0 max-h-[360px] overflow-y-auto fonts-container">
              {fontOptions.map((font, index) => (
                <button
                  key={`${font.primary}-${font.secondary}-${index}`}
                  onClick={() => handleFontSelect(font)}
                  className={`font-option-item cursor-pointer w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    selectedFont.primary === font.primary &&
                    selectedFont.secondary === font.secondary
                      ? "bg-gray-100"
                      : ""
                  }`}
                >
                  <span
                    className="font-bold text-gray-800 truncate"
                    style={{
                      fontFamily: getFontFamily(font.primary),
                      fontWeight: font.primaryFontWeight || 400,
                    }}
                  >
                    {font.primary}
                  </span>
                  {font.secondary && (
                    <div className="flex items-center text-gray-500 text-sm ml-2 flex-shrink-0">
                      <span className="mx-1.5">+</span>
                      <span
                        className="truncate"
                        style={{
                          fontFamily: getFontFamily(font.secondary),
                          fontWeight: font.secondaryFontWeight || 400,
                        }}
                      >
                        {font.secondary}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

FontFamilyDropdown.displayName = "FontFamilyDropdown";

export default FontFamilyDropdown;
