import React, { useEffect, useState } from "react";
import { ProductService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import { Product } from "@app/lib/types/product";
import ProductForm from "@app/components/form/product/ProductForm";
import { routes } from "@app/lib/routes";

interface EditPageProps {}

const EditProductPage: React.FC<EditPageProps> = () => {
  const params: { id?: string } = useParams();

  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [productData, setProductData] = useState<Product>();
  const toast = useToast();
  const fetchById = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await ProductService.getByProductId(params?.id);
      setProductData(res.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(
        err?.response?.data?.message ?? "Failed to get Product details"
      );
    }
  };

  useEffect(() => {
    if (params?.id) fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);
  console.log(productData);

  return (
    <>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <div className="w-full mb-3">
            <PageTitle
              title={`Edit ${productData?.sku} Product` || "Edit Product"}
              breadCrumbItems={[
                {
                  label: "Product",
                  active: true,
                  path: routes.dashboard.products.index,
                },
                { label: productData?.title || "", active: true },
              ]}
            />
          </div>
          <ProductForm
            data={productData}
            id={Number(params?.id)}
            fetchData={fetchById}
          />
        </>
      )}
    </>
  );
};

export default EditProductPage;
