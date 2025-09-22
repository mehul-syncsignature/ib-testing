// modules/Main/Main.tsx

"use client";

import AssetBentoContainer from "@/components/AssetBento/AssetBentoContainer";
import React, { Suspense } from "react";
import SideBar from "@/components/SideBar";
import MobileOnlyWarning from "@/components/MobileOnlyWarning";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAppContext } from "@/contexts/AppContext";
import BrandControls from "../Brand/components/BrandControls";

// Component that uses client-side hooks
const PageContent = () => {
  const {
    state: { isLoading },
  } = useAppContext();

  if (isLoading) return <FullScreenLoader />;

  return (
    <>
      <MobileOnlyWarning />
      {/* <AITextGeneratorDialog ref={aiTextGeneratorDialogRef} /> */}
      <div className="flex h-screen gap-1 p-1">
        <div className="overflow-auto w-[20%]">
          <SideBar mainContent={<BrandControls />} showFooter />
        </div>
        <div className="w-[80%] overflow-auto scrollbar-thin-custom">
          <AssetBentoContainer />
        </div>
      </div>
      {/* <ForgotPassword /> */}
    </>
  );
};

// Loading fallback component
const PageLoading = () => (
  <div className="flex h-screen gap-1 p-1">
    <div className="overflow-auto w-[20%]">
      <SideBar mainContent={<BrandControls />} showFooter />
    </div>
    <div className="w-[80%] overflow-auto scrollbar-thin-custom">
      <AssetBentoContainer />
    </div>
  </div>
);

// Main client component with Suspense boundary
const Main = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <PageContent />
    </Suspense>
  );
};

export default Main;
