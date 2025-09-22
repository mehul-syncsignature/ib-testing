// modules/Brand/Brand.tsx

"use client";

import React from "react";
import SideBar from "@/components/SideBar";
import BrandSection from "./components/BrandSection";
import DashboardControl from "./components/DashboardControl/index";

const Brand = () => {
  return (
    <div className="flex h-screen gap-1 p-1">
      <div className="overflow-auto w-[20%]">
        <SideBar mainContent={<DashboardControl />} showFooter />
      </div>
      <div className="w-[80%]">
        <BrandSection />
      </div>
    </div>
  );
};

export default Brand;
