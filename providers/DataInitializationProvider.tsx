"use client";

import FullScreenLoader from "@/components/FullScreenLoader";
import { useAppContext } from "@/contexts/AppContext";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { useGetDesignsByBrand } from "@/hooks/designs";
import { useEffect } from "react";
import { useGetPostsByBrand } from "@/hooks/post";

const DataInitializationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    state: { isLoading },
  } = useAppContext();
  const {
    state: { brand },
  } = useBrandContext();
  const { setDesigns, setPosts } = useAssetContext();
  const [getDesignsByBrand] = useGetDesignsByBrand();
  const [getPostByBrand] = useGetPostsByBrand();

  useEffect(() => {
    if (brand) {
      const fetchDesigns = async () => {
        try {
          const designs = await getDesignsByBrand(brand.id!);
          setDesigns(designs);
        } catch {
          setDesigns([]);
        }
      };
      const fetchPosts = async () => {
        try {
          if (!brand.id) {
            return;
          }
          const posts = await getPostByBrand(brand.id);
          setPosts(posts);
        } catch {
          setDesigns([]);
        }
      };
      fetchDesigns();
      fetchPosts();
    }
  }, [brand?.id]);

  // If loading, show loader
  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};

export default DataInitializationProvider;
