import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BrandService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Card, CardBody, RadioTab, SectionHeader, Tabs } from "@app/ui";
import { Brand } from "@app/lib/types/brands";
import BrandDetailsForm from "./BrandDetailsForm";
import { Dropzone } from "@app/ui/Dropzone";
import { Icon } from "@app/ui/Icon";

interface FormProps {
  data?: Brand;
  id?: number;
  fetchData?: () => void;
}

const BrandForm: React.FC<FormProps> = ({ data, id, fetchData }) => {
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isImgLoading, setIsImgLoading] = useState<boolean>(false);
  const currentTab = searchParams.get("tab") || "Details";

  // Handle tab changes and update URL
  const handleTabChange = (tabName: string) => {
    navigate(`?tab=${tabName}`, { replace: true });
  };

  const handleUpdateProduct = async (values: Brand) => {
    try {
      let res;
      if (id) {
        res = await BrandService.updateBrand(values, id);
      }

      if (res) {
        toast.success(res?.data?.message ?? "Brand updated successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update Brand");
    }
  };

  const handleChangeImage = async (fileItems: File[] | never) => {
    setIsImgLoading(true);

    if (fileItems.length > 0) {
      const fileItem = fileItems?.[0];
      try {
        // Ensure the file is an image
        if (!fileItem.type.startsWith("image/")) {
          toast.error("Please select a valid image file.");
          setIsImgLoading(false);
          return;
        }

        // Convert the image to base64 or form data (based on API requirements)
        const formData = new FormData();
        formData.append("file", fileItem);

        // Make the API call
        const response = await BrandService.uploadImage(formData, id);
        if (response) {
          toast.success("Image uploaded successfully");
          setFiles(fileItems);
          if (fetchData) fetchData();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to upload image");
      }
    } else {
      // Clear the image if no file is selected
      setFiles(undefined);
    }

    setIsImgLoading(false);
  };

  const handleRemoveExistImage = async (imgId: number) => {
    setIsImgLoading(true);
    try {
      const response = await BrandService.removeImage(id, imgId);

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
  return (
    <Tabs variant="bordered" className="px-4">
      <RadioTab
        name="my_tabs_1"
        label="Details"
        contentClassName="pt-4"
        checked={currentTab === "Details"}
        onChange={() => handleTabChange("Details")}
      >
        <BrandDetailsForm data={data} onSubmit={handleUpdateProduct} />
      </RadioTab>
      {id && (
        <RadioTab
          name="my_tabs_1"
          label="Media"
          contentClassName="pt-4"
          checked={currentTab === "Media"}
          onChange={() => handleTabChange("Media")}
        >
          <Card className="bg-base-100 shadow-sm border border-base-300/50">
            <CardBody className="p-6">
              <SectionHeader
                title="Brand Media"
                description="Upload images and videos for your brand"
                icon="lucide:image"
                type="primary"
              />

              <Dropzone
                value={files}
                previewExistFiles={data?.images?.length ? data?.images : []}
                multiple
                maxSize={2}
                direction="vertical"
                id="brand_image"
                onChange={handleChangeImage}
                onRemoveExistFile={handleRemoveExistImage}
                isLoading={isImgLoading}
              />
            </CardBody>
          </Card>
        </RadioTab>
      )}
    </Tabs>
  );
};

export default BrandForm;
