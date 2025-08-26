import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";

import dayjs from "dayjs";
import DateRangePickerComponent from "@app/ui/DateRangePicker/DateRangePicker";
import {
  IParamsUrl,
  orderStatusOptions,
  paymentMethodOptions,
} from "@app/lib/types/orders";
import { Button } from "@app/ui";
import { twMerge } from "tailwind-merge";
import { GlobalService, OrderService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import useFilterReducer from "../../hooks/use-filter-reducer";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Icon } from "@app/ui/Icon";

const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: IParamsUrl & { appVersionFilter?: string };
  setParams: any;
  isOrder?: boolean;
}> = ({ params, setParams, handleConfirmFilter, isOrder = true }) => {
  const toast = useToast();
  const { state, dispatch } = useFilterReducer();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // Local state to track changes without immediate API calls
  const [localParams, setLocalParams] = useState(params);

  // Update local state when parent params change
  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  // get list of order filters
  const fetchFilters = async () => {
    try {
      const [citiesResponse, storesResponse, statusResponse] =
        await Promise.all([
          GlobalService.getAllCities(),
          GlobalService.getAllStores(),
          OrderService.getBreakDownStatus({ storeId: params.storeId }),
        ]);
      dispatch({ type: "SET_CITIES_LIST", payload: citiesResponse.data });
      dispatch({ type: "SET_STORES_LIST", payload: storesResponse.data });
      dispatch({ type: "SET_ORDER_COUNTS", payload: statusResponse.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      dispatch({ type: "SET_IS_LOADER_OPEN", payload: false });
    }
  };

  const applyFilters = () => {
    const queryString = convertObjectIntoQueryParams(localParams);
    navigate({ search: queryString });
    setParams(localParams);
    if (handleConfirmFilter) {
      handleConfirmFilter(localParams);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setLocalParams((prev) => ({ ...prev, searchKey: searchValue, pageNumber: 1 }));
  };

  useEffect(() => {
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderStatus = async (storeId: number) => {
    try {
      const statusResponse = await OrderService.getBreakDownStatus({
        storeId: storeId,
      });
      dispatch({ type: "SET_ORDER_COUNTS", payload: statusResponse.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    }
  };

  const handleSelect = (field: string, value: any) => {
    const updatedParams = { ...localParams, [field]: value };
    setLocalParams(updatedParams);

    // For status changes, apply filters immediately
    if (field === "status") {
      setParams(updatedParams);
    }

    // Only update store information for count displays without triggering a search
    if (field === "storeId") {
      fetchOrderStatus(value);
    }
    navigate({ search: convertObjectIntoQueryParams(updatedParams) });
  };

  const handleDateRange = (item: any) => {
    setDateRange(item?.selection);
  };

  const handleApplyDateRange = () => {
    const formattedStartDate = formatToLocalTime(
      dateRange?.startDate || new Date()
    );
    const formattedEndDate = formatToLocalTime(
      dateRange?.endDate || new Date()
    );

    setLocalParams((prev) => ({
      ...prev,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }));

    setShowDatePicker(false);
  };

  const orderStatusOptionsFormated = useMemo(
    () =>
      [
        ...orderStatusOptions,
        {
          id: -1,
          label: "Any",
          value: -1,
          colorClass: "bg-orange-500 text-white",
          tag: "Any",
        },
      ].map((item) => ({
        label: item.label,
        value: item.id,
        count: item?.tag ? state?.orderCounts?.[item?.tag] : 0,
        id: item.id,
      })),

    [state?.orderCounts]
  );

  const handleClearDate = () => {
    setDateRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });

    setLocalParams((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };

  const handleClearAllFilters = () => {
    const defaultParams = {
      status: localParams.status,
      searchKey: "",
      paymentMethod: undefined,
      pageNumber: 1,
      pageSize: params.pageSize,

      storeId: localParams.storeId,
      ...(localParams.appVersionFilter ? { appVersionFilter: "Any" } : {}),
      startDate: null,
      endDate: null,
    };

    setLocalParams(defaultParams);
    setParams(defaultParams);
    navigate({ search: convertObjectIntoQueryParams(defaultParams) });

    if (handleConfirmFilter) {
      handleConfirmFilter(defaultParams);
    }

    toast.success("Filters cleared except store and status");
  };

  return (
    <>
      {/* Store Selection with improved UI - more compact version */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Icon icon="lucide:store" className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-700 text-base">Stores</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={twMerge(
              "relative group px-4 py-2 rounded-md text-base font-medium border transition-all duration-200",
              localParams.storeId === null
                ? "bg-primary text-white border-primary"
                : "bg-white border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5"
            )}
            onClick={() => handleSelect("storeId", "")}
            aria-pressed={localParams.storeId === null}
          >
            <div className="flex items-center gap-2">
              <Icon
                icon="lucide:layout-grid"
                className={twMerge(
                  "w-5 h-5",
                  localParams.storeId === null ? "text-white" : "text-primary"
                )}
              />
              <span>All Stores</span>
            </div>
          </button>
          {state.storesList.map((item) => (
            <button
              key={item.id}
              className={twMerge(
                "relative group px-4 py-2 rounded-md text-base font-medium border transition-all duration-200",
                localParams.storeId == item.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5"
              )}
              onClick={() => handleSelect("storeId", item.id)}
              aria-pressed={localParams.storeId === item.id}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:shopping-bag"
                  className={twMerge(
                    "w-5 h-5",
                    localParams.storeId == item.id
                      ? "text-white"
                      : "text-primary"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-100 shadow-md rounded-lg p-5">
        {/* Order Status Tabs with improved UI - more compact version */}
        {isOrder && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Icon
                  icon="lucide:list-filter"
                  className="w-5 h-5 text-primary"
                />
                <h3 className="font-semibold text-gray-700 text-base">
                  Order Status
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {orderStatusOptionsFormated.map((item) => {
                // Define status-specific colors
                const statusColors: Record<
                  number,
                  {
                    bg: string;
                    bgActive: string;
                    textActive: string;
                    icon: string;
                  }
                > = {
                  1: {
                    bg: "bg-blue-50",
                    bgActive: "bg-blue-600",
                    textActive: "text-blue-600",
                    icon: "lucide:clipboard-check",
                  }, // Placed
                  2: {
                    bg: "bg-indigo-50",
                    bgActive: "bg-indigo-600",
                    textActive: "text-indigo-600",
                    icon: "lucide:package-search",
                  }, // Being Picked
                  3: {
                    bg: "bg-purple-50",
                    bgActive: "bg-purple-600",
                    textActive: "text-purple-600",
                    icon: "lucide:package-check",
                  }, // Picked
                  4: {
                    bg: "bg-teal-50",
                    bgActive: "bg-teal-600",
                    textActive: "text-teal-600",
                    icon: "lucide:truck",
                  }, // On The Way
                  5: {
                    bg: "bg-green-50",
                    bgActive: "bg-green-600",
                    textActive: "text-green-600",
                    icon: "lucide:check-circle",
                  }, // Delivered
                  6: {
                    bg: "bg-red-50",
                    bgActive: "bg-red-600",
                    textActive: "text-red-600",
                    icon: "lucide:x-circle",
                  }, // Canceled
                  7: {
                    bg: "bg-orange-50",
                    bgActive: "bg-orange-600",
                    textActive: "text-orange-600",
                    icon: "lucide:alert-triangle",
                  }, // Other
                };

                const defaultColors = {
                  bg: "bg-gray-50",
                  bgActive: "bg-gray-600",
                  textActive: "text-gray-600",
                  icon: "lucide:help-circle",
                };
                const colors = statusColors[item.id] || defaultColors;

                return (
                  <button
                    key={item.id}
                    className={twMerge(
                      "relative px-4 py-2 rounded-md text-base font-medium border transition-all duration-200",
                      Number(localParams.status?.[0]) == item.id
                        ? `${colors.bgActive} text-white border-transparent`
                        : `${colors.bg} border-gray-200 ${colors.textActive} hover:bg-opacity-80`
                    )}
                    onClick={() => handleSelect("status", item.id)}
                    aria-pressed={Number(localParams.status?.[0]) === item.id}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={colors.icon}
                        className={twMerge(
                          "w-5 h-5",
                          Number(localParams.status?.[0]) == item.id
                            ? "text-white"
                            : colors.textActive
                        )}
                      />
                      <span>{item.label}</span>
                      {item.count ? (
                        <span
                          className={twMerge(
                            "inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full text-sm font-medium px-1",
                            Number(localParams.status?.[0]) == item.id
                              ? "bg-white/25 text-white"
                              : "bg-white text-gray-700 border border-gray-200"
                          )}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Improved Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div className="relative">
            <label
              htmlFor="search-orders"
              className="block text-sm font-medium text-gray-600 mb-1 ml-1"
            >
              Search Orders
            </label>
            <div className="group">
              <input
                id="search-orders"
                type="text"
                className="w-full border border-gray-300 rounded-md pl-10 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search orders by ID or name"
                onChange={handleSearch}
                value={localParams.searchKey || ""}
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
              {localParams.searchKey && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => {
                    const updatedParams = { ...localParams, searchKey: "" };
                    setLocalParams(updatedParams);
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
          {/* Payment Method Filter */}
          <div className="relative">
            <label
              htmlFor="payment-method"
              className="block text-sm font-medium text-gray-600 mb-1 ml-1"
            >
              Payment Method
            </label>
            <div className="relative">
              <select
                id="payment-method"
                className="w-full border border-gray-300 rounded-md py-3 px-4 text-base appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={localParams.paymentMethod ?? ""}
                onChange={(e) => handleSelect("paymentMethod", e.target.value)}
              >
                <option value="">All Payment Methods</option>
                {paymentMethodOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                <Icon icon="lucide:chevron-down" className="w-5 h-5" />
              </div>
            </div>
          </div>
          {/* Date Picker */}
          <div className="relative">
            <label
              htmlFor="date-range"
              className="block text-sm font-medium text-gray-600 mb-1 ml-1"
            >
              Date Range
            </label>
            <div
              id="date-range"
              className="w-full border border-gray-300 rounded-md py-3 px-4 text-base cursor-pointer bg-base-100 flex items-center focus:border-primary hover:border-primary transition-all"
              onClick={() => setShowDatePicker((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowDatePicker((prev) => !prev);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <Icon
                icon="lucide:calendar"
                className="w-5 h-5 mr-2 text-gray-500"
              />
              <span className="truncate">
                {localParams.startDate && localParams.endDate
                  ? `${dayjs(dateRange?.startDate)?.format(
                      "DD MMM YYYY"
                    )} - ${dayjs(dateRange?.endDate)?.format("DD MMM YYYY")}`
                  : "Select Date Range"}
              </span>
              <Icon
                icon={
                  showDatePicker ? "lucide:chevron-up" : "lucide:chevron-down"
                }
                className="w-5 h-5 ml-auto text-gray-500"
              />
            </div>
            {showDatePicker && (
              <DateRangePickerComponent
                setShowDatePicker={setShowDatePicker}
                handleDateRangeChange={handleDateRange}
                handleApplyDateRange={handleApplyDateRange}
                dateRange={dateRange}
                setInit={() => console.log("Init cleared")}
                setVal={handleClearDate}
              />
            )}
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

            <Button
              color="success"
              variant="outline"
              size="md"
              onClick={() => fetchFilters()}
              className="flex items-center gap-2"
            >
              <Icon icon="lucide:refresh-cw" className="w-5 h-5" />
              Refresh Counts
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSection;
