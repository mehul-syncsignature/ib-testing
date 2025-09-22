"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Paddle, initializePaddle } from "@paddle/paddle-js";
import { useRouter } from "next/navigation";
interface PaddleContextType {
  paddle: Paddle | undefined;
  isLoaded: boolean;
}

const PaddleContext = createContext<PaddleContextType>({
  paddle: undefined,
  isLoaded: false,
});

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error("usePaddle must be used within PaddleProvider");
  }
  return context;
};

interface PaddleProviderProps {
  children: React.ReactNode;
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [paddle, setPaddle] = useState<Paddle | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Prefetch checkout-complete page
  useEffect(() => {
    router.prefetch("/checkout-complete");
  }, [router]);

  useEffect(() => {
    const initPaddle = async () => {
      const paddleInstance = await initializePaddle({
        environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as
          | "sandbox"
          | "production",
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        eventCallback: async (data) => {
          if (data.name === "checkout.completed") {
            paddleInstance?.Checkout.close();

            router.push("/checkout-complete");
          }
        },
      });

      setPaddle(paddleInstance);
      setIsLoaded(true);
    };

    initPaddle();
  }, []);

  return (
    <PaddleContext.Provider value={{ paddle, isLoaded }}>
      {children}
    </PaddleContext.Provider>
  );
}
