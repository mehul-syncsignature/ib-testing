/* eslint-disable @next/next/no-img-element */
import React from "react";
import { X } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string | null | undefined;
  onRemove: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onRemove }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="w-full h-[7rem] p-[1rem] rounded-[0.5rem] bg-white border border-[#D9DBDB]">
      <div className="relative w-fit border rounded-[0.5rem] bg-white border-[#D9DBDB] ">
        <img
          src={imageUrl}
          alt="Uploaded preview"
          className="object-cover w-[5rem] h-[5rem]"
        />

        <button
          type="button"
          onClick={onRemove}
          className="absolute top-[-8px] right-[-8px] flex h-6 w-6 items-center justify-center rounded-full border bg-[#F0F0F0] text-black transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" stroke="black" />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
