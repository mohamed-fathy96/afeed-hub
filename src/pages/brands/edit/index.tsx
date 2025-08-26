import React, { useEffect, useState } from "react";
import { BrandService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import { Brand } from "@app/lib/types/brands";
import ProductForm from "@app/components/form/product/ProductForm";
import BrandForm from "@app/components/brand/BrandForm";
import { routes } from "@app/lib/routes";

interface EditPageProps {}

const EditBrandPage: React.FC<EditPageProps> = () => {
  const params: { id?: string } = useParams();

  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [brandData, setBrandData] = useState<Brand>();
  const toast = useToast();
  const fetchById = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await BrandService.getByBrandId(params?.id);
      setBrandData(res.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(
        err?.response?.data?.message ?? "Failed to get Brand details"
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
              title={`Edit ${brandData?.nameEn} Brand` || "Edit Brand"}
              breadCrumbItems={[
                {
                  label: "Brand",
                  active: true,
                  path: routes.dashboard.brands.index,
                },
                { label: brandData?.nameEn || "", active: true },
              ]}
            />
          </div>
          <BrandForm
            data={brandData}
            id={Number(params?.id)}
            fetchData={fetchById}
          />
        </>
      )}
    </>
  );
};

export default EditBrandPage;
