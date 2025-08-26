import React, { useContext, useState, useEffect } from "react";
import { Card, Divider } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  convertQueryParamsIntoObject,
  convertObjectIntoQueryParams,
} from "@app/lib/helpers/constants/helpers";
import { useTranslator } from "@app/lib/hooks/useTranslator";
import { PaginationResponse } from "@app/lib/types/global";
import { DataGridTable } from "@app/ui/Datagrid";
import DataGridHeader from "@app/ui/Datagrid/DataGridHeader";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import { routes } from "@app/lib/routes";
import { TimeSlot } from "@app/lib/types/timeSlots";
import TimeSlotService from "@app/services/actions/TimeSlotService";
import { PageTitle } from "@app/ui/PageTitle";
import { CardBody } from "@app/ui";

interface TimeSlotsPageProps {}

const TimeSlotsPage: React.FC<TimeSlotsPageProps> = () => {
  const toast = useToast();
  const [dataList, setDataList] = useState<PaginationResponse<TimeSlot[]>[]>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const location = useLocation();
  const { __T } = useTranslator();
  const [params, setParams] = useState<{ searchKey: string; page: number }>({
    searchKey: "",
    page: 1,
  });
  const navigate = useNavigate();

  let debounceTimer: ReturnType<typeof setTimeout>;
  //columns
  const columns = [
    {
      title: "Name",
      field: "title",
    },

    {
      title: "From Time",
      render: (rowData: TimeSlot) => {
        return <>{rowData?.fromTime}</>;
      },
    },
    {
      title: "End Date",
      render: (rowData: TimeSlot) => {
        return <>{rowData?.toTime}</>;
      },
    },
    {
      title: "Is Active",
      render: (rowData: TimeSlot) => {
        return <>{rowData?.isActive ? "🟢" : "🔴"}</>;
      },
    },
  ];
  const fetchData = async (params: any) => {
    setIsLoaderOpen(true);
    try {
      const res = await TimeSlotService.getTimeSlotList(params);

      setDataList(res?.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ?? "Failed to get Time slots list"
      );
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    const queryParams = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;
    fetchData(queryParams);
  }, [location, params]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchKey = e.target.value || "";
      const updatedParams = { ...params, searchKey, pageNumber: 1 };
      const queryString = convertObjectIntoQueryParams(updatedParams);
      navigate({
        // pathname: getTimeSlotsPageUrl(locale),
        search: queryString,
      });
      setParams(updatedParams);
    }, 1000);
  };

  const handleOnRowClick = (_evt: any, rowData: TimeSlot) => {
    navigate(routes.dashboard.timeSlots.edit(rowData?.id));
  };

  // const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
  //     const updatedParams = { ...params, page: value };
  //     const queryString = convertObjectIntoQueryParams(updatedParams);
  //     navigate({
  //         pathname: getTimeSlotsPageUrl(locale),
  //         search: queryString,
  //     });
  //     setParams(updatedParams);
  //     document.documentElement.scrollTop = 0;
  // };

  return (
    <>
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Time Slots"
            breadCrumbItems={[{ label: "Time Slots", active: true }]}
          />
        </div>
      </div>
      <Card>
        <CardBody className="bg-base-100">
          <DataGridHeader
            title={__T("Time Slots")}
            handleSearch={handleSearch}
            btnTitle={__T("Add Time Slot")}
            handleClick={() => navigate(routes.dashboard.timeSlots.create)}
          />

          {isLoaderOpen ? (
            <SectionLoader />
          ) : (
            <>
              <DataGridTable
                data={dataList || []}
                columns={columns}
                onRowClick={handleOnRowClick}
              />
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default TimeSlotsPage;
