import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Input, Checkbox, Modal } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { PaymentService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import {
  PendingPayment,
  PendingPaymentsResponse,
} from "@app/lib/types/payments";

interface CreatorPayoutsProps {}

const CreatorPayouts: React.FC<CreatorPayoutsProps> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Initialize params from URL or defaults
  const [params, setParams] = useState({
    tab: searchParams.get("tab") || "creator_payouts",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
    searchKey: searchParams.get("searchKey") || "",
  });

  // Selection state
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [isPayoutLoading, setIsPayoutLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Individual payout state
  const [showIndividualConfirmModal, setShowIndividualConfirmModal] =
    useState(false);
  const [selectedIndividualCreator, setSelectedIndividualCreator] =
    useState<PendingPayment | null>(null);

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
  }, []);

  // Fetch payment transactions using React Query
  const {
    data: payments,
    isLoading,
    error,
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

  // Payout mutation
  const payoutMutation = useMutation({
    mutationFn: (creatorIds: string[]) =>
      PaymentService.updatePayouts({ creatorIds }),
    onSuccess: () => {
      toast.success("Payout processed successfully!");
      setSelectedCreatorIds([]);
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to process payout");
    },
  });

  // Selection handlers
  const handleSelectAll = () => {
    const allCreatorIds = payments?.items?.map((item) => item.creatorId) || [];
    if (selectedCreatorIds.length === allCreatorIds.length) {
      setSelectedCreatorIds([]);
    } else {
      setSelectedCreatorIds(allCreatorIds);
    }
  };

  const handleSelectOne = (creatorId: string) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handlePayout = () => {
    if (selectedCreatorIds.length === 0) {
      toast.error("Please select at least one creator for payout");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmPayout = async () => {
    try {
      setIsPayoutLoading(true);
      setShowConfirmModal(false);
      await payoutMutation.mutateAsync(selectedCreatorIds);
    } finally {
      setIsPayoutLoading(false);
    }
  };

  const handleCancelPayout = () => {
    setShowConfirmModal(false);
  };

  // Individual payout handlers
  const handleIndividualPayout = (creator: PendingPayment) => {
    setSelectedIndividualCreator(creator);
    setShowIndividualConfirmModal(true);
  };

  const handleConfirmIndividualPayout = async () => {
    if (!selectedIndividualCreator) return;

    try {
      setIsPayoutLoading(true);
      setShowIndividualConfirmModal(false);
      await payoutMutation.mutateAsync([selectedIndividualCreator.creatorId]);
      setSelectedIndividualCreator(null);
    } finally {
      setIsPayoutLoading(false);
    }
  };

  const handleCancelIndividualPayout = () => {
    setShowIndividualConfirmModal(false);
    setSelectedIndividualCreator(null);
  };

  // Clear selection when data changes (page change, etc.)
  useEffect(() => {
    setSelectedCreatorIds([]);
  }, [params.page]);

  const isAllSelected =
    payments?.items &&
    payments.items.length > 0 &&
    selectedCreatorIds.length === payments.items.length;

  const columns = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          onChange={handleSelectAll}
          className="checkbox-sm"
        />
      ),
      field: "select",
      render: (payment: PendingPayment) => (
        <div className="flex gap-2 cursor-pointer">
          <Checkbox
            id={`creator-${payment.creatorId}`}
            checked={selectedCreatorIds.includes(payment.creatorId)}
            onChange={() => handleSelectOne(payment.creatorId)}
            className="checkbox-sm"
          />
          <label
            className="font-mono text-xs cursor-pointer"
            htmlFor={`creator-${payment.creatorId}`}
          >
            {payment.creatorId}
          </label>
        </div>
      ),
    },

    {
      title: "Creator Name",
      field: "creatorName",
      render: (payment: PendingPayment) => (
        <div className="font-medium text-sm">{payment.creatorName}</div>
      ),
    },
    {
      title: "Total Owed",
      field: "totalOwed",
      render: (payment: PendingPayment) => (
        <div className="font-bold text-sm">
          KD {payment.totalOwed.toFixed(2)}
        </div>
      ),
    },
    {
      title: "Bank/Wallet Info",
      field: "bankWalletInfo",
      render: (payment: PendingPayment) => (
        <span className="text-sm">
          {payment.bankWalletInfo || "Not provided"}
        </span>
      ),
    },
    {
      title: "Last Payout Date",
      field: "lastPayoutDate",
      render: (payment: PendingPayment) => (
        <span className="text-sm">
          {payment.lastPayoutDate
            ? formatToLocalTime(payment.lastPayoutDate)
            : "Never"}
        </span>
      ),
    },
    {
      title: "Actions",
      field: "actions",
      render: (payment: PendingPayment) => (
        <div className="flex gap-2">
          <Button
            size="xs"
            color="primary"
            onClick={() => handleIndividualPayout(payment)}
            disabled={isPayoutLoading}
            title={
              !payment.bankWalletInfo
                ? "Bank/Wallet info required"
                : "Process individual payout"
            }
          >
            <Icon icon="lucide:credit-card" className="w-3 h-3 mr-1" />
            Payout
          </Button>
        </div>
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
                <Button
                  color="primary"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  <Icon icon="lucide:search" className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              {payments?.items && payments.items.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="ghost"
                    onClick={handleSelectAll}
                    className="whitespace-nowrap"
                  >
                    <Icon icon="lucide:check-square" className="w-4 h-4 mr-1" />
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              )}
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

      {/* Action Buttons */}
      {selectedCreatorIds.length > 0 && (
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon="lucide:check-circle"
                  className="w-5 h-5 text-primary"
                />
                <span className="font-medium">
                  {selectedCreatorIds.length} creator
                  {selectedCreatorIds.length > 1 ? "s" : ""} selected
                </span>
                <span className="text-sm text-base-content/70">
                  Total: KD{" "}
                  {payments?.items
                    ?.filter((item) =>
                      selectedCreatorIds.includes(item.creatorId)
                    )
                    ?.reduce((sum, item) => sum + item.totalOwed, 0)
                    ?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="ghost"
                  onClick={() => setSelectedCreatorIds([])}
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onClick={handlePayout}
                  loading={isPayoutLoading || payoutMutation.isPending}
                  disabled={selectedCreatorIds.length === 0}
                >
                  <Icon icon="lucide:credit-card" className="w-4 h-4 mr-2" />
                  Process Payout
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
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

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmModal}
        onClose={handleCancelPayout}
        backdrop
        responsive
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-full">
              <Icon
                icon="lucide:alert-triangle"
                className="w-6 h-6 text-warning"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Confirm Payout</h3>
              <p className="text-sm text-base-content/70">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className="bg-base-200 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selected Creators:</span>
              <span className="font-medium">{selectedCreatorIds.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Payout Amount:</span>
              <span className="font-bold text-success">
                KD{" "}
                {payments?.items
                  ?.filter((item) =>
                    selectedCreatorIds.includes(item.creatorId)
                  )
                  ?.reduce((sum, item) => sum + item.totalOwed, 0)
                  ?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          <p className="text-sm text-base-content/80">
            Are you sure you want to process the payout for{" "}
            {selectedCreatorIds.length} creator
            {selectedCreatorIds.length > 1 ? "s" : ""}? This will initiate the
            payment process and cannot be reversed.
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              color="ghost"
              onClick={handleCancelPayout}
              disabled={isPayoutLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleConfirmPayout}
              loading={isPayoutLoading}
            >
              <Icon icon="lucide:credit-card" className="w-4 h-4 mr-2" />
              Confirm Payout
            </Button>
          </div>
        </div>
      </Modal>

      {/* Individual Payout Confirmation Modal */}
      <Modal
        open={showIndividualConfirmModal}
        onClose={handleCancelIndividualPayout}
        backdrop
        responsive
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon icon="lucide:user" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Confirm Individual Payout
              </h3>
              <p className="text-sm text-base-content/70">
                Process payout for single creator
              </p>
            </div>
          </div>

          {selectedIndividualCreator && (
            <div className="bg-base-200 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span>Creator:</span>
                <span className="font-medium">
                  {selectedIndividualCreator.creatorName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Creator ID:</span>
                <span className="font-mono text-xs">
                  {selectedIndividualCreator.creatorId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payout Amount:</span>
                <span className="font-bold text-success">
                  KD {selectedIndividualCreator.totalOwed.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bank/Wallet Info:</span>
                <span className="text-xs">
                  {selectedIndividualCreator.bankWalletInfo || "Not provided"}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm text-base-content/80">
            Are you sure you want to process the payout for{" "}
            <span className="font-medium">
              {selectedIndividualCreator?.creatorName}
            </span>
            ? This will initiate the payment process and cannot be reversed.
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              color="ghost"
              onClick={handleCancelIndividualPayout}
              disabled={isPayoutLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleConfirmIndividualPayout}
              loading={isPayoutLoading}
            >
              <Icon icon="lucide:credit-card" className="w-4 h-4 mr-2" />
              Confirm Payout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatorPayouts;
