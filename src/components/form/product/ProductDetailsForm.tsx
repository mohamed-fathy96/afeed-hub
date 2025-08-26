import { Product, ProductTypeEnum } from "@app/lib/types/product";
import { BrandService } from "@app/services/actions";
import {
  Alert,
  Button,
  Card,
  CardBody,
  SectionHeader,
  Textarea,
} from "@app/ui";
import { InputField } from "@app/ui/InputField";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useFormik } from "formik";
import { Icon } from "@app/ui/Icon";
import * as yup from "yup";

export interface FormProps {
  onSubmit: (values: Product) => void;
  data?: Product;
  isLoading?: boolean;
  setOpen?: (open: boolean) => void;
}
const ProductDetailsForm = ({
  data,
  onSubmit,
  isLoading,
  setOpen,
}: FormProps) => {
  // Validation schema

  const baseSchema = yup.object({
    sku: yup.string().required("SKU is required"),

    urlKey: yup
      .string()
      .required("Slug or Url key is required")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "Slug must not contain spaces or special characters"
      ),
    title: yup
      .string()
      .required("Title is required")
      .max(255, "Title must be at most 255 characters"),
    titleAr: yup
      .string()
      .required("Arabic title is required")
      .max(255, "Arabic title must be at most 255 characters"),
  });
  const additionalSchema = yup.object({
    price: yup
      .number()
      .required("Price is required")
      .min(0.1, "Price must be greater than or equal to 0.1 QAR")
      .typeError("Price must be a valid number")
      .test(
        "is-greater",
        "Price must be greater than or equal to Cost",
        function (value) {
          const { cost } = this.parent;
          return value >= cost;
        }
      ),
    cost: yup
      .number()
      .required("Cost is required")
      .min(1, "Cost must be greater than or equal to 1 QAR")
      .typeError("Cost must be a valid number"),
  });

  // const seoSchema = yup.object({
  //   metaTitle: yup
  //     .string()
  //     .optional()
  //     .max(60, "Meta Title should not exceed 60 characters for better SEO"),
  //   metaKeywords: yup
  //     .string()
  //     .optional()
  //     .max(255, "Meta Keywords should not exceed 255 characters"),
  //   metaDescription: yup
  //     .string()
  //     .optional()
  //     .max(
  //       160,
  //       "Meta Description should not exceed 160 characters for better SEO"
  //     ),
  //   metaTitleAr: yup
  //     .string()
  //     .optional()
  //     .max(
  //       60,
  //       "Meta Title (Arabic) should not exceed 60 characters for better SEO"
  //     ),
  //   metaKeywordsAr: yup
  //     .string()
  //     .optional()
  //     .max(255, "Meta Keywords (Arabic) should not exceed 255 characters"),
  //   metaDescriptionAr: yup
  //     .string()
  //     .optional()
  //     .max(
  //       160,
  //       "Meta Description (Arabic) should not exceed 160 characters for better SEO"
  //     ),
  // });
  const { data: brands } = useQuery({
    queryKey: ["brandsList"],
    queryFn: async () => {
      const res = await BrandService.getBrandsList();
      return res?.data || [];
    },
    enabled: true,
  });

  const formik: any = useFormik({
    initialValues: {
      sku: data?.sku ?? "",
      urlKey: data?.urlKey ?? "",
      brandId: data?.brand?.id ?? "",
      title: data?.title ?? "",
      titleAr: data?.titleAr ?? "",
      description: data?.description ?? "",
      descriptionAr: data?.descriptionAr ?? "",
      price: data?.price ?? "",
      cost: data?.cost ?? "",
      trending: data?.trending ?? false,
      sort: data?.sort ?? 0,
      type: data?.productType ?? ProductTypeEnum.Normal,
      metaTitle: data?.metaTitle ?? "",
      metaKeywords: data?.metaKeywords ?? "",
      metaDescription: data?.metaDescription ?? "",
      metaTitleAr: data?.metaTitleAr ?? "",
      metaKeywordsAr: data?.metaKeywordsAr ?? "",
      metaDescriptionAr: data?.metaDescriptionAr ?? "",
    },
    validationSchema: data
      ? baseSchema
      : baseSchema.concat(additionalSchema),
    onSubmit: async (values: any) => {
      const payload = {
        ...values,
        price: parseFloat(values?.price),
        cost: parseFloat(values?.cost),
      };
      onSubmit && onSubmit(payload);
      setOpen && setOpen(false);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      onBlur={formik.handleBlur}
      className="space-y-6"
    >
      <Card className="bg-base-100 shadow-sm border border-base-300/50">
        <CardBody className="p-6">
          <SectionHeader
            type="primary"
            title="Basic Information"
            description="Essential product details and identifiers"
            icon="lucide:info"
          />

          <div
            className={`grid  gap-6 ${
              data ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            <InputField
              value={formik.values.sku}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.touched.sku && formik.errors.sku}
              id="sku"
              label="SKU"
            />
            <SingleSelectDropdown
              placeholder={"Select Brand"}
              options={brands ?? []}
              key={`categoryType-${formik.values.brandId}`}
              selectedValue={formik.values.brandId}
              handleChange={(_e: any, value) => {
                formik.setFieldValue("brandId", value?.id);
              }}
              optionName="nameEn"
              optionValue="id"
            />
            <InputField
              value={formik.values.urlKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.touched.urlKey && formik.errors.urlKey}
              id="urlKey"
              label="Url Key (Slug)"
            />

            <InputField
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.touched.title && formik.errors.title}
              id="title"
              label="Title"
            />
            <InputField
              value={formik.values.titleAr}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.touched.titleAr && formik.errors.titleAr}
              id="titleAr"
              label="Title (Arabic)"
            />
            <SingleSelectDropdown
              placeholder="Product Type"
              options={[
                { label: "Normal", value: ProductTypeEnum.Normal },
                { label: "E-Card", value: ProductTypeEnum.ECard },
              ]}
              optionValue="value"
              optionName={"label"}
              isDisabled={!!data}
              selectedValue={formik.values.type}
              handleChange={(_e: any, item: any) =>
                formik.setFieldValue("type", item?.value)
              }
            />
            {!data && (
              <>
                <InputField
                  value={formik.values.cost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.touched.cost && formik.errors.cost}
                  id="cost"
                  label="Cost"
                  inputProps={{
                    endAdornment: (
                      <span className="text-base-content font-bold text-md">
                        QAR
                      </span>
                    ),
                  }}
                />
                <InputField
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.touched.price && formik.errors.price}
                  id="price"
                  label="Price"
                  inputProps={{
                    endAdornment: (
                      <span className="text-base-content font-bold text-md">
                        QAR
                      </span>
                    ),
                  }}
                />
              </>
            )}

            <InputField
              value={formik.values.sort}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              inputProps={{ inputProps: { min: 0 } }}
              errorMessage={formik.touched.sort && formik.errors.sort}
              id="sort"
              label="Sort"
            />
          </div>
        </CardBody>
      </Card>
      {data && (
        <Card className="bg-base-100 shadow-sm border border-base-300/50">
          <CardBody className="p-6">
            <SectionHeader
              type="info"
              title="Product Description"
              description="Detailed information about your product"
              icon="lucide:info"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-sm font-medium text-base-content flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Description (English)
                </div>
                <div className="border border-base-300 rounded-lg overflow-hidden">
                  <MarkdownEditor
                    value={formik.values.description}
                    toolbars={[
                      "bold",
                      "italic",
                      "header",
                      "quote",
                      "link",
                      "ulist",
                      "underline",
                      "olist",
                      "redo",
                      "undo",
                    ]}
                    height="200px"
                    onChange={(value) =>
                      formik.setFieldValue("description", value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-base-content flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  Description (Arabic)
                </div>
                <div className="border border-base-300 rounded-lg overflow-hidden">
                  <MarkdownEditor
                    value={formik.values.descriptionAr}
                    toolbars={[
                      "bold",
                      "italic",
                      "header",
                      "quote",
                      "link",
                      "ulist",
                      "underline",
                      "olist",
                      "redo",
                      "undo",
                    ]}
                    height="200px"
                    onChange={(value) =>
                      formik.setFieldValue("descriptionAr", value)
                    }
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {data && (
        <>
          <Card className="bg-base-100 shadow-sm border border-base-300/50">
            <CardBody className="p-6">
              <SectionHeader
                type="success"
                title="SEO"
                description="SEO settings for your product"
                icon="lucide:search-check"
              />

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <InputField
                  value={formik.values.metaTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.metaTitle && formik.errors.metaTitle
                  }
                  id="metaTitle"
                  label="Meta Title"
                />
                <InputField
                  value={formik.values.metaTitleAr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.metaTitleAr && formik.errors.metaTitleAr
                  }
                  id="metaTitleAr"
                  label="Meta Title (Arabic)"
                />
                <InputField
                  value={formik.values.metaKeywords}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.metaKeywords && formik.errors.metaKeywords
                  }
                  id="metaKeywords"
                  label="Meta Keywords"
                />
                <InputField
                  value={formik.values.metaKeywordsAr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.metaKeywordsAr &&
                    formik.errors.metaKeywordsAr
                  }
                  id="metaKeywordsAr"
                  label="Meta Keywords (Arabic)"
                />
                <div>
                  <Textarea
                    className="w-full"
                    placeholder="Meta Description"
                    name="metaDescription"
                    onChange={formik.handleChange}
                    value={formik.values.metaDescription}
                  />
                  <p className="text-error text-sm">
                    {formik.touched.metaDescription &&
                      formik.errors.metaDescription}
                  </p>
                </div>
                <div>
                  <Textarea
                    className="w-full"
                    placeholder="Meta Description (Arabic)"
                    name="metaDescriptionAr"
                    onChange={formik.handleChange}
                    value={formik.values.metaDescriptionAr}
                  />
                  <p className="text-error text-sm">
                    {formik.touched.metaDescriptionAr &&
                      formik.errors.metaDescriptionAr}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
      <Card className="bg-base-100 shadow-sm border border-base-300/50">
        <CardBody className="p-6 flex justify-end">
          <Button
            type="submit"
            color="primary"
            className="px-8 shadow-sm w-fit"
            loading={isLoading}
          >
            {data ? (
              <>
                <Icon icon="lucide:save" className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Icon icon="lucide:plus" className="w-4 h-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        </CardBody>
      </Card>
    </form>
  );
};
export default ProductDetailsForm;
