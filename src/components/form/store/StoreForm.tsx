import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { InputField } from "@app/ui/InputField";
import { Button, Card, CardBody } from "@app/ui";
import { StoreService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Store, storeStatusArr } from "@app/lib/types/store";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";

interface Props {
  data?: Store; // Replace with a Store type if available
  id?: number;
  fetchData?: () => void;
}

const StoreForm: React.FC<Props> = ({ data, id, fetchData }) => {
  const toast = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      description: data?.description || "",
      published: data?.published || false,
      timezone: data?.timezone || "",
      opensAt: data?.opensAt || "",
      closesAt: data?.closesAt || "",
      status: data?.status || 0,
      deliveryCharge: data?.deliveryCharge || 0,
      minimumOrderPrice: data?.minimumOrderPrice || 0,
      rating: data?.rating || 0,
      countryId: data?.countryId || 0,
      freeDeliveryAfterAmount: data?.freeDeliveryAfterAmount || 0,
      deliveryMinutesThreshold: data?.deliveryMinutesThreshold || 0,
      OdooCompanyId: data?.OdooCompanyId || 0,
      expressDeliveryStartsAt: data?.expressDeliveryStartsAt || 0,
      expressDeliveryEndsAt: data?.expressDeliveryEndsAt || 0,
      deliveryChargeForScheduledDelivery:
        data?.deliveryChargeForScheduledDelivery || 0,
      freeDeliveryAfterAmountScheduledDelivery:
        data?.freeDeliveryAfterAmountScheduledDelivery || 0,
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("Title is required"),
      description: yup.string().required("Description is required"),
      timezone: yup.string().required("Timezone is required"),
      opensAt: yup.string().required("Opens At time is required"),
      closesAt: yup.string().required("Closes At time is required"),
      deliveryCharge: yup
        .number()
        .min(0, "Delivery Charge must be at least 0")
        .required("Delivery Charge is required"),
      minimumOrderPrice: yup
        .number()
        .min(0, "Minimum Order Price must be at least 0")
        .required("Minimum Order Price is required"),
      rating: yup
        .number()
        .min(0, "Rating must be at least 0")
        .required("Rating is required"),
      countryId: yup.number().required("Country ID is required"),
      freeDeliveryAfterAmount: yup
        .number()
        .min(0, "Free Delivery After Amount must be at least 0")
        .required("Free Delivery After Amount is required"),
      deliveryMinutesThreshold: yup
        .number()
        .min(0, "Delivery Minutes Threshold must be at least 0")
        .required("Delivery Minutes Threshold is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (id) {
          await StoreService.updateStore(values, id);
          toast.success("Store updated successfully");
          fetchData && fetchData();
        } else {
          await StoreService.createStore(values);
          toast.success("Store created successfully");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to save store");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardBody className="bg-base-100 space-y-4">
            <InputField
              id="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.title && formik.errors.title
                  ? formik.errors.title
                  : undefined
              }
            />
            <InputField
              id="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : undefined
              }
            />
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Published</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={formik.values.published}
                  onChange={(e) => formik.setFieldValue('published', e.target.checked)}
                />
              </label>
            </div>
            <InputField
              id="timezone"
              label="Timezone"
              value={formik.values.timezone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.timezone && formik.errors.timezone
                  ? formik.errors.timezone
                  : undefined
              }
            />
            <InputField
              id="opensAt"
              label="Opens At"
              type="time"
              value={formik.values.opensAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.opensAt && formik.errors.opensAt
                  ? formik.errors.opensAt
                  : undefined
              }
            />
            <InputField
              id="closesAt"
              label="Closes At"
              type="time"
              value={formik.values.closesAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.closesAt && formik.errors.closesAt
                  ? formik.errors.closesAt
                  : undefined
              }
            />
            <InputField
              id="expressDeliveryStartsAt"
              label="Express Delivery Start At"
              type="time"
              value={formik.values.expressDeliveryStartsAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.expressDeliveryStartsAt &&
                formik.errors.expressDeliveryStartsAt
                  ? formik.errors.expressDeliveryStartsAt
                  : undefined
              }
            />
            <InputField
              id="expressDeliveryEndsAt"
              label="Express Delivery Ends At"
              type="time"
              value={formik.values.expressDeliveryEndsAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.expressDeliveryEndsAt &&
                formik.errors.expressDeliveryEndsAt
                  ? formik.errors.expressDeliveryEndsAt
                  : undefined
              }
            />

            <SingleSelectDropdown
              options={storeStatusArr}
              placeholder={"Select Store Status"}
              handleChange={(_e, formValue) => {
                formik.setFieldValue("status", formValue?.id);
              }}
              optionName="name"
              optionValue="id"
              errorMsg={
                formik.touched.status && formik.errors.status
                  ? formik.errors.status
                  : undefined
              }
              selectedValue={formik.values.status}
            />
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardBody className="bg-base-100 space-y-4">
            <InputField
              id="deliveryCharge"
              label="Delivery Charge (Express Delivery)"
              type="number"
              value={formik.values.deliveryCharge}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.deliveryCharge && formik.errors.deliveryCharge
                  ? formik.errors.deliveryCharge
                  : undefined
              }
            />
            <InputField
              id="minimumOrderPrice"
              label="Minimum Order Price (Express Delivery)"
              type="number"
              value={formik.values.minimumOrderPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.minimumOrderPrice &&
                formik.errors.minimumOrderPrice
                  ? formik.errors.minimumOrderPrice
                  : undefined
              }
            />
            {/* <InputField
              id="rating"
              label="Rating"
              type="number"
              value={formik.values.rating}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.rating && formik.errors.rating
                  ? formik.errors.rating
                  : undefined
              }
            /> */}
            <InputField
              id="countryId"
              label="Country ID"
              type="number"
              value={formik.values.countryId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.countryId && formik.errors.countryId
                  ? formik.errors.countryId
                  : undefined
              }
            />
            <InputField
              id="freeDeliveryAfterAmount"
              label="Free Delivery After Amount (Express Delivery)"
              type="number"
              value={formik.values.freeDeliveryAfterAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.freeDeliveryAfterAmount &&
                formik.errors.freeDeliveryAfterAmount
                  ? formik.errors.freeDeliveryAfterAmount
                  : undefined
              }
            />
            <InputField
              id="freeDeliveryAfterAmountScheduledDelivery"
              label="Free Delivery After Amount (Scheduled Delivery)"
              type="number"
              value={formik.values.freeDeliveryAfterAmountScheduledDelivery}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.freeDeliveryAfterAmountScheduledDelivery &&
                formik.errors.freeDeliveryAfterAmountScheduledDelivery
                  ? formik.errors.freeDeliveryAfterAmountScheduledDelivery
                  : undefined
              }
            />
            <InputField
              id="deliveryChargeForScheduledDelivery"
              label="Delivery Charge (Scheduled Delivery)"
              type="number"
              value={formik.values.deliveryChargeForScheduledDelivery}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.deliveryChargeForScheduledDelivery &&
                formik.errors.deliveryChargeForScheduledDelivery
                  ? formik.errors.deliveryChargeForScheduledDelivery
                  : undefined
              }
            />
            <InputField
              id="deliveryMinutesThreshold"
              label="Delivery Minutes Threshold"
              type="number"
              value={formik.values.deliveryMinutesThreshold}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.deliveryMinutesThreshold &&
                formik.errors.deliveryMinutesThreshold
                  ? formik.errors.deliveryMinutesThreshold
                  : undefined
              }
            />
            <InputField
              id="OdooCompanyId"
              label="Odoo Company Id"
              value={formik.values.OdooCompanyId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled
              errorMessage={
                formik.touched.OdooCompanyId && formik.errors.OdooCompanyId
                  ? formik.errors.OdooCompanyId
                  : undefined
              }
            />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 ">
        <Button
          type="submit"
          color="primary"
          className="w-full md:w-auto"
          loading={loading}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default StoreForm;
