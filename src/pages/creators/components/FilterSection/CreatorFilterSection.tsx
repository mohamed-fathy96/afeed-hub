import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";
import { Button } from "@app/ui";
import { twMerge } from "tailwind-merge";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Icon } from "@app/ui/Icon";
import { IParamsUrl } from "@app/lib/types/creators";

const CreatorFilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: IParamsUrl;
  setParams: any;
}> = ({ params, setParams, handleConfirmFilter }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const applyFilters = () => {
    const queryString = convertObjectIntoQueryParams(params);
    navigate({ search: queryString });
    setParams(params);
    if (handleConfirmFilter) {
      handleConfirmFilter(params);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setParams((prev: IParamsUrl) => ({
      ...prev,
      searchKey: searchValue,
      page: 1,
    }));
  };

  const handleSelect = (field: string, value: any) => {
    const updatedParams = { ...params, [field]: value, page: 1 };
    setParams(updatedParams);
    navigate({ search: convertObjectIntoQueryParams(updatedParams) });
  };

  const handleClearAllFilters = () => {
    const defaultParams: IParamsUrl = {
      searchKey: "",
      page: 1,
      limit: params.limit,
      tier: "",
      status: "",
    };

    setParams(defaultParams);
    navigate({ search: convertObjectIntoQueryParams(defaultParams) });

    if (handleConfirmFilter) {
      handleConfirmFilter(defaultParams);
    }

    toast.success("All filters cleared");
  };

  // Creator tier options
  const tierOptions = [
    {
      id: "",
      label: "All Tiers",
      value: "",
      icon: "lucide:layers",
      colorClass: "bg-gray-100 text-gray-800",
    },
    {
      id: "Free",
      label: "Free",
      value: "Free",
      icon: "lucide:gift",
      colorClass: "bg-gray-100 text-gray-800",
    },
    {
      id: "Basic",
      label: "Basic",
      value: "Basic",
      icon: "lucide:star",
      colorClass: "bg-blue-100 text-blue-800",
    },
    {
      id: "Premium",
      label: "Premium",
      value: "Premium",
      icon: "lucide:crown",
      colorClass: "bg-purple-100 text-purple-800",
    },
  ];

  // Creator status options
  const statusOptions = [
    {
      id: "",
      label: "All Status",
      value: "",
      icon: "lucide:users",
      colorClass: "bg-gray-100 text-gray-800",
    },
    {
      id: "A",
      label: "Active",
      value: "A",
      icon: "lucide:check-circle",
      colorClass: "bg-green-100 text-green-800",
    },
    {
      id: "I",
      label: "Inactive",
      value: "I",
      icon: "lucide:x-circle",
      colorClass: "bg-red-100 text-red-800",
    },
    {
      id: "D",
      label: "Deleted",
      value: "D",
      icon: "lucide:trash-2",
      colorClass: "bg-red-100 text-red-800",
    },
    {
      id: "B",
      label: "Blocked",
      value: "B",
      icon: "lucide:ban",
      colorClass: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="bg-base-100 shadow-md rounded-lg p-5">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search Input */}
        <div className="relative">
          <label
            htmlFor="search-creators"
            className="block text-sm font-medium text-gray-600 mb-1 ml-1"
          >
            Search Creators
          </label>
          <div className="group">
            <input
              id="search-creators"
              type="text"
              className="w-full border border-gray-300 rounded-md pl-10 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search by name, email, or service"
              onChange={handleSearch}
              value={params.searchKey || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyFilters();
                }
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Icon icon="lucide:search" className="w-5 h-5" />
            </div>
            {params.searchKey && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => {
                  const updatedParams = { ...params, searchKey: "" };
                  setParams(updatedParams);
                  navigate({
                    search: convertObjectIntoQueryParams(updatedParams),
                  });
                  if (handleConfirmFilter) {
                    handleConfirmFilter(updatedParams);
                  }
                }}
                aria-label="Clear search"
              >
                <Icon icon="lucide:x-circle" className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1 ml-1">
            Press Enter to search
          </div>
        </div>
      </div>
      {/* Creator Status Tabs */}
      <div className="flex gap-4 justify-between flex-wrap">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:user-check" className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-700 text-base">
                Creator Status
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((item) => (
              <button
                key={item.id}
                className={twMerge(
                  "relative px-4 py-2 rounded-md text-base font-medium border transition-all duration-200",
                  params.status === item.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5"
                )}
                onClick={() => handleSelect("status", item.value)}
                aria-pressed={params.status === item.value}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon={item.icon}
                    className={twMerge(
                      "w-4 h-4",
                      params.status === item.value
                        ? "text-white"
                        : "text-primary"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Creator Tier Tabs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:layers" className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-700 text-base">
                Creator Tier
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tierOptions.map((item) => (
              <button
                key={item.id}
                className={twMerge(
                  "relative px-4 py-2 rounded-md text-base font-medium border transition-all duration-200",
                  params.tier === item.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5"
                )}
                onClick={() => handleSelect("tier", item.value)}
                aria-pressed={params.tier === item.value}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon={item.icon}
                    className={twMerge(
                      "w-4 h-4",
                      params.tier === item.value ? "text-white" : "text-primary"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          color="ghost"
          variant="outline"
          size="md"
          onClick={handleClearAllFilters}
          className="flex items-center gap-2 border border-gray-300"
        >
          <Icon icon="lucide:x" className="w-5 h-5" />
          Clear All Filters
        </Button>

        <div className="flex gap-3">
          <Button
            color="primary"
            size="md"
            onClick={applyFilters}
            className="flex items-center gap-2 min-w-[140px]"
          >
            <Icon icon="lucide:filter" className="w-5 h-5" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorFilterSection;
