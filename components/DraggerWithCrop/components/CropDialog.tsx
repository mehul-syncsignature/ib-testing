// components/DraggerWithCrop/components/CropDialog.tsx

import React, { useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CropDialogProps } from "../types";
import { createCenteredCrop, cropImageToDataUrl } from "../utils/crop";

const CropDialog: React.FC<CropDialogProps> = ({
  imageUrl,
  aspectRatio,
  onCropComplete,
  onCancel,
  isOpen,
  setIsOpen,
  error,
  setError,
  removeBackground = false,
  setRemoveBackground,
  simpleUploader,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Function to center and initialize the crop when an image is loaded
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = createCenteredCrop(width, height, aspectRatio!);
    setCrop(initialCrop);
  };

  // Function to generate the cropped image with high quality
  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) {
      setError("Please select a crop area first");
      return;
    }

    setIsProcessing(true);

    try {
      // The cropImageToDataUrl function now preserves image quality
      const dataUrl = await cropImageToDataUrl(imgRef.current, completedCrop);
      onCropComplete(dataUrl);
      setIsOpen(false);
    } catch (err) {
      setError(`Failed to crop the image. Please try again. ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onCancel();
      setIsOpen(false);
    }
  };

  const handleToggleBackgroundRemoval = (checked: boolean) => {
    setRemoveBackground(checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Crop Your Image
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Adjust the crop area to select the portion of the image you want to
            keep.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center p-1">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  {...(typeof aspectRatio === "number" && !isNaN(aspectRatio)
                    ? { aspect: aspectRatio }
                    : {})}
                  className="max-h-[50vh] max-w-full object-contain"
                >
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Upload preview"
                    onLoad={onImageLoad}
                    className="max-w-full"
                    style={{ maxHeight: "50vh" }}
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {!simpleUploader && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="background-removal"
                    checked={removeBackground && !simpleUploader}
                    onCheckedChange={handleToggleBackgroundRemoval}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="background-removal"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Remove Background
                  </Label>
                </div>
                <div className="text-xs text-gray-500">
                  {removeBackground
                    ? "Background will be removed after cropping"
                    : "Keep the original background"}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropComplete}
              disabled={!completedCrop || isProcessing}
              className={`${isProcessing ? "opacity-80" : ""}`}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Crop Image"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropDialog;
