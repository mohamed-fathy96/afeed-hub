import { Images } from "./global";

export interface Brand {
  id: number;
  nameEn: string;
  nameAr: string;
  name?: string | null;
  image: string;
  images?: Images[];
  urlKey: string;
  sortOrder: number;
}
