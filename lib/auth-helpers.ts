import { auth } from "@/auth";
import { serverDb } from "@/lib/drizzle/server";
import { users, plans } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { User } from "@/app/api/user/route";

/**
 * Get the authenticated user from the session and database
 * This function should be used in API routes to get user data
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    // Query our custom User table with plan data using the NextAuth user ID
    const userData = await serverDb
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileUrl: users.profileUrl,
        planId: users.planId,
        onboardingStatus: users.onboardingStatus,
        // Plan data
        plan: {
          id: plans.id,
          name: plans.name,
          description: plans.description,
          planType: plans.planType,
          allowedTemplates: plans.allowedTemplates,
        },
      })
      .from(users)
      .leftJoin(plans, eq(users.planId, plans.id))
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userData.length) {
      return null;
    }

    const user = userData[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl,
      onboardingStatus: user.onboardingStatus,
      plan: user.plan?.id
        ? {
            id: user.plan.id,
            name: user.plan.name,
            description: user.plan.description,
            planType: user.plan.planType,
            allowedTemplates:
              (user.plan.allowedTemplates as Record<string, number[]>) || {},
          }
        : null,
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

/**
 * Authentication middleware for API routes
 * Returns the authenticated user or throws an error
 */
export async function requireAuth(): Promise<User> {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

/**
 * Helper to handle authentication errors in API routes
 */
export function handleAuthError(error: unknown) {
  if (error instanceof Error && error.message === "Authentication required") {
    return Response.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  console.error("API error:", error);
  return Response.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
