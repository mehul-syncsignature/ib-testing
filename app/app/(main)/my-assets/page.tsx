"use client";

import React, { useState } from "react";
import { SavedDesignsGrid } from "./components/SavedDesignsGrid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssetContext } from "@/contexts/AssetContext";
import LinkedInPostPreview from "../ai-tools/components/LinkedInPostPreview";
import { useRouter } from "next/navigation";

const MyAssets = () => {
  const {
    state: { designs, posts },
  } = useAssetContext();

  const router = useRouter();

  const [assetMode, setAssetMode] = useState<"Templates" | "Captions/Post">(
    "Templates"
  );

  const handlePostOnClick = (id: string) => {
    router?.push(`/app/ai-tools?pid=${id}`);
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg h-full p-6 flex flex-col">
        <div className="flex justify-center pb-6">
          <Tabs
            value={assetMode}
            onValueChange={(value) =>
              setAssetMode(value as "Templates" | "Captions/Post")
            }
          >
            <TabsList className="border-1 border-[#E8EDED] w-[291px] h-[49px] rounded-4xl p-1 select-none">
              <TabsTrigger
                value="Templates"
                className="rounded-4xl cursor-pointer"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="Captions/Post"
                className="rounded-4xl cursor-pointer"
              >
                Captions/Post
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {assetMode === "Templates" ? (
            <div>
              <p className="text-gray-600 mb-6">
                Browse and manage your saved templates across all asset types.
              </p>
              <SavedDesignsGrid designs={designs} />
            </div>
          ) : (
            <div className="text-gray-600 ">
              <p>Preview your captions and posts with your brand styling.</p>
              <div className="mt-8 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 bg-[#F1F3F3] rounded-lg p-6">
                  {posts?.map((p) => (
                    <div key={p.id} onClick={() => handlePostOnClick(p.id)}>
                      <LinkedInPostPreview
                        content={p.content || ""}
                        imageUrl={p.imageUrl}
                      />
                    </div>
                  ))}
                  {/* <TemplateCard
                    type="social-post"
                    templateNumber={1}
                    customContent="Transform your LinkedIn presence with AI-powered content creation"
                  />
                </div>
                <div className="relative bg-[#F1F3F3] rounded-lg overflow-hidden h-80">
                  <TemplateCard
                    type="quote-card"
                    templateNumber={1}
                    customContent="Success is not final, failure is not fatal: it is the courage to continue that counts."
                  />
                </div>
                <div className="relative bg-[#F1F3F3] rounded-lg overflow-hidden h-80">
                  <TemplateCard
                    type="featured-post"
                    templateNumber={1}
                    customContent="Unlock the power of personal branding with our latest tools and features"
                  /> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAssets;
