// utils/unauthenticatedStorage.ts - Phase 2 data persistence for unauthenticated users

import { Data } from "@/contexts/AssetContext/types";
import { Brand } from "@/contexts/BrandContext/types";

interface UnauthenticatedDesign {
  id: string;
  name: string;
  assetType: string;
  templateId: number;
  styleId: number;
  data: Data;
  timestamp: number;
}

interface UnauthenticatedUserData {
  brand: Brand;
  designs: UnauthenticatedDesign[];
  modifications: {
    brandChanges: Partial<Brand>;
    lastModified: number;
  };
  version: string; // For future schema migrations
}

const STORAGE_KEY = "instantbranding_unauthenticated_data";
const CURRENT_VERSION = "1.0";

// Get all stored data for unauthenticated user
export const getUnauthenticatedData = (): UnauthenticatedUserData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as UnauthenticatedUserData;

    // Version check for future migrations
    if (data.version !== CURRENT_VERSION) {
      // Handle version migration here if needed
      return null;
    }

    return data;
  } catch {
    // Handle storage errors silently
    return null;
  }
};

// Save brand modifications
export const saveUnauthenticatedBrand = (brand: Brand): void => {
  try {
    const existing = getUnauthenticatedData();
    const data: UnauthenticatedUserData = {
      brand,
      designs: existing?.designs || [],
      modifications: {
        brandChanges: brand,
        lastModified: Date.now(),
      },
      version: CURRENT_VERSION,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Handle storage errors silently
  }
};

// Save design data
export const saveUnauthenticatedDesign = (
  design: Omit<UnauthenticatedDesign, "id" | "timestamp">
): void => {
  try {
    const existing = getUnauthenticatedData();
    const newDesign: UnauthenticatedDesign = {
      ...design,
      id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
    };

    const designs = existing?.designs || [];
    designs.push(newDesign);

    const data: UnauthenticatedUserData = {
      brand: existing?.brand || ({} as Brand),
      designs,
      modifications: existing?.modifications || {
        brandChanges: {},
        lastModified: Date.now(),
      },
      version: CURRENT_VERSION,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Handle storage errors silently
  }
};

// Remove a specific design
export const removeUnauthenticatedDesign = (designId: string): void => {
  try {
    const existing = getUnauthenticatedData();
    if (!existing) return;

    const designs = existing.designs.filter((d) => d.id !== designId);

    const data: UnauthenticatedUserData = {
      ...existing,
      designs,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Handle storage errors silently
  }
};

// Clear all unauthenticated data (called after successful migration)
export const clearUnauthenticatedData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Handle storage errors silently
  }
};

// Check if user has any stored data
export const hasUnauthenticatedData = (): boolean => {
  const data = getUnauthenticatedData();
  return !!(
    data &&
    (data.designs.length > 0 ||
      Object.keys(data.modifications.brandChanges).length > 0)
  );
};

// Get summary of stored data for migration prompt
export const getUnauthenticatedDataSummary = (): {
  designCount: number;
  hasCustomBrand: boolean;
} => {
  const data = getUnauthenticatedData();
  return {
    designCount: data?.designs?.length || 0,
    hasCustomBrand: !!(
      data && Object.keys(data.modifications.brandChanges).length > 0
    ),
  };
};
