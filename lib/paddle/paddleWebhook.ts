// lib/paddle/paddleWebhook.ts
import {
  PaddleWebhookEvent,
  PaddleSubscriptionData,
  PaddleTransactionData,
} from "@/types/paddle";
import { handleSubscriptionCreated } from "./helper/handleSubscriptionCreated";
import { handleTransactionCompleted } from "./helper/handleTransactionCompleted";
import { verifyPaddleSignature } from "./helper/verifySignature";
import { handleUnhandledEvent } from "./helper/handleUnhandledEvent";
import { handleSubscriptionUpdated } from "./helper/handleSubscriptionUpdated";

// Event handlers map using object instead of switch case
const eventHandlers = {
  "subscription.created": (data: PaddleSubscriptionData) =>
    handleSubscriptionCreated(data),
  "subscription.updated": (data: PaddleSubscriptionData) =>
    handleSubscriptionUpdated(data),
  "subscription.cancelled": (data: PaddleSubscriptionData) =>
    handleSubscriptionCreated(data), // Downgrade logic same as created
  "subscription.paused": (data: PaddleSubscriptionData) =>
    handleSubscriptionCreated(data), // Downgrade logic same as created
  "transaction.completed": (data: PaddleTransactionData) =>
    handleTransactionCompleted(data),
  default: (event: PaddleWebhookEvent) => handleUnhandledEvent(event),
} as const;

export async function processPaddleWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify signature
    if (!signature) {
      return { success: false, error: "No signature provided" };
    }

    if (!verifyPaddleSignature(body, signature)) {
      return { success: false, error: "Invalid signature" };
    }

    const event: PaddleWebhookEvent = JSON.parse(body);

    // Use object map instead of switch case
    const handler =
      eventHandlers[event.event_type as keyof typeof eventHandlers] ||
      eventHandlers.default;

    await handler(
      event.data as PaddleSubscriptionData &
        PaddleTransactionData &
        PaddleWebhookEvent
    );

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { success: false, error: errorMessage };
  }
}
