"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useAppContext } from "@/contexts/AppContext";
import { useBrandContext } from "@/contexts/BrandContext";
import { useAssetContext } from "@/contexts/AssetContext";

export default function LogoutPage() {
  const {
    setCurrentUser,
    setIsSignedIn,
    setIsPremiumUser,
    setIsLoading,
    setError,
  } = useAppContext();
  const { setBrand, setBrands } = useBrandContext();
  const { setDataConfig } = useAssetContext();

  useEffect(() => {
    const performLogout = async () => {
      // Clear all app state immediately
      setCurrentUser(null);
      setIsSignedIn(false);
      setIsPremiumUser(false);
      setIsLoading(false);
      setError(null);
      setBrand(null as never);
      setBrands([]);
      setDataConfig(null as never);

      // Clear browser storage
      if (typeof window !== "undefined") {
        // Clear all localStorage
        localStorage.clear();

        // Clear all sessionStorage
        sessionStorage.clear();

        // Clear any application-specific cookies
        const appCookies = [
          "next-auth.session-token",
          "next-auth.csrf-token",
          "__Secure-next-auth.session-token",
          "__Host-next-auth.csrf-token",
        ];

        appCookies.forEach((cookieName) => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
        });
      }

      // Sign out from NextAuth and redirect
      await signOut({
        callbackUrl: "/auth",
        redirect: true,
      });
    };

    performLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you out...</p>
      </div>
    </div>
  );
}
