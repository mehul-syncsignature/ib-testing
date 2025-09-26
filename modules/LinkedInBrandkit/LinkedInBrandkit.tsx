// modules/LinkedInBrandkit/LinkedInBrandkit.tsx

"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileOnlyWarning from "@/components/MobileOnlyWarning";
import PublicBrandControls from "./components/PublicBrandControls";
import PublicAssetBento from "./components/PublicAssetBento";
import PublicSideBar from "./components/PublicSidebar";
import AuthDialog, { AuthDialogHandle } from "@/components/Auth/AuthDialog";
import { useAppContext } from "@/contexts/AppContext";

// Component for public LinkedIn page (no auth required)
const LinkedInPageContent = () => {
  const authDialogRef = useRef<AuthDialogHandle>(null);
  const router = useRouter();
  const {
    state: { isSignedIn },
  } = useAppContext();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isSignedIn) {
      router.push("/app/design-templates/social-banner");
    }
  }, [isSignedIn, router]);

  return (
    <>
      <AuthDialog ref={authDialogRef} />
      <MobileOnlyWarning />
      <div className="flex h-screen gap-1 p-1">
        <div className="overflow-auto w-[20%]">
          <PublicSideBar
            authDialogRef={authDialogRef}
            mainContent={<PublicBrandControls />}
            showFooter
          />
        </div>
        <div className="w-[80%] overflow-auto scrollbar-thin-custom">
          <PublicAssetBento authDialogRef={authDialogRef} />
        </div>
      </div>
    </>
  );
};

// Loading fallback component for LinkedIn page
const LinkedInPageLoading = () => (
  <div className="flex h-screen gap-1 p-1">
    <div className="overflow-auto w-[20%]">
      <PublicSideBar mainContent={<PublicBrandControls />} showFooter />
    </div>
    <div className="w-[80%] overflow-auto scrollbar-thin-custom">
      <PublicAssetBento />
    </div>
  </div>
);

// Main public LinkedIn Brandkit component
const LinkedInBrandkit = () => {
  return (
    <Suspense fallback={<LinkedInPageLoading />}>
      <LinkedInPageContent />
    </Suspense>
  );
};

export default LinkedInBrandkit;
