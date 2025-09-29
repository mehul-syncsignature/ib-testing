import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { ExportedFile } from "./file-utils";

export async function exportCarouselSlidesToImages(
  templateName: string,
  slideRefs: React.RefObject<HTMLDivElement | null>[],
  fileType: "png" | "jpg" | "svg" | "jpeg" = "png",
  scale: number = 2,
  onProgress: (progress: number) => void
): Promise<ExportedFile[]> {
  try {
    if (slideRefs.length === 0) {
      toast.error("No slides to export");
      return [];
    }

    onProgress(10);

    const exportedFiles: ExportedFile[] = [];
    const totalSlides = slideRefs.length;

    for (let i = 0; i < slideRefs.length; i++) {
      const slideRef = slideRefs[i];
      const progressPercent = 10 + ((i + 1) / totalSlides) * 80;
      onProgress(Math.min(progressPercent, 90));

      try {
        if (!slideRef.current) {
          continue;
        }

        const imageDataUrl = fileType === "jpeg" || fileType === "jpg"
          ? await htmlToImage.toJpeg(slideRef.current, {
              quality: 1, // High quality but compressed (0.92 is sweet spot)
              width: 1080,
              height: 1350,
              pixelRatio: scale,
              backgroundColor: "#ffffff",
              filter: (node) => {
                if (node.tagName === "LINK" && node.getAttribute) {
                  const href = node.getAttribute("href");
                  if (
                    href &&
                    (href.includes("paddle.com") ||
                      href.includes("external-domain.com"))
                  ) {
                    return false;
                  }
                }
                return true;
              },
            })
          : await htmlToImage.toPng(slideRef.current, {
              width: 1080,
              height: 1350,
              pixelRatio: scale,
              backgroundColor: "#ffffff",
              filter: (node) => {
                if (node.tagName === "LINK" && node.getAttribute) {
                  const href = node.getAttribute("href");
                  if (
                    href &&
                    (href.includes("paddle.com") ||
                      href.includes("external-domain.com"))
                  ) {
                    return false;
                  }
                }
                return true;
              },
            });

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[-:]/g, "");
        const cleanBaseName = templateName
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase();
        const filename = `${cleanBaseName}_slide_${
          i + 1
        }_${timestamp}.${fileType}`;

        exportedFiles.push({
          name: filename,
          data: imageDataUrl,
        });
      } catch (slideError) {
        console.error("slideError", slideError);
        toast.error(`Failed to export slide ${i + 1}`);
        continue;
      }
    }

    onProgress(95);

    if (exportedFiles.length > 0) {
      toast.success(
        `Successfully exported ${exportedFiles.length} slide images`
      );
    } else {
      toast.error("No slides were successfully exported");
    }

    onProgress(100);
    return exportedFiles;
  } catch (error) {
    console.error("error", error);
    toast.error("Failed to export carousel slides");
    return [];
  }
}