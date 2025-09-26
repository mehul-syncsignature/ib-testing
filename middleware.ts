import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth", "/", "/brandkit/linkedin"];

  // API routes that should be public
  const publicApiRoutes = ["/api/auth"];

  // Check if it's a public API route
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return;
  }

  // Handle API routes that require authentication
  if (pathname.startsWith("/api/")) {
    if (!isLoggedIn) {
      // Return 401 for unauthorized API requests
      return new NextResponse(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return;
  }

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and on auth page, redirect to dashboard
    if (isLoggedIn && pathname === "/auth") {
      return Response.redirect(new URL("/app/design-templates/social-banner", req.nextUrl.origin));
    }
    // If user is not authenticated and on root, redirect to auth
    if (!isLoggedIn && pathname === "/") {
      return Response.redirect(new URL("/auth", req.nextUrl.origin));
    }
    // If user is authenticated and on root, redirect to dashboard
    if (isLoggedIn && pathname === "/") {
      return Response.redirect(new URL("/app/design-templates/social-banner", req.nextUrl.origin));
    }
    return;
  }

  // All other routes require authentication
  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth", req.nextUrl.origin));
  }

  // Let authenticated users access protected routes
  return;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
