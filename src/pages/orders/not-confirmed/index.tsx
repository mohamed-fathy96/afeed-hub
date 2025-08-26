import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PageTitle } from "@app/ui/PageTitle";
import {
  IParamsUrl,
  Order,
  OrderStatusEnum,
  orderStatusOptions,
} from "@app/lib/types/orders";
import FilterSection from "../components/FilterSection/FilterSection";

import { OrderService } from "@app/services/actions";
import {
  Button,
  Card,
  Drawer,
  ModalBody,
  ModalHeader,
  ModalLegacy,
} from "@app/ui";
import { twMerge } from "tailwind-merge";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";
import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";

interface OrdersPageProps {}
type ParamsUrl = IParamsUrl & { appVersionFilter?: string };

const ConfirmationOrderPage: React.FC<OrdersPageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Order[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [verifyModal, setVerifyModal] = useState<{
    isOpen: boolean;
    selectedOrder: Order | null;
  }>({
    isOpen: false,
    selectedOrder: null,
  });

  const location = useLocation();
  const toast = useToast();

  const [params, setParams] = useState<ParamsUrl>({
    status: [OrderStatusEnum.ManualVerificationNeeded],
    searchKey: "",
    paymentMethod: null,
    pageNumber: 1,
    pageSize: 50,
    storeId: 1,
  });

  const fetchData = async (params?: ParamsUrl) => {
    setIsLoaderOpen(true);
    try {
      const res = await OrderService.getOrders(params);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get not confirmed order list"
      );
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: Partial<ParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: ParamsUrl = {
      ...params,
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      status: queryParams?.status ? [Number(queryParams.status)] : [1],
      startDate: queryParams?.startDate || null,
      endDate: queryParams?.endDate || null,
      storeId: Number(queryParams?.storeId) || null,
      paymentMethod: Number(queryParams?.paymentMethod) || null,
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const closeVerifyModal = () => {
    setVerifyModal({ isOpen: false, selectedOrder: null });
  };

  const handleVerifyOrder = async (order: Order) => {
    const res = await OrderService.manualVerifyOrder(order.id);
    if (res?.data) {
      toast.success("Order verified successfully");
      fetchData(params);
    }
  };

  const columns = [
    { title: "Order ID", field: "id" },
    {
      title: "Created At",
      render: (rowData: Order) => formatToLocalTime(rowData.createdAt),
    },
    {
      title: "Customer Details",
      render: (rowData: Order) => (
        <div className="flex flex-col">
          <span>{rowData?.user?.name}</span>
          <span>{rowData?.user?.phoneNumber}</span>
        </div>
      ),
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
    {
      title: "Status",
      render: (rowData: Order) => {
        const status = orderStatusOptions.find(
          (option) => option.id === rowData?.status
        );
        return (
          <label
            className={twMerge(
              "p-1 rounded text-center flex",
              status?.colorClass
            )}
          >
            {status?.label || "Unknown Status"}
          </label>
        );
      },
    },
    { title: "Payment", field: "paymentMethodString" },
    { title: "Reason", field: "cancellationReason" },
    {
      title: "Total Price",
      render: (rowData: Order) => (
        <CurrencyPriceLabel originalPrice={rowData?.totalPrice} zeroAsFree />
      ),
    },
    {
      title: "Notes",
      render: (rowData: Order) => <>{rowData?.notes || "_"}</>,
    },
    {
      title: "Actions",
      render: (rowData: Order) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            color="primary"
            onClick={() =>
              setVerifyModal({ isOpen: true, selectedOrder: rowData })
            }
          >
            Verify Order
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
          isOrder={false}
          handleConfirmFilter={fetchData}
          params={params}
          setParams={setParams}
        />

        {isLoaderOpen ? (
          <SectionLoader />
        ) : (
          <>
            <DataGridTable
              data={dataList?.data || []}
              columns={columns}
              options={{ actionsColumnIndex: -1 }}
            />
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

      <ModalLegacy
        open={verifyModal.isOpen}
        onClickBackdrop={closeVerifyModal}
        role="dialog"
      >
        <form method="dialog">
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closeVerifyModal}
          >
            <Icon icon={xIcon} />
          </Button>
        </form>
        <ModalHeader className="font-bold">Verify Order</ModalHeader>
        <ModalBody>
          <div className="p-3 space-y-3">
            Are you sure you want to verify this Order?
          </div>
        </ModalBody>
        <div className="flex justify-end gap-2 p-3">
          <Button
            color="primary"
            onClick={() => {
              if (verifyModal.selectedOrder) {
                handleVerifyOrder(verifyModal.selectedOrder);
              }
              closeVerifyModal();
            }}
          >
            Confirm
          </Button>
          <Button color="secondary" onClick={closeVerifyModal}>
            No
          </Button>
        </div>
      </ModalLegacy>
    </>
  );
};

export default ConfirmationOrderPage;
