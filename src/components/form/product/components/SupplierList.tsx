import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalLegacy,
} from "@app/ui";
import { useToast } from "@app/helpers/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalParamsUrl } from "@app/lib/types/global";
import { EProduct } from "@app/lib/types/product";
import { GlobalService, ProductService } from "@app/services/actions";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";

import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { SectionLoader } from "@app/ui/SectionLoader";
import { Icon } from "@app/ui/Icon";

export interface SupplierListProps {
  product: any;
  locationData: any;
  setOpenAssignSkuModal: any;
}

interface SupplierOption {
  id: number;
  supplierName: string;
  isEnabled: boolean;
}

export const SupplierList: React.FC<SupplierListProps> = ({
  product,
  locationData,
  setOpenAssignSkuModal,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [params, setParams] = useState<GlobalParamsUrl & { tab?: string }>({
    tab: "supplier",
    searchKey: "",
    pageNumber: 1,
    pageSize: 10,
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<EProduct | null>(null);

  // Query for suppliers with proper error handling and caching
  const {
    data: supplierOptions,
    isLoading: isSuppliersLoading,
    error: suppliersError,
    refetch: refetchSuppliers,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await GlobalService.getAllSupplier();
      return (
        res?.data
          ?.filter((item: SupplierOption) => item.isEnabled)
          .map((item: SupplierOption) => ({
            id: item?.id,
            title: item?.supplierName,
          })) ?? []
      );
    },
  });

  // Query for supplier products with proper pagination and caching
  const {
    data: productList,
    isLoading: isProductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for assigning SKU with proper error handling and cache updates
  const assignSkuMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        supplierName: selectedProduct?.supplierName,
        supplierProductId: selectedProduct?.id,
        baseCurrencySymbol: selectedProduct?.baseCurrencySymbol,
        price: selectedProduct?.price,
        sortOrder: product?.sort,
      };
      if (!selectedProduct) throw new Error("No product selected");
      return await ProductService.assignSkuToProduct(payload, product?.id);
    },
    onSuccess: () => {
      // Optimistically update the cache
      queryClient.setQueryData(
        ["supplierProducts", selectedSupplier, params],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data:
              oldData.data?.filter(
                (item: EProduct) => item.id !== selectedProduct?.id
              ) || [],
          };
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["supplierProducts", product?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast.success("SKU assigned successfully");
      setOpenModal(false);
      setOpenAssignSkuModal(false);
      setSelectedProduct(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to assign SKU");
      // Refetch data on error to ensure consistency
      refetchProducts();
    },
  });

  const handleAssignSku = () => {
    assignSkuMutation.mutate();
  };

  const handleOpenModal = (item: EProduct) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  const handleSelectSupplier = (item: { id: number; title: string }) => {
    setSelectedSupplier(item.title);
    setParams({ ...params });
  };

  useEffect(() => {
    const queryFromUrl: any = locationData
      ? convertQueryParamsIntoObject(locationData)
      : params;

    const normalizedParams: typeof params = {
      tab: queryFromUrl?.tab || "supplier",
      pageNumber: Number(queryFromUrl?.pageNumber) || 1,
      searchKey: queryFromUrl?.searchKey || "",
      pageSize: Number(queryFromUrl?.pageSize) || 50,
    };

    setParams(normalizedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData]);

  return (
    <Card className="relative">
      <CardBody className="bg-base-100">
        <div className="relative">
          <SingleSelectDropdown
            options={supplierOptions ?? []}
            optionValue="title"
            optionName="title"
            selectedValue={selectedSupplier}
            handleChange={(_, item) => handleSelectSupplier(item)}
            placeholder="Select Supplier"
          />
        </div>

        {isSuppliersLoading || isProductsLoading ? (
          <SectionLoader />
        ) : suppliersError || productsError ? (
          <div className="text-center p-4">
            <p className="text-error mb-2">
              {suppliersError?.message ||
                productsError?.message ||
                "Failed to load data"}
            </p>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                if (suppliersError) refetchSuppliers();
                if (productsError) refetchProducts();
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <DataGridTable
              key={`product-list-${productList?.data?.length}`}
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
                {
                  title: "Actions",
                  render: (rowData: EProduct) => {
                    return (
                      <Button
                        size="sm"
                        color="primary"
                        onClick={() => handleOpenModal(rowData)}
                      >
                        Assign SKU
                      </Button>
                    );
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
            />
            <Pagination
              pageCount={productList?.totalPages}
              pageNumber={productList?.pageNumber}
              pageSize={params.pageSize}
              setParams={setParams}
              params={params}
            />
            <ModalLegacy
              onClickBackdrop={() => setOpenModal(false)}
              open={openModal}
              role="dialog"
              style={{ top: "10%", position: "absolute" }}
            >
              <form method="dialog">
                <Button
                  size="sm"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close modal"
                  onClick={() => setOpenModal(false)}
                >
                  <Icon icon="lucide:x" />
                </Button>
              </form>
              <ModalHeader className="font-bold">Confirm</ModalHeader>
              <ModalBody>
                <h3>Are you sure you want to assign this product SKU?</h3>
              </ModalBody>
              <ModalActions>
                <form method="dialog">
                  <Button
                    color="error"
                    size="sm"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </Button>
                </form>
                <form method="dialog">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleAssignSku}
                    loading={assignSkuMutation.isPending}
                    disabled={assignSkuMutation.isPending}
                  >
                    {assignSkuMutation.isPending ? "Assigning..." : "Confirm"}
                  </Button>
                </form>
              </ModalActions>
            </ModalLegacy>
          </>
        )}
      </CardBody>
    </Card>
  );
};
