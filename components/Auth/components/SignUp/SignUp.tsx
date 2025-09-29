import React, { useState } from "react";
import SignUpFormView from "./components/SignUpFormView";
import { useAppContext } from "@/contexts/AppContext";
import { useDataMigration } from "@/hooks/useDataMigration";
import { getUnauthenticatedData } from "@/utils/unauthenticatedStorage";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface SignUpProps {
  handleSetView: (view: "signIn" | "signUp") => void;
  onCloseAuth?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUp = ({
  handleSetView,
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

  const { refreshAuth } = useAppContext();
  const { migrateStoredData, clearStoredData } = useDataMigration();

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      // Store localStorage data before Google OAuth redirect
      const storedData = getUnauthenticatedData();
      if (storedData) {
        // Store in sessionStorage to survive the OAuth redirect
        sessionStorage.setItem('pendingMigration', JSON.stringify(storedData));
      }

      await signIn("google", {
        redirect: true,
        callbackUrl: "/app/design-templates/social-banner",
      });

    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate Google authentication. Please try again.";
      setError(errorMessage);
      setIsGoogleLoading(false);
    }
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

        try {
          const migrationResult = await migrateStoredData(true);
          if (migrationResult.brandMigrated) {
            toast.success("Your customized brand has been saved to your account!");
          }
        } catch {
          clearStoredData();
        }

        await refreshAuth();

        if (onCloseAuth) {
          onCloseAuth();
        }

        window.location.href = "/app/design-templates/social-banner";
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

  // Always show the signup form directly
  return (
    <SignUpFormView
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleEmailSignUp}
      onGoogleSignUp={handleGoogleSignUp}
      onBack={() => setError("")}
      onSignInClick={() => handleSetView("signIn")}
      isLoading={isLoading}
      isGoogleLoading={isGoogleLoading}
      error={error}
    />
  );
};

export default SignUp;
