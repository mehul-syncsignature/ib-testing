// lib/auth/routes.ts

export interface RouteConfig {
  public: string[];
  onboardingRequired: string[];
  protected: string[];
}

export const routes: RouteConfig = {
  // Public routes - no authentication required
  public: [
    "/auth",
    "/app/logout",
    "/app/auth-redirect",
    "/api/auth/*", // NextAuth routes
    "/api/webhooks/paddle-webhook",
    "/app/checkout-complete",
  ],

  // Onboarding required routes - needs authentication but allows PENDING onboarding status
  onboardingRequired: ["/app/onboarding"],

  protected: [],
};

export const isPublicRoute = (pathname: string): boolean => {
  return routes.public.some((route) => {
    if (route.endsWith("/*")) {
      return pathname.startsWith(route.slice(0, -2));
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
};

export const isOnboardingRequiredRoute = (pathname: string): boolean => {
  return routes.onboardingRequired.some((route) => {
    if (route.endsWith("/*")) {
      return pathname.startsWith(route.slice(0, -2));
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
};

export const isProtectedRoute = (pathname: string): boolean => {
  return routes.protected.some((route) => {
    if (route.endsWith("/*")) {
      return pathname.startsWith(route.slice(0, -2));
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
};

export const requiresAuthentication = (pathname: string): boolean => {
  return isOnboardingRequiredRoute(pathname) || isProtectedRoute(pathname);
};

export const requiresCompleteOnboarding = (pathname: string): boolean => {
  return isProtectedRoute(pathname);
};
