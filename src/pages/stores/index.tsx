import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
import { GlobalParamsUrl, PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { routes } from "@app/lib/routes";
import { useToast } from "@app/helpers/hooks/use-toast";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PageTitle } from "@app/ui/PageTitle";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
} from "@app/ui";
import { StoreService } from "@app/services/actions";
import type { Store } from "@app/lib/types/store";
import { ImageWithFallback } from "@app/ui/Image";
import { Icon } from "@app/ui/Icon";

interface StoresPageProps {}

const StoresPage: React.FC<StoresPageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Store[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [deleteCategoryModal, setDeleteCategoryModal] =
    useState<boolean>(false);
  const [selectedSlider, setSelectedSlider] = useState<Store | null>(null);
  const location = useLocation();
  // create order action
  const toast = useToast();
  const [params, setParams] = useState<GlobalParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 1,
  });
  const navigate = useNavigate();

  // Columns
  const columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "Odoo Company Id",
      field: "OdooCompanyId",
    },
    {
      title: "Title",
      field: "title",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Published",
      render: (rowData: Store) => (
        <span
          className={`font-medium ${
            rowData.published ? "text-green-600" : "text-red-600"
          }`}
        >
          {rowData.published ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Delivery Charge",
      field: "deliveryCharge",
      render: (rowData: Store) => `${rowData.deliveryCharge} QAR`,
    },
    {
      title: "Minimum Order Price",
      field: "minimumOrderPrice",
      render: (rowData: Store) => `${rowData.minimumOrderPrice} QAR`,
    },
    {
      title: "Country ID",
      field: "countryId",
    },
    {
      title: "Opens At",
      render: (rowData: Store) => rowData.opensAt,
    },
    {
      title: "Closes At",
      render: (rowData: Store) => rowData.closesAt,
    },
    {
      title: "Images",
      render: (rowData: Store) => (
        <div className="flex space-x-2">
          <ImageWithFallback
            src={rowData.images?.[0]?.path || ""}
            alt={`Store image of ${rowData.title}`}
            className="w-10 h-10 object-cover rounded"
          />
        </div>
      ),
    },
  ];

  const fetchData = async (params?: GlobalParamsUrl) => {
    setIsLoaderOpen(true);
    const data = {
      ...params,
    };
    try {
      const res = await StoreService.getStores(data);
      console.log(res?.data);

      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get order list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: any = {
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleDeleteOrder = async (slider: Store) => {
    setDeleteCategoryModal(false);
    setIsLoaderOpen(true);
    try {
      const res = await StoreService.removeSlider(slider?.id);
      if (res) {
        toast.success(res?.data?.message ?? "Slider deleted successfully");
        fetchData(params);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete Slider");
    } finally {
      setIsLoaderOpen(false);
    }
  };
  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Stores"
            breadCrumbItems={[{ label: "Stores", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <div className="mt-2 w-full flex justify-between">
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:store" className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-700 text-base">
                Stores Management
              </h3>
            </div>
            <Button
              color="primary"
              onClick={() => navigate(routes.dashboard.stores.create)}
            >
              <Icon icon="lucide:plus" />
              Create Store
            </Button>
          </div>

          {isLoaderOpen ? (
            <SectionLoader />
          ) : (
            <>
              <DataGridTable
                data={dataList?.data || []}
                columns={columns}
                options={{ actionsColumnIndex: -1 }}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit Order",
                    onClick: (_event: any, rowData: Store) => {
                      navigate(routes.dashboard.stores.show(rowData?.id));
                    },
                  },
                  {
                    icon: "delete",
                    tooltip: "Delete Order",
                    onClick: (_event: any, rowData: Store) => {
                      setSelectedSlider(rowData);
                      setDeleteCategoryModal(true);
                    },
                  },
                ]}
              />
              <Pagination
                pageCount={dataList?.totalPages}
                pageNumber={dataList?.pageNumber}
                pageSize={params.pageSize}
                setParams={setParams}
                params={params}
              />
              <Modal backdrop open={deleteCategoryModal}>
                <form method="dialog">
                  <Button
                    size="sm"
                    color="ghost"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={() => {
                      setDeleteCategoryModal(false);
                      setSelectedSlider(null);
                    }}
                  >
                    X
                  </Button>
                </form>
                <ModalHeader className="font-bold">Confirm Delete</ModalHeader>
                <ModalBody>
                  You are about to delete the <b>{selectedSlider?.title}</b>{" "}
                  Slider . Would you like to proceed further ?
                </ModalBody>
                <ModalActions>
                  <form method="dialog">
                    <Button
                      color="error"
                      size="sm"
                      onClick={() => {
                        setDeleteCategoryModal(false);
                        setSelectedSlider(null);
                      }}
                    >
                      No
                    </Button>
                  </form>
                  <form method="dialog">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleDeleteOrder(selectedSlider as Store)}
                    >
                      Yes
                    </Button>
                  </form>
                </ModalActions>
              </Modal>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default StoresPage;
