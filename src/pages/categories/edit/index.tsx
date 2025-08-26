import React, { useEffect, useState } from "react";
import { CategoryService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import CategoryForm from "@app/components/form/category/CategoryForm";
import { PageTitle } from "@app/ui/PageTitle";
import { routes } from "@app/lib/routes";

interface EditCategoryPageProps {}

const EditCategoryPage: React.FC<EditCategoryPageProps> = () => {
  const params: { id?: string } = useParams();

  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<any>({});
  const toast = useToast();
  const fetchById = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await CategoryService.getByCategoryId(params?.id);
      setCategoryData(res.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(
        err?.response?.data?.message ?? "Failed to get Category details"
      );
    }
  };

  useEffect(() => {
    if (params?.id) fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <div className="w-full mb-3">
            <PageTitle
              title={`Edit ${categoryData?.title} Category` || "Edit Category"}
              breadCrumbItems={[
                {
                  label: "Category",
                  active: true,
                  path: routes.dashboard.categories.index,
                },
                { label: categoryData?.title, active: true },
              ]}
            />
          </div>
          <CategoryForm
            data={categoryData}
            id={Number(params?.id)}
            fetchData={fetchById}
          />
        </>
      )}
    </>
  );
};

export default EditCategoryPage;
