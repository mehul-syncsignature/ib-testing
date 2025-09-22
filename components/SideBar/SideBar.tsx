"use client";

import React, { ReactNode, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AuthDialog, { AuthDialogHandle } from "../Auth/AuthDialog";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import UserMenuPopup from "./components/UserMenuPopup";
import { usePostHog } from "posthog-js/react";
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { fetchAwsAsset } from "@/lib/aws-s3";

interface SideBarProps {
  mainContent: ReactNode | React.JSX.Element;
  HeaderContent?: ReactNode;
  showFooter?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({
  mainContent,
  showFooter,
  HeaderContent,
}) => {
  const posthog = usePostHog();
  const {
    state: { currentUser, isPremiumUser, isSignedIn },
  } = useAppContext();
  const router = useRouter();

  const authDialogRef = useRef<AuthDialogHandle>(null);

  // Check if user has pro plan
  // const showUpgradeButton = isSignedIn && !isPremiumUser;

  const handleSignUp = () => {
    posthog?.capture("download_brand_assets_clicked", {
      location: "sidebar",
      user_type: isSignedIn ? "authenticated" : "anonymous",
      is_premium: isPremiumUser,
      user_id: currentUser?.id,
    });

    authDialogRef?.current?.setAuthView("signUp");
    authDialogRef?.current?.open();
  };

  const handleSignOut = async () => {
    router.push("/logout");
  };

  // Get user display name from currentUser or fallback
  const getUserDisplayName = () => {
    if (
      currentUser &&
      "firstName" in currentUser &&
      "lastName" in currentUser
    ) {
      if (currentUser.firstName && currentUser.lastName) {
        return `${currentUser.firstName} ${currentUser.lastName}`;
      }
      if (currentUser.firstName) {
        return currentUser.firstName;
      }
      if (currentUser.email) {
        return currentUser.email.split("@")[0];
      }
    }
    if (!isSignedIn) {
      return "Guest User";
    }
    return "User";
  };

  const getUserEmail = () => {
    if (currentUser && "email" in currentUser) {
      return currentUser.email || "";
    }
    return "";
  };

  return (
    <>
      <AuthDialog ref={authDialogRef} />

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
              {isSignedIn ? (
                <div className="w-full p-4 space-y-3">
                  {/* {showUpgradeButton && (
                    <Button
                      onClick={handleSignUp}
                      className="w-full bg-[#22808D] text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      DOWNLOAD BRAND ASSETS
                    </Button>
                  )} */}

                  <div className="flex items-center gap-3">
                    <UserMenuPopup
                      displayName={getUserDisplayName()}
                      email={getUserEmail()}
                      planLabel={
                        isPremiumUser ? "Pro Plan Monthly" : "Free Plan"
                      }
                      onSignOut={handleSignOut}
                      router={router}
                      hasProPlan={isPremiumUser}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                        {getUserDisplayName()}
                      </span>
                      <span className="text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis block">
                        {getUserEmail()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {/* {hasProPlan ? "Pro Plan" : "Free Plan"} */}
                      </span>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      className="p-2 rounded hover:bg-gray-100 transition cursor-pointer "
                      aria-label="Logout"
                      variant={"link"}
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-2">
                  <Button className="w-full" onClick={handleSignUp}>
                    DOWNLOAD BRAND ASSETS
                  </Button>
                  {/* <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleSignIn}
                  >
                    Log in
                  </Button> */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;
