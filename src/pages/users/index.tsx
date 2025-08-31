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
import { IParamsUrl, UserDetails } from "@app/lib/types/users";
import { UserService } from "@app/services/actions";
import { Badge, Button, Card, CardBody, Input } from "@app/ui";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Icon } from "@app/ui/Icon";

interface UsersPageProps {}

const UsersPage: React.FC<UsersPageProps> = () => {
  const [dataList, setDataList] = useState<PaginationResponse<UserDetails>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();

  const [params, setParams] = useState<IParamsUrl>({
    searchKey: "",
    page: 1,
    limit: 10,
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
  const columns = [
    {
      title: "ID",
      field: "_id",
      render: (rowData: UserDetails) => (
        <span className="font-mono text-xs">{rowData.profile._id}</span>
      ),
    },
    {
      title: "Name",
      field: "full_name",
      render: (rowData: UserDetails) => (
        <div className="font-medium">{rowData.profile.full_name}</div>
      ),
    },
    {
      title: "Contact",
      field: "contact",
      render: (rowData: UserDetails) => (
        <div className="space-y-1">
          <div className="text-sm">{rowData.profile.email}</div>
          {rowData.profile.phone_number && (
            <div className="text-xs text-base-content/70">
              {rowData.profile.phone_number}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Service",
      field: "service",
      render: (rowData: UserDetails) => (
        <div className="text-sm">{rowData.profile.service || "N/A"}</div>
      ),
    },
    {
      title: "Status",
      field: "status",
      render: (rowData: UserDetails) => (
        <Badge color={rowData.profile.status === "A" ? "success" : "error"}>
          {rowData.profile.status === "A" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      title: "Purchases",
      field: "purchases",
      render: (rowData: UserDetails) => (
        <div className="text-sm font-medium">
          {rowData.purchases.total} purchases
        </div>
      ),
    },
    {
      title: "Actions",
      field: "actions",
      render: (rowData: UserDetails) => (
        <Button
          onClick={() => navigate(routes.dashboard.users.edit(rowData.profile._id))}
          color="primary"
          size="sm"
          className="btn-ghost"
        >
          <Icon icon="lucide:pen" />
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || "";
    const updatedParams = { ...params, searchKey: searchValue, page: 1 };
    setParams(updatedParams);
    const queryString = convertObjectIntoQueryParams(updatedParams);
    navigate({ search: queryString });
  };

  useEffect(() => {
    const queryParams: Partial<IParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: IParamsUrl = {
      ...params,
      page: Number(queryParams?.page) || 1,
      searchKey: queryParams?.searchKey || "",
      limit: Number(queryParams?.limit) || 10,
    };

    setParams(updatedParams);

    // Always fetch data on component mount or when params change
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    // Initial load only if no query params
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          {/* User Statistics */}
          {dataList?.items && dataList.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="stat bg-primary/10 rounded-box">
                <div className="stat-figure text-primary">
                  <Icon icon="lucide:users" className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-primary">{dataList.total}</div>
              </div>
              
              <div className="stat bg-success/10 rounded-box">
                <div className="stat-figure text-success">
                  <Icon icon="lucide:user-check" className="w-8 h-8" />
                </div>
                <div className="stat-title">Active Users</div>
                <div className="stat-value text-success">
                  {dataList.items.filter(user => user.profile.status === "A").length}
                </div>
              </div>

              <div className="stat bg-warning/10 rounded-box">
                <div className="stat-figure text-warning">
                  <Icon icon="lucide:shopping-bag" className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Purchases</div>
                <div className="stat-value text-warning">
                  {dataList.items.reduce((sum, user) => sum + user.purchases.total, 0)}
                </div>
              </div>

              <div className="stat bg-info/10 rounded-box">
                <div className="stat-figure text-info">
                  <Icon icon="lucide:activity" className="w-8 h-8" />
                </div>
                <div className="stat-title">Active Buyers</div>
                <div className="stat-value text-info">
                  {dataList.items.filter(user => user.purchases.total > 0).length}
                </div>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  className="w-full"
                  placeholder="Search by name, email, or service..."
                  defaultValue={params?.searchKey}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                color="primary"
                className="px-4"
                loading={isLoaderOpen}
              >
                Search
              </Button>
              {params.searchKey && (
                <Button
                  onClick={() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.value = "";
                    }
                    const updatedParams = { ...params, searchKey: "", page: 1 };
                    setParams(updatedParams);
                    const queryString =
                      convertObjectIntoQueryParams(updatedParams);
                    navigate({ search: queryString });
                  }}
                  color="ghost"
                  className="px-4"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {dataList && (
            <div className="mb-4 text-sm text-base-content/70">
              Showing {(dataList.page || 1 - 1) * (params.limit || 10) + 1} to{" "}
              {Math.min(
                (dataList.page || 1) * (params.limit || 10),
                dataList.total
              ) || 0}{" "}
              of {dataList.total} users
              {params.searchKey && (
                <span className="ml-2">
                  (filtered by: "{params.searchKey}")
                </span>
              )}
            </div>
          )}

          {isLoaderOpen ? (
            <SectionLoader />
          ) : dataList?.items && dataList.items.length > 0 ? (
            <>
              <DataGridTable
                data={dataList?.items || []}
                columns={columns}
                options={{ actionsColumnIndex: -1 }}
              />
              <Pagination
                pageCount={Math.ceil(
                  (dataList?.total || 0) / (params.limit || 10)
                )}
                page={dataList?.page || 1}
                limit={params.limit || 10}
                setParams={setParams}
                params={params}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <Icon
                icon="lucide:users"
                className="w-16 h-16 text-base-content/30 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-base-content/70 mb-2">
                {params.searchKey ? "No users found" : "No users yet"}
              </h3>
              <p className="text-base-content/50">
                {params.searchKey
                  ? `No users match your search "${params.searchKey}"`
                  : "Users will appear here once they sign up"}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default UsersPage;
