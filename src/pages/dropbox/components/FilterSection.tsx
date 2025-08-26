import React, { useRef } from "react";

import { Button } from "@app/ui";

const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  requestFile: string;
  setRequestFile: any;
}> = ({ requestFile, setRequestFile }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClickFilter = () => {
    const searchValue = searchInputRef.current?.value || "";
    setRequestFile(searchValue);
  };

  return (
    <div className="bg-base-100 shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input with Filter Button */}
        <div className="relative col-span-1 flex">
          <input
            type="text"
            ref={searchInputRef}
            className="w-full border border-gray-300 rounded-md pl-10 py-2 text-sm"
            placeholder="Search by Dropbox file url"
            defaultValue={requestFile}
            onKeyDown={(e) => {
              if (e?.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                setRequestFile(value);
                handleClickFilter();
              }
            }}
          />
          <div className="absolute top-2.5 left-3 text-gray-500">🔍</div>
          <Button
            onClick={handleClickFilter}
            className="ml-2 px-3 py-2 rounded-md bg-primary text-base-100 text-sm"
          >
            Search in Dropbox
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
