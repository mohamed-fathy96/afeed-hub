import React, { useState, useEffect, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { routes } from "@app/lib/routes";
import { useToast } from "@app/helpers/hooks/use-toast";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PageTitle } from "@app/ui/PageTitle";
import { getCategoryList } from "@app/store/category/CategorySelector";

import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
} from "@app/ui";
import { CategoryService } from "@app/services/actions";
import { Category, IParamsUrl } from "@app/lib/types/category";
import { twMerge } from "tailwind-merge";
import FilterSection from "./components/FilterSection";
import { useAppDispatch, useAppSelector } from "@app/lib/hooks/useStore";
import { setCategoryList } from "@app/store/category/CategorySlice";
import { ImageWithFallback } from "@app/ui/Image";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import { formatToLocalTime } from "@app/lib/utils/formatDate";

interface PageProps {}

const CategoriesPage: React.FC<PageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Category[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const categoryList = useAppSelector((state) => getCategoryList({ state }));
  const dispatch = useAppDispatch();

  const [deleteCategoryModal, setDeleteCategoryModal] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const location = useLocation();
  // create order action
  const toast = useToast();
  const [params, setParams] = useState<IParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
  });
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setCategoryList({ type: Number(params.type) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "ID",
      field: "id",
      render: (rowData: Category) => (
        <div className="flex items-center justify-between gap-2">
          <Button
            color="ghost"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              onRowClick(e, rowData)
            }
          >
            <span className="underline text-primary">{rowData?.id}</span>
          </Button>
          <CopyToClipboard text={String(rowData?.id)} />
        </div>
      ),
      editable: "never",
    },
    {
      title: "Image",
      render: (rowData: Category) => (
        <div>
          {rowData?.images?.length > 0 && (
            <ImageWithFallback
              src={rowData?.images?.[0]?.path || ""}
              alt={rowData?.title}
              width={50}
              height={50}
            />
          )}
        </div>
      ),
    },
    {
      title: "Created At",
      render: (rowData: Category) => (
        <span>{formatToLocalTime(rowData?.createdAt)}</span>
      ),
    },
    {
      title: "Name",
      field: "title",
      editable: "onUpdate",
    },
    {
      title: "Name (Arabic)",
      field: "titleAr",
      editable: "onUpdate",
    },
    {
      title: "Parent",
      field: "parentCategoryId",
      lookup: categoryList?.reduce(
        (acc: Record<string, string>, item: Category) => {
          acc[item.id] = item.title;
          return acc;
        },
        {}
      ),
      render: (rowData: Category) => {
        // const parentCategory = categoryList?.find(
        //   (category: Category) => category.id === rowData.parentCategoryId
        // );
        return rowData.parentCategoryTitle;
      },
      editable: "onUpdate",
    },
    {
      title: "Sort ID",
      field: "sort",
      editable: "onUpdate",
    },
    {
      title: "Offer Page Sort",
      field: "offersPageSortOrder",
      editable: "onUpdate",
    },

    {
      title: "Updated At",
      render: (rowData: Category) => (
        <span>{formatToLocalTime(rowData?.updatedAt)}</span>
      ),
    },
  ];
  const onRowClick = (_evt: MouseEvent, row: Category) => {
    // open in new tab
    window.open(routes.dashboard.categories.show(row.id), "_blank");
  };

  const fetchData = async (params?: IParamsUrl) => {
    setIsLoaderOpen(true);
    const data = {
      ...params,
    };
    try {
      const res = await CategoryService.getCategories(data);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get Category list"
      );
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: IParamsUrl = {
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      pageSize: Number(queryParams?.pageSize) || 50,
      type: queryParams?.type || "",
      parentCategoryId: queryParams?.parentCategoryId || "",
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleDeleteOrder = async (category: Category) => {
    setDeleteCategoryModal(false);
    setIsLoaderOpen(true);
    try {
      const res = await CategoryService.removeCategory(category?.id);
      if (res) {
        toast.success(res?.data?.message ?? "Category deleted successfully");
        fetchData(params);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete Category");
    } finally {
      setIsLoaderOpen(false);
    }
  };
  const handleUpdateCategory = async (item: Category) => {
    setIsLoaderOpen(true);
    const data = {
      ...item,
      sort: Number(item?.sort),
      offersPageSortOrder: Number(item?.offersPageSortOrder),
      title: item?.title as string,
      titleAr: item?.titleAr as string,
    };
    try {
      const res = await CategoryService.QuickUpdateCategory(data, item?.id);

      if (res) {
        toast.success(res?.data?.message ?? "Category updated successfully ");
        navigate(routes.dashboard.categories.index);
        setIsLoaderOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update category");
    }
  };
  const onUpdateCategory = async (newData: Category, oldData: Category) => {
    if (!oldData) return; // Ensure the oldData exists

    const updatedCategory = {
      ...oldData,
      ...newData, // Merge changes
    };

    try {
      await handleUpdateCategory({
        ...updatedCategory,
        parentCategoryId: Number(updatedCategory?.parentCategoryId),
      }); // Call the update function
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to update category"
      );
    }
  };
  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Categories"
            breadCrumbItems={[{ label: "Categories", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <div className="mt-2 w-full text-end"></div>

          <>
            <FilterSection params={params} setParams={setParams} />
            {isLoaderOpen ? (
              <SectionLoader />
            ) : (
              <>
                <DataGridTable
                  data={dataList?.data || []}
                  columns={columns}
                  onUpdate={onUpdateCategory}
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
            <Modal backdrop open={deleteCategoryModal}>
              <form method="dialog">
                <Button
                  size="sm"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close modal"
                  onClick={() => {
                    setDeleteCategoryModal(false);
                    setSelectedCategory(null);
                  }}
                >
                  X
                </Button>
              </form>
              <ModalHeader className="font-bold">Confirm Delete</ModalHeader>
              <ModalBody>
                You are about to delete the <b>{selectedCategory?.title}</b>{" "}
                Categery . Would you like to proceed further ?
              </ModalBody>
              <ModalActions>
                <form method="dialog">
                  <Button
                    color="error"
                    size="sm"
                    onClick={() => {
                      setDeleteCategoryModal(false);
                      setSelectedCategory(null);
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
                      handleDeleteOrder(selectedCategory as Category)
                    }
                  >
                    Yes
                  </Button>
                </form>
              </ModalActions>
            </Modal>
          </>
        </CardBody>
      </Card>
    </>
  );
};

export default CategoriesPage;
