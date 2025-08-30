import { IPrimaryColor, IThemeMode } from "./theme";

export interface PaginationResponse<T> {
  items: T[];
  pageIndex: number;
  limit: number;
  total: number;
  page: number;
}
export type IThemeState = {
  mode: IThemeMode;
  primary: IPrimaryColor;
};
export type IGlobalState = {
  theme: IThemeState;
};
export type GlobalParamsUrl = {
  searchKey: string;
  page: number;
  limit?: number;
};
export type Images = {
  id: number;
  path: string;
};
