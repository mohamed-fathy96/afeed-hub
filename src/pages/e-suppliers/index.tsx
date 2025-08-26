import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  ModalActions,
} from "@app/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalParamsUrl } from "@app/lib/types/global";
import { EProduct } from "@app/lib/types/product";
import { GlobalService, ProductService } from "@app/services/actions";
import {
  convertQueryParamsIntoObject,
  convertObjectIntoQueryParams,
} from "@app/lib/helpers/constants/helpers";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";

export interface SupplierListProps {}

interface SupplierOption {
  id: number;
  supplierName: string;
  isEnabled: boolean;
}

const ESupplierPage: React.FC<SupplierListProps> = ({}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedSupplierData, setSelectedSupplierData] =
    useState<SupplierOption | null>(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [params, setParams] = useState<GlobalParamsUrl & { supplier?: string }>(
    {
      supplier: "",
      searchKey: "",
      pageNumber: 1,
      pageSize: 50,
    }
  );

  const {
    data: supplierOptions,
    isLoading: isSuppliersLoading,
    refetch: refetchSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await GlobalService.getAllSupplier();
      return (
        res?.data?.map((item: SupplierOption) => ({
          id: item?.id,
          supplierName: item?.supplierName,
          isEnabled: item?.isEnabled,
          title:
            item?.supplierName +
            " (" +
            (item?.isEnabled ? "Enabled" : "Disabled") +
            ")",
        })) ?? []
      );
    },
  });

  const { data: productList, isLoading: isProductsLoading } = useQuery({
    queryKey: ["supplierProducts", selectedSupplier, params],
    queryFn: async () => {
      if (!selectedSupplier) return null;
      const apiParams = {
        searchKey: params.searchKey,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      };
      const res = await ProductService.getSupplierProducts(
        apiParams,
        selectedSupplier
      );
      return res?.data;
    },
    enabled: !!selectedSupplier,
  });

  const toggleSupplierMutation = useMutation({
    mutationFn: async ({
      supplierId,
      isEnabled,
    }: {
      supplierId: number;
      isEnabled: boolean;
    }) => {
      return await ProductService.toggleSupplierStatus(
        { isEnabled },
        supplierId
      );
    },
    onSuccess: () => {
      toast.success("Supplier status updated successfully");
      setIsToggleModalOpen(false);
      setSelectedSupplierData(null);
      refetchSuppliers();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to update supplier status"
      );
    },
  });

  const handleSelectSupplier = (item: SupplierOption) => {
    const updatedParams = { ...params, supplier: item.supplierName };
    setSelectedSupplier(item.supplierName);
    setSelectedSupplierData(item);
    setParams(updatedParams);

    // Update URL query parameters
    const queryString = convertObjectIntoQueryParams(updatedParams);
    navigate({ search: queryString });
  };

  const handleToggleSupplierStatus = () => {
    if (selectedSupplierData) {
      const isEnabled: boolean = !selectedSupplierData?.isEnabled;
      toggleSupplierMutation.mutate({
        supplierId: selectedSupplierData.id,
        isEnabled,
      });
    }
  };

  useEffect(() => {
    const queryFromUrl: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const normalizedParams: typeof params = {
      supplier: queryFromUrl?.supplier || "",
      pageNumber: Number(queryFromUrl?.pageNumber) || 1,
      searchKey: queryFromUrl?.searchKey || "",
      pageSize: Number(queryFromUrl?.pageSize) || 50,
    };

    setParams(normalizedParams);
    setSelectedSupplier(queryFromUrl.supplier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <Card>
      <CardBody className="bg-base-100">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SingleSelectDropdown
              options={supplierOptions ?? []}
              optionValue="title"
              optionName="title"
              selectedValue={selectedSupplier}
              handleChange={(_, item) => handleSelectSupplier(item)}
              placeholder="Select Supplier"
            />
          </div>
          <Button color="primary">Add Supplier</Button>
        </div>

        {/* Supplier Status Toggle Section */}
        {selectedSupplierData && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedSupplierData.supplierName}
                </h3>
                <p className="text-sm text-base-content/70">
                  Current Status:
                  <span
                    className={`ml-1 font-medium ${
                      selectedSupplierData.isEnabled
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {selectedSupplierData.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </p>
              </div>
              <Button
                color={selectedSupplierData.isEnabled ? "error" : "success"}
                onClick={() => setIsToggleModalOpen(true)}
                disabled={toggleSupplierMutation.isPending}
              >
                {toggleSupplierMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : selectedSupplierData.isEnabled ? (
                  "Disable Supplier"
                ) : (
                  "Enable Supplier"
                )}
              </Button>
            </div>
          </div>
        )}

        {isSuppliersLoading || isProductsLoading ? (
          <SectionLoader />
        ) : (
          <>
            <DataGridTable
              data={productList?.data ?? []}
              columns={[
                { title: "ID", field: "id" },
                { title: "SKU", field: "sku" },
                { title: "Name", field: "name" },
                { title: "Supplier Name", field: "supplierName" },
                {
                  title: "Price",
                  field: "price",
                  render: (rowData: EProduct) =>
                    `${rowData?.baseCurrencySymbol}${rowData?.price}` || "N/A",
                },
              ]}
              options={{ actionsColumnIndex: -1 }}
            />
            <Pagination
              pageCount={productList?.totalPages}
              pageNumber={productList?.pageNumber}
              pageSize={params.pageSize}
              setParams={setParams}
              params={params}
            />
          </>
        )}

        {/* Confirmation Modal */}
        <Modal
          open={isToggleModalOpen}
          onClose={() => setIsToggleModalOpen(false)}
        >
          <ModalHeader>Confirm Supplier Status Change</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to{" "}
              <span className="font-semibold">
                {selectedSupplierData?.isEnabled ? "disable" : "enable"}
              </span>{" "}
              the supplier{" "}
              <span className="font-semibold">
                {selectedSupplierData?.supplierName}
              </span>
              ?
            </p>
            <p className="text-sm text-base-content/70 mt-2">
              This action will{" "}
              {selectedSupplierData?.isEnabled ? "prevent" : "allow"} the
              supplier from being used in the system.
            </p>
          </ModalBody>
          <ModalActions>
            <Button
              variant="outline"
              onClick={() => setIsToggleModalOpen(false)}
              disabled={toggleSupplierMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              color={selectedSupplierData?.isEnabled ? "error" : "success"}
              onClick={handleToggleSupplierStatus}
              disabled={toggleSupplierMutation.isPending}
            >
              {toggleSupplierMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                `Confirm ${
                  selectedSupplierData?.isEnabled ? "Disable" : "Enable"
                }`
              )}
            </Button>
          </ModalActions>
        </Modal>
      </CardBody>
    </Card>
  );
};
export default ESupplierPage;
