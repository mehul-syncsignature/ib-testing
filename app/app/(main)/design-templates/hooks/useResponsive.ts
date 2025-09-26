"use client";
import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [columnCount, setColumnCount] = useState<number>(3);

  useEffect(() => {
    const updateColumnCount = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setColumnCount(1);
        } else if (window.innerWidth < 1280) {
          setColumnCount(2);
        } else {
          setColumnCount(3);
        }
      }
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  return { columnCount };
};
