import { useToast } from "@app/helpers/hooks/use-toast";
import { Product } from "@app/lib/types/product";
import { GlobalService, ProductService } from "@app/services/actions";
import { useEffect, useState } from "react";

import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { Badge, Button } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";
import { SectionLoader } from "@app/ui/SectionLoader";

interface ListingFormProps {
  product: Product | null;
}

const ListingTab = ({ product }: ListingFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<any[] | null>(
    null
  );
  const [assignedCategories, setAssignedCategories] = useState<any[] | null>();
  const [filteredCat, setFilteredCat] = useState<any[]>([]);
  const toast = useToast();

  const fetchAssignedCategories = async () => {
    setIsLoading(true);
    try {
      const res = await ProductService.getAssignedCategory(product?.id);
      if (res) {
        setAssignedCategories(res?.data || []);
        setSelectedCategories(res?.data || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch assigned categories", error);
      toast.error(
        error?.response?.data?.message ?? "Failed to fetch assigned categories"
      );
      setIsLoading(false);
    }
  };
  const handeleAssignCategoryToProduct = async () => {
    // Filter out already assigned categories
    const newCategoryIds = selectedCategories
      ?.filter(
        (cat) =>
          !assignedCategories?.some((assignedCat) => assignedCat.id === cat.id)
      )
      .map((cat) => cat.id);

    if (!newCategoryIds || newCategoryIds.length === 0) {
      toast.show("No new categories to assign.");
      return;
    }

    try {
      const res = await ProductService.assignCategoryToProduct(
        newCategoryIds,
        product?.id
      );
      if (res) {
        toast.success("New categories assigned successfully");
        fetchAssignedCategories();
      }
    } catch (error: any) {
      console.error("Failed to assign category", error);
      toast.error(
        error?.response?.data?.message ?? "Failed to assign category"
      );
    }
  };

  useEffect(() => {
    if (product) {
      fetchAssignedCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const fetchFlatCategories = async () => {
    try {
      const res = await GlobalService.getAllFlatCategories();
      setFilteredCat(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get list");
    }
  };

  useEffect(() => {
    fetchFlatCategories();
  }, []);

  const handleSelectCat = (value: any) => {
    const selectedCat = filteredCat.find((item: any) => item?.id === value.id);

    if (!selectedCat) {
      return;
    }

    setSelectedCategories((prev: any[] | null) => {
      if (!prev) {
        return [selectedCat];
      }

      const alreadySelected = prev?.some(
        (cat: any) => cat.id === selectedCat.id
      );

      if (alreadySelected) {
        return prev;
      }

      return [...prev, selectedCat];
    });
  };
  const handleRemoveCat = async (id: string, categoryId: number) => {
    // Check if the category exists in the assignedCategories list
    const isAssigned = assignedCategories?.some((cat: any) => cat.id === id);

    if (isAssigned) {
      try {
        const res = await ProductService.removeAssignedCategory(
          product?.id,
          categoryId
        );
        if (res) {
          toast.success(res?.data?.message ?? "Category removed successfully");
          // Update the assignedCategories and selectedCategories lists
          setAssignedCategories(
            (prev) => prev?.filter((cat: any) => cat.id !== id) || []
          );
          setSelectedCategories(
            (prev) => prev?.filter((cat: any) => cat.id !== id) || []
          );
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ?? "Failed to remove category"
        );
      }
    } else {
      // Remove from selectedCategories if not in assignedCategories
      setSelectedCategories(
        (prev) => prev?.filter((cat: any) => cat.id !== id) || []
      );
      toast.success("Category removed from selection");
    }
  };

  return (
    <>
      {isLoading ? (
        <SectionLoader />
      ) : (
        <>
          <SingleSelectDropdown
            optionName="name"
            selectedValue={""}
            handleChange={(_, value) => handleSelectCat(value)}
            options={filteredCat}
            optionValue="id"
            placeholder="Select Category"
          />
          {selectedCategories && selectedCategories.length > 0 ? (
            <div className="flex gap-2 flex-wrap mt-3">
              {selectedCategories.map((cat: any) => (
                <Badge key={cat.id} color="primary" className="h-9">
                  {cat?.title || cat?.name}{" "}
                  <Icon
                    icon={xIcon}
                    onClick={() => handleRemoveCat(cat?.id, cat.categoryId)}
                    className="cursor-pointer"
                  />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No categories Assinged to this product.
            </p>
          )}
          <div>
            <Button
              color="primary"
              className="mt-4"
              onClick={handeleAssignCategoryToProduct}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ListingTab;
