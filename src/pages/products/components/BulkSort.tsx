import { useToast } from "@app/helpers/hooks/use-toast";
import { ProductService } from "@app/services/actions";
import { Button } from "@app/ui";
import FileUploadValidator from "@app/ui/FileUploadValidator";
import { useState } from "react";

export const BulkSort = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toast = useToast();
  const [file, setFile] = useState<File>();
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Row validator
  const rowValidator = (row: Record<string, any>): string | null => {
    if (!row.SKU) {
      return "SKU is missing.";
    }
    if (!row.Sort) {
      return "Sort is missing.";
    }
    return null;
  };
  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const res = await ProductService.bulkSort(formData);
      if (res) {
        toast.success("Uploaded successfully");
        setIsLoading(false);
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to upload Assing categories"
      );
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <a
          href="https://nology-app.s3.me-central-1.amazonaws.com/Bulk-Template/Bulk-Sorting.xlsx"
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
          requiredHeaders: ["SKU", "Sort"],
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
    </>
  );
};
