import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { fetchAwsAsset } from "@/lib/aws-s3";

interface VerificationViewProps {
  email: string;
  message?: string; // Added for Supabase email verification message
  onBack: () => void;
}

// Simplified for Supabase as it handles verification via email link
const VerificationView = ({
  email,
  message,
  onBack,
}: VerificationViewProps) => {
  return (
    <div className="relative mx-auto">
      <div className="relative p-6">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
          <Image
            src={fetchAwsAsset("IB-icon", "png")}
            width={100}
            height={100}
            alt="Logo"
          />
        </div>

        <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p
          className="text-[16px] leading-relaxed mb-6"
          style={{ color: "#666666" }}
        >
          {message || `We've sent a verification link to ${email}`}
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Please check your email and click the verification link to
              complete your registration.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Didn&apos;t receive the email? Check your spam folder or click
              back to try again.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationView;
