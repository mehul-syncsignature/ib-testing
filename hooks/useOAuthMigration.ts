// hooks/useOAuthMigration.ts - Handle migration after OAuth redirect
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDataMigration } from "@/hooks/useDataMigration";
import { clearUnauthenticatedData } from "@/utils/unauthenticatedStorage";
import { toast } from "sonner";

interface OAuthMigrationResult {
  isProcessing: boolean;
  isComplete: boolean;
  error: string | null;
}

export const useOAuthMigration = (): OAuthMigrationResult => {
  const { data: session, status } = useSession();
  const { migrateStoredData } = useDataMigration();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthMigration = async () => {
      // Only run once when user is authenticated
      if (status !== "authenticated" || !session?.user || isComplete || isProcessing) {
        return;
      }

      // Check if there's pending migration data from OAuth redirect
      const pendingMigrationData = sessionStorage.getItem('pendingMigration');
      if (!pendingMigrationData) {
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Parse the stored data and put it back in localStorage temporarily
        const storedData = JSON.parse(pendingMigrationData);
        localStorage.setItem('instantbranding_unauthenticated_data', JSON.stringify(storedData));

        // Run migration
        const migrationResult = await migrateStoredData(true); // Skip auth check
        
        if (migrationResult.brandMigrated) {
          toast.success("Your customized brand has been saved to your account!");
        }

        // Clean up
        sessionStorage.removeItem('pendingMigration');
        setIsComplete(true);

      } catch (migrationError) {
        const errorMessage = migrationError instanceof Error 
          ? migrationError.message 
          : 'Failed to migrate OAuth data';
        setError(errorMessage);
        
        // Clean up on error
        sessionStorage.removeItem('pendingMigration');
        clearUnauthenticatedData();
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthMigration();
  }, [session, status, migrateStoredData, isComplete, isProcessing]);

  return {
    isProcessing,
    isComplete,
    error,
  };
};