"use client";

// src/components/DraggerWithCrop/ImageUploader.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Dropzone from "./components/Dropzone";
import CropDialog from "./components/CropDialog";
import PositionDragger from "./components/PositionDragger";
import Image from "next/image";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import {
  useS3Upload,
  blobUrlToFile,
  detectMimeTypeFromBlob,
} from "@/hooks/useS3Upload";
import { useR2Upload } from "@/hooks/useR2Upload";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import ImageViewer from "./ImageViewer";

// Define types
interface Position {
  x: number;
  y: number;
}

type ProcessingStep = "idle" | "cropping" | "removing-bg" | "preview";

interface ImageUploaderProps {
  bucketName: string;
  folderPath?: string;
  onUploadComplete: (url: string, position?: Position, scale?: number) => void;
  aspectRatio?: number;
  maxFileSize?: number;
  acceptedFileTypes?: { [key: string]: string[] };
  initialImage?: string;
  initialPosition?: Position;
  initialScale?: number;
  removeBackground?: boolean;
  highQuality?: boolean;
  isAdjustablePosition?: boolean;
  simpleUploader?: boolean;
  setRemoveBackground?: (flag: boolean) => void;
  uploadToS3?: boolean;
  uploadToR2?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  maxFileSize = 10 * 1024 * 1024,
  initialImage = "",
  initialPosition = { x: 0, y: 0 },
  initialScale = 1,
  removeBackground,
  highQuality = true,
  isAdjustablePosition = true,
  simpleUploader = false,
  setRemoveBackground,
  aspectRatio,
  uploadToS3 = false,
  uploadToR2 = true,
}) => {
  // State management
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("idle");
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(
    initialImage || null
  );
  const [error, setError] = useState<string | null>(null);
  const [cropperDialogOpen, setCropperDialogOpen] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [scale, setScale] = useState<number>(initialScale);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bgRemovalProgress, setBgRemovalProgress] = useState<number>(0);
  const [s3UploadProgress, setS3UploadProgress] = useState<number>(0);
  const [r2UploadProgress, setR2UploadProgress] = useState<number>(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Background removal hook
  const { remove: removeImageBackground } = useBackgroundRemoval({
    highQuality,
    onSuccess: handleBgRemovalComplete,
    onError: handleBgRemovalError,
    onProgress: setBgRemovalProgress,
  });

  // S3 upload hook
  const { uploadToS3: uploadFileToS3, loading: s3Uploading } = useS3Upload({
    onProgress: setS3UploadProgress,
    onError: (_errorMsg) => {
      toast.error("S3 upload failed. Please try again.");
    },
  });

  // R2 upload hook
  const { uploadToR2: uploadFileToR2, loading: r2Uploading } = useR2Upload({
    onProgress: setR2UploadProgress,
    onError: (_errorMsg) => {
      toast.error("R2 upload failed. Please try again.");
    },
  });

  // Initialize with initial values
  useEffect(() => {
    if (initialImage) {
      setFinalImage(initialImage);
      setPosition(initialPosition);
      setScale(initialScale);
    } else {
      setProcessingStep("idle");
    }
  }, [initialImage]);

  // Utility functions
  const revokeLocalUrl = (url: string | null) => {
    if (url && url.startsWith("blob:") && url !== initialImage) {
      URL.revokeObjectURL(url);
    }
  };

  // Event handlers
  const handleImageSelected = (file: File, imageUrl: string) => {
    setError(null);
    setOriginalFile(file);
    setImageSource(imageUrl);
    setCropperDialogOpen(true);
    setProcessingStep("cropping");
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    revokeLocalUrl(imageSource);
    setImageSource(null);
    setCroppedImage(croppedImageUrl);
    setCropperDialogOpen(false);

    const newInitialPosition = { x: 0, y: 0 };
    const newInitialScale = 1;
    setPosition(newInitialPosition);
    setScale(newInitialScale);

    if (removeBackground) {
      setProcessingStep("removing-bg");
      setBgRemovalProgress(0);
      // Store the cropped image first before attempting background removal
      setFinalImage(croppedImageUrl); // Set this as fallback

      // Start background removal process using the hook
      removeImageBackground(croppedImageUrl).catch((err) => {
        handleBgRemovalError(err instanceof Error ? err.message : String(err));
      });
    } else {
      revokeLocalUrl(finalImage);
      setFinalImage(croppedImageUrl);
      setProcessingStep("preview");

      // Upload to cloud storage if enabled, otherwise use local blob URL
      if (uploadToS3) {
        await handleS3Upload(
          croppedImageUrl,
          newInitialPosition,
          newInitialScale
        );
      } else if (uploadToR2) {
        await handleR2Upload(
          croppedImageUrl,
          newInitialPosition,
          newInitialScale
        );
      } else {
        onUploadComplete(croppedImageUrl, newInitialPosition, newInitialScale);
      }
    }
  };

  const handleCropCancel = () => {
    revokeLocalUrl(imageSource);
    setImageSource(null);
    setCropperDialogOpen(false);

    if (finalImage && processingStep !== "idle") {
      setProcessingStep("preview");
    } else {
      setProcessingStep("idle");
    }
  };

  async function handleBgRemovalComplete(processedImageUrl: string) {
    revokeLocalUrl(croppedImage);
    setCroppedImage(null);
    revokeLocalUrl(finalImage);
    setFinalImage(processedImageUrl);
    setProcessingStep("preview");

    // Upload to cloud storage if enabled, otherwise use local blob URL
    if (uploadToS3) {
      await handleS3Upload(processedImageUrl, position, scale);
    } else if (uploadToR2) {
      await handleR2Upload(processedImageUrl, position, scale);
    } else {
      onUploadComplete(processedImageUrl, position, scale);
    }
  }

  async function handleBgRemovalError(errorMsg: string) {
    if (croppedImage) {
      revokeLocalUrl(finalImage);
      setFinalImage(croppedImage);
      setCroppedImage(null);
      setProcessingStep("preview");

      // Upload to cloud storage if enabled, otherwise use local blob URL
      if (uploadToS3) {
        await handleS3Upload(croppedImage, position, scale);
      } else if (uploadToR2) {
        await handleR2Upload(croppedImage, position, scale);
      } else {
        onUploadComplete(croppedImage, position, scale);
      }
    } else {
      setProcessingStep("idle");
      toast.error("Background removal failed, Try again.");
      // setError("Background removal failed and no fallback image available.");
    }
  }

  // S3 upload handler
  const handleS3Upload = async (
    blobUrl: string,
    pos: Position,
    scaleValue: number
  ) => {
    if (!originalFile) {
      // Fallback to blob URL if no original file
      onUploadComplete(blobUrl, pos, scaleValue);
      return;
    }

    try {
      setProcessingStep("removing-bg"); // Reuse this step for S3 upload progress
      setS3UploadProgress(0);

      // Convert blob URL to file if needed, or use original file
      let fileToUpload: File;

      if (blobUrl.startsWith("blob:")) {
        // Convert processed blob to file
        const mimeType = await detectMimeTypeFromBlob(blobUrl);
        const filename = `processed-${Date.now()}.${
          mimeType.split("/")[1] || "png"
        }`;
        fileToUpload = await blobUrlToFile(blobUrl, filename, mimeType);
      } else {
        // Use original file
        fileToUpload = originalFile;
      }

      // Upload to S3
      const s3Url = await uploadFileToS3(fileToUpload);

      setProcessingStep("preview");
      onUploadComplete(s3Url, pos, scaleValue);

      toast.success("Image uploaded to S3 successfully!");
    } catch (_error) {
      setProcessingStep("preview");
      // Fallback to blob URL on upload failure
      onUploadComplete(blobUrl, pos, scaleValue);
      toast.error("S3 upload failed. Using local image instead.");
    }
  };

  // R2 upload handler
  const handleR2Upload = async (
    blobUrl: string,
    pos: Position,
    scaleValue: number
  ) => {
    if (!originalFile) {
      // Fallback to blob URL if no original file
      onUploadComplete(blobUrl, pos, scaleValue);
      return;
    }

    try {
      setProcessingStep("removing-bg"); // Reuse this step for R2 upload progress
      setR2UploadProgress(0);

      // Convert blob URL to file if needed, or use original file
      let fileToUpload: File;

      if (blobUrl.startsWith("blob:")) {
        // Convert processed blob to file
        const mimeType = await detectMimeTypeFromBlob(blobUrl);
        const filename = `processed-${Date.now()}.${
          mimeType.split("/")[1] || "png"
        }`;
        fileToUpload = await blobUrlToFile(blobUrl, filename, mimeType);
      } else {
        // Use original file
        fileToUpload = originalFile;
      }

      // Upload to R2
      const r2Url = await uploadFileToR2(fileToUpload);

      setProcessingStep("preview");
      onUploadComplete(r2Url, pos, scaleValue);

      toast.success("Image uploaded to R2 successfully!");
    } catch (_error) {
      setProcessingStep("preview");
      // Fallback to blob URL on upload failure
      onUploadComplete(blobUrl, pos, scaleValue);
      toast.error("R2 upload failed. Using local image instead.");
    }
  };

  const handlePositionChange = (newPosition: Position) => {
    setPosition(newPosition);
    if (finalImage) {
      onUploadComplete(finalImage, newPosition, scale);
    }
  };

  const handleScaleChange = (value: number[]) => {
    const newScale = value[0];
    setScale(newScale);
    if (finalImage) {
      onUploadComplete(finalImage, position, newScale);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-[7rem] w-full">
          {!finalImage ? (
            <Dropzone
              maxFileSize={maxFileSize}
              onImageSelected={handleImageSelected}
              error={error}
              setError={setError}
              finalImage={finalImage}
              processingStep={processingStep}
              croppedImage={croppedImage}
              bgRemovalProgress={
                uploadToS3 && s3Uploading
                  ? s3UploadProgress
                  : uploadToR2 && r2Uploading
                  ? r2UploadProgress
                  : bgRemovalProgress
              }
              // onClick={handleChangeImage}
            />
          ) : (
            <ImageViewer
              imageUrl={finalImage}
              onRemove={() => {
                setFinalImage(null);
              }}
            />
          )}
        </div>
      </div>
      {/* Position Adjustment Button */}
      {/* {isAdjustablePosition && finalImage && !simpleUploader && (
        <div className="w-full">
          <Button
            className="w-full mb-2"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            Adjust Position
          </Button>
        </div>
      )} */}

      {/* Position Dragger */}
      {/* {isOpen && !simpleUploader && (
        <>
          <div className="w-full flex justify-center">
            <PositionDragger
              position={position}
              scale={scale}
              onPositionChange={handlePositionChange}
              height={190}
            />
          </div>
          <div className="space-y-2 w-full max-w-xs mx-auto">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Scale</span>
              <span>{(scale * 100).toFixed(0)}%</span>
            </div>
            <Slider
              defaultValue={[initialScale]}
              min={0.25}
              max={3}
              step={0.01}
              value={[scale]}
              onValueChange={handleScaleChange}
              className="w-full"
            />
          </div>
        </>
      )} */}

      <CropDialog
        imageUrl={imageSource}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        isOpen={cropperDialogOpen}
        setIsOpen={setCropperDialogOpen}
        error={error}
        setError={setError}
        removeBackground={removeBackground!}
        setRemoveBackground={setRemoveBackground!}
        simpleUploader={simpleUploader}
        aspectRatio={aspectRatio}
      />

      {/* Checkered background CSS */}
      <style jsx global>{`
        .bg-light-checkered {
          background-color: #f9f9f9;
          background-image: linear-gradient(45deg, #ececec 25%, transparent 25%),
            linear-gradient(-45deg, #ececec 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ececec 75%),
            linear-gradient(-45deg, transparent 75%, #ececec 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
