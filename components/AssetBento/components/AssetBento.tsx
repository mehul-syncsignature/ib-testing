"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import { SectionConfig } from "@/common/constants/unified-bento-config";
import { renderTemplate } from "@/common/utils/template-renderer";
import { getStyleByTypeAndKey } from "../utils";
import { AssetTypeKeys } from "@/contexts/AssetContext/types";
import { Brand } from "@/contexts/BrandContext/types";
import { useAssetContext } from "@/contexts/AssetContext";
import BrandMarkHeadshotImage from "@/components/instant-branding/components/BrandMarkHeadshotImage";

type AssetBentoProps = {
  sectionConfig: SectionConfig;
  brand: Brand;
  userImageUrl?: string;
  onAssetClick?: (assetKey: keyof SectionConfig["assets"]) => void;
  isBlurred?: boolean;
};

export default function AssetBento({
  sectionConfig,
  brand,
  onAssetClick = () => {},
  isBlurred = false,
}: AssetBentoProps) {
  const {
    state: { dataConfig },
  } = useAssetContext();

  // Keep the exact same scaling and container logic
  const [scale, setScale] = useState(0.8);
  const [postScale, setPostScale] = useState(0.315);
  const [featuredPostScale, setFeaturedPostScale] = useState(0.6);
  const [containerHeight, setContainerHeight] = useState("270px");
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef(null);
  const postContainerRef = useRef<HTMLDivElement>(null);
  const textimgContainerRef = useRef<HTMLDivElement>(null);
  const featuredPostContainerRef = useRef<HTMLDivElement>(null);

  // Get specific style using the new consolidated hook
  const bannerStyle = getStyleByTypeAndKey(
    sectionConfig.assets.topBanner.assetType as AssetTypeKeys,
    sectionConfig.assets.topBanner.styleKey
  );
  const featuredPost1Style = getStyleByTypeAndKey(
    sectionConfig.assets.leftCard.assetType as AssetTypeKeys,
    sectionConfig.assets.leftCard.styleKey
  );
  const featuredPost2Style = getStyleByTypeAndKey(
    sectionConfig.assets.rightCard.assetType as AssetTypeKeys,
    sectionConfig.assets.rightCard.styleKey
  );
  const textimgPost1Style = getStyleByTypeAndKey(
    sectionConfig.assets.smallPost1.assetType as AssetTypeKeys,
    sectionConfig.assets.smallPost1.styleKey
  );
  const quoteCardStyle = getStyleByTypeAndKey(
    sectionConfig.assets.smallPost2.assetType as AssetTypeKeys,
    sectionConfig.assets.smallPost2.styleKey
  );
  const mockupPostStyle = getStyleByTypeAndKey(
    sectionConfig.assets.bigPost.assetType as AssetTypeKeys,
    sectionConfig.assets.bigPost.styleKey
  );
  const socialPost1Style = getStyleByTypeAndKey(
    sectionConfig.assets.miniPost1.assetType as AssetTypeKeys,
    sectionConfig.assets.miniPost1.styleKey
  );
  const textimgPost2Style = getStyleByTypeAndKey(
    sectionConfig.assets.miniPost2.assetType as AssetTypeKeys,
    sectionConfig.assets.miniPost2.styleKey
  );

  // Keep the exact same updateScale function
  const updateScale = () => {
    const viewportWidth = window.innerWidth;

    if (viewportWidth < 640) {
      setScale(0.4);
      setContainerHeight("200px");
    } else if (viewportWidth < 768) {
      setScale(0.6);
      setContainerHeight("230px");
    } else if (viewportWidth < 1024) {
      setScale(0.75);
      setContainerHeight("250px");
    } else {
      setScale(0.9);
      setContainerHeight("270px");
    }

    if (containerRef.current && bannerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const originalWidth = 1584;
      const widthScale = containerWidth / originalWidth;
      const minScale = 0.3;
      const adjustedScale = Math.max(widthScale * 1, minScale);
      setScale(Math.min(adjustedScale, scale));
    }

    if (postContainerRef.current) {
      const postContainerWidth = postContainerRef.current.offsetWidth;
      const originalPostWidth = 1080;
      const widthScale = postContainerWidth / originalPostWidth;
      const minPostScale = 0.015;
      const adjustedPostScale = Math.max(widthScale * 1, minPostScale);
      setPostScale(Math.min(adjustedPostScale, postScale));
    }

    if (textimgContainerRef.current) {
      const postContainerWidth = textimgContainerRef.current.offsetWidth;
      const originalPostWidth = 1080;
      const widthScale = postContainerWidth / originalPostWidth;
      const minPostScale = 0.015;
      const adjustedPostScale = Math.max(widthScale * 1, minPostScale);
      setPostScale(Math.min(adjustedPostScale, postScale));
    }

    if (featuredPostContainerRef.current) {
      const featuredPostContainerWidth =
        featuredPostContainerRef.current.offsetWidth;
      const originalFeaturedPostWidth = 1200;
      const widthScale = featuredPostContainerWidth / originalFeaturedPostWidth;
      const minFeaturedPostScale = 0.1;
      const adjustedFeaturedPostScale = Math.max(
        widthScale * 1,
        minFeaturedPostScale
      );
      setFeaturedPostScale(
        Math.min(adjustedFeaturedPostScale, featuredPostScale)
      );
    }
  };

  // Keep the exact same useEffect for scaling
  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (postContainerRef.current) {
      resizeObserver.observe(postContainerRef.current);
    }
    if (featuredPostContainerRef.current) {
      resizeObserver.observe(featuredPostContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  // UPDATED: Use topBanner instead of banner
  const getBannerData = () => ({
    ...sectionConfig.assets.topBanner.data,
    imageUrl: brand.brandMark.headshotUrl || dataConfig.imageUrl,
  });

  return (
    <div
      className={`w-full h-full flex flex-col overflow-auto scrollbar-thin-custom relative ${
        isBlurred ? "blur-sm" : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          {/* Top row - Keep exact same layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-[73vw] mx-auto">
            {/* Headshot - Keep exact same structure */}
            <div className="md:col-span-1 aspect-square rounded-[8px] overflow-hidden relative group">
              <div className="w-full h-full relative">
                <BrandMarkHeadshotImage className="top-0" />
                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("topBanner")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div
              ref={containerRef}
              className={`md:col-span-4 overflow-hidden rounded-[8px] relative group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                maxHeight: containerHeight,
                transition: "height 0.3s ease",
                width: "100%",
              }}
            >
              <div
                className="w-full h-full relative"
                style={{ overflow: "hidden" }}
              >
                <div
                  ref={bannerRef}
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.topBanner.assetType,
                    sectionConfig.assets.topBanner.templateId,
                    {
                      data: getBannerData(),
                      brand,
                      headshot: sectionConfig.assets.topBanner.headshot,
                      style: bannerStyle,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("topBanner")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Posts Row */}
          {/* Featured Posts Row - UPDATED: Use leftCard and rightCard */}
          <div className="grid grid-cols-4 gap-4 w-full max-w-[73vw] mx-auto">
            {/* Featured Post 1 */}
            {/* Left Card - UPDATED */}
            <div
              ref={featuredPostContainerRef}
              className={`col-span-2 overflow-hidden rounded-[8px] relative group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                aspectRatio: "1200/627",
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${featuredPostScale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.leftCard.assetType,
                    sectionConfig.assets.leftCard.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.leftCard.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.leftCard.headshot,
                      style: featuredPost1Style,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("leftCard")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Card - UPDATED */}
            <div
              className={`col-span-2 overflow-hidden rounded-[8px] relative group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                aspectRatio: "1200/627",
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${featuredPostScale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.rightCard.assetType,
                    sectionConfig.assets.rightCard.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.rightCard.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.rightCard.headshot,
                      style: featuredPost2Style,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("rightCard")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Grid - UPDATED: Use new slot names */}
          <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full max-w-[73vw] mx-auto">
            {/* Small Post 1 - UPDATED */}
            <div
              ref={textimgContainerRef}
              className={`col-span-1 row-span-1 overflow-hidden rounded-[8px] relative group ${
                isBlurred ? "blur-sm" : "group-hover:blur-sm"
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${postScale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.smallPost1.assetType,
                    sectionConfig.assets.smallPost1.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.smallPost1.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.smallPost1.headshot,
                      style: textimgPost1Style,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("smallPost1")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Small Post 2 - UPDATED */}
            <div
              className={`col-span-1 row-span-1 overflow-hidden rounded-[8px] group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${postScale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.smallPost2.assetType,
                    sectionConfig.assets.smallPost2.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.smallPost2.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.smallPost2.headshot,
                      style: quoteCardStyle,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("smallPost2")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Big Post - UPDATED */}
            <div
              className={`col-span-2 row-span-2 bg-[#F1F3F3] rounded-[8px] overflow-hidden relative group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                maxHeight: `calc(${containerHeight} * 4)`,
                transition: "height 0.3s ease",
              }}
            >
              <div
                className="relative top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${postScale * 2.06})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.bigPost.assetType,
                    sectionConfig.assets.bigPost.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.bigPost.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.bigPost.headshot,
                      style: mockupPostStyle,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("bigPost")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Post 1 - UPDATED */}
            <div
              className={`col-span-1 row-span-1 overflow-hidden rounded-[8px] relative group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                paddingTop: "125%",
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${postScale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.miniPost1.assetType,
                    sectionConfig.assets.miniPost1.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.miniPost1.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.miniPost1.headshot,
                      style: socialPost1Style,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("miniPost1")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Post 2 - UPDATED */}
            <div
              className={`col-span-1 row-span-1 overflow-hidden rounded-[8px] relative group ${
                isBlurred ? "blur-sm" : ""
              }`}
              style={{
                backgroundColor: `${brand?.config?.colors?.primaryColor}`,
                paddingTop: "125%",
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="group-hover:blur-sm"
                  style={{
                    transform: `scale(${postScale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "auto",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {renderTemplate(
                    sectionConfig.assets.miniPost2.assetType,
                    sectionConfig.assets.miniPost2.templateId,
                    {
                      data: {
                        ...sectionConfig.assets.miniPost2.data,
                        imageUrl:
                          brand.brandMark.headshotUrl || dataConfig.imageUrl,
                      },
                      brand,
                      headshot: sectionConfig.assets.miniPost2.headshot,
                      style: textimgPost2Style,
                    }
                  )}
                </div>

                {!isBlurred && (
                  <div className="duration-200 bg-black/40 ease-in-out hidden group-hover:flex absolute inset-0 items-center justify-center">
                    <Button
                      className="bg-[#F1F3F3] text-[#333333] hover:bg-[#F1F3F3]"
                      onClick={() => onAssetClick("miniPost2")}
                    >
                      Customize <PencilLine />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
