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
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { OffersService } from "@app/services/actions";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";
import { Offer } from "@app/lib/types/offers";
import { Icon } from "@app/ui/Icon";
interface PageProps {}

const OffersPage: React.FC<PageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Offer[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const location = useLocation();
  // create order action
  const toast = useToast();
  const [params, setParams] = useState<GlobalParamsUrl>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
  });
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "Uploaded By",
      field: "createdByName",
    },
    {
      title: "Uploaded At",
      render: (rowData: Offer) => <>{formatToLocalTime(rowData?.createdAt)}</>,
    },
    {
      title: "Total Records",
      field: "totalRecords",
    },
    {
      title: "Failed Record",
      render: (rowData: Offer) => <>{rowData?.failedRecords ?? "N/A"}</>,
    },
    {
      title: "File Name",
      render: (rowData: Offer) => (
        <>
          <a
            href={rowData?.s3FileFullPath}
            target="_blank"
            className="text-sm underline hover:text-blue-500 font-bold"
            rel="noreferrer"
          >
            {rowData?.title}
          </a>
        </>
      ),
    },
    // show error file
    {
      title: "Error File",
      render: (rowData: Offer) => {
        if (rowData?.errorFileFullPath) {
          return (
            <a
              href={rowData?.errorFileFullPath}
              target="_blank"
              className="text-sm underline hover:text-blue-500 font-bold"
              rel="noreferrer"
            >
              Download
            </a>
          );
        }
        return "N/A";
      },
    },
    {
      title: "File Error",
      render: (rowData: Offer) => (
        <>
          {rowData?.errorFileFullPath ? (
            <a
              href={rowData?.errorFileFullPath}
              target="_blank"
              className="text-sm underline hover:text-blue-500 font-bold"
              rel="noreferrer"
            >
              {rowData?.title}
            </a>
          ) : (
            "N/A"
          )}
        </>
      ),
    },

    {
      title: "Status",
      field: "status",
    },
  ];

  const fetchData = async (params?: GlobalParamsUrl) => {
    setIsLoaderOpen(true);
    const data = {
      ...params,
    };
    try {
      const res = await OffersService.getOffersUploads(data);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get Upload list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: GlobalParamsUrl = {
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      pageSize: Number(queryParams?.pageSize) || 50,
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Offers"
            breadCrumbItems={[{ label: "Offers", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <RestrictedWrapper action="create" requiredPermissions="offers">
            <div className="mt-2 w-full flex justify-end">
              <Button
                color="primary"
                onClick={() => navigate(routes.dashboard.offers.create)}
              >
                <Icon icon="lucide:plus" />
                Add Offers
              </Button>
            </div>
          </RestrictedWrapper>
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
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default OffersPage;
