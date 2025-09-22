// contexts/AppContext/helpers/initialState.ts
import { AppState } from "../types";

export const initialState: AppState = {
  loadingCategories: false,
  loadingTemplates: false,
  currentUser: null,
  loadingUser: false,
  error: null,
  headshot: {
    imagePosition: { x: 0, y: 0 },
    imageScale: 1,
    opacity: 1,
  },
  sectionsData: [],

  isLoading: false,
  isPremiumUser: false,
  isSignedIn: false,
};
