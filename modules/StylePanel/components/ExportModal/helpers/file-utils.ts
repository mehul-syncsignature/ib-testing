// modules/StylePanel/components/ExportModal/helpers/file-utils.ts

import JSZip from "jszip";

export function generateFileName(
  baseName: string,
  scale: number,
  type: string,
  platformId?: string
): string {
  const platformSuffix = platformId ? `_${platformId}` : "";

  // Handle PDF files specially
  if (platformId === "social-carousel-pdf") {
    const cleanBaseName = baseName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    return `${cleanBaseName}_carousel.pdf`;
  }

  // Regular file handling (existing functionality)
  const scaleSuffix = type !== "svg" ? `@${scale.toFixed(1)}x` : "";
  const cleanBaseName = baseName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  return `${cleanBaseName}${platformSuffix}${scaleSuffix}.${type}`;
}

export interface ExportedFile {
  name: string;
  data: string;
}

export async function downloadFiles(
  exportedFiles: ExportedFile[],
  templateName: string
) {
  if (exportedFiles.length > 1) {
    await downloadAsZip(exportedFiles, templateName);
  } else if (exportedFiles.length === 1) {
    await downloadSingleFile(exportedFiles[0]);
  }
}

async function downloadAsZip(
  exportedFiles: ExportedFile[],
  templateName: string
) {
  const zip = new JSZip();

  for (const file of exportedFiles) {
    try {
      if (file.name.endsWith(".pdf")) {
        // Handle PDF files (which are blob URLs)
        const response = await fetch(file.data);
        const blob = await response.blob();
        zip.file(file.name, blob);
      } else {
        // Handle image files (data URLs) - existing functionality
        const dataUrlParts = file.data.split(",");
        const mimeType = dataUrlParts[0].match(/:(.*?);/)?.[1] ?? "";
        const byteString = atob(dataUrlParts[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: mimeType });
        zip.file(file.name, blob);
      }
    } catch (error) {
      console.error(`Error adding file ${file.name} to zip:`, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipUrl = URL.createObjectURL(zipBlob);

  const link = document.createElement("a");
  link.download = `${templateName
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "_")}_export.zip`;
  link.href = zipUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(zipUrl);
}

async function downloadSingleFile(file: ExportedFile) {
  try {
    if (file.name.endsWith(".pdf")) {
      // Handle PDF files (which are blob URLs)
      const link = document.createElement("a");
      link.download = file.name;
      link.href = file.data;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the blob URL
      URL.revokeObjectURL(file.data);
    } else {
      // Handle image files (data URLs) - existing functionality
      const link = document.createElement("a");
      link.download = file.name;
      link.href = file.data;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error(`Error downloading file ${file.name}:`, error);
  }
}

export function cleanupElements(elements: HTMLDivElement[]) {
  elements.forEach((element) => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
}
