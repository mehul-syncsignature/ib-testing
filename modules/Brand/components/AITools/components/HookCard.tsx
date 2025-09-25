import React from "react";
import LinkedInBrandMark from "./PostPreview/components/LinkedInBrandMark";

interface HookCardProps {
  className?: string;
  data: string;
  isSelected?: boolean;
  onSelect?: () => void;
  id?: string | number;
  name?: string;
}

const HookCard: React.FC<HookCardProps> = ({
  data = "",
  className = "",
  isSelected = false,
  onSelect,
  id,
  name = "hookCard",
}) => {
  return (
    <div
      className={`w-full mx-auto bg-white rounded-[8px] p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-2 border-primary shadow-[0px_0px_10px_2px_rgba(0,0,0,0.16)]"
          : "border-2 border-white"
      } ${className}`}
      onClick={onSelect}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2.5">
        <LinkedInBrandMark />
        {/* Radio Button */}
        <div className="relative flex items-center justify-center w-5 h-5">
          {/* Hidden Radio Input */}
          <input
            type="radio"
            id={String(id)}
            name={name}
            checked={isSelected}
            onChange={onSelect}
            className="absolute inset-0 opacity-0 peer"
          />
          {/* Visual Radio Button */}
          {isSelected ? (
            <div className="w-5 h-5 rounded-full border-1 flex items-center justify-center transition-all duration-300 bg-primary border-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-primary"></div>
          )}
        </div>
      </div>
      {/* Text Content */}
      <div
        className="text-[#011C20] text-left text-lg font-normal"
        style={{
          lineHeight: "130%",
        }}
      >
        {data}
      </div>
    </div>
  );
};

export default HookCard;
