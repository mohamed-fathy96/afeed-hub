import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { InputField } from "@app/ui/InputField";
import { Button, Card, CardBody } from "@app/ui";
import { Slider } from "@app/lib/types/slider";
import { GlobalService, SliderService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Dropzone } from "@app/ui/Dropzone";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";

interface Props {
  data?: Slider;
  id?: number;
  fetchData?: () => void;
}
type Store = {
  title: string;
  id: number;
};
const sliderTypeOptions = [
  { id: 0, label: "Image" },
  { id: 1, label: "Text" },
];
const sliderPositionOptions = [
  { id: 0, label: "Top" },
  { id: 1, label: "Bottom" },
  { id: 2, label: "Grid" },
  { id: 3, label: "Menu" },
];
const sliderLocationOptions = [
  { id: 0, label: "Home" },
  { id: 1, label: "Cart Page" },
  { id: 2, label: "Grocery" },
  { id: 3, label: "Boutique" },
  { id: 4, label: "SliderMenu" },
];

const SliderForm: React.FC<Props> = ({ data, id, fetchData }) => {
  const toast = useToast();
  const [selectedStores, setSelectedStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<File[] | undefined>(undefined);
  const [isImgLoading, setIsImgLoading] = React.useState<boolean>(false);

  const [storesList, setStoresList] = React.useState<Store[]>([]);
  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      titleAr: data?.titleAr || "",
      sortOrder: data?.sortOrder || 0,
      link: data?.link || "",
      storeId: data?.storeId || 1,
      sliderType: data?.sliderType || 0,
      slug: data?.slug || "",
      sliderPosition: data?.sliderPosition || 0,
      sliderLocation: data?.sliderLocation || 0,
      widthRatio: data?.widthRatio || 0,
      heightRatio: data?.heightRatio || 0,
      label: data?.label || "",
      sliderStores: data?.sliderStores || [],
    },
    validationSchema: yup.object().shape({
      sortOrder: yup.number().required("Sort order is required"),
      link: yup
        .string()
        .required("Link is required")
        .matches(/^afeed:\/\/.+/, "Link must start with 'afeed://'"),
      //       storeId: yup.number().required("Store ID is required"),
      sliderType: yup.number().required("Slider Type is required"),
      slug: yup
        .string()
        .optional()
        .matches(
          /^[a-zA-Z0-9_-]+$/,
          "Slug must contain only letters, numbers, underscores (_), or hyphens (-) and no spaces"
        ),
      sliderPosition: yup.number().required("Slider Position is required"),
      sliderLocation: yup.number().required("Slider Location is required"),

      label: yup.string().required("Label is required"),
      sliderStores: yup.array().of(yup.number()),
      title: yup.string().required("Title is required"),
      titleAr: yup.string().required("Title (AR) is required"),
    }),
    onSubmit: async (values) => {
      const data = {
        ...values,
        sliderStores: selectedStores.map((store) => store.id),
      };
      try {
        setLoading(true);
        if (id) {
          await SliderService.updateSlider(data, id);
          toast.success("Slider updated successfully");
          if (fetchData) {
            fetchData();
          }
        } else {
          const res = await SliderService.createSlider(data);
          toast.success("Slider created successfully");
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.message ?? "Failed to update slider");
      } finally {
        setLoading(false);
      }
    },
  });
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
        data?.sliderStores.includes(store.id)
      );

      setSelectedStores((prev) => {
        const newStores = matchingStores.filter(
          (store) => !prev.some((selected) => selected.id === store.id)
        );

        return [...prev, ...newStores];
      });
    }
  }, [storesList, data?.sliderStores]);

  const handleChangeImage = async (fileItems: File[] | never) => {
    setIsImgLoading(true);

    try {
      const formData = new FormData();
      fileItems.forEach((file) => {
        formData.append("file", file);
      });

      const response = await SliderService.uploadImage(formData, id);
      if (response) {
        toast.success("Images uploaded successfully");
        setFiles(fileItems);
        if (fetchData) fetchData();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload images");
    } finally {
      setIsImgLoading(false);
    }
  };
  const handleRemoveImage = async (imgId: number) => {
    setIsImgLoading(true);
    try {
      const response = await SliderService.removeImage(id, imgId);

      if (response) {
        toast.success("Image has been Deleted");
        fetchData && fetchData();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete image");
    } finally {
      setIsImgLoading(false);
    }
  };
  useEffect(() => {
    if (storesList?.length && data?.sliderStores?.length) {
      const matchingStores = storesList.filter((store: Store) =>
        data?.sliderStores.includes(store.id)
      );
      setSelectedStores(matchingStores);
    }
  }, [storesList, data?.sliderStores]);

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

            <div className="space-y-2">
              <p className="text-sm font-semibold">Select Stores</p>
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
                    {store.title}
                  </Button>
                ))}
              </div>
            </div>

            <InputField
              id="slug"
              label="Slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.slug ? formik.errors.slug : undefined
              }
              disabled
            />
            <InputField
              id="sortOrder"
              label="Sort Order"
              type="number"
              value={formik.values.sortOrder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.sortOrder && formik.errors.sortOrder
                  ? formik.errors.sortOrder
                  : undefined
              }
            />
            <InputField
              id="link"
              label="Link"
              value={formik.values.link}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.link && formik.errors.link
                  ? formik.errors.link
                  : undefined
              }
            />

            {id && (
              <div className="grid">
                <Dropzone
                  value={files}
                  multiple
                  previewExistFiles={data?.images?.length ? data?.images : []}
                  maxSize={2}
                  direction="vertical"
                  id="slider_images"
                  onChange={handleChangeImage}
                  onRemoveExistFile={handleRemoveImage}
                  isLoading={isImgLoading}
                />
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardBody className="bg-base-100 space-y-4">
            <InputField
              id="titleAr"
              label="Title (AR)"
              value={formik.values.titleAr}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.titleAr && formik.errors.titleAr
                  ? formik.errors.titleAr
                  : undefined
              }
            />

            <SingleSelectDropdown
              placeholder="Slider Type"
              options={sliderTypeOptions}
              optionValue="id"
              optionName="label"
              selectedValue={formik.values.sliderType}
              handleChange={(_e, value) => {
                formik.setFieldValue("sliderType", value?.id);
              }}
            />
            <SingleSelectDropdown
              options={sliderPositionOptions}
              placeholder="Slider Position"
              optionValue="id"
              optionName="label"
              selectedValue={formik.values.sliderPosition}
              handleChange={(_e, value) => {
                formik.setFieldValue("sliderPosition", value?.id);
              }}
            />
            <SingleSelectDropdown
              options={sliderLocationOptions}
              optionValue="id"
              placeholder="Slider Location"
              optionName="label"
              selectedValue={formik.values.sliderLocation}
              handleChange={(_e, value) => {
                formik.setFieldValue("sliderLocation", value?.id);
              }}
            />
            <InputField
              id="label"
              label="Label"
              value={formik.values.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.label && formik.errors.label
                  ? formik.errors.label
                  : undefined
              }
            />
          </CardBody>
        </Card>
      </div>

      <Button type="submit" color="primary" className="mt-6" loading={loading}>
        Submit
      </Button>
    </form>
  );
};

export default SliderForm;
