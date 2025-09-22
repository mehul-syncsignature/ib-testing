import { auth } from "@/auth";
import { serverDb } from "@/lib/drizzle/server";
import { users, plans, planLimits } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileUrl: string | null;
  planId: string | null;
  onboardingStatus: "PENDING" | "COMPLETE";
  plan?: {
    id: string;
    name: string;
    description: string | null;
    planType: string;
    limits: Array<{
      allowedTemplates: Record<string, number[]>;
    }> | null;
  } | null;
}

/**
 * Get the authenticated user from the session and database
 * This function should be used in API routes to get user data
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
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
        createdAt: users.createdAt,
        // Plan data
        plan: {
          id: plans.id,
          name: plans.name,
          description: plans.description,
          planType: plans.planType,
        },
        // Plan limits
        planLimits: {
          allowedTemplates: planLimits.allowedTemplates,
        },
      })
      .from(users)
      .leftJoin(plans, eq(users.planId, plans.id))
      .leftJoin(planLimits, eq(plans.id, planLimits.planId))
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
      planId: user.planId,
      onboardingStatus: user.onboardingStatus,
      plan: user.plan?.id
        ? {
            id: user.plan.id,
            name: user.plan.name,
            description: user.plan.description,
            planType: user.plan.planType,
            limits: user.planLimits?.allowedTemplates
              ? [{ allowedTemplates: user.planLimits.allowedTemplates as Record<string, number[]> }]
              : null,
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
export async function requireAuth(): Promise<AuthenticatedUser> {
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