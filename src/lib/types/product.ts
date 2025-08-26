import exp from "constants";
import { GlobalParamsUrl } from "./global";

export type Product = {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  sku: string;
  urlKey: string;
  skuBarcode?: string;
  tags?: string[] | null;
  images?: { id: number; path: string; isThumbnail?: boolean }[];
  brand?: { id: number; nameEn: string } | null;
  imagePath?: string | null;
  descriptionAr: string;
  createdAt?: string; // ISO Date string
  updatedAt?: string; // ISO Date string
  cost: number;
  price: number;
  trending?: boolean;
  excludedFromDiscounts?: boolean;
  sort: number;
  productType: number;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaTitleAr?: string;
  metaKeywordsAr?: string;
  metaDescriptionAr?: string;
};
export type ProductAvailability = {
  id: number;
  storeName: string;
  productId: number;
  cost: number;
  originalPrice: number;
  discountedPrice: number;
  price: number;
  quantity: number;
  recommended: boolean;
  shelfZone?: string;
  shelfSection?: string;
  maxAllowedQuantity: number;
  minimumAllowedAge: number;
  published: boolean;
  publishedAt: string;
  lastZeroQuantityAt: string;
  isHungerStation: boolean;
  partnerPricing: any;
  baseCurrencySymbol: string;
  allowDiscount: boolean;
  discountFrom?: string;
  discountTo?: string;
  scheduledDiscountedPrice?: number;
  previousStockChangeSource?: number;
  lastStockChangeDate?: string;
  previousStock?: number;
};
export enum ProductSort {
  Default = 0,
  PriceAsc = 1,
  PriceDesc = 2,
  CreatedDateAsc = 3,
  CreatedDateDesc = 4,
  QuantityAsc = 5,
  QuantityDesc = 6,
}
export enum ProductTypeFilter {
  All = -1,
  Normal = 0,
  ECard = 1,
}
export type ParamsUrl = GlobalParamsUrl & {
  categoryId?: string;
  sort?: ProductSort;
  storeId?: string;
  brandId?: string;
  type?: string;
};
export enum ProductTypeEnum {
  Normal,
  ECard,
}
export type EProduct = {
  id: number;
  sku: string;
  name: string;
  price: number;
  baseCurrencySymbol: string;
  supplierName: string;
};
export enum MediaTypeEnum {
  IMAGE,
  VIDEO,
}
