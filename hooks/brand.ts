/* eslint-disable no-console */
// hooks/brand.ts
import { useState } from "react";
import { Brand } from "@/contexts/BrandContext/types";
import useApi from "@/lib/api";
import { useBrandContext } from "@/contexts/BrandContext";
import { set, omit } from "lodash";

// Type definitions matching the database structure
export interface CreateBrandRequest {
  id?: string; // Optional ID for updates
  name: string;
  config: Brand["config"];
  social_links?: Brand["socialLinks"];
  brand_images?: Brand["brandImages"];
  info_questions?: Brand["infoQuestions"];
  brand_mark?: Brand["brandMark"];
}

export interface UpdateBrandRequest {
  name?: string;
  config?: Brand["config"];
  social_links?: Brand["socialLinks"];
  brand_images?: Brand["brandImages"];
  info_questions?: Brand["infoQuestions"];
  brand_mark?: Brand["brandMark"];
}

export const useFetchBrands = () => {
  const api = useApi();
  const { setBrands, setBrand } = useBrandContext();
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    setHookError(null);

    try {
      const response = await api.get("/brands");
      const brandsData = response.data || [];

      // Omit server-only fields from each brand
      const cleanedBrands = brandsData.map((brand: Brand) =>
        omit(brand, ["userId", "updatedAt", "createdAt"])
      );
      setBrands(cleanedBrands);
      if (cleanedBrands.length > 0) {
        setBrand(cleanedBrands[0]);
      }

      return cleanedBrands;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch brands");
      setBrands([]);
      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [fetchBrands, { loading, error }] as const;
};

export const useFetchBrand = () => {
  const api = useApi();
  const { setBrand } = useBrandContext();
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const fetchBrand = async (brandId: string) => {
    if (!brandId) return;

    setLoading(true);
    setHookError(null);

    try {
      const response = await api.get(`/brands/${brandId}`);
      const brandData = response.data;

      // Omit server-only fields
      const cleanedBrand = omit(brandData, [
        "userId",
        "updatedAt",
        "createdAt",
      ]) as Brand;

      setBrand(cleanedBrand);
      return cleanedBrand;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch brand");

      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [fetchBrand, { loading, error: error }] as const;
};

export const useUpsertBrand = () => {
  const api = useApi();
  const { setBrand, setBrands, state } = useBrandContext();
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const upsertBrand = async (brandData: CreateBrandRequest) => {
    setLoading(true);
    setHookError(null);

    try {
      const headshotUrlCopy = brandData.brand_mark?.headshotUrl;

      const newBrand = {
        ...brandData,
      };

      // Convert camelCase to snake_case for API
      const apiPayload = {
        ...(newBrand.id ? { id: newBrand.id } : {}), // Include ID if present
        name: newBrand.name,
        config: newBrand.config,
        social_links: newBrand.social_links,
        brand_images: newBrand.brand_images,
        info_questions: newBrand.info_questions,
        brand_mark: newBrand.brand_mark,
      };

      const response = await api.post("/brands/upsert-brand", apiPayload);
      const data = response.data;

      // Omit server-only fields and set headshot URL
      const cleanedData = omit(data, [
        "userId",
        "updatedAt",
        "createdAt",
      ]) as Brand;
      const transformedBrand = set(
        cleanedData,
        "brandMark.headshotUrl",
        headshotUrlCopy
      );

      // Update the current brand
      setBrand(transformedBrand);

      // Update brands array - check if brand exists, if yes update it, if no add it
      const existingBrandIndex = state.brands.findIndex(
        (brand) => brand.id === transformedBrand.id
      );
      let updatedBrands;

      if (existingBrandIndex !== -1) {
        // Update existing brand
        updatedBrands = [...state.brands];
        updatedBrands[existingBrandIndex] = transformedBrand;
      } else {
        // Add new brand
        updatedBrands = [...state.brands, transformedBrand];
      }

      setBrands(updatedBrands);

      return data;
    } catch (err) {
      console.error("Upsert brand error:", err);
      const errorObj =
        err instanceof Error ? err : new Error("Failed to create/save brand");

      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [upsertBrand, { loading, error }] as const;
};

export const useDeleteBrand = () => {
  const {
    state: { brands },
    setBrands,
  } = useBrandContext();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);

  const deleteBrand = async (brandId: string) => {
    if (!brandId) {
      throw new Error("Brand ID is required");
    }

    setLoading(true);
    setHookError(null);

    try {
      const res = await api.post(`/brands/delete-brand`, { brandId });
      const updatedBrands = brands?.filter((b) => b.id !== res?.brandId);

      setBrands(updatedBrands);
      return res;
    } catch (err) {
      console.error("Delete brand error:", err);
      const errorObj =
        err instanceof Error ? err : new Error("Failed to delete brand");

      setHookError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [deleteBrand, { loading, error }] as const;
};
