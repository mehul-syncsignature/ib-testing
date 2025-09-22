"use client";
import { ReactNode } from "react";
import { FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

interface FormFieldWrapperProps {
  label: string;
  fieldName: string;
  isVisible: boolean;
  onToggle: (checked: boolean) => void;
  showShuffleButton?: boolean;
  onShuffle?: () => void;
  children: ReactNode;
}

export const FormFieldWrapper = ({
  label,
  fieldName,
  isVisible,
  onToggle,
  showShuffleButton = false,
  onShuffle,
  children,
}: FormFieldWrapperProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <FormLabel className="text-sm font-medium text-gray-700">
          {label}
        </FormLabel>
        <div className="flex gap-1.5 items-center">
          {showShuffleButton && isVisible && onShuffle && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="h-8 text-xs flex gap-1"
              onClick={onShuffle}
            >
              <Shuffle className="w-3 h-3" />
            </Button>
          )}
          <Switch
            checked={isVisible}
            onCheckedChange={onToggle}
            id={`toggle-${fieldName}`}
          />
        </div>
      </div>
      {isVisible && children}
    </div>
  );
};
