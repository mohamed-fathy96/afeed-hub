import React, { useState } from "react";
import { Button, Card, CardBody } from "@app/ui";
import FileUploadValidator from "@app/ui/FileUploadValidator";
import { PageTitle } from "@app/ui/PageTitle";
import { OffersService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { InputField } from "@app/ui/InputField";
import DateRangePickerComponent from "@app/ui/DateRangePicker/DateRangePicker";
import dayjs from "dayjs";
import { routes } from "@app/lib/routes";

const OffersUploadPage = () => {
  const toast = useToast();
  const [file, setFile] = useState<File>();
  const [title, setTitle] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Row validator
  const rowValidator = (row: Record<string, any>): string | null => {
    if (!row.sku) {
      return "SKU is missing.";
    }
    if (!row?.["Discounted Price"]) {
      return "Discounted Price is missing.";
    }
    if (!row?.["Store ID"]) {
      return "Store ID is missing.";
    }

    return null;
  };
  const handleDateRange = (item: any) => {
    setDateRange(item?.selection);
  };
  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      formData.append("title", title);
      formData.append(
        "startDate",
        dayjs(dateRange?.startDate).format("YYYY-MM-DD")
      );
      formData.append(
        "endDate",
        dayjs(dateRange?.endDate).format("YYYY-MM-DD")
      );

      const res = await OffersService.bulkUploadOffers(formData);
      if (res) {
        toast.success("Uploaded successfully");
        setIsLoading(false);
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to upload Offers");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full mb-3">
        <PageTitle
          title="Bulk Upload Offers"
          breadCrumbItems={[
            { label: "Offers", path: routes.dashboard.offers.index },
            { label: "Bulk Upload Offers", active: true },
          ]}
        />
      </div>
      <Card className="bg-base-100">
        <CardBody>
          <div className="flex justify-between mb-4">
            <a
              href="https://nology-app.s3.me-central-1.amazonaws.com/offers/Offers-Request-Template.xlsx"
              download
              className="text-blue-500 underline font-bold"
            >
              Download Template
            </a>
            <Button
              color="primary"
              disabled={!file || hasErrors}
              onClick={handleUpload}
              loading={isLoading}
            >
              {hasErrors ? "Upload anyway" : "Upload"}
            </Button>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Title"
              name="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div>
              <div
                className="relative border border-base-content rounded-md py-2 px-3 text-sm cursor-pointer h-[56px] flex items-center"
                onClick={() => setShowDatePicker((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowDatePicker((prev) => !prev);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 16h14M5 21h14"
                    />
                  </svg>
                  {`${
                    dayjs(dateRange?.startDate)?.format("YYYY-MM-DD") || ""
                  }  - ${
                    dayjs(dateRange?.endDate)?.format("YYYY-MM-DD") || ""
                  }`}
                </div>
              </div>
              {showDatePicker && (
                <DateRangePickerComponent
                  setShowDatePicker={setShowDatePicker}
                  handleDateRangeChange={handleDateRange}
                  handleApplyDateRange={() => setShowDatePicker(false)}
                  dateRange={dateRange}
                  minDate={new Date()}
                />
              )}
            </div>
          </div>

          <FileUploadValidator
            validationRules={{
              requiredHeaders: ["sku", "Store ID", "Discounted Price"],
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

export default OffersUploadPage;
