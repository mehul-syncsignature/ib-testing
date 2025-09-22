import React from "react";
import { LoadingOverlayProps } from "../types";

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Uploading to storage...",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
