import { Card, CardBody, SectionHeader, Textarea } from "@app/ui";
import { PageTitle } from "@app/ui/PageTitle";
import { InputField } from "@app/ui/InputField";
import { useFormik } from "formik";
import * as yup from "yup";
import { DeliveryDate } from "../components/DeliveryDate/DeliveryDate";
import { OrderService } from "@app/services/actions/OrderService";
import { Icon } from "@app/ui/Icon";
import { useToast } from "@app/helpers/hooks/use-toast";
import { routes } from "@app/lib/routes";
import { useNavigate } from "react-router-dom";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@app/services/actions/UserService";
import { DeliveryDateType } from "@app/lib/types/orders";

export const phoneRegex = /^[0-9+\s()-]{8}$/;

const deliveryDateTypes = [
  { id: DeliveryDateType.Now, label: "Now" },
  { id: DeliveryDateType.Later, label: "Later" },
];

export const CreateOrderPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [optionName, setOptionName] = useState("label");
  const [searchQuery, setSearchQuery] = useState("");

  // React Query to fetch users
  const { data: customersList = [], isLoading: isCustomersLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      const params = searchQuery ? { searchKey: searchQuery } : {};
      const res = await UserService.getAllUsersForDropdown(params);
      return (
        res?.data?.map((user: any) => ({
          id: user.id,
          label: user.name,
          phone: user.phoneNumber,
          countryCode: user.countryCode || "+974",
          email: user.email,
        })) || []
      );
    },
    enabled: searchQuery.length >= 2 || searchQuery.length === 0,
  });

  // Helper to safely get error message
  const getErrorMessage = (touched: any, error: any) => {
    return typeof touched === "boolean" && touched && typeof error === "string"
      ? error
      : undefined;
  };

  const handleCreateOrder = async (payload: any) => {
    try {
      const res = await OrderService.createOrder(payload);
      if (res?.data) {
        toast.success("Order created successfully");
        navigate(routes.dashboard.orders.edit(res?.data?.id));
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create order");
    }
  };

  const formik = useFormik({
    initialValues: {
      userId: "", // Optional
      name: "",
      phoneNumber: "",
      email: "",
      deliverDateType: 0, // Default to Now
      deliverDateAt: "",
      timeSlotId: "",
      notes: "",
      countryCode: "+974",
      deliveryCharge: 0.0,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      phoneNumber: yup
        .string()
        .required("Phone number is required")
        .matches(phoneRegex, "Invalid phone number"),
      email: yup.string().email("Invalid email"),
      deliverDateType: yup
        .number()
        .oneOf([0, 1])
        .required("Delivery type is required"),
      deliverDateAt: yup.string().when("deliverDateType", {
        is: (val: number) => val === 1,
        then: (schema) => schema.required("Delivery date is required"),
        otherwise: (schema) => schema,
      }),
      timeSlotId: yup.string().when("deliverDateType", {
        is: (val: number) => val === 1,
        then: (schema) => schema.required("Time slot is required"),
        otherwise: (schema) => schema,
      }),
      notes: yup.string(),
      countryCode: yup.string().required("Country code is required"),
      deliveryCharge: yup.number().required("Delivery charge is required"),
    }),
    onSubmit: async (values) => {
      // Map form values to API payload
      const payload = {
        userId: values.userId ? Number(values.userId) : undefined,
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        deliverDateType:
          deliveryDateTypes.find((d) => d.id === values.deliverDateType)?.id ||
          0,
        deliverDateAt: values.deliverDateAt || null,
        timeSlotId: values.timeSlotId ? Number(values.timeSlotId) : undefined,
        notes: values.notes,
        countryCode: values.countryCode,
        deliveryCharge: Number(values.deliveryCharge),
      };
      handleCreateOrder(payload);
    },
  });

  // Handler for DeliveryDate component
  const handleDeliveryDateChange = (slotObj: any) => {
    if (slotObj) {
      formik.setFieldValue(
        "deliverDateType",
        slotObj.deliveryDateType === undefined ? 1 : slotObj.deliveryDateType
      );
      formik.setFieldValue("deliverDateAt", slotObj.date ? slotObj.date : "");
      formik.setFieldValue("timeSlotId", slotObj.id ? slotObj.id : "");
    }
  };

  // Handle customer search
  const handleSearchOnCustomers = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="container mx-auto px-4 space-y-4">
      <PageTitle
        title={"Create New Order"}
        breadCrumbItems={[
          { label: "Orders", path: routes.dashboard.orders.index },
          { label: `Create Order`, active: true },
        ]}
      />
      <Card className="bg-base-100 backdrop-blur-sm border-0 shadow-xl">
        <CardBody className="p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Customer Information Section */}
            <div className="rounded-xl p-6 border border-blue-100">
              <SectionHeader
                title="Customer Information"
                description="Enter customer information"
                icon="lucide:info"
                type="primary"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <SingleSelectDropdown
                    optionName={optionName}
                    selectedValue={formik?.values.userId}
                    handleChange={(_, value) => {
                      if (value?.id) {
                        formik.setFieldValue("userId", value?.id);
                        formik.setFieldValue("name", value?.label);
                        formik.setFieldValue("countryCode", value?.countryCode);
                        formik.setFieldValue(
                          "phoneNumber",
                          value?.phone?.replace("+974", "")
                        );
                        formik.setFieldValue("email", value?.email);
                      } else {
                        formik.setFieldValue("userId", "");
                        formik.setFieldValue("name", "");
                        formik.setFieldValue("countryCode", "+974");
                        formik.setFieldValue("phoneNumber", "");
                        formik.setFieldValue("email", "");
                      }
                    }}
                    options={customersList}
                    optionValue="id"
                    placeholder={"Customer List"}
                    errorMsg={getErrorMessage(
                      formik.touched.userId,
                      formik.errors.userId
                    )}
                    onInputChange={(e) => {
                      const value = e?.target?.value || "";
                      if (/^\d+$/.test(value)) {
                        setOptionName("phone");
                      } else {
                        setOptionName("label");
                      }
                      handleSearchOnCustomers(value);
                    }}
                  />
                </div>
                <div className="md:col-span-1">
                  <InputField
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={getErrorMessage(
                      formik.touched.name,
                      formik.errors.name
                    )}
                    id="name"
                    label="Full Name"
                    name="name"
                    disabled={!!formik.values.userId}
                    placeholder="Enter customer full name"
                  />
                </div>
                <div className="md:col-span-1 flex gap-2">
                  <InputField
                    value={"+974"}
                    inputFieldClass="max-w-20 !bg-transparent"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    id="countryCode"
                    label="Country Code"
                    name="countryCode"
                    placeholder="+974"
                  />
                  <InputField
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={getErrorMessage(
                      formik.touched.phoneNumber,
                      formik.errors.phoneNumber
                    )}
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    disabled={!!formik.values.userId}
                  />
                </div>
                <div className="md:col-span-1">
                  <InputField
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={getErrorMessage(
                      formik.touched.email,
                      formik.errors.email
                    )}
                    id="email"
                    label="Email Address"
                    name="email"
                    placeholder="customer@example.com"
                    disabled={!!formik.values.userId}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Information Section */}
            <div className="rounded-xl p-6 border bg-green-50 border-green-100">
              <SectionHeader
                title="Delivery Information"
                description="Enter delivery information"
                icon="lucide:calendar"
                type="success"
              />
              <DeliveryDate
                setTimeslot={handleDeliveryDateChange}
                __T={(s) => s}
              />
            </div>

            {/* Payment Information Section */}
            <div className="rounded-xl p-6 border bg-purple-50 border-purple-100">
              <SectionHeader
                title="Payment Information"
                description="Enter payment information"
                icon="lucide:credit-card"
                type="primary"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <InputField
                    value={formik.values.deliveryCharge}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={getErrorMessage(
                      formik.touched.deliveryCharge,
                      formik.errors.deliveryCharge
                    )}
                    id="deliveryCharge"
                    label="Delivery Charge"
                    name="deliveryCharge"
                    type="number"
                    placeholder="0.00"
                    inputProps={{
                      endAdornment: (
                        <span className="text-gray-500 font-medium">QAR</span>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="rounded-xl p-6 border bg-orange-50 border-orange-100">
              <SectionHeader
                title="Additional Information"
                description="Enter additional information"
                icon="lucide:info"
                type="warning"
              />
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Textarea
                    className="w-full focus:ring-0"
                    placeholder="Any special instructions or notes..."
                    name="notes"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.notes}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Order...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:plus" className="w-5 h-5" />
                    <span>Create Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
