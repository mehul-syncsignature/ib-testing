// modules/ControlPanel/ControlPanel.tsx

"use client";
import React, { useEffect, useState, useRef } from "react";
import { Form } from "@/components/ui/form";
import SideBar from "@/components/SideBar";
import { TextFieldsSection } from "./components/sections/TextFieldsSection";
import { useUnifiedDataConfig } from "@/hooks/unifiedDataConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formSchema,
  FormValues,
  SlidePosition,
  CarouselData,
} from "./types";
import { useAppContext } from "@/contexts/AppContext";
import { useFieldVisibility } from "./hooks/useFieldVisibility";
import { useAssetContext } from "@/contexts/AssetContext";
import { getSlidePosition } from "@/common/utils"; // Assuming this utility exists
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AIContentGenerationDialog, {
  AIContentGenerationDialogHandle,
} from "@/components/AIContentGenerationDialog";

const ControlPanel = () => {
  const {
    state: { headshot },
    setHeadshot,
  } = useAppContext();

  const {
    state: { currentAssetType, currentSlideIndex, slides },
  } = useAssetContext();

  const { data, setData } = useUnifiedDataConfig();

  const [initialShowBrandMark, setInitialShowBrandMark] = useState<
    boolean | null
  >(null);

  const aiDialogRef = useRef<AIContentGenerationDialogHandle>(null);

  useEffect(() => {
    if (initialShowBrandMark === null && data.showBrandMark !== undefined) {
      setInitialShowBrandMark(data.showBrandMark);
    }
  }, []);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title || "",
      subTitle: data.subTitle || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      screenshotUrl: data.screenshotUrl || "",
      backgroundimgUrl: data.backgroundimgUrl || "",
      imageAlt: data.imageAlt || "",
      ctaText: data.ctaText || "",
      highlightedText: data.highlightedText || "",
      headshotPosition: data.headshotPosition || { x: 0, y: 0 },
      headshotScale: data.headshotScale || 1,
      headshotOpacity: data.headshotOpacity || 1,
    },
  });

  // Initialize form when data changes
  useEffect(() => {
    form.reset({
      title: data.title || "",
      subTitle: data.subTitle || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      screenshotUrl: data.screenshotUrl || "",
      backgroundimgUrl: data.backgroundimgUrl || "",
      imageAlt: data.imageAlt || "",
      ctaText: data.ctaText || "",
      highlightedText: data.highlightedText || "",
      headshotPosition: data.headshotPosition || { x: 0, y: 0 },
      headshotScale: data.headshotScale || 1,
      headshotOpacity: data.headshotOpacity || 1,
    });
  }, [data, form]);

  const slidePosition: SlidePosition = getSlidePosition(
    currentSlideIndex,
    slides.length
  );

  const currentSlideData =
    currentAssetType === "social-carousel"
      ? (data as CarouselData)?.[slidePosition]
      : null;

  const { visibleFields, handleToggleField } = useFieldVisibility({
    initialData: data,
    currentAssetType,
    currentSlideData,
  });

  const handleBrandMarkToggle = (checked: boolean) => {
    setData({ showBrandMark: checked });
  };

  // Handle form changes
  useEffect(() => {
    const handleFormChange = (values: FormValues) => {
      const { ...dataValues } = values;
      const updatedData: Partial<FormValues> = {};

      (Object.keys(dataValues) as Array<keyof typeof dataValues>).forEach(
        (key) => {
          if (visibleFields[key]) {
            updatedData[key] = dataValues[key];
          }
        }
      );

      setData(updatedData);

    };

    const subscription = form.watch(handleFormChange);
    return () => subscription.unsubscribe();
  }, [form, setData, setHeadshot, visibleFields, headshot]);

  const formContent = (
    <div className="overflow-y-auto p-4 space-y-6 scrollbar-thin-custom">
      <Form {...form}>
        <form className="space-y-8">
          {/* AI Content Generation Button */}
          {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
            <div className="pb-4 border-b">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => aiDialogRef.current?.open()}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Content
              </Button>
            </div>
          )}

          <TextFieldsSection
            form={form}
            visibleFields={visibleFields}
            handleToggleField={handleToggleField}
          />
          {initialShowBrandMark && (
            <div className="flex items-center justify-between">
              <Label
                htmlFor="brandmark-main-toggle"
                className="text-smx cursor-pointer flex items-center gap-2"
              >
                Brand Mark
              </Label>
              <Switch
                id="brandmark-main-toggle"
                checked={data.showBrandMark}
                onCheckedChange={handleBrandMarkToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}
        </form>
      </Form>

      {/* AI Content Generation Dialog */}
      <AIContentGenerationDialog ref={aiDialogRef} />
    </div>
  );

  return <SideBar mainContent={formContent} showFooter={true} />;
};

export default ControlPanel;
