import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { routes } from "@app/lib/routes";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import { Badge, Button, Card, CardBody } from "@app/ui";
import { CouponService } from "@app/services/actions";
import { Coupon, IParamsUrl } from "@app/lib/types/coupons";
import { Icon } from "@app/ui/Icon";
import PenIcon from "@iconify/icons-lucide/pen";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import FilterSection from "./components/FilterSection";
import { useQuery } from "@tanstack/react-query";

interface PageProps {}

const CouponsPage: React.FC<PageProps> = () => {
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useState<IParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
  });

  const columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Code",
      field: "code",
      render: (rowData: Coupon) => (
        <div className="flex items-center gap-2 justify-between">
          <span className="font-medium text-sm">{rowData?.code}</span>
          <CopyToClipboard text={rowData?.code} />
        </div>
      ),
    },
    {
      title: "Total Use",
      field: "totalUsePerCoupon",
    },
    {
      title: "Expired",
      render: (rowData: Coupon) => (
        <Badge
          className="font-medium text-sm"
          color={rowData?.isExpired ? "error" : "success"}
        >
          {rowData?.isExpired ? "Yes" : "No"}
        </Badge>
      ),
    },
    // {
    //   title: "Type",
    //   render: (rowData: Coupon) => {
    //     const selectedType = categoryTypeOptions?.find(
    //       (type) => type?.id === rowData?.categoryType
    //     );
    //     return (
    //       <div className="font-medium text-sm">
    //         <label
    //           htmlFor=""
    //           className={twMerge(
    //             "rounded-md p-1 text-white text-sm",
    //             selectedType?.colorClass
    //           )}
    //         >
    //           {selectedType?.label}
    //         </label>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Actions",
      render: (rowData: Coupon) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(routes.dashboard.coupons.edit(rowData?.id))}
            color="primary"
            title="Edit Category"
            size="sm"
          >
            <Icon icon={PenIcon} />
          </Button>
        </div>
      ),
    },
  ];

  // React Query for fetching coupons
  const {
    data: dataList,
    isLoading: isLoaderOpen,
    error,
  } = useQuery({
    queryKey: ["coupons", params],
    queryFn: async () => {
      const res = await CouponService.getCoupons(params);
      return res?.data;
    },
  });

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(
        (error as any)?.response?.data?.message ?? "Failed to get Coupon list"
      );
    }
  }, [error, toast]);

  useEffect(() => {
    const queryParams: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: IParamsUrl = {
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      pageSize: Number(queryParams?.pageSize) || 50,
      isExpired: queryParams?.isExpired || "",
    };
    setParams(updatedParams);
  }, [location]);

  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Coupons"
            breadCrumbItems={[{ label: "Coupons", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <>
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
                {/* <Pagination
                  pageCount={dataList?.totalPages}
                  pageNumber={dataList?.pageNumber}
                  pageSize={params.pageSize}
                  setParams={setParams}
                  params={params}
                /> */}
              </>
            )}
          </>
        </CardBody>
      </Card>
    </>
  );
};

export default CouponsPage;
