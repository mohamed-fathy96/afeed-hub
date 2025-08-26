import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalService, ProductService } from "@app/services/actions";
import { GlobalParamsUrl } from "@app/lib/types/global";
import { EProduct } from "@app/lib/types/product";
import { toast } from "sonner";

interface SupplierOption {
  id: number;
  supplierName: string;
  isEnabled: boolean;
}

interface UseProductProps {
  selectedSupplier?: string | null;
  params?: GlobalParamsUrl & { tab?: string };
}

export const useProduct = ({
  selectedSupplier,
  params,
}: UseProductProps = {}) => {
  const queryClient = useQueryClient();

  // Fetch suppliers
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

  // Fetch supplier products
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
        searchKey: params?.searchKey || "",
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 10,
      };
      const res = await ProductService.getSupplierProducts(
        apiParams,
        selectedSupplier
      );
      return res?.data;
    },
    enabled: !!selectedSupplier,
  });

  // Assign SKU mutation
  const assignSkuMutation = useMutation({
    mutationFn: async ({
      product,
      selectedProduct,
    }: {
      product: any;
      selectedProduct: EProduct;
    }) => {
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
    onSuccess: (_data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        ["supplierProducts", selectedSupplier, params],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data:
              oldData.data?.filter(
                (item: EProduct) => item.id !== variables.selectedProduct?.id
              ) || [],
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to assign SKU");
    },
  });

  // Delete supplier product mutation
  const deleteSupplierProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await ProductService.deleteESupplierProduct(productId);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["supplierProducts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
      queryClient.refetchQueries({
        queryKey: ["suppliers"],
      });
    },
  });

  // Toggle supplier status mutation
  const toggleSupplierStatusMutation = useMutation({
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
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["supplierProducts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
      queryClient.refetchQueries({
        queryKey: ["suppliers"],
      });
    },
  });

  // Reorder supplier products mutation
  const reorderSupplierProductsMutation = useMutation({
    mutationFn: async ({
      productId,
      payload,
    }: {
      productId: number;
      payload: number[];
    }) => {
      return await ProductService.reorderSupplierProduct(payload, productId);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["supplierProducts"],
      });
    },
  });
  const handleAssignSku = (product: any, selectedProduct: EProduct) => {
    assignSkuMutation.mutate({ product, selectedProduct });
  };
  return {
    // Queries
    supplierOptions,
    isSuppliersLoading,
    suppliersError,
    refetchSuppliers,
    productList,
    isProductsLoading,
    productsError,
    refetchProducts,

    // Mutations
    assignSkuMutation,
    deleteSupplierProductMutation,
    toggleSupplierStatusMutation,
    reorderSupplierProductsMutation,

    // Utility functions
    assignSku: handleAssignSku,
    deleteSupplierProduct: (productId: number) =>
      deleteSupplierProductMutation.mutate(productId),
    toggleSupplierStatus: (supplierId: number, isEnabled: boolean) =>
      toggleSupplierStatusMutation.mutate({ supplierId, isEnabled }),
    reorderSupplierProducts: (productId: number, payload: number[]) =>
      reorderSupplierProductsMutation.mutate({ productId, payload }),

    // Additional utilities
    refetchAll: () => {
      refetchSuppliers();
      refetchProducts();
    },
  };
};
