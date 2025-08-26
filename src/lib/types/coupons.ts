import { GlobalParamsUrl } from "./global";

export enum CouponType {
  Percentage = 0,
  FreeDelivery = 1,
  PercentageWithFreeDelivery = 4,
  PercentageIncludingDelivery = 5,
  FixedAmount = 6,
  FixedAmountWithFreeDelivery = 7,
}

export enum DeliveryDateType {
  Now = 0,
  Later = 1,
}

export type Coupon = {
  id: number;
  name: string;
  code: string;
  discountAmount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  maxUsePerUser: number;
  totalUsePerCoupon: number;
  couponType: CouponType;
  minimumOrderPrice: number;
  isExpired: boolean;
  createdAt: string; // ISO date string
  usageCount: number;
  // Category selection fields
  couponCategoryType?: CouponCategoryType; // 'all' means no category restrictions
  categories?: number[]; // Array of category IDs
  // Delivery type field
  couponDeliveryType?: DeliveryDateType;
};

export type IParamsUrl = GlobalParamsUrl & {
  isExpired?: number;
};
export enum CouponCategoryType {
  None,
  Include,
  Exclude,
}
