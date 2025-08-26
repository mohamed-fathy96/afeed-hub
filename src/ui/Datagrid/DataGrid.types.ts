import { Options } from "material-table";

export interface DataGridProps {
  data: any[];
  columns: any[];
  options?: Options<any>;
  actions?: any[];
  onRowClick?: (rowData: any, rowMeta: any) => void;
  onSelectionChange?: (rows: any) => void;
  onUpdate?: (newData: any, oldData: any) => Promise<void>;
  title?: string;
}
export interface IDataGridHeaderProps {
  title: string;
  btnTitle?: string;
  addNewUrl?: string;
  handleSearch?: React.ChangeEventHandler<HTMLInputElement>;
  params?: any;
  isSearchAllowed?: boolean;
  isLink?: boolean;
  handleClick?: () => void;
  children?: any;
}
export interface PaginationComponentProps {
  pageCount?: number;
  pageNumber?: number;
  pageSize?: number;
  setParams?: (params: any) => void;
  params?: any;
}
