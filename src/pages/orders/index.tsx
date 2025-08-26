import React, { useState, useEffect } from "react";
import {
  convertObjectIntoQueryParams,
  convertQueryParamsIntoObject,
} from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PageTitle } from "@app/ui/PageTitle";
import { IParamsUrl, Order, orderStatusOptions } from "@app/lib/types/orders";
import FilterSection from "./components/FilterSection/FilterSection";

import { OrderService } from "@app/services/actions";
import { Button } from "@app/ui";
import { twMerge } from "tailwind-merge";
import { DeliveryAtCell } from "./components/DeliverAtCell/DeliverAtCell";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Icon } from "@app/ui/Icon";
import DownloadIcon from "@iconify/icons-lucide/download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { routes } from "@app/lib/routes";
import { useLocation, useNavigate } from "react-router-dom";

const OrdersPage: React.FC = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Order[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useState<IParamsUrl>({
    status: [-1],
    searchKey: "",
    startDate: null,
    endDate: null,
    paymentMethod: null,
    pageNumber: 1,
    pageSize: 50,
    sortBy: 0,
    storeId: 1,
  });

  useEffect(() => {
    const queryParams: Partial<IParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : {};

    const updatedParams: IParamsUrl = {
      ...params,
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      status: queryParams?.status ? [Number(queryParams.status)] : [-1],
      startDate: queryParams?.startDate || null,
      storeId: Number(queryParams?.storeId) || null,
      endDate: queryParams?.endDate || null,
      paymentMethod: queryParams?.paymentMethod
        ? Number(queryParams.paymentMethod)
        : null,
    };

    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchData = async (query: IParamsUrl) => {
    setIsLoaderOpen(true);
    try {
      const res = await OrderService.getOrders(query);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get order list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataList?.data || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(dataBlob, "orders.xlsx");
  };

  const columns = [
    {
      title: "Order ID",
      render: (rowData: Order) => (
        <div className="flex items-center gap-2">
          <a
            target="_blank"
            href={routes.dashboard.orders.edit(rowData.id)}
            className="text-primary hover:text-primary-focus"
            rel="noreferrer"
          >
            {rowData.id}
          </a>
          <button
            className="text-primary hover:text-primary-focus"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(rowData.id.toString());
              toast.success("Order ID copied to clipboard");
            }}
          >
            <Icon icon="lucide:copy" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      title: "Created At",
      render: (row: Order) => formatToLocalTime(row.createdAt),
    },
    {
      title: "Customer Details",
      render: (row: Order) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${row?.userAddress?.latitude},${row?.userAddress?.longitude}`;
        return (
          <div className="flex flex-col">
            <span>{row?.userAddress?.contactName}</span>
            <span>{row?.userAddress?.phoneNumber}</span>
            <span>
              <a
                className="underline text-primary"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {row?.userAddress?.address}
              </a>
            </span>
          </div>
        );
      },
    },
    {
      title: "Delivery",
      render: (row: Order) => <DeliveryAtCell rowData={row} />,
    },
    {
      title: "Status",
      render: (rowData: Order) => {
        const status = orderStatusOptions.find(
          (option) => option.id === rowData?.status
        );

        // Map status to appropriate icons
        const statusIcons: Record<string, string> = {
          placed: "lucide:clipboard-check",
          beingPicked: "lucide:package-search",
          picked: "lucide:package-check",
          onTheWay: "lucide:truck",
          delivered: "lucide:check-circle",
          canceled: "lucide:x-circle",
          initiated: "lucide:clock",
        };

        const iconName = status?.tag
          ? statusIcons[status.tag]
          : "lucide:help-circle";

        return (
          <div
            className={twMerge(
              "flex items-center gap-1 px-3 py-2 rounded text-xs font-medium justify-center",
              status?.colorClass || "bg-gray-100"
            )}
          >
            <Icon icon={iconName} className="w-4 h-4" />
            <span>{status?.label || "Unknown Status"}</span>
          </div>
        );
      },
    },
    {
      title: "Store",
      render: (rowData: Order) => (
        <div className="bg-purple-50 border-l-2 border-purple-300 px-3 py-2 rounded">
          <span className="font-medium">
            {rowData?.store?.name || "Unknown Store"}
          </span>
        </div>
      ),
    },
    { title: "Payment", field: "paymentMethodString" },
    {
      title: "Invoice",
      render: (row: Order) => (
        <div className="felx text-nowrap">
          {row?.invoicePdf ? (
            <a
              href={row.invoicePdf}
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              View Invoice
            </a>
          ) : (
            "_"
          )}
        </div>
      ),
    },
    {
      title: "Remaining Amount",
      render: (row: Order) => (
        <div
          className={twMerge(
            row?.remainingAmountToPay > 0 && "bg-red-500 text-white  rounded",
            "p-1"
          )}
        >
          {row?.remainingAmountToPay > 0
            ? `${row?.remainingAmountToPay} QAR`
            : "_"}
        </div>
      ),
    },
    {
      title: "Total Price",
      render: (row: Order) => `${row.totalPrice.toFixed(2)} QAR`,
    },
    { title: "Notes", render: (row: Order) => <>{row?.notes || "_"}</> },
    {
      title: "Actions",
      cellStyle: { minWidth: 200 },
      render: (row: Order) => (
        <div className="flex gap-2 flex-col">
          <Button size="sm" color="primary" className="p-0">
            <a
              href={routes.dashboard.orders.edit(row.id)}
              className="underline w-full text-center p-2"
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col mb-6">
        <PageTitle
          title="Orders"
          breadCrumbItems={[{ label: "Orders", active: true }]}
        />
      </div>
      
      <div className="mx-auto bg-base-100 shadow-md rounded-lg p-6 space-y-4">
        <FilterSection
          handleConfirmFilter={fetchData}
          params={params}
          setParams={setParams}
        />
        {isLoaderOpen ? (
          <SectionLoader />
        ) : (
          <>
            <div className="flex justify-end">
              <Button onClick={exportToExcel} color="primary" size="sm">
                <Icon icon={DownloadIcon} /> Export to Excel
              </Button>
            </div>
            {dataList?.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Icon
                  icon="lucide:inbox"
                  className="w-16 h-16 text-gray-300 mb-4"
                />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try changing your filters or search criteria
                </p>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    const newParams = {
                      status: [1],
                      searchKey: "",
                      paymentMethod: null,
                      pageNumber: 1,
                      pageSize: 50,
                      storeId: null,
                    };
                    setParams(newParams);
                    navigate({
                      search: convertObjectIntoQueryParams(newParams),
                    });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <DataGridTable
                data={dataList?.data || []}
                columns={columns}
                options={{ actionsColumnIndex: -1 }}
              />
            )}
            <Pagination
              pageCount={dataList?.totalPages || 1}
              pageNumber={dataList?.pageNumber || 1}
              pageSize={params.pageSize}
              setParams={setParams}
              params={params}
            />
          </>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
