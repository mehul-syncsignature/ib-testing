// lib/paddle/helper/verifySignature.ts
import crypto from "crypto";

export function verifyPaddleSignature(
  body: string,
  signature: string
): boolean {
  try {
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("PADDLE_WEBHOOK_SECRET not configured");
    }

    // Paddle signature format: "ts=timestamp;h1=signature"
    const sigParts = signature.split(";");
    const timestamp = sigParts
      .find((part) => part.startsWith("ts="))
      ?.split("=")[1];
    const hash = sigParts.find((part) => part.startsWith("h1="))?.split("=")[1];

    if (!timestamp || !hash) {
      throw new Error("Invalid signature format");
    }

    // Create the signed payload (timestamp + body)
    const signedPayload = timestamp + ":" + body;

    // Create HMAC using SHA256
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload, "utf8")
      .digest("hex");

    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (error) {
    if (process.env.ENVIRONMENT === "development") {
      // eslint-disable-next-line no-console
      console.error("Signature verification error:", error);
    }
    return false;
  }
}
