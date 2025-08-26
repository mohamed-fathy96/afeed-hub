import { useToast } from "@app/helpers/hooks/use-toast";
import {
  OrderDetails,
  PaymentMethodEnum,
  paymentMethodOptions,
} from "@app/lib/types/orders";
import { OrderService } from "@app/services/actions";
import { Button, CardBody } from "@app/ui";
import { InputField } from "@app/ui/InputField";
import { useState } from "react";

interface OrderPaymentDetailProps {
  order?: OrderDetails;
  orderId: string;
}

const OrderPaymentDetail = ({ orderId }: OrderPaymentDetailProps) => {
  const [isAuthCodeLoading, setIsAuthCodeLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<number>();
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);

  const [authCode, setAuthCode] = useState<string>("");
  const toast = useToast();

  const handleUpdateCode = async () => {
    const data = {
      authCode,
    };
    setIsAuthCodeLoading(true);
    try {
      const res = await OrderService.addAuthCode(data, orderId);
      if (res?.data) {
        toast.success("Auth code updated successfully");
        setIsAuthCodeLoading(false);
      }
    } catch (error) {
      toast.error("Failed to update auth code");
      setIsAuthCodeLoading(false);
    }
  };
  const handleSelectPayment = async () => {
    const data = {
      paymentMethod,
    };
    setIsPaymentLoading(true);
    try {
      const res = await OrderService.updatePaymentMethod(data, orderId);
      if (res?.data) {
        toast.success("Payment method updated successfully");
        setIsPaymentLoading(false);
      }
    } catch (error) {
      toast.error("Failed to update payment method");
      setIsPaymentLoading(false);
    }
  };
  return (
    <CardBody>
      <p className="rounded-box bg-base-content/5 px-3 py-2 text-base font-medium max-h-10">
        Payment Information
      </p>
      <div className="mt-2 flex gap-3">
        <div className="grow">
          {Number(paymentMethod) === PaymentMethodEnum.posDevice && (
            <div className="flex gap-4 w-full items-center">
              <div className="flex-1">
                <InputField
                  type="text"
                  name="authCode"
                  label="Auth Code"
                  className="!h-[48px]"
                  placeholder="Enter Auth Code"
                  onChange={(e) => setAuthCode(e.target.value)}
                />
              </div>
              <div>
                <Button
                  loading={isAuthCodeLoading}
                  variant="outline"
                  color="primary"
                  onClick={handleUpdateCode}
                >
                  Auth Code
                </Button>
              </div>
            </div>
          )}{" "}
          <div className="flex gap-4 w-full items-center">
            <div className="flex-1">
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm h-[48px]"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(Number(e.target.value))}
              >
                {paymentMethodOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              color="primary"
              loading={isPaymentLoading}
              onClick={handleSelectPayment}
            >
              Update
            </Button>
          </div>
        </div>
        {/* <Badge
            className={("font-medium capitalize", {
              "bg-success/20 text-success": status == "paid",
              "bg-error/20 text-error": status == "unpaid",
            })}
          >
            {status}
          </Badge> */}
      </div>
    </CardBody>
  );
};

export { OrderPaymentDetail };
