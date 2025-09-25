import React, { useState } from "react";
import SignUpFormView from "./components/SignUpFormView";
import BenefitsView from "./components/BenefitsView";
import { useAppContext } from "@/contexts/AppContext";
import { usePaddleCheckout } from "@/hooks/paddleCheckout";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface SignUpProps {
  handleSetView: (view: "signIn" | "signUp") => void;
  onCloseAuth?: () => void;
  onOpenUpgrade?: () => void;
  showSignUpForm?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUp = ({
  handleSetView,
  showSignUpForm = false,
  onCloseAuth,
}: SignUpProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    refreshAuth,
    state: { currentUser, isPremiumUser, isSignedIn },
  } = useAppContext();

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/auth-redirect",
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

  const { openCheckout } = usePaddleCheckout();

  const handleUpgrade = async () => {
    if (currentUser) {
      await openCheckout({
        priceId:
          process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ||
          "pri_01jzyp8sft721kamdv8ff7n3a1",
        userId: currentUser?.id,
        onError: (error) => {
          toast.error(`${error}`);
        },
      });
    }
  };

  const handleSignUpClick = () => {
    if (!isPremiumUser && isSignedIn) {
      if (onCloseAuth) {
        onCloseAuth();
      }
      handleUpgrade();
    }
    // If user is not signed in, form is already showing
  };

  const handleEmailSignUp = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        isSignUp: "true",
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Sign up failed. Please try again.");
      } else {
        toast.success("Account created successfully!");

        // Refresh auth state first
        await refreshAuth();

        // Close auth dialog and redirect to onboarding
        if (onCloseAuth) {
          onCloseAuth();
        }

        // Redirect to onboarding for all users
        window.location.href = "/onboarding";
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

  const handleBackToBenefits = () => {
    setError("");
  };

  if (showSignUpForm) {
    return (
      <SignUpFormView
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleEmailSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        onBack={handleBackToBenefits}
        onSignInClick={() => handleSetView("signIn")}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
        error={error}
      />
    );
  }

  return (
    <BenefitsView
      onSignUpClick={handleSignUpClick}
      onSignInClick={() => handleSetView("signIn")}
      isSignedIn={isSignedIn}
    />
  );
};

export default SignUp;
