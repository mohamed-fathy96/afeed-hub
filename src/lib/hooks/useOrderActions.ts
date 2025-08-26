import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@app/helpers/hooks/use-toast";
import { OrderDetails } from "@app/lib/types/orders";
import { OrderService } from "@app/services/actions";
import { ProductTypeEnum } from "@app/lib/types/product";

export const useOrderActions = (orderData?: OrderDetails, orderId?: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<
    OrderDetails["products"][0] | null
  >(null);
  const [reissueModalOpen, setReissueModalOpen] = useState<boolean>(false);
  const [resendModalOpen, setResendModalOpen] = useState<boolean>(false);
  const [cardDetailsModalOpen, setCardDetailsModalOpen] =
    useState<boolean>(false);
  const [selectedCardProduct, setSelectedCardProduct] = useState<
    OrderDetails["products"][0] | null
  >(null);

  const [refund, setRefund] = useState<{
    isOpen: boolean;
    selectedOrder: OrderDetails | null;
  }>({
    isOpen: false,
    selectedOrder: null,
  });

  const [paymentMethodModalOpen, setPaymentMethodModalOpen] =
    useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(0);
  const [paymentLinkModalOpen, setPaymentLinkModalOpen] =
    useState<boolean>(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState<string>("");
  const [applyCouponModalOpen, setApplyCouponModalOpen] =
    useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");

  // Mutations
  const invoiceMutation = useMutation({
    mutationFn: async () => {
      if (!orderData?.guid) throw new Error("Order GUID is required");
      return await OrderService.getInvoice(orderData.guid);
    },
    onSuccess: (res) => {
      if (res) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Invoice.pdf";
        link.click();
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to generate invoice"
      );
    },
  });

  const reissueMutation = useMutation({
    mutationFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.reissueOrder(orderId);
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message ?? "Order reissued successfully");
      setReissueModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to reissue order");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.resendOrder(orderId);
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message ?? "Order resent successfully");
      setResendModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to resend order");
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.removeProductFromOrder(orderId, productId);
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message ?? "Product removed successfully");
      setRemoveModalOpen(false);
      setSelectedProduct(null);
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to remove product");
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (values: any) => {
      if (!refund.selectedOrder?.id) throw new Error("Order ID is required");
      const res = await OrderService.refundOrder(
        values,
        refund.selectedOrder.id
      );
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message ?? "Refund processed successfully");
      setRefund({ isOpen: false, selectedOrder: null });
      queryClient.invalidateQueries({
        queryKey: ["order-transactions", orderId],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to process refund");
    },
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethod: number) => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.updateOrderPaymentMethod(
        { paymentMethod },
        orderId
      );
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(
        res?.data?.message ?? "Payment method updated successfully"
      );
      setPaymentMethodModalOpen(false);
      setSelectedPaymentMethod(0);
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update payment method"
      );
    },
  });

  const generatePaymentLinkMutation = useMutation({
    mutationFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.generatePaymentLink(orderId);
      return res;
    },
    onSuccess: (res: any) => {
      if (res?.data?.link) {
        setGeneratedPaymentLink(res.data.link);
        setPaymentLinkModalOpen(true);
        toast.success("Payment link generated successfully");
      } else {
        toast.success(
          res?.data?.message ?? "Payment link generated successfully"
        );
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to generate payment link"
      );
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: async (data: {
      couponCode: string;
      deliveryDateType: number;
    }) => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.applyCoupon(data, orderId);
      return res;
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message ?? "Coupon applied successfully");
      setApplyCouponModalOpen(false);
      setCouponCode("");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to apply coupon");
    },
  });

  const getTransactions = useQuery({
    queryKey: ["order-transactions", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const res = await OrderService.getOrderTransactions(orderId);
      return res?.data || [];
    },
    enabled: !!orderId,
  });
  // Handlers
  const handleInvoice = () => {
    invoiceMutation.mutate();
  };

  const handleReissue = () => {
    reissueMutation.mutate();
  };

  const handleResend = () => {
    resendMutation.mutate();
  };

  const handleRemoveProduct = (product: OrderDetails["products"][0]) => {
    removeProductMutation.mutate(product.id);
  };

  const submitRefundForm = (values: any) => {
    refundMutation.mutate(values);
    queryClient.invalidateQueries({
      queryKey: ["order-transactions", orderId],
    });
  };

  const handleRefund = (values: any) => {
    refundMutation.mutate(values);
    queryClient.invalidateQueries({
      queryKey: ["order-transactions", orderId],
    });
  };

  const openRemoveModal = (product: OrderDetails["products"][0]) => {
    setSelectedProduct(product);
    setRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setRemoveModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseModal = (updateTable = false) => {
    if (updateTable) {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  };

  const closeResendModal = () => {
    setResendModalOpen(false);
  };

  const closeReissueModal = () => {
    setReissueModalOpen(false);
  };

  const handleUpdatePaymentMethod = () => {
    if (selectedPaymentMethod > 0) {
      updatePaymentMethodMutation.mutate(selectedPaymentMethod);
    }
  };

  const closePaymentMethodModal = () => {
    setPaymentMethodModalOpen(false);
    setSelectedPaymentMethod(0);
  };

  const closePaymentLinkModal = () => {
    setPaymentLinkModalOpen(false);
    setGeneratedPaymentLink("");
  };

  const copyPaymentLink = () => {
    if (generatedPaymentLink) {
      navigator.clipboard.writeText(generatedPaymentLink);
      toast.success("Payment link copied to clipboard");
    }
  };

  const handleGeneratePaymentLink = () => {
    generatePaymentLinkMutation.mutate();
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCouponMutation.mutate({
        couponCode: couponCode.trim(),
        deliveryDateType: orderData?.deliveryDateType ?? 0,
      });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  };

  const closeApplyCouponModal = () => {
    setApplyCouponModalOpen(false);
    setCouponCode("");
  };

  // Computed values
  const doesEcardProductExist = orderData?.products.some(
    (product: OrderDetails["products"][0]) =>
      product?.productType === ProductTypeEnum.ECard
  );

  return {
    // State
    removeModalOpen,
    selectedProduct,
    reissueModalOpen,
    resendModalOpen,
    cardDetailsModalOpen,
    selectedCardProduct,
    refund,
    paymentMethodModalOpen,
    selectedPaymentMethod,
    paymentLinkModalOpen,
    generatedPaymentLink,
    applyCouponModalOpen,
    couponCode,
    getTransactions,

    // Setters
    setRemoveModalOpen,
    setSelectedProduct,
    setReissueModalOpen,
    setResendModalOpen,
    setCardDetailsModalOpen,
    setSelectedCardProduct,
    setRefund,
    setPaymentMethodModalOpen,
    setSelectedPaymentMethod,
    setPaymentLinkModalOpen,
    setGeneratedPaymentLink,
    setApplyCouponModalOpen,
    setCouponCode,

    // Mutations
    invoiceMutation,
    reissueMutation,
    resendMutation,
    removeProductMutation,
    refundMutation,
    updatePaymentMethodMutation,
    generatePaymentLinkMutation,
    applyCouponMutation,

    // Handlers
    handleInvoice,
    handleReissue,
    handleResend,
    handleRemoveProduct,
    submitRefundForm,
    handleRefund,
    openRemoveModal,
    closeRemoveModal,
    handleCloseModal,
    closeResendModal,
    closeReissueModal,
    handleUpdatePaymentMethod,
    closePaymentMethodModal,
    closePaymentLinkModal,
    copyPaymentLink,
    handleGeneratePaymentLink,
    handleApplyCoupon,
    closeApplyCouponModal,

    // Computed values
    doesEcardProductExist,
  };
};
