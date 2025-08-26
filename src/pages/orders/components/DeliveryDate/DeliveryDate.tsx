import React, { useRef, useEffect } from "react";
import { Card } from "@app/ui";
import { Button } from "@app/ui";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import TimeSlotService from "@app/services/actions/TimeSlotService";
import Radio from "@app/ui/Radio/Radio";
import { useFormik } from "formik";
import { DeliveryDateType } from "@app/lib/types/orders";

interface TimeSlotsProps {
  setTimeslot: (timeSlotId: any) => void;
  __T: (key: string) => string;
}
const DeliveryOptions = [
  { id: DeliveryDateType.Now, title: "Express Delivery" },
  { id: DeliveryDateType.Later, title: "Select Date & Time" },
];

export const DeliveryDate = ({ setTimeslot, __T }: TimeSlotsProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [deliveryDates, setDeliveryDates] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [displaySLot, setDisplaySlot] = React.useState<{
    id: number;
    title: string;
    date: string;
  } | null>(null);

  const formik = useFormik({
    initialValues: {
      deliveryTypeId: DeliveryDateType.Now,
      selectedDate: "",
      selectedSlotId: "",
    },
    onSubmit: () => {}, // not used, handled manually
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchTimeSlots = async () => {
      const res = await TimeSlotService.getManualOrderTimeSlot({});
      setDeliveryDates(res?.data || []);
      setIsLoading(false);
    };
    fetchTimeSlots();
  }, []);

  const handleSelect = (item: any) => {
    if (item?.id === DeliveryDateType.Later) {
      if (modalRef.current) modalRef.current.showModal();
      setDisplaySlot(null);
    }
    formik.setFieldValue("deliveryTypeId", item?.id);
  };

  const SlotSkeltone = () => (
    <div className="aspect-[3/1] max-h-14 min-w-36 rounded-lg animate-pulse bg-gray-200" />
  );

  return (
    <div className="flex flex-col space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full"></span>
        {__T("Delivery Date & Time")}
      </h3>
      <Card className="bg-white flex flex-col gap-4 rounded-xl shadow-md p-4">
        {DeliveryOptions?.map((method: any) => (
          <label
            key={method.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border border-transparent hover:border-primary/40 ${
              formik.values.deliveryTypeId === method.id
                ? "bg-primary/5 border-primary"
                : ""
            }`}
          >
            <Radio
              name="delivery-time"
              value={String(method.id)}
              checked={formik.values.deliveryTypeId === method?.id}
              onChange={() => handleSelect(method)}
              className="w-5 h-5 accent-primary focus:ring-2 focus:ring-primary"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-base">
                {__T(method.title)}
              </span>
              {formik.values.deliveryTypeId === DeliveryDateType.Later &&
                method?.id === DeliveryDateType.Later &&
                displaySLot && (
                  <span className="text-sm text-gray-500 mt-1">
                    {displaySLot?.title} -{" "}
                    {formatToLocalTime(displaySLot?.date)}
                  </span>
                )}
            </div>
          </label>
        ))}
      </Card>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-full max-w-2xl rounded-2xl shadow-2xl p-8 bg-white">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            {__T("Select Date & Time")}
          </h4>
          <div>
            {isLoading ? (
              <SlotSkeltone />
            ) : (
              <>
                {deliveryDates?.length > 0 && (
                  <>
                    <div className="flex flex-row gap-3 mb-4 flex-wrap">
                      {deliveryDates.map((day: any) => (
                        <label
                          key={day.date}
                          className={`flex gap-2 p-4 items-center cursor-pointer rounded-lg border transition hover:border-primary/40 ${
                            formik.values.selectedDate === day.date
                              ? "bg-primary/10 border-primary"
                              : "border-gray-200"
                          }`}
                        >
                          <Radio
                            name="available-dates"
                            value={day.date}
                            checked={formik.values.selectedDate === day.date}
                            onChange={() => {
                              formik.setFieldValue("selectedDate", day.date);
                              formik.setFieldValue("selectedSlotId", "");
                            }}
                            className="w-4 h-4 accent-primary focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm font-medium mt-1 text-gray-700">
                            {day.date}
                          </span>
                        </label>
                      ))}
                    </div>
                    {deliveryDates.find(
                      (day: any) => day.date === formik.values.selectedDate
                    )?.slots?.length > 0 && (
                      <div className="flex flex-col gap-2 mt-1">
                        {deliveryDates
                          .find(
                            (day: any) =>
                              day.date === formik.values.selectedDate
                          )
                          ?.slots?.map((slot: any) => (
                            <label
                              key={slot.id}
                              className={`flex gap-2 p-4 items-center cursor-pointer rounded-lg border transition hover:border-primary/40 ${
                                formik.values.selectedSlotId ===
                                slot.id.toString()
                                  ? "bg-primary/10 border-primary"
                                  : "border-gray-200"
                              }`}
                            >
                              <Radio
                                name={`slots-${formik.values.selectedDate}`}
                                value={slot.id.toString()}
                                checked={
                                  formik.values.selectedSlotId ===
                                  slot.id.toString()
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "selectedSlotId",
                                    slot.id.toString()
                                  )
                                }
                                className="w-4 h-4 accent-primary focus:ring-2 focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {slot.title}
                              </span>
                            </label>
                          ))}
                      </div>
                    )}
                  </>
                )}
                {!deliveryDates?.length && (
                  <div className="text-center py-10">
                    <span className="text-base text-gray-400 font-semibold">
                      {__T("No Slots Available")}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end w-full gap-3 mt-8">
            <Button
              variant="outline"
              type="button"
              className="rounded-lg px-6 py-2 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary transition"
              onClick={() => {
                if (modalRef.current) modalRef.current.close();
                formik.setFieldValue("deliveryTypeId", DeliveryDateType.Now);
                formik.setFieldValue("selectedDate", "");
                formik.setFieldValue("selectedSlotId", "");
              }}
            >
              {__T("Cancel")}
            </Button>
            <Button
              disabled={!formik.values.selectedSlotId}
              type="button"
              className="rounded-lg px-6 py-2 bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
              onClick={() => {
                if (modalRef.current) modalRef.current.close();
                formik.setFieldValue("deliveryTypeId", DeliveryDateType.Later);
                if (formik.values.selectedSlotId) {
                  setTimeslot({
                    id: formik.values.selectedSlotId,
                    date: formik.values.selectedDate,
                    deliveryDateType: DeliveryDateType.Later,
                  });
                  const slotTitle = deliveryDates
                    ?.flatMap((dateObj: any) => dateObj?.slots)
                    ?.find(
                      (slot: { id: number }) =>
                        slot?.id === Number(formik.values.selectedSlotId)
                    )?.title;
                  setDisplaySlot({
                    id: Number(formik.values.selectedSlotId),
                    title: slotTitle,
                    date: formik.values.selectedDate,
                  });
                }
              }}
            >
              {__T("Confirm")}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
