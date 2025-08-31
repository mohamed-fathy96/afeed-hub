import { GlobalParamsUrl } from "./global";

export interface UserDetails {
  profile: {
    _id: string;
    full_name: string;
    email: string;
    profile_pic: string;
    phone_number: string;
    service: string;
    status: "A" | "I" | "B" | "D";
  };
  purchases: {
    items: Array<{
      _id: string;
      creator: {
        _id: string;
        name: string;
      };
      product: {
        _id: string;
        product_title: string;
      };
      status: "captured" | "refunded" | "failed";
      purchaseDate: string;
      amount: number;
    }>;
    total: number;
  };
}

export type IParamsUrl = GlobalParamsUrl & { hubUsers?: string };

export type Transaction = {
  id: number;
  userWalletId: number;
  transactionType: "OrderPay" | "OrderRefund" | string;
  status: "Success" | "Pending" | "Failed" | string;
  amount: number;
  balance: number;
  createdAt: string;
  transactableType: "Order" | string;
  transactableId: number;
  isOutgoing: boolean;
  remarks: string;
};
export type ITransactionsParamsUrl = GlobalParamsUrl & {
  startDate: string;
  endDate: string;
};
export interface User {
  created_at: string;
  email: string;
  name: string;
  phone_number: string;
  profile_pic: string;
  status: "A" | "I" | "B" | "D";
  totalPurchases: number;
  totalSpent: number;
  _id: string;
}
