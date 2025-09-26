"use client";

import React, { ReactNode, RefObject } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { AuthDialogHandle } from "@/components/Auth/AuthDialog";

interface PublicSideBarProps {
  mainContent: ReactNode | React.JSX.Element;
  HeaderContent?: ReactNode;
  showFooter?: boolean;
  authDialogRef?: RefObject<AuthDialogHandle | null>;
}

const PublicSideBar: React.FC<PublicSideBarProps> = ({
  authDialogRef,
  mainContent,
  showFooter,
  HeaderContent,
}) => {
  const posthog = usePostHog();
  const {
    state: { currentUser, isPremiumUser, isSignedIn },
  } = useAppContext();

  // Check if user has pro plan
  // const showUpgradeButton = isSignedIn && !isPremiumUser;

  const handleSignUp = () => {
    if (isSignedIn) {
      window.location.href = "/app/design-templates/social-banner";
    } else {
      posthog?.capture("download_brand_assets_clicked", {
        location: "Publicsidebar",
        user_type: isSignedIn ? "authenticated" : "anonymous",
        is_premium: isPremiumUser,
        user_id: currentUser?.id,
      });

      authDialogRef?.current?.setAuthView("signUp");
      authDialogRef?.current?.open();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1 h-full">
        <div className="h-[68px] bg-[#FCFCFC] rounded-[16px] flex items-center justify-between">
          <div className="w-full p-3">
            {HeaderContent ? (
              HeaderContent
            ) : (
              <Link href="/" className="cursor-pointer" prefetch={true}>
                <Image
                  src={fetchAwsAsset("instantBranding", "png")}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                />
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-[#FCFCFC] rounded-[16px] h-[calc(100%_-_70px)] overflow-hidden">
          <div className="flex-grow overflow-auto scrollbar-thin-custom">
            {mainContent}
          </div>

          {showFooter && (
            <div className="border-t border-[#E8EDED] mt-auto">
              <div className="p-4 flex flex-col gap-2">
                <Button className="w-full" onClick={handleSignUp}>
                  DOWNLOAD BRAND ASSETS
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicSideBar;
