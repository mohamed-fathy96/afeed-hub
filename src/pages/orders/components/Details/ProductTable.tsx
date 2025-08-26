import React, { useState } from "react";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import { OrderService, ProductService } from "@app/services/actions";
import { Button, Card, CardBody, Input } from "@app/ui";
import { ImageWithFallback } from "@app/ui/Image";
import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";
import { Icon } from "@app/ui/Icon";

interface ProductTableProps {
  id: number;
  fetchById: (id: number) => Promise<any>;
  setCloseModal: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  id,
  fetchById,
  setCloseModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState<any>([]);
  const [productQuantities, setProductQuantities] = useState<{
    [key: number]: number;
  }>({});
  const toast = useToast();

  const handleUpdateOrder = async (product: any) => {
    const quantity = productQuantities[product.id] || 1;

    const payload = {
      quantity,
    };

    try {
      const res = await OrderService.addProductToOrder(
        payload,
        id,
        product?.id
      );
      if (res?.data) {
        toast.success(
          res?.data?.message ?? "Product added to cart successfully"
        );
        fetchById(id);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to add product to cart"
      );
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleSearchOnProduct = async (searchParams: string) => {
    if (searchParams && searchParams?.length >= 2) {
      setDataList([]);
      setProductQuantities({});
      setIsLoading(true);
      try {
        const res = await ProductService.getProductBySearch({
          query: searchParams,
          pageNumber: 1,
        });
        setDataList(res?.data);
        setIsLoading(false);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to get list");
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="space-y-4 mt-5 bg-base-100 min-w-[90%] h-full shadow-xl rounded-2xl border border-base-200">
      <div className="bg-primary/10 p-6 rounded-t-2xl relative flex items-center justify-between">
        <h4 className="font-bold text-lg">Add Product to Cart</h4>
        <Button
          size="sm"
          type="button"
          shape="circle"
          className="absolute right-4 top-4 btn btn-ghost btn-circle"
          aria-label="Close Drawer"
          onClick={() => setCloseModal()}
        >
          <Icon icon="lucide:x" />
        </Button>
      </div>
      <CardBody className="p-6">
        <div className="flex gap-4 flex-wrap mb-4">
          <Input
            placeholder="Search By SKU or Name"
            onChange={(e) => handleSearchOnProduct(e?.target?.value)}
            className="w-full"
          />
        </div>
        {isLoading ? (
          <SectionLoader />
        ) : (
          <div className="flex flex-col gap-4 h-[calc(100vh-200px)] overflow-y-auto">
            {dataList?.length > 0 ? (
              <>
                {dataList?.map((product: any) => {
                  const quantity = productQuantities[product.id] || 1;
                  return (
                    <div
                      key={product.id}
                      className="mb-4 flex items-center gap-4 bg-base-200/60 rounded-xl p-4 border border-base-300"
                    >
                      <ImageWithFallback
                        src={product?.imageUrl}
                        alt={product?.name || "Product Image"}
                        className="w-20 h-20 object-cover rounded-xl border border-base-300 bg-base-100"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-base text-base-content mb-1">
                          {product?.name}
                        </div>
                        <div className="text-sm text-base-content/70 mb-1">
                          SKU:{" "}
                          <span className="badge badge-ghost badge-sm">
                            {product?.sku || "N/A"}
                          </span>
                        </div>
                        <div className="text-sm text-base-content/70">
                          Available:{" "}
                          <span className="badge badge-outline badge-sm">
                            {product?.availableQuantity || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="form-control w-28">
                          <span className="label-text text-base-content/70">
                            Quantity
                          </span>
                          <input
                            type="number"
                            min="1"
                            max={product?.availableQuantity}
                            className="input input-bordered w-full rounded-lg"
                            disabled={product?.availableQuantity === 0}
                            value={quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                Number(e.target.value)
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="text-right flex flex-col gap-2">
                        <span className="text-success font-bold text-lg">
                          <CurrencyPriceLabel
                            originalPrice={parseFloat(
                              (
                                Number(quantity) * Number(product?.price)
                              ).toFixed(2)
                            )}
                          />
                        </span>
                        <div className="text-xs text-base-content/60">
                          ({product?.price} QAR e.a)
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          disabled={
                            product?.availableQuantity === 0 || quantity <= 0
                          }
                          color="primary"
                          size="sm"
                          className="btn btn-primary rounded-lg px-4"
                          onClick={() => handleUpdateOrder(product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex justify-center items-center h-32">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Icon
                        icon="lucide:search"
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-600">
                        Search for a product to add to the cart
                      </p>
                    </div>
                  </div>
                </CardBody>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
