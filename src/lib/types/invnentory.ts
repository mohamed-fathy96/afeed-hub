import { GlobalParamsUrl } from "./global";

export interface Invnetory {
  fileName: string;
  s3FilePath: string;
  status: BulkUpdateStatus;
  createdById: number;
  createdByEmail: string;
  createdByName: string;
  completedAt: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  s3FileFullPath: string;
  errorFileFullPath: string;
  errorFilePath: string;
}
export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  storeId: number;
  storeName: string;
  productId: number;
  cost: number;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  shelfZone: string;
  shelfSection: string;
  published: boolean;
  lastZeroQuantityAt: string;
  isHungerStation: boolean;
  partnerPricing: number;
  imagePath: string;
}

export enum BulkUpdateStatus {
  Pending,
  Processing,
  Completed,
  Failed,
}
export type IParamsUrl = GlobalParamsUrl & {
  storeId?: string;
  status?: string;
  quantityLessThan?: string;
};
