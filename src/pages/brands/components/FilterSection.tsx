import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";
import { Button, Card, CardBody, Drawer } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { BrandService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { routes } from "@app/lib/routes";
import { ParamsUrl } from "@app/lib/types/product";
import xIcon from "@iconify/icons-lucide/x";
import PlusIcon from "@iconify/icons-lucide/plus";

import BrandDetailsForm from "@app/components/brand/BrandDetailsForm";
const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: ParamsUrl;
  setParams: any;
}> = ({ params, setParams }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [createBrandModal, setCreateBrandModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, searchKey: e.target.value, pageNumber: 1 });
  };

  const handleClickFilter = () => {
    const queryString = convertObjectIntoQueryParams(params);
    navigate({ search: queryString });
  };

  const submitForm = async (values: any) => {
    setIsLoading(true);
    try {
      const res = await BrandService.createBrand(values);
      if (res?.data?.id) {
        toast.success(res?.data?.message ?? "Brand Created successfully");
        navigate(routes.dashboard.brands.edit(res?.data?.id));
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message ?? "Failed to Create Brand");
    }
  };

  return (
    <Card className="bg-base-100 shadow-md">
      <CardBody>
        {/* Order Status Tabs */}
        <div className="col-span-12 flex mb-3 justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon icon="lucide:image" className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-700 text-base">
              Brands Management
            </h3>
          </div>
          <Button
            size="md"
            color="primary"
            type="button"
            onClick={() => setCreateBrandModal(true)}
          >
            <Icon icon={PlusIcon} />
            Create Brand
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
        <Drawer
          open={createBrandModal}
          end
          onClickOverlay={() => setCreateBrandModal(false)}
          sideClassName="z-[100]"
          side={
            <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto m-3 max-w-sm w-full">
              <div className="bg-[#EDF0FE] p-4">
                <Button
                  size="sm"
                  type="button"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close Drawer"
                  onClick={() => {
                    setCreateBrandModal(false);
                  }}
                >
                  <Icon icon={xIcon} />
                </Button>
                <h4 className="font-bold ">Create Brand</h4>
              </div>
              <div>
                <BrandDetailsForm
                  onSubmit={submitForm}
                  isLoading={isLoading}
                  setOpen={setCreateBrandModal}
                />
              </div>
            </Card>
          }
        />
      </CardBody>
    </Card>
  );
};

export default FilterSection;
