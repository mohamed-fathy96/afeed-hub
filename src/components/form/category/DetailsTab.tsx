import { useToast } from "@app/helpers/hooks/use-toast";
import { Category } from "@app/lib/types/category";
import { Store } from "@app/lib/types/orders";
import { CategoryService, GlobalService } from "@app/services/actions";
import { Button, Textarea, CheckboxCard, SectionHeader } from "@app/ui";
import { Card, CardBody } from "@app/ui/Card";
import { Icon } from "@app/ui/Icon";
import { InputField } from "@app/ui/InputField";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { routes } from "@app/lib/routes";

interface Props {
  data?: Category;
  id?: number | null;
  fetchData?: (params: any) => void;
}
export const DetailsTab = ({ data, id }: Props) => {
  const navigate = useNavigate();
  const [storesList, setStoresList] = useState<any[]>([]);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const seoSchema = yup.object({
    metaTitle: yup
      .string()
      .optional()
      .max(100, "Meta Title should not exceed 100 characters for better SEO"),
    metaKeywords: yup
      .string()
      .optional()
      .max(255, "Meta Keywords should not exceed 255 characters"),
    metaDescription: yup
      .string()
      .optional()
      .max(
        160,
        "Meta Description should not exceed 160 characters for better SEO"
      ),
    metaTitleAr: yup
      .string()
      .optional()
      .max(
        100,
        "Meta Title (Arabic) should not exceed 100 characters for better SEO"
      ),
    metaKeywordsAr: yup
      .string()
      .optional()
      .max(255, "Meta Keywords (Arabic) should not exceed 255 characters"),
    metaDescriptionAr: yup
      .string()
      .optional()
      .max(
        160,
        "Meta Description (Arabic) should not exceed 160 characters for better SEO"
      ),
  });
  const formik: any = useFormik({
    initialValues: {
      title: data?.title || "",
      urlKey: data?.urlKey || "",
      titleAr: data?.titleAr || "",
      description: data?.description || "",
      descriptionAr: data?.descriptionAr || "",
      images: data?.images || [],
      parentCategoryId: data?.parentCategoryId || null,
      categoryType: data?.categoryType || 0,
      categoryStores: data?.categoryStores || [],
      sort: data?.sort || 0,
      offersPageSortOrder: data?.offersPageSortOrder || 0,
      isActive: data?.isActive || false,
      isBestSellerCategory: data?.isBestSellerCategory || false,
      isFeaturedCategory: data?.isFeaturedCategory || false,

      // metaTitle: data?.metaTitle || "",
      // metaKeywords: data?.metaKeywords || "",
      // metaDescription: data?.metaDescription || "",
      // metaTitleAr: data?.metaTitleAr || "",
      // metaKeywordsAr: data?.metaKeywordsAr || "",
      // metaDescriptionAr: data?.metaDescriptionAr || "",
    },
    validationSchema: yup.object().shape({
      urlKey: yup
        .string()
        .required("Slug or Url key is required")
        .matches(
          /^[a-zA-Z0-9_-]+$/,
          "Slug must not contain spaces or special characters"
        ),
      title: yup.string().required("Title is required"),
      titleAr: yup.string().required("Arabic Title is required"),
      description: yup.string().optional(),
      descriptionAr: yup.string().optional(),
      sort: yup.number().required("Sort is required"),
      offersPageSortOrder: yup
        .number()
        .required("Offers Page Sort Order is required"),
      ...seoSchema.fields,
    }),
    onSubmit: async (values: any) => {
      handleUpdateCategory(values);
    },
  });
  const fetchCategoryList = async () => {
    try {
      const res = await CategoryService.getLightList();
      setCategoryList(res?.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get category list"
      );
    }
  };
  useEffect(() => {
    fetchCategoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik?.values?.categoryType]);

  const toggleStoreSelection = (store: Store) => {
    setSelectedStores((prev) => {
      const isAlreadySelected = prev.some(
        (selected) => selected.id === store.id
      );
      if (isAlreadySelected) {
        return prev.filter((selected) => selected.id !== store.id);
      }
      return [...prev, store];
    });
  };
  const handleUpdateCategory = async (values: Category) => {
    setIsLoading(true);
    //exclude images from payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, ...payload } = values;
    const data = {
      ...payload,
      urlKeyAr: values?.urlKey,
      categoryStores: selectedStores?.map((store) => store.id),
      parentCategoryId:
        values.parentCategoryId === -1 ? null : values?.parentCategoryId,
    };

    try {
      let res;
      if (id) {
        res = await CategoryService.updateCategory(data, id);
      } else {
        res = await CategoryService.createCategory(data);
        if (res?.data) {
          navigate(routes.dashboard.categories.show(res?.data?.id));
        }
      }

      if (res) {
        toast.success(res?.data?.message ?? "Category updated successfully ");
        setIsLoading(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update Category");
      setIsLoading(false);
    }
  };
  const fetchSliderStores = async () => {
    try {
      const res = await GlobalService.getAllStores();
      setStoresList(res?.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get Slider stores"
      );
    }
  };
  useEffect(() => {
    fetchSliderStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (storesList?.length) {
      // Filter storesList to find matching store IDs in data.sliderStores
      const matchingStores = storesList.filter((store: Store) =>
        data?.categoryStores.some(
          (categoryStore: number) => categoryStore === store.id
        )
      );

      setSelectedStores((prev) => {
        const newStores = matchingStores.filter(
          (store) => !prev.some((selected) => selected.id === store.id)
        );

        return [...prev, ...newStores];
      });
    }
  }, [storesList, data?.categoryStores]);
  return (
    <form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur}>
      <div className="space-y-6">
        {/* Input Fields */}
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
                data ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2"
              }`}
            >
              <InputField
                value={formik.values.urlKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.urlKey && formik.errors.urlKey}
                id="urlKey"
                label="Url Key (Slug)"
              />
              <div className="flex flex-wrap gap-2">
                {storesList.map((store) => (
                  <Button
                    type="button"
                    key={store.id}
                    color={
                      selectedStores.some((s) => s.id === store.id)
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => toggleStoreSelection(store)}
                  >
                    {selectedStores.some((s) => s.id === store.id) ? "✅" : ""}{" "}
                    {store.title}
                  </Button>
                ))}
              </div>
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
              <InputField
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={
                  formik.touched.description && formik.errors.description
                }
                id="description"
                label="Description"
              />
              <InputField
                value={formik.values.descriptionAr}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={
                  formik.touched.descriptionAr && formik.errors.descriptionAr
                }
                id="descriptionAr"
                label="Description (Arabic)"
              />

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
              <InputField
                value={formik.values.offersPageSortOrder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                inputProps={{ inputProps: { min: 0 } }}
                errorMessage={
                  formik.touched.offersPageSortOrder &&
                  formik.errors.offersPageSortOrder
                }
                id="offersPageSortOrder"
                label="Offers Page Sort Order"
              />
              {categoryList && (
                <div>
                  <SingleSelectDropdown
                    placeholder="Select Parent Category"
                    options={[
                      { id: -1, name: "No Parent Selected" },
                      ...categoryList,
                    ]}
                    selectedValue={formik.values.parentCategoryId}
                    handleChange={(_e: any, value) => {
                      formik.setFieldValue("parentCategoryId", value?.id);
                    }}
                    optionName="name"
                    optionValue="id"
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="bg-base-100 grid gap-6 grid-cols-1 md:grid-cols-2">
            <div className="col-span-2">
              <SectionHeader
                type="primary"
                title="Category Status"
                description="Mark this category as active, best seller, or featured"
                icon="lucide:check-circle"
              />
            </div>

            <CheckboxCard
              type="success"
              name="isActive"
              checked={formik.values.isActive || false}
              onChange={formik.handleChange}
              title="Active Category"
              description="Make this category visible to customers in the selected store"
              icon="lucide:eye"
            />
            <CheckboxCard
              type="primary"
              name="isBestSellerCategory"
              checked={formik.values.isBestSellerCategory || false}
              onChange={formik.handleChange}
              title="Best Seller Category"
              description="Make this category a best seller category"
              icon="lucide:star"
            />
            <CheckboxCard
              type="success"
              name="isFeaturedCategory"
              checked={formik.values.isFeaturedCategory || false}
              onChange={formik.handleChange}
              title="Featured Category"
              description="Make this category a featured category"
              icon="lucide:tag"
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="bg-base-100">
            {data && (
              <>
                <div className="col-span-2">
                  <SectionHeader
                    type="primary"
                    title="SEO"
                    description="SEO settings for your product"
                    icon="lucide:search-check"
                  />
                </div>

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
              </>
            )}
          </CardBody>
        </Card>

        {/* Submit Button */}
      </div>
      <div className="mt-4">
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          color="primary"
          startIcon={<Icon icon="lucide:save" fontSize={18} />}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
