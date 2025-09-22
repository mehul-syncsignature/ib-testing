// providers/ScrollbarProvider.tsx
"use client";

import React, { useEffect } from "react";

/**
 * Provider component that adds Shift+Wheel horizontal scrolling
 * to all elements with the scrollbar-thin-custom class
 */
export function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to handle wheel events
    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        // Find the closest scrollable parent with our custom class
        let target = e.target as HTMLElement;
        let scrollableParent: HTMLElement | null = null;

        // Traverse up to find scrollable parent with our class
        while (target && target !== document.body) {
          if (
            target.classList.contains("scrollbar-thin-custom") &&
            target.scrollWidth > target.clientWidth
          ) {
            scrollableParent = target;
            break;
          }
          target = target.parentElement as HTMLElement;
        }

        // If we found a scrollable parent, handle the scroll
        if (scrollableParent) {
          e.preventDefault();
          scrollableParent.scrollLeft += e.deltaY;
        }
      }
    };

    // Add event listener to document
    document.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return <>{children}</>;
}

// Usage in _app.tsx or layout.tsx:
// import { ScrollbarProvider } from '@/lib/ScrollbarProvider';
//
// function App({ Component, pageProps }) {
//   return (
//     <ScrollbarProvider>
//       <Component {...pageProps} />
//     </ScrollbarProvider>
//   );
// }
