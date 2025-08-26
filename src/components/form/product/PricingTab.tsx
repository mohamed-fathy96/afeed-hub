import { useToast } from "@app/helpers/hooks/use-toast";
import { Product, ProductAvailability } from "@app/lib/types/product";
import { ProductService } from "@app/services/actions";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField } from "@app/ui/InputField";
import { SectionLoader } from "@app/ui/SectionLoader";
import { Button, Card, Badge, CheckboxCard, SectionHeader } from "@app/ui";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Icon } from "@app/ui/Icon";

interface ListingFormProps {
  product: Product | null;
}

const PricingTab = ({ product }: ListingFormProps) => {
  const [productAvailability, setProductAvailability] = useState<
    ProductAvailability[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});
  const toast = useToast();

  const fetchProductAvailability = async () => {
    setIsLoading(true);
    try {
      const res = await ProductService.getProductAvailability(product?.id);
      if (res) {
        setProductAvailability(res?.data || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.[0] ||
          "Failed to fetch product availability"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      fetchProductAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      items: productAvailability.map((item) => ({
        storeName: item.storeName ?? "",
        originalPrice: item.originalPrice ?? 0,
        discountedPrice: item.discountedPrice ?? 0,
        published: item.published ?? false,
        allowDiscount: Boolean(
          item.scheduledDiscountedPrice && item.scheduledDiscountedPrice > 0
        ),
        discountFrom: item.discountFrom ?? "",
        discountTo: item.discountTo ?? "",
        scheduledDiscountedPrice: item.scheduledDiscountedPrice ?? 0,
        quantity: item.quantity ?? 0,
      })),
    },
    validationSchema: Yup.object().shape({
      items: Yup.array().of(
        Yup.object().shape({
          originalPrice: Yup.number()
            .required("Original price is required")
            .min(0, "Original price cannot be negative")
            .test(
              "is-valid-number",
              "Original price must be a valid number",
              (value) => {
                return value !== undefined && value !== null && !isNaN(value);
              }
            ),

          discountedPrice: Yup.number()
            .nullable()
            .transform((value) => (isNaN(value) ? null : value))
            .min(0, "Discounted price cannot be negative")
            .test(
              "less-than-original",
              "Discounted price must be less than original price",
              function (value) {
                const originalPrice = this.parent.originalPrice;
                if (
                  value === null ||
                  value === undefined ||
                  originalPrice === null ||
                  originalPrice === undefined
                ) {
                  return true; // Allow empty/null values, they'll be handled by other validations
                }
                return value < originalPrice;
              }
            )
            .typeError("Discounted price must be a valid number"),

          scheduledDiscountedPrice: Yup.number().when(["allowDiscount"], {
            is: (allowDiscount: boolean) => allowDiscount,
            then: () =>
              Yup.number()
                .required("Scheduled discounted price is required")
                .min(0.01, "Scheduled discounted price must be greater than 0")
                .test(
                  "less-than-original-scheduled",
                  "Scheduled discounted price must be less than original price",
                  function (value) {
                    const originalPrice = this.parent.originalPrice;
                    if (
                      value === null ||
                      value === undefined ||
                      originalPrice === null ||
                      originalPrice === undefined
                    ) {
                      return true;
                    }
                    return value < originalPrice;
                  }
                ),
          }),
          discountFrom: Yup.string().when(["allowDiscount"], {
            is: (allowDiscount: boolean) => allowDiscount,
            then: () =>
              Yup.string().required("Discount start date is required"),
          }),
          discountTo: Yup.string().when(["allowDiscount"], {
            is: (allowDiscount: boolean) => allowDiscount,
            then: () => Yup.string().required("Discount end date is required"),
          }),
        })
      ),
    }),
    onSubmit: async () => {
      // No bulk submit here
    },
  });

  const handleSaveSection = async (index: number) => {
    const mapId = productAvailability[index].id;
    const item = {
      ...formik.values.items[index],
      discountedPrice:
        formik.values.items[index].allowDiscount &&
        formik.values.items[index].scheduledDiscountedPrice
          ? formik.values.items[index].scheduledDiscountedPrice
          : formik.values.items[index].discountedPrice,
      discountFrom: formik.values.items[index].allowDiscount
        ? formik.values.items[index].discountFrom
        : null,
      discountTo: formik.values.items[index].allowDiscount
        ? formik.values.items[index].discountTo
        : null,
    };

    const itemErrors = await formik.validateForm();
    const hasErrors =
      itemErrors.items &&
      Array.isArray(itemErrors.items) &&
      itemErrors.items[index] &&
      Object.keys(itemErrors.items[index]).length > 0;

    if (hasErrors) {
      const sectionErrors = itemErrors?.items?.[index];
      const errorMessages = sectionErrors
        ? Object.entries(sectionErrors)
            .map(([field, error]) => `${field}: ${error}`)
            .join(", ")
        : "";

      toast.error(
        `Validation errors for Store ${item.storeName}: ${errorMessages}`
      );
      return;
    }

    setIsUpdating((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await ProductService.updateStoreProduct(item, mapId);
      if (res) {
        toast.success(`Store ${item.storeName} updated successfully`);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.errors?.[0] ||
          error?.response?.data?.message ||
          `Failed to update Store ${item.storeName}`
      );
    } finally {
      setIsUpdating((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <>
      {isLoading ? (
        <SectionLoader />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {formik.values.items?.map((item, index) => (
            <Card key={`store-${item.storeName}-${index}`}>
              <form
                onSubmit={formik.handleSubmit}
                onBlur={formik.handleBlur}
                className="grid grid-cols-2 gap-4 mt-4 p-4"
              >
                <div className="bg-gradient-to-r col-span-2 from-primary/5 to-primary/10 p-6 border-b border-base-300/30">
                  <div className="flex items-center justify-between">
                    <SectionHeader
                      type="primary"
                      title="Pricing"
                      description="Store-specific pricing and settings"
                      icon="lucide:dollar-sign"
                    />
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-bold text-base-content">
                            {item?.storeName}
                          </h4>
                          {formik.values.items[index]?.published && (
                            <Badge color="success" size="sm">
                              Published
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-base-content/60 mt-1">
                          Store-specific pricing and settings
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <InputField
                  type="number"
                  name={`items[${index}].originalPrice`}
                  value={formik.values.items[index]?.originalPrice ?? ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldTouched(
                      `items[${index}].originalPrice`,
                      true
                    );
                  }}
                  onBlur={formik.handleBlur}
                  label="Original Price"
                  errorMessage={
                    formik.touched.items?.[index]?.originalPrice &&
                    formik.errors.items?.[index] &&
                    typeof formik.errors.items[index] === "object" &&
                    !Array.isArray(formik.errors.items[index]) &&
                    "originalPrice" in (formik.errors.items[index] as object)
                      ? (formik.errors.items[index] as any).originalPrice
                      : ""
                  }
                />

                <InputField
                  type="number"
                  name={`items[${index}].discountedPrice`}
                  value={formik.values.items[index]?.discountedPrice ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Discounted Price"
                  errorMessage={
                    formik.touched.items?.[index]?.discountedPrice &&
                    formik.errors.items?.[index] &&
                    typeof formik.errors.items[index] === "object" &&
                    !Array.isArray(formik.errors.items[index]) &&
                    "discountedPrice" in (formik.errors.items[index] as object)
                      ? (formik.errors.items[index] as any).discountedPrice
                      : ""
                  }
                />

                <div className="gap-4 col-span-2 grid grid-cols-2">
                  <CheckboxCard
                    type="success"
                    name={`items[${index}].published`}
                    checked={formik.values.items[index]?.published || false}
                    onChange={formik.handleChange}
                    title="Published"
                    description="Make this product visible to customers in this store"
                    icon="lucide:eye"
                  />
                  <CheckboxCard
                    type="primary"
                    name={`items[${index}].allowDiscount`}
                    checked={formik.values.items[index]?.allowDiscount || false}
                    onChange={formik.handleChange}
                    title="Allow Discount"
                    description="Allow discount for this product"
                    icon="lucide:percent"
                  />
                </div>

                {Boolean(formik.values.items[index]?.allowDiscount) && (
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Discount From"
                        minDate={new Date()}
                        value={
                          formik.values.items[index]?.discountFrom
                            ? new Date(formik.values.items[index].discountFrom)
                            : null
                        }
                        onChange={(date) => {
                          const newValues = { ...formik.values };
                          newValues.items[index].discountFrom =
                            date?.toISOString() || "";
                          formik.setValues(newValues);
                        }}
                      />
                      <DateTimePicker
                        label="Discount To"
                        value={
                          formik.values.items[index]?.discountTo
                            ? new Date(formik.values.items[index].discountTo)
                            : null
                        }
                        minDate={
                          formik.values.items[index]?.discountFrom
                            ? new Date(formik.values.items[index].discountFrom)
                            : new Date()
                        }
                        onChange={(date) => {
                          const newValues = { ...formik.values };
                          newValues.items[index].discountTo =
                            date?.toISOString() || "";
                          formik.setValues(newValues);
                        }}
                      />
                      <InputField
                        type="number"
                        name={`items[${index}].scheduledDiscountedPrice`}
                        value={
                          formik.values.items[index]
                            ?.scheduledDiscountedPrice ?? ""
                        }
                        inputProps={{
                          endAdornment: (
                            <span className="text-gray-500">QAR</span>
                          ),
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Scheduled Discounted Price"
                        errorMessage={
                          formik.touched.items?.[index]
                            ?.scheduledDiscountedPrice &&
                          formik.errors.items?.[index] &&
                          typeof formik.errors.items[index] === "object" &&
                          !Array.isArray(formik.errors.items[index]) &&
                          "scheduledDiscountedPrice" in
                            (formik.errors.items[index] as object)
                            ? (formik.errors.items[index] as any)
                                .scheduledDiscountedPrice
                            : ""
                        }
                      />
                    </LocalizationProvider>
                  </div>
                )}

                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleSaveSection(index)}
                    color="primary"
                    disabled={isUpdating[index]}
                  >
                    {isUpdating[index] ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default PricingTab;
