import { GlobalParamsUrl } from "./global";
export type Creator = {
  _id: string;
  full_name: string;
  profile_pic: string;
  service: string;
  tier: "Free" | "Basic" | "Premium";
  phone_number: string;
  email: string;
  status: "A" | "I";
  statusLabel: "Active" | "Inactive";
  created_at: string;
};

export enum PaymentMethodEnum {
  cash = 1,
  posDevice,
  card,
}
export type IParamsUrl = GlobalParamsUrl & {
  status: "" | "A" | "B" | "D" | "I";
  tier: "" | "basic" | "Premium" | "Growth";
};
// create array of status with label and id for select dropdown
export interface CreatorDetails {
  profile: {
    _id: string;
    full_name: string;
    email: string;
    profile_pic: string;
    phone_number: string;
    service: string;
    status: "A" | "I" | "B" | "D";
  };
  subscription: {
    planType: "Free" | "Basic" | "Premium" | "Growth";
    dueDate: string;
  };
  metrics: {
    totalRevenue: number;
    revenue30d: number;
    totalProducts: number;
    totalCustomers: number;
    lastPayoutAmount: number;
    lastPayoutDate: string;
    pendingPayoutAmount: number;
  };
  paymentsHistory: Array<{
    payoutDate: string;
    amount: number;
    paymentMethod: string;
    triggeredBy?: string;
  }>;
}
export interface Product {
  _id: string;
  product_title: string;
  type: "session" | "normal";
  status: "published" | "archived" | "draft";
  price: number;
  access: "Paid" | "Free";
  revenue: number;
}
