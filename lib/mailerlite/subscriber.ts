import MailerLiteClient from "./client";

interface CreateSubscriberParams {
  email: string;
  firstName?: string;
  lastName?: string;
  status?: "active" | "unsubscribed" | "unconfirmed" | "bounced" | "junk";
}

function getEnvironmentGroup(): string[] {
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!groupId) {
    return [];
  }
  return [groupId];
}

interface SubscriberResult {
  success: boolean;
  data?: {
    id: string;
    email: string;
    status: string;
    [key: string]: unknown;
  };
  error?: string;
}

export async function createMailerLiteSubscriber(
  params: CreateSubscriberParams
): Promise<SubscriberResult> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    console.warn(
      "MailerLite API key not configured. Skipping subscriber creation."
    );
    return {
      success: false,
      error: "MailerLite API key not configured",
    };
  }

  try {
    const client = new MailerLiteClient(apiKey);

    // Create/upsert subscriber (MailerLite handles existing subscribers automatically)
    const groups = getEnvironmentGroup();
    const subscriberData = {
      email: params.email,
      status: params.status || ("active" as const),
      fields: {
        ...(params.firstName && { name: params.firstName }),
        ...(params.lastName && { last_name: params.lastName }),
      },
      ...(groups.length > 0 && { groups }),
    };

    const response = await client.createSubscriber(subscriberData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Failed to create MailerLite subscriber:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function updateMailerLiteSubscriber(
  email: string,
  updateData: Partial<CreateSubscriberParams>
): Promise<SubscriberResult> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    console.warn(
      "MailerLite API key not configured. Skipping subscriber update."
    );
    return {
      success: false,
      error: "MailerLite API key not configured",
    };
  }

  try {
    const client = new MailerLiteClient(apiKey);

    const groups = getEnvironmentGroup();
    const subscriberData = {
      ...(updateData.status && { status: updateData.status }),
      fields: {
        ...(updateData.firstName && { name: updateData.firstName }),
        ...(updateData.lastName && { last_name: updateData.lastName }),
      },
      ...(groups.length > 0 && { groups }),
    };

    const response = await client.updateSubscriber(email, subscriberData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
