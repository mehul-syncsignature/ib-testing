// components/Auth/components/SignUp/components/BenefitsView.tsx

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import React from "react";
import { fetchAwsAsset } from "@/lib/aws-s3";

interface BenefitsViewProps {
  onSignUpClick: () => void;
  onSignInClick: () => void;
  isSignedIn: boolean;
}

const BenefitsView = ({
  onSignUpClick,
  onSignInClick,
  isSignedIn,
}: BenefitsViewProps) => {
  const posthog = usePostHog();

  // const freeBenefits = [
  //   "Download edited assets",
  //   "Save your brand settings",
  //   "Customize templates with ease",
  // ];

  const proBenefits = [
    "Your own visual identity kit",
    "Premium templates",
    "Unlimited downloads",
    "Advanced visual editor",
    "Access to all styles",
    "Remove image background",
  ];

  const handleUpgradeClick = () => {
    // Track PostHog event for the upgrade button
    posthog?.capture("upgrade_now_button_clicked", {
      location: "benefits_view",
      button_text: "UPGRADE NOW FOR $9",
      price: 15,
      currency: "USD",
      is_signed_in: isSignedIn,
    });

    // Call the original onClick handler
    onSignUpClick();
  };

  return (
    <div className="relative ">
      <div className="top-[21vh] left-[14vw] absolute w-full h-full z-[-10]">
        <Image
          src={fetchAwsAsset("signup-vector", "png")}
          width={210}
          height={210}
          alt="Background vector"
        />
      </div>

      <div className="relative p-6 pb-4">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
          <Image
            src={fetchAwsAsset("IB-icon", "png")}
            width={100}
            height={100}
            alt="Logo"
          />
        </div>

        <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
          DOWNLOAD BRAND ASSETS
        </h2>
        <div
          className="text-[16px] leading-relaxed"
          style={{ color: "#666666" }}
        >
          <span className="text-5xl text-black font-bold mx-2">$9</span>
          <span className="text-gray-500 text-sm">/ per month</span>
          <span className="text-gray-500 text-sm"> (billed annually)</span>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">
            What you get with a free account:
          </h3>
          <div className="space-y-2">
            {freeBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-[16px]" style={{ color: "#666666" }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">
            Get lifetime access to:
          </h3>
          <div className="space-y-2">
            {proBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-[16px]" style={{ color: "#666666" }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleUpgradeClick} className="w-full">
          UPGRADE NOW
        </Button>
      </div>
      {!isSignedIn && (
        <div className="px-8 py-3 bg-[#FCFCFC] border-t border-[#E1E3E3] h-[80px] flex items-center justify-center">
          <p className="text-center text-[16px]" style={{ color: "#666666" }}>
            If you already have an account,{" "}
            <span
              className="text-teal-600 font-medium hover:text-teal-700 cursor-pointer"
              onClick={onSignInClick}
            >
              Log In
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BenefitsView;
