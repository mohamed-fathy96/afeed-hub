export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Radius = {
  data: Coordinate[];
};
export type Store = {
  id: number;
  title: string;
  description: string;
  published: boolean;
  timezone: string;
  opensAt: number;
  closesAt: number;
  status: number;
  deliveryCharge: number;
  minimumOrderPrice: number;
  rating: number;
  countryId: number;
  freeDeliveryAfterAmount: number;
  deliveryMinutesThreshold: number;
  radius: string | Radius;
  hungerstationStoreKey: string;
  images: any[];
  OdooCompanyId: number;
  expressDeliveryStartsAt: number;
  expressDeliveryEndsAt: number;
  freeDeliveryAfterAmountScheduledDelivery: number;
  deliveryChargeForScheduledDelivery: number;
};
export enum StoreStatusEnum {
  OPEN = 0,
  CLOSE,
}
export const storeStatusArr = [
  {
    id: StoreStatusEnum.OPEN,
    name: "Open",
  },
  {
    id: StoreStatusEnum.CLOSE,
    name: "Close",
  },
];
