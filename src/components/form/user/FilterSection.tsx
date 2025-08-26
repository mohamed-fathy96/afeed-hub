import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";

import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import DateRangePickerComponent from "@app/ui/DateRangePicker/DateRangePicker";
import { Button, Card, Drawer } from "@app/ui";
import { ITransactionsParamsUrl } from "@app/lib/types/users";
import { Icon } from "@app/ui/Icon";
import { UserService } from "@app/services/actions";
import { InputField } from "@app/ui/InputField";
import { useToast } from "@app/helpers/hooks/use-toast";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";

type TransactionType = "add" | "deduct";
const FilterSection: React.FC<{
  params: ITransactionsParamsUrl;
  setParams: any;
  userId: number;
  onTransactionSuccess?: () => void;
}> = ({ params, setParams, userId, onTransactionSuccess }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>("add");
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [walletModal, setWalletModal] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
    notes: Yup.string().required("Note is required"),
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const data = {
        amount: values.amount,
        notes: values.notes,
      };
      let res;
      try {
        if (values.amount > 0) {
          setSubmitting(true);

          if (selectedType === "add") {
            res = await UserService.addUserBalance(data, userId);
          } else if (selectedType === "deduct" && values.amount > 0) {
            res = await UserService.deductUserBalance(data, userId);
          }
          if (res?.data) {
            resetForm();
            setWalletModal(false);
            setSubmitting(false);
            toast.success(`Transaction ${selectedType} successfully!`);
            if (onTransactionSuccess) {
              onTransactionSuccess();
            }
          }
        } else {
          toast.error("Amount should be greater than 0");
          setSubmitting(false);
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Something went wrong");
        setWalletModal(false);
        setSubmitting(false);
      }
    },
  });

  const handleDateRange = (item: any) => {
    setDateRange(item?.selection);
  };

  const handleApplyDateRange = () => {
    setParams({
      ...params,
      startDate: dayjs(dateRange?.startDate || new Date()).format("YYYY-MM-DD"),
      endDate: dayjs(dateRange?.endDate || new Date()).format("YYYY-MM-DD"),
    });
  };

  const handleClickFilter = () => {
    const searchValue = searchInputRef.current?.value || "";
    setParams({ ...params, searchKey: searchValue });
    const queryString = convertObjectIntoQueryParams({
      ...params,
      searchKey: searchValue,
    });
    navigate({ search: queryString });
  };

  return (
    <div className="bg-base-100 shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input with Filter Button */}
        <div className="relative col-span-1 flex">
          <input
            ref={searchInputRef}
            type="text"
            className="w-full border border-gray-300 rounded-md pl-10 py-2 text-sm"
            placeholder="Search"
            defaultValue={params?.searchKey}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                setParams({ ...params, searchKey: value });
                handleClickFilter();
              }
            }}
          />
          <Button
            onClick={handleClickFilter}
            className="ml-2 px-3 py-2 rounded-md bg-primary text-base-100 text-sm"
          >
            Filter
          </Button>
        </div>

        {/* Date Picker */}
        <div className="justify-end col-span-1">
          <div
            className="relative border border-base-content rounded-md py-2 px-3 text-sm cursor-pointer"
            onClick={() => setShowDatePicker((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowDatePicker((prev) => !prev);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 16h14M5 21h14"
                />
              </svg>
              {`${dayjs(dateRange?.startDate)?.format("DD MMM YYYY") || ""} - ${
                dayjs(dateRange?.endDate)?.format("DD MMM YYYY") || ""
              }`}
            </div>
          </div>
          {showDatePicker && (
            <DateRangePickerComponent
              setShowDatePicker={setShowDatePicker}
              handleDateRangeChange={handleDateRange}
              handleApplyDateRange={handleApplyDateRange}
              dateRange={dateRange}
              minDate={new Date()}
            />
          )}
        </div>
        <RestrictedWrapper requiredPermissions="users" action="update_wallet">
          <div className="flex justify-end col-span-1">
            <Button
              color="primary"
              size="sm"
              onClick={() => setWalletModal(true)}
            >
              Update Wallet
            </Button>
          </div>
        </RestrictedWrapper>
      </div>

      {/* Filter Button */}
      <div className="flex justify-end mt-4">
        <Button
          color="primary"
          variant="outline"
          size="md"
          onClick={handleClickFilter}
        >
          Filter
        </Button>
        <Drawer
          open={walletModal}
          end
          onClickOverlay={() => setWalletModal(false)}
          sideClassName={"z-[100]"}
          side={
            <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto w-96 m-3">
              <div className="bg-[#EDF0FE] p-4">
                <Button
                  size="sm"
                  type="button"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close Drawer"
                  onClick={() => {
                    setWalletModal(false);
                  }}
                >
                  <Icon icon="lucide:x" />
                </Button>
                <h4 className="font-bold ">Update User Wallet</h4>
              </div>
              <form
                className="p-3 space-y-3 "
                onSubmit={formik.handleSubmit}
                onBlur={formik.handleBlur}
              >
                <div>
                  <label
                    htmlFor="transactionType"
                    className="text-sm font-semibold"
                  >
                    Transaction Type
                  </label>
                  <select
                    id="transactionType"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value as TransactionType)
                    }
                  >
                    <option value="add">Add Balance</option>
                    <option value="deduct">Deduct Balance</option>
                  </select>
                </div>
                <InputField
                  type="number"
                  label="Amount"
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.amount && formik.errors.amount
                      ? formik.errors.amount
                      : ""
                  }
                  inputProps={{ endAdornment: <b>QAR</b> }}
                />
                <div>
                  <label htmlFor="notes" className="text-sm">
                    Note
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    required
                    className="mt-3 bg-base-100 border-base-200 border"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.notes}
                    style={{ width: "100%", padding: "12px" }}
                    rows={4}
                    placeholder="Write note about the transaction"
                  />
                  {formik.touched.notes && formik.errors.notes ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.notes}
                    </div>
                  ) : null}
                </div>
                <Button
                  color="primary"
                  size="md"
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  className="capitalize"
                  loading={formik.isSubmitting}
                >
                  {selectedType} Balance
                </Button>
              </form>
            </Card>
          }
        />
      </div>
    </div>
  );
};

export default FilterSection;
