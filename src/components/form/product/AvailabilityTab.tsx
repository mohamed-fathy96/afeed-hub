import { useToast } from "@app/helpers/hooks/use-toast";
import { Product, ProductAvailability } from "@app/lib/types/product";
import { ProductService } from "@app/services/actions";
import { useEffect, useState } from "react";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import { formatToLocalTime } from "@app/lib/utils/formatDate";

interface AvailabilityTabProps {
  product: Product | null;
}

const AvailabilityTab = ({ product }: AvailabilityTabProps) => {
  const [productAvailability, setProductAvailability] = useState<
    ProductAvailability[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const fetchProductAvailability = async () => {
    setIsLoading(true);
    try {
      const res = await ProductService.getProductAvailability(product?.id);
      if (res) {
        setProductAvailability(res?.data || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch product availability", error);
      toast.error(
        error?.response?.data?.message ?? "Failed to fetch product availability"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      fetchProductAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  const columns = [
    { title: "ID", field: "id" },
    { title: "Store", field: "storeName" },
    {
      title: "Stock Change Source",
      render: (rowData: ProductAvailability) => {
        if (!rowData?.previousStockChangeSource === null) {
          return "-";
        }
        return (
          <>
            {rowData?.previousStockChangeSource === 0
              ? "Odoo Stock Adjustment"
              : "Order Placed"}
          </>
        );
      },
    },
    {
      title: "Previous Stock Change Source",
      field: "previousStockChangeDescription",
    },
    {
      title: "Last Stock Change Date",
      render: (rowData: ProductAvailability) =>
        formatToLocalTime(rowData?.lastStockChangeDate) || "-",
    },
    {
      title: "Previous Stock",
      render: (rowData: ProductAvailability) => rowData?.previousStock,
    },
    {
      title: "Quantity",
      render: (rowData: ProductAvailability) => rowData?.quantity || "0",
    },
  ];
  return (
    <>
      {isLoading ? (
        <SectionLoader />
      ) : (
        <DataGridTable data={productAvailability} columns={columns} />
      )}
    </>
  );
};

export default AvailabilityTab;
