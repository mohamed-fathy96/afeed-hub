import React from "react";
import { Button, Card, CardBody } from "@app/ui";
import FileUploadValidator from "@app/ui/FileUploadValidator";
import { PageTitle } from "@app/ui/PageTitle";
import { ProductService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { routes } from "@app/lib/routes";

const ProductUploadPage = () => {
  const toast = useToast();
  const [file, setFile] = React.useState<File>();
  const [hasErrors, setHasErrors] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  // Row validator
  const rowValidator = (row: Record<string, any>): string | null => {
    if (typeof row.Cost !== "number" || row.Cost <= 0) {
      return "Cost is missing.";
    }
    if (typeof row.Price !== "number" || row.Price <= 0) {
      return "Quantity must be a positive number.";
    }
    if (!row.SKU) {
      return "SKU is missing.";
    }
    if (!row?.["Title English"]) {
      return "Title English is missing.";
    }
    if (!row?.["Title Arabic"]) {
      return "Title Arabic is missing.";
    }
    return null;
  };
  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const res = await ProductService.bulkUploadProduct(formData);
      if (res) {
        toast.success("Uploaded successfully");
        setIsLoading(false);
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to upload Products");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full mb-3">
        <PageTitle
          title="Bulk Upload Products"
          breadCrumbItems={[
            { label: "Products", path: routes.dashboard.products.index },
            { label: "Bulk Upload Products", active: true },
          ]}
        />
      </div>
      <Card className="bg-base-100">
        <CardBody>
          <div className="flex justify-between">
            <a
              href="https://nology-app.s3.me-central-1.amazonaws.com/Create-Product-Template.xlsx"
              download
              className="text-blue-500 underline font-bold"
            >
              Download Template
            </a>
            <Button
              color="primary"
              disabled={!file}
              onClick={handleUpload}
              loading={isLoading}
            >
              {hasErrors ? "Upload anyway" : "Upload"}
            </Button>
          </div>
          <FileUploadValidator
            validationRules={{
              requiredHeaders: [
                "SKU",
                "Title English",
                "Title Arabic",
                "Cost",
                "Price",
              ],
              rowValidator,
            }}
            onValidData={(data) => {
              console.log("Valid Data:", data);
            }}
            onValidationError={(errors) => {
              console.log("Validation Errors:", errors);
            }}
            setHasRowErrors={setHasErrors}
            setUploadedFile={setFile}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default ProductUploadPage;
