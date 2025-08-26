import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";

import { IParamsUrl } from "@app/lib/types/invnentory";
import { Button } from "@app/ui";
import { GlobalService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";

enum InventoryQueryStatus {
  All = 0,
  Active,
  Inactive,
}

const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: IParamsUrl;
  setParams: any;
}> = ({ params, setParams }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [storesList, setStoreList] = useState<any[]>([]);

  // get list of order filters
  const fetchFilters = async () => {
    try {
      const res = await GlobalService.getAllStores();
      setStoreList(res?.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, searchKey: e.target.value, pageNumber: 1 });
  };
  useEffect(() => {
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelect = async (field: string, value: any) => {
    setParams({ ...params, [field]: value });
  };

  const handleClickFilter = () => {
    const queryString = convertObjectIntoQueryParams(params);
    navigate({ search: queryString });
  };

  return (
    <div className="bg-base-100 shadow-md rounded-lg p-6 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative col-span-1">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md pl-10 py-2 text-sm"
            placeholder="Search by ID, name"
            onChange={handleSearch}
            defaultValue={params?.searchKey}
          />
          <div className="absolute top-2.5 left-3 text-gray-500">🔍</div>
        </div>

        {/* Store Filter */}
        <div>
          <select
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            value={params.storeId}
            onChange={(e) => handleSelect("storeId", e.target.value)}
          >
            <option value="">All Stores</option>
            {storesList?.map((item) => (
              <option key={item?.id} value={item?.id}>
                {item?.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            value={params.status}
            onChange={(e) => handleSelect("status", e.target.value)}
          >
            <option value={InventoryQueryStatus.All}>All Status</option>
            <option value={InventoryQueryStatus.Active}>Active</option>
            <option value={InventoryQueryStatus.Inactive}>Inactive</option>
          </select>
        </div>

        {/* Quantity Less Than Filter */}
        <div>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            placeholder="Quantity less than"
            onChange={(e) => handleSelect("quantityLessThan", e.target?.value)}
            value={params?.quantityLessThan || ""}
          />
        </div>
      </div>

      {/* Filter Button */}
      <div className="flex justify-end mt-4">
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
