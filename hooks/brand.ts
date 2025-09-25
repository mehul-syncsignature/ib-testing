/* eslint-disable no-console */
// hooks/brand.ts
import { useState } from "react";
import { Brand } from "@/contexts/BrandContext/types";
import useApi from "@/lib/api";
import { useBrandContext } from "@/contexts/BrandContext";
import { omit } from "lodash";

// Type definitions matching the database structure
export interface CreateBrandRequest {
  id?: string; // Optional ID for updates
  name: string;
  config: Brand["config"];
  socialLinks?: Brand["socialLinks"];
  brandImages?: Brand["brandImages"];
  infoQuestions?: Brand["infoQuestions"];
  brandMark?: Brand["brandMark"];
}

export interface UpdateBrandRequest {
  name?: string;
  config?: Brand["config"];
  socialLinks?: Brand["socialLinks"];
  brandImages?: Brand["brandImages"];
  infoQuestions?: Brand["infoQuestions"];
  brandMark?: Brand["brandMark"];
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

      // Omit server-only fields from each brand and ensure brandMark is properly initialized
      const cleanedBrands = brandsData.map((brand: Brand) => {
        const cleanedBrand = omit(brand, [
          "userId",
          "updatedAt",
          "createdAt",
        ]) as Brand;
        return {
          ...cleanedBrand,
          brandMark: {
            name: cleanedBrand.brandMark?.name || "",
            socialHandle: cleanedBrand.brandMark?.socialHandle || "",
            companyName: cleanedBrand.brandMark?.companyName || "",
            website: cleanedBrand.brandMark?.website || "",
            logoUrl: cleanedBrand.brandMark?.logoUrl || "",
            headshotUrl: cleanedBrand.brandMark?.headshotUrl || "",
            headshotGradient:
              cleanedBrand.brandMark?.headshotGradient || "solid-primary",
          },
        };
      });
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

      // Omit server-only fields and ensure brandMark is properly initialized
      const cleanedBrand = omit(brandData, [
        "userId",
        "updatedAt",
        "createdAt",
      ]) as Brand;

      const brandWithDefaults = {
        ...cleanedBrand,
        brandMark: {
          name: cleanedBrand.brandMark?.name || "",
          socialHandle: cleanedBrand.brandMark?.socialHandle || "",
          website: cleanedBrand.brandMark?.website || "",
          logoUrl: cleanedBrand.brandMark?.logoUrl || "",
          headshotUrl: cleanedBrand.brandMark?.headshotUrl || "",
          companyName: cleanedBrand.brandMark?.companyName || "",
          headshotGradient:
            cleanedBrand.brandMark?.headshotGradient || "solid-primary",
        },
      };

      setBrand(brandWithDefaults);
      return brandWithDefaults;
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
      const headshotUrlCopy = brandData.brandMark?.headshotUrl;

      const newBrand = {
        ...brandData,
      };

      // API payload using camelCase
      const apiPayload = {
        ...(newBrand.id ? { id: newBrand.id } : {}), // Include ID if present
        name: newBrand.name,
        config: newBrand.config,
        socialLinks: newBrand.socialLinks,
        brandImages: newBrand.brandImages,
        infoQuestions: newBrand.infoQuestions,
        brandMark: newBrand.brandMark,
      };

      const response = await api.post("/brands/upsert-brand", apiPayload);
      const data = response.data;

      // Omit server-only fields and set headshot URL
      const cleanedData = omit(data, [
        "userId",
        "updatedAt",
        "createdAt",
      ]) as Brand;

      // Ensure brandMark has all required properties with defaults
      const transformedBrand = {
        ...cleanedData,
        brandMark: {
          name: cleanedData.brandMark?.name || "",
          socialHandle: cleanedData.brandMark?.socialHandle || "",
          website: cleanedData.brandMark?.website || "",
          logoUrl: cleanedData.brandMark?.logoUrl || "",
          companyName: cleanedData.brandMark?.companyName || "",
          headshotUrl:
            headshotUrlCopy || cleanedData.brandMark?.headshotUrl || "",
          headshotGradient:
            cleanedData.brandMark?.headshotGradient || "solid-primary",
        },
      };

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
