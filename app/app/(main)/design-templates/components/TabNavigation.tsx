"use client";
import { formatCategoryTitle } from "../utils";
import { AssetTypeKeys } from "../types";

interface TabNavigationProps {
  activeTab: "recent" | "category";
  currentAssetType: AssetTypeKeys;
}

export const TabNavigation = ({
  activeTab,
  currentAssetType,
}: TabNavigationProps) => {
  if (activeTab !== "category") return null;

  return (
    <div className="flex mb-4 border-b border-gray-200">
      <button className="px-4 py-2 text-sm font-medium cursor-pointer text-primary border-b-2 border-primary/90">
        {formatCategoryTitle(currentAssetType)}
      </button>
    </div>
  );
};
