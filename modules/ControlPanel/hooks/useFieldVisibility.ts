/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFieldVisibility.ts

"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { FormValues, FieldName } from "../types";

interface UseFieldVisibilityProps {
  initialData: any;
  currentAssetType?: string;
  currentSlideData?: any;
}

export const useFieldVisibility = ({
  initialData,
  currentAssetType,
  currentSlideData,
}: UseFieldVisibilityProps) => {
  const dataForInitialization = useMemo(() => {
    if (currentAssetType === "social-carousel" && currentSlideData) {
      return currentSlideData;
    }
    return initialData;
  }, [currentAssetType, currentSlideData, initialData]);

  const [visibleFields, setVisibleFields] = useState<
    Record<FieldName, boolean>
  >({
    title: false,
    subTitle: false,
    description: false,
    imageUrl: false,
    screenshotUrl: false,
    backgroundimgUrl: false,
    ctaText: false,
    highlightedText: false,
    imageAlt: true,
    buttonText: true,
    headshotPosition: true,
    headshotOpacity: true,
    headshotScale: true,
  });
  const [hiddenValues, setHiddenValues] = useState<Partial<FormValues>>({});
  useEffect(() => {
    setVisibleFields({
      title: !!dataForInitialization?.title,
      subTitle: !!dataForInitialization?.subTitle,
      description: !!dataForInitialization?.description,
      imageUrl: !!dataForInitialization?.imageUrl,
      screenshotUrl: !!dataForInitialization?.screenshotUrl,
      backgroundimgUrl: !!dataForInitialization?.backgroundimgUrl,
      ctaText: !!dataForInitialization?.ctaText,
      highlightedText: !!dataForInitialization?.highlightedText,
      imageAlt: true,
      buttonText: true,
      headshotPosition: true,
      headshotOpacity: true,
      headshotScale: true,
    });
  }, [dataForInitialization]);

  const handleToggleField = useCallback(
    (fieldName: FieldName, isChecked: boolean, form: any) => {
      if (!isChecked) {
        const currentValue = form.getValues(fieldName);
        setVisibleFields((prev) => ({ ...prev, [fieldName]: false }));
        setHiddenValues((prev) => ({ ...prev, [fieldName]: currentValue }));
        form.setValue(fieldName, "", { shouldValidate: true });
      } else {
        setVisibleFields((prev) => ({ ...prev, [fieldName]: true }));
        if (hiddenValues[fieldName] !== undefined) {
          setTimeout(() => {
            form.setValue(fieldName, hiddenValues[fieldName], {
              shouldValidate: true,
              shouldDirty: true,
            });
            setHiddenValues((prev) => {
              const newValues = { ...prev };
              delete newValues[fieldName];
              return newValues;
            });
          }, 0);
        }
      }
    },
    [hiddenValues]
  );

  return {
    visibleFields,
    hiddenValues,
    handleToggleField,
  };
};
