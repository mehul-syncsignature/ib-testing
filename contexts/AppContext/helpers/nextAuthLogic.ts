// contexts/AppContext/helpers/nextAuthLogic.ts

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { SectionConfig } from "@/common/constants/unified-bento-config";
import { AppUser } from "../types";
import { useRouter } from "next/navigation";

interface NextAuthLogicProps {
  setCurrentUser: (user: AppUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsPremiumUser: (isPremium: boolean) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setSectionsData: (sections: SectionConfig[]) => void;
}

const isPremiumPlan = (user: AppUser | null): boolean => {
  if (!user?.plan?.id) return false;
  // Plan ID "1" is free plan, anything else (2, 3, etc.) is premium
  return user.plan.id !== "1";
};

export const useNextAuthLogic = ({
  setCurrentUser,
  setIsLoading,
  setIsPremiumUser,
  setIsSignedIn,
}: NextAuthLogicProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Handle loading state
    setIsLoading(status === "loading");

    if (status === "loading") {
      return; // Still loading
    }

    if (status === "authenticated" && session?.user) {
      // User is authenticated, fetch user data from our API
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/user");
          const data = await response.json();

          if (response.ok && data) {
            const userData = data as AppUser;
            setCurrentUser(userData);
            setIsSignedIn(true);
            setIsPremiumUser(isPremiumPlan(userData));

            // Check onboarding status and redirect if needed
            const currentPath = window.location.pathname;
            if (
              userData.onboardingStatus === "PENDING" &&
              currentPath !== "/onboarding"
            ) {
              router.push("/onboarding");
              return;
            }

            if (
              userData.onboardingStatus === "COMPLETE" &&
              currentPath === "/onboarding"
            ) {
              router.push("/dashboard");
              return;
            }

            // Brands will be fetched by dashboard components when needed
          } else {
            // User doesn't exist in our database, clear everything
            setCurrentUser(null);
            setIsSignedIn(false);
            setIsPremiumUser(false);
          }
        } catch {
          // Silently handle error in production
          setCurrentUser(null);
          setIsSignedIn(false);
          setIsPremiumUser(false);
        }
      };

      fetchUserData();
    } else {
      // No session, clear everything
      setCurrentUser(null);
      setIsSignedIn(false);
      setIsPremiumUser(false);
    }
  }, [session?.user?.id, status]);

  // Provide a method to refresh authentication state
  const refreshAuth = async () => {
    if (status === "authenticated" && session?.user) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user");
        const data = await response.json();

        if (response.ok && data) {
          const userData = data as AppUser;
          setCurrentUser(userData);
          setIsSignedIn(true);
          setIsPremiumUser(isPremiumPlan(userData));

          // Check onboarding status and redirect if needed
          const currentPath = window.location.pathname;
          if (
            userData.onboardingStatus === "PENDING" &&
            currentPath !== "/onboarding"
          ) {
            router.push("/onboarding");
            return;
          }

          if (
            userData.onboardingStatus === "COMPLETE" &&
            currentPath === "/onboarding"
          ) {
            router.push("/dashboard");
            return;
          }
        } else {
          setCurrentUser(null);
          setIsSignedIn(false);
          setIsPremiumUser(false);
        }
      } catch {
        // Silently handle error in production
        setCurrentUser(null);
        setIsSignedIn(false);
        setIsPremiumUser(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { refreshAuth };
};
