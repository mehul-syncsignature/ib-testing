/* eslint-disable @typescript-eslint/no-explicit-any */
// modules/StylePanel/components/ExportModal/helpers/export-utils.ts

import * as htmlToImage from "html-to-image";
import { toast } from "sonner";

import {
  generateFileName,
  downloadFiles,
  cleanupElements,
  type ExportedFile,
} from "./file-utils";
import { exportOptions, headshotExportOption } from "./platform-config";
import { exportSocialCarouselToPDF } from "./social-carousel-pdf-export";
import { exportCarouselSlidesToImages } from "./carousel-images-export";

interface CreateExportElementResult {
  container: HTMLDivElement;
  exportElement: HTMLDivElement;
}

export function createExportElement(
  platformId: string,
  canvasRef: React.RefObject<HTMLDivElement | null>,
  headshotRef: React.RefObject<HTMLDivElement | null>
): CreateExportElementResult | null {
  // Special handling for headshot
  if (platformId === "headshot") {
    if (!headshotRef.current) return null;

    const originalElement = headshotRef.current;
    const exportElement = originalElement.cloneNode(true) as HTMLDivElement;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = `${headshotExportOption.width}px`;
    container.style.height = `${headshotExportOption.height}px`;
    container.style.overflow = "hidden";
    container.style.backgroundColor = "transparent";

    // Remove any download buttons from the clone
    const downloadButtons = exportElement.querySelectorAll("button");
    downloadButtons.forEach((button) => button.remove());

    exportElement.style.transform = "none";
    exportElement.style.transformOrigin = "top left";
    exportElement.style.width = "100%";
    exportElement.style.height = "100%";
    exportElement.style.position = "relative";
    exportElement.style.pointerEvents = "none";

    container.appendChild(exportElement);
    document.body.appendChild(container);

    return { container, exportElement };
  }

  // Standard handling for other platforms
  if (!canvasRef.current) return null;

  const platform = exportOptions.find((p) => p.id === platformId);
  if (!platform) return null;

  const originalElement = canvasRef.current;
  const exportElement = originalElement.cloneNode(true) as HTMLDivElement;

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = `${platform.width}px`;
  container.style.height = `${platform.height}px`;
  container.style.overflow = "hidden";
  container.style.backgroundColor = "transparent";

  exportElement.style.transform = "none";
  exportElement.style.transformOrigin = "top left";
  exportElement.style.width = "100%";
  exportElement.style.height = "100%";
  exportElement.style.position = "relative";
  exportElement.style.pointerEvents = "none";

  const textElements = exportElement.querySelectorAll(
    "div[dangerouslySetInnerHTML]"
  );
  textElements.forEach((el) => {
    (el as HTMLElement).style.position = "relative";
    (el as HTMLElement).style.zIndex = "10";
  });

  container.appendChild(exportElement);
  document.body.appendChild(container);

  return { container, exportElement };
}

async function generateImageFromElement(
  element: HTMLDivElement,
  fileType: "png" | "jpg" | "svg",
  scale: number,
  width: number,
  height: number
): Promise<string> {
  const exportOptions = {
    quality: 0.95,
    pixelRatio: fileType === "svg" ? 1 : scale,
    width,
    height,
  };

  switch (fileType) {
    case "svg":
      return await htmlToImage.toSvg(element, exportOptions);
    case "jpg":
      return await htmlToImage.toJpeg(element, exportOptions);
    case "png":
    default:
      return await htmlToImage.toPng(element, exportOptions);
  }
}

export interface ExportParams {
  selectedPlatforms: string[];
  templateName: string;
  fileType: "png" | "jpg" | "svg";
  scale: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  headshotRef: React.RefObject<HTMLDivElement | null>;
  onProgress: (progress: number) => void;
  carouselSlides?: any[];
  carouselSlideRefs?: React.RefObject<HTMLDivElement | null>[];
}

export async function handleExport(params: ExportParams): Promise<boolean> {
  const {
    selectedPlatforms,
    templateName,
    fileType,
    scale,
    canvasRef,
    headshotRef,
    onProgress,
    carouselSlideRefs = [],
  } = params;

  // Check if this includes carousel exports
  const hasSocialCarouselPDF = selectedPlatforms.includes(
    "social-carousel-pdf"
  );
  const hasSocialCarouselImages = selectedPlatforms.includes(
    "social-carousel-images"
  );

  // Validation
  if (
    !canvasRef.current &&
    !selectedPlatforms.every((p) => p === "headshot") &&
    !hasSocialCarouselPDF &&
    !hasSocialCarouselImages
  ) {
    toast.error("Export Failed", {
      description: "Cannot find the template element. Please close and retry.",
    });
    return false;
  }

  if (selectedPlatforms.includes("headshot") && !headshotRef.current) {
    toast.error("Headshot Export Failed", {
      description: "Cannot find the headshot element. Please close and retry.",
    });
    return false;
  }

  if (hasSocialCarouselImages && carouselSlideRefs.length === 0) {
    toast.error("Carousel Export Failed", {
      description:
        "Cannot find carousel slides. Please ensure slides are loaded.",
    });
    return false;
  }

  if (selectedPlatforms.length === 0) {
    toast.warning("No Platforms Selected", {
      description: "Please select at least one platform to export for.",
    });
    return false;
  }

  onProgress(10);

  const totalSteps = selectedPlatforms.length;
  const elementsToCleanup: HTMLDivElement[] = [];
  const exportedFiles: ExportedFile[] = [];

  try {
    for (let i = 0; i < selectedPlatforms.length; i++) {
      const platformId = selectedPlatforms[i];
      const progressIncrement = (100 - 20) / totalSteps;
      const currentProgress = 10 + i * progressIncrement;
      onProgress(Math.min(currentProgress, 90));

      // Handle social-carousel images export
      if (platformId === "social-carousel-images") {
        try {
          const imageFiles = await exportCarouselSlidesToImages(
            templateName,
            carouselSlideRefs,
            fileType,
            scale,
            (progress) =>
              onProgress(
                Math.min(
                  currentProgress + (progress / 100) * progressIncrement,
                  90
                )
              )
          );

          if (imageFiles.length > 0) {
            exportedFiles.push(...imageFiles);
          }
        } catch (imagesError) {
          console.error("Social carousel images export failed:", imagesError);
          toast.error("Failed to export carousel images");
        }
        continue;
      }

      if (platformId === "social-carousel-pdf") {
        try {
          const pdfFile = await exportSocialCarouselToPDF(
            templateName,
            carouselSlideRefs,
            (progress) =>
              onProgress(
                Math.min(
                  currentProgress + (progress / 100) * progressIncrement,
                  90
                )
              )
          );

          if (pdfFile) {
            exportedFiles.push(pdfFile);
          }
        } catch (pdfError) {
          console.error("Social carousel PDF export failed:", pdfError);
          toast.error("Failed to export carousel PDF");
        }
        continue;
      }

      // Handle regular exports (existing functionality)
      const fileName = generateFileName(
        templateName,
        scale,
        fileType,
        platformId
      );

      const elements = createExportElement(platformId, canvasRef, headshotRef);
      if (!elements) {
        continue;
      }

      const { container, exportElement } = elements;
      elementsToCleanup.push(container);

      const platform =
        platformId === "headshot"
          ? headshotExportOption
          : exportOptions.find((p) => p.id === platformId);

      if (!platform) continue;

      const dataUrl = await generateImageFromElement(
        exportElement,
        fileType,
        scale,
        platform.width,
        platform.height
      );

      exportedFiles.push({
        name: fileName,
        data: dataUrl,
      });
    }

    onProgress(95);
    await downloadFiles(exportedFiles, templateName);
    onProgress(100);

    toast.success(`Download Successful!`, {
      description:
        exportedFiles.length > 1
          ? `${exportedFiles.length} files downloaded as zip.`
          : `${exportedFiles.length} file downloaded.`,
    });

    return true;
  } catch (error: any) {
    onProgress(0);
    toast.error("Download Failed", {
      description: `An error occurred: ${
        error.message || "Unknown error"
      }. Check console for details.`,
      duration: 10000,
    });
    return false;
  } finally {
    cleanupElements(elementsToCleanup);
  }
}
