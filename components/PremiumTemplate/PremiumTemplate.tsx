// components/PremiumTemplate/PremiumTemplate.tsx - Simplified
"use client";

import React from "react";
import { Crown } from "lucide-react";
import { useUserAccessChecks } from "@/hooks/user";

interface PremiumTemplateProps {
  children: React.ReactNode;
  templateId: number;
  assetType: string;
  onClick?: () => void;
  className?: string;
}

const PremiumTemplate: React.FC<PremiumTemplateProps> = ({
  children,
  templateId,
  assetType,
  onClick,
  className = "",
}) => {
  const { hasAccessToTemplate } = useUserAccessChecks();

  const showPremiumBadge = !hasAccessToTemplate(templateId, assetType);

  return (
    <div className={`relative group ${className}`} onClick={onClick}>
      {showPremiumBadge && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-white text-primary px-2 py-0.5 rounded-bl-sm text-xs font-bold flex items-center shadow-sm">
            <Crown size={10} className="mr-1" />
            Premium
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default PremiumTemplate;
