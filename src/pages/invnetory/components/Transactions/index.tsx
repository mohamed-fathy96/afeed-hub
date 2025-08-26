import { useToast } from "@app/helpers/hooks/use-toast";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { InventoryItem } from "@app/lib/types/invnentory";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { InvnetoryService } from "@app/services/actions";
import { Card, CardBody } from "@app/ui";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import DateRangePickerComponent from "@app/ui/DateRangePicker/DateRangePicker";
import { SectionLoader } from "@app/ui/SectionLoader";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  inventoryData: InventoryItem | null;
}
interface TransactionParams {
  pageNumber: number;
  pageSize: number;
  storeId: string | number;
  productId: string | number;
  startDate: string;
  endDate: string;
}

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "Date",
    field: "date",
    render: (rowData: any) => formatToLocalTime(rowData?.date),
  },
  {
    title: "Order ID",
    field: "orderId",
    render: (rowData: any | null) => rowData?.orderId || "N/A",
  },
  {
    title: "Product SKU",
    field: "productSku",
  },
  {
    title: "Credit",
    field: "credit",
  },
  {
    title: "Debit",
    field: "debit",
  },
  {
    title: "Balance",
    field: "balance",
  },
  {
    title: "Transaction Type",
    field: "transactionType",
  },
  {
    title: "Notes",
    field: "notes",
  },
  {
    title: "User ID",
    field: "userId",
  },
];
export const Transactions = ({ inventoryData }: Props) => {
  const location = useLocation();
  const [params, setParams] = useState<TransactionParams>({
    pageNumber: 1,
    pageSize: 50,
    productId: inventoryData?.productId || "",
    storeId: inventoryData?.storeId || "",
    startDate: "",
    endDate: "",
  });
  const toast = useToast();
  const [dataList, setDataList] = useState<PaginationResponse<any[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const handleDateRange = (item: any) => {
    setDateRange(item?.selection);
  };
  const fetchData = async (params?: TransactionParams) => {
    setIsLoaderOpen(true);
    try {
      const res = await InvnetoryService.getInventoryTransactions(params);
      setDataList(res?.data);
      setIsLoaderOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to fetch inventory transactions"
      );
      setIsLoaderOpen(false);
    }
  };
  useEffect(() => {
    if (inventoryData && location) {
      const queryParams: any = location.search
        ? convertQueryParamsIntoObject(location.search)
        : params;
      const updatedParams: TransactionParams = {
        productId: inventoryData?.productId || "",
        storeId: inventoryData?.storeId || "",
        startDate: queryParams?.startDate || "",
        endDate: queryParams?.endDate || "",
        pageNumber: queryParams.pageNumber,
        pageSize: queryParams.pageSize,
      };
      setParams(updatedParams);
      fetchData(updatedParams);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, inventoryData]);
  const handleApplyDateRange = () => {
    setParams({
      ...params,
      startDate: dayjs(dateRange?.startDate || new Date()).format("YYYY-MM-DD"),
      endDate: dayjs(dateRange?.endDate || new Date()).format("YYYY-MM-DD"),
    });
    fetchData({
      ...params,
      startDate: dayjs(dateRange?.startDate || new Date()).format("YYYY-MM-DD"),
      endDate: dayjs(dateRange?.endDate || new Date()).format("YYYY-MM-DD"),
    });
  };

  return (
    <Card className="bg-base-100">
      <CardBody>
        {isLoaderOpen ? (
          <SectionLoader />
        ) : (
          <>
            <div className="justify-start flex">
              <div
                className="relative border border-base-content rounded-md py-2 px-3 text-sm cursor-pointer"
                onClick={() => setShowDatePicker((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowDatePicker((prev) => !prev);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 16h14M5 21h14"
                    />
                  </svg>
                  {`${
                    dayjs(dateRange?.startDate)?.format("DD MMM YYYY") || ""
                  } - ${
                    dayjs(dateRange?.endDate)?.format("DD MMM YYYY") || ""
                  }`}
                </div>
              </div>
              {showDatePicker && (
                <DateRangePickerComponent
                  setShowDatePicker={setShowDatePicker}
                  handleDateRangeChange={handleDateRange}
                  handleApplyDateRange={handleApplyDateRange}
                  dateRange={dateRange}
                />
              )}
            </div>
            <DataGridTable
              data={dataList?.data || []}
              columns={columns}
              options={{ actionsColumnIndex: -1 }}
            />
            <Pagination
              pageCount={dataList?.totalPages}
              pageNumber={dataList?.pageNumber}
              pageSize={params.pageSize}
              setParams={setParams}
              params={params}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};
