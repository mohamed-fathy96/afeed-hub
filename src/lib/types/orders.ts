import { GlobalParamsUrl } from "./global";
import { ProductTypeEnum } from "./product";
export type Order = {
  id: number;
  createdAt: string; // ISO 8601 format
  deliverDateType: number; // 0 for "now", 1 for "later"
  deliverDateAt: string | null; // ISO 8601 format, can be null
  deliveredAt: string | null; // ISO 8601 format, can be null
  totalPrice: number;
  paidAmount: number;
  paidFromWallet: number;
  remainingAmountToPay: number;
  notes: string;
  status: number;
  invoicePdf: string;
  paymentMethod: number;
  externalOrderId?: number | null;
  logisticProvider: string | null;
  logisticProviderStatus: string;
  enableSendToLogisticProvider: boolean;
  orderSource?: number;
  store: {
    id: number;
    name: string;
  };
  distance?: {
    distanceKm: number;
    distanceText: string;
    durationMinutes: number;
    durationText: string;
  };
  userAddress: UserAddress;
  user: {
    name: string;
    phoneNumber: string;
  };
};

export type Store = {
  id: number;
  title: string;
  description: string;
  published: boolean;
  timezone: string;
  currency: string;
  status: string;
  delivery_charge: string;
  minimum_order_price: string;
  free_delivery_after_amount: string;
  phone_number: string | null;
  rating: string;
  delivery_minutes_threshold: number;
  radius: {
    data: Coordinate[];
  };
  class_name: string;
  created_at: string;
  country: Country;
  images: Image[];
  opens_at: string;
  closes_at: string;
  is_open: boolean;
  longitude: number;
  latitude: number;
  distance: number | null;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Country = {
  id: number;
  name: string;
  currency: string;
  driver_tips_options: string[];
  locale: string;
  payment_in_cash_enabled: boolean;
  payment_in_pos_enabled: boolean;
  payment_in_flutterwave_enabled: boolean;
  payment_in_stripe_enabled: boolean;
  payment_in_emis_enabled: boolean;
  payment_in_paytabs_enabled: boolean;
  contact_phone_number: string;
  whatsapp_phone_number: string;
  iso_name: string;
  phone_code: string;
  referral_minimum_order_amount: string;
  referral_discount_amount: string | null;
  referral_wallet_amount: string | null;
  faq_url: string;
  privacy_policy_url: string;
  cashback_percentage_for_completed_order: string;
  class_name: string;
  created_at: string;
  images: Image[];
};

export type User = {
  id: number;
  email: string;
  name: string;
  preferred_locale: string;
  status: string;
  allow_substitution: boolean;
  country_code: string | null;
  phone_number: string;
  contact_phone_number: string | null;
  referral_code: string;
  referred_by_id: number | null;
  sign_in_count: number;
  total_delivered_orders: number;
  created_via: string;
  class_name: string;
  created_at: string;
};

export type UserAddress = {
  contactName: string;
  addressName: string;
  country: string;
  address: string;
  additionalInstructions: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  streetName: string;
  buildingName: string;
  zone: string;
};

export type Category = {
  id: number;
  parent_category_id: number;
  title: string;
  description: string | null;
  class_name: string;
  created_at: string;
  images: Image[];
};

export type Image = {
  id: number;
  class_name: string;
  created_at: string;
  thumbnail: string;
  large: string;
  small: string;
  extra_small: string;
  original: string;
  extra_props: {
    identified: boolean;
  };
};

export enum OrderStatusEnum {
  PendingPayment = 0,
  Placed = 1,
  Pending = 2,
  ManualVerificationNeeded = 3,
  AwaitingConfirmation = 4,
  Processing = 5,
  Completed = 6,
  Cancelled = 7,
  Initiated = 8,
  Deleted = 9,
  DeliveryUnassigned = 10,
  DeliveryAssigned = 11,
  DeliveryAccepted = 12,
  DeliveryStarted = 13,
  DeliveryInProgress = 14,
  DeliveryFailed = 15,
  DeliveryDeclined = 16,
  DeliveryCancelled = 17,
}
export enum PaymentMethodEnum {
  cash = 1,
  posDevice,
  card,
}
export type IParamsUrl = GlobalParamsUrl & {
  status: number[];
  sortOrder?: "asc" | "desc";
  sortBy?: number;
  startDate?: string | null;
  endDate?: string | null;
  paymentMethod?: number | null;
  storeId?: number | null;
};
// create array of status with label and id for select dropdown
export const orderStatusOptions = [
  {
    id: OrderStatusEnum.PendingPayment,
    label: "Pending Payment",
    colorClass: "bg-yellow-500 text-white",
    tag: "pendingPayment",
  },
  {
    id: OrderStatusEnum.Placed,
    label: "Placed",
    colorClass: "bg-blue-500 text-white",
    tag: "placed",
  },
  {
    id: OrderStatusEnum.Pending,
    label: "Pending",
    colorClass: "bg-indigo-500 text-white",
    tag: "beingPicked",
  },
  {
    id: OrderStatusEnum.ManualVerificationNeeded,
    label: "Manual VerificationNeeded",
    colorClass: "bg-purple-500 text-white",
    tag: "picked",
  },
  {
    id: OrderStatusEnum.AwaitingConfirmation,
    label: "Awaiting Confirmation",
    colorClass: "bg-teal-500 text-white",
    tag: "onTheWay",
  },
  {
    id: OrderStatusEnum.Processing,
    label: "Processing",
    colorClass: "bg-green-500 text-white",
    tag: "delivered",
  },
  {
    id: OrderStatusEnum.Completed,
    label: "Completed",
    colorClass: "bg-red-500 text-white",
    tag: "canceled",
  },
  {
    id: OrderStatusEnum.Cancelled,
    label: "Cancelled",
    colorClass: "bg-red-500 text-white",
    tag: "initiated",
  },
  {
    id: OrderStatusEnum.Initiated,
    label: "Initiated",
    colorClass: "bg-red-500 text-white",
    tag: "deleted",
  },
  {
    id: OrderStatusEnum.Deleted,
    label: "Marked Deleted",
    colorClass: "bg-red-500 text-white",
    tag: "deleted",
  },
  {
    id: OrderStatusEnum.DeliveryUnassigned,
    label: "Delivery Unassigned",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryUnassigned",
  },
  {
    id: OrderStatusEnum.DeliveryAssigned,
    label: "Delivery Assigned",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryAssigned",
  },
  {
    id: OrderStatusEnum.DeliveryAccepted,
    label: "Delivery Accepted",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryAccepted",
  },
  {
    id: OrderStatusEnum.DeliveryStarted,
    label: "Delivery Started",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryStarted",
  },
  {
    id: OrderStatusEnum.DeliveryInProgress,
    label: "Delivery In Progress",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryInProgress",
  },
  {
    id: OrderStatusEnum.DeliveryFailed,
    label: "Delivery Failed",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryFailed",
  },
  {
    id: OrderStatusEnum.DeliveryDeclined,
    label: "Delivery Declined",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryDeclined",
  },
  {
    id: OrderStatusEnum.DeliveryCancelled,
    label: "Delivery Cancelled",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryCancelled",
  },
  {
    id: OrderStatusEnum.DeliveryUnassigned,
    label: "Delivery Unassigned",
    colorClass: "bg-red-500 text-white",
    tag: "deliveryUnassigned",
  },
];
export const paymentMethodOptions = [
  {
    id: PaymentMethodEnum.cash,
    label: "Cash",
    emoji: "💵",
  },
  {
    id: PaymentMethodEnum.posDevice,
    label: "Pos",
    emoji: "📱",
    iconName: "mobile",
  },
  {
    id: PaymentMethodEnum.card,
    label: "Online",
    emoji: "💳",
  },
];
export type Pricing = {
  unitPrice: number;
  grandTotal: number;
  quantity: number;
};

export interface OrderDetails {
  id: number;
  guid: string;
  userId: number;
  storeId: number;
  createdAt: string;
  status: number;
  notes: string;
  orderDeliveryAddress: OrderDeliveryAddress;
  totalPrice: number;
  subtotal: number;
  paymentType: number;
  grandTotal: number;
  deliveryFee: number;
  serviceFee: number;
  discounts: any[];
  discount: number;
  paidFromWallet: number;
  paidAmount: number;
  remainingAmountToPay: number;
  totalTaxes: number;
  minimumOrderAmount: number;
  paymentMethod: number;
  driverTips: number;
  products: Product[];
  orderCardDetails: OrderCardDetails | null;
  orderDriver: OrderDriver;
  user: OrderUser;
  zatcaReported: boolean;
  timeslot: TimeSlot;
  refundableAmount: number;
  canReissueVoucher: boolean;
  userAddress: UserAddress; 
  deliveryDateType: number;
}

interface OrderDeliveryAddress {
  name: string;
  country: string;
  streetName: string | null;
  buildingName: string | null;
  apartment: string | null;
  additionalInstructions: string;
  userName: string;
  address: string;
  contactPhoneNumber: string;
  lat: number;
  lng: number;
}

interface OrderPaymentDetails {
  paymentType: number;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  serviceFee: number;
  discounts: any[]; // Can be updated to a more specific type if needed
  discount: number;
  paidFromWallet: number;
  paidAmount: number;
  remainingAmountToPay: number;
  totalTaxes: number;
  minimumOrderAmount: number;
  paymentMethod: number;
  driverTips: number;
}
interface TimeSlot {
  id: number;
  title: string;
  fromTime: string;
  toTime: string;
  acceptFromTime: string;
  acceptToTime: string;
  saturday: boolean;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  isActive: boolean;
  isVisible: boolean;
}

interface Product {
  id: number;
  productId: number;
  name: string;
  image: string;
  imageUrl: string;
  sku: string;
  productStatus: number;
  skuBarcodeImage: string;
  pricing: ProductPricing;
  status: string;
  productType: ProductTypeEnum;
  eCards: any[];
  nameEn?: string;
}

interface ProductPricing {
  unitPrice: number;
  grandTotal: number;
  quantity: number;
}

interface OrderCardDetails {
  // Define properties if this is not always null
}

interface OrderDriver {
  id: number;
  thirdPartyDriverId: number | null;
  driverName: string | null;
  driverPhone: string | null;
  status: number;
}

interface OrderUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}
export enum OrderProductStatus {
  PendingPick = 0,
  Picked = 1,
  PendingUnavailable = 2,
  Unavailable = 3,
  PendingSubstitution = 4,
  Substituted = 5,
  SubstitutionDeclined = 6,
  Returned = 7,
  Removed = 8,
}
// create array of status with label and id for select dropdown
export const orderTrigger = [
  { label: "Place Order", value: 0 },
  { label: "Start Picking", value: 1 },
  { label: "Finish Picking", value: 2 },
  { label: "Start Delivery", value: 3 },
  { label: "Mark Delivered", value: 4 },
  { label: "Cancel", value: 5 },
  { label: "Return", value: 6 },
  { label: "Validate", value: 7 },
  { label: "No Action", value: 8 },
  { label: "Delete", value: 9 },
];
// order tracking status
export interface OrderTimelineStep {
  status: number;
  statusTitle: string;
  timestamp: string | null;
  isCompleted: boolean;
}

export interface OrderTracking {
  id: number;
  status: number;
  statusTitle: string;
  isDelivered: boolean;
  isCancelled: boolean;
  createdAt: string;
  estimatedDeliveryStart: string;
  estimatedDeliveryEnd: string;
  timeline: OrderTimelineStep[];
  driver: any | null;
}

export interface PaymentLog {
  id: number;
  storeId: number;
  userId: number;
  cartId: number;
  paymentId: number | null;
  vendorExtraId: string | null;
  cardId: number | null;
  requestStatus: number;
  paymentMethod: number;
  paymentVendor: number;
  paymentType: number;
  redirectRequired: boolean;
  redirectUrl: string | null;
  capturedOn: string | null;
  refundedOn: string | null;
  lastFour: string | null;
  amount: number;
  clientRedirectUrl: string;
  createdAt: string;
  updatedAt: string;
}
// Local enum for delivery date type
export enum DeliveryDateType {
  Now = 0,
  Later = 1,
}
// address list
export interface AddressList {
  additionalInstructions: string;
  addressLine1: string;
  buildingName: string | null;
  contactPhoneNumber: string;
  coordinate: Coordinate;
  id: number;
  isDefault: boolean;
  name: string;
  storeId: number;
  streetName: string | null;
  zone: string | null;
}
