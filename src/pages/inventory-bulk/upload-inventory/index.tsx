import React from "react";
import { Button, Card, CardBody } from "@app/ui";
import FileUploadValidator from "@app/ui/FileUploadValidator";
import { PageTitle } from "@app/ui/PageTitle";
import { InvnetoryService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";

const InvnetoryUploadPage = () => {
  const toast = useToast();
  const [file, setFile] = React.useState<File>();
  const [hasErrors, setHasErrors] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  // Row validator
  const rowValidator = (row: Record<string, any>): string | null => {
    if (!row.quantity) {
      return "Quantity is missing.";
    }
    if (typeof row.quantity !== "number" || row.quantity <= 0) {
      return "Quantity must be a positive number.";
    }
    if (!row.sku) {
      return "SKU is missing.";
    }
    if (!row?.["store Id"]) {
      return "Store ID is missing.";
    }
    if (!row.status) {
      return "Status is missing.";
    }
    return null;
  };
  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const res = await InvnetoryService.bulkUploadInventory(formData);
      if (res) {
        toast.success("Uploaded successfully");
        setIsLoading(false);
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to upload inventory");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full mb-3">
        <PageTitle
          title="Bulk Upload Inventory"
          breadCrumbItems={[
            { label: "Inventory" },
            { label: "Bulk Upload Inventory", active: true },
          ]}
        />
      </div>
      <Card className="bg-base-100">
        <CardBody>
          <div className="flex justify-between">
            <a
              href="https://nology-app.s3.me-central-1.amazonaws.com/inventory-updates/Inventory-Bulk-Update-Template.xlsx"
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
              requiredHeaders: ["sku", "store Id", "quantity", "status"],
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

export default InvnetoryUploadPage;
