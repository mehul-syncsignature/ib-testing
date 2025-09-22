"use client";

import React, { Suspense } from "react";
import { fetchAwsAsset } from "@/lib/aws-s3";

function AuthLayoutComponent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full w-full grid grid-cols-1 md:grid-cols-2 "
      style={{
        background:
          "radial-gradient(71.48% 71.48% at 50% 50%, rgba(31, 140, 155, 0.2) 0%, rgba(31, 140, 155, 0) 100%), #FFFFFF",
      }}
    >
      <div className="flex flex-col justify-center items-center border-r">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <div
        className="hidden md:block  bg-contain bg-[#2F8992] bg-bottom bg-no-repeat"
        style={{
          backgroundImage: `url(${fetchAwsAsset("signup-cover", "png")})`,
        }}
      />
    </div>
  );
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayoutComponent>{children}</AuthLayoutComponent>
    </Suspense>
  );
};

export default AuthLayout;
