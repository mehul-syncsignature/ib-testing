// modules/Brand/components/BrandControls/components/AiMagicControl.tsx
"use client";

import { useRef } from "react";
import AITextGeneratorDialog from "@/components/AITextGeneratorDialog";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { AITextGeneratorDialogHandle } from "@/components/AITextGeneratorDialog/AITextGeneratorDialog";

const AiMagicControl = () => {
  const aiTextGeneratorDialogRef = useRef<AITextGeneratorDialogHandle>(null);

  return (
    <>
      <AITextGeneratorDialog ref={aiTextGeneratorDialogRef} />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4" />{" "}
          <span className="font-medium text-sm">AI MAGIC</span>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => aiTextGeneratorDialogRef.current?.open()}
        >
          Generate with AI
        </Button>
      </div>
    </>
  );
};

export default AiMagicControl;
