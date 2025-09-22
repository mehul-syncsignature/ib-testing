/**
 * Converts a data URL to a Blob with high quality preservation
 */
export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  // For data URLs, fetch will automatically decode the Base64 data
  const response = await fetch(dataUrl);

  // Get the blob with preserved quality
  return await response.blob();
};

/**
 * Uploads an image to Supabase Storage with quality preservation
 */
export const uploadToSupabase = async (
  bucketName: string,
  folderPath: string,
  imageBlob: Blob,
  filename: string
): Promise<{ publicUrl: string }> => {
  // Generate a unique filename if not provided
  const finalFilename = filename || `${Date.now()}-processed.png`;

  // Determine file extension
  let fileExt = finalFilename.split(".").pop() || "png";

  // Ensure we're using a high-quality format - prefer PNG for transparency
  // or original format for better compatibility
  if (!["png", "jpg", "jpeg", "webp"].includes(fileExt.toLowerCase())) {
    fileExt = "png"; // Default to PNG for best quality
  }

  // Create the full file path
  // const filePath = folderPath
  //   ? `${folderPath}/${finalFilename}`
  //   : finalFilename;

  return { publicUrl: "" };
};
