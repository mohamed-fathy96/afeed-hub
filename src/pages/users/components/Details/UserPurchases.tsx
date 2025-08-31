import React, { useState, useMemo } from "react";
import { Button, Card, CardBody, Input, SectionHeader } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Badge } from "@app/ui/Badge";
import { UserDetails } from "@app/lib/types/users";

interface UserPurchasesProps {
  purchases: UserDetails["purchases"];
}

const UserPurchases: React.FC<UserPurchasesProps> = ({ purchases }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter purchases based on search term
  const filteredPurchases = useMemo(() => {
    if (!purchases?.items) return [];
    if (!searchTerm) return purchases.items;

    return purchases.items.filter(
      (purchase) =>
        purchase.product.product_title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        purchase.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [purchases?.items, searchTerm]);

  // Paginate the filtered results
  const paginatedPurchases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPurchases.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPurchases, currentPage]);

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <h3 className="text-sm font-medium text-base-content/70">
                {searchTerm ? "Filtered" : "Total"} Purchases
              </h3>
              <p className="text-2xl font-bold text-primary">
                {searchTerm ? filteredPurchases.length : purchases?.total || 0}
              </p>
            </div>
            <Icon icon="lucide:shopping-bag" className="w-8 h-8 text-primary" />
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-success/10 to-success/5">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <h3 className="text-sm font-medium text-base-content/70">
                Captured
              </h3>
              <p className="text-2xl font-bold text-success">
                {
                  filteredPurchases.filter((p) => p.status === "captured")
                    .length
                }
              </p>
            </div>
            <Icon icon="lucide:check-circle" className="w-8 h-8 text-success" />
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-error/10 to-error/5">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <h3 className="text-sm font-medium text-base-content/70">
                Failed
              </h3>
              <p className="text-2xl font-bold text-error">
                {filteredPurchases.filter((p) => p.status === "failed").length}
              </p>
            </div>
            <Icon icon="lucide:x-circle" className="w-8 h-8 text-error" />
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <h3 className="text-sm font-medium text-base-content/70">
                Refunded
              </h3>
              <p className="text-2xl font-bold text-warning">
                {
                  filteredPurchases.filter((p) => p.status === "refunded")
                    .length
                }
              </p>
            </div>
            <Icon icon="lucide:undo-2" className="w-8 h-8 text-warning" />
          </CardBody>
        </Card>
      </div>

      {/* Search Results Indicator */}
      {searchTerm && (
        <div className="bg-base-200 p-3 rounded-lg">
          <p className="text-sm text-base-content/70">
            Showing {filteredPurchases.length} result
            {filteredPurchases.length !== 1 ? "s" : ""} for "{searchTerm}"
          </p>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Search Products</span>
              </label>
              <Input
                type="text"
                placeholder="Search by product title or creator name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} color="primary">
                <Icon icon="lucide:search" className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Data Table */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <SectionHeader
              title="Purchase History"
              description="All purchases made by this user"
              type="primary"
              icon="lucide:shopping-bag"
            />
          </div>

          {purchases?.items?.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                icon="lucide:shopping-bag"
                className="w-16 h-16 mx-auto text-base-content/30 mb-4"
              />
              <h3 className="text-lg font-medium text-base-content/70 mb-2">
                No purchases found
              </h3>
              <p className="text-base-content/50">
                This user hasn't made any purchases yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Creator</th>
                    <th>Purchase Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPurchases.map((purchase, index: number) => (
                    <tr key={purchase._id || index}>
                      <td>
                        <div>
                          <div className="font-medium text-sm">
                            {purchase.product.product_title}
                          </div>
                          <div className="text-xs text-base-content/70">
                            ID: {purchase.product._id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-sm">
                          {purchase.creator.name}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {formatToLocalTime(purchase.purchaseDate)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-medium">
                          ${purchase.amount.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <Badge
                          color={
                            purchase.status === "captured"
                              ? "success"
                              : purchase.status === "refunded"
                              ? "error"
                              : "warning"
                          }
                        >
                          {purchase.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Simple Pagination */}
              {Math.ceil(filteredPurchases.length / 10) > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="btn-group">
                    <Button
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      «
                    </Button>
                    <Button size="sm" className="btn-active">
                      Page {currentPage} of{" "}
                      {Math.ceil(filteredPurchases.length / 10)}
                    </Button>
                    <Button
                      size="sm"
                      disabled={
                        currentPage >= Math.ceil(filteredPurchases.length / 10)
                      }
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      »
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserPurchases;
