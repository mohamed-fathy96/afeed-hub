import SliderForm from "@app/components/form/slider/SliderForm";
import { PageTitle } from "@app/ui/PageTitle";

const CreateSliderPage = () => {
  return (
    <>
      <div className="w-full mb-3">
        <PageTitle
          title={"Create Slider"}
          breadCrumbItems={[{ label: "Sliders", active: true }]}
        />
      </div>
      <SliderForm />
    </>
  );
};

export default CreateSliderPage;
