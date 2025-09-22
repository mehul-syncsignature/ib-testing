// lib/paddle/helper/findUserInAuth.ts

import { serverDb } from "@/lib/drizzle/server";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

type PaddleEventData = {
  custom_data?: { userId?: string; planId?: string };
  customer?: { email?: string };
};

export async function findUserInDatabase(
  data: PaddleEventData
): Promise<{ id: string } | null> {
  const userId = data.custom_data?.userId;

  if (userId) {
    try {
      const user = await serverDb
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length > 0) {
        return user[0];
      }
    } catch (error) {
      console.error("Database error:", error);
    }
  }

  return null;
}
