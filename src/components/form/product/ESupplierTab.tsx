import { useToast } from "@app/helpers/hooks/use-toast";
import { Product } from "@app/lib/types/product";
import { ProductService } from "@app/services/actions";
import { useState } from "react";
import { SectionLoader } from "@app/ui/SectionLoader";
import ReorderableTable from "@app/ui/ReorderableTable";
import {
  Button,
  Card,
  Drawer,
  ModalLegacy,
  ModalHeader,
  ModalBody,
  ModalActions,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { SupplierList } from "./components/SupplierList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ESupplierTabProps {
  product: Product;
}

const ESupplierTab = ({ product }: ESupplierTabProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleOpenDrawer = () => setOpen(true);
  const handleCloseDrawer = () => {
    setOpen(false);
    const url = new URL(window.location.href);
    url.search = "?tab=supplier";
    window.history.replaceState(null, "", url.toString());
  };

  const {
    data: supplierProductList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["supplierProducts", product?.id],
    queryFn: async () => {
      const res = await ProductService.getESupplierProduct(product?.id);
      return res?.data || [];
    },
    enabled: !!product?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await ProductService.deleteESupplierProduct(itemId);
    },
    onSuccess: (data: any) => {
      toast.success(data?.message ?? "E-supplier product deleted successfully");
      refetch();
      setDeleteModalOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to delete e-supplier product"
      );
    },
  });

  const columns = [
    {
      title: "Move",
      field: "move",
      type: "action",
      id: "move",
      render: () => (
        <Icon icon="lucide:arrow-up-down" className="cursor-pointer" />
      ),
    },
    { title: "ID", field: "id", type: "number", id: "id" },
    {
      title: "Supplier ID",
      field: "supplierId",
      type: "string",
      id: "supplierId",
    },
    {
      title: "Supplier Product ID",
      field: "supplierProductId",
      type: "string",
      id: "supplierProductId",
    },
    {
      title: "Quantity",
      field: "quantity",
      id: "quantity",
      type: "number",
    },
    {
      title: "Price",
      render: (rowData: any) =>
        rowData?.price
          ? `${rowData?.baseCurrencySymbol}${rowData.price.toFixed(2)}`
          : "N/A",
      id: "price",
    },
    {
      title: "Actions",
      render: (rowData: any) => (
        <div className="flex gap-2">
          <Button
            color="error"
            size="sm"
            onClick={() => {
              setSelectedItem(rowData);
              setDeleteModalOpen(true);
            }}
          >
            <Icon icon="lucide:trash" />
          </Button>
        </div>
      ),
      id: "actions",
    },
  ];

  const handleRowReorder = async (newOrder: any) => {
    // payload sample [0,1,2]
    const payload = newOrder?.map((item: any) => Number(item?.id));
    try {
      const res = await ProductService.reorderSupplierProduct(
        payload,
        product?.id
      );
      if (res) {
        toast.success("Product reordered successfully");
      }
    } catch (error) {
      toast.error("Failed to reorder product");
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  return (
    <>
      {isLoading ? (
        <SectionLoader />
      ) : (
        <>
          <div className="flex justify-end">
            <Button color="primary" onClick={handleOpenDrawer}>
              <Icon icon="lucide:plus" />
              Assign Product
            </Button>
          </div>
          <ReorderableTable
            data={supplierProductList}
            onRowReorder={handleRowReorder}
            columns={columns}
          />
          {/* Button to open drawer */}
          {open && product && (
            <Drawer
              open={open}
              end
              onClickOverlay={handleCloseDrawer}
              sideClassName={"z-[100]"}
              side={
                <Card className="rounded-t-lg min-h-full bg-base-100 border-none overflow-y-auto w-[90%] m-3">
                  <div className="bg-[#EDF0FE] p-4">
                    <Button
                      size="sm"
                      type="button"
                      shape="circle"
                      className="absolute right-2 top-2"
                      aria-label="Close Drawer"
                      onClick={handleCloseDrawer}
                    >
                      <Icon icon="lucide:x" />
                    </Button>
                    <h4 className="font-bold text-base-content">
                      Supplier list
                    </h4>
                  </div>

                  <SupplierList
                    setOpenAssignSkuModal={setOpen}
                    product={product}
                    locationData={location.search}
                  />
                </Card>
              }
            />
          )}

          {/* Delete Confirmation Modal */}
          <ModalLegacy
            onClickBackdrop={() => {
              setDeleteModalOpen(false);
              setSelectedItem(null);
            }}
            open={deleteModalOpen}
            role="dialog"
          >
            <form method="dialog">
              <Button
                size="sm"
                shape="circle"
                className="absolute right-2 top-2"
                aria-label="Close modal"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedItem(null);
                }}
              >
                <Icon icon="lucide:x" />
              </Button>
            </form>
            <ModalHeader className="font-bold">Confirm Delete</ModalHeader>
            <ModalBody>
              <div className="p-3 space-y-3">
                Are you sure you want to delete this e-supplier product?
                {selectedItem && (
                  <div className="mt-2 p-2 bg-base-200 rounded">
                    <p>
                      <strong>Supplier ID:</strong> {selectedItem.supplierId}
                    </p>
                    <p>
                      <strong>Supplier Product ID:</strong>{" "}
                      {selectedItem.supplierProductId}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {selectedItem.quantity}
                    </p>
                    {selectedItem.price ? (
                      <p>
                        <strong>Price:</strong>{" "}
                        {selectedItem.baseCurrencySymbol}
                        {selectedItem.price.toFixed(2)}
                      </p>
                    ) : (
                      <p>
                        <strong>Price:</strong> N/A
                      </p>
                    )}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalActions>
              <form method="dialog">
                <Button
                  color="error"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setSelectedItem(null);
                  }}
                >
                  No
                </Button>
              </form>
              <form method="dialog">
                <Button
                  color="primary"
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                >
                  Yes
                </Button>
              </form>
            </ModalActions>
          </ModalLegacy>
        </>
      )}
    </>
  );
};

export default ESupplierTab;
