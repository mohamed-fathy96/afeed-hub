import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button,
  Card,
  CardBody,
  Badge,
  SectionHeader,
  CheckboxCard,
} from "@app/ui";
import { InputField } from "@app/ui/InputField";
import { Icon } from "@app/ui/Icon";
import arrowUpFromLineIcon from "@iconify/icons-lucide/arrow-up-from-line";
import xIcon from "@iconify/icons-lucide/x";
import { useToast } from "@app/helpers/hooks/use-toast";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import {
  CategoryService,
  CouponService,
  GlobalService,
} from "@app/services/actions";
import { routes } from "@app/lib/routes";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Coupon,
  CouponCategoryType,
  DeliveryDateType,
} from "@app/lib/types/coupons";

interface CouponFormProps {
  data?: Partial<Coupon> & { discount?: number };
  fetchData?: () => void;
  id?: number;
}

const couponTypeOptions = [
  { id: 0, label: "Percentage" },
  { id: 1, label: "Free Delivery" },
  { id: 4, label: "Percentage with Free Delivery" },
  { id: 5, label: "Percentage Including Delivery" },
  { id: 6, label: "Fixed Amount" },
  { id: 7, label: "Fixed Amount with Free Delivery" },
];

const categoryModeOptions = [
  { id: CouponCategoryType.None, label: "All Products (No restrictions)" },
  { id: CouponCategoryType.Include, label: "Include Specific Categories" },
  { id: CouponCategoryType.Exclude, label: "Exclude Specific Categories" },
];

const deliveryTypeOptions = [
  { id: DeliveryDateType.Now, label: "Now" },
  { id: DeliveryDateType.Later, label: "Later" },
];

const CouponForm: React.FC<CouponFormProps> = ({ data, id }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Helper function to check if coupon type supports delivery charges
  const isDeliveryTypeSupported = (couponType: number) => {
    return [1, 4, 5, 7].includes(couponType);
  };

  // React Query for fetching all categories (for initial load when editing)
  const { data: allCategories } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const res = await CategoryService.getLightList();
      return res?.data || [];
    },
    enabled: !!data, // Enable when editing a coupon (data exists)
  });

  // React Query for searching categories
  const { data: filteredCategories, isLoading: isSearching } = useQuery({
    queryKey: ["searchCategories", searchKeyword],
    queryFn: async () => {
      if (!searchKeyword || searchKeyword.length < 2) return [];
      const res = await GlobalService.getAllCategories({
        keyword: searchKeyword,
      });
      return res?.data || [];
    },
    enabled: searchKeyword.length >= 2,
  });
  const formik = useFormik<Partial<Coupon>>({
    initialValues: {
      name: data?.name || "",
      code: data?.code || "",
      discountAmount: data?.discountAmount || data?.discount || 0,
      startDate: data?.startDate ? data.startDate.substring(0, 10) : "",
      endDate: data?.endDate ? data.endDate.substring(0, 10) : "",
      maxUsePerUser: data?.maxUsePerUser || 0,
      totalUsePerCoupon: data?.totalUsePerCoupon || 0,
      couponType: data?.couponType || 0,
      minimumOrderPrice: data?.minimumOrderPrice || 0,
      couponCategoryType: data?.couponCategoryType || CouponCategoryType.None,
      categories: data?.categories || [],
      couponDeliveryType: data?.couponDeliveryType || DeliveryDateType.Now,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Coupon name is required"),
      code: yup
        .string()
        .required("Coupon code is required")
        .matches(/^\S*$/, "Coupon code cannot contain spaces"),
      discountAmount: yup.number().when("couponType", {
        is: (type: number) => [0, 4, 5].includes(type), // Percentage-based types
        then: (schema) =>
          schema
            .min(0, "Discount amount must be at least 0")
            .max(100, "Discount amount cannot exceed 100%"),
        otherwise: (schema) => schema.min(0, "Amount must be at least 0"),
      }),
      startDate: yup.date().required("Start date is required"),
      endDate: yup
        .date()
        .required("End date is required")
        .min(yup.ref("startDate"), "End date cannot be before the start date"),
      maxUsePerUser: yup
        .number()
        .min(0, "Value cannot be negative")
        .required("Max use per user is required"),
      totalUsePerCoupon: yup
        .number()
        .min(0, "Value cannot be negative")
        .required("Total use per coupon is required"),
      minimumOrderPrice: yup
        .number()
        .min(0, "Value cannot be negative")
        .required("Minimum order price is required"),
    }),
    onSubmit: (values) => {
      couponMutation.mutate(values);
    },
  });
  // React Query for getting all available categories for selection
  const { data: availableCategories } = useQuery({
    queryKey: ["availableCategories"],
    queryFn: async () => {
      const res = await CategoryService.getLightList();
      return res?.data || [];
    },
    enabled: formik.values.couponCategoryType !== CouponCategoryType.None,
  });
  // Mutation for creating/updating coupon
  const couponMutation = useMutation({
    mutationFn: async (values: Partial<Coupon>) => {
      const couponData: any = {
        ...values,
        categories: selectedCategories.map((cat) => cat.id), // Send only category IDs
      };

      // Map discountAmount to discount for API compatibility
      if (couponData.discountAmount !== undefined) {
        couponData.discountAmount = couponData.discountAmount;
        delete couponData.discountAmount;
      }

      if (values?.couponCategoryType === CouponCategoryType.None) {
        delete couponData.categories;
        delete couponData.couponCategoryType;
      }

      // Only include delivery type if the coupon type supports it
      if (!isDeliveryTypeSupported(values?.couponType || 0)) {
        delete couponData.couponDeliveryType;
      }

      if (id) {
        return await CouponService.updateCoupon(couponData, id);
      } else {
        return await CouponService.createCoupon(couponData);
      }
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message ?? "Coupon updated successfully");
      navigate(routes.dashboard.coupons.index);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update coupon");
    },
  });

  // Load initial categories if editing
  useEffect(() => {
    if (data?.categories && data.categories.length > 0 && allCategories) {
      // Handle both cases: when API returns category IDs or full category objects
      const categoryIds = data.categories.map((cat: any) =>
        typeof cat === "number" ? cat : cat.id
      );

      const initialCategories = categoryIds
        .map((id) => allCategories.find((cat: any) => cat.id === id))
        .filter((cat: any) => cat); // Remove undefined entries

      setSelectedCategories(initialCategories);

      // Also update formik values to ensure consistency
      formik.setFieldValue("categories", categoryIds);
    }
  }, [data, allCategories]);

  const handleRemoveCat = (id: number) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
    // Also update formik values
    formik.setFieldValue(
      "categories",
      formik.values.categories?.filter((catId: number) => catId !== id) || []
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="">
        <Card>
          <CardBody className="bg-base-100  grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionHeader
              title="Coupon Details"
              className="col-span-2"
              description="Enter the details of the coupon"
              icon="lucide:info"
              type="primary"
            />
            <InputField
              id="name"
              label="Coupon Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.name ? formik.errors.name : undefined
              }
            />
            <InputField
              id="code"
              label="Coupon Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.code ? formik.errors.code : undefined
              }
            />

            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.startDate ? formik.errors.startDate : undefined
              }
            />
            <InputField
              id="endDate"
              label="End Date"
              type="date"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.endDate ? formik.errors.endDate : undefined
              }
            />
            <InputField
              id="minimumOrderPrice"
              label="Minimum Order Price"
              type="number"
              value={formik.values.minimumOrderPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.minimumOrderPrice
                  ? formik.errors.minimumOrderPrice
                  : undefined
              }
            />

            <SingleSelectDropdown
              options={couponTypeOptions}
              optionValue="id"
              optionName="label"
              placeholder="Coupon Type"
              selectedValue={formik.values.couponType}
              handleChange={(_e, value) => {
                formik.setFieldValue("couponType", value?.id);
                // Clear discount amount for free delivery types
                if (value?.id === 1 || value?.id === 7) {
                  formik.setFieldValue("discountAmount", "");
                }
                // Reset delivery type if switching to non-delivery coupon type
                if (!isDeliveryTypeSupported(value?.id || 0)) {
                  formik.setFieldValue(
                    "couponDeliveryType",
                    DeliveryDateType.Now
                  );
                }
              }}
            />
            <InputField
              id="discountAmount"
              label={
                [0, 4, 5].includes(formik.values.couponType || 0)
                  ? "Discount Percentage"
                  : "Discount Amount"
              }
              type="number"
              value={formik.values.discountAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.discountAmount
                  ? formik.errors.discountAmount
                  : undefined
              }
              inputProps={{
                endAdornment: (
                  <>
                    {[0, 4, 5].includes(formik.values.couponType || 0)
                      ? "%"
                      : "QAR"}
                  </>
                ),
              }}
              disabled={
                formik.values.couponType === 1 || formik.values.couponType === 7
              }
            />
            {isDeliveryTypeSupported(formik.values.couponType || 0) && (
              <SingleSelectDropdown
                options={deliveryTypeOptions}
                optionValue="id"
                optionName="label"
                placeholder="Delivery Type"
                selectedValue={formik.values.couponDeliveryType}
                handleChange={(_e, value) => {
                  formik.setFieldValue("couponDeliveryType", value?.id);
                }}
              />
            )}
            <InputField
              id="maxUsePerUser"
              label="Max Use Per User"
              type="number"
              value={formik.values.maxUsePerUser}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.maxUsePerUser
                  ? formik.errors.maxUsePerUser
                  : undefined
              }
            />

            <InputField
              id="totalUsePerCoupon"
              label="Total Use Per Coupon"
              type="number"
              value={formik.values.totalUsePerCoupon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.totalUsePerCoupon
                  ? formik.errors.totalUsePerCoupon
                  : undefined
              }
            />
          </CardBody>
        </Card>
      </div>

      {/* Category Selection Section */}
      <Card className="bg-base-100">
        <CardBody>
          <SectionHeader
            title="Category Restrictions"
            description="Select the categories to apply the coupon to"
            icon="lucide:package"
            type="primary"
          />

          <div className="space-y-6">
            {/* Category Mode Selection as CheckboxCard group */}
            <div className="flex flex-col md:flex-row gap-4">
              {categoryModeOptions.map((option) => (
                <CheckboxCard
                  key={option.id}
                  type={
                    option.id === CouponCategoryType.Include
                      ? "success"
                      : option.id === CouponCategoryType.Exclude
                      ? "error"
                      : "primary"
                  }
                  name="couponCategoryType"
                  checked={formik.values.couponCategoryType === option.id}
                  onChange={() => {
                    formik.setFieldValue("couponCategoryType", option.id);
                    if (option.id === CouponCategoryType.None) {
                      setSelectedCategories([]);
                    }
                  }}
                  title={option.label}
                  description={
                    option.id === CouponCategoryType.None
                      ? "Coupon applies to all products."
                      : option.id === CouponCategoryType.Include
                      ? "Coupon applies only to selected categories."
                      : "Coupon applies to all except selected categories."
                  }
                  icon={
                    option.id === CouponCategoryType.Include
                      ? "lucide:plus-circle"
                      : option.id === CouponCategoryType.Exclude
                      ? "lucide:minus-circle"
                      : "lucide:package"
                  }
                  className="flex-1 min-w-[220px]"
                />
              ))}
            </div>

            {formik.values.couponCategoryType !== CouponCategoryType.None && (
              <div className="space-y-4">
                {/* Search and Select Categories */}
                <SingleSelectDropdown
                  optionName="name"
                  selectedValue={""}
                  handleChange={(_, value) => {
                    if (value) {
                      setSelectedCategories((prev) => [...prev, value]);
                      formik.setFieldValue("categories", [
                        ...(formik.values.categories || []),
                        value.id,
                      ]);
                    }
                  }}
                  options={availableCategories || []}
                  optionValue="id"
                  placeholder="Search for categories to select"
                />

                {/* Selected Categories Display */}
                {selectedCategories && selectedCategories.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {selectedCategories.map((cat: any) => (
                      <Badge key={cat.id} color="primary" className="h-9">
                        {cat.name}{" "}
                        <Icon
                          icon={xIcon}
                          onClick={() => handleRemoveCat(cat.id)}
                          className="cursor-pointer"
                        />
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No categories selected.{" "}
                    {formik.values.couponCategoryType ===
                    CouponCategoryType.Include
                      ? "This coupon will not be available for any products."
                      : "This coupon will be available for all products."}
                  </p>
                )}
              </div>
            )}

            {formik.values.couponCategoryType === CouponCategoryType.None && (
              <p className="text-gray-500 text-sm">
                This coupon will be available for all products without category
                restrictions.
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      <Card className="bg-base-100">
        <CardBody>
          <Button
            type="submit"
            className="w-fit"
            disabled={couponMutation.isPending || !formik.isValid}
            loading={couponMutation.isPending}
            color="primary"
            startIcon={<Icon icon={arrowUpFromLineIcon} fontSize={18} />}
          >
            Save
          </Button>
        </CardBody>
      </Card>
    </form>
  );
};

export default CouponForm;
