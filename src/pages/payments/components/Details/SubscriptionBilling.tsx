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
  SubscriptionBilling as SubscriptionBillingType,
  SubscriptionBillingResponse,
} from "@app/lib/types/payments";

// Helper function to format date for API
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString();
};

interface SubscriptionBillingProps {}

const SubscriptionBilling: React.FC<SubscriptionBillingProps> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize params from URL or defaults
  const [params, setParams] = useState({
    tab: searchParams.get("tab") || "Subscription_billing",
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

    // Fetch subscription billing using React Query
  const {
    data: subscriptions,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<SubscriptionBillingResponse>({
    queryKey: ["subscriptionBilling", params],
    queryFn: async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== "")
      );

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Subscription Billing API Call:", {
          params: cleanParams,
        });
      }

      const response = await PaymentService.getSubscriptionBilling(cleanParams);
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
          "Failed to fetch subscription billing"
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
      header: "Payment Request ID",
      accessor: "paymentRequestId",
      render: (subscription: SubscriptionBillingType) => (
        <div className="font-mono text-xs">
          {subscription.paymentRequestId.substring(0, 16)}...
        </div>
      ),
    },
    {
      header: "Creator",
      accessor: "creatorName",
      render: (subscription: SubscriptionBillingType) => (
        <div>
          <div className="font-medium text-sm">{subscription.creatorName}</div>
          <div className="text-xs text-base-content/70">
            ID: {subscription.creatorId || "Unknown"}
          </div>
        </div>
      ),
    },
    {
      header: "Plan",
      accessor: "planType",
      render: (subscription: SubscriptionBillingType) => (
        <div>
          <div className="font-medium text-sm">{subscription.planType}</div>
          <div className="text-xs text-base-content/70">
            ID: {subscription.planId}
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (subscription: SubscriptionBillingType) => (
        <div className="font-bold text-sm">${subscription.amount.toFixed(2)}</div>
      ),
    },
    {
      header: "Payment Method",
      accessor: "paymentMethod",
      render: (subscription: SubscriptionBillingType) => (
        <span className="badge badge-outline">{subscription.paymentMethod}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (subscription: SubscriptionBillingType) => (
        <Badge
          color={
            subscription.status === "captured"
              ? "success"
              : subscription.status === "pending"
              ? "warning"
              : subscription.status === "failed"
              ? "error"
              : subscription.status === "timeout"
              ? "info"
              : "secondary"
          }
        >
          {subscription.status}
        </Badge>
      ),
    },
    {
      header: "Last Payment",
      accessor: "lastPaymentDate",
      render: (subscription: SubscriptionBillingType) => (
        <span className="text-sm">{formatToLocalTime(subscription.lastPaymentDate)}</span>
      ),
    },
    {
      header: "Next Billing",
      accessor: "nextBillingDate",
      render: (subscription: SubscriptionBillingType) => (
        <span className="text-sm">{formatToLocalTime(subscription.nextBillingDate)}</span>
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
                  placeholder="Search subscriptions, creators..."
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
      {subscriptions && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:receipt" className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {subscriptions.total || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Total Subscriptions
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
                    ${subscriptions.panels?.totalSubscriptionRevenue?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-base-content/70">Total Revenue</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:users" className="w-8 h-8 text-warning" />
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {subscriptions.panels?.activePaidCreators || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Active Creators
                  </div>
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
                    {subscriptions.items?.filter((s: SubscriptionBillingType) => s.status === "failed" || s.status === "timeout").length || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Failed Payments
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
          <DataGridTable data={subscriptions?.items || []} columns={columns} />

          {/* Pagination */}
          <Pagination
            pageCount={Math.ceil(
              (subscriptions?.total || 0) / (subscriptions?.limit || 1)
            )}
            page={subscriptions?.page || 1}
            limit={(subscriptions?.limit as number) || 50}
            setParams={setParams}
            params={params}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default SubscriptionBilling;
