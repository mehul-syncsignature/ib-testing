"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CheckoutComplete = () => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Order Complete!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
        <p className="text-sm text-gray-500">
          Redirecting to home page in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default CheckoutComplete;
