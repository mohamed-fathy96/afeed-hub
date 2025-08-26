import { IPrimaryColor, IThemeMode } from "./theme";

export interface PaginationResponse<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  pageNumber: number;
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
  pageNumber: number;
  pageSize?: number;
};
export type Images = {
  id: number;
  path: string;
};
