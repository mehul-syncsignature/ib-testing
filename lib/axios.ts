import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Simple function to get NextAuth session when needed
const getNextAuthSession = async () => {
  if (typeof window === "undefined") return null;

  try {
    const { getSession } = await import("next-auth/react");
    return await getSession();
  } catch (error) {
    if (process.env.ENVIRONMENT === "development") {
      console.error("Failed to get NextAuth session:", error);
    }
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simplified auth token getter using NextAuth
const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  try {
    const session = await getNextAuthSession();
    if (!session?.user) return null;

    // NextAuth sessions don't have access tokens by default
    // For API authentication, we rely on cookies/server-side session validation
    // Return a placeholder that indicates we have a valid session
    return "nextauth-session";
  } catch (error) {
    if (process.env.ENVIRONMENT === "development") {
      console.error("Error getting NextAuth session:", error);
    }
    return null;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token (only on client side)
    if (typeof window !== "undefined" && config.headers) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        // Continue without auth header if there's an error
        if (process.env.ENVIRONMENT === "development") {
          console.warn("Failed to get auth token for request:", error);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle auth errors on client side
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Don't redirect if we're on auth pages (login/signup attempts should show errors inline)
      const isAuthPage = window.location.pathname.includes("/auth") || 
                        window.location.pathname === "/" ||
                        error.config?.url?.includes("/auth/login") ||
                        error.config?.url?.includes("/auth/signup");
      
      if (!isAuthPage) {
        try {
          // Use NextAuth signOut
          const { signOut } = await import("next-auth/react");
          await signOut({ redirect: false });

          // Redirect to home if not already there
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        } catch (signOutError) {
          if (process.env.ENVIRONMENT === "development") {
            console.error("Error during sign out:", signOutError);
          }
          // Fallback: just redirect
          window.location.href = "/";
        }
      }
    }

    // Handle network errors
    if (!error.response && process.env.ENVIRONMENT === "development") {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
