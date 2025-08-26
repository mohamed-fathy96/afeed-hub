import { GlobalParamsUrl } from "./global";

export type User = {
  id: number;
  name: string;
  archived: boolean;
  createdAt: string;
  email: string;
  phoneNumber: string;
  lastSignInAt: string;
  uuid: string;
  countryCode: string;
  smsCode: string;
  smsCodeExpiresAt: string;
  blocked: boolean;
};

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
