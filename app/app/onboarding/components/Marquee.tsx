// ThreeDMarquee.tsx
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const ThreeDMarquee = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  // Split the images array into 4 columns of 8 images each
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * 8;
    return images.slice(start, start + 8);
  });

  return (
    <div className={cn("mx-auto block h-full", className)}>
      <div className="flex size-full items-center justify-center">
        <div className="size-[1020px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              // --- CHANGE 1: Using your desired angle ---
              transform: "rotateX(0deg) rotateY(0deg) rotateZ(-12deg)",
            }}
            // --- CHANGE 2: Using a stable origin and position ---
            className="relative top-[150] left-[2%] grid size-full origin-center grid-cols-4 gap-[1.5rem] transform-3d select-none pointer-events-none"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-[1.5rem]"
                animate={{
                  y: colIndex % 2 === 0 ? ["-50%", "0%"] : ["0%", "-50%"],
                }}
                transition={{
                  ease: "linear",
                  repeat: Infinity,
                  duration: colIndex % 2 === 0 ? 25 : 20,
                }}
              >
                {[...subarray, ...subarray].map((image, imageIndex) => (
                  <div className="relative" key={`${imageIndex}-${image}`}>
                    <motion.img
                      // whileHover={{
                      //   y: -10,
                      //   boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                      // }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      className="rounded-lg object-contain h-auto w-full"
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
