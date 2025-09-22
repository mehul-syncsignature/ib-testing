"use client";

import FullScreenLoader from "@/components/FullScreenLoader";
import { useAppContext } from "@/contexts/AppContext";
import { useFetchBrands } from "@/hooks/brand";
import { useEffect } from "react";

const DataInitializationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    state: { isLoading, currentUser },
  } = useAppContext();
  const [fetchBrands, { loading }] = useFetchBrands();

  // Fetch brands when component mounts and user is authenticated
  useEffect(() => {
    if (currentUser?.id && currentUser?.onboardingStatus === "COMPLETE") {
      fetchBrands();
    }
  }, [currentUser?.id, currentUser?.onboardingStatus]);

  // If loading, show loader
  if (isLoading || loading) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};

export default DataInitializationProvider;
