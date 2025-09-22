"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Adjust the import path as needed

interface CustomSwitchProps {
  // Use labels for true/false options
  trueLabel: string;
  falseLabel: string;
  onChange?: (value: boolean) => void;
  value?: boolean;
  className?: string;
}

export default function CustomSwitch({
  trueLabel = "Dark",
  falseLabel = "Light",
  onChange,
  value = false,
  className,
}: CustomSwitchProps) {
  const [isOn, setIsOn] = useState(value);

  // Sync with prop changes
  useEffect(() => {
    setIsOn(value);
  }, [value]);

  const handleSwitchClick = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        onClick={handleSwitchClick}
        className="flex rounded-lg border border-gray-200 p-1 w-full cursor-pointer relative overflow-hidden"
      >
        {/* Background indicator */}
        <div
          className="absolute h-[calc(100%-8px)] top-1 rounded-lg shadow-lg bg-primary transition-all duration-300 ease-in-out"
          style={{
            width: "calc(50% - 4px)",
            left: isOn ? "calc(50% + 0px)" : "4px",
          }}
        />
        {/* Option for "false" (left) */}
        <div
          className={cn(
            "px-4 py-1.5 rounded-lg text-black font-medium text-sm z-10 transition-transform duration-300 ease-in-out flex-1 text-center",
            !isOn && "scale-105 text-white"
          )}
        >
          {trueLabel}
        </div>
        {/* Option for "true" (right) */}
        <div
          className={cn(
            "px-4 py-1.5 rounded-lg text-black font-medium text-sm z-10 transition-transform duration-300 ease-in-out flex-1 text-center",
            isOn && "scale-105 text-white"
          )}
        >
          {falseLabel}
        </div>
      </div>
    </div>
  );
}
