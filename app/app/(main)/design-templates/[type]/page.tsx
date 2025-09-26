"use client";

import { notFound, useParams } from "next/navigation";
import { TemplatesGrid } from "@/app/app/(main)/design-templates/components/TemplatesGrid";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { getAllStylesByType } from "@/app/app/(main)/design-templates/utils";
import { isValidAssetType } from "@/common/utils";

const DesignTemplatesPage = () => {
  const params = useParams();
  const type = params.type as AssetTypeKeys;

  if (!isValidAssetType(type)) {
    notFound();
  }

  const allStyles = getAllStylesByType(type, "1");
  const firstStyle = allStyles?.[1] || null;

  return <TemplatesGrid currentAssetType={type} firstStyle={firstStyle} />;
};

export default DesignTemplatesPage;
