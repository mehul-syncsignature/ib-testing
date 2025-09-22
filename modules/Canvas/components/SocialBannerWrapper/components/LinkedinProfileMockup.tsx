/* eslint-disable react/no-unescaped-entities */
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode, useRef, useEffect, useState } from "react";

interface LinkedInProfileMockupProps {
  children: ReactNode;
  className?: string;
}

export default function LinkedInProfileMockup({
  children: Component,
  className = "",
}: LinkedInProfileMockupProps) {
  // Make profile responsive based on container size
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        // Check if width is below typical mobile breakpoint
        setIsMobile(containerRef.current.offsetWidth < 640);
      }
    };

    // Initial check
    checkSize();

    // Add resize listener
    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`font-sans bg-[#f3f2ef] ${className}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Profile Card */}
      <div className="bg-white rounded shadow mb-2 overflow-hidden">
        {/* Banner Section */}
        <div className="relative z-88888">
          {/* The banner component gets rendered here */}
          {Component}

          <div className="relative">
            {/* Profile Picture */}
            <div
              className={`absolute ${
                isMobile ? "-bottom-8 left-4" : "-bottom-12 left-8"
              }`}
            >
              <div
                className={`${
                  isMobile ? "w-20 h-20" : "w-32 h-32"
                } rounded-full bg-orange-500 border-4 border-white flex items-center justify-center text-white font-bold`}
                style={{ fontSize: isMobile ? "1.5rem" : "3rem" }}
              >
                M
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className={`${isMobile ? "pt-12 px-4 pb-4" : "pt-20 px-8 pb-6"}`}>
          <div
            className={`${
              isMobile ? "flex-col" : "flex justify-between items-start"
            }`}
          >
            <div>
              <div
                className={`${
                  isMobile ? "flex-col items-start" : "flex items-center"
                } gap-2`}
              >
                <h2
                  className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}
                >
                  Mehul Rana
                </h2>
                <button
                  className={`text-blue-600 border border-blue-600 rounded-md px-2 py-1 text-xs flex items-center gap-1 ${
                    isMobile ? "mt-1" : ""
                  }`}
                >
                  <Check className="w-3 h-3" /> Add verification badge
                </button>
              </div>
              <p className="text-gray-700 mt-1">
                Full-stack Developer at SyncSignature
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <span>Surat, Gujarat, India</span>
                <span>•</span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Contact info
                </Link>
              </div>
              <p className="text-blue-600 text-sm mt-1 hover:underline cursor-pointer">
                8 connections
              </p>
            </div>

            <div className={`flex items-center ${isMobile ? "mt-4" : ""}`}>
              <div className="bg-purple-600 w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
              <span className="font-medium">SyncSignature</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`${
              isMobile ? "flex flex-wrap gap-2 mt-4" : "flex gap-2 mt-4"
            }`}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full text-xs sm:text-sm">
              Open to
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full text-xs sm:text-sm"
            >
              Add profile section
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full text-xs sm:text-sm"
            >
              Enhance profile
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full text-xs sm:text-sm"
            >
              More
            </Button>
          </div>

          {/* Notification Cards */}
          <div
            className={`${
              isMobile
                ? "grid grid-cols-1 gap-3 mt-4"
                : "grid grid-cols-2 gap-4 mt-6"
            }`}
          >
            <div className="border border-gray-300 rounded-lg p-4 relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-100 rounded-full p-1">
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-medium">
                Show recruiters you're open to work
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                — you control who sees this.
              </p>
              <Link
                href="#"
                className="text-blue-600 text-sm font-medium mt-2 block hover:underline"
              >
                Get started
              </Link>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-100 rounded-full p-1">
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-medium">Share that you're hiring</h3>
              <p className="text-sm text-gray-600 mt-1">
                and attract qualified candidates.
              </p>
              <Link
                href="#"
                className="text-blue-600 text-sm font-medium mt-2 block hover:underline"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
