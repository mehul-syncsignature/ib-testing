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
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppContext } from "@/contexts/AppContext";
import { fetchAwsAsset } from "@/lib/aws-s3";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

// Form validation schema
const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormViewProps {
  formData: SignUpFormData;
  onFormDataChange: (data: Partial<SignUpFormData>) => void;
  onSubmit: (data: SignUpFormData) => void;
  onGoogleSignUp: () => void;
  onBack: () => void;
  onSignInClick: () => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
  error: string;
}

const SignUpFormView = ({
  formData,
  onFormDataChange,
  onSubmit,
  onGoogleSignUp,
  onSignInClick,
  isLoading,
  isGoogleLoading,
  error,
}: SignUpFormViewProps) => {
  const {
    state: { isLoading: apiLoading },
  } = useAppContext();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: formData,
  });

  // Watch form values and sync with parent component
  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormDataChange(value as Partial<SignUpFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormDataChange]);

  const handleFormSubmit = async (data: SignUpFormData) => {
    await onSubmit(data);
  };

  return (
    <div className={`relative mx-auto ${publicSans.className}`}>
      <div className="relative p-6 ">
        <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center mb-4">
          <Image
            src={fetchAwsAsset("IB-icon", "png")}
            width={100}
            height={100}
            alt="Logo"
          />
        </div>

        <h2 className="text-[22px] font-semibold text-gray-900 mb-4">
          Create an account
        </h2>

        {/* Show error message if present */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-[0.8rem]">
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleSignUp}
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

        {/* Email Sign Up Form with shadcn/ui Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FIRST NAME *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading || isGoogleLoading}
                        placeholder="Flora"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LAST NAME *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading || isGoogleLoading}
                        placeholder="Schmitt"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EMAIL *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isLoading || isGoogleLoading}
                      placeholder="flora@instantbranding.ai"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PASSWORD *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading || isGoogleLoading}
                        placeholder="Create a password"
                      />
                      <div className="text-xs mt-2 font-medium text-gray-500">
                        Minimum 8 characters
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading || isGoogleLoading}
                        className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none disabled:opacity-50"
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
              disabled={isLoading || apiLoading || !form.formState.isValid}
              className="w-full disabled:opacity-[70%] cursor-pointer"
            >
              {isLoading || apiLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin "></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer */}
      <div
        onClick={() =>
          !(isLoading || isGoogleLoading || apiLoading) && onSignInClick()
        }
        className={`border-[#E1E3E3] flex items-center justify-center p-6 pt-0 ${
          isLoading || isGoogleLoading || apiLoading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <p className="text-center text-[16px]" style={{ color: "#666666" }}>
          If you already have an account,{" "}
          <span className="text-teal-600 font-medium hover:text-teal-700 cursor-pointer">
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpFormView;
