import { Crop, PixelCrop } from "react-image-crop";

/**
 * Main props for the DraggerWithCrop component
 */
export interface DraggerWithCropProps {
  bucketName: string;
  folderPath?: string;
  onUploadComplete?: (url: string) => void;
  aspectRatio?: number;
  maxFileSize?: number;
  acceptedFileTypes?: { [key: string]: string[] };
  removeBackground?: boolean;
  simpleUploader?: boolean;
}

/**
 * Processing steps for the image workflow
 */
export type ProcessingStep =
  | "initial"
  | "cropping"
  | "removing-bg"
  | "complete";

/**
 * Props for the Dropzone component
 */ export interface DropzoneProps {
  acceptedFileTypes?: { [key: string]: string[] };
  maxFileSize: number;
  onImageSelected: (file: File, objectUrl: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  processingStep?: string;
  finalImage?: string | null;
  croppedImage?: string | null;
  bgRemovalProgress?: number;
}

/**
 * Props for the CropDialog component
 */
export interface CropDialogProps {
  imageUrl: string | null;
  aspectRatio?: number;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  removeBackground: boolean;
  setRemoveBackground: (remove: boolean) => void;
  simpleUploader?: boolean;
}

/**
 * Props for the Background Remover component
 */
export interface BackgroundRemoverProps {
  imageUrl: string;
  onProcessed: (dataUrl: string) => void;
  onError: (error: string) => void;
  apiKey?: string;
}

/**
 * Props for the ProcessedImageView component
 */
export interface ProcessedImageViewProps {
  removedBgImage: string | null;
  uploadUrl: string | null;
  onUpload: () => void;
  onRestart: () => void;
  onClear: () => void;
  isUploading: boolean;
  error: string | null;
  removeBackground: boolean;
}

/**
 * Props for the LoadingOverlay component
 */
export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

/**
 * Internal state for DraggerWithCrop component
 */
export interface DraggerWithCropState {
  imageSource: string | null;
  originalFile: File | null;
  crop: Crop | undefined;
  completedCrop: PixelCrop | null;
  croppedImage: string | null;
  removedBgImage: string | null;
  isProcessing: boolean;
  isUploading: boolean;
  error: string | null;
  processingStep: ProcessingStep;
  uploadUrl: string | null;
  cropperDialogOpen: boolean;
  removeBackground: boolean;
}

export interface ErrorResponse {
  error?: string;
  message?: string;
}
