"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export const GuidedSelectionHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");

  if (!pid) return null;

  const handleBack = () => {
    // Navigate back to the AI tools post preview
    router.back();
  };

  return (
    <motion.div
      className="mb-6 bg-card rounded-lg p-3 border"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Creating visual for your post</h3>
            <p className="text-sm text-muted-foreground">
              Choose a template to customize and add to your LinkedIn post
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>
    </motion.div>
  );
};