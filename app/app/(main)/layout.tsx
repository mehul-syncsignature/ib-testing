import SideBar from "@/components/SideBar";
import DashboardControl from "@/components/DashboardControl";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen gap-1 p-1">
      <div className="overflow-auto w-[20%]">
        <SideBar mainContent={<DashboardControl />} showFooter />
      </div>
      <div className="w-[80%]">{children}</div>
    </div>
  );
};

export default AppLayout;
