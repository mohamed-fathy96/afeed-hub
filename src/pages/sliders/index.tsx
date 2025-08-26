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
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalLegacy,
} from "@app/ui";
import { SliderService } from "@app/services/actions";
import type { Slider } from "@app/lib/types/slider";
import { ImageWithFallback, ImageWithPlaceholder } from "@app/ui/Image";
import xIcon from "@iconify/icons-lucide/x";
import { Icon } from "@app/ui/Icon";
import FilterSection from "./components/FilterSection";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
interface SlidersPageProps {}

const SlidersPage: React.FC<SlidersPageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Slider[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [deleteCategoryModal, setDeleteCategoryModal] =
    useState<boolean>(false);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const location = useLocation();
  // create order action
  const toast = useToast();
  const [params, setParams] = useState<GlobalParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
  });
  const navigate = useNavigate();
  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
    setIsImageModalOpen(true);
  };
  // Columns
  const columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "Images",
      render: (rowData: Slider) => (
        <div className="flex space-x-2">
          <ImageWithFallback
            src={rowData.images?.[0]?.path}
            alt={`slider of ${rowData.title}`}
            // className="w-9 h-9"
            onClick={() => handleImageClick(rowData.images?.[0]?.path)}
          />
        </div>
      ),
    },
    {
      title: "Title",
      field: "title",
    },
    {
      title: "Created at",
      render: (rowData: Slider) => (
        <span>{formatToLocalTime(rowData?.createdAt)}</span>
      ),
    },
    {
      title: "Label",
      field: "label",
    },
    {
      title: "Store",
      field: "storeName",
    },
    {
      title: "Location, Position",
      field: "sliderLocationString",
    },
    {
      title: "Actions",
      render: (rowData: Slider) => (
        <div className="flex space-x-2 ">
          {/* Edit Button */}
          <button
            onClick={() => navigate(routes.dashboard.sliders.show(rowData?.id))}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit Order"
          >
            <i className="material-icons">edit</i>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              setSelectedSlider(rowData);
              setDeleteCategoryModal(true);
            }}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Order"
          >
            <i className="material-icons">delete</i>
          </button>
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
      const res = await SliderService.getSliders(data);
      console.log(res?.data);

      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get order list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: Partial<GlobalParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: GlobalParamsUrl = {
      ...params,
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const handleDeleteOrder = async (slider: Slider) => {
    setDeleteCategoryModal(false);
    setIsLoaderOpen(true);
    try {
      const res = await SliderService.removeSlider(slider?.id);
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
            title="Sliders"
            breadCrumbItems={[{ label: "Sliders", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <FilterSection params={params} setParams={setParams} />

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
                pageCount={dataList?.totalPages}
                pageNumber={dataList?.pageNumber}
                pageSize={params.pageSize}
                setParams={setParams}
                params={params}
              />
              <input type="checkbox" id="my_modal_6" className="modal-toggle" />
              <ModalLegacy
                onClickBackdrop={() => {
                  setDeleteCategoryModal(false);
                  setSelectedSlider(null);
                }}
                open={deleteCategoryModal}
                role="dialog"
              >
                <form method="dialog">
                  <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={() => {
                      setDeleteCategoryModal(false);
                      setSelectedSlider(null);
                    }}
                  >
                    <Icon icon={xIcon} />
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
                      onClick={() =>
                        handleDeleteOrder(selectedSlider as Slider)
                      }
                    >
                      Yes
                    </Button>
                  </form>
                </ModalActions>
              </ModalLegacy>
              <ModalLegacy
                open={isImageModalOpen}
                role="dialog"
                onClickBackdrop={() => {
                  setIsImageModalOpen(false);
                }}
              >
                <form method="dialog">
                  <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={() => {
                      setIsImageModalOpen(false);
                    }}
                  >
                    <Icon icon={xIcon} />
                  </Button>
                </form>
                <ModalHeader className="font-bold">Slider Image</ModalHeader>
                <ModalBody>
                  <div className="flex items-center justify-center h-full bg-black bg-opacity-75">
                    <ImageWithPlaceholder
                      src={selectedImage || ""}
                      alt="Full view"
                      className="max-w-full max-h-full rounded"
                    />
                  </div>
                </ModalBody>
              </ModalLegacy>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default SlidersPage;
