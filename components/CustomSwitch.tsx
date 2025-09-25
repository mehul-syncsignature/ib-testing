/* eslint-disable @typescript-eslint/no-explicit-any */
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
  customStyles?: any;
}

export default function CustomSwitch({
  trueLabel = "Dark",
  falseLabel = "Light",
  onChange,
  value = false,
  className,
  customStyles,
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
    <div className="flex flex-col gap-1">
      <div
        onClick={handleSwitchClick}
        className={cn(
          "flex rounded-lg bg-[#F3F5F6] p-1 w-full cursor-pointer relative overflow-hidden",
          className
        )}
        style={{
          ...customStyles,
        }}
      >
        {/* Background indicator */}
        <div
          className="absolute h-[calc(100%-8px)] top-1 rounded-lg bg-primary transition-all duration-300 ease-in-out"
          style={{
            width: "calc(50% - 4px)",
            left: isOn ? "calc(50% + 0px)" : "4px",
            ...customStyles,
          }}
        />
        {/* Option for "false" (left) */}
        <div
          className={cn(
            "px-4 py-1.5 rounded-lg text-primary font-medium text-sm z-10 transition-transform duration-300 ease-in-out flex-1 text-center content-center",
            !isOn && "scale-105 text-white"
          )}
        >
          {trueLabel}
        </div>
        {/* Option for "true" (right) */}
        <div
          className={cn(
            "px-4 py-1.5 rounded-lg text-primary font-medium text-sm z-10 transition-transform duration-300 ease-in-out flex-1 text-center content-center items-center",
            isOn && "scale-105 text-white"
          )}
        >
          {falseLabel}
        </div>
      </div>
    </div>
  );
}
