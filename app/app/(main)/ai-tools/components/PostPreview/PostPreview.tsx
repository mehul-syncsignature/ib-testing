import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, RotateCcw, Sparkles } from "lucide-react";
import { PostHook } from "@/hooks/post";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StepBar from "../StepBar";
import HookCard from "../HookCard";
import LinkedInPostPreview from "../LinkedInPostPreview";
import LinkedInPostsGrid from "../LinkedInPostsGrid";
import { useAssetContext } from "@/contexts/AssetContext";
import { useRouter, useSearchParams } from "next/navigation";

interface AIPostGeneratorProps {
  step: number;
  setStep: (step: number) => void;
  selectedHookId: number | string | null;
}

const PostPreview = ({
  step,
  setStep,
  selectedHookId,
}: AIPostGeneratorProps) => {
  const {
    state: { posts },
  } = useAssetContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [toolType, setToolType] = useState<"AI Writer" | "AI Image Library">(
    "AI Writer"
  );
  const [contentType, setContentType] = useState<"Topic" | "Blog">("Topic");

  // Get post ID from URL params and find the post
  const postId = searchParams.get("pid");
  const currentPost = postId ? posts.find((post) => post.id === postId) : null;

  // Get hooks from localStorage
  const getStoredHooks = (): PostHook[] => {
    try {
      const stored = localStorage.getItem("generatedHooks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const storedHooks = getStoredHooks();

  const handleAddVisuals = () => {
    router.push(`design-templates/social-carousel?pid=${postId}`);
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
                <ImageIcon />
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
                onValueChange={(value) => {
                  if (step === 1) {
                    setContentType(value as "Topic" | "Blog");
                  }
                }}
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
                disabled={step !== 1}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none outline-none"
                placeholder={`Describe your ${contentType.toLowerCase()} idea here...`}
              />
            </div>

            {/* Selected Hook */}
            <div className="mb-6">
              {storedHooks.length > 0
                ? storedHooks
                    .filter((hook) => selectedHookId === hook.id)
                    .map((hook) => (
                      <HookCard
                        key={hook.id}
                        id={hook.id}
                        data={hook.hook}
                        isSelected={selectedHookId === hook.id}
                        name="hookSelection"
                        onSelect={() => {}}
                      />
                    ))
                : selectedHookId === "default-hook" && (
                    <HookCard
                      id="default-hook"
                      data="Ready to transform your personal brand? Here are 3 game-changing strategies that will set you..."
                      isSelected={selectedHookId === "default-hook"}
                      name="hookSelection"
                    />
                  )}
            </div>

            {/* Generate Post Button */}
            <div className="mb-6 flex gap-2 w-full">
              <div className="flex-1">
                <Button
                  onClick={() => setStep(1)}
                  className="w-full bg-[#ffffff] border-1 border-primary text-primary font-medium py-3"
                >
                  <RotateCcw />
                  Restart
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  onClick={() => {}}
                  className="w-full bg-primary hover:bg-[#1a6b75] text-white font-medium py-3 "
                >
                  Done
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Button
                onClick={handleAddVisuals}
                className="w-full bg-primary hover:bg-[#1a6b75] text-white font-medium py-3 "
              >
                Add Visual/Photo to Post
              </Button>
            </div>
          </div>

          {/* Right Side - Preview Card */}
          <div className="w-1/2 items-center h-[90%]">
            <div className="w-full h-full rounded-lg bg-[#F3F5F6] p-6 overflow-y-auto">
              <div className="h-full flex justify-center">
                {posts.length > 0 && (
                  currentPost ? (
                    <div className="w-full max-w-lg">
                      <LinkedInPostPreview
                        content={currentPost.content || ""}
                        imageUrl={currentPost.imageUrl || ""}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <LinkedInPostsGrid 
                      posts={posts.map(post => ({
                        id: post.id,
                        content: post.content || "",
                        imageUrl: post.imageUrl || "",
                      }))}
                      className="w-full"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
