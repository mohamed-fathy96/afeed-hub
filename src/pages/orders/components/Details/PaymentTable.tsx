import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";
import { OrderDetails, paymentMethodOptions } from "@app/lib/types/orders";
import { Card, CardBody, SectionHeader } from "@app/ui";
import { Icon } from "@app/ui/Icon";

export const PaymentTable = ({ orderData }: { orderData: OrderDetails }) => {
  return (
    <Card className="bg-white border-0 shadow-md">
      <CardBody className="p-6">
        <SectionHeader
          title="Pricing Summary"
          description=""
          icon="lucide:receipt"
          type="success"
        />

        <div className="space-y-4">
          {/* Payment Method */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon
                icon="lucide:credit-card"
                className="w-5 h-5 text-gray-600"
              />
              <span className="font-medium text-gray-700">Payment Method</span>
            </div>
            <span className="text-gray-900 font-semibold">
              {paymentMethodOptions.find(
                (item) => item.id === orderData?.paymentMethod
              )?.label || "N/A"}
            </span>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Subtotal</span>
              <CurrencyPriceLabel originalPrice={orderData?.subtotal || 0} />
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600 font-semibold">
                <CurrencyPriceLabel
                  originalPrice={
                    orderData?.discount !== undefined && orderData?.discount > 0
                      ? -Number(orderData?.discount)
                      : Number(orderData?.discount || 0)
                  }
                />
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Delivery Charge</span>
              <CurrencyPriceLabel
                originalPrice={orderData?.deliveryFee || 0}
                zeroAsFree
              />
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Delivery Tips</span>
              <CurrencyPriceLabel originalPrice={orderData?.driverTips || 0} />
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-semibold text-gray-900">
                  Total Price
                </span>
                <CurrencyPriceLabel
                  originalPrice={orderData?.totalPrice || 0}
                  zeroAsFree
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Paid Amount</span>
              <span className="text-blue-600 font-semibold">
                <CurrencyPriceLabel
                  originalPrice={orderData?.paidAmount || 0}
                  zeroAsFree
                />
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Refundable Amount</span>
              <CurrencyPriceLabel
                originalPrice={orderData?.refundableAmount || 0}
              />
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Paid From Wallet</span>
              <CurrencyPriceLabel
                originalPrice={orderData?.paidFromWallet || 0}
              />
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-semibold text-red-600">
                  Remaining Amount To Pay
                </span>
                <span className="text-red-600 font-bold text-lg">
                  <CurrencyPriceLabel
                    originalPrice={orderData?.remainingAmountToPay || 0}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
