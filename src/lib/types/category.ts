import { GlobalParamsUrl, Images } from "./global";

export type Category = {
  id: number;
  categoryType: number;
  parentCategoryId?: number;
  images: Images[];
  title: string;
  titleAr: string;
  urlKey: string;
  urlKeyAr: string;
  description: string;
  descriptionAr: string;
  categoryStores: number[];
  sort: number;
  offersPageSortOrder: number;
  isActive?: boolean;
  parentCategoryTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  metaDescription?: string;
  metaDescriptionAr?: string;
  metaKeywords?: string;
  metaKeywordsAr?: string;
  metaTitle?: string;
  metaTitleAr?: string;
  isFeaturedCategory?: boolean;
  isBestSellerCategory?: boolean;
  hasChildren?: boolean;
};

export enum CategoryTypeEnum {
  Normal,
  Lifestyle,
  Boutique,
}
export type IEcommerceCategoryType = {
  id: number;
  title: string;
};

export type IParamsUrl = GlobalParamsUrl & {
  parentCategoryId?: number;
  type?: number;
};
