import React, { useEffect, useState } from "react";
import { StoreService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import type { Store } from "@app/lib/types/store";
import StoreForm from "@app/components/form/store/StoreForm";
import { PageTitle } from "@app/ui/PageTitle";
import { routes } from "@app/lib/routes";

interface EditStorePageProps {}

const EditStorePage: React.FC<EditStorePageProps> = () => {
  const params: { id?: string } = useParams();

  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<Store>();
  const toast = useToast();
  const fetchById = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await StoreService.getByStoreById(params?.id);
      setStoreData(res.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(
        err?.response?.data?.message ?? "Failed to get Store details"
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
              title={`Edit ${storeData?.title} Store` || "Edit Store"}
              breadCrumbItems={[
                {
                  label: "Stores",
                  active: true,
                  path: routes.dashboard.stores.index,
                },
                { label: storeData?.title || "", active: true },
              ]}
            />
          </div>
          <StoreForm
            data={storeData}
            id={Number(params?.id)}
            fetchData={fetchById}
          />
        </>
      )}
    </>
  );
};

export default EditStorePage;
