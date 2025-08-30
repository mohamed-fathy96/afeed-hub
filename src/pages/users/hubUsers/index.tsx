import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  convertQueryParamsIntoObject,
  convertObjectIntoQueryParams,
} from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { routes } from "@app/lib/routes";
import { useToast } from "@app/helpers/hooks/use-toast";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PageTitle } from "@app/ui/PageTitle";
import { IParamsUrl, User } from "@app/lib/types/users";
import { UserService } from "@app/services/actions";
import { Badge, Button, Card, CardBody, Input } from "@app/ui";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Icon } from "@app/ui/Icon";
import PenIcon from "@iconify/icons-lucide/pen";

interface OrdersPageProps {}

const HubUsersPage: React.FC<OrdersPageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<User[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const toast = useToast();

  const navigate = useNavigate();
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
      title: "Phone",
      field: "phoneNumber",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Archived",
      field: "archived",
      render: (rowData: User) =>
        rowData.archived ? (
          <Badge color="error">Archived</Badge>
        ) : (
          <Badge color="success">Active</Badge>
        ), // Convert boolean to human-readable
    },
    {
      title: "Created At",
      field: "createdAt",
      render: (rowData: User) => formatToLocalTime(rowData?.createdAt), // Format date
    },
    {
      title: "Actions",
      field: "actions",
      render: (rowData: User) => (
        <Button
          onClick={() => navigate(routes.dashboard.users.edit(rowData.id))}
          color="primary"
          size="sm"
        >
          <Icon icon={PenIcon} />
        </Button>
      ),
    },
  ];

  const [params, setParams] = useState<IParamsUrl>({
    searchKey: "",
    page: 1,
    limit: 10,
    hubUsers: "true",
  });

  const fetchData = async (params?: IParamsUrl) => {
    setIsLoaderOpen(true);
    try {
      const res = await UserService.getUsers(params);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get user list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || "";
    const updatedParams = {
      ...params,
      searchKey: searchValue,
      pageNumber: 1,
      hubUsers: "true",
    };
    setParams(updatedParams);
    const queryString = convertObjectIntoQueryParams(updatedParams);
    navigate({ search: queryString });
  };

  useEffect(() => {
    const queryParams: Partial<IParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;
    const search = queryParams?.searchKey?.split("").join(",");

    if ((search && search?.length > 2) || queryParams?.hubUsers === "true") {
      const updatedParams: IParamsUrl = {
        ...params,
        page: Number(queryParams?.page) || 1,
        searchKey: queryParams?.searchKey || "",
        hubUsers: queryParams?.hubUsers || "true",
      };
      setParams(updatedParams);
      fetchData(updatedParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Users"
            breadCrumbItems={[{ label: "Users", active: true }]}
          />
        </div>
      </div>

      <Card>
        <CardBody className="bg-base-100">
          {/* Inline Search Input with Button */}
          <div className="flex items-center mb-4">
            <Input
              ref={searchInputRef}
              type="text"
              className="w-full border border-gray-300 rounded-md pl-3 py-2 text-sm"
              placeholder="Search by ID, name"
              defaultValue={params?.searchKey}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              className="ml-2 px-3 py-2 rounded-md bg-primary text-base-100 text-sm"
            >
              Search
            </Button>
          </div>

          {isLoaderOpen ? (
            <SectionLoader />
          ) : (
            <>
              <DataGridTable
                data={dataList?.items || []}
                columns={columns}
                options={{ actionsColumnIndex: -1 }}
              />
              <Pagination
                pageCount={Math.ceil(
                  (dataList?.total || 0) / (params.limit || 1)
                )}
                page={dataList?.page || 1}
                limit={params.limit}
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

export default HubUsersPage;
