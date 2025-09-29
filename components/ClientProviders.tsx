// components/ClientProviders.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ScrollbarProvider } from "@/providers/ScrollBarProvider";
import dynamic from "next/dynamic";

const PaddleProvider = dynamic(
  () =>
    import("@/providers/PaddleProvider").then((mod) => ({
      default: mod.PaddleProvider,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);
import { Toaster } from "sonner";
import { AppContextProvider } from "@/contexts/AppContext";
import { AssetContextProvider } from "@/contexts/AssetContext";
import { BrandContextProvider } from "@/contexts/BrandContext";
import { PostHogProvider } from "@/providers/PostHogProvider";
import DataInitializationProvider from "@/providers/DataInitializationProvider";
import { useOAuthMigration } from "@/hooks/useOAuthMigration";

interface ClientProvidersProps {
  children: React.ReactNode;
}

// Component to handle OAuth migration
function OAuthMigrationHandler() {
  useOAuthMigration();
  return null;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <BrandContextProvider>
        <AppContextProvider>
          <AssetContextProvider>
            <PostHogProvider>
              <ScrollbarProvider>
                <PaddleProvider>
                  <DataInitializationProvider>
                    <OAuthMigrationHandler />
                    {children}
                  </DataInitializationProvider>
                  <Toaster />
                </PaddleProvider>
              </ScrollbarProvider>
            </PostHogProvider>
          </AssetContextProvider>
        </AppContextProvider>
      </BrandContextProvider>
    </SessionProvider>
  );
}
