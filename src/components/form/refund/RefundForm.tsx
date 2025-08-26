import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Textarea, Select } from "@app/ui";
import { InputField } from "@app/ui/InputField/InputField";
import { OrderDetails } from "@app/lib/types/orders";
import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";

const RefundForm: React.FC<{
  onSubmit: (values: any) => void;
  setRefund: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      selectedOrder: OrderDetails | null;
    }>
  >;
  order: OrderDetails | null;
  isLoading?: boolean;
}> = ({ onSubmit, setRefund, order, isLoading }) => {
  const validationSchema = Yup.object({
    refundAmount: Yup.number()
      .typeError("Refund amount must be a number")
      .min(0, "Refund amount must be at least 0")
      .required("Refund amount is required"),
    reason: Yup.string().required("Reason is required"),
    refundTarget: Yup.number().required("Refund target is required"),
  });

  const formik = useFormik({
    initialValues: {
      refundAmount: order?.refundableAmount ?? 0,
      reason: "",
      refundTarget: 1,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        refundAmount: Number(values.refundAmount),
        refundTarget: Number(values.refundTarget),
      });
      
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
      <div>
        <Select
          className="w-full"
          name="refundTarget"
          onChange={formik.handleChange}
          value={formik.values.refundTarget}
          required
        >
          <option value={1}>Bank</option>
          <option value={0}>Wallet</option>
        </Select>
      </div>
      <InputField
        label="Refund Amount"
        name="refundAmount"
        onChange={formik.handleChange}
        value={
          Number(formik.values.refundTarget) === 0
            ? Number(formik.values.refundAmount)
            : order?.refundableAmount
        }
        disabled={Number(formik.values.refundTarget) !== 0}
        required
        inputProps={{
          inputProps: {
            min: 0,

            step: "0.01", // Add this line to allow two decimal places
          },
          endAdornment: <b className="text-sm">QAR</b>,
        }}
        errorMessage={
          formik.touched.refundAmount ? formik.errors.refundAmount : undefined
        }
      />
      <div>
        <Textarea
          placeholder="Reason"
          className="w-full"
          name="reason"
          onChange={formik.handleChange}
          value={formik.values.reason}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => setRefund({ isOpen: false, selectedOrder: null })}
        >
          Cancel
        </Button>
        <Button type="submit" color="primary" loading={isLoading}>
          Submit
        </Button>
      </div>
      {order?.paidFromWallet && order?.paidFromWallet > 0 ? (
        <div className="flex justify-between space-x-4">
          <div>
            <span>Paid from wallet: </span>
            <span>
              <CurrencyPriceLabel originalPrice={order?.paidFromWallet} />
            </span>
          </div>
          <div>
            <span>Paid by bank: </span>
            <span>{order?.paidAmount - order?.paidFromWallet} QAR</span>
          </div>
        </div>
      ) : null}
    </form>
  );
};

export default RefundForm;
