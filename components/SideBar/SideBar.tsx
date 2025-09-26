"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AuthDialog, { AuthDialogHandle } from "../Auth/AuthDialog";

// import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import UserMenuPopup from "./components/UserMenuPopup";
import { usePostHog } from "posthog-js/react";
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
import useApi from "@/lib/api";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { useBrandContext } from "@/contexts/BrandContext";
import { toast } from "sonner";
import { loadBrandFonts } from "@/lib/fonts";
import CreateBrandDialog, {
  CreateBrandDialogHandle,
} from "@/components/DashboardControl/components/CreateBrandDialog";
import { defaultBrand } from "@/contexts/BrandContext/helpers/initialState";
import { ChevronUp, LogOut } from "lucide-react";
import { useUpsertBrand } from "@/hooks/brand";
import { omit } from "lodash";

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
    refreshAuth,
  } = useAppContext();
  const router = useRouter();
  const api = useApi();
  const {
    state: { brands, brand },
    setBrand,
  } = useBrandContext();
  const [upsertBrand, { loading: upsertLoading }] = useUpsertBrand();

  const authDialogRef = useRef<AuthDialogHandle>(null);
  const createBrandDialogRef = useRef<CreateBrandDialogHandle>(null);

  useEffect(() => {
    if (brand?.id) {
      const typography = {
        primaryFont: brand?.config.typography?.primaryFont,
        secondaryFont: brand?.config.typography?.secondaryFont,
        highlightFont: brand?.config.typography?.highlightFont,
      };
      loadBrandFonts(typography);
    }
  }, [brand]);

  // Initialize with first brand if no brand is selected
  useEffect(() => {
    router.prefetch("/app/brand-setup");
    if (brands && brands.length > 0 && !brand?.id) {
      const firstBrand = brands[0];
      setBrand(firstBrand);
    }
  }, [brands]);

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
    try {
      const response = await api.post("/auth/logout");

      if (response.success) {
        // Clear temp data

        // Refresh auth state
        await refreshAuth();

        // Redirect to home page
        window.location.href = "/auth";
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear localStorage and refresh
      localStorage.removeItem("tempUserId");
      window.location.reload();
    }
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

  const handleCreateBrandSubmit = async (brandName: string) => {
    try {
      const newBrand = {
        ...defaultBrand,
        name: brandName,
      };

      const brandToCreate = omit(newBrand, "id");

      await upsertBrand(brandToCreate);

      toast.success("Brand created successfully!");

      router.push(`/app/brand-setup`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create brand: ${errorMessage}`);
      throw error;
    }
  };

  return (
    <>
      <AuthDialog ref={authDialogRef} />
      <CreateBrandDialog
        ref={createBrandDialogRef}
        onSubmit={handleCreateBrandSubmit}
        loading={upsertLoading}
      />

      <div className="flex flex-col gap-1 h-full">
        <div className="h-[68px] bg-[#FCFCFC] rounded-[16px] flex items-center justify-between">
          <div className="w-full p-3">
            {HeaderContent ? (
              HeaderContent
            ) : (
              <Link
                href="/app/design-templates/social-banner"
                className="cursor-pointer"
                prefetch={true}
              >
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
                <div className="w-full p-4 space-y-3 ">
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
                      <div className="flex gap-2">
                        <span className="text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                          {getUserDisplayName()}
                        </span>
                        {/* <span className="text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis block">
                        {getUserEmail()}
                      </span> */}
                        {/* {dropdownOpen ? ( */}
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                        {/* ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )} */}
                      </div>
                      <span className="text-xs text-gray-500">
                        {/*  {hasProPlan ? "Pro Plan" : "Free Plan"} */}
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
