import React from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";

import { Button } from "@app/ui";
import AddIcon from "@mui/icons-material/Add";
import { GlobalParamsUrl } from "@app/lib/types/global";

import { routes } from "@app/lib/routes";

const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: GlobalParamsUrl;
  setParams: any;
}> = ({ params, setParams }) => {
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, searchKey: e.target.value, pageNumber: 1 });
  };

  const handleClickFilter = () => {
    const queryString = convertObjectIntoQueryParams(params);
    navigate({ search: queryString });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      handleClickFilter();
    }
  };
  return (
    <div className="bg-base-100 shadow-md rounded-lg p-6 pt-0">
      {/* Order Status Tabs */}
      <div className="col-span-12 flex mb-3 justify-end gap-2">
        <Button
          size="sm"
          color="primary"
          type="button"
          onClick={() => navigate(routes.dashboard.sliders.create)}
        >
          <AddIcon />
          Create Slider
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative col-span-1">
          <input
            type="text"
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-md pl-10 py-2 text-sm h-14"
            placeholder="Search by name"
            onChange={handleSearch}
            defaultValue={params?.searchKey}
          />
          <div className="absolute top-4 left-3 text-gray-500">🔍</div>
        </div>
      </div>

      {/* Filter Button */}
      <div className="flex justify-end mt-2">
        <Button
          color="primary"
          variant="outline"
          size="md"
          onClick={handleClickFilter}
        >
          Filter
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
