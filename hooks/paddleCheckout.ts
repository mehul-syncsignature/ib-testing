// hooks/usePaddleCheckout.ts

import { useState } from "react";
import { usePaddle } from "@/providers/PaddleProvider";
import { toast } from "sonner";

// Define proper types for Paddle events
interface PaddleCheckoutEvent {
  name: string;
  data?: unknown;
}

interface PaddleCheckoutCompletedEvent extends PaddleCheckoutEvent {
  name: "checkout.completed";
  data: {
    transactionId: string;
    checkout: {
      id: string;
    };
  };
}

interface PaddleCheckoutErrorEvent extends PaddleCheckoutEvent {
  name: "checkout.error";
  data: {
    error: {
      code: string;
      detail: string;
    };
  };
}

interface CheckoutOptions {
  priceId: string;
  userId?: string;
  email?: string;
  onSuccess?: (event: PaddleCheckoutCompletedEvent) => void;
  onError?: (error: Error | PaddleCheckoutErrorEvent) => void;
}

export const usePaddleCheckout = () => {
  const { paddle, isLoaded } = usePaddle();
  const [isLoading, setIsLoading] = useState(false);

  const openCheckout = async ({
    priceId,
    userId,
    email,
    onError,
  }: CheckoutOptions) => {
    if (!paddle || !isLoaded) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const checkoutOptions = {
        items: [{ priceId, quantity: 1 }],
        ...(email && { customerEmail: email }),
        ...(userId && {
          customData: {
            userId: userId,
          },
        }),
        settings: {
          displayMode: "overlay" as const,
          theme: "light" as const,
          locale: "en" as const,
        },
      };

      // Handle the checkout opening - note that eventCallback might not be supported
      // Check Paddle documentation for the correct event handling approach
      await paddle.Checkout.open(checkoutOptions);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      if (error instanceof Error) {
        onError?.(error);
      } else {
        onError?.(new Error(errorMessage));
      }
      toast.error("Failed to open checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    openCheckout,
    isLoading,
    isReady: isLoaded && !!paddle,
  };
};
