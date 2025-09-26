// Canvas.tsx
import { componentMap, ComponentType } from "@/common/utils/component-mapper";
import React, { Suspense } from "react";
import { useAssetContext } from "@/contexts/AssetContext";
import { useBrandContext } from "@/contexts/BrandContext";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useS3Upload } from "@/hooks/s3Upload";
import { normalizeDesignForSave, useUpsertDesign } from "@/hooks/designs";
import { useCanvasRef } from "@/hooks/canvas";
import { useUpdatePost } from "@/hooks/post";
import * as htmlToImage from "html-to-image";
import { Button } from "@/components/ui/button";

export type CanvasProps = {
  type: ComponentType;
};

const uuidValidate = (uuid: string) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    uuid
  );
};

const Canvas = ({ type }: CanvasProps) => {
  const Component = componentMap[type];
  const searchParams = useSearchParams();
  const postId = localStorage.getItem("pid");

  const { uploadToS3, loading: isUploading } = useS3Upload();
  const { canvasRef } = useCanvasRef();
  const [upsertDesign, { loading: isSaving }] = useUpsertDesign();
  const [updatePost, { loading: isUpdatingPost }] = useUpdatePost();

  const {
    state: { brand },
  } = useBrandContext();
  const {
    state: {
      currentAssetType,
      styleId,
      templateId,
      dataConfig,
      slides,
      currentStyle,
    },
  } = useAssetContext();

  const isLoading = isUploading || isSaving || isUpdatingPost;

  const handleAddToPost = async () => {
    if (!brand?.id) {
      toast.error("Please select or create a brand first");
      return;
    }
    if (!canvasRef.current) {
      toast.error(
        "Cannot find the design element to export. Please try again."
      );
      return;
    }

    try {
      toast.info("Generating image...");
      const imageBlob = await htmlToImage.toBlob(canvasRef.current, {
        pixelRatio: 2, // Export at 2x resolution for better quality
      });

      if (!imageBlob) {
        throw new Error("Failed to create image blob from the design.");
      }

      toast.info("Uploading image...");
      const file = new File([imageBlob], "upload.png", {
        type: imageBlob.type,
      });
      const imageUrl = await uploadToS3(file);
      // window.open(imageUrl, "_blank");

      toast.info("Saving design...");
      const designId = searchParams.get("designId");
      const designData = {
        ...(designId ? { id: designId } : {}),
        brandId: brand.id,
        assetType: currentAssetType,
        styleId: styleId,
        templateId: Number(templateId),
        data: normalizeDesignForSave(currentAssetType, dataConfig, slides),
        imageUrl: imageUrl,
      };

      const result = await upsertDesign(designData);

      console.log("result", result);
      console.log("result.data.id", result.data.id);

      if (postId && result) {
        toast.info("Updating post...");
        await updatePost(postId, {
          designId: result.data.id,
          imageUrl: imageUrl,
        });
      }

      toast.success(
        result.action === "created"
          ? "Design saved and added to post!"
          : "Design updated and added to post!"
      );
    } catch (error) {
      toast.error(
        `Failed to add to post: ${
          (error as Error).message || "Please try again."
        }`
      );
    } finally {
      // Clean up the postId from localStorage regardless of success or failure
      if (postId) {
        localStorage.removeItem("pid");
      }
    }
  };

  if (!Component) {
    return <div>Component not found for type: {type}</div>;
  }

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      {currentStyle && (
        <Component
          data={{ ...dataConfig }}
          style={currentStyle}
          brand={brand}
        />
      )}
      {postId && uuidValidate(postId) && (
        <div className="absolute top-[2.5%] left-1/2 -translate-x-1/2 z-10  select-none">
          <Button
            className="bg-primary text-slate-900 font-semibold py-3 px-8 rounded-full shadow-xl cursor-pointer hover:bg-primary/70 transition-all transform hover:scale-102 w-fit h-fit"
            onClick={handleAddToPost}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Add to Your Post"}
          </Button>
        </div>
      )}
    </Suspense>
  );
};

export default Canvas;
