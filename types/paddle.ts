// types/paddle.ts
export interface PaddleCustomer {
  id: string;
  email?: string;
}

export interface PaddleCustomData {
  userId?: string;
  planId?: string;
}

export interface PaddlePrice {
  id: string;
  name: string;
  custom_data?: PaddleCustomData;
}

export interface PaddleSubscriptionItem {
  price: PaddlePrice;
  status: string;
  quantity: number;
}

export interface PaddleSubscriptionData {
  id: string;
  customer?: PaddleCustomer;
  custom_data?: PaddleCustomData;
  status?: string;
  items: PaddleSubscriptionItem[];
}

export interface PaddleTransactionData {
  id: string;
  customer?: PaddleCustomer;
  custom_data?: PaddleCustomData;
  status?: string;
  items: PaddleSubscriptionItem[];
}

export interface PaddleWebhookEvent {
  event_type: string;
  data: PaddleSubscriptionData | PaddleTransactionData;
}

export type PaddleEventType =
  | "subscription.created"
  | "subscription.updated"
  | "subscription.cancelled"
  | "subscription.paused"
  | "transaction.completed";
