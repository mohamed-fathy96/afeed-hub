import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProductService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Dropzone } from "@app/ui/Dropzone";
import { Button, Card, CardBody, RadioTab, SectionHeader, Tabs } from "@app/ui";
import {
  MediaTypeEnum,
  Product,
  ProductTypeEnum,
} from "@app/lib/types/product";
import ProductDetailsForm from "./ProductDetailsForm";
import ListingTab from "./ListingTab";
import PricingTab from "./PricingTab";
import AvailabilityTab from "./AvailabilityTab";
import ESupplierTab from "./ESupplierTab";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import { Icon } from "@app/ui/Icon";

interface FormProps {
  data?: Product;
  id?: number;
  fetchData?: () => void;
}

const ProductForm: React.FC<FormProps> = ({ data, id, fetchData }) => {
  const [isImgLoading, setIsImgLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentTab = searchParams.get("tab") || "Details";

  // Handle tab changes and update URL
  const handleTabChange = (tabName: string) => {
    navigate(`?tab=${tabName}`, { replace: true });
  };

  const uploadMediaMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await ProductService.uploadImage(formData, id);
    },
    onSuccess: () => {
      if (fetchData) fetchData();
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload image");
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: async (imgId: number) => {
      return await ProductService.removeImage(id, imgId);
    },
    onSuccess: () => {
      if (fetchData) fetchData();
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete image");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (values: Product) => {
      const { ...payload } = values;
      return await ProductService.updateProduct(payload, id);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message ?? "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update product");
    },
  });

  const syncProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await ProductService.syncProduct(id);
    },
  });

  const assignThumbnailMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const body = { isThumbnail: true };
      return await ProductService.assignThumbnail(body, fileId);
    },
    onSuccess: async () => {
      toast.success("Thumbnail assigned successfully");
      if (fetchData) fetchData();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to assign thumbnail");
    },
  });

  const updateProductMediaSortMutation = useMutation({
    mutationFn: async (
      sortedFiles: {
        id: number;
        path: string;
        mediaType: number;
        sort: number;
      }[]
    ) => {
      return await ProductService.updateProductMediaSort({
        imageSortOrders: sortedFiles?.map((file) => ({
          imageId: file?.id,
          sort: file?.sort,
        })),
      });
    },
    onSuccess: () => {
      toast.success("Product media sort updated successfully");
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to update product media sort"
      );
    },
  });

  const handleChangeImage = async (fileItems: File[] | never) => {
    setIsImgLoading(true);
    if (fileItems.length > 0) {
      const fileItem = fileItems?.[0];
      try {
        const formData = new FormData();
        formData.append("file", fileItem);
        await uploadMediaMutation.mutateAsync(formData);
        setFiles(fileItems);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to upload image");
      } finally {
        setIsImgLoading(false);
      }
    } else {
      setFiles(undefined);
    }
  };

  const handleRemoveExistImage = async (imgId: number) => {
    setIsImgLoading(true);
    try {
      await removeImageMutation.mutateAsync(imgId);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to remove image");
    } finally {
      setIsImgLoading(false);
    }
  };

  const handleUpdateProduct = async (values: Product) => {
    await updateProductMutation.mutateAsync(values);
  };

  const handleSortPreviewExistFiles = async (
    sortedFiles: {
      id: number;
      path: string;
      mediaType: number;
      sort: number;
    }[]
  ) => {
    await updateProductMediaSortMutation.mutateAsync(sortedFiles);
  };

  const handleSyncProduct = async () => {
    await syncProductMutation.mutateAsync(id as number);
  };

  const handleThumbnail = async (fileId: number) => {
    await assignThumbnailMutation.mutateAsync(fileId);
  };

  const handleAddYouTubeVideo = async (videoData: { youtubeUrl: string }) => {
    try {
      const formData = new FormData();
      formData.append("youtubeUrl", videoData.youtubeUrl);
      await uploadMediaMutation.mutateAsync(formData);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to upload video");
    }
  };

  return (
    <>
      {/* Product Header with Basic Info */}
      {data && (
        <Card className="bg-base-100 shadow-sm overflow-hidden">
          <div className="bg-primary/10 px-6 py-4 border-b border-base-300 space-y-4">
            <div className="flex items-center gap-3 justify-between w-full">
              <h2 className="text-xl font-semibold">{data.title}</h2>
              {data?.imagePath && (
                <div className="h-14 w-14 rounded-md overflow-hidden border border-base-300">
                  <img
                    src={data.imagePath}
                    alt={data.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1">
                <span>
                  SKU: <span className="font-mono">{data.sku}</span>
                </span>
                <CopyToClipboard text={data.sku} />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  color="primary"
                  onClick={handleSyncProduct}
                  loading={syncProductMutation.isPending}
                >
                  <Icon icon="lucide:refresh-cw" />
                  Sync
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Tabs variant="bordered" className="mt-4">
        <RadioTab
          name="my_tabs_1"
          label="Details"
          contentClassName="pt-4"
          checked={currentTab === "Details"}
          onChange={() => handleTabChange("Details")}
        >
          <ProductDetailsForm data={data} onSubmit={handleUpdateProduct} />
        </RadioTab>
        <RadioTab
          name="my_tabs_1"
          label="Media"
          contentClassName="pt-4"
          checked={currentTab === "Media"}
          onChange={() => handleTabChange("Media")}
        >
          <Card className="bg-base-100 shadow-sm border border-base-300/50">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <SectionHeader
                  type="primary"
                  title="Product Media"
                  description="Upload images and videos for your product"
                  icon="lucide:image"
                />
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-info/10 text-info rounded-full text-xs font-medium">
                    <Icon icon="lucide:arrow-up-down" className="w-3 h-3" />
                    Drag & drop to reorder
                  </div>
                </div>
              </div>
              <Dropzone
                value={files}
                allowPeriority
                onHandleThumbnail={handleThumbnail}
                previewExistFiles={data?.images?.length ? data?.images : []}
                multiple
                maxSize={5}
                inputProps={{
                  accept: "image/*",
                }}
                direction="vertical"
                onAddYouTubeVideo={handleAddYouTubeVideo}
                id="product_image"
                onChange={handleChangeImage}
                onRemoveExistFile={handleRemoveExistImage}
                isLoading={isImgLoading}
                onSortPreviewExistFiles={handleSortPreviewExistFiles}
                showYouTubeButton
              />
            </CardBody>
          </Card>
        </RadioTab>

        <RadioTab
          name="my_tabs_1"
          label="Pricing"
          contentClassName="pt-4"
          checked={currentTab === "Pricing"}
          onChange={() => handleTabChange("Pricing")}
        >
          <Card>
            <CardBody className="bg-base-100">
              {currentTab === "Pricing" && (
                <PricingTab product={data || null} />
              )}
            </CardBody>
          </Card>
        </RadioTab>
        <RadioTab
          name="my_tabs_1"
          label="Listing"
          contentClassName="pt-4"
          checked={currentTab === "Listing"}
          onChange={() => handleTabChange("Listing")}
        >
          <Card>
            <CardBody className="bg-base-100">
              {currentTab === "Listing" && (
                <ListingTab product={data || null} />
              )}
            </CardBody>
          </Card>
        </RadioTab>
        <RadioTab
          name="my_tabs_1"
          label="Availability"
          contentClassName="pt-4"
          checked={currentTab === "Availability"}
          onChange={() => handleTabChange("Availability")}
        >
          <Card>
            <CardBody className="bg-base-100">
              {currentTab === "Availability" && (
                <AvailabilityTab product={data || null} />
              )}
            </CardBody>
          </Card>
        </RadioTab>
        {data?.productType === ProductTypeEnum.ECard && (
          <RadioTab
            name="my_tabs_1"
            label="E-Suppliers"
            className="min-w-max"
            contentClassName="pt-4"
            checked={currentTab === "supplier"}
            onChange={() => handleTabChange("supplier")}
          >
            <Card>
              <CardBody className="bg-base-100">
                {currentTab === "supplier" && (
                  <ESupplierTab product={data || null} />
                )}
              </CardBody>
            </Card>
          </RadioTab>
        )}
      </Tabs>
    </>
  );
};

export default ProductForm;
