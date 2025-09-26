import React from "react";
import ControlPanel from "@/modules/ControlPanel";
import StylePanel from "@/modules/StylePanel/StylePanel";

const Editor = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen gap-1 p-1 ">
      <div className="overflow-auto w-[20%]">
        <ControlPanel />
      </div>
      <div className="flex items-center justify-center w-[60%]">{children}</div>
      <div className="overflow-auto w-[20%]">
        <StylePanel />
      </div>
    </div>
  );
};

export default Editor;
