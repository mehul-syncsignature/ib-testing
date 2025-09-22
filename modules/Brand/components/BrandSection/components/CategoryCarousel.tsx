"use client";
import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { ASSET_CATEGORIES } from "../constants";
import { AssetTypeKeys } from "../types";

interface CategoryCarouselProps {
  activeTab: "recent" | "category";
  currentAssetType: AssetTypeKeys;
  onCategoryChange: (selection: string) => void;
}

export const CategoryCarousel = ({
  activeTab,
  currentAssetType,
  onCategoryChange,
}: CategoryCarouselProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const isWheeling = useRef(false);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    const handleWheel = (event: WheelEvent) => {
      if (isWheeling.current) return;

      const scrollAmount = event.deltaY !== 0 ? event.deltaY : event.deltaX;
      if (Math.abs(scrollAmount) < 10) return;

      event.preventDefault();
      isWheeling.current = true;

      if (scrollAmount > 0) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollPrev();
      }

      setTimeout(() => {
        isWheeling.current = false;
      }, 180);
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("resize", onSelect);
    carouselContainerRef.current?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("resize", onSelect);
      carouselContainerRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [carouselApi]);

  return (
    <motion.div
      ref={carouselContainerRef}
      className="relative mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <Carousel
        className="w-full"
        opts={{ dragFree: true, containScroll: "trimSnaps" }}
        setApi={setCarouselApi}
      >
        <CarouselContent className="-ml-4">
          {ASSET_CATEGORIES.map((category) => (
            <CarouselItem key={category} className="pl-4 basis-auto">
              <CategoryCard
                type={category}
                onClick={onCategoryChange}
                isActive={
                  activeTab === "category" && currentAssetType === category
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {canScrollPrev && (
          <CarouselPrevious className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full h-8 w-8 flex items-center justify-center z-10 border border-gray-100" />
        )}
        {canScrollNext && (
          <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full h-8 w-8 flex items-center justify-center z-10 border border-gray-100" />
        )}
      </Carousel>
    </motion.div>
  );
};
