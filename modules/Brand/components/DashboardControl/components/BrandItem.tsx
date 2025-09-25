// components/BrandItem.tsx
"use client";

import React, { useRef } from "react";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBrandContext } from "@/contexts/BrandContext";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { ConfirmationDialogHandle } from "@/components/ConfirmationDialog/ConfirmationDialog";

interface BrandItemProps {
  id: string;
  name: string;
  isSelected?: boolean;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    highlightColor: string;
  };
  onClick?: (brandId: string, brandName: string) => void;
  onEdit?: (brandId: string, brandName: string) => void;
  onDelete?: (brandId: string, brandName: string) => void;
}

const BrandItem: React.FC<BrandItemProps> = ({
  id,
  name,
  isSelected = false,
  colors,
  onClick,
  onEdit,
  onDelete,
}) => {
  const {
    state: { brands },
  } = useBrandContext();
  const router = useRouter();

  const handleClick = () => {
    onClick?.(id, name);
  };

  const deleteConfirmationDialogRef = useRef<ConfirmationDialogHandle>(null);

  const handleEditBrand = () => {
    onEdit?.(id, name);
    router.push(`/brand-setup`);
  };

  const handleDeleteBrand = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent onClick
    deleteConfirmationDialogRef.current?.open();
  };

  const handleConfirmDelete = () => {
    onDelete?.(id, name);
    deleteConfirmationDialogRef.current?.close();
  };

  const handleCancelDelete = () => {
    deleteConfirmationDialogRef.current?.close();
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        ref={deleteConfirmationDialogRef}
        title="Delete Brand"
        description={`Are you sure you want to delete "${name}"?`}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        label="Delete"
      />
      <div
        className={`flex items-center justify-between p-0.5 rounded-lg cursor-pointer ${
          isSelected ? "bg-[#D9F4F4]" : ""
        }`}
        onClick={handleClick}
      >
        <div
          className={`flex items-center justify-between px-3 py-1.5 rounded-lg w-full cursor-pointer`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-8 w-8 rounded-md overflow-hidden flex-shrink-0">
              <div
                className="w-1/3 h-full"
                style={{ backgroundColor: colors?.secondaryColor }}
              />
              <div
                className="w-1/3 h-full"
                style={{ backgroundColor: colors?.primaryColor }}
              />
              <div
                className="w-1/3 h-full"
                style={{ backgroundColor: colors?.highlightColor }}
              />
            </div>
            <span
              className={`text-[0.80rem] font-medium text-[#343B3F] truncate min-w-0`}
            >
              {name}
            </span>
          </div>
          <div>
            {isSelected && (
              <>
                <button
                  onClick={handleEditBrand}
                  className="p-1 rounded transition-colors cursor-pointer"
                  title={`Edit ${name}`}
                >
                  <Pencil
                    className={`w-4 h-4  text-[#343B3F] hover:text-primary`}
                  />
                </button>
                {brands.length !== 1 && (
                  <button
                    onClick={handleDeleteBrand}
                    className="p-1 rounded transition-colors cursor-pointer"
                    title={`Edit ${name}`}
                  >
                    <Trash
                      className={`w-4 h-4 text-[#343B3F] hover:text-red-600`}
                    />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandItem;
