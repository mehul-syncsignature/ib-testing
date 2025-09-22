// contexts/AppContext/helpers/actions.ts
import { AppState, AppUser, Headshot } from "../types";
import { Position } from "@/types";
import { SectionConfig } from "@/common/constants/unified-bento-config";

export const actions = {
  // Asset & Template actions
  setCategoriesLoading: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    isLoading: boolean
  ) => {
    setState((prev) => ({ ...prev, loadingCategories: isLoading }));
  },

  setTemplatesLoading: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    isLoading: boolean
  ) => {
    setState((prev) => ({ ...prev, loadingTemplates: isLoading }));
  },

  setUserLoading: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    isLoading: boolean
  ) => {
    setState((prev) => ({ ...prev, loadingUser: isLoading }));
  },

  setCurrentUser: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    user: AppUser | null
  ) => {
    setState((prev) => ({ ...prev, currentUser: user }));
  },

  setError: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    errorMessage: string | null
  ) => {
    setState((prev) => ({ ...prev, error: errorMessage }));
  },

  // Headshot actions
  setHeadshot: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    style: Partial<Headshot>
  ) => {
    setState((prev) => ({ ...prev, headshot: { ...prev.headshot, ...style } }));
  },

  setImagePosition: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    position: Position
  ) => {
    setState((prev) => ({
      ...prev,
      headshot: { ...prev.headshot, imagePosition: position },
    }));
  },

  setImageScale: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    scale: number
  ) => {
    setState((prev) => ({
      ...prev,
      headshot: { ...prev.headshot, imageScale: scale },
    }));
  },

  setOpacity: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    opacity: number
  ) => {
    setState((prev) => ({ ...prev, headshot: { ...prev.headshot, opacity } }));
  },

  resetHeadshot: (setState: React.Dispatch<React.SetStateAction<AppState>>) => {
    setState((prev) => ({
      ...prev,
      headshot: {
        imagePosition: { x: 0, y: 0 },
        imageScale: 1,
        opacity: 1,
      },
    }));
  },

  // Sections data actions
  setSectionsData: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    sections: SectionConfig[]
  ) => {
    setState((prev) => ({ ...prev, sectionsData: sections }));
  },

  // Auth actions

  setIsLoading: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    isLoading: boolean
  ) => {
    setState((prev) => ({ ...prev, isLoading }));
  },

  setIsPremiumUser: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    isPremium: boolean
  ) => {
    setState((prev) => ({ ...prev, isPremiumUser: isPremium }));
  },

  setIsSignedIn: (
    setState: React.Dispatch<React.SetStateAction<AppState>>,
    isSignedIn: boolean
  ) => {
    setState((prev) => ({ ...prev, isSignedIn }));
  },
};
