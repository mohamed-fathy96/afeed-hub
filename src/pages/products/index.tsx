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
import { Button, Card, CardBody } from "@app/ui";
import { ProductService } from "@app/services/actions";

import FilterSection from "./components/FilterSection";
import {
  ParamsUrl,
  Product,
  ProductSort,
  ProductTypeFilter,
} from "@app/lib/types/product";
import { ImageWithPlaceholder } from "@app/ui/Image";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";

interface PageProps {}

const ProductsPage: React.FC<PageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Product[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const location = useLocation();
  // create order action
  const toast = useToast();
  const [params, setParams] = useState<ParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
    categoryId: "",
    storeId: "",
    brandId: "",
    sort: ProductSort.Default,
    type: "",
  });
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      field: "id",
      render: (rowData: Product) => (
        <Button
          className="underline"
          onClick={() => navigate(routes.dashboard.products.edit(rowData?.id))}
        >
          {rowData?.id}
        </Button>
      ),
      editable: "never",
    },
    {
      title: "Image",
      render: (rowData: Product) => (
        <ImageWithPlaceholder
          src={rowData?.imagePath || ""}
          alt={rowData?.title}
          width={90}
          height={90}
        />
      ),
    },
    {
      title: "SKU",
      field: "sku",
      render: (rowData: Product) => (
        <div className="flex items-start flex-col gap-1">
          <Button color="ghost" size="sm">
            <span className="underline text-primary">{rowData?.sku}</span>
          </Button>
          <CopyToClipboard text={String(rowData?.sku)} />
        </div>
      ),
      editable: "never",
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
    // {
    //   title: "Price (QAR)",
    //   field: "price",
    //   render: (rowData: Product) => <span>{rowData?.price}</span>,
    //   editable: "never",
    // },
    {
      title: "Sort ID",
      field: "sort",
      editable: "onUpdate",
    },
    {
      title: "Quantity",
      field: "qty",
      editable: "never",
    },
    {
      title: "Created At",
      render: (rowData: Product) => (
        <span>{formatToLocalTime(rowData?.createdAt)}</span>
      ),
    },
    {
      title: "Updated At",
      render: (rowData: Product) => (
        <span>{formatToLocalTime(rowData?.updatedAt)}</span>
      ),
    },
  ];

  const fetchData = async (params?: GlobalParamsUrl) => {
    setIsLoaderOpen(true);
    const data = {
      ...params,
    };
    try {
      const res = await ProductService.getProducts(data);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get Product list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: ParamsUrl = {
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      pageSize: Number(queryParams?.pageSize) || 50,
      categoryId: queryParams?.categoryId || "",
      storeId: queryParams?.storeId || null,
      brandId: queryParams?.brandId || null,
      sort: Number(queryParams?.sort) || ProductSort.Default,
      type: queryParams?.type || ProductTypeFilter.All,
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const handleUpdateProduct = async (item: Product) => {
    setIsLoaderOpen(true);
    const data = {
      ...item,
      sort: Number(item?.sort),
      title: item?.title as string,
      titleAr: item?.titleAr as string,
    };
    try {
      const res = await ProductService.updateProduct(data, item?.id);

      if (res) {
        toast.success(res?.data?.message ?? "Product updated successfully ");
        setIsLoaderOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update product");
    }
  };

  const handleRowClick = (e: MouseEvent, rowData: Product): void => {
    e.preventDefault();

    navigate(routes.dashboard.products.edit(rowData?.id));
  };
  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Products"
            breadCrumbItems={[{ label: "Products", active: true }]}
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
              <DataGridTable
                data={dataList?.data || []}
                columns={columns}
                options={{ actionsColumnIndex: -1 }}
                onUpdate={async (newData, oldData) => {
                  if (!oldData) return; // Ensure the oldData exists

                  const updatedProduct = {
                    ...oldData,
                    ...newData, // Merge changes
                  };

                  try {
                    await handleUpdateProduct(updatedProduct); // Call the update function
                  } catch (error: any) {
                    toast.error(
                      error?.response?.data?.message ??
                        "Failed to update Product"
                    );
                  }
                }}
              />
            )}
            <Pagination
              pageCount={dataList?.totalPages}
              pageNumber={dataList?.pageNumber}
              pageSize={params.pageSize}
              setParams={setParams}
              params={params}
            />
          </>
        </CardBody>
      </Card>
    </>
  );
};

export default ProductsPage;
