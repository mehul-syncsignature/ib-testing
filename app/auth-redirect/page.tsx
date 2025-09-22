"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppUser } from "@/contexts/AppContext/types";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      if (status === "loading") return; // Still loading

      if (status === "unauthenticated") {
        // Not authenticated, redirect to auth page
        router.push("/auth");
        return;
      }

      if (status === "authenticated" && session?.user) {
        try {
          // Fetch user data to check onboarding status
          const response = await fetch("/api/user");
          const userData: AppUser = await response.json();

          if (response.ok && userData) {
            // Check onboarding status and redirect accordingly
            if (userData.onboardingStatus === "PENDING") {
              router.push("/onboarding");
            } else {
              router.push("/dashboard");
            }
          } else {
            // User doesn't exist in our database, redirect to onboarding
            router.push("/onboarding");
          }
        } catch {
          // Fallback to onboarding
          router.push("/onboarding");
        }
      }
    };

    handleRedirect();
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
}
