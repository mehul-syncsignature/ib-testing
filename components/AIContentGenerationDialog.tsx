"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAIContentGeneration } from "@/hooks/useAIContentGeneration";
import { useAssetContext } from "@/contexts/AssetContext";
import { Loader2, Sparkles, X } from "lucide-react";

// Updated Zod schema - only numberOfSlides for carousel
const formSchema = z.object({
  numberOfSlides: z.number().min(1).max(10).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface AIContentGenerationDialogHandle {
  open: () => void;
  close: () => void;
}

const AIContentGenerationDialog = forwardRef<AIContentGenerationDialogHandle>(
  (_, ref) => {
    const [open, setOpen] = useState(false);

    const {
      state: { currentAssetType, slides },
    } = useAssetContext();

    const { generateAIContent, loading, error, isCarousel } =
      useAIContentGeneration();

    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
    });

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true);
      },
      close: () => {
        setOpen(false);
        // Reset form state
        setKeywords([]);
        setKeywordInput("");
        form.reset();
      },
    }));

    const addKeyword = () => {
      if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
        setKeywordInput("");
      }
    };

    const removeKeyword = (keyword: string) => {
      setKeywords(keywords.filter((k) => k !== keyword));
    };

    const onSubmit = async () => {
      // Validate that at least one keyword is provided
      if (keywords.length === 0) {
        // You could set a custom error state here if needed
        return;
      }

      try {
        await generateAIContent({
          assetType: currentAssetType,
          keywords,
          numberOfSlides: slides.length,
        });

        // Close dialog on success
        setOpen(false);

        // Reset form (keywords and the form itself)
        setKeywords([]);
        setKeywordInput("");
        form.reset();
      } catch {
        // Error is handled by the useAIContentGeneration hook
      }
    };

    const handleClose = () => {
      setOpen(false);
      // Reset form state
      setKeywords([]);
      setKeywordInput("");
      form.reset();
    };

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate AI Content
            </DialogTitle>
            <DialogDescription>
              Generate AI-powered content for your{" "}
              {currentAssetType.replace("-", " ")} template using keywords.
              {isCarousel && " Specify the number of slides to generate."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Keywords Section (Required) */}
              <div className="space-y-3">
                <FormLabel>Keywords *</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Enter a keyword..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    Add
                  </Button>
                </div>

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <div
                        key={keyword}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                      >
                        {keyword}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-primary/20"
                          onClick={() => removeKeyword(keyword)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {keywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add at least one keyword to generate content.
                  </p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error.message}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || keywords.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

AIContentGenerationDialog.displayName = "AIContentGenerationDialog";

export default AIContentGenerationDialog;
