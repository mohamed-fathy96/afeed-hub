import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Input } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { PaymentService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import {
  PendingPayment,
  PendingPaymentsResponse,
} from "@app/lib/types/payments";

// Helper function to format date for API
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString();
};

interface UserPendingPaymentsProps {}

const UserPendingPatments: React.FC<UserPendingPaymentsProps> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize params from URL or defaults
  const [params, setParams] = useState({
    tab: searchParams.get("tab") || "Pending_payments",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
    searchKey: searchParams.get("searchKey") || "",
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
        tab: urlParams.get("tab") || "Pending_payments",
        page: parseInt(urlParams.get("page") || "1"),
        limit: parseInt(urlParams.get("limit") || "20"),
        searchKey: urlParams.get("searchKey") || "",
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
  } = useQuery<PendingPaymentsResponse>({
    queryKey: ["pendingPayments", params],
    queryFn: async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== "")
      );

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Pending Payments API Call:", {
          params: cleanParams,
        });
      }

      const response = await PaymentService.getPendingPayments(cleanParams);
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
          "Failed to fetch pending payments"
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
      page: 1,
      limit: 20,
    }));
  };

  const handleApplyFilters = () => {
    setParams((prev) => ({
      ...prev,
      searchKey: params.searchKey.trim(),
      page: 1,
    }));
  };

  const handleShareFilters = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("Filter URL copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy URL to clipboard");
      });
  };

  const columns = [
    {
      header: "Creator ID",
      accessor: "creatorId",
      render: (payment: PendingPayment) => (
        <div className="font-mono text-xs">{payment.creatorId}</div>
      ),
    },
    {
      header: "Creator Name",
      accessor: "creatorName",
      render: (payment: PendingPayment) => (
        <div className="font-medium text-sm">{payment.creatorName}</div>
      ),
    },
    {
      header: "Total Owed",
      accessor: "totalOwed",
      render: (payment: PendingPayment) => (
        <div className="font-bold text-sm">${payment.totalOwed.toFixed(2)}</div>
      ),
    },
    {
      header: "Bank/Wallet Info",
      accessor: "bankWalletInfo",
      render: (payment: PendingPayment) => (
        <span className="text-sm">
          {payment.bankWalletInfo || "Not provided"}
        </span>
      ),
    },
    {
      header: "Last Payout Date",
      accessor: "lastPayoutDate",
      render: (payment: PendingPayment) => (
        <span className="text-sm">
          {payment.lastPayoutDate
            ? formatToLocalTime(payment.lastPayoutDate)
            : "Never"}
        </span>
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
                  placeholder="Search creators..."
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

            {/* Active Filters Display */}
            {params.searchKey && (
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
                <Icon icon="lucide:users" className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {payments.total || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Total Creators
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-success/10 to-success/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="lucide:dollar-sign"
                  className="w-8 h-8 text-success"
                />
                <div>
                  <div className="text-2xl font-bold text-success">
                    KD
                    {(
                      payments.items?.reduce(
                        (sum, p) => sum + p.totalOwed,
                        0
                      ) || 0
                    ).toFixed(2)}
                  </div>
                  <div className="text-sm text-base-content/70">Total Owed</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:wallet" className="w-8 h-8 text-warning" />
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {payments.items?.filter((p) => p.bankWalletInfo).length ||
                      0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    With Bank Info
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-error/10 to-error/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="lucide:alert-circle"
                  className="w-8 h-8 text-error"
                />
                <div>
                  <div className="text-2xl font-bold text-error">
                    {payments.items?.filter((p) => !p.bankWalletInfo).length ||
                      0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Missing Bank Info
                  </div>
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

export default UserPendingPatments;
