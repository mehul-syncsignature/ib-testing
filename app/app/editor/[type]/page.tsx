"use client";

import React from "react";
import { useParams } from "next/navigation";
import Canvas from "@/modules/Canvas";
import { componentMap, ComponentType } from "@/common/utils/component-mapper";

const Editor = () => {
  const params = useParams();
  const type = params.type as string;

  const isValidType = (type: string): type is ComponentType => {
    return type in componentMap;
  };

  if (!isValidType(type)) {
    return <div>Editor type {type} not found.</div>;
  }

  return <Canvas type={type} />;
};

export default Editor;
