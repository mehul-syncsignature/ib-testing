// hooks/useDataMigration.ts - Phase 2 data migration hook

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useBrandContext } from "@/contexts/BrandContext";
import { useUpsertBrand } from "@/hooks/brand";
import { useUpsertDesign } from "@/hooks/designs";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { 
  getUnauthenticatedData, 
  clearUnauthenticatedData, 
  hasUnauthenticatedData,
  getUnauthenticatedDataSummary 
} from "@/utils/unauthenticatedStorage";
import { Brand } from "@/contexts/BrandContext/types";

interface MigrationResult {
  success: boolean;
  brandMigrated: boolean;
  designsMigrated: number;
  errors: string[];
}

export const useDataMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state: { isSignedIn } } = useAppContext();
  const { setBrand, state: { brand } } = useBrandContext();
  const [upsertBrand] = useUpsertBrand();
  const [upsertDesign] = useUpsertDesign();

  const checkForStoredData = () => {
    return hasUnauthenticatedData();
  };

  const getStoredDataSummary = () => {
    return getUnauthenticatedDataSummary();
  };

  const migrateStoredData = async (skipAuthCheck = false): Promise<MigrationResult> => {
    if (!skipAuthCheck && !isSignedIn) {
      throw new Error("User must be signed in to migrate data");
    }

    setIsLoading(true);
    setError(null);

    const result: MigrationResult = {
      success: false,
      brandMigrated: false,
      designsMigrated: 0,
      errors: [],
    };

    try {
      const storedData = getUnauthenticatedData();
      
      if (!storedData) {
        result.success = true;
        return result;
      }

      // Migrate brand data if it exists and has modifications
      if (storedData.modifications && Object.keys(storedData.modifications.brandChanges).length > 0) {
        try {
          const existingBrand = brand?.id ? brand : null;
          
          const brandToUpdate = {
            ...storedData.modifications.brandChanges,
            ...(existingBrand?.id ? { id: existingBrand.id } : {}),
          } as Brand;
          
          const migratedBrand = await upsertBrand(brandToUpdate);
          if (migratedBrand) {
            setBrand(migratedBrand);
            result.brandMigrated = true;
          }
        } catch (err) {
          result.errors.push(`Failed to migrate brand: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      // Migrate designs if they exist
      if (storedData.designs && storedData.designs.length > 0) {
        // Use the current brand ID
        const brandId = brand?.id;
        
        if (!brandId) {
          result.errors.push('No brand available for design migration');
        } else {
          for (const design of storedData.designs) {
            try {
              // Convert the stored design to the format expected by upsertDesign
              await upsertDesign({
                brandId,
                assetType: design.assetType as AssetTypeKeys,
                styleId: design.styleId,
                templateId: design.templateId,
                data: design.data,
                // Don't include the temporary ID - let the API generate a new one
              });
              result.designsMigrated++;
            } catch (err) {
              result.errors.push(`Failed to migrate design: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }
        }
      }

      // If we got this far with no major errors, clear the stored data
      if (result.errors.length === 0 || (result.brandMigrated || result.designsMigrated > 0)) {
        clearUnauthenticatedData();
        result.success = true;
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to migrate stored data';
      setError(errorMessage);
      result.errors.push(errorMessage);
    } finally {
      setIsLoading(false);
    }

    return result;
  };

  const clearStoredData = () => {
    clearUnauthenticatedData();
  };

  return {
    checkForStoredData,
    getStoredDataSummary,
    migrateStoredData,
    clearStoredData,
    isLoading,
    error,
  };
};