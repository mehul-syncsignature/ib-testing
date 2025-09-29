/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";
import { signIn } from "next-auth/react";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { clearUnauthenticatedData } from "@/utils/unauthenticatedStorage";
import { Public_Sans } from "next/font/google";
import { useRouter } from "next/navigation";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const resetEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SignInFormData = z.infer<typeof signInSchema>;
type ResetEmailFormData = z.infer<typeof resetEmailSchema>;

interface SignInProps {
  handleSetView: (view: "signIn" | "signUp") => void;
  onCloseAuth?: () => void;
}

const SignIn = ({ handleSetView }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { refreshAuth } = useAppContext();
  const searchParams = useSearchParams();

  // Check for auth errors from URL params
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<ResetEmailFormData>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/app/design-templates/social-banner",
      });

      // Don't set loading to false here if redirect is true, as the page will redirect
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate Google authentication. Please try again.";
      setError(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/app/design-templates/social-banner",
      });

      if (result?.error) {
        setError(result.error || "Sign in failed. Please try again.");
      } else {
        toast.success("Signed in successfully!");

        // Refresh auth state
        await refreshAuth();

        // Clear localStorage for existing users (they have their own saved data)
        clearUnauthenticatedData();

        // Redirect to main app
        if (typeof window !== "undefined") {
          window.location.href = "/app/design-templates/social-banner";
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error. Please check your connection and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ResetEmailFormData) => {
    setIsResetLoading(true);
    setError("");

    try {
      // TODO: Implement NextAuth password reset
      // For now, show a message that this feature is not available
      setError(
        "Password reset is currently not available. Please contact support."
      );
      toast.error("Password reset is currently not available.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setIsResetLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setIsForgotPassword(false);
    setIsResetSent(false);
    setError("");
    resetForm.reset();
  };

  // Success state for reset email sent
  if (isResetSent) {
    return (
      <div>
        <div className="top-[21vh] left-[14vw] absolute w-full h-full z-[-10]">
          <Image
            src={fetchAwsAsset("signup-vector", "png")}
            width={210}
            height={210}
            alt="Background vector"
          />
        </div>

        <div className="relative p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p
              className="text-[16px] leading-relaxed mb-6"
              style={{ color: "#666666" }}
            >
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-gray-800">
                {resetForm.getValues("email")}
              </span>
            </p>

            <div className="space-y-3">
              <Button
                onClick={resetForgotPasswordFlow}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
              {/* <Button onClick={() => onCloseAuth()} className="w-full">
                Close
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forgot password form
  if (isForgotPassword) {
    return (
      <div>
        <div className="top-[21vh] left-[14vw] absolute w-full h-full z-[-10]">
          <Image
            src={fetchAwsAsset("signup-vector", "png")}
            width={210}
            height={210}
            alt="Background vector"
          />
        </div>

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
            Reset Password
          </h2>
          <p
            className="text-[16px] leading-relaxed mb-6"
            style={{ color: "#666666" }}
          >
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(handleForgotPassword)}
              className="space-y-6"
            >
              <FormField
                control={resetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.75rem] font-medium text-gray-500">
                      EMAIL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={isResetLoading}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isResetLoading || !resetForm.formState.isValid}
                className="w-full disabled:opacity-70"
              >
                {isResetLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Email"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              onClick={resetForgotPasswordFlow}
              disabled={isResetLoading}
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main sign in form
  return (
    <div className={`${publicSans.className}`}>
      <div className="relative p-6 ">
        <div className="top-[21vh] left-[14vw] absolute w-full h-full z-[-10]">
          <Image
            src={fetchAwsAsset("signup-vector", "png")}
            width={210}
            height={210}
            alt="Background vector"
          />
        </div>

        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
          <Image
            src={fetchAwsAsset("IB-icon", "png")}
            width={100}
            height={100}
            alt="Logo"
          />
        </div>

        <h2 className="text-[22px] font-semibold text-gray-900 mb-4">
          Welcome back
        </h2>
        {/* <p
          className="text-[16px] leading-relaxed mb-6"
          style={{ color: "#666666" }}
        >
          Sign in to your account to continue creating amazing designs.
        </p> */}

        {/* Show URL error if present */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading || isLoading}
          className="w-full mb-6 bg-white border-[#D9DBDB] hover:bg-white hover:border-[#2F8992] hover:[box-shadow:_0_0_4px_0_#2F8992] flex items-center justify-center gap-1 py-3 disabled:opacity-50 "
        >
          {isGoogleLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
              Connecting...
            </div>
          ) : (
            <>
              <svg viewBox="0 0 23 23">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div className="text-[1rem] font-light">Sign up with Google</div>
            </>
          )}
        </Button>

        <div className="relative mb-6 flex">
          <div className="w-full border-t border-gray-300 flex-1/4 self-center" />
          <div className="justify-center text-sm col-2 px-2  text-gray-400">
            Or continue with email
          </div>
          <div className="w-full border-t border-gray-300 flex-1/4 self-center" />
        </div>

        {/* Email Sign In Form */}
        <Form {...signInForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signInForm.handleSubmit(handleSignIn)(e);
            }}
            className="space-y-6"
          >
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.75rem] font-medium text-gray-500">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.75rem] font-medium text-gray-500">
                    PASSWORD
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
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

            <Button
              type="submit"
              disabled={isLoading || !signInForm.formState.isValid}
              className="w-full disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsForgotPassword(true)}
          disabled={isLoading}
          className="text-sm font-medium cursor-pointer text-primary focus:outline-none focus:primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Forgot your password?
        </button>
      </div>

      <div className="mt-3 border-t mx-3 -mb-3 rounded-b-lg sm:-mx-12 sm:-mb-12">
        <div className="mt-5 text-center sm:px-12">
          <p className="text-sm text-gray-600 h-25">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSetView("signUp")}
              className="font-semibold cursor-pointer text-primary focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
