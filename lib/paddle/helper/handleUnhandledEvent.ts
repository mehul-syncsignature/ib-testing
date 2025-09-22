// lib/paddle/helper/handleUnhandledEvent.ts

import { PaddleWebhookEvent } from "@/types/paddle";

export async function handleUnhandledEvent(
  event: PaddleWebhookEvent
): Promise<void> {
  if (process.env.ENVIRONMENT === "development") {
    // eslint-disable-next-line no-console
    console.log(`Unhandled event type: ${event.event_type}`);
  }

  // You can add logging service here if needed
  // await logService.logUnhandledEvent(event);
}
