// hooks/designs.ts
import { useState } from "react";
import useApi from "@/lib/api";
import {
  AssetTypeKeys,
  Data,
  CarouselSlide,
  CarouselSlideForStorage,
  Design,
} from "@/contexts/AssetContext/types";
import { useAssetContext } from "@/contexts/AssetContext";

// Type for storing carousel slides without redundant fields

export interface CreateDesignRequest {
  id?: string;
  brandId: string;
  assetType: AssetTypeKeys;
  styleId: number;
  templateId: number;
  data: Data | CarouselSlideForStorage[];
}

export interface UpdateDesignRequest {
  brandId?: string;
  assetType?: AssetTypeKeys;
  styleId?: number;
  templateId?: number;
  data?: Data;
}

export const useGetAllDesigns = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAllDesigns = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/designs");
      const designsData = response.data || [];
      return designsData;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch designs");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [getAllDesigns, { loading, error }] as const;
};

export const useUpsertDesign = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    state: { designs },
    setDesigns,
  } = useAssetContext();

  const upsertDesign = async (designData: CreateDesignRequest) => {
    setLoading(true);
    setError(null);

    try {
      const apiPayload = {
        ...(designData.id ? { id: designData.id } : {}),
        brandId: designData.brandId,
        assetType: designData.assetType,
        styleId: designData.styleId,
        templateId: designData.templateId,
        data: designData.data,
      };

      const response = await api.post("/designs/upsert-design", apiPayload);
      const data = response.data;

      // Update designs in context
      if (designData.id) {
        // Update existing design - move to first index
        const existingDesign = designs.find(
          (design) => design.id === designData.id
        );
        const otherDesigns = designs.filter(
          (design) => design.id !== designData.id
        );
        const updatedDesign = { ...existingDesign, ...data };
        const updatedDesigns = [updatedDesign, ...otherDesigns];
        setDesigns(updatedDesigns);
      } else {
        // Add new design at first index
        const updatedDesigns = [data, ...designs];
        setDesigns(updatedDesigns);
      }

      return data;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to save design");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [upsertDesign, { loading, error }] as const;
};

export const useDeleteDesign = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    state: { designs },
    setDesigns,
  } = useAssetContext();

  const deleteDesign = async (designId: string) => {
    if (!designId) {
      throw new Error("Design ID is required");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/designs/delete-design", { designId });

      // Update designs in context - remove the deleted design
      const updatedDesigns = designs.filter((design) => design.id !== designId);
      setDesigns(updatedDesigns);

      return response;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to delete design");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [deleteDesign, { loading, error }] as const;
};

export const useGetDesignsByBrand = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getDesignsByBrand = async (brandId: string) => {
    if (!brandId) return [];

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/designs");
      const allDesigns = response.data || [];

      const brandDesigns = allDesigns.filter(
        (design: Design) => design.brandId === brandId
      );
      return brandDesigns;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch brand designs");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [getDesignsByBrand, { loading, error }] as const;
};

// Helper functions for working with design data
export const isCarouselDesign = (
  design: Design
): design is Design & { data: CarouselSlideForStorage[] } => {
  return Array.isArray(design.data);
};

export const isSingleDesign = (
  design: Design
): design is Design & { data: Data } => {
  return !Array.isArray(design.data);
};

export const getDesignData = (
  design: Design
): Data | CarouselSlideForStorage[] => {
  return design.data;
};

export const normalizeDesignForSave = (
  assetType: AssetTypeKeys,
  dataConfig: Data,
  slides: CarouselSlide[]
): Data | CarouselSlideForStorage[] => {
  if (assetType === "social-carousel") {
    return slides.map((slide) => ({
      data: slide.data,
    }));
  }
  return dataConfig;
};

export const reconstructCarouselSlides = (
  storedSlides: CarouselSlideForStorage[],
  templateId: string
): CarouselSlide[] => {
  return storedSlides.map((slide, index) => ({
    id: `slide-${index}`,
    templateId: templateId,
    data: slide.data,
  }));
};
