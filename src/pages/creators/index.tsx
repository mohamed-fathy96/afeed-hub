import React, { useState, useEffect } from "react";
import {
  convertObjectIntoQueryParams,
  convertQueryParamsIntoObject,
} from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import Pagination from "@app/ui/Datagrid/Pagination";
import { PageTitle } from "@app/ui/PageTitle";
import CreatorFilterSection from "./components/FilterSection/CreatorFilterSection";

// Define Creator interface based on your data structure
interface Creator {
  _id: string;
  full_name: string;
  profile_pic: string;
  service: string;
  tier: "Free" | "Basic" | "Premium";
  phone_number: string;
  email: string;
  status: "A" | "I";
  statusLabel: "Active" | "Inactive";
  created_at: string;
  tableData?: {
    id: number;
  };
}

import { CreatorService } from "@app/services/actions";
import { Button } from "@app/ui";
import { twMerge } from "tailwind-merge";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { Icon } from "@app/ui/Icon";
import DownloadIcon from "@iconify/icons-lucide/download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { routes } from "@app/lib/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { IParamsUrl } from "@app/lib/types/creators";

const CreatorsPage: React.FC = () => {
  const [dataList, setDataList] = useState<PaginationResponse<Creator[]>>();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useState<IParamsUrl>({
    searchKey: "",
    page: 1,
    limit: 50,
    tier: "",
    status: "",
  });

  useEffect(() => {
    const queryParams: Partial<IParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : {};

    const updatedParams: IParamsUrl = {
      ...params,
      page: Number(queryParams?.page) || 1,
      searchKey: queryParams?.searchKey || "",
      status: queryParams?.status ? queryParams.status : "",
      tier: queryParams?.tier ? queryParams.tier : "",
    };

    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchData = async (query: IParamsUrl) => {
    setIsLoaderOpen(true);
    try {
      const res = await CreatorService.getCreators(query);

      setDataList(res?.data?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get creator list");
    } finally {
      setIsLoaderOpen(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataList?.items || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(dataBlob, "creators.xlsx");
  };

  const columns = [
    {
      title: "Creator ID",
      render: (rowData: Creator) => (
        <div className="flex items-center gap-2">
          <a
            target="_blank"
            href={routes.dashboard.creators.edit(rowData._id)}
            className="text-primary hover:text-primary-focus"
            rel="noreferrer"
          >
            {rowData._id}
          </a>
          <button
            className="text-primary hover:text-primary-focus"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(rowData._id);
              toast.success("Creator ID copied to clipboard");
            }}
          >
            <Icon icon="lucide:copy" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      title: "Profile",
      render: (row: Creator) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              {row.profile_pic ? (
                <img
                  src={row.profile_pic}
                  alt={row.full_name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                  <Icon icon="lucide:user" className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.full_name || "N/A"}</span>
            <span className="text-sm text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Service",
      render: (row: Creator) => (
        <div className="bg-blue-50 border-l-2 border-blue-300 px-3 py-2 rounded">
          <span className="font-medium">{row.service || "No Service"}</span>
        </div>
      ),
    },
    {
      title: "Tier",
      render: (rowData: Creator) => {
        const tierColors = {
          Free: "bg-gray-100 text-gray-800 border-gray-300",
          Basic: "bg-blue-100 text-blue-800 border-blue-300",
          Premium: "bg-purple-100 text-purple-800 border-purple-300",
        };

        const tierIcons = {
          Free: "lucide:gift",
          Basic: "lucide:star",
          Premium: "lucide:crown",
        };

        return (
          <div
            className={twMerge(
              "flex items-center gap-1 px-3 py-2 rounded text-xs font-medium justify-center border",
              tierColors[rowData.tier] || "bg-gray-100"
            )}
          >
            <Icon icon={tierIcons[rowData.tier]} className="w-4 h-4" />
            <span>{rowData.tier}</span>
          </div>
        );
      },
    },
    {
      title: "Contact",
      render: (row: Creator) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.phone_number}</span>
          <span className="text-sm text-gray-500">{row.email}</span>
        </div>
      ),
    },
    {
      title: "Status",
      render: (rowData: Creator) => {
        const isActive = rowData.status === "A";
        return (
          <div
            className={twMerge(
              "flex items-center gap-1 px-3 py-2 rounded text-xs font-medium justify-center",
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            <Icon
              icon={isActive ? "lucide:check-circle" : "lucide:x-circle"}
              className="w-4 h-4"
            />
            <span>{rowData.statusLabel}</span>
          </div>
        );
      },
    },
    {
      title: "Created At",
      render: (row: Creator) => formatToLocalTime(row.created_at),
    },
    {
      title: "Actions",
      cellStyle: { minWidth: 200 },
      render: (row: Creator) => (
        <div className="flex gap-2 flex-col">
          <Button size="sm" color="primary" className="p-0">
            <a
              href={routes.dashboard.creators.edit(row?._id)}
              className="underline w-full text-center p-2"
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col mb-6">
        <PageTitle
          title="Creators"
          breadCrumbItems={[{ label: "Creators", active: true }]}
        />
      </div>

      <div className="mx-auto bg-base-100 shadow-md rounded-lg p-6 space-y-4">
        <CreatorFilterSection
          handleConfirmFilter={fetchData}
          params={params}
          setParams={setParams}
        />
        {isLoaderOpen ? (
          <SectionLoader />
        ) : (
          <>
            <div className="flex justify-end">
              <Button onClick={exportToExcel} color="primary" size="sm">
                <Icon icon={DownloadIcon} /> Export to Excel
              </Button>
            </div>
            {dataList?.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Icon
                  icon="lucide:inbox"
                  className="w-16 h-16 text-gray-300 mb-4"
                />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No Creators Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try changing your filters or search criteria
                </p>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    const newParams: IParamsUrl = {
                      searchKey: "",
                      page: 1,
                      limit: 50,
                      tier: "",
                      status: "",
                    };
                    setParams(newParams);
                    navigate({
                      search: convertObjectIntoQueryParams(newParams),
                    });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <DataGridTable
                data={dataList?.items || []}
                columns={columns}
                options={{ actionsColumnIndex: -1 }}
              />
            )}
            <Pagination
              pageCount={Math.ceil((dataList?.total || 0) / (dataList?.limit || 1))}
              page={dataList?.page || 1}
              limit={(dataList?.limit as number) || 50}
              setParams={setParams}
              params={params}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CreatorsPage;
