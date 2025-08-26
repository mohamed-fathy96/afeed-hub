import React, { useState } from "react";
import { CategoryService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Category } from "@app/lib/types/category";
import { Dropzone } from "@app/ui/Dropzone";
import { Card, CardBody, RadioTab, SectionHeader, Tabs } from "@app/ui";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubCategoryTab from "./SubCategoryTab";
import { DetailsTab } from "./DetailsTab";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import { Icon } from "@iconify/react";
import { ImageWithFallback } from "@app/ui/Image";

interface EditCategoryFormProps {
  data?: Category;
  id?: number;
  fetchData?: () => void;
}

const CategoryForm: React.FC<EditCategoryFormProps> = ({
  data,
  id,
  fetchData,
}) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [isImgLoading, setIsImgLoading] = useState<boolean>(false);
  const toast = useToast();
  const [files, setFiles] = useState<File[] | undefined>(undefined);

  const currentTab = searchParams.get("tab") || "Details";

  // Handle tab changes and update URL
  const handleTabChange = (tabName: string) => {
    navigate(`?tab=${tabName}`, { replace: true });
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
        const response = await CategoryService.uploadImage(formData, id);
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
      const response = await CategoryService.removeImage(id, imgId);

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
    <>
      {data && (
        <Card className="bg-base-100 shadow-sm overflow-hidden">
          <div className="bg-primary/10 px-6 py-4 border-b border-base-300">
            <div className="flex items-center gap-3 justify-between w-full">
              <h2 className="text-xl font-semibold">{data?.title}</h2>
              {data?.images && (
                <div className="h-14 w-14 rounded-md overflow-hidden border border-base-300">
                  <ImageWithFallback
                    src={data?.images?.[0]?.path}
                    alt={data?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span>
                ID: <span className="font-mono">{data.id}</span>
              </span>
              <CopyToClipboard text={String(data.id)} />
            </div>
          </div>
        </Card>
      )}
      <Tabs variant="bordered" className="px-4 mt-4">
        <RadioTab
          name="my_tabs_1"
          label="Details"
          contentClassName="pt-4"
          defaultChecked={true}
          checked={currentTab === "Details"}
          onChange={() => handleTabChange("Details")}
        >
          <DetailsTab data={data} fetchData={fetchData} id={id} />
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
                  title="Category Media"
                  description="Upload images and videos for your category"
                  icon="lucide:image"
                  type="primary"
                />

                <Dropzone
                  value={files}
                  previewExistFiles={data?.images?.length ? data?.images : []}
                  multiple
                  maxSize={2}
                  direction="vertical"
                  id="category_image"
                  onChange={handleChangeImage}
                  onRemoveExistFile={handleRemoveExistImage}
                  isLoading={isImgLoading}
                />
              </CardBody>
            </Card>
          </RadioTab>
        )}
        {id && (
          <RadioTab
            name="my_tabs_1"
            label="SubCategory"
            contentClassName="pt-4"
            checked={currentTab === "SubCategory"}
            onChange={() => handleTabChange("SubCategory")}
          >
            {currentTab === "SubCategory" && <SubCategoryTab id={Number(id)} />}
          </RadioTab>
        )}
      </Tabs>
    </>
  );
};

export default CategoryForm;
