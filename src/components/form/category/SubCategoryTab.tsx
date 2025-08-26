import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import { IParamsUrl, Category } from "@app/lib/types/category";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PaginationResponse } from "@app/lib/types/global";
import { CategoryService } from "@app/services/actions";
import { Button } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { twMerge } from "tailwind-merge";
import { routes } from "@app/lib/routes";
import PenIcon from "@iconify/icons-lucide/pen";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
type SubCategoryPrams = IParamsUrl & {
  tab: string;
};
const SubCategoryTab = ({ id }: { id: number }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataList, setDataList] = useState<PaginationResponse<Category[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const toast = useToast();
  const [params, setParams] = useState<SubCategoryPrams>({
    searchKey: "",
    pageNumber: 1,
    pageSize: 50,
    parentCategoryId: id,
    tab: "",
  });
  const fetchData = async (params: IParamsUrl) => {
    setIsLoaderOpen(true);
    try {
      const res = await CategoryService.getCategories(params);
      setDataList(res?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  const columns = [
    {
      title: "ID",
      field: "id",
      editable: "never",
    },
    {
      title: "Name",
      field: "title",
      editable: "onUpdate",
    },
    {
      title: "Name (Arabic)",
      field: "titleAr",
      editable: "onUpdate",
    },
    {
      title: "Sort ID",
      field: "sort",
      editable: "onUpdate",
    },
    {
      title: "Relation",
      render: (rowData: Category) => {
        return (
          <div className="font-medium text-sm">
            {rowData.parentCategoryId ? "Sub Category" : "Parent"}
          </div>
        );
      },
    },

    {
      title: "Actions",
      render: (rowData: Category) => (
        <div className="flex space-x-2">
          <Button
            onClick={() =>
              navigate(routes.dashboard.categories.show(rowData?.id))
            }
            color="primary"
            title="Edit Category"
            size="sm"
          >
            <Icon icon={PenIcon} />
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const queryParams: any = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: SubCategoryPrams = {
      tab: queryParams?.tab || "",
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      pageSize: Number(queryParams?.pageSize) || 50,
      type: queryParams?.type || "",
      parentCategoryId: id,
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <div>
      {/* Tab Selection */}

      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <DataGridTable
            data={dataList?.data || []}
            columns={columns}
            options={{ actionsColumnIndex: -1 }}
          />
          <Pagination
            pageCount={dataList?.totalPages}
            pageNumber={dataList?.pageNumber}
            pageSize={params.pageSize}
            setParams={setParams}
            params={params}
          />
        </>
      )}
    </div>
  );
};

export default SubCategoryTab;
