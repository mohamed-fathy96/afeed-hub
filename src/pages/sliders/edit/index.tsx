import React, { useEffect, useState } from "react";
import { SliderService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import SliderForm from "@app/components/form/slider/SliderForm";
import { Slider } from "@app/lib/types/slider";
import { PageTitle } from "@app/ui/PageTitle";

const EditSliderPage: React.FC = () => {
  const params: { id?: string } = useParams();

  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [sliderData, setSliderData] = useState<Slider>();
  const toast = useToast();
  const fetchById = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await SliderService.getBySliderById(params?.id);
      setSliderData(res.data);
      console.log(res?.data);

      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(
        err?.response?.data?.message ?? "Failed to get Slider details"
      );
    }
  };

  useEffect(() => {
    if (params?.id) fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <div>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <div className="w-full mb-3">
            <PageTitle
              title={`Edit ${sliderData?.title} Slider` || "Edit Slider"}
              breadCrumbItems={[{ label: "Sliders", active: true }]}
            />
          </div>
          <SliderForm
            data={sliderData}
            id={Number(params?.id)}
            fetchData={fetchById}
          />
        </>
      )}
    </div>
  );
};

export default EditSliderPage;
