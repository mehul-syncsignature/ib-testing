import { centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop";

/**
 * Creates a centered crop with the specified aspect ratio
 */
export const createCenteredCrop = (
  width: number,
  height: number,
  aspectRatio: number
) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspectRatio,
      width,
      height
    ),
    width,
    height
  );
};

/**
 * Generates a cropped image from the source image using the provided crop dimensions
 * with improved quality preservation
 */
export const cropImageToDataUrl = async (
  sourceImg: HTMLImageElement,
  crop: PixelCrop
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const scaleX = sourceImg.naturalWidth / sourceImg.width;
  const scaleY = sourceImg.naturalHeight / sourceImg.height;

  // Use the natural (original) dimensions for the cropped area
  const cropWidthScaled = crop.width * scaleX;
  const cropHeightScaled = crop.height * scaleY;

  // Set the canvas size to the scaled crop dimensions to retain original resolution
  canvas.width = cropWidthScaled;
  canvas.height = cropHeightScaled;

  const MIN_CANVAS_WIDTH = 480; // Minimum width in pixels
  const MIN_CANVAS_HEIGHT = 360; // Minimum height in pixels

  // Modified canvas dimension logic
  canvas.width = Math.max(cropWidthScaled, MIN_CANVAS_WIDTH);
  canvas.height = Math.max(cropHeightScaled, MIN_CANVAS_HEIGHT);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  // Enable high-quality image rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw the image at original resolution
  ctx.drawImage(
    sourceImg,
    crop.x * scaleX,
    crop.y * scaleY,
    cropWidthScaled,
    cropHeightScaled,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Use maximum quality (1.0) for the output
  return canvas.toDataURL("image/png", 1.0);
};
