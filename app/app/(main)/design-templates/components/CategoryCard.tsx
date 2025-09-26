// modules/Brand/components/BrandSection/components/CategoryCard.tsx

import { templateData } from "@/common/constants/template-data";
import {
  AssetType,
  TemplateWrapper,
} from "@/components/TemplateWrapper/TemplateWrapper";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { BadgeCheck, LinkedinIcon, Image as LucideImage } from "lucide-react";
import Image from "next/image";
import { getAllStylesByType, getTemplateData } from "../utils";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { getGradientStyle } from "@/common/constants/gradients";

interface CategoryCardProps {
  type: AssetTypeKeys;
  onClick?: (type: AssetType) => void;
  isActive?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  type,
  onClick,
  isActive = false,
}) => {
  const {
    state: {
      brand,
      brand: {
        config: {
          colors: { primaryColor, secondaryColor, highlightColor },
        },
        brandMark: { headshotGradient },
      },
    },
  } = useBrandContext();

  // Simple: Just get the first style for display
  const stylesObject = getAllStylesByType(type);
  const defaultData = templateData[type]["default"] || {};

  // Platform info lookup
  const platformInfo = {
    "social-banner": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Banner",
    },
    "social-post": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Post",
    },
    "quote-card": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Quote Card",
    },
    "featured-post": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Featured Post",
    },
    "mockup-post": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Mockup Post",
    },
    "textimg-post": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Text+Img Post",
    },
    "social-carousel": {
      icon: <LinkedinIcon size={20} className="text-[#0077B5]" />,
      label: "LinkedIn Social Carousel",
    },
  }[type] || {
    icon: <LucideImage size={20} className="text-gray-600" />,
    label: type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  };

  // Mockup map - social-banner is different, others use default post mockup
  const mockupMap: Record<string, ReactNode> = {
    "social-banner": (
      <div className="absolute w-full h-[128px] top-[20px] right-[-20px]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-gray-50 border border-[#EBEBEB]">
          <div className="h-[45%] bg-blue-100 overflow-hidden flex justify-center items-center">
            <div className="w-full h-full">
              <div
                style={{
                  transform: `scale(0.145)`,
                  transformOrigin: "top left",
                }}
              >
                {stylesObject[1] && (
                  <TemplateWrapper
                    assetType={type}
                    templateNumber={1}
                    data={defaultData}
                    style={stylesObject[1]}
                    brand={brand}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="relative px-3 pt-5 pb-2 bg-white h-[52%]">
            <div
              className="absolute -top-6 left-3 w-12 h-12 rounded-full overflow-hidden border-2 border-[#E6E8E8]"
              style={{
                background: getGradientStyle(
                  headshotGradient,
                  primaryColor,
                  secondaryColor,
                  highlightColor
                ),
              }}
            >
              <Image
                src={fetchAwsAsset("dummy", "png")}
                alt="Headshot"
                width={400}
                height={400}
                className="object-cover h-15"
                priority
              />
            </div>

            <div className="pt-3 space-y-1">
              <div className="w-[64px] h-1 bg-[#EBEBEB] rounded"></div>
              <div className="w-[51px] h-1 bg-[#EBEBEB] rounded"></div>
              <div className="w-[64px] h-1 bg-[#EBEBEB] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    "social-post": (
      <div className="absolute w-[70%] h-[250px] top-[15px] left-[15%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div
                className="w-6 h-6 rounded-full overflow-hidden border border-[#E6E8E8] mr-2"
                style={{
                  background: getGradientStyle(
                    headshotGradient,
                    primaryColor,
                    secondaryColor,
                    highlightColor
                  ),
                }}
              >
                <Image
                  src={fetchAwsAsset("dummy", "png")}
                  alt="Headshot"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow h-[120px]">
                <div className="w-[100%] h-[120px] bg-gray-100 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(0.09)`,
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject[2] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={defaultData}
                          style={stylesObject[2]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    "quote-card": (
      <div className="absolute w-[70%] h-[250px] top-[15px] left-[15%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div
                className="w-6 h-6 rounded-full overflow-hidden border border-[#E6E8E8] mr-2"
                style={{
                  background: getGradientStyle(
                    headshotGradient,
                    primaryColor,
                    secondaryColor,
                    highlightColor
                  ),
                }}
              >
                <Image
                  src={fetchAwsAsset("dummy", "png")}
                  alt="Headshot"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow h-[120px]">
                <div className="w-full h-[120px] bg-gray-100 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(0.09)`,
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject[1] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={getTemplateData(type, "1")}
                          style={stylesObject[1]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    "featured-post": (
      <div className="absolute w-[70%] h-[250px] top-[15px] left-[15%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2 relative">
          {/* Featured Badge */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-gray-100 gap-1 text-gray-600 text-[8px] px-2 py-1 rounded-full font-medium flex items-center border border-gray-200">
              <BadgeCheck size={12} />
              Featured
            </div>
          </div>

          <div className="flex flex-col h-full">
            {/* Profile Header */}
            <div className="flex items-center mb-1">
              <div
                className="w-6 h-6 rounded-full overflow-hidden border border-[#E6E8E8] mr-2"
                style={{
                  background: getGradientStyle(
                    headshotGradient,
                    primaryColor,
                    secondaryColor,
                    highlightColor
                  ),
                }}
              >
                <Image
                  src={fetchAwsAsset("dummy", "png")}
                  alt="Headshot"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex-grow">
                <div className="w-[50px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>

            {/* Featured Post Label */}
            <div className="mb-1">
              <div className="w-[50px] h-1 bg-[#EBEBEB] rounded mb-[3px]"></div>
              <div className="w-[40px] h-1 bg-[#EBEBEB] rounded"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col">
              <div className="flex-grow h-[120px]">
                <div className="w-full h-[80px] bg-gray-50 rounded overflow-hidden relative border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: "scale(0.13)",
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject?.[1] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={getTemplateData?.(type, "1")}
                          style={stylesObject[1]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                  {/* Featured overlay indicator */}
                  <div className="absolute top-1 left-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Interaction Placeholders */}
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-3 h-1 bg-[#D1D5DB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    "mockup-post": (
      <div className="absolute w-[70%] h-[250px] top-[15px] left-[15%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div
                className="w-6 h-6 rounded-full overflow-hidden border border-[#E6E8E8] mr-2"
                style={{
                  background: getGradientStyle(
                    headshotGradient,
                    primaryColor,
                    secondaryColor,
                    highlightColor
                  ),
                }}
              >
                <Image
                  src={fetchAwsAsset("dummy", "png")}
                  alt="Headshot"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow h-[120px]">
                <div className="w-full h-[130px] bg-gray-100 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(0.095)`,
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject[1] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={getTemplateData(type, "1")}
                          style={stylesObject[1]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    "textimg-post": (
      <div className="absolute w-[70%] h-[250px] top-[15px] left-[15%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div
                className="w-6 h-6 rounded-full overflow-hidden border border-[#E6E8E8] mr-2"
                style={{
                  background: getGradientStyle(
                    headshotGradient,
                    primaryColor,
                    secondaryColor,
                    highlightColor
                  ),
                }}
              >
                <Image
                  src={fetchAwsAsset("dummy", "png")}
                  alt="Headshot"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow h-[120px]">
                <div className="w-full h-[120px] bg-gray-100 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(0.09)`,
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject[1] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={getTemplateData(type, "1")}
                          style={stylesObject[1]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    "social-carousel": (
      <div className="absolute w-[70%] h-[250px] top-[15px] left-[15%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div
                className="w-6 h-6 rounded-full overflow-hidden border border-[#E6E8E8] mr-2"
                style={{
                  background: getGradientStyle(
                    headshotGradient,
                    primaryColor,
                    secondaryColor,
                    highlightColor
                  ),
                }}
              >
                <Image
                  src={fetchAwsAsset("dummy", "png")}
                  alt="Headshot"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow h-[120px]">
                <div className="w-full h-[120px] bg-gray-100 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(0.109)`,
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject[1] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={getTemplateData(type, "1")}
                          style={stylesObject[1]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    default: (
      <div className="absolute w-[60%] h-[200px] top-[20px] left-[20%]">
        <div className="w-full h-full rounded-md overflow-hidden shadow-sm bg-white border border-[#EBEBEB] p-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
              <div className="flex-grow">
                <div className="w-[60px] h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-[40px] h-1 bg-[#EBEBEB] rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex-grow bg-blue-100 my-1">
                <div className="w-full h-[100px] bg-gray-100 rounded overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        transform: `scale(0.07)`,
                        transformOrigin: "center",
                      }}
                    >
                      {stylesObject[1] && (
                        <TemplateWrapper
                          assetType={type}
                          templateNumber={1}
                          data={defaultData}
                          style={stylesObject[1]}
                          brand={brand}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 mt-1">
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
                <div className="w-4 h-1 bg-[#EBEBEB] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  const handleClick = () => {
    if (onClick) {
      onClick(type);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        `bg-[#F1F3F3] relative flex flex-col
        w-[250px] h-[200px] rounded-lg overflow-hidden 
        shadow-md cursor-pointer border border-[#E8E8E8] 
        hover:border-primary select-none`,
        isActive && "border-primary border-2"
      )}
    >
      {/* Use social-banner mockup or default for all others */}
      {mockupMap[type] || mockupMap.default}

      {/* Platform label */}
      <div className="absolute bottom-0 left-0 right-0 w-full flex items-center px-3 py-2 bg-[#F1F3F3] border-t border-[#E1E3E3]">
        <div className="flex items-center">
          <div className="w-5 h-5 mr-2">{platformInfo.icon}</div>
          <span className="text-sm text-gray-700">{platformInfo.label}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
