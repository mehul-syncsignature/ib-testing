// modules/Brand/Brand.tsx

"use client";

import React, { useState } from "react";
import SideBar from "@/components/SideBar";
import BrandSection from "./components/BrandSection";
import AIToolsSection from "./components/AITools";
import MyAssetsSection from "./components/MyAssets";
import DashboardControl from "./components/DashboardControl/index";

type SectionType = "brand" | "ai-tools" | "my-assets";

const Brand = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("brand");

  const renderMainContent = () => {
    switch (activeSection) {
      case "ai-tools":
        return <AIToolsSection />;
      case "my-assets":
        return <MyAssetsSection />;
      case "brand":
      default:
        return <BrandSection />;
    }
  };

  return (
    <div className="flex h-screen gap-1 p-1">
      <div className="overflow-auto w-[20%]">
        <SideBar
          mainContent={
            <DashboardControl
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          }
          showFooter
        />
      </div>
      <div className="w-[80%]">{renderMainContent()}</div>
    </div>
  );
};

export default Brand;
