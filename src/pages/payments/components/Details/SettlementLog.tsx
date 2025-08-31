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
  SettlementLogItem,
  SettlementLogResponse,
} from "@app/lib/types/payments";

interface SettlementLogProps {}

const SettlementLog: React.FC<SettlementLogProps> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize params from URL or defaults
  const [params, setParams] = useState({
    tab: searchParams.get("tab") || "settlement_log",
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
        tab: urlParams.get("tab") || "creator_payouts",
        page: parseInt(urlParams.get("page") || "1"),
        limit: parseInt(urlParams.get("limit") || "20"),
        searchKey: urlParams.get("searchKey") || "",
      });
    }
  }, []); // Only run on mount

  // Fetch settlement log using React Query
  const {
    data: payments,
    isLoading,
    error,
  } = useQuery<SettlementLogResponse>({
    queryKey: ["SettlementLog", params],
    queryFn: async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== "")
      );

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Settlement Log API Call:", {
          params: cleanParams,
        });
      }

      const response = await PaymentService.getSettlementLog(cleanParams);
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
          "Failed to fetch settlement log"
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

  const columns = [
    {
      title: "Creator ID",
      field: "creatorId",
      render: (settlement: SettlementLogItem) => (
        <div className="font-mono text-xs">{settlement.creatorId}</div>
      ),
    },
    {
      title: "Creator Name",
      field: "creatorName",
      render: (settlement: SettlementLogItem) => (
        <div className="font-medium text-sm">{settlement.creatorName}</div>
      ),
    },
    {
      title: "Payout Amount",
      field: "payoutAmount",
      render: (settlement: SettlementLogItem) => (
        <div className="font-bold text-sm">
          KD {settlement.payoutAmount.toFixed(2)}
        </div>
      ),
    },
    {
      title: "Payout Method",
      field: "payoutMethod",
      render: (settlement: SettlementLogItem) => (
        <span className="text-sm">{settlement.payoutMethod}</span>
      ),
    },
    {
      title: "Payout Date",
      field: "payoutAt",
      render: (settlement: SettlementLogItem) => (
        <span className="text-sm">
          {formatToLocalTime(settlement.payoutAt)}
        </span>
      ),
    },
    {
      title: "Triggered By",
      field: "triggeredBy",
      render: (settlement: SettlementLogItem) => (
        <span className="text-sm">{settlement.triggeredBy.name}</span>
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
                        (sum, p) => sum + p.payoutAmount,
                        0
                      ) || 0
                    ).toFixed(2)}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Total Payouts
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="lucide:credit-card"
                  className="w-8 h-8 text-warning"
                />
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {payments.items?.filter(
                      (p) => p.payoutMethod === "Bank Transfer"
                    ).length || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Bank Transfers
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-info/10 to-info/5">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:user-check" className="w-8 h-8 text-info" />
                <div>
                  <div className="text-2xl font-bold text-info">
                    {new Set(payments.items?.map((p) => p.triggeredBy._id))
                      .size || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Unique Approvers
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

export default SettlementLog;
