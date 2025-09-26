import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define types for our component
export interface ColorOption {
  name: string;
  value: string;
}

export interface ColorTrio {
  name: string;
  colors: [ColorOption, ColorOption, ColorOption];
}

interface ColorPaletteDropdownProps {
  defaultTrio?: ColorTrio;
  onChange?: (trio: ColorTrio) => void;
}

// Define ref interface to avoid using 'any'
export interface ColorPaletteRef {
  colorTrios: ColorTrio[];
  selectedTrio: ColorTrio;
  setSelectedTrio: (trio: ColorTrio) => void;
  randomize: () => ColorTrio;
}

export const findColorTrioByColors = (colors: {
  primaryColor: string;
  secondaryColor: string;
  highlightColor: string;
}): ColorTrio | undefined => {
  return colorTrios.find(
    (trio) =>
      trio.colors[1].value === colors.primaryColor &&
      trio.colors[0].value === colors.secondaryColor &&
      trio.colors[2].value === colors.highlightColor
  );
};

export const colorTrios: ColorTrio[] = [
  // trio-1
  {
    name: "Forest Depths",
    colors: [
      { name: "Deep Green", value: "#081C15" },
      { name: "Green", value: "#1B4332" },
      { name: "Pale Green", value: "#D8F3DC" },
    ],
  },
  {
    name: "Royal Velvet",
    colors: [
      { name: "Deep Purple", value: "#201037" },
      { name: "Purple", value: "#5F4388" },
      { name: "Pale Purple", value: "#EFE5FF" },
    ],
  },
  {
    name: "Autumn Harvest",
    colors: [
      { name: "Deep Orange", value: "#461004" },
      { name: "Orange", value: "#FF4F00" },
      { name: "Pale Orange", value: "#FFF6EC" },
    ],
  },
  // trio-2
  {
    name: "Wine Berry",
    colors: [
      { name: "Burgundy", value: "#521125" },
      { name: "Coral", value: "#77243E" },
      { name: "Pale Coral", value: "#FCF3F7" },
    ],
  },
  {
    name: "Garden Fresh",
    colors: [
      { name: "Olive", value: "#1A2013" },
      { name: "Chartreuse", value: "#54653B" },
      { name: "Pale Chartreuse", value: "#F4F6EF" },
    ],
  },
  {
    name: "Ocean Deep",
    colors: [
      { name: "Deep Blue", value: "#010021" },
      { name: "Blue", value: "#0000B0" },
      { name: "Pale Blue", value: "#E4EEFF" },
    ],
  },
  // trio-3
  {
    name: "Neon Dreams",
    colors: [
      { name: "Deep Blue", value: "#5F0029" },
      { name: "Blue", value: "#FF088A" },
      { name: "Pale Blue", value: "#FFF0F9" },
    ],
  },
  {
    name: "Clay Earth",
    colors: [
      { name: "Deep Terracotta", value: "#2E000E" },
      { name: "Terracotta", value: "#AE0336" },
      { name: "Pale Terracotta", value: "#FAE3EA" },
    ],
  },
  {
    name: "Electric Bloom",
    colors: [
      { name: "Plum", value: "#230B6A" },
      { name: "Rose", value: "#6129F8" },
      { name: "Pale Rose", value: "#F3F2FF" },
    ],
  },
  // trio-4
  {
    name: "Lavender Fields",
    colors: [
      { name: "Mauve", value: "#391B5A" },
      { name: "Rose", value: "#975FDF" },
      { name: "Pale Rose", value: "#F7F5FD" },
    ],
  },
  {
    name: "Ruby Fire",
    colors: [
      { name: "Deep Gold", value: "#530019" },
      { name: "Gold", value: "#C80139" },
      { name: "Pale Gold", value: "#FFF0F2" },
    ],
  },
  {
    name: "Stone Shadow",
    colors: [
      { name: "Black", value: "#292726" },
      { name: "Medium Gray", value: "#9B928F" },
      { name: "Light Gray", value: "#F8F8F8" },
    ],
  },
  // trio-5
  {
    name: "Blush Rose",
    colors: [
      { name: "Mauve", value: "#50011B" },
      { name: "Rose", value: "#FF3662" },
      { name: "Pale Rose", value: "#FFF0F2" },
    ],
  },
  {
    name: "Forest Mint",
    colors: [
      { name: "Deep Gold", value: "#0D3934" },
      { name: "Gold", value: "#1C695C" },
      { name: "Pale Gold", value: "#F2FBF8" },
    ],
  },
  {
    name: "Amber Glow",
    colors: [
      { name: "Black", value: "#411309" },
      { name: "Medium Gray", value: "#F1742B" },
      { name: "Light Gray", value: "#FDEBD7" },
    ],
  },
  // trio-6
  {
    name: "Midnight Sky",
    colors: [
      { name: "Mauve", value: "#07183B" },
      { name: "Rose", value: "#3A5CA2" },
      { name: "Pale Rose", value: "#F3F7FF" },
    ],
  },
  {
    name: "Sunset Bloom",
    colors: [
      { name: "Deep Gold", value: "#3C0014" },
      { name: "Gold", value: "#EB427B" },
      { name: "Pale Gold", value: "#FFDCE8" },
    ],
  },
  {
    name: "Golden Hour",
    colors: [
      { name: "Black", value: "#440F04" },
      { name: "Medium Gray", value: "#F7941E" },
      { name: "Light Gray", value: "#FFF7EB" },
    ],
  },
  // trio-7
  {
    name: "Arctic Breeze",
    colors: [
      { name: "Mauve", value: "#03045E" },
      { name: "Rose", value: "#0077B6" },
      { name: "Pale Rose", value: "#CAF0F8" },
    ],
  },
  {
    name: "Cherry Blossom",
    colors: [
      { name: "Deep Gold", value: "#430E22" },
      { name: "Gold", value: "#E56F8C" },
      { name: "Pale Gold", value: "#FDF3F5" },
    ],
  },
  {
    name: "Mystic Purple",
    colors: [
      { name: "Black", value: "#371358" },
      { name: "Medium Gray", value: "#D9C3F5" },
      { name: "Light Gray", value: "#FAF6FE" },
    ],
  },
  // trio-8
  {
    name: "Honey Meadow",
    colors: [
      { name: "Mauve", value: "#482200" },
      { name: "Rose", value: "#FFC109" },
      { name: "Pale Rose", value: "#FFFFEA" },
    ],
  },
  {
    name: "Spring Lime",
    colors: [
      { name: "Deep Gold", value: "#1B2A09" },
      { name: "Gold", value: "#7FB526" },
      { name: "Pale Gold", value: "#F6FCE9" },
    ],
  },
  {
    name: "Candy Pink",
    colors: [
      { name: "Black", value: "#4E0920" },
      { name: "Medium Gray", value: "#F180B5" },
      { name: "Light Gray", value: "#FDF2F7" },
    ],
  },
  // trio-9
  {
    name: "Rustic Earth",
    colors: [
      { name: "Mauve", value: "#3E1111" },
      { name: "Rose", value: "#9E2D2D" },
      { name: "Pale Rose", value: "#FDF3F3" },
    ],
  },
  {
    name: "Bronze Age",
    colors: [
      { name: "Deep Gold", value: "#411A02" },
      { name: "Gold", value: "#79380E" },
      { name: "Pale Gold", value: "#FFFCEB" },
    ],
  },
  {
    name: "Steel Blue",
    colors: [
      { name: "Black", value: "#132F34" },
      { name: "Medium Gray", value: "#22484D" },
      { name: "Light Gray", value: "#F3FAF9" },
    ],
  },
  // trio-10
  {
    name: "Glacier Blue",
    colors: [
      { name: "Mauve", value: "#052F4C" },
      { name: "Rose", value: "#03ABFC" },
      { name: "Pale Rose", value: "#EFF9FF" },
    ],
  },
  {
    name: "Emerald Fresh",
    colors: [
      { name: "Deep Gold", value: "#044F13" },
      { name: "Gold", value: "#37C253" },
      { name: "Pale Gold", value: "#D4FFDD" },
    ],
  },
  {
    name: "Coffee Bean",
    colors: [
      { name: "Black", value: "#2E1E1C" },
      { name: "Medium Gray", value: "#7C5147" },
      { name: "Light Gray", value: "#F9F5F3" },
    ],
  },
  // trio-11
  {
    name: "Storm Cloud",
    colors: [
      { name: "Mauve", value: "#212E4A" },
      { name: "Rose", value: "#6EA9DD" },
      { name: "Pale Rose", value: "#F2F7FC" },
    ],
  },
  {
    name: "Cosmic Purple",
    colors: [
      { name: "Deep Gold", value: "#430F43" },
      { name: "Gold", value: "#AD3FB3" },
      { name: "Pale Gold", value: "#FCF6FD" },
    ],
  },
  {
    name: "Urban Slate",
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Medium Gray", value: "#212529" },
      { name: "Light Gray", value: "#F8F9FA" },
    ],
  },
];

const ColorPaletteDropdown = forwardRef<
  ColorPaletteRef,
  ColorPaletteDropdownProps
>(({ defaultTrio, onChange }, ref) => {
  // Use the first color trio as fallback if no defaultTrio is provided
  const [selectedTrio, setSelectedTrio] = useState<ColorTrio>(colorTrios[32]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const currentIndexRef = useRef<number>(0);

  // Update selectedTrio when defaultTrio changes (coming from parent component)
  useEffect(() => {
    if (defaultTrio) {
      setSelectedTrio(defaultTrio);
    }
  }, [defaultTrio]);

  // Expose methods and state to parent component
  useImperativeHandle(ref, () => ({
    colorTrios,
    selectedTrio,
    setSelectedTrio: (trio: ColorTrio) => {
      setSelectedTrio(trio);
      if (onChange) {
        onChange(trio);
      }
    },
    randomize: () => {
      // Sequential selection: move to next index
      currentIndexRef.current =
        (currentIndexRef.current + 1) % colorTrios.length;
      const nextTrio = colorTrios[currentIndexRef.current];
      setSelectedTrio(nextTrio);
      if (onChange) {
        onChange(nextTrio);
      }
      return nextTrio;
    },
  }));

  // Organize trios into a grid layout (3 trios per row)
  const trioRows: ColorTrio[][] = [];
  for (let i = 0; i < colorTrios.length; i += 3) {
    trioRows.push(colorTrios.slice(i, Math.min(i + 3, colorTrios.length)));
  }

  const handleTrioSelect = (trio: ColorTrio): void => {
    setSelectedTrio(trio);
    setIsOpen(false);
    if (onChange) {
      onChange(trio);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
  };

  // Create background color style objects based on color values
  const getColorStyle = (color: ColorOption) => ({
    backgroundColor: color.value,
  });

  return (
    <div className="w-full">
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            className="w-full justify-between bg-white border-[#D9DBDB]"
            variant="secondary"
          >
            <div className="flex items-center flex-1 truncate">
              <div className="h-6 flex mr-3 rounded">
                {selectedTrio.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 ${
                      index === 0 ? "rounded-l" : index === 2 ? "rounded-r" : ""
                    }`}
                    style={getColorStyle(color)}
                  />
                ))}
              </div>
              <span className="text-gray-600">{selectedTrio.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="mt-2 w-[335px] bg-white border border-gray-200 rounded-lg shadow-lg"
          align="start"
          alignOffset={0}
        >
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <div className="text-sm font-medium">BRAND COLORS</div>
            <button
              onClick={() => setIsOpen(false)}
              className="focus:outline-none"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="p-3">
            {trioRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex mb-2 last:mb-0 justify-between"
              >
                {row.map((trio, trioIndex) => {
                  const isSelected = selectedTrio.name === trio.name;
                  return (
                    <button
                      key={trioIndex}
                      onClick={() => handleTrioSelect(trio)}
                      className={`flex rounded hover:opacity-80 transition-opacity cursor-pointer ${
                        isSelected ? "ring-2 ring-black" : ""
                      }`}
                      title={trio.name}
                    >
                      {trio.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className={`w-5 h-6 ${
                            colorIndex === 0
                              ? "rounded-l"
                              : colorIndex === 2
                              ? "rounded-r"
                              : ""
                          }`}
                          style={getColorStyle(color)}
                        />
                      ))}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

ColorPaletteDropdown.displayName = "ColorPaletteDropdown";

export default ColorPaletteDropdown;
