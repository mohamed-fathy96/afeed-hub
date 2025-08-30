import React, { useState } from "react";
import { Card, CardBody, Button } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { CreatorService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@app/lib/types/creators";

interface CreatorProductResponse {
  items: Product[];
  total: number;
}

interface CreatorProductProps {
  creatorId: string;
}

const CreatorProduct: React.FC<CreatorProductProps> = ({ creatorId }) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    searchKey: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const toast = useToast();

  // Fetch products using React Query
  const {
    data: products,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<CreatorProductResponse>({
    queryKey: ["creatorProducts", creatorId, params],
    queryFn: async () => {
      // Clean up empty parameters to avoid sending empty strings
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== "")
      );

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Creator Products API Call:", {
          creatorId,
          params: cleanParams,
        });
      }

      const response = await CreatorService.getCreatorProducts(
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
          "Failed to fetch creator products"
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
  const handleSearchChange = (search: string) => {
    setSearchValue(search);
  };

  const formatCurrency = (amount: number) => {
    return `${amount?.toLocaleString()} KD`;
  };

  const columns = [
    {
      title: "Product",
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 min-w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <Icon
              icon={
                product.type === "session" ? "lucide:video" : "lucide:package"
              }
              className="w-6 h-6 text-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{product.product_title}</span>
            <span className="text-xs text-gray-500">{product._id}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              product.type === "session" ? "bg-blue-500" : "bg-purple-500"
            }`}
          />
          <span
            className={`text-sm capitalize ${
              product.type === "session" ? "text-blue-600" : "text-purple-600"
            }`}
          >
            {product.type}
          </span>
        </div>
      ),
    },
    {
      title: "Price",
      render: (product: Product) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {formatCurrency(product.price)}
          </span>
          <span
            className={`text-xs ${
              product.access === "Free" ? "text-green-600" : "text-blue-600"
            }`}
          >
            {product.access}
          </span>
        </div>
      ),
    },
    {
      title: "Revenue",
      render: (product: Product) => (
        <span className="font-medium text-sm text-green-600">
          {formatCurrency(product.revenue)}
        </span>
      ),
    },
    {
      title: "Status",
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              product.status === "published"
                ? "bg-green-500"
                : product.status === "archived"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          />
          <span
            className={`text-sm capitalize ${
              product.status === "published"
                ? "text-green-600"
                : product.status === "archived"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {product.status}
          </span>
        </div>
      ),
    },
  ];

  if (isLoading && !products) {
    return <SectionLoader />;
  }

  // Show error state if there's an error and no cached data
  if (error && !products) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icon
          icon="lucide:alert-circle"
          className="w-16 h-16 text-red-300 mb-4"
        />
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Failed to Load Products
        </h3>
        <p className="text-gray-500 mb-4">
          {(error as any)?.response?.data?.message ||
            "Something went wrong while fetching products."}
        </p>
        <Button color="primary" size="sm" onClick={() => refetch()}>
          <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {products?.total || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon icon="lucide:package" className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-2xl font-semibold text-green-600">
                  {products?.items?.filter((p) => p.status === "published")
                    .length || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {products?.items?.filter((p) => p.status === "archived")
                    .length || 0}{" "}
                  archived
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon
                  icon="lucide:check-circle"
                  className="w-5 h-5 text-green-600"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sessions</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {products?.items?.filter((p) => p.type === "session")
                    .length || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {products?.items?.filter((p) => p.type === "normal").length ||
                    0}{" "}
                  normal products
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icon icon="lucide:video" className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {formatCurrency(
                    products?.items?.reduce((sum, p) => sum + p.revenue, 0) || 0
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {products?.items?.filter((p) => p.access === "Free").length ||
                    0}{" "}
                  free products
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icon
                  icon="lucide:dollar-sign"
                  className="w-5 h-5 text-orange-600"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border border-gray-200">
        <CardBody className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="input input-bordered w-full pl-10 pr-10"
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  {searchValue && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSearchValue("");
                        if (params.searchKey) {
                          setParams((prev) => ({
                            ...prev,
                            searchKey: "",
                            page: 1,
                          }));
                        }
                      }}
                    >
                      <Icon icon="lucide:x" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <Button
                color="primary"
                size="sm"
                onClick={handleSearch}
                loading={isFetching}
                disabled={!searchValue.trim()}
              >
                <Icon icon="lucide:search" className="w-4 h-4" />
                Search
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                loading={isFetching}
                disabled={isFetching}
              >
                <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
              </Button>
            </div>

            {/* Active Search Indicator */}
            {params.searchKey && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Icon icon="lucide:search" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Searching for: "<strong>{params.searchKey}</strong>"
                </span>
                <button
                  type="button"
                  className="ml-auto text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setParams((prev) => ({ ...prev, searchKey: "", page: 1 }));
                    setSearchValue("");
                  }}
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Products Table */}
      <Card className="bg-white border border-gray-200">
        <CardBody className="p-0 relative">
          {/* Loading overlay for background fetches */}
          {isFetching && products && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                <span className="text-sm">Updating...</span>
              </div>
            </div>
          )}

          {products?.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon
                icon="lucide:package"
                className="w-16 h-16 text-gray-300 mb-4"
              />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500">
                {params.searchKey
                  ? `No products found matching "${params.searchKey}"`
                  : "This creator hasn't added any products yet."}
              </p>
            </div>
          ) : (
            <>
              <DataGridTable
                columns={columns}
                data={products?.items || []}
                options={{ actionsColumnIndex: -1 }}
              />
              {products && (
                <div className="p-4 border-t">
                  <Pagination
                    pageCount={Math.ceil((products?.total || 0) / params.limit)}
                    page={params.page}
                    limit={params.limit}
                    setParams={setParams}
                    params={params}
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatorProduct;
