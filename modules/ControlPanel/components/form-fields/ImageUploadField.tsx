/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import ImageUploader from "@/components/DraggerWithCrop/ImageUploader";
import { Data } from "@/contexts/AssetContext/types";

interface ImageUploadFieldProps {
  name: string;
  form: any;
  watch: any;
  data: Data;
  bucketName: string;
  onUploadComplete: (url: string, position?: any, scale?: number) => void;
  removeBackground?: boolean;
  setRemoveBackground?: (flag: boolean) => void;
  aspectRatio?: number;
  highQuality?: boolean;
  isAdjustablePosition?: boolean;
  simpleUploader?: boolean;
}

export const ImageUploadField = ({
  name,
  form,
  bucketName,
  onUploadComplete,
  removeBackground = false,
  setRemoveBackground,
  aspectRatio = 1 / 1,
  highQuality = false,
  isAdjustablePosition = false,
  simpleUploader = false,
  data,
}: ImageUploadFieldProps) => {
    const { headshotPosition, headshotScale } = data;
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormControl>
            <div>
              <ImageUploader
                bucketName={bucketName}
                onUploadComplete={onUploadComplete}
                initialImage={form.getValues(name)}
                initialPosition={headshotPosition}
                initialScale={headshotScale}
                highQuality={highQuality}
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
                aspectRatio={aspectRatio}
                isAdjustablePosition={isAdjustablePosition}
                simpleUploader={simpleUploader}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
