// app/onboarding/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAppContext } from "@/contexts/AppContext";
import { useAssetContext } from "@/contexts/AssetContext";
import { ImageUploadField } from "@/modules/ControlPanel/components/form-fields/ImageUploadField";
import { useUpdateUser, useUserDependencies } from "@/hooks/user";
import { toast } from "sonner";
import Link from "next/link";
import {
  ColorOption,
  ColorTrio,
  colorTrios,
} from "@/modules/Brand/components/BrandControls/components/ColorPaletteDropdown";
import { useBrandContext } from "@/contexts/BrandContext";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { Public_Sans } from "next/font/google";
import Image from "next/image";
import ImageViewer from "@/components/DraggerWithCrop/ImageViewer";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const onboardingSchema = z.object({
  name: z.string().min(2, "Invalid name"),
  socialHandle: z.string().optional(),
  imageUrl: z.string().optional(),
  selectedTrioName: z.string().min(1, "Please select a color trio."),
  // New questions
  whatDoYouDo: z.string().optional(),
  whoDoYouHelp: z.string().optional(),
  // Social Links
  linkedinUrl: z
    .string()
    .optional()
    .refine(
      (url) => {
        if (url === "") {
          return true; // Allow empty string if optional
        } else {
          const linkedinRegex =
            /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+(\/|\?.*)?$/;
          return linkedinRegex.test(url!);
        }
      },
      {
        message: "Please enter a valid LinkedIn profile URL.", // Custom error message
      }
    ),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const OnboardingPage = () => {
  const router = useRouter();

  const {
    state: { dataConfig },
    setDataConfig,
  } = useAssetContext();

  const {
    state: { currentUser },
  } = useAppContext();

  useEffect(() => {
    if (currentUser && currentUser.onboardingStatus === "COMPLETE") {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const {
    state: { brand },
    setBrand,
  } = useBrandContext();

  const [updateUser, { loading: updateLoading }] = useUpdateUser();
  const [handleUserDependencies, { loading: dependenciesLoading }] =
    useUserDependencies();

  const desiredTrioNames = [
    "Urban Slate",
    "Ocean Deep",
    "Royal Velvet",
    "Forest Depths",
    "Spring Lime",
    "Honey Meadow",
    "Amber Glow",
    "Coffee Bean",
    "Clay Earth",
  ];

  const filteredTrios = [];

  for (const desiredName of desiredTrioNames) {
    const foundTrio = colorTrios.find((trio) => trio.name === desiredName);
    if (foundTrio) {
      filteredTrios.push(foundTrio);
    }
  }
  const trioRows: ColorTrio[][] = [filteredTrios];

  // Sample brand showcase images for the 3D marquee
  // const showcaseImages = Array.from({ length: 32 }, (_, i) =>
  //   fetchAwsAsset(`onboarding-cover-${i + 1}`, "png")
  // );

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`,
      socialHandle: "",
      imageUrl: "",
      selectedTrioName: filteredTrios.length > 0 ? filteredTrios[0].name : "",
      // New default values
      whatDoYouDo: "",
      whoDoYouHelp: "",
      // Social links default values
      linkedinUrl: "",
    },
  });

  useEffect(() => {
    if (currentUser?.firstName) {
      form.setValue("name", currentUser.firstName);
      form.setValue("socialHandle", `@${currentUser.firstName}`);
    }
  }, [currentUser, form]);

  useEffect(() => {
    router.prefetch("/brand-setup");
    router.prefetch("/dashboard");
  }, [router]);

  const onSubmit = async (formData: OnboardingFormData) => {
    try {
      // Find the selected color trio based on the name from the form
      const selectedColorTrio = colorTrios.find(
        (trio) => trio.name === formData.selectedTrioName
      );

      if (!selectedColorTrio) {
        toast.error("Selected color trio not found.");
        return;
      }

      const newOriginalColors = {
        primaryColor: selectedColorTrio?.colors[1].value,
        secondaryColor: selectedColorTrio?.colors[0].value,
        highlightColor: selectedColorTrio?.colors[2].value,
        textColor: "#FFFFFF",
      };

      await updateUser({
        firstName: formData.name,
        profileUrl: fetchAwsAsset("dummy", "png"),
        onboardingStatus: "COMPLETE",
      });

      setDataConfig({
        ...dataConfig,
      });

      const newBrand = {
        ...brand,
        name: `${formData.name}'s brand`,
        config: {
          ...brand.config,
          colors: newOriginalColors,
          originalColors: newOriginalColors,
        },
        infoQuestions: {
          whatDoYouDo: formData.whatDoYouDo,
          whoDoYouHelp: formData.whoDoYouHelp,
        },
        brandMark: {
          ...brand.brandMark,
          name: formData.name,
          socialHandle: formData.socialHandle || "@jamescarter",
          headshotUrl:
            formData.imageUrl ||
            "https://assets.dev.instantbranding.ai/dummy.png",
          // website: brand.brandMark?.website || "",
          // logoUrl: brand.brandMark?.logoUrl || "",
        },
        socialLinks: {
          ...brand.socialLinks,
          ...(formData.linkedinUrl && { linkedin: formData.linkedinUrl }),
        },
      };

      setBrand(newBrand);

      await handleUserDependencies(newBrand);

      // Navigate to brand setup
      window.location.href = "/brand-setup";
    } catch (error) {
      // Handle error
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating user:", error);
    }
  };

  const [removeBackground, setRemoveBackground] = useState<boolean>(true);

  const handleRemoveBackground = (checked: boolean) => {
    setRemoveBackground(checked);
  };

  const watch = form.watch();

  const currentSelectedTrioName = form.watch("selectedTrioName");

  const getColorStyle = (color: ColorOption) => ({
    backgroundColor: color.value,
  });

  return (
    <main
      className={`min-h-screen w-full grid grid-cols-2 ${publicSans.className}`}
      style={{
        background:
          "radial-gradient(71.48% 71.48% at 50% 50%, rgba(31, 140, 155, 0.2) 0%, rgba(31, 140, 155, 0) 100%), #FFFFFF",
      }}
    >
      {/* Left Column: Form */}
      <div className="w-full overflow-y-auto flex justify-center p-10 max-h-screen">
        <div className="w-full max-w-xl content-center">
          {/* Header */}
          <div className="w-full text-left">
            <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center mb-6">
              <Image
                src={fetchAwsAsset("IB-icon", "png")}
                width={100}
                height={100}
                alt="Logo"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-[0.62rem]">
              Let&apos;s Get Started
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Let&apos;s start by creating your own personalized brand profile.
              This will be used to generate unique custom content for your
              brand.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Handle Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NAME</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Flora" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HANDLE / ROLE</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. @flora_schmitt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Field */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPLOAD YOUR IMAGE</FormLabel>
                    {form.watch("imageUrl") ? (
                      <ImageViewer
                        imageUrl={form.getValues("imageUrl")}
                        onRemove={() => form.setValue("imageUrl", "")}
                      />
                    ) : (
                      <FormControl>
                        <ImageUploadField
                          name="imageUrl"
                          form={form}
                          watch={watch}
                          data={{ 
                            imageUrl: field.value || "",
                            showBrandMark: false // Default value for onboarding
                          }}
                          bucketName="dropzone-upload"
                          onUploadComplete={(url) => {
                            form.setValue(field.name, url);
                          }}
                          removeBackground={removeBackground}
                          setRemoveBackground={handleRemoveBackground}
                          isAdjustablePosition={false}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Trio Selection Field */}
              <FormField
                control={form.control}
                name="selectedTrioName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CHOOSE YOUR BRAND COLOR</FormLabel>
                    <FormControl>
                      <div className="flex justify-between gap-[0.5rem] sm:gap-2">
                        {trioRows[0]?.map((trio, trioIndex) => {
                          const isSelected =
                            currentSelectedTrioName === trio.name;
                          const primaryColor = trio.colors[1];

                          if (!primaryColor) return null;

                          return (
                            <button
                              type="button"
                              key={trioIndex}
                              onClick={() => field.onChange(trio.name)}
                              className={`flex rounded hover:opacity-80 transition-opacity cursor-pointer `}
                              title={trio.name}
                            >
                              <div
                                className={`w-[2.875rem] h-[2.875rem] rounded-[0.5rem]
                                ${
                                  isSelected
                                    ? "border-[#2F8992] border-1 rounded-[0.5rem] [box-shadow:_0_0_4px_0_#2F8992]"
                                    : ""
                                }`}
                                style={getColorStyle(primaryColor)}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Questions Section */}
              {/* <FormField
                control={form.control}
                name="whatDoYouDo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WHAT DO YOU DO?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. I’m a UX designer..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="whoDoYouHelp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WHO DO YOU HELP?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. I help startup founders..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Social Links Section */}
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LINKEDIN PROFILE</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. https://linkedin.com/in/flora_schmitt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={updateLoading || dependenciesLoading}
                className="w-full h-11 text-sm font-semibold mt-3"
              >
                {updateLoading || dependenciesLoading
                  ? "Creating..."
                  : "Create My Brand"}
              </Button>
            </form>
          </Form>

          {/* Terms Text */}
          <p className="text-xs text-gray-500 text-center mt-[1rem]">
            By continuing, you agree to our{" "}
            <span
              className="text-gray-800 hover:cursor-pointer"
              onClick={() =>
                (window.location.href = "https://instantbranding.ai/terms")
              }
            >
              Terms of Service{" "}
            </span>
            and
            <span
              className="text-gray-800 hover:cursor-pointer"
              onClick={() =>
                (window.location.href = "https://instantbranding.ai/privacy")
              }
            >
              {" "}
              Privacy Policy.
            </span>
          </p>
        </div>
      </div>

      {/* Right Column: 3D Marquee Showcase - Hidden on mobile and tablet */}
      {/* <div className="hidden h-full w-full relative xl:flex overflow-hidden">
        <ThreeDMarquee images={showcaseImages} className="absolute" />
      </div> */}
      <div
        className="hidden md:block bg-contain bg-[#2F8992] bg-bottom bg-no-repeat"
        style={{
          backgroundImage: `url(${fetchAwsAsset("signup-cover", "png")})`,
        }}
      />

      {/* Hidden prefetch links for better performance */}
      <div className="hidden">
        <Link href="/brand-setup" prefetch={true}>
          Brand Setup
        </Link>
        <Link href="/dashboard" prefetch={true}>
          Dashboard
        </Link>
      </div>
    </main>
  );
};

export default OnboardingPage;
