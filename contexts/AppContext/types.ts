// contexts/AppContext/types.ts
import { Position } from "@/types";
import { SectionConfig } from "@/common/constants/unified-bento-config";

export interface Headshot {
  imagePosition: Position;
  imageScale: number;
  opacity?: number;
}

export interface UserPlan {
  id: number;
  name: string;
  description: string | null;
  planType: string;
  allowedTemplates: Record<string, number[]>;
}

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  profileUrl: string | null;
  createdAt: string;
  plan: UserPlan | null;
  onboardingStatus: "PENDING" | "COMPLETE";
}

export interface AppState {
  loadingCategories: boolean;
  loadingTemplates: boolean;
  currentUser: AppUser | null;
  loadingUser: boolean;
  error: string | null;
  headshot: Headshot;
  sectionsData: SectionConfig[];

  // Auth state
  isLoading: boolean;
  isPremiumUser: boolean;
  isSignedIn: boolean;
}

export interface AppContextType {
  state: AppState;
  refreshAuth: () => Promise<void>;
  // Asset & Template actions
  setCategoriesLoading: (isLoading: boolean) => void;
  setTemplatesLoading: (isLoading: boolean) => void;
  setUserLoading: (isLoading: boolean) => void;
  setCurrentUser: (user: AppUser | null) => void;
  setError: (errorMessage: string | null) => void;
  // Headshot actions
  setHeadshot: (style: Partial<Headshot>) => void;
  setImagePosition: (position: Position) => void;
  setImageScale: (scale: number) => void;
  setOpacity: (opacity: number) => void;
  resetHeadshot: () => void;
  // Sections data actions
  setSectionsData: (sections: SectionConfig[]) => void;
  // Auth actions
  setIsLoading: (isLoading: boolean) => void;
  setIsPremiumUser: (isPremium: boolean) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
}
