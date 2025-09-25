// lib/paddle/helper/handleSubscriptionCreated.ts

import { PaddleSubscriptionData } from "@/types/paddle";
import { serverDb } from "@/lib/drizzle/server";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { findUserInDatabase } from "./findUserInAuth";

export async function handleSubscriptionCreated(
  data: PaddleSubscriptionData
): Promise<void> {
  try {
    const user = await findUserInDatabase(data);

    if (user) {
      const planId = Number(data.items?.[0]?.price?.custom_data?.planId);

      if (!planId) {
        throw new Error("planId not found in price custom_data");
      }

      await serverDb.update(users).set({ planId }).where(eq(users.id, user.id));

      if (process.env.ENVIRONMENT === "development") {
        console.log(`Updated user ${user.id} planId to: ${planId}`);
      }
    } else {
      const errorMsg = `User not found for userId: ${data.custom_data?.userId} or email: ${data.customer?.email}`;
      if (process.env.ENVIRONMENT === "development") {
        console.error(errorMsg);
      }
      throw new Error(errorMsg);
    }
  } catch (error) {
    if (process.env.ENVIRONMENT === "development") {
      console.error("Error in handleSubscriptionCreated:", error);
    }
    throw error;
  }
}
