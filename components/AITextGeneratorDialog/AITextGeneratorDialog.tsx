"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGenerateAssetVariants,
  AssetVariant,
} from "@/hooks/useAITextGeneration";
import { z } from "zod";
import { createAISectionsFromVariants } from "@/common/constants/unified-bento-config";
import { useAppContext } from "@/contexts/AppContext";
import { useAssetContext } from "@/contexts/AssetContext";

const questionSchema = z.object({
  name: z.string().optional(),
  socialHandle: z.string().optional(),
  whatDoYouOffer: z
    .string()
    .min(5, "Please provide at least 5 characters for what you offer"),
  whoDoYouHelp: z
    .string()
    .min(5, "Please provide at least 5 characters for who you help"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export interface AITextGeneratorDialogHandle {
  open: () => void;
  close: () => void;
}

const AITextGeneratorDialog = forwardRef<AITextGeneratorDialogHandle>(
  (props, ref) => {
    const [open, setOpen] = useState(false);

    const { generateAssetVariants, loading: isGenerating } =
      useGenerateAssetVariants();
    const { setSectionsData } = useAppContext();
    const {
      state: { dataConfig },
    } = useAssetContext();

    const form = useForm<QuestionFormData>({
      resolver: zodResolver(questionSchema),
      defaultValues: {
        name: "",
        socialHandle: "",
        whatDoYouOffer: "",
        whoDoYouHelp: "",
      },
    });

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true);
      },
      close: () => {
        setOpen(false);
        form.reset();
      },
    }));

    const createSectionsFromAIVariants = (
      variants: AssetVariant[]
      // name?: string,
      // socialHandle?: string
    ): void => {
      const aiSectionsData = createAISectionsFromVariants(
        variants,
        dataConfig.imageUrl
        // name, // Add userName parameter
        // socialHandle // Add userSocialHandle parameter
      );
      setSectionsData(aiSectionsData);
    };

    const onSubmit = async (formData: QuestionFormData): Promise<void> => {
      try {
        const result = await generateAssetVariants({
          whatDoYouOffer: formData.whatDoYouOffer,
          whoDoYouHelp: formData.whoDoYouHelp,
          promptType: "asset-variants",
        });

        if (result && result.assetVariants) {
          createSectionsFromAIVariants(
            result.assetVariants
            // formData.name || "",
            // formData.socialHandle || ""
          );
          toast.success("Content generated successfully!");
          setOpen(false);
        }
      } catch (error) {
        // --- START OF THE ONLY CHANGE ---
        if (process.env.ENVIRONMENT === "development") {
          console.error("Error generating content:", error);
        }

        // This now shows the specific error message from your API,
        // with a fallback for any unexpected errors.
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        // --- END OF THE ONLY CHANGE ---
      }
    };

    const handleDialogOpenChange = (newOpen: boolean): void => {
      setOpen(newOpen);
      if (!newOpen) {
        form.reset();
      }
    };

    const orbitColors = [
      "text-white",
      "text-[#38bdf8]",
      "text-[#818cf8]",
      "text-[#a21caf]",
      "text-white",
      "text-[#f472b6]",
    ];

    const NightSkyAIMagicButton = () => (
      <div className="relative flex items-center justify-center w-full h-full">
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-90 shadow-2xl animate-pulse"
          style={{
            background: `radial-gradient(circle at 60% 40%, #0c4a6e, #0891b2 70%, #22d3ee 100%)`,
          }}
        />
        <Sparkles
          className="h-20 w-20 drop-shadow-2xl animate-spin-smooth relative z-10 text-primary"
          strokeWidth={3.5}
          style={{
            filter:
              "drop-shadow(0 0 24px text-secondary) drop-shadow(0 0 12px text-secondary) text-secondary",
          }}
        />
        {orbitColors.map((color, i) => (
          <Sparkles
            key={i}
            className={`absolute z-20 ${color} opacity-90 animate-sparkle-shine`}
            style={{
              left: `${
                50 + 44 * Math.cos((i / orbitColors.length) * 2 * Math.PI)
              }%`,
              top: `${
                50 + 44 * Math.sin((i / orbitColors.length) * 2 * Math.PI)
              }%`,
              width: "18px",
              height: "18px",
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.13}s`,
            }}
          />
        ))}
      </div>
    );

    return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTitle />
        <DialogContent className="max-w-lg sm:max-w-xl lg:max-w-2xl overflow-hidden border-0 shadow-2xl">
          <div
            className={`p-8 space-y-3 ${
              isGenerating ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-start gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl sm:text-xl font-bold text-gray-900 leading-tight">
                  Generate Your Personal Brand Content
                </h2>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name"
                            disabled={isGenerating}
                            className="h-12 text-base transition-all duration-200 border-gray-200 hover:border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Handle/Role
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="social-handle/role"
                            disabled={isGenerating}
                            className="h-12 text-base transition-all duration-200 border-gray-200 hover:border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="whatDoYouOffer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        What do you offer?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Personal branding design services and LinkedIn content creation"
                          disabled={isGenerating}
                          className="h-12 text-base transition-all duration-200 border-gray-200 hover:border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whoDoYouHelp"
                  render={({ field }) => (
                    <FormItem className="relative">
                      {isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 rounded-lg">
                          <NightSkyAIMagicButton />
                        </div>
                      )}
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Who do you help?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Entrepreneurs and professionals who want to build their personal brand online"
                          disabled={isGenerating}
                          className="h-12 text-base transition-all duration-200 border-gray-200 hover:border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="relative w-full">
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span
                      className={
                        isGenerating ? "opacity-0" : "flex items-center"
                      }
                    >
                      <Sparkles className="mr-3 h-5 w-5" />
                      Generate Content
                    </span>
                  </Button>
                </div>

                <div className="pt-0">
                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    We&apos;ll create personalized social media content based on
                    your answers.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

AITextGeneratorDialog.displayName = "AITextGeneratorDialog";

export default AITextGeneratorDialog;
