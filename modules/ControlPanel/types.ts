import { z } from "zod";

export interface Position {
  x: number;
  y: number;
}

export const formSchema = z.object({
  title: z.any().optional(),
  subTitle: z.any().optional(),
  description: z.any().optional(),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  screenshotUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  backgroundimgUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  imageAlt: z
    .string()
    .max(100, "Image alt text must be less than 100 characters")
    .optional(),
  buttonText: z
    .string()
    .max(50, "Button text must be less than 50 characters")
    .optional(),
  ctaText: z
    .string()
    .max(50, "Community button text must be less than 50 characters")
    .optional(),
  highlightedText: z
    .string()
    .max(50, "CTA button text must be less than 50 characters")
    .optional(),
  headshotPosition: z.any().optional(),
  headshotScale: z.number().min(0.5).max(2).optional(),
  headshotOpacity: z.number().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export type FieldName = keyof FormValues;

export interface FieldConfig {
  name: FieldName;
  label: string;
  placeholder?: string;
  type: "rich-text" | "text" | "image-upload";
  height?: string;
  uploadConfig?: {
    bucketName: string;
    aspectRatio?: number;
    removeBackground?: boolean;
    isAdjustablePosition?: boolean;
    simpleUploader?: boolean;
  };
}

export type SlidePosition = "first" | "middle" | "last";

export type CarouselData = {
  [key in SlidePosition]?: Partial<FormValues>;
};
