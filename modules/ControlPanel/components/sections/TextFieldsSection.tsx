// modules/ControlPanel/components/sections/TextFieldsSection.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FormFieldWrapper } from "../ui/FormFieldWrapper";
import { RichTextField } from "../form-fields/RichTextField";
import { SimpleTextField } from "../form-fields/SimpleTextField";
import { ImageUploadField } from "../form-fields/ImageUploadField";
import { useUnifiedDataConfig } from "@/hooks/useUnifiedDataConfig";
import { templateData } from "@/common/constants/template-data";
import { useAssetContext } from "@/contexts/AssetContext";
import { Slider } from "@/components/ui/slider";
import { backdropSvg } from "@/common/constants/svg-map";
import { UseFormReturn } from "react-hook-form";
import { FormValues, Position, FieldName } from "../../types";
import { getSlidePosition } from "@/common/utils"; // Assuming this utility exists
import PositionDragger from "@/components/DraggerWithCrop/components/PositionDragger";
import { Button } from "@/components/ui/button";

interface TextFieldsSectionProps {
  form: UseFormReturn<FormValues>;
  visibleFields: Record<FieldName, boolean>;
  handleToggleField: (
    fieldName: FieldName,
    isChecked: boolean,
    form: any
  ) => void;
}

export const TextFieldsSection = ({
  form,
  visibleFields,
  handleToggleField,
}: TextFieldsSectionProps) => {
  const { data, setData } = useUnifiedDataConfig();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    state: {
      currentAssetType,
      currentStyle,
      templateId: currentTemplateId,
      currentSlideIndex,
      slides,
    },
    setCurrentStyle,
  } = useAssetContext();

  const [removeBackground, setRemoveBackground] = useState<boolean>(true);
  const watch = form.watch();

  const isAvailableField = (field: string) => {
    if (!currentAssetType || !currentTemplateId) return false;
    const templateFields = templateData[currentAssetType][currentTemplateId];
    if (!templateFields) return false;

    if (currentAssetType === "social-carousel") {
      const slidePosition = getSlidePosition(currentSlideIndex, slides.length);
      const currentSlideTemplate = templateFields[slidePosition];
      return !!(
        currentSlideTemplate &&
        currentSlideTemplate[field] &&
        currentSlideTemplate[field] !== ""
      );
    }

    return field in templateFields;
  };

  const handleRichTextChange = (content: string, fieldName: string) => {
    const typedFieldName = fieldName as FieldName;
    form.setValue(typedFieldName, content);
  };

  const handleOpacityChange = (newOpacity: number[]) => {
    setData({
      headshotOpacity: newOpacity[0],
    });
    form.setValue("headshotOpacity", newOpacity[0], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleRemoveBackground = (checked: boolean) => {
    setRemoveBackground(checked);
  };

  const handleHeadshotPositionChange = (newPosition: Position) => {
    // Update unified data config (for template-specific persistence)
    setData({
      headshotPosition: newPosition,
    });
    
    // Update form value as requested
    form.setValue("headshotPosition", newPosition, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleHeadshotScaleChange = (newScale: number[]) => {
    // Update unified data config (for template-specific persistence)
    setData({
      headshotScale: newScale[0],
    });
    
    // Update form value as requested
    form.setValue("headshotScale", newScale[0], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

  };

  

  const handleRandomizeHeadshotSvg = () => {
    if (!currentStyle) return;

    const svgGroup = [6, 7, 8, 9].includes(Number(currentTemplateId))
      ? "center"
      : "right";
    const options = backdropSvg[svgGroup];
    const currentBackdropName =
      currentStyle?.config?.headshotBackdropConfig?.headshotBackdropName;

    const currentIndex = options.indexOf(currentBackdropName || "");
    const nextIndex = (currentIndex + 1) % options.length;
    const nextStyle = options[nextIndex];

    const updatedStyle = {
      ...currentStyle,
      config: {
        ...currentStyle.config,
        headshotBackdropConfig: {
          ...currentStyle.config?.headshotBackdropConfig,
          headshotBackdropName: nextStyle,
        },
      },
    };
    setCurrentStyle(updatedStyle);
  };

  const handleImageUploadComplete = (
    url: string,
    position: Position = { x: 0, y: 0 },
    scale: number = 1,
    fieldName: FieldName
  ) => {
    form.setValue(fieldName, url, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (fieldName === "imageUrl") {
      form.setValue("headshotPosition", position, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      form.setValue("headshotScale", scale, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const fieldsConfig = [
    {
      name: "title" as FieldName,
      label: "Title",
      Component: RichTextField,
      props: { height: "100px" },
      onContentChange: handleRichTextChange,
    },
    {
      name: "subTitle" as FieldName,
      label: "Sub-Title",
      Component: RichTextField,
      props: { height: "80px" },
      onContentChange: handleRichTextChange,
    },
    {
      name: "description" as FieldName,
      label: "Description",
      Component: RichTextField,
      props: { height: "80px" },
      onContentChange: handleRichTextChange,
    },
    {
      name: "ctaText" as FieldName,
      label: "CTA Text",
      Component: RichTextField,
      props: { placeholder: "Join Community", isToolbarVisible: false },
      onContentChange: handleRichTextChange,
    },
    {
      name: "highlightedText" as FieldName,
      label: "Highlighted Text",
      Component: RichTextField,
      props: { placeholder: "Learn More", isToolbarVisible: false },
      onContentChange: handleRichTextChange,
    },
    {
      name: "imageUrl" as FieldName,
      label: "Headshot Image",
      Component: ImageUploadField,
      props: {
        bucketName: "dropzone-upload",
        isAdjustablePosition: true,
        removeBackground: removeBackground,
        simpleUploader: false,
        setRemoveBackground: handleRemoveBackground,
        highQuality: true,
      },
      onUploadComplete: (url: string, position?: Position, scale?: number) =>
        handleImageUploadComplete(url, position, scale, "imageUrl"),
      showShuffleButton: true,
      onShuffle: handleRandomizeHeadshotSvg,
      renderExtra: () => (
        data.imageUrl && (
          <>
            <div className="w-full">
              <Button
                className="w-full mb-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }}
              >
                Adjust Position
              </Button>
            </div>

            {isOpen && (
              <>
                <div className="w-full flex justify-center">
                  <PositionDragger
                    position={data?.headshotPosition || {x: 0, y: 0}}
                    scale={data?.headshotScale || 1}
                    onPositionChange={handleHeadshotPositionChange}
                    height={190}
                  />
                </div>
                <div className="space-y-2 w-full max-w-xs mx-auto">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Scale</span>
                    <span>{((data?.headshotScale || 1) * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    defaultValue={[data?.headshotScale || 1]}
                    min={0.25}
                    max={3}
                    step={0.01}
                    value={[data?.headshotScale || 1]}
                    onValueChange={handleHeadshotScaleChange}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </>
        )
      ),
    },
    {
      name: "backgroundimgUrl" as FieldName,
      label: "Background-Image",
      Component: ImageUploadField,
      props: {
        bucketName: "dropzone-upload",
        aspectRatio: 4 / 5,
        removeBackground: false,
        setRemoveBackground: handleRemoveBackground,
        simpleUploader: true,
      },
      onUploadComplete: (url: string) =>
        handleImageUploadComplete(
          url,
          undefined,
          undefined,
          "backgroundimgUrl"
        ),
      renderExtra: () => (
        <div className="space-y-2 w-full max-w-xs mx-auto">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Opacity</span>
            <span>{Math.round((data?.headshotOpacity || 0) * 100)}%</span>
          </div>
          <Slider
            defaultValue={[data?.headshotOpacity || 0]}
            min={0}
            max={1}
            step={0.01}
            value={[data?.headshotOpacity || 0]}
            onValueChange={handleOpacityChange}
            className="w-full"
          />
        </div>
      ),
    },
    {
      name: "screenshotUrl" as FieldName,
      label: "Screenshot",
      Component: ImageUploadField,
      props: {
        bucketName: "dropzone-upload",
        removeBackground: false,
        aspectRatio: 5 / 3,
        setRemoveBackground: handleRemoveBackground,
        simpleUploader: true,
      },
      onUploadComplete: (url: string) =>
        handleImageUploadComplete(url, undefined, undefined, "screenshotUrl"),
    },
  ];

  return (
    <>
      {fieldsConfig.map(
        ({
          name,
          label,
          Component,
          props,
          onContentChange,
          onUploadComplete,
          showShuffleButton,
          onShuffle,
          renderExtra,
        }) =>
          isAvailableField(name) && (
            <FormFieldWrapper
              key={name}
              label={label}
              fieldName={name}
              isVisible={visibleFields[name]}
              onToggle={(checked) => handleToggleField(name, checked, form)}
              showShuffleButton={showShuffleButton}
              onShuffle={onShuffle}
            >
              {Component === RichTextField && (
                <RichTextField
                  name={name}
                  form={form}
                  onContentChange={onContentChange as any}
                  {...(props as any)}
                />
              )}
              {Component === SimpleTextField && (
                <SimpleTextField name={name} form={form} {...(props as any)} />
              )}
              {Component === ImageUploadField &&
                (form.watch("imageUrl") ? (
                  <ImageUploadField
                    name={name}
                    form={form}
                    watch={watch}
                    data={data}
                    onUploadComplete={onUploadComplete as any}
                    {...(props as any)}
                  />
                ) : null)}
              {renderExtra && renderExtra()}
            </FormFieldWrapper>
          )
      )}
    </>
  );
};
