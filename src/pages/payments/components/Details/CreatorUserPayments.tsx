import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Input } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { Badge } from "@app/ui/Badge";
import { PaymentService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import {
  CreatorUserPaymentsResponse,
  PaymentTransaction,
} from "@app/lib/types/payments";

// Helper function to format date for API
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString();
};

interface CreatorUserPaymentsProps {}

const CreatorUserPayments: React.FC<CreatorUserPaymentsProps> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize params from URL or defaults
  const [params, setParams] = useState({
    tab: searchParams.get("tab") || "Creator_user_payments",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
    searchKey: searchParams.get("searchKey") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    status: searchParams.get("status") || "",
  });

  const toast = useToast();

  // Update URL when params change
  useEffect(() => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        urlParams.set(key, value.toString());
      }
    });

    setSearchParams(urlParams, { replace: true });
  }, [params, setSearchParams]);

  // Initialize params from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlParams = urlParams.toString() !== "";

    if (hasUrlParams) {
      setParams({
        tab: urlParams.get("tab") || "Creator_user_payments",
        page: parseInt(urlParams.get("page") || "1"),
        limit: parseInt(urlParams.get("limit") || "20"),
        searchKey: urlParams.get("searchKey") || "",
        startDate: urlParams.get("startDate") || "",
        endDate: urlParams.get("endDate") || "",
        status: urlParams.get("status") || "",
      });
    }
  }, []); // Only run on mount

  // Fetch payment transactions using React Query
  const {
    data: payments,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<CreatorUserPaymentsResponse>({
    queryKey: ["creatorUserPayments", params],
    queryFn: async () => {
      // Format dates for API and clean up empty parameters
      const formattedParams = {
        ...params,
        startDate: params.startDate
          ? formatDateForAPI(params.startDate + "T00:00:00")
          : "",
        endDate: params.endDate
          ? formatDateForAPI(params.endDate + "T23:59:59")
          : "",
      };

      const cleanParams = Object.fromEntries(
        Object.entries(formattedParams).filter(([_, value]) => value !== "")
      );

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Creator User Payments API Call:", {
          params: cleanParams,
        });
      }

      const response = await PaymentService.getCreatorUserPayments(cleanParams);
      console.log(response);

      return response.data?.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Handle errors with toast
  React.useEffect(() => {
    if (error) {
      toast.error(
        (error as any)?.response?.data?.message ||
          "Failed to fetch creator user payments"
      );
    }
  }, [error, toast]);

  const handleSearch = () => {
    setParams((prev) => ({
      ...prev,
      searchKey: params.searchKey.trim(),
      page: 1,
    }));
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleStatusFilter = (status: string) => {
    setParams((prev) => ({
      ...prev,
      status: status,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      searchKey: "",
      startDate: "",
      endDate: "",
      status: "",
      page: 1,
      limit: 20,
    }));
  };

  const handleApplyFilters = () => {
    setParams((prev) => ({
      ...prev,
      searchKey: params.searchKey.trim(),
      startDate: params.startDate,
      endDate: params.endDate,
      status: params.status,
      page: 1,
    }));
  };

  const columns = [
    {
      title: "Transaction ID",
      field: "transactionId",
      render: (payment: PaymentTransaction) => (
        <div className="font-mono text-xs">
          {payment.transactionId.substring(0, 16)}...
        </div>
      ),
    },
    {
      title: "Customer",
      field: "user",
      render: (payment: PaymentTransaction) => (
        <div>
          <div className="font-medium text-sm">{payment.user.name}</div>
          <div className="text-xs text-base-content/70">
            ID: {payment.user._id}
          </div>
        </div>
      ),
    },
    {
      title: "Creator",
      field: "creator",
      render: (payment: PaymentTransaction) => (
        <div className="font-medium text-sm">{payment.creator.full_name}</div>
      ),
    },
    {
      title: "Product",
      field: "product",
      render: (payment: PaymentTransaction) => (
        <div>
          <div className="font-medium text-sm">
            {payment.product.product_title}
          </div>
          <div className="text-xs text-base-content/70">
            ID: {payment.product._id}
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      field: "amount",
      render: (payment: PaymentTransaction) => (
        <div className="font-bold text-sm">${payment.amount.toFixed(2)}</div>
      ),
    },
    {
      title: "Payment Method",
      field: "paymentMethod",
      render: (payment: PaymentTransaction) => (
        <span className="badge badge-outline">{payment.paymentMethod}</span>
      ),
    },
    {
      title: "Status",
      field: "status",
      render: (payment: PaymentTransaction) => (
        <Badge
          color={
            payment.status === "captured"
              ? "success"
              : payment.status === "pending"
              ? "warning"
              : payment.status === "failed"
              ? "error"
              : "secondary"
          }
        >
          {payment.status}
        </Badge>
      ),
    },
    {
      title: "Date",
      field: "date",
      render: (payment: PaymentTransaction) => (
        <span className="text-sm">{formatToLocalTime(payment.date)}</span>
      ),
    },
  ];

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardBody className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2 flex-1">
                <Input
                  type="text"
                  placeholder="Search transactions, users, products..."
                  className="flex-1"
                  value={params.searchKey}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      searchKey: e.target.value,
                    }))
                  }
                  onKeyPress={handleSearchKeyPress}
                />
              </div>
            </div>

            {/* Quick Filter Presets */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-base-content/70 self-center">
                Quick filters:
              </span>
              <Button
                size="xs"
                color="ghost"
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(
                    today.getTime() - 7 * 24 * 60 * 60 * 1000
                  );
                  setParams((prev) => ({
                    ...prev,
                    startDate: lastWeek.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  }));
                }}
              >
                Last 7 days
              </Button>
              <Button
                size="xs"
                color="ghost"
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    today.getDate()
                  );
                  setParams((prev) => ({
                    ...prev,
                    startDate: lastMonth.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  }));
                }}
              >
                Last 30 days
              </Button>
              <Button
                size="xs"
                color="ghost"
                onClick={() => {
                  const today = new Date();
                  const firstDayOfMonth = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                  );
                  setParams((prev) => ({
                    ...prev,
                    startDate: firstDayOfMonth.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  }));
                }}
              >
                This month
              </Button>
              <Button
                size="xs"
                color="ghost"
                onClick={() => {
                  setParams((prev) => ({ ...prev, status: "captured" }));
                }}
              >
                Captured only
              </Button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Date Range Filter */}
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text text-sm">Start Date</span>
                  </label>
                  <Input
                    type="date"
                    value={params.startDate}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text text-sm">End Date</span>
                  </label>
                  <Input
                    type="date"
                    value={params.endDate}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-sm">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={params.status}
                  onChange={(e) =>
                    setParams((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Statuses</option>
                  <option value="captured">Captured</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Action Buttons */}
            </div>
            <div className="flex gap-2 justify-between">
              <Button
                color="ghost"
                size="md"
                onClick={handleClearFilters}
                disabled={isFetching}
              >
                <Icon icon="lucide:x" className="w-4 h-4 mr-1" />
                Clear
              </Button>
              <Button
                color="primary"
                size="md"
                onClick={handleApplyFilters}
                loading={isFetching}
                disabled={isFetching}
                className="min-w-24 h-full"
              >
                <Icon icon="lucide:filter" className="w-4 h-4 mr-1" />
                Apply
              </Button>
            </div>
            {/* Active Filters Display */}
            {(params.searchKey ||
              params.startDate ||
              params.endDate ||
              params.status) && (
              <div className="space-y-3 pt-2 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-base-content/70">
                    Active filters:
                  </span>
                  {params.searchKey && (
                    <div className="badge badge-primary badge-outline">
                      Search: {params.searchKey}
                    </div>
                  )}
                  {params.startDate && (
                    <div className="badge badge-info badge-outline">
                      From: {params.startDate}
                    </div>
                  )}
                  {params.endDate && (
                    <div className="badge badge-info badge-outline">
                      To: {params.endDate}
                    </div>
                  )}
                  {params.status && (
                    <div className="badge badge-success badge-outline">
                      Status: {params.status}
                    </div>
                  )}
                </div>

                {/* URL Parameters Display */}
                <div className="bg-base-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-xs text-base-content/70">
                        API Parameters:
                      </span>
                      <div className="font-mono text-xs text-base-content/90 mt-1 break-all">
                        {Object.entries(params)
                          .filter(
                            ([_, value]) => value && value !== "" && value !== 0
                          )
                          .map(([key, value]) => `${key}=${value}`)
                          .join("&")}
                      </div>
                    </div>
                    <Button
                      size="xs"
                      color="ghost"
                      onClick={() => {
                        const paramString = Object.entries(params)
                          .filter(
                            ([_, value]) => value && value !== "" && value !== 0
                          )
                          .map(([key, value]) => `${key}=${value}`)
                          .join("&");
                        navigator.clipboard.writeText(paramString);
                        toast.success("Parameters copied to clipboard!");
                      }}
                    >
                      <Icon icon="lucide:copy" className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Filter Results Summary */}
      {payments && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:receipt" className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {payments.total}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Total Transactions
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-success/10 to-success/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="lucide:check-circle"
                  className="w-8 h-8 text-success"
                />
                <div>
                  <div className="text-2xl font-bold text-success">
                    {payments.items?.filter((p) => p.status === "captured")
                      .length || 0}
                  </div>
                  <div className="text-sm text-base-content/70">Captured</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:clock" className="w-8 h-8 text-warning" />
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {payments.items?.filter((p) => p.status === "pending")
                      .length || 0}
                  </div>
                  <div className="text-sm text-base-content/70">Pending</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-error/10 to-error/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:x-circle" className="w-8 h-8 text-error" />
                <div>
                  <div className="text-2xl font-bold text-error">
                    {payments.items?.filter((p) => p.status === "failed")
                      .length || 0}
                  </div>
                  <div className="text-sm text-base-content/70">Failed</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Data Table */}
      <Card className="shadow-sm">
        <CardBody className="">
          <DataGridTable data={payments?.items || []} columns={columns} />

          {/* Pagination */}
          <Pagination
            pageCount={Math.ceil(
              (payments?.total || 0) / (payments?.limit || 1)
            )}
            page={payments?.page || 1}
            limit={(payments?.limit as number) || 50}
            setParams={setParams}
            params={params}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatorUserPayments;
