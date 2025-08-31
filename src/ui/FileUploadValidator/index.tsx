import React, { useState } from "react";
import * as XLSX from "xlsx";

interface ValidationRules {
  requiredHeaders: string[];
  rowValidator: (row: Record<string, any>) => string | null;
}

interface FileUploadValidatorProps {
  validationRules: ValidationRules;
  onValidData: (data: any[]) => void;
  setUploadedFile: (file: File) => void;
  onValidationError?: (errors: string[]) => void;
  allowedFileTypes?: string[];
  setHasRowErrors?: (hasRowErrors: boolean) => void;
}

const FileUploadValidator: React.FC<FileUploadValidatorProps> = ({
  validationRules,
  onValidData,
  onValidationError,
  allowedFileTypes = [".xlsx", ".xls"],
  setUploadedFile,
  setHasRowErrors,
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [validRows, setValidRows] = useState<Record<string, any>[]>([]);
  const [errorRows, setErrorRows] = useState<Record<string, any>[]>([]);

  const validateFileType = (fileName: string): boolean => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    return allowedFileTypes.includes(`.${fileExtension}`);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    if (!validateFileType(file.name)) {
      const error = `Invalid file type: ${
        file.name
      }. Allowed types are: ${allowedFileTypes.join(", ")}.`;
      setErrors([error]);
      onValidationError?.([error]);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      validateData(jsonData as Record<string, any>[]);
    };

    reader.readAsArrayBuffer(file);
  };

  const validateData = (data: Record<string, any>[]) => {
    const { requiredHeaders, rowValidator } = validationRules;
    const headerErrors: string[] = [];
    const tempValidRows: Record<string, any>[] = [];
    const tempErrorRows: Record<string, any>[] = [];

    // Validate headers
    const headers = Object.keys(data[0] || {});
    requiredHeaders.forEach((header) => {
      if (!headers.includes(header)) {
        headerErrors.push(
          `Missing required title: "${header}". The file must include this column.`
        );
      }
    });

    // Validate rows
    data.forEach((row) => {
      const rowError = rowValidator(row);
      if (rowError) {
        tempErrorRows.push({ ...row, error: rowError });
      } else {
        tempValidRows.push(row);
      }
    });

    setErrors(headerErrors);
    setValidRows(tempValidRows);
    if (setHasRowErrors) {
      setHasRowErrors(tempErrorRows.length > 0);
    }
    setErrorRows(tempErrorRows);

    if (headerErrors.length > 0) {
      onValidationError?.(headerErrors);
    } else {
      onValidData(tempValidRows);
    }
  };

  return (
    <div className="flex flex-col mt-3 bg-base-100 space-y-6">
      <label className="block text-sm font-medium text-base-100 p-2 w-fit rounded-lg bg-primary text-bold cursor-pointer">
        Browse File ({allowedFileTypes.join(", ")})
        <input
          type="file"
          accept={allowedFileTypes.join(",")}
          className="w-full mt-2 text-sm hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      </label>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="p-4 border border-error rounded-lg bg-error bg-opacity-10 w-full">
          <h4 className="text-error font-semibold text-lg mb-2">
            Validation Errors
          </h4>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index} className="text-error text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Successfully Validated Rows */}
      {validRows.length > 0 && (
        <div className="p-4 border border-success rounded-lg bg-success bg-opacity-10 w-full">
          <h4 className="text-success font-semibold text-lg mb-2">
            Successfully Validated Rows: {validRows.length}
          </h4>
          {/* <table className="table-auto w-full border-collapse border border-gray-300 text-sm bg-white">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(validRows[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {validRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2 text-gray-700"
                    >
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      )}

      {/* Rows with Errors */}
      {errorRows.length > 0 && (
        <div className="p-4 border border-warning rounded-lg bg-warning bg-opacity-10 w-full overflow-x-auto">
          <h4 className="text-warning font-semibold text-lg mb-2">
            Rows with Errors
          </h4>
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm bg-white">
            <thead>
              <tr className="bg-gray-100">
                {Object?.keys(errorRows[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errorRows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2 text-gray-700"
                    >
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploadValidator;
