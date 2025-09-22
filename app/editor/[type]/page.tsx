"use client";

import React from "react";
import { useParams } from "next/navigation";
import Canvas from "@/modules/Canvas";
import { componentMap, ComponentType } from "@/common/utils/component-mapper";
import ControlPanel from "@/modules/ControlPanel";
import StylePanel from "@/modules/StylePanel/StylePanel";

const Editor = () => {
  const params = useParams();
  const type = params.type as string;

  const isValidType = (type: string): type is ComponentType => {
    return type in componentMap;
  };

  if (!isValidType(type)) {
    return <div>Editor type {type} not found.</div>;
  }

  return (
    <div className="flex h-screen gap-1 p-1 ">
      <div className="overflow-auto w-[20%]">
        <ControlPanel />
      </div>
      <div className="flex items-center justify-center w-[60%]">
        <Canvas type={type} />
      </div>
      <div className="overflow-auto w-[20%]">
        <StylePanel />
      </div>
    </div>
  );
};

export default Editor;
