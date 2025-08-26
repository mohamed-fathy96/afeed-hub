import React from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";
import { Button, Card, CardBody } from "@app/ui";
import { IParamsUrl } from "@app/lib/types/coupons";
import { routes } from "@app/lib/routes";
import AddIcon from "@mui/icons-material/Add";
import { Icon } from "@app/ui/Icon";

const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: IParamsUrl;
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

  return (
    <Card className="bg-base-100 shadow-md">
      <CardBody>
        {/* Order Status Tabs */}
        <div className="col-span-12 flex mb-3 justify-between">
          <div className="flex items-center gap-1.5">
            <Icon icon="lucide:ticket" className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-700 text-base">
              Coupons Management
            </h3>
          </div>
          <Button
            color="primary"
            onClick={() => navigate(routes.dashboard.coupons.create)}
          >
            <AddIcon />
            Create Coupon
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative col-span-1">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md pl-10 py-2 text-sm h-14"
              placeholder="Search by name"
              onChange={handleSearch}
              defaultValue={params?.searchKey}
            />
            <div className="absolute top-4 left-3 text-gray-500">🔍</div>
          </div>
          {/* add is expired */}
          <div className="col-span-1">
            <select
              className="w-full border border-gray-300 rounded-md pl-2 py-2 text-sm h-14"
              onChange={(e) =>
                setParams({ ...params, isExpired: e?.target?.value })
              }
              value={params?.isExpired || ""}
            >
              <option value="">All</option>
              <option value="true">Expired</option>
              <option value="false">Not Expired</option>
            </select>
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            color="ghost"
            variant="outline"
            size="md"
            onClick={() => {
              setParams({});
              navigate({ search: "" });
            }}
          >
            <Icon icon="lucide:x" />
            Clear Filter
          </Button>
          <Button
            color="primary"
            variant="outline"
            size="md"
            onClick={handleClickFilter}
          >
            <Icon icon="lucide:filter" />
            Apply Filter
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default FilterSection;
