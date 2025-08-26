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
  InventoryItem,
  Invnetory,
} from "@app/lib/types/invnentory";
import FilterSection from "./components/FilterSection/FilterSection";
import { InvnetoryService } from "@app/services/actions";
import { Badge, Button, Card, Drawer } from "@app/ui";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { ImageWithFallback } from "@app/ui/Image";
import { Icon } from "@app/ui/Icon";
import StateIcon from "@iconify/icons-lucide/eye";
import xIcon from "@iconify/icons-lucide/x";
import { Transactions } from "./components/Transactions";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";

const InventoryPage: React.FC = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Invnetory[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const location = useLocation();
  const toast = useToast();
  const handleOpenDrawer = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleCloseDrawer = () => {
    setOpen(false);
    selectedItem && setSelectedItem(null);
  };
  const columns = [
    {
      title: "Product ID",
      field: "productId",
    },
    {
      title: "Image",
      render: (data: InventoryItem) => (
        <ImageWithFallback
          src={data?.imagePath || "/placeholder_img.webp"}
          alt={data?.name || "Product Image"}
          width={90}
          height={90}
        />
      ),
    },
    {
      title: "SKU",
      field: "sku",
      render: (rowData: InventoryItem) => (
        <>
          <Button color="ghost">
            <span className="underline text-primary">{rowData?.sku}</span>
          </Button>
          <CopyToClipboard text={String(rowData?.sku)} />
        </>
      ),
      editable: "never",
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Store",
      field: "storeName",
    },
    {
      title: "Quantity",
      render: (data: InventoryItem) => (
        <span style={{ color: data?.quantity === 0 ? "red" : "inherit" }}>
          {data?.quantity}
        </span>
      ),
    },
    {
      title: "Price",
      render: (data: InventoryItem) =>
        `${data?.discountedPrice || data?.originalPrice || "N/A"} QAR`,
    },
    {
      title: "Cost",
      render: (data: InventoryItem) => `${data?.cost} QAR` || "N/A",
    },
    {
      title: "Discount",
      render: (data: InventoryItem) =>
        data?.discountedPrice > 0 ? `${data?.discountedPrice} QAR` : "N/A",
    },
    {
      title: "Zone",
      field: "shelfZone",
    },
    {
      title: "Section",
      field: "shelfSection",
    },
    {
      title: "Status",
      render: (data: InventoryItem) => (
        <Badge color={data?.published ? "success" : "error"}>
          {data?.published ? "Published" : "Inactive"}
        </Badge>
      ),
    },
    {
      title: "Last Zero qyt",
      render: (data: InventoryItem) =>
        data?.lastZeroQuantityAt
          ? formatToLocalTime(data?.lastZeroQuantityAt)
          : "N/A",
    },
    {
      title: "Statement",
      render: (item: InventoryItem) => (
        <Button
          color="primary"
          size="sm"
          onClick={() => handleOpenDrawer(item)}
        >
          <Icon icon={StateIcon} />
        </Button>
      ),
    },
  ];

  const [params, setParams] = useState<IParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
    storeId: "",
    quantityLessThan: "",
    status: "0",
  });

  const fetchData = async (params?: IParamsUrl) => {
    setIsLoaderOpen(true);
    try {
      const res = await InvnetoryService.getInvnetoryList(params);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get Invnetory list"
      );
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: Partial<IParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: IParamsUrl = {
      ...params,
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      storeId: queryParams?.storeId || "",
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const handleExportInventory = async () => {
    setIsExportLoading(true);
    try {
      const res = await InvnetoryService.exportInventory();
      toast.success(res?.data?.message ?? "Inventory exported successfully");
      setIsExportLoading(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Failed to export inventory");
      setIsExportLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Invnetory"
            breadCrumbItems={[{ label: "Invnetory", active: true }]}
          />
        </div>
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
            <RestrictedWrapper
              requiredPermissions="inventory"
              action="export_inventory"
            >
              <div className="flex justify-end">
                <Button
                  loading={isExportLoading}
                  color="primary"
                  onClick={handleExportInventory}
                >
                  Export Inventroy
                </Button>
              </div>
            </RestrictedWrapper>
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
        {open && selectedItem && (
          <Drawer
            open={open && selectedItem !== null}
            end
            onClickOverlay={handleCloseDrawer}
            sideClassName={"z-[100]"}
            side={
              <Card className="rounded-t-lg min-h-full bg-base-100 border-none overflow-y-auto w-[90%] m-3">
                <div className="bg-[#EDF0FE] p-4">
                  <Button
                    size="sm"
                    type="button"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close Drawer"
                    onClick={handleCloseDrawer}
                  >
                    <Icon icon={xIcon} />
                  </Button>
                  <h4 className="font-bold text-base-content">
                    Transactions for <b>({selectedItem.name})</b> in
                    <b> {selectedItem.storeName}</b> Store
                  </h4>
                </div>
                <Transactions inventoryData={selectedItem} />
              </Card>
            }
          />
        )}
      </div>
    </>
  );
};

export default InventoryPage;
