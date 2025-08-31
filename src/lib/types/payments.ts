export interface PaymentTransaction {
  _id: string;
  transactionId: string;
  date: string;
  user: {
    _id: string;
    name: string;
  };
  creator: {
    _id: string;
    full_name: string;
  };
  product: {
    _id: string;
    product_title: string;
  };
  amount: number;
  paymentMethod: string;
  status: "captured" | "pending" | "failed" | "refunded";
}

interface PaymentMethodBreakdown {
  method: string;
  count: number;
  percent: number;
}

interface PaymentPanels {
  totalTransactionVolume: number;
  totalUniqueBuyers: number;
  paymentMethodBreakdown: PaymentMethodBreakdown[];
}

export interface CreatorUserPaymentsResponse {
  items: PaymentTransaction[];
  total: number;
  page: number;
  limit: number;
  panels: PaymentPanels;
}
export interface PendingPayment {
  bankWalletInfo: string | null;
  creatorId: string;
  creatorName: string;
  lastPayoutDate: string | null;
  totalOwed: number;
}

export interface PendingPaymentsResponse {
  items: PendingPayment[];
  total: number;
  page: number;
  limit: number;
}

export interface SubscriptionBilling {
  paymentRequestId: string;
  creatorId: string | null;
  creatorName: string;
  planId: string;
  planType: string;
  paymentMethod: string;
  lastPaymentDate: string;
  nextBillingDate: string;
  amount: number;
  status: "captured" | "pending" | "failed" | "timeout";
}

interface SubscriptionPanels {
  totalSubscriptionRevenue: number;
  activePaidCreators: number;
  failedPayments: number;
}

export interface SubscriptionBillingResponse {
  items: SubscriptionBilling[];
  total: number;
  page: number;
  limit: number;
  panels: SubscriptionPanels;
}

export interface SettlementLogItem {
  creatorId: string;
  creatorName: string;
  payoutAmount: number;
  payoutAt: string;
  payoutMethod: string;
  triggeredBy: {
    _id: string;
    name: string;
  };
  tableData: {
    id: number;
  };
}

export interface SettlementLogResponse {
  items: SettlementLogItem[];
  total: number;
  page: number;
  limit: number;
}
