export interface LineItem {
  amount_total: number;
  quantity: number;
  description: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface StripeSessionData {
  line_items: { data: LineItem[] };
  id: string;
  customer_details: { email: string; name: string };
  status: "complete" | "open";
  shipping_details: { address: Address; name: string };
  amount_total: number;
  payment_intent: string;
}
