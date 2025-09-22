// app/api/paddle-webhook/route.ts - Clean version
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { processPaddleWebhook } from "@/lib/paddle/paddleWebhook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("paddle-signature");

    if (process.env.ENVIRONMENT === "development") {
      // eslint-disable-next-line no-console
      console.log("Webhook received:", {
        hasSignature: !!signature,
        bodyLength: body.length,
      });
    }

    const result = await processPaddleWebhook(body, signature || "");

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (process.env.ENVIRONMENT === "development") {
      console.error("Webhook route error:", error);
    }

    return NextResponse.json(
      { error: "Webhook processing failed", details: errorMessage },
      { status: 500 }
    );
  }
}
