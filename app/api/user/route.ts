// app/api/user/route.ts

import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  requireAuth,
  handleAuthError,
} from "@/lib/auth-helpers";
import { serverDb } from "@/lib/drizzle/server";
import { users, plans } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { createMailerLiteSubscriber } from "@/lib/mailerlite/subscriber";

export interface UserPlan {
  id: number;
  name: string;
  description: string | null;
  planType: string; // "free", "one-time", "subscription"
  allowedTemplates: Record<string, number[]>;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileUrl: string | null;
  plan: UserPlan | null;
  onboardingStatus: "PENDING" | "COMPLETE";
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with plan data using Drizzle
    const userData = await serverDb
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileUrl: users.profileUrl,
        createdAt: users.createdAt,
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
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rawUser = userData[0];

    // Transform the response to match the User interface
    const transformedUser: User = {
      id: rawUser.id,
      email: rawUser.email,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      profileUrl: rawUser.profileUrl,
      onboardingStatus: rawUser.onboardingStatus,
      plan: rawUser.plan?.id
        ? {
            id: rawUser.plan.id,
            name: rawUser.plan.name,
            description: rawUser.plan.description,
            planType: rawUser.plan.planType,
            allowedTemplates:
              (rawUser.plan.allowedTemplates as Record<string, number[]>) || {},
          }
        : null,
    };

    return NextResponse.json(transformedUser, { status: 200 });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();

    // Parse the request body and validate it's an object
    const body = await request.json();

    // Type guard to ensure body is an object
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate the update data
    const allowedUpdates = [
      "firstName",
      "lastName",
      "profileUrl",
      "onboardingStatus",
    ];

    interface UpdateData {
      firstName?: string;
      lastName?: string;
      profileUrl?: string;
      onboardingStatus?: "PENDING" | "COMPLETE";
    }

    const updateData: UpdateData = {};

    Object.keys(body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updateData[key as keyof UpdateData] = body[key as keyof typeof body];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      );
    }

    // Validate onboarding_status values
    if (
      updateData.onboardingStatus &&
      !["PENDING", "COMPLETE"].includes(updateData.onboardingStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid onboarding status" },
        { status: 400 }
      );
    }

    // Update the user using Drizzle
    const updatedUsers = await serverDb
      .update(users)
      .set(updateData)
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileUrl: users.profileUrl,
        createdAt: users.createdAt,
        planId: users.planId,
        onboardingStatus: users.onboardingStatus,
      });

    if (!updatedUsers.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = updatedUsers[0];

    // Get plan data if user has a plan
    let planData = null;
    if (updatedUser.planId) {
      const planResults = await serverDb
        .select({
          id: plans.id,
          name: plans.name,
          description: plans.description,
          planType: plans.planType,
          allowedTemplates: plans.allowedTemplates,
        })
        .from(plans)
        .where(eq(plans.id, updatedUser.planId))
        .limit(1);

      if (planResults.length) {
        const plan = planResults[0];
        planData = {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          planType: plan.planType,
          allowedTemplates:
            (plan.allowedTemplates as Record<string, number[]>) || {},
        };
      }
    }

    // Transform the response to match the User interface
    const transformedUser: User = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profileUrl: updatedUser.profileUrl,
      onboardingStatus: updatedUser.onboardingStatus,
      plan: planData,
    };

    // Create MailerLite subscriber when onboarding is completed
    if (updateData.onboardingStatus === "COMPLETE") {
      try {
        await createMailerLiteSubscriber({
          email: transformedUser.email,
          firstName: transformedUser.firstName || undefined,
          lastName: transformedUser.lastName || undefined,
          status: "active",
        });
      } catch (error) {
        // Log error but don't fail the user update process
        if (process.env.NODE_ENV === "development") {
          console.error(
            "Failed to create MailerLite subscriber during onboarding completion:",
            error
          );
        }
      }
    }

    // Create response with updated user data
    return NextResponse.json(
      {
        success: true,
        data: transformedUser,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
