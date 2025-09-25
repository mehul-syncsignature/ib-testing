import React, { useState, useEffect } from "react";
import AIHookGenerator from "./components/AIHookGenerator";
import AIPostGenerator from "./components/AIPostGenerator";
import PostPreview from "./components/PostPreview";
// import LinkedInPostPreview from "./components/LinkedinPostPreview";

const AIToolsSection = () => {
  const [step, setStep] = useState(3);
  const [selectedHookId, setSelectedHookId] = useState<number | string | null>(
    1
  );

  useEffect(() => {
    const generatedHooks = localStorage.getItem("generatedHooks");
    if (generatedHooks) {
      try {
        const hooks = JSON.parse(generatedHooks);
        if (hooks && hooks.length > 0) {
          setStep(2);
        } else {
          setStep(1);
        }
      } catch (error) {
        console.error("Error parsing generatedHooks from localStorage:", error);
      }
    }
  }, []);

  const getComponent = () => {
    switch (step) {
      case 1:
        return <AIHookGenerator step={step} setStep={setStep} />;
      case 2:
        return (
          <AIPostGenerator
            setSelectedHookId={setSelectedHookId}
            selectedHookId={selectedHookId}
            step={step}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <PostPreview
            selectedHookId={selectedHookId}
            step={step}
            setStep={setStep}
          />
        );
      default:
        <AIHookGenerator step={step} setStep={setStep} />;
    }
  };

  return <div className="h-full w-full flex flex-col">{getComponent()}</div>;
};

export default AIToolsSection;
