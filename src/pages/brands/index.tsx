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
import { Card, CardBody } from "@app/ui";
import { BrandService } from "@app/services/actions";

import FilterSection from "./components/FilterSection";
import { ParamsUrl } from "@app/lib/types/product";
import { ImageWithPlaceholder } from "@app/ui/Image";
import { Brand } from "@app/lib/types/brands";

interface PageProps {}

const BrandsPage: React.FC<PageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Brand[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const location = useLocation();
  // create order action
  const toast = useToast();
  const [params, setParams] = useState<ParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
    categoryId: "",
  });
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      field: "id",
      render: (rowData: Brand) => (
        <span className="underline">{rowData?.id}</span>
      ),
      editable: "never",
    },
    {
      title: "Image",
      render: (rowData: Brand) => (
        <ImageWithPlaceholder
          src={rowData?.image || ""}
          alt={rowData?.nameEn}
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Sort Order",
      field: "sortOrder",
    },
    {
      title: "Name",
      field: "nameEn",
    },
    {
      title: "Name (Arabic)",
      field: "nameAr",
    },
    {
      title: "Slug",
      field: "urlKey",
    },
  ];

  const fetchData = async (params?: GlobalParamsUrl) => {
    setIsLoaderOpen(true);
    const data = {
      ...params,
    };
    try {
      const res = await BrandService.getBrands(data);
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
      categoryId: queryParams?.categoryId ? queryParams.categoryId : "",
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleRowClick = (e: MouseEvent, rowData: Brand): void => {
    e.preventDefault();

    navigate(routes.dashboard.brands.edit(rowData?.id));
  };
  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Brands"
            breadCrumbItems={[{ label: "Brands", active: true }]}
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
                  onRowClick={handleRowClick}
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
          </>
        </CardBody>
      </Card>
    </>
  );
};

export default BrandsPage;
