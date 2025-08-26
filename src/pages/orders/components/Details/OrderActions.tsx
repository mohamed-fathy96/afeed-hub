import {
  Card,
  CardBody,
  SectionHeader,
  Button,
  ModalBody,
  ModalHeader,
  ModalLegacy,
  Alert,
  Drawer,
  Select,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { Tooltip } from "@app/ui/Tooltip";
import { OrderDetails } from "@app/lib/types/orders";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";
import { useOrderActions } from "@app/lib/hooks/useOrderActions";
import { UpdateStatus } from "./UpdateStatus";
import RefundForm from "@app/components/form/refund/RefundForm";
import { EcardDetails } from "./EcardDetails";
import { paymentMethodOptions } from "@app/lib/types/orders";

export const OrderActions = ({
  orderData,
  orderId,
}: {
  orderData: OrderDetails;
  orderId: string;
}) => {
  const {
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

    // Setters
    setReissueModalOpen,
    setCardDetailsModalOpen,
    setRefund,
    setPaymentMethodModalOpen,
    setSelectedPaymentMethod,
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
  } = useOrderActions(orderData, orderId);

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg sticky top-0 z-20 overflow-visible">
        <CardBody className="p-6">
          <SectionHeader
            title="Order Actions"
            description=""
            type="info"
            icon="lucide:settings"
          />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 w-full">
              <>
                <Button
                  onClick={handleInvoice}
                  color="info"
                  className="w-full"
                  loading={invoiceMutation.isPending}
                >
                  Invoice
                </Button>
              </>
              <>
                {orderData?.canReissueVoucher && doesEcardProductExist ? (
                  <>
                    {
                      <RestrictedWrapper
                        requiredPermissions="orders"
                        action="reissue_order"
                      >
                        <Button
                          onClick={() => setReissueModalOpen(true)}
                          color="primary"
                          className="w-full"
                          loading={reissueMutation.isPending}
                        >
                          Reissue
                          <Tooltip
                            className="z-50"
                            message="Regenerate Voucher From Supplier"
                          >
                            <Icon icon="lucide:info" />
                          </Tooltip>
                        </Button>
                      </RestrictedWrapper>
                    }
                  </>
                ) : null}
              </>

              <>
                {orderData?.refundableAmount &&
                orderData?.refundableAmount > 0 ? (
                  <>
                    {
                      <RestrictedWrapper
                        requiredPermissions="orders"
                        action="refund_order"
                      >
                        <Button
                          onClick={() =>
                            setRefund({
                              isOpen: true,
                              selectedOrder: orderData ?? null,
                            })
                          }
                          color="warning"
                          className="w-full"
                        >
                          Refund
                        </Button>
                      </RestrictedWrapper>
                    }
                  </>
                ) : null}
              </>

              {orderData && (
                <RestrictedWrapper
                  requiredPermissions="orders"
                  action="update_status"
                >
                  <UpdateStatus
                    onCloseModal={handleCloseModal}
                    order={orderData}
                  />
                </RestrictedWrapper>
              )}

              <RestrictedWrapper
                requiredPermissions="orders"
                action="update_payment_method"
              >
                <Button
                  onClick={() => setPaymentMethodModalOpen(true)}
                  color="secondary"
                  className="w-full flex items-center gap-2"
                >
                  Payment Method
                  <Tooltip
                    className="z-50 flex items-center gap-2"
                    message="Change the payment method for this order"
                  >
                    <Icon icon="lucide:credit-card" />
                  </Tooltip>
                </Button>
              </RestrictedWrapper>

              <RestrictedWrapper
                requiredPermissions="orders"
                action="generate_payment_link"
              >
                <Button
                  onClick={handleGeneratePaymentLink}
                  color="success"
                  className="w-full flex items-center gap-2"
                  loading={generatePaymentLinkMutation.isPending}
                >
                  <span className="flex items-center gap-2">
                    Generate Payment Link
                    <Icon icon="lucide:link" className="w-4 h-4" />
                  </span>
                </Button>
              </RestrictedWrapper>

              <RestrictedWrapper
                requiredPermissions="orders"
                action="apply_coupon"
              >
                <Button
                  onClick={() => setApplyCouponModalOpen(true)}
                  color="accent"
                  className="w-full flex items-center gap-2"
                >
                  <span className="flex items-center gap-2">
                    Apply Coupon
                    <Icon icon="lucide:tag" className="w-4 h-4" />
                  </span>
                </Button>
              </RestrictedWrapper>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Reissue Modal */}
      <ModalLegacy
        open={reissueModalOpen}
        onClickBackdrop={closeReissueModal}
        role="dialog"
      >
        <form method="dialog">
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closeReissueModal}
          >
            <Icon icon="lucide:x" />
          </Button>
        </form>
        <ModalHeader className="font-bold">Reissue</ModalHeader>
        <ModalBody>
          <div className="p-3 space-y-3">
            Are you sure you want to reissue this order?
          </div>
        </ModalBody>
        <div className="flex justify-end gap-2 p-3">
          <Button
            color="primary"
            onClick={handleReissue}
            loading={reissueMutation.isPending}
          >
            Yes
          </Button>
          <Button color="secondary" onClick={closeReissueModal}>
            No
          </Button>
        </div>
      </ModalLegacy>

      {/* Resend Modal */}
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
                <span>Resend Existing Vouchers to Customer Via Infobip</span>
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

      {/* Remove Product Modal */}
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
            loading={removeProductMutation.isPending}
          >
            Yes
          </Button>
          <Button color="secondary" onClick={closeRemoveModal}>
            No
          </Button>
        </div>
      </ModalLegacy>

      {/* Refund Drawer */}
      <Drawer
        open={refund.isOpen}
        end
        onClickOverlay={() => setRefund({ isOpen: false, selectedOrder: null })}
        sideClassName="z-[100]"
        side={
          <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto m-3 min-w-96">
            <div className="bg-[#EDF0FE] p-4">
              <Button
                size="sm"
                type="button"
                shape="circle"
                className="absolute right-2 top-2"
                aria-label="Close Drawer"
                onClick={() => {
                  setRefund({ isOpen: false, selectedOrder: null });
                }}
              >
                <Icon icon="lucide:x" />
              </Button>
              <h4 className="font-bold ">Process Refund</h4>
            </div>
            <div>
              {refund.selectedOrder && (
                <RefundForm
                  isLoading={refundMutation.isPending}
                  onSubmit={submitRefundForm}
                  setRefund={setRefund}
                  order={refund.selectedOrder}
                />
              )}
            </div>
          </Card>
        }
      />

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

      {/* Payment Method Update Modal */}
      <ModalLegacy
        open={paymentMethodModalOpen}
        onClickBackdrop={closePaymentMethodModal}
        role="dialog"
      >
        <form method="dialog">
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closePaymentMethodModal}
          >
            <Icon icon="lucide:x" />
          </Button>
        </form>
        <ModalHeader className="font-bold">Update Payment Method</ModalHeader>
        <ModalBody>
          <div className="p-3 space-y-4">
            <Alert status="info" title="Payment Method Update">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:info" />
                <span>Select a new payment method for this order</span>
              </div>
            </Alert>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <Select
                value={selectedPaymentMethod}
                onChange={(e) =>
                  setSelectedPaymentMethod(Number(e.target.value))
                }
                className="w-full"
              >
                <option value={0}>Select Payment Method</option>
                {paymentMethodOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </ModalBody>
        <div className="flex justify-end gap-2 p-3">
          <Button color="secondary" onClick={closePaymentMethodModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleUpdatePaymentMethod}
            loading={updatePaymentMethodMutation.isPending}
            disabled={selectedPaymentMethod === 0}
          >
            Update
          </Button>
        </div>
      </ModalLegacy>

      {/* Payment Link Modal */}
      <ModalLegacy
        open={paymentLinkModalOpen}
        onClickBackdrop={closePaymentLinkModal}
        role="dialog"
      >
        <form method="dialog">
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closePaymentLinkModal}
          >
            <Icon icon="lucide:x" />
          </Button>
        </form>
        <ModalHeader className="font-bold">Payment Link Generated</ModalHeader>
        <ModalBody>
          <div className="p-3 space-y-4">
            <Alert status="success" title="Payment Link Ready">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check-circle" />
                <span>Payment link has been generated successfully</span>
              </div>
            </Alert>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Payment Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedPaymentLink}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                />
                <Button
                  size="sm"
                  color="primary"
                  onClick={copyPaymentLink}
                  className="flex-shrink-0"
                >
                  <Icon icon="lucide:copy" className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Click the copy button to copy the payment link to your clipboard
              </p>
            </div>
          </div>
        </ModalBody>
        <div className="flex justify-end gap-2 p-3">
          <Button color="secondary" onClick={closePaymentLinkModal}>
            Close
          </Button>
        </div>
      </ModalLegacy>

      {/* Apply Coupon Modal */}
      <ModalLegacy
        open={applyCouponModalOpen}
        onClickBackdrop={closeApplyCouponModal}
        role="dialog"
      >
        <form method="dialog">
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closeApplyCouponModal}
          >
            <Icon icon="lucide:x" />
          </Button>
        </form>
        <ModalHeader className="font-bold">Apply Coupon</ModalHeader>
        <ModalBody>
          <div className="p-3 space-y-4">
            <Alert status="info" title="Apply Coupon">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:info" />
                <span>Enter a coupon code to apply to this order</span>
              </div>
            </Alert>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </ModalBody>
        <div className="flex justify-end gap-2 p-3">
          <Button color="secondary" onClick={closeApplyCouponModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleApplyCoupon}
            loading={applyCouponMutation.isPending}
            disabled={!couponCode.trim()}
          >
            Apply Coupon
          </Button>
        </div>
      </ModalLegacy>
    </>
  );
};
