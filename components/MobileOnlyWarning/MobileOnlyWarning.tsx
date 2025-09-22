"use client";

import React, { useEffect, useState, ReactNode } from "react";

interface MobileOnlyWarningProps {
  children?: ReactNode;
  minWidth?: number; // Default: 1024 (px)
  message?: string; // Custom message
}

const MobileOnlyWarning: React.FC<MobileOnlyWarningProps> = ({
  children,
  minWidth = 1024,
  message = "Instant Branding is available on desktop only.",
}) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= minWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minWidth]);

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center gap-8">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="57"
              height="56"
              viewBox="0 0 37 36"
              fill="none"
            >
              <rect
                x="0.046875"
                width="36"
                height="36"
                rx="7.2"
                fill="#22808D"
              />
              <path
                d="M15.0575 6.10275C15.0815 6.04081 15.1412 6 15.2076 6H22.834C24.1929 6 25.1275 7.36548 24.6355 8.63227L21.8636 15.7701H11.3032L15.0575 6.10275Z"
                fill="#D5F8FF"
              />
              <path
                d="M16.4631 12.7922H24.7888C26.5474 12.7922 27.3921 14.9503 26.1006 16.1441L9.52848 31.4626C9.40305 31.5786 9.20714 31.4452 9.26907 31.286L16.4631 12.7922Z"
                fill="#D5F8FF"
              />
              <path
                d="M16.463 12.7922L11.3032 15.7702H15.3044L16.465 12.7922H16.463Z"
                fill="#004D57"
              />
            </svg>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-xl text-center font-semibold">Desktop Only</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileOnlyWarning;
