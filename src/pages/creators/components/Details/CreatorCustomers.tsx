import React, { useState } from "react";
import { Card, CardBody, Button } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { CreatorService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatToLocalTime } from "@app/lib/utils/formatDate";

interface CustomerPurchase {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    product_title: string;
  };
  purchaseDate: string;
  accessStatus: string;
  expiryDate: string | null;
}

interface CreatorCustomersResponse {
  items: CustomerPurchase[];
  total: number;
  page: number;
  limit: number;
}

interface CreatorCustomersProps {
  creatorId: string;
}

const CreatorCustomers: React.FC<CreatorCustomersProps> = ({ creatorId }) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    searchKey: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const toast = useToast();

  // Fetch customer purchases using React Query
  const {
    data: purchases,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<CreatorCustomersResponse>({
    queryKey: ["creatorCustomers", creatorId, params],
    queryFn: async () => {
      // Clean up empty parameters to avoid sending empty strings
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== "")
      );

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Creator Customers API Call:", {
          creatorId,
          params: cleanParams,
        });
      }

      const response = await CreatorService.getCreatorCustomers(
        cleanParams,
        creatorId
      );
      return response.data?.data;
    },
    enabled: !!creatorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Handle errors with toast
  React.useEffect(() => {
    if (error) {
      toast.error(
        (error as any)?.response?.data?.message ||
          "Failed to fetch creator customer purchases"
      );
    }
  }, [error, toast]);

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, searchKey: searchValue.trim(), page: 1 }));
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setParams((prev) => ({ ...prev, searchKey: "", page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setParams((prev) => ({ ...prev, accessStatus: status, page: 1 }));
  };

  const columns = [
    {
      header: "Customer",
      accessor: "customer",
      render: (purchase: CustomerPurchase) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{purchase.customer.name}</span>
          <span className="text-xs text-base-content/60">
            {purchase.customer.email}
          </span>
        </div>
      ),
    },
    {
      header: "Product",
      accessor: "product",
      render: (purchase: CustomerPurchase) => (
        <div className="max-w-[200px]">
          <span
            className="text-sm line-clamp-2"
            title={purchase.product.product_title}
          >
            {purchase.product.product_title}
          </span>
        </div>
      ),
    },
    {
      header: "Purchase Date",
      accessor: "purchaseDate",
      render: (purchase: CustomerPurchase) => (
        <span className="text-sm">
          {formatToLocalTime(purchase.purchaseDate)}
        </span>
      ),
    },
    {
      header: "Access Status",
      accessor: "accessStatus",
      render: (purchase: CustomerPurchase) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              purchase.accessStatus === "Active" ? "bg-success" : "bg-error"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              purchase.accessStatus === "Active" ? "text-success" : "text-error"
            }`}
          >
            {purchase.accessStatus}
          </span>
        </div>
      ),
    },
    {
      header: "Expiry Date",
      accessor: "expiryDate",
      render: (purchase: CustomerPurchase) => (
        <span className="text-sm">
          {purchase.expiryDate
            ? formatToLocalTime(purchase.expiryDate)
            : "No expiry"}
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="flex gap-2 flex-1 ">
                <input
                  type="text"
                  placeholder="Search customers or products..."
                  className="input input-bordered flex-1"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <Button
                  color="primary"
                  size="sm"
                  className="h-full min-w-12"
                  onClick={handleSearch}
                  loading={isFetching}
                  disabled={isFetching}
                >
                  <Icon icon="lucide:search" />
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm">
        <CardBody className="">
          <DataGridTable data={purchases?.items || []} columns={columns} />

          {/* Pagination */}
          <Pagination
            pageCount={Math.ceil(
              (purchases?.total || 0) / (purchases?.limit || 1)
            )}
            page={purchases?.page || 1}
            limit={(purchases?.limit as number) || 50}
            setParams={setParams}
            params={params}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatorCustomers;
