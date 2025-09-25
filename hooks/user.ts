import { useState } from "react";
import useApi from "@/lib/api";
import { useAppContext } from "@/contexts/AppContext";
import { useBrandContext } from "@/contexts/BrandContext";
// Remove Supabase User type - we'll use our own AppUser type
import { AppUser } from "@/contexts/AppContext/types";
import { Brand } from "@/contexts/BrandContext/types";
import { omit, set } from "lodash";

export const useGetCurrentUser = () => {
  const api = useApi();
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setHookError] = useState<Error | null>(null);
  const { setUserLoading, setCurrentUser, setError } = useAppContext();

  const fetchCurrentUser = async () => {
    setLoading(true);
    setHookError(null);
    setUserLoading(true);

    try {
      const data = await api.get("/user");
      setUserData(data);
      setCurrentUser(data);
      return data;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch user data");
      setUserData(null);
      setCurrentUser(null);
      setHookError(errorObj);
      setError(errorObj.message);
      return null;
    } finally {
      setLoading(false);
      setUserLoading(false);
    }
  };

  return [fetchCurrentUser, { data: userData, loading, error: error }] as const;
};

export const useUserAccessChecks = () => {
  const {
    state: { currentUser },
  } = useAppContext();

  const hasAccessToTemplate = (
    templateId: number,
    assetType: string
  ): boolean => {
    // If user is not authenticated, use free templates
    if (!currentUser) {
      return false;
    }

    const allowedTemplates = currentUser?.plan?.allowedTemplates;

    if (!allowedTemplates) {
      // Fallback to free templates if no plan limits found
      return false;
    }

    // Check if the template is in user's allowed templates for this asset type
    return (
      allowedTemplates[assetType as keyof typeof allowedTemplates]?.includes(
        templateId
      ) || false
    );
  };
  return {
    hasAccessToTemplate,
  };
};

export const useUpdateUser = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setCurrentUser } = useAppContext();

  const updateUser = async (updateData: Partial<AppUser>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put("/user", updateData);

      if (response.success) {
        // Update the current user in context
        setCurrentUser(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update user");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to update user");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [updateUser, { loading, error }] as const;
};

export const useUserDependencies = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setBrand, setBrands } = useBrandContext();

  const handleUserDependencies = async (brand: Brand) => {
    setLoading(true);
    setError(null);

    try {
      const { headshotUrl: headshotUrlCopy } = brand.brandMark;

      const newBrand = {
        ...brand,
        brandMark: {
          ...brand.brandMark,
          headshotUrl: "",
        },
      };

      const response = await api.post("/user-dependencies", {
        brand: newBrand,
      });

      if (response.success && response.data.brand) {
        const brand = set(
          omit(response.data.brand, ["updatedAt", "createdAt", "userId"]),
          "brandMark.headshotUrl",
          headshotUrlCopy
        ) as Brand;
        setBrand(brand);
        setBrands([brand]);
        return brand;
      } else {
        throw new Error(response.error || "Failed to setup user dependencies");
      }
    } catch (err) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error("Failed to setup user dependencies");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return [handleUserDependencies, { loading, error }] as const;
};
