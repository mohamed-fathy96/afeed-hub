export type Image = {
  id: number;
  path: string;
};

export type Slider = {
  id: number;
  sortOrder: number;
  link: string;
  slug: string;
  sliderType: number;
  sliderPosition: number;
  sliderLocation: number;
  widthRatio: number;
  heightRatio: number;
  label: string;
  storeId: number;
  sliderStores: any[];
  images: Image[];
  title: string;
  titleAr: string;
  createdAt: string;
};
