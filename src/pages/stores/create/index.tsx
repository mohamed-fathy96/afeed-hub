import StoreForm from "@app/components/form/store/StoreForm";
import { PageTitle } from "@app/ui/PageTitle";

const CreateStorePage = () => {
  return (
    <>
      <div className="w-full mb-3">
        <PageTitle
          title={"Create Store"}
          breadCrumbItems={[{ label: "Stores", active: true }]}
        />
      </div>
      <StoreForm />
    </>
  );
};

export default CreateStorePage;
