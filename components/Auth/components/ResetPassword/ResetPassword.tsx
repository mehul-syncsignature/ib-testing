/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (values) => {
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.newPassword,
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setIsSuccess(true);
      toast.success("Password reset successful!");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-[16px] text-gray-600 mb-6">
              Your password has been updated successfully. You can now log in
              with your new password.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full rounded-lg py-3 font-medium cursor-pointer"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Vector background image */}
        <div className="top-[21vh] left-[14vw] absolute w-full h-full z-[-10]">
          <Image
            src={fetchAwsAsset("signup-vector", "png")}
            width={210}
            height={210}
            alt="Background vector"
          />
        </div>

        {/* Logo and heading */}
        <div className="flex flex-col items-start mb-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
            <Image
              src={fetchAwsAsset("IB-icon", "png")}
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
          <h2 className="text-[22px] font-semibold text-gray-900 mb-1">
            Reset Password
          </h2>
          <p
            className="text-[16px] leading-relaxed mb-2"
            style={{ color: "#666666" }}
          >
            Enter your new password below.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-900 text-sm font-medium">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        autoFocus
                        className="mt-1 w-full px-4 py-3 pr-12 border bg-[#F1F3F3] !border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-900 text-sm font-medium">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                        className="mt-1 w-full px-4 py-3 pr-12 border bg-[#F1F3F3] !border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirm(!showConfirm)}
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-lg py-3 font-medium"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
