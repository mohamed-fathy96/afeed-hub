import React, { useState } from "react";
import { useNavigate } from "react-router";

//components
import { Checkbox, FormControlLabel } from "@mui/material";
//material ui

import { useFormik } from "formik";
import { useValidations } from "@app/lib/hooks/useValidation";
import { InputField } from "@app/ui/InputField";
import { Button } from "@app/ui/Button";
import * as yup from "yup";
import { TimeSlot } from "@app/lib/types/timeSlots";
import { DataGridTable } from "@app/ui/Datagrid";
import DataGridHeader from "@app/ui/Datagrid/DataGridHeader";
import TimeSlotService from "@app/services/actions/TimeSlotService";
import { routes } from "@app/lib/routes";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Card, CardBody, CheckboxCard } from "@app/ui";
interface TimeSlotsFormProps {
  timeSlotData?: TimeSlot;
  SlotId?: number | undefined;
}
interface WeekDay {
  id: number;
  nameEn: string;
  isActive: boolean;
}

export const TimeSlotsForm: React.FC<TimeSlotsFormProps> = ({
  timeSlotData,
  SlotId,
}) => {
  const weekDaysList: WeekDay[] = [
    {
      id: 1,
      nameEn: "Saturday",
      isActive: timeSlotData?.saturday || false,
    },
    {
      id: 2,
      nameEn: "Sunday",
      isActive: timeSlotData?.sunday || false,
    },
    {
      id: 3,
      nameEn: "Monday",
      isActive: timeSlotData?.monday || false,
    },
    {
      id: 4,
      nameEn: "Tuesday",
      isActive: timeSlotData?.tuesday || false,
    },
    {
      id: 5,
      nameEn: "Wednesday",
      isActive: timeSlotData?.wednesday || false,
    },
    {
      id: 6,
      nameEn: "Thursday",
      isActive: timeSlotData?.thursday || false,
    },
    {
      id: 7,
      nameEn: "Friday",
      isActive: timeSlotData?.friday || false,
    },
  ];

  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [weekDays, setWeekDays] = useState<WeekDay[]>(weekDaysList);
  const { validations } = useValidations();

  // default form values
  const defaultData = {
    title: timeSlotData?.title || "",
    capacity: timeSlotData?.capacity || 0,
    fromTime: timeSlotData?.fromTime || "",
    toTime: timeSlotData?.toTime || "",
    acceptFromTime: timeSlotData?.acceptFromTime || "",
    acceptToTime: timeSlotData?.acceptToTime || "",
    isActive: timeSlotData?.isActive || false,
    saturday: timeSlotData?.saturday || false,
    sunday: timeSlotData?.sunday || false,
    monday: timeSlotData?.monday || false,
    tuesday: timeSlotData?.tuesday || false,
    wednesday: timeSlotData?.wednesday || false,
    thursday: timeSlotData?.thursday || false,
    friday: timeSlotData?.friday || false,
  };

  // Validation schema for creation
  const validationSchema = yup.object().shape({
    title: validations.name,
    capacity: validations.number,
  });

  //handle submit form
  const handleSubmit = async () => {
    const weekPushedData = weekDays?.map((day) => {
      const { nameEn, isActive } = day;
      return {
        [nameEn]: isActive,
      };
    });
    const sentData = {
      title: formik.values.title,
      capacity: formik.values.capacity,
      fromTime: formik.values.fromTime,
      toTime: formik.values.toTime,
      acceptFromTime: formik.values.acceptFromTime,
      acceptToTime: formik.values.acceptToTime,
      isActive: formik.values.isActive,
      saturday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Saturday")
          ?.Saturday || false,
      sunday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Sunday")
          ?.Sunday || false,
      monday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Monday")
          ?.Monday || false,
      tuesday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Tuesday")
          ?.Tuesday || false,
      wednesday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Wednesday")
          ?.Wednesday || false,
      thursday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Thursday")
          ?.Thursday || false,
      friday:
        weekPushedData?.find((item) => Object.keys(item)[0] === "Friday")
          ?.Friday || false,
    };

    setIsLoading(true);
    if (SlotId) {
      try {
        const res = await TimeSlotService.updateTimeSlot(sentData, SlotId);
        toast.success(res?.data?.message ?? "Time slot updated successfully");
        navigate(routes.dashboard.timeSlots.index);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ?? "Failed to update time slot"
        );
      }
    } else {
      try {
        const res = await TimeSlotService.addNewTimeSlot(sentData);
        toast.success(res?.data?.message ?? "Time slot added successfully");
        navigate(routes.dashboard.timeSlots.index);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ?? "Failed to add new time slot"
        );
      }
    }
    setIsLoading(false);
  };

  const formik: any = useFormik({
    initialValues: defaultData,
    onSubmit: handleSubmit,
    validationSchema,
  });
  const handleSelection = (rowData: any) => {
    // Create a new array with updated isSelected property
    const updatedModelsData = weekDays?.map((record) => {
      // Toggle the isSelected property for the clicked item
      const isSelected =
        rowData.id === record.id ? !record.isActive : record.isActive;

      // Return a new object with updated isSelected property
      return {
        ...record,
        isActive: isSelected,
        tableData: { id: record.id, checked: isSelected },
      };
    });

    // Update the state with the modified modelsData
    setWeekDays(updatedModelsData);
  };
  const columns = [
    {
      title: "Selection",
      render: (rowData: WeekDay) => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={rowData?.isActive}
                onClick={() => handleSelection(rowData)}
                id="isActive"
              />
            }
            label={""}
            labelPlacement="end"
          />
        );
      },
    },
    {
      title: "Name",
      field: "nameEn",
    },
  ];

  return (
    <>
      <Card>
        <CardBody className="bg-base-100 grid grid-cols-1 gap-4">
          <form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur}>
            <div>
              <InputField
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.title && formik.errors.title}
                id="title"
                label="Name"
              />
            </div>

            <div className="space-y-3 pt-3">
              <div className="space-y-1">
                <label htmlFor="Working-hours" className="text-base">
                  Time Range
                </label>
                <div className="flex items-center gap-3">
                  <InputField
                    type="time"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="fromTime"
                    value={formik.values?.fromTime}
                    errorMessage={
                      formik.touched.fromTime && formik.errors.fromTime
                    }
                  />
                  <InputField
                    type="time"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="toTime"
                    value={formik.values?.toTime}
                    errorMessage={formik.touched.toTime && formik.errors.toTime}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="accept-time" className="text-base">
                  Accept Time Range
                </label>
                <div className="flex items-center gap-3">
                  <InputField
                    type="time"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="acceptFromTime"
                    value={formik.values?.acceptFromTime}
                    errorMessage={
                      formik.touched.acceptFromTime &&
                      formik.errors.acceptFromTime
                    }
                  />
                  <InputField
                    type="time"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="acceptToTime"
                    value={formik.values?.acceptToTime}
                    errorMessage={
                      formik.touched.acceptToTime && formik.errors.acceptToTime
                    }
                  />
                </div>
              </div>
              <CheckboxCard
                type="success"
                name={`isActive`}
                checked={formik.values.isActive || false}
                onChange={formik.handleChange}
                title="Is Active"
                description="Make this time slot active"
                icon="lucide:eye"
              />
            </div>
            {weekDays && (
              <div>
                <div>
                  <DataGridHeader title="Days list" isSearchAllowed={false} />
                  <DataGridTable
                    data={weekDays}
                    columns={columns}
                    options={{ grouping: false, columnsButton: false }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              className="mt-3"
              disabled={isLoading}
            >
              Save
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
};
