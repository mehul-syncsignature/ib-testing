"use client";
import { useState, useEffect, RefObject } from "react";

export const useTemplateWidth = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const [templateWidth, setTemplateWidth] = useState<number>(0);
  useEffect(() => {
    if (!containerRef.current) return;

    const updateTemplateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        setTemplateWidth(width);
      }
    };

    updateTemplateWidth();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateTemplateWidth);
      const resizeObserver = new ResizeObserver(updateTemplateWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        window.removeEventListener("resize", updateTemplateWidth);
        resizeObserver.disconnect();
      };
    }
  }, [containerRef]);

  return { templateWidth };
};
