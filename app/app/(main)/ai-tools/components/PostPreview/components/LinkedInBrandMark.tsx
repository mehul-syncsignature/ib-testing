/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { BadgeCheck, Globe } from "lucide-react";
import React from "react";
import { useBrandContext } from "@/contexts/BrandContext";
import BrandMarkHeadshotImage from "@/components/instant-branding/components/BrandMarkHeadshotImage";

const LinkedInBrandMark = ({}) => {
  const {
    state: {
      brand: {
        config: {
          typography: { secondaryFont },
        },
        brandMark: { name, socialHandle },
      },
    },
  } = useBrandContext();

  return (
    <div className={cn("flex items-center gap-2 mb-[8px]")}>
      {/* {headshotUrl && ( */}
      <div
        className="rounded-full overflow-hidden border-2 border-white shadow-md"
        style={{
          width: "48px",
          height: "48px",
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
              fontSize: "16px",
              color: "#121212",
              fontWeight: "600",
              lineHeight: "20px",
              paddingBottom: "0px",
              display: "flex",
              alignItems: "center",
              gap: "1px",
            }}
          >
            {name}
            <BadgeCheck
              fill="#1DA1F2"
              stroke="#FFFFFF"
              width="16px"
              height="16px"
            ></BadgeCheck>
          </div>
        )}
        {socialHandle && (
          <div
            className="text-left"
            style={{
              fontFamily: secondaryFont,
              fontSize: "12px",
              color: "#121212",
              lineHeight: "0.5",
              paddingBottom: "3px",
            }}
          >
            {socialHandle}
          </div>
        )}
        <div
          className="text-left flex gap-1 items-center"
          style={{
            fontFamily: secondaryFont,
            fontSize: "12px",
            color: "#121212",
            lineHeight: "0.5",
          }}
        >
          <span className="text-xs">1h</span>
          <span className="font-extrabold text-xs">·</span>
          <span className="text-xs">
            <Globe className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LinkedInBrandMark;
