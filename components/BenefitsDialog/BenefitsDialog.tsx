// components/BenefitsDialog/BenefitsDialog.tsx

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import { fetchAwsAsset } from "@/lib/aws-s3";

export interface BenefitsDialogHandle {
  open: () => void;
  close: () => void;
  setUpgradeCallback: (callback: () => void) => void;
}

interface BenefitsDialogProps {
  isSignedIn?: boolean;
}

const BenefitsDialog = forwardRef<BenefitsDialogHandle, BenefitsDialogProps>(
  ({ isSignedIn = false }, ref) => {
    const [open, setOpen] = useState(false);
    const [upgradeCallback, setUpgradeCallback] = useState<(() => void) | null>(null);
    const posthog = usePostHog();

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      setUpgradeCallback: (callback: () => void) => setUpgradeCallback(() => callback),
    }));

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
        location: "benefits_dialog",
        button_text: "UPGRADE NOW FOR $9",
        price: 9,
        currency: "USD",
        is_signed_in: isSignedIn,
      });

      // Call the configured upgrade callback
      if (upgradeCallback) {
        upgradeCallback();
      }
      
      // Close the dialog
      setOpen(false);
    };

    const handleMaybeLater = () => {
      posthog?.capture("maybe_later_button_clicked", {
        location: "benefits_dialog",
        is_signed_in: isSignedIn,
      });
      
      setOpen(false);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle />
        <DialogContent className="max-w-[25vw] h-fit p-0 overflow-hidden border-0 outline-none min-w-[400px]">
          <div className="relative">
            <div className="top-[21vh] left-[14vw] absolute w-full h-full z-[-10]">
              <Image
                src={fetchAwsAsset("signup-vector", "png")}
                width={210}
                height={210}
                alt="Background vector"
              />
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg">
              {/* Header */}
              <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center mb-6">
                <Image
                  src={fetchAwsAsset("IB-icon", "png")}
                  width={100}
                  height={100}
                  alt="InstantBranding Logo"
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Unlock Your Full Brand Potential
              </h1>
              
              <p className="text-sm text-gray-500 mb-6 text-center">
                Get access to premium features and create professional designs instantly
              </p>

              {/* Benefits List */}
              <div className="w-full mb-6">
                <div className="grid grid-cols-1 gap-3">
                  {proBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <Button 
                  onClick={handleUpgradeClick}
                  className="w-full h-11 text-sm font-semibold bg-primary hover:bg-primary/90"
                >
                  UPGRADE NOW FOR $9
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleMaybeLater}
                  className="w-full h-11 text-sm text-gray-500 hover:text-gray-700"
                >
                  Maybe Later
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center mt-4">
                One-time payment. Cancel anytime.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

BenefitsDialog.displayName = "BenefitsDialog";

export default BenefitsDialog;