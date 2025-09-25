/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import React from "react";
import { Data, StyleConfigs } from "@/contexts/AssetContext/types";
import { useBrandContext } from "@/contexts/BrandContext";
import BrandMarkHeadshotImage from "./BrandMarkHeadshotImage";

interface BrandMarkProps {
  // Use a 'type' prop to decide what to render
  type?: "individual" | "business";
  config?: StyleConfigs;
  data?: Data;
  classname?: string;
  customStyles?: any;
}

const BrandMark: React.FC<BrandMarkProps> = ({
  type = "individual",
  classname,
  data,
  customStyles = {},
}) => {
  const showBrandMark = data?.showBrandMark ?? true;
  const {
    state: {
      brand: {
        config: {
          colors: { textColor },
          typography: { secondaryFont },
        },
        brandMark: { name, socialHandle },
      },
    },
  } = useBrandContext();

  // Early return if main toggle is OFF
  if (!showBrandMark) {
    return null;
  }

  if (type === "individual") {
    return (
      <div className={cn("flex items-center gap-4", classname)}>
        {/* {headshotUrl && ( */}
        <div
          className="rounded-full overflow-hidden border-2 border-white shadow-md"
          style={{
            width: customStyles.imgWidth || "60px",
            height: customStyles.imgHeight || "60px",
          }}
        >
          <BrandMarkHeadshotImage className="object-cover w-full h-full" />
        </div>
        {/* )} */}
        <div className="flex-col">
          {name && (
            <div
              className="text-left"
              style={{
                fontFamily: secondaryFont,
                fontSize: customStyles.nameFontSize
                  ? customStyles.nameFontSize
                  : socialHandle
                  ? "1.8rem"
                  : "2rem",
                color: textColor,
                fontWeight: "600",
                lineHeight: 1.1,
                paddingBottom: customStyles.paddingBottom,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                ...customStyles,
              }}
            >
              {name}
              <BadgeCheck
                fill="#1DA1F2"
                stroke="#FFFFFF"
                width={
                  customStyles.nameFontSize ? customStyles.nameFontSize : "2rem"
                }
                height={
                  customStyles.nameFontSize ? customStyles.nameFontSize : "2rem"
                }
              ></BadgeCheck>
            </div>
          )}
          {socialHandle && (
            <div
              className="text-left"
              style={{
                fontFamily: secondaryFont,
                fontSize: customStyles.socialhandleFontSize
                  ? customStyles.socialhandleFontSize
                  : name
                  ? "1.8rem"
                  : "2rem",
                color: textColor,
                lineHeight: 1.1,
                ...customStyles,
              }}
            >
              {socialHandle}
            </div>
          )}
        </div>
      </div>
    );
  }

  // // Render for a Business
  // if (type === "business") {
  //   return (
  //     <div className={cn("flex items-center gap-4", classname)}>
  //       {logoUrl && (
  //         <div
  //           className="overflow-hidden flex-shrink-0"
  //           style={{
  //             width: customStyles.logoWidth || "52px",
  //             height: customStyles.logoHeight || "52px",
  //           }}
  //         >
  //           <Image
  //             src={logoUrl}
  //             alt={`Company Logo`}
  //             width={100}
  //             height={100}
  //             className="object-contain w-full h-full"
  //           />
  //         </div>
  //       )}
  //       <div className="flex-col">
  //         {website && (
  //           <div
  //             className="text-left"
  //             style={{
  //               fontFamily: secondaryFont,
  //               fontSize: customStyles.websiteFontSize || "1.5rem",
  //               lineHeight: 1.2,
  //               ...customStyles,
  //             }}
  //           >
  //             {website}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // Return null if type is not recognized
  return null;
};

export default BrandMark;
