import React from "react";
import { useDropzone, FileRejection, FileError } from "react-dropzone";
import { DropzoneProps } from "../types";
import { Upload } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { toast } from "sonner";

const Dropzone: React.FC<DropzoneProps> = ({
  maxFileSize,
  onImageSelected,
  error,
  setError,
  // New props for progress bar
  processingStep,
  croppedImage,
  bgRemovalProgress,
  finalImage,
}) => {
  // Define accepted file types
  const acceptedFileTypes = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  };

  // Get accepted file extensions for error message
  const getAcceptedExtensions = () => {
    const extensions: string[] = [];
    Object.values(acceptedFileTypes).forEach((exts) => {
      extensions.push(...exts);
    });
    return extensions.join(", ");
  };

  // Handle file drop with react-dropzone
  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];

      if (
        rejection.errors.some(
          (error: FileError) => error.code === "file-invalid-type"
        )
      ) {
        toast.error("Invalid file type", {
          description: `Please upload files with these extensions: ${getAcceptedExtensions()}`,
        });
        return;
      }

      if (
        rejection.errors.some(
          (error: FileError) => error.code === "file-too-large"
        )
      ) {
        toast.error("File too large", {
          description: `Maximum file size is ${maxFileSize / (1024 * 1024)}MB`,
        });
        return;
      }

      // Generic error for other rejection reasons
      toast.error("File upload error", {
        description:
          "The selected file cannot be uploaded. Please try a different file.",
      });
      return;
    }

    // Check if any files were accepted
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0]; // Take only the first file

    // Additional file size validation (backup check)
    if (file.size > maxFileSize) {
      toast.error("File too large", {
        description: `Maximum file size is ${maxFileSize / (1024 * 1024)}MB`,
      });
      return;
    }

    // Create a high-quality preview URL for the image
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!e.target?.result) {
        toast.error("Error reading file", {
          description: "Failed to read the image file. Please try again.",
        });
        return;
      }

      // Create a high-quality object URL from the file
      const objectUrl = URL.createObjectURL(file);
      onImageSelected(file, objectUrl);
      // No success toast - only error toasts as requested
    };

    fileReader.onerror = () => {
      toast.error("Error reading file", {
        description: "Failed to read the image file. Please try again.",
      });
    };

    // Read the file as a data URL
    fileReader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxSize: maxFileSize,
      multiple: false,
      noClick: false,
      noKeyboard: false,
    });

  return (
    <div
      {...getRootProps()}
      className={`relative flex items-center justify-center gap-2 space-y-2 h-full w-full border rounded-lg bg-white border-[#D9DBDB] text-center cursor-pointer transition-colors ${
        isDragReject
          ? "border-red-500 bg-red-50"
          : isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 "
      }`}
    >
      <input {...getInputProps()} />

      {processingStep === "removing-bg" && croppedImage ? (
        // Progress Bar Content
        <div className="absolute inset-0 flex items-center justify-center px-2">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-1 cursor-pointer w-full"
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <div className="flex-1 min-w-0">
                <ProgressBar progress={bgRemovalProgress || 0} />
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {(bgRemovalProgress || 0) < 100
                  ? `${bgRemovalProgress || 0}%`
                  : "Finishing..."}
              </p>
            </div>
          </label>
        </div>
      ) : (
        // Upload Content
        <div
          className={`absolute inset-0 w-full h-full transition-colors flex flex-col items-center ${
            isDragReject
              ? "text-red-600"
              : isDragActive
              ? "text-blue-600"
              : "text-gray-500"
          }
          ${
            finalImage
              ? "items-start justify-center p-[1rem]"
              : "justify-center"
          }
          `}
        >
          <div className="flex-col flex items-center">
            <Upload
              className={`w-4 h-4 ${
                isDragReject
                  ? "text-red-600"
                  : isDragActive
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`font-normal text-sm ${
                isDragReject
                  ? "text-red-600"
                  : isDragActive
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              {isDragReject
                ? "Invalid"
                : isDragActive
                ? "Drop file here"
                : "Choose a file or drag it here"}
            </span>
          </div>
          {error ? (
            <p className="text-red-500 text-xs leading-tight truncate max-w-full">
              {error}
            </p>
          ) : isDragReject ? (
            <p className="text-red-500 text-xs leading-tight">JPG, PNG only</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
