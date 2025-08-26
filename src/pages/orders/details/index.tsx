import React, { useState } from "react";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import {
  OrderDetails,
  OrderProductStatus,
  OrderStatusEnum,
  orderStatusOptions,
} from "@app/lib/types/orders";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Drawer,
  ModalBody,
  ModalHeader,
  ModalLegacy,
  SectionHeader,
  Input,
} from "@app/ui";
import { DataGridTable } from "@app/ui/Datagrid";
import { ImageWithFallback } from "@app/ui/Image";
import { useParams } from "react-router-dom";
import { OrderService } from "@app/services/actions";
import { PageTitle } from "@app/ui/PageTitle";
import { OrderDeliveryAddress } from "../components/Details/DeliveryAddress";
import { OrderCustomerDetail } from "../components/Details/CustomerDetail";
import { OrderTrack } from "../components/Details/OrderTrack";
import { Icon } from "@app/ui/Icon";
import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";
import { TimeSlot } from "@app/pages/orders/components/Details/TimeSlot";
import { IpInfo } from "../components/Details/IpInfo";
import Transactions from "../components/Transactions/Transactions";
import { ProductTypeEnum } from "@app/lib/types/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentTable } from "@app/pages/orders/components/Details/PaymentTable";
import { EcardDetails } from "@app/pages/orders/components/Details/EcardDetails";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { twMerge } from "tailwind-merge";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";
import { OrderActions } from "../components/Details/OrderActions";
import { ProductTable } from "@app/pages/orders/components/Details/ProductTable";
import { PaymentLogs } from "../components/Details/PaymentLogs";
import { routes } from "@app/lib/routes";

interface OrderDetailsPageProps {}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = () => {
  const params: { id?: string } = useParams();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<
    OrderDetails["products"][0] | null
  >(null);
  const [resendModalOpen, setResendModalOpen] = useState<boolean>(false);
  const [addProductModalOpen, setAddProductModalOpen] =
    useState<boolean>(false);
  const [cardDetailsModalOpen, setCardDetailsModalOpen] =
    useState<boolean>(false);
  const [selectedCardProduct, setSelectedCardProduct] = useState<
    OrderDetails["products"][0] | null
  >(null);
  const [updateQuantityModalOpen, setUpdateQuantityModalOpen] =
    useState<boolean>(false);
  const [updatedProduct, setUpdatedProduct] = useState<
    OrderDetails["products"][0] | null
  >(null);

  // React Query for fetching order details
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: ["order", params?.id],
    queryFn: async () => {
      if (!params?.id) throw new Error("Order ID is required");
      const res = await OrderService.getOrderById({ id: params.id }, params.id);
      return res?.data;
    },
    enabled: !!params?.id,
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!params?.id) throw new Error("Order ID is required");
      return await OrderService.resendOrder(params.id);
    },
    onSuccess: () => {
      toast.success("Order resent successfully");
      setResendModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["order", params?.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to resend order");
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!params?.id) throw new Error("Order ID is required");
      return await OrderService.removeProductFromOrder(params.id, productId);
    },
    onSuccess: () => {
      toast.success("Product removed successfully");
      setRemoveModalOpen(false);
      setSelectedProduct(null);
      queryClient.invalidateQueries({ queryKey: ["order", params?.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to remove product");
    },
  });

  const updateProductQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => {
      if (!params?.id) throw new Error("Order ID is required");
      return await OrderService.updateOrderProduct(
        { quantity },
        params.id,
        productId
      );
    },
    onSuccess: () => {
      toast.success("Product quantity updated successfully");
      setUpdateQuantityModalOpen(false);
      setUpdatedProduct(null);
      queryClient.invalidateQueries({ queryKey: ["order", params?.id] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update product quantity"
      );
    },
  });

  const handleResend = () => {
    resendMutation.mutate();
  };

  const handleRemoveProduct = (product: OrderDetails["products"][0]) => {
    removeProductMutation.mutate(product.id);
  };

  const openRemoveModal = (product: OrderDetails["products"][0]) => {
    setSelectedProduct(product);
    setRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setRemoveModalOpen(false);
    setSelectedProduct(null);
  };

  const closeResendModal = () => {
    setResendModalOpen(false);
  };

  const openUpdateQuantityModal = (product: OrderDetails["products"][0]) => {
    setUpdatedProduct(product);
    setUpdateQuantityModalOpen(true);
  };

  const closeUpdateQuantityModal = () => {
    setUpdateQuantityModalOpen(false);
    setUpdatedProduct(null);
  };

  // Computed values
  const status = orderStatusOptions.find(
    (option) => option.id === orderData?.status
  );

  const columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "SKU",
      field: "product.sku",
      render: (rowData: OrderDetails["products"][0]) => (
        <a
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
          href={`https://barcode.tec-it.com/barcode.ashx?data=${rowData?.sku}&code=Code128&translate-esc=on`}
        >
          {rowData?.sku || "N/A"}
        </a>
      ),
    },
    {
      title: "Name",
      field: "product.title",
      render: (rowData: OrderDetails["products"][0]) =>
        rowData?.name || rowData?.nameEn || "N/A",
    },
    {
      title: "Image",
      render: (rowData: OrderDetails["products"][0]) => (
        <ImageWithFallback
          src={rowData?.image}
          alt={rowData?.name || "Product"}
          className="w-14 h-14 object-cover rounded"
        />
      ),
    },

    {
      title: "Quantity",
      render: (rowData: OrderDetails["products"][0]) =>
        rowData.pricing.quantity,
    },
    {
      title: "Price",
      render: (rowData: OrderDetails["products"][0]) => {
        return (
          <div className="flex">
            <CurrencyPriceLabel originalPrice={rowData?.pricing?.unitPrice} />
          </div>
        );
      },
    },
    {
      title: "Actions",
      render: (rowData: OrderDetails["products"][0]) => {
        // hide actions if product status is among the following
        const hideActions =
          [
            OrderProductStatus.Picked,
            OrderProductStatus.Removed,
            OrderProductStatus.Substituted,
          ].includes(rowData?.productStatus) ||
          orderData?.status === OrderStatusEnum.Completed ||
          orderData?.status === OrderStatusEnum.Cancelled ||
          orderData?.zatcaReported === true;

        const hideRemove =
          [OrderProductStatus.Removed].includes(rowData?.productStatus) ||
          orderData?.status === OrderStatusEnum.Cancelled ||
          orderData?.zatcaReported === true;
        const isEcardProduct = rowData?.productType === ProductTypeEnum.ECard;
        // If both actions should be hidden, return null (no buttons)
        if (hideActions && hideRemove) return null;

        return (
          <div className="flex gap-2 flex-col">
            {!hideActions && (
              <Button
                color="primary"
                variant="outline"
                size="sm"
                onClick={() => openUpdateQuantityModal(rowData)}
              >
                Update
              </Button>
            )}
            {isEcardProduct && (
              <>
                <Button
                  color="success"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setResendModalOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    <Icon icon="lucide:refresh-cw" />
                    <span>Resend</span>
                  </span>
                </Button>
                <Button
                  color="info"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelectedCardProduct(rowData);
                    setCardDetailsModalOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:info" />
                    <span className="whitespace-nowrap">Card Details</span>
                  </div>
                </Button>
              </>
            )}
            {!hideRemove && (
              <Button
                color="error"
                variant="outline"
                size="sm"
                onClick={() => openRemoveModal(rowData)}
              >
                Remove
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {isOrderLoading && !orderData ? (
        <SectionLoader />
      ) : (
        <>
          <PageTitle
            title={"Order Details"}
            breadCrumbItems={[
              { label: "Orders", path: routes.dashboard.orders.index },
              { label: `Order #${params?.id}`, active: true },
            ]}
          />
          <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mt-6">
              <div className="lg:col-span-8 space-y-6">
                {/* Modern Header Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Order #{params?.id}
                          </h1>
                          {orderData?.uniqueCode && (
                            <h1 className="text-xl font-bold text-gray-900 mb-1">
                              Unique Code #{orderData?.uniqueCode}
                            </h1>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Icon icon="lucide:calendar" className="w-4 h-4" />
                            <span className="text-sm">
                              {formatToLocalTime(orderData?.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={twMerge(
                              "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm",
                              status?.colorClass
                            )}
                          >
                            <div className="w-2 h-2 rounded-full bg-current mr-2 opacity-75"></div>
                            {status?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                  {orderData && orderData?.timeslot && (
                    <TimeSlot order={orderData} />
                  )}

                  {orderData && <OrderCustomerDetail order={orderData} />}
                  {orderData && (
                    <OrderDeliveryAddress
                      order={orderData}
                      fetchOrder={() => refetchOrder()}
                    />
                  )}
                </div>
                {/* Products Section */}
                <Card className="bg-white border-0 shadow-md">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                      <SectionHeader
                        title="Cart Items"
                        description="Products in this order"
                        icon="lucide:shopping-cart"
                        type="warning"
                      />
                      <Button
                        color="primary"
                        variant="outline"
                        onClick={() => setAddProductModalOpen(true)}
                      >
                        <Icon icon="lucide:shopping-cart" />
                        Add to Cart
                      </Button>
                    </div>
                    <DataGridTable
                      data={orderData?.products || []}
                      columns={columns}
                      options={{ grouping: false }}
                    />
                  </CardBody>
                </Card>
                {orderData && <PaymentTable orderData={orderData} />}
                {/* Transaction History */}
                {orderData?.id && <Transactions id={orderData?.id} />}
              </div>
              <div className="lg:col-span-4 space-y-6">
                {/* Modern Actions Card */}
                {orderData && params?.id && (
                  <OrderActions orderData={orderData} orderId={params.id} />
                )}
                {/* IP Info Card */}

                {orderData && <IpInfo order={orderData} />}
                {orderData && <PaymentLogs orderId={orderData?.id} />}

                {/* Order Tracking Card */}
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardBody className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Icon
                          icon="lucide:truck"
                          className="w-5 h-5 text-teal-600"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order Tracking
                      </h3>
                    </div>
                    <div className="mt-2 overflow-hidden">
                      {orderData && <OrderTrack order={orderData} />}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/*Resend Modal */}
              <ModalLegacy
                open={resendModalOpen}
                onClickBackdrop={closeResendModal}
                role="dialog"
              >
                <form method="dialog">
                  <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={closeResendModal}
                  >
                    <Icon icon="lucide:x" />
                  </Button>
                </form>
                <ModalHeader className="font-bold">Resend</ModalHeader>
                <ModalBody>
                  <div className=" space-y-3">
                    <Alert status="info" title="Resend Vouchers">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:info" />
                        <span>
                          Resend Existing Vouchers to Customer Via Infobip
                        </span>
                      </div>
                    </Alert>
                  </div>
                  <div className="p-3 space-y-3">
                    Are you sure you want to resend vouchers for this order?
                  </div>
                </ModalBody>
                <div className="flex justify-end gap-2 p-3">
                  <Button color="secondary" onClick={closeResendModal}>
                    No
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleResend}
                    loading={resendMutation.isPending}
                  >
                    Yes
                  </Button>
                </div>
              </ModalLegacy>

              <ModalLegacy
                open={removeModalOpen}
                onClickBackdrop={closeRemoveModal}
                role="dialog"
              >
                <form method="dialog">
                  <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={closeRemoveModal}
                  >
                    <Icon icon="lucide:x" />
                  </Button>
                </form>
                <ModalHeader className="font-bold">Remove</ModalHeader>
                <ModalBody>
                  <div className="p-3 space-y-3">
                    Are you sure you want to remove this product?
                  </div>
                </ModalBody>
                <div className="flex justify-end gap-2 p-3">
                  <Button
                    color="primary"
                    onClick={() => {
                      if (selectedProduct) {
                        handleRemoveProduct(selectedProduct);
                      }
                      closeRemoveModal();
                    }}
                  >
                    Yes
                  </Button>
                  <Button color="secondary" onClick={closeRemoveModal}>
                    No
                  </Button>
                </div>
              </ModalLegacy>

              {/* Card Details Modal */}
              <Drawer
                open={cardDetailsModalOpen}
                end
                onClickOverlay={() => setCardDetailsModalOpen(false)}
                sideClassName={"z-[100]"}
                side={
                  <EcardDetails
                    selectedCardProduct={selectedCardProduct}
                    setCardDetailsModalOpen={setCardDetailsModalOpen}
                  />
                }
              />
              <Drawer
                open={addProductModalOpen}
                end
                onClickOverlay={() => setAddProductModalOpen(false)}
                sideClassName={"z-[100]"}
                side={
                  <ProductTable
                    id={orderData?.id}
                    fetchById={() => refetchOrder()}
                    setCloseModal={() => setAddProductModalOpen(false)}
                  />
                }
              />

              {/* Update Quantity Modal */}
              <ModalLegacy
                open={updateQuantityModalOpen}
                onClickBackdrop={closeUpdateQuantityModal}
                role="dialog"
              >
                <form method="dialog">
                  <Button
                    size="sm"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={closeUpdateQuantityModal}
                  >
                    <Icon icon="lucide:x" />
                  </Button>
                </form>
                <ModalHeader className="font-bold">Update Quantity</ModalHeader>
                <ModalBody>
                  <div className="space-y-3">
                    <Alert status="info" title="Update Quantity">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:info" />
                        <span>
                          Update the quantity for this product in the order.
                        </span>
                      </div>
                    </Alert>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Quantity:</span>
                      <Input
                        type="number"
                        value={updatedProduct?.pricing.quantity || ""}
                        onChange={(e) =>
                          setUpdatedProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  pricing: {
                                    ...prev.pricing,
                                    quantity: parseInt(e.target.value, 10),
                                  },
                                }
                              : null
                          )
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                </ModalBody>
                <div className="flex justify-end gap-2 p-3">
                  <Button color="secondary" onClick={closeUpdateQuantityModal}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      if (updatedProduct) {
                        updateProductQuantityMutation.mutate({
                          productId: updatedProduct.id,
                          quantity: updatedProduct.pricing.quantity,
                        });
                      }
                    }}
                    loading={updateProductQuantityMutation.isPending}
                  >
                    Update
                  </Button>
                </div>
              </ModalLegacy>
            </div>
          </>
        </>
      )}
    </>
  );
};
