"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignIn from "@/components/Auth/components/SignIn";
import SignUp from "@/components/Auth/components/SignUp";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") === "signIn" ? "signIn" : "signUp";

  const handleSetView = (newView: "signIn" | "signUp") => {
    router.push(`/auth?view=${newView}`);
  };

  return (
    <>
      {view === "signIn" ? (
        <SignIn handleSetView={handleSetView} />
      ) : (
        <SignUp showSignUpForm handleSetView={handleSetView} />
      )}
    </>
  );
};

export default AuthPage;
