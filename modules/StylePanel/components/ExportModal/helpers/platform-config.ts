// modules/StylePanel/components/ExportModal/helpers/platform-config.ts

export interface ExportPlatform {
  id: string;
  name: string;
  dimensions: string;
  width: number;
  height: number;
}

export const exportOptions: ExportPlatform[] = [
  {
    id: "social-banner",
    name: "LinkedIn banner",
    dimensions: "1584x396px",
    width: 1584,
    height: 396,
  },
  {
    id: "social-post",
    name: "Social post",
    dimensions: "1080x1350px",
    width: 1080,
    height: 1350,
  },
  {
    id: "quote-card",
    name: "Quote card",
    dimensions: "1080x1350px",
    width: 1080,
    height: 1350,
  },
  {
    id: "textimg-post",
    name: "Textimg post",
    dimensions: "1080x1350px",
    width: 1080,
    height: 1350,
  },
  {
    id: "featured-post",
    name: "Featured post",
    dimensions: "1200x627px",
    width: 1200,
    height: 627,
  },
  {
    id: "mockup-post",
    name: "Mockup post",
    dimensions: "1080x1350px",
    width: 1080,
    height: 1350,
  },
];

export const headshotExportOption: ExportPlatform = {
  id: "headshot",
  name: "Profile picture",
  dimensions: "500x500px",
  width: 500,
  height: 500,
};

// Social carousel PDF export option
export const socialCarouselPDFOption: ExportPlatform = {
  id: "social-carousel-pdf",
  name: "PDF Carousel",
  dimensions: "A4 PDF",
  width: 1080,
  height: 1350,
};

// Social carousel images export option
// export const socialCarouselImagesOption: ExportPlatform = {
//   id: "social-carousel-images",
//   name: "Carousel Images",
//   dimensions: "1080x1080px",
//   width: 1080,
//   height: 1080,
// };

export function getDefaultExportPlatforms(
  currentAssetType: string
): ExportPlatform[] {
  // For social-carousel, show both PDF and Images export options
  if (currentAssetType === "social-carousel") {
    return [socialCarouselPDFOption];
  }

  return exportOptions.filter((option) => option.id === currentAssetType);
}

export function getAvailableExportPlatforms(
  defaultPlatforms: ExportPlatform[],
  headshotAvailable: boolean
): ExportPlatform[] {
  return headshotAvailable
    ? [...defaultPlatforms, headshotExportOption]
    : defaultPlatforms;
}
