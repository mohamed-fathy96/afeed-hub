import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@app/services/actions";
import { PaymentLog, paymentMethodOptions } from "@app/lib/types/orders";
import { Card, CardBody, SectionHeader, Badge } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";
import { formatToLocalTime } from "@app/lib/utils/formatDate";

interface PaymentLogsProps {
  orderId: string;
}

export const PaymentLogs = ({ orderId }: PaymentLogsProps) => {
  const {
    data: paymentLogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-logs", orderId],
    queryFn: async () => {
      const response = await OrderService.getPaymentLogs(orderId);
      return response?.data || [];
    },
    enabled: !!orderId,
  });

  const getStatusColor = (requestStatus: number) => {
    switch (requestStatus) {
      case 0:
        return "warning"; // Pending
      case 1:
        return "info"; // Authorized
      case 2:
        return "success"; // Captured
      case 3:
        return "error"; // Failed
      case 4:
        return "neutral"; // Refunded
      case 5:
        return "error"; // Cancelled
      default:
        return "neutral";
    }
  };

  const getStatusLabel = (requestStatus: number) => {
    switch (requestStatus) {
      case 0:
        return "Pending";
      case 1:
        return "Authorized";
      case 2:
        return "Captured";
      case 3:
        return "Failed";
      case 4:
        return "Refunded";
      case 5:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getPaymentMethodLabel = (paymentMethod: number) => {
    return (
      paymentMethodOptions.find((option) => option.id === paymentMethod)
        ?.label || "Unknown"
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-0 shadow-md">
        <CardBody className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border-0 shadow-md">
        <CardBody className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Icon
                icon="lucide:alert-circle"
                className="w-12 h-12 text-red-500 mx-auto mb-4"
              />
              <p className="text-gray-600">Failed to load payment logs</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!paymentLogs || paymentLogs.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-md">
        <CardBody className="p-6">
          <SectionHeader
            title="Payment Logs"
            description="Payment transaction history for this order"
            icon="lucide:credit-card"
            type="info"
          />
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Icon
                icon="lucide:file-text"
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
              />
              <p className="text-gray-600">
                No payment logs found for this order
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0 shadow-md">
      <CardBody className="p-6">
        <SectionHeader
          title="Payment Logs"
          description="Payment transaction history for this order"
          icon="lucide:credit-card"
          type="info"
        />

        <div className="space-y-4">
          {paymentLogs.map((log: PaymentLog) => (
            <div
              key={log.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="lucide:credit-card"
                    className="w-5 h-5 text-gray-600"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Payment #{log.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getPaymentMethodLabel(log.paymentMethod)}
                    </p>
                  </div>
                </div>
                <Badge color={getStatusColor(log.requestStatus)}>
                  {getStatusLabel(log.requestStatus)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">
                      <CurrencyPriceLabel originalPrice={log.amount} />
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{getPaymentMethodLabel(log.paymentMethod)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Vendor:</span>
                    <span>{log.paymentVendor}</span>
                  </div>

                  {log.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.paymentId}
                      </span>
                    </div>
                  )}

                  {log.vendorExtraId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendor ID:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.vendorExtraId}
                      </span>
                    </div>
                  )}

                  {log.lastFour && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Four:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.lastFour}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{formatToLocalTime(log.createdAt)}</span>
                  </div>

                  {log.updatedAt !== log.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated:</span>
                      <span>{formatToLocalTime(log.updatedAt)}</span>
                    </div>
                  )}

                  {log.capturedOn && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Captured:</span>
                      <span>{formatToLocalTime(log.capturedOn)}</span>
                    </div>
                  )}

                  {log.refundedOn && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refunded:</span>
                      <span>{formatToLocalTime(log.refundedOn)}</span>
                    </div>
                  )}

                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Redirect Required:</span>
                    <span className={log.redirectRequired ? "text-green-600" : "text-gray-500"}>
                      {log.redirectRequired ? "Yes" : "No"}
                    </span>
                  </div> */}
                </div>
              </div>

              {log.redirectUrl && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <Icon
                      icon="lucide:link"
                      className="w-4 h-4 text-blue-500 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Redirect URL
                      </p>
                      <p className="text-sm text-blue-700 font-mono break-all">
                        {log.redirectUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
