import React from "react";
import Image from "next/image";
import { templateData } from "@/common/constants/template-data";
import { TemplateWrapper } from "@/components/TemplateWrapper/TemplateWrapper";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { getGradientStyle } from "@/common/constants/gradients";
import { getAllStylesByType } from "../../design-templates/utils";

interface TemplateCardProps {
  type?: AssetTypeKeys;
  templateNumber?: number;
  customContent?: string;
  className?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  type = "social-post",
  templateNumber = 1,
  customContent,
  className = "",
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

  const stylesObject = getAllStylesByType(type);
  const defaultData = templateData[type]["default"] || {};

  // If custom content is provided, use it; otherwise use default data
  const displayData = customContent
    ? { ...defaultData, title: customContent, description: customContent }
    : defaultData;

  return (
    <div
      className={`absolute w-[70%] h-[250px] top-[15px] left-[15%] ${className}`}
    >
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
                    {stylesObject[templateNumber] && (
                      <TemplateWrapper
                        assetType={type}
                        templateNumber={templateNumber}
                        data={displayData}
                        style={stylesObject[templateNumber]}
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
  );
};

export default TemplateCard;
