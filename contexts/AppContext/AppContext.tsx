// contexts/AppContext/AppContext.tsx
import React, { createContext, useState, useContext } from "react";
import { AppState, AppContextType } from "./types";
import { initialState } from "./helpers/initialState";
import { actions } from "./helpers/actions";
import { useNextAuthLogic } from "./helpers/nextAuthLogic";
import { Position } from "@/types";
import { SectionConfig } from "@/common/constants/unified-bento-config";

// Context
const AppContext = createContext<AppContextType | null>(null);

// Provider
function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Action handlers
  const setCategoriesLoading = (isLoading: boolean) =>
    actions.setCategoriesLoading(setState, isLoading);
  const setTemplatesLoading = (isLoading: boolean) =>
    actions.setTemplatesLoading(setState, isLoading);
  const setUserLoading = (isLoading: boolean) =>
    actions.setUserLoading(setState, isLoading);
  const setCurrentUser = (user: AppState["currentUser"]) =>
    actions.setCurrentUser(setState, user);
  const setError = (errorMessage: string | null) =>
    actions.setError(setState, errorMessage);

  // Headshot actions
  const setHeadshot = (style: Parameters<typeof actions.setHeadshot>[1]) =>
    actions.setHeadshot(setState, style);
  const setImagePosition = (position: Position) =>
    actions.setImagePosition(setState, position);
  const setImageScale = (scale: number) =>
    actions.setImageScale(setState, scale);
  const setOpacity = (opacity: number) => actions.setOpacity(setState, opacity);
  const resetHeadshot = () => actions.resetHeadshot(setState);

  // Sections data actions
  const setSectionsData = (sections: SectionConfig[]) =>
    actions.setSectionsData(setState, sections);

  // Auth actions
  const setIsLoading = (isLoading: boolean) =>
    actions.setIsLoading(setState, isLoading);
  const setIsPremiumUser = (isPremium: boolean) =>
    actions.setIsPremiumUser(setState, isPremium);
  const setIsSignedIn = (isSignedIn: boolean) =>
    actions.setIsSignedIn(setState, isSignedIn);

  // Initialize NextAuth-based authentication logic
  const { refreshAuth } = useNextAuthLogic({
    setCurrentUser,
    setIsLoading,
    setIsPremiumUser,
    setIsSignedIn,
    setSectionsData,
  });

  const value: AppContextType = {
    state,
    refreshAuth,
    // Asset & Template actions
    setCategoriesLoading,
    setTemplatesLoading,
    setUserLoading,
    setCurrentUser,
    setError,
    // Headshot actions
    setHeadshot,
    setImagePosition,
    setImageScale,
    setOpacity,
    resetHeadshot,
    // Sections data actions
    setSectionsData,
    // Auth actions
    setIsLoading,
    setIsPremiumUser,
    setIsSignedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};

export { AppContext, AppContextProvider, useAppContext };
