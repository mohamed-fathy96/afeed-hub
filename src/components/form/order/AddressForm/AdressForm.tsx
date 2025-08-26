import { useEffect, useState } from "react";
import { Button, ModalBody, ModalHeader, Textarea } from "@app/ui";
import { InputField } from "@app/ui/InputField";
import Modal from "@app/ui/Modal/Modal";
import { useFormik } from "formik";
import { GoogleMap } from "@app/components/GoogleMap";
import { Icon } from "@app/ui/Icon";

// Define regex constants
const streetNumberRegex = /^[0-9]{1,5}$/;
const buildingNumberRegex = /^[0-9A-Za-z\-]{1,10}$/;
const zoneRegex = /^[0-9]{1,5}$/;
const phoneRegex = /^[0-9+\s()-]{8}$/;

export interface Payload {
  name: string;
  address: string;
  streetName: string;
  buildingName: string;
  zone: string;
  location: { latitude: number; longitude: number };
  additionalInstructions: string;
  contactPhoneNumber: string;
}

interface AddressFormProps {
  onSubmit: (payload: {
    name: string;
    address: string;
    location: { latitude: number; longitude: number };
    additionalInstructions: string;
    streetName: string;
    buildingName: string;
    zone: string;
    contactPhoneNumber: string;
    storeId: number;
  }) => void;
  storeId: number;
  initialState?: Payload;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  storeId,
  initialState,
  open,
  setOpen,
}) => {
  const [addressInfo, setAddressInfo] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [step, setStep] = useState(1);

  const formik = useFormik({
    initialValues: {
      name: initialState?.name || "",
      address: initialState?.address || "",
      streetNumber: initialState?.streetName || "",
      buildingNumber: initialState?.buildingName || "",
      zone: initialState?.zone || "",
      location: initialState?.location || { latitude: 0, longitude: 0 },
      additionalInstructions: initialState?.additionalInstructions || "",
      contactPhoneNumber:
        initialState?.contactPhoneNumber?.replace(/^\+974/, "") || "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      if (!values.name) errors.name = "Field is required";
      if (!values.address) errors.address = "Field is required";
      if (!values.streetNumber) errors.streetNumber = "Field is required";
      else if (!streetNumberRegex.test(values.streetNumber))
        errors.streetNumber = "Invalid street number";
      if (!values.buildingNumber) errors.buildingNumber = "Field is required";
      else if (!buildingNumberRegex.test(values.buildingNumber))
        errors.buildingNumber = "Invalid building number";
      if (!values.zone) errors.zone = "Field is required";
      else if (!zoneRegex.test(values.zone))
        errors.zone = "Invalid zone number";
      if (!values.contactPhoneNumber)
        errors.contactPhoneNumber = "Field is required";
      else if (!phoneRegex.test(values.contactPhoneNumber))
        errors.contactPhoneNumber = "Invalid phone number";
      return errors;
    },
    onSubmit: (data) => {
      if (addressInfo) {
        onSubmit({
          ...data,
          contactPhoneNumber: data.contactPhoneNumber,
          address: addressInfo.address,
          streetName: data.streetNumber,
          buildingName: data.buildingNumber,
          zone: data.zone,
          location: {
            latitude: addressInfo.lat,
            longitude: addressInfo.lng,
          },
          storeId,
        });
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    if (initialState) {
      formik.resetForm({
        values: {
          name: initialState.name || "",
          address: initialState.address || "",
          streetNumber: initialState.streetName || "",
          buildingNumber: initialState.buildingName || "",
          zone: initialState.zone || "",
          location: initialState.location || { latitude: 0, longitude: 0 },
          additionalInstructions: initialState.additionalInstructions || "",
          contactPhoneNumber: initialState.contactPhoneNumber || "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState]);

  return (
    <Modal
      open={open}
      backdrop={!open}
      onClose={() => {
        formik.resetForm();
        setStep(1);
      }}
    >
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-medium text-gray-700 mb-1">
            <button
              type="button"
              onClick={() => {
                setStep(1);
              }}
              className="flex items-center gap-2"
            >
              {step === 2 && <Icon icon="lucide:chevron-left" />}
              {step === 1
                ? "Select the location on the map"
                : "Address Details"}
            </button>
          </h2>
          <button
            type="button"
            className="text-lg font-medium text-gray-700 mb-1 flex items-center gap-2"
            onClick={() => {
              setStep(1);
              setOpen(false);
            }}
          >
            <Icon icon="lucide:x" />
          </button>
        </div>
      </ModalHeader>
      <ModalBody>
        {step === 1 && (
          <div className="w-full h-full space-y-4">
            <GoogleMap
              center={{
                lat: 25.286106,
                lng: 51.534817,
              }}
              initialAddress={initialState?.address}
              setAddressInfo={(info: any) => {
                setAddressInfo(info);
                if (info) {
                  formik.setFieldValue("address", info?.address);
                }
              }}
              onConfirm={() => {
                setStep(2);
              }}
            />
          </div>
        )}
        {step === 2 && addressInfo && (
          <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
            <InputField
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Name"
              required
              errorMessage={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ""
              }
            />
            <InputField
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Address Line 1"
              readOnly={!!addressInfo}
              errorMessage={
                formik.touched.address && formik.errors.address
                  ? formik.errors.address
                  : ""
              }
            />
            <InputField
              label="Street Number"
              name="streetNumber"
              value={formik.values.streetNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.streetNumber && formik.errors.streetNumber
                  ? formik.errors.streetNumber
                  : ""
              }
            />
            <InputField
              label="Building Number"
              name="buildingNumber"
              value={formik.values.buildingNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.buildingNumber && formik.errors.buildingNumber
                  ? formik.errors.buildingNumber
                  : ""
              }
            />
            <InputField
              label="Zone"
              name="zone"
              value={formik.values.zone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.zone && formik.errors.zone
                  ? formik.errors.zone
                  : ""
              }
            />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Additional Instructions (Optional)
            </p>
            <Textarea
              name="additionalInstructions"
              value={formik.values.additionalInstructions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
              placeholder="Note any additional instructions"
            />
            <div className="flex items-center">
              <InputField
                label="Phone Number"
                type="tel"
                id="phone"
                name="contactPhoneNumber"
                value={formik.values.contactPhoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Mobile Number"
                required
                inputProps={{
                  startAdornment: <span className="text-base me-2">+974</span>,
                }}
                className="rtl!pr-12 ltr:!pl-12 rtl:placeholder:!pl-12 ltr:placeholder:!pr-12 placeholder:text-sm"
                errorMessage={
                  formik.touched.contactPhoneNumber &&
                  formik.errors.contactPhoneNumber
                    ? formik.errors.contactPhoneNumber
                    : ""
                }
              />
            </div>
            <Button
              disabled={!formik.dirty || !formik.isValid}
              type="submit"
              color="primary"
              className="w-full mt-4"
            >
              Save Address
            </Button>
          </form>
        )}
      </ModalBody>
    </Modal>
  );
};
