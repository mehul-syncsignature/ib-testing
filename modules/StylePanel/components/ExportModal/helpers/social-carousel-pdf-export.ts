import jsPDF from "jspdf";
import { toast } from "sonner";
import { type ExportedFile } from "./file-utils";
import { exportCarouselSlidesToImages } from "./carousel-images-export";

export async function exportSocialCarouselToPDF(
  templateName: string,
  slideRefs: React.RefObject<HTMLDivElement | null>[],
  onProgress: (progress: number) => void
): Promise<ExportedFile | null> {
  onProgress(10);

  const imageFiles = await exportCarouselSlidesToImages(
    templateName,
    slideRefs,
    "jpeg",
    1.5,
    (progress) => onProgress(progress * 0.8 + 10)
  );

  if (imageFiles.length === 0) {
    toast.error("PDF generation failed: Could not create slide images.");
    return null;
  }

  try {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [1080, 1350],
    });

    pdf.deletePage(1);

    imageFiles.forEach((imageFile) => {
      pdf.addPage();
      pdf.addImage(imageFile.data, "PNG", 0, 0, 1080, 1350);
    });

    onProgress(95);

    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[-:]/g, "");
    const cleanBaseName = templateName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const filename = `${cleanBaseName}_carousel_${timestamp}.pdf`;

    const pdfData = pdf.output("datauristring");

    onProgress(100);

    return {
      name: filename,
      data: pdfData,
    };
  } catch (error) {
    console.error("Failed to compile PDF:", error);
    toast.error("An error occurred while creating the PDF file.");
    return null;
  }
}
