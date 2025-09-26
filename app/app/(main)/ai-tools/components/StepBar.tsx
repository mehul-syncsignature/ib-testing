import React from "react";
import { cn } from "@/lib/utils";

interface StepBarProps {
  currentStep: number;
}

const StepBar = ({ currentStep }: StepBarProps) => {
  const steps = [1, 2, 3];
  return (
    <div className="flex items-center justify-left mb-6 select-none">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          {index > 0 && (
            <div
              className={`h-[3px] w-[50px] ${
                currentStep > step - 1 ? "bg-primary" : "bg-[#E8EDED]"
              }`}
            ></div>
          )}
          <div className="relative flex flex-col items-center justify-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full border-1 flex items-center justify-center transition-all duration-300",
                currentStep >= step
                  ? "bg-primary border-primary"
                  : "bg-white border-[#E8EDED]"
              )}
            >
              {currentStep > step ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step ? "text-white" : "text-gray-500"
                  )}
                >
                  {step}
                </span>
              )}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepBar;
