// components/FullScreenLoader.tsx

import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default FullScreenLoader;
 