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
import { Badge, Button, Card, CardBody } from "@app/ui";
import { BulkUpdateStatus, Invnetory } from "@app/lib/types/invnentory";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import AddIcon from "@mui/icons-material/Add";
import { InvnetoryService } from "@app/services/actions";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";

interface PageProps {}

const InventoryBulkPage: React.FC<PageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Invnetory[]>>();
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
      render: (rowData: Invnetory) => (
        <>{formatToLocalTime(rowData?.createdAt)}</>
      ),
    },
    {
      title: "Total Records",
      field: "totalRecords",
    },
    {
      title: "Failed Record",
      render: (rowData: Invnetory) => <>{rowData?.failedRecords ?? "N/A"}</>,
    },
    {
      title: "File Name",
      render: (rowData: Invnetory) => (
        <>
          <a
            href={rowData?.s3FileFullPath}
            target="_blank"
            className="text-sm underline hover:text-blue-500 font-bold"
            rel="noreferrer"
          >
            {rowData?.fileName}
          </a>
        </>
      ),
    },
    // show error file
    {
      title: "Error File",
      render: (rowData: Invnetory) => {
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
      title: "Status",
      render: (rowData: Invnetory) => {
        const status: {
          [key: number]: "info" | "success" | "error" | "warning";
        } = {
          0: "warning",
          1: "info",
          2: "success",
          3: "error",
        };
        return (
          <>
            <Badge color={status[rowData?.status]}>
              {BulkUpdateStatus[rowData?.status]}
            </Badge>
          </>
        );
      },
    },
  ];

  const fetchData = async (params?: GlobalParamsUrl) => {
    setIsLoaderOpen(true);
    const data = {
      ...params,
    };
    try {
      const res = await InvnetoryService.getInvnentoryUploads(data);
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
      pageNumber: Number(queryParams?.page) || 1,
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
            title="Inventory"
            breadCrumbItems={[{ label: "Inventory", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <RestrictedWrapper action="create" requiredPermissions="inventory">
            <div className="mt-2 w-full text-end">
              <Button
                size="sm"
                color="primary"
                onClick={() => navigate(routes.dashboard.invnetory.bulkCreate)}
              >
                <AddIcon />
                Upload Inventory
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

export default InventoryBulkPage;
