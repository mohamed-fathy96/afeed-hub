import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";
import { Button, Drawer, Card, CardBody } from "@app/ui";
import { IParamsUrl } from "@app/lib/types/category";
import { useAppDispatch } from "@app/lib/hooks/useStore";
import { setCategoryList } from "@app/store/category/CategorySlice";
import { routes } from "@app/lib/routes";
import { Icon } from "@app/ui/Icon";
import ReorderableTable from "@app/ui/ReorderableTable";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@app/services/actions/CategoryService";
import { useToast } from "@app/helpers/hooks/use-toast";

const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: IParamsUrl;
  setParams: any;
}> = ({ params, setParams }) => {
  const [isReorderDrawerOpen, setIsReorderDrawerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: lightCategories, isLoading } = useQuery<{
    data: { id: string; name: string }[];
  }>({
    queryKey: ["lightCategories"],
    queryFn: () => CategoryService.getLightList(),
    enabled: isReorderDrawerOpen,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, searchKey: e.target.value, pageNumber: 1 });
  };

  const handleClickFilter = () => {
    const queryString = convertObjectIntoQueryParams(params);
    navigate({ search: queryString });
  };
  React.useEffect(() => {
    dispatch(setCategoryList({ type: Number(params?.type || 1) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.type]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      handleClickFilter();
    }
  };
  const handleRowReorder = async (newData: any[]) => {
    try {
      const categoryIds = newData.map((item) => item.id);

      const response = await CategoryService.reorderCategories({
        sortArray: categoryIds,
      });
      if (response) {
        toast.success("Categories reordered successfully");
      }
    } catch (error) {
      console.error("Failed to reorder categories:", error);
    }
  };
  const columns = [
    {
      id: "move",
      render: () => <Icon icon="lucide:arrow-up-down" />,
      title: "Move",
    },
    {
      id: "id",
      title: "ID",
    },
    {
      id: "name",
      title: "name",
    },
  ];
  return (
    <Card className="bg-base-100 shadow-md">
      <CardBody>
        {/* Order Status Tabs */}
        <div className="col-span-12 flex mb-3 justify-between">
          <div className="flex items-center gap-1.5">
            <Icon
              icon="lucide:package-search"
              className="w-5 h-5 text-primary"
            />
            <h3 className="font-semibold text-gray-700 text-base">
              Categories Management
            </h3>
          </div>
          <div className="flex justify-between align-middle gap-2">
            <Button
              size="md"
              color="primary"
              variant="outline"
              onClick={() => setIsReorderDrawerOpen(true)}
            >
              <Icon icon="lucide:arrow-up-down" className="w-4 h-4 mr-2" />
              Reorder Categories
            </Button>
            <Button
              size="md"
              color="primary"
              onClick={() => navigate(routes.dashboard.categories.create)}
            >
              <Icon icon="lucide:plus" />
              Create Category
            </Button>
          </div>
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
            <Icon icon="lucide:filter" className="w-4 h-4" />
            Apply Filter
          </Button>
        </div>

        {/* Reorder Drawer */}
        <Drawer
          open={isReorderDrawerOpen}
          end
          onClickOverlay={() => setIsReorderDrawerOpen(false)}
          sideClassName={"z-[100]"}
          side={
            <Card className="rounded-t-lg min-h-full bg-base-100 border-none overflow-y-auto w-[90%] m-3">
              <div className="bg-[#EDF0FE] p-4">
                <Button
                  size="sm"
                  type="button"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close Drawer"
                  onClick={() => setIsReorderDrawerOpen(false)}
                >
                  <Icon icon="lucide:x" />
                </Button>
                <h4 className="font-bold text-base-content">
                  Reorder Categories
                </h4>
                <p className="text-sm text-gray-500">
                  Drag and drop to reorder the categories.
                </p>
              </div>
              <div className="p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Icon
                      icon="lucide:loader-circle"
                      className="w-8 h-8 animate-spin"
                    />
                  </div>
                ) : (
                  <ReorderableTable
                    columns={columns}
                    data={lightCategories?.data || []}
                    onRowReorder={handleRowReorder}
                  />
                )}
              </div>
            </Card>
          }
        />
      </CardBody>
    </Card>
  );
};

export default FilterSection;
