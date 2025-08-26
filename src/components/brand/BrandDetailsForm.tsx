import { Brand } from "@app/lib/types/brands";
import { Button, Card, CardBody, SectionHeader } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { InputField } from "@app/ui/InputField";
import { useFormik } from "formik";
import * as yup from "yup";

export interface FormProps {
  onSubmit: (values: Brand) => void;
  data?: Brand;
  setOpen?: (value: boolean) => void;
  isLoading?: boolean;
}

const BrandDetailsForm = ({
  data,
  onSubmit,
  setOpen,
  isLoading,
}: FormProps) => {
  const schema = yup.object({
    nameEn: yup
      .string()
      .required("English name is required")
      .max(255, "Must be at most 255 characters"),
    nameAr: yup
      .string()
      .required("Arabic name is required")
      .max(255, "Must be at most 255 characters"),
    urlKey: yup
      .string()
      .required("Slug is required")
      .max(255, "Must be at most 255 characters")
      .matches(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"
      ),
    sortOrder: yup.number().required("Sort order is required"),
    // image upload is handled outside Formik
  });

  const formik = useFormik({
    initialValues: {
      id: data?.id || 0,
      nameEn: data?.nameEn || "",
      nameAr: data?.nameAr || "",
      urlKey: data?.urlKey || "",
      image: data?.image || "",
      sortOrder: data?.sortOrder ?? 0,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      // pass files and removedFiles to parent handler
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      onBlur={formik.handleBlur}
      className="space-y-6"
    >
      <Card className="bg-base-100">
        <CardBody>
          <SectionHeader
            title="Brand Details"
            description="Essential brand details and identifiers"
            icon="lucide:info"
            type="primary"
          />
          <div
            className={`grid  gap-6 ${
              data ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            <InputField
              id="nameEn"
              label="Name (English)"
              value={formik.values.nameEn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.nameEn ? formik.errors.nameEn : undefined
              }
            />
            <InputField
              id="nameAr"
              label="Name (Arabic)"
              value={formik.values.nameAr}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.nameAr ? formik.errors.nameAr : undefined
              }
            />

            <InputField
              id="urlKey"
              label="Url Key (Slug)"
              value={formik.values.urlKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.urlKey ? formik.errors.urlKey : undefined
              }
            />
            <InputField
              id="sortOrder"
              label="Sort Order"
              type="number"
              value={formik.values.sortOrder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.sortOrder ? formik.errors.sortOrder : undefined
              }
            />
          </div>
        </CardBody>
      </Card>
      <Card className="bg-base-100">
        <CardBody className="flex gap-2">
          <Button
            type="submit"
            color="primary"
            className="w-fit"
            loading={isLoading}
          >
            <Icon icon="lucide:save" />
            Save Changes
          </Button>
          {!data && setOpen && (
            <Button type="button" color="error" onClick={() => setOpen(false)}>
              <Icon icon="lucide:x" />
              Cancel
            </Button>
          )}
        </CardBody>
      </Card>
    </form>
  );
};

export default BrandDetailsForm;
