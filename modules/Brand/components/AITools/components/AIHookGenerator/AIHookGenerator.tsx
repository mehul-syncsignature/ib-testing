/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Image, Sparkles } from "lucide-react";
import { useGenerateHooks } from "@/hooks/post";
import StepBar from "../StepBar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AIHookGeneratorProps {
  step: number;
  setStep: (step: number) => void;
}

const AIHookGenerator = ({ step, setStep }: AIHookGeneratorProps) => {
  const [toolType, setToolType] = useState<"AI Writer" | "AI Image Library">(
    "AI Writer"
  );
  const [contentType, setContentType] = useState<"Topic" | "Blog">("Topic");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [generateHooks, { loading, error }] = useGenerateHooks();

  const handleGenerateHooks = async () => {
    if (!ideaDescription.trim()) return;

    try {
      const hooks = await generateHooks(ideaDescription);
      // Store hooks in localStorage
      localStorage.setItem("generatedHooks", JSON.stringify(hooks));
      setStep(2);
    } catch {
      // Error is already handled by the hook
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-[#FCFCFC] rounded-lg h-full p-6 w-full">
        <div className="flex justify-center pb-6">
          <Tabs
            value={toolType}
            onValueChange={(value) =>
              setToolType(value as "AI Writer" | "AI Image Library")
            }
          >
            <TabsList className="border-1 border-[#E8EDED] w-[291px] h-[49px] rounded-4xl p-1">
              <TabsTrigger value="AI Writer" className="rounded-4xl gap-4">
                <Sparkles />
                AI Writer
              </TabsTrigger>
              <TabsTrigger
                value="AI Image Library"
                className="rounded-4xl gap-2 px-4"
              >
                <Image />
                AI Image Library
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex gap-8 h-full w-full">
          {/* Left Side - Content Creation Form */}
          <div className="w-1/2 h-full">
            <div className="mb-6">
              <StepBar currentStep={step} />
            </div>

            {/* What would you like to create? */}
            <div className="mb-6">
              <label
                htmlFor="idea-description"
                className="block text-xs font-normal text-[#666666] mb-1.5"
              >
                WHAT WHOULD YOU LIKE TO CREATE?
              </label>
              <Tabs
                value={contentType}
                onValueChange={(value) =>
                  setContentType(value as "Topic" | "Blog")
                }
              >
                <TabsList className="w-[208px] h-[41px] rounded-xl p-1">
                  <TabsTrigger value="Topic">Topic</TabsTrigger>
                  <TabsTrigger value="Blog">Blog</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Describe your idea */}
            <div className="mb-6">
              <Label
                htmlFor="idea-description"
                className="block text-xs font-normal text-[#666666] mb-1.5"
              >
                DESCRIBE YOUR IDEA
              </Label>
              <Textarea
                id="idea-description"
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none outline-none"
                placeholder={`Describe your ${contentType.toLowerCase()} idea here...`}
              />
            </div>

            {/* Generate Post Button */}
            <div className="mb-6 flex gap-2 w-full">
              <div className="flex-1">
                <Button
                  onClick={handleGenerateHooks}
                  disabled={!ideaDescription.trim() || loading}
                  className="w-full bg-primary hover:bg-[#1a6b75] text-white font-medium py-3 "
                >
                  Continue <ArrowRight />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Preview Card */}
          <div className="w-1/2 items-center h-[92%]">
            <div className="w-full h-full rounded-lg bg-[#F3F5F6] p-4">
              <div className="pb-4 font-normal text-xs text-gray-500 w-full h-full">
                {loading ? (
                  "GENERATING HOOKS..."
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="flex-col flex items-center gap-2">
                      <img
                        src="./assets/logo.svg"
                        alt="logo image"
                        height={40}
                        width={40}
                      />
                      <span className="font-medium text-[16px] text-[#87D7D9]">
                        Your Posts Will Appear Here
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-full overflow-y-auto space-y-4">
                {loading && (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading hooks...</div>
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
                    Failed to generate hooks. Please try again.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHookGenerator;
