import React from "react";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import TimeSlotService from "@app/services/actions/TimeSlotService";
import { TimeSlotsForm } from "@app/components/TimeSlots/TimeSlotForm";

interface EditTimeSlotPageProps {}

export const EditTimeSlotPage: React.FC<EditTimeSlotPageProps> = () => {
  const toast = useToast();
  const params: { id?: string } = useParams();
  const [isLoaderOpen, setIsLoaderOpen] = React.useState<boolean>(false);
  const [voucherData, setVoucherData] = React.useState<any>({});

  const fetchVoucherById = async (id: number) => {
    setIsLoaderOpen(true);
    try {
      const res = await TimeSlotService.getTimeSlotById(id);
      setVoucherData(res?.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(
        err?.response?.data?.detail ?? "Failed to get time slot details"
      );
    }
  };

  React.useEffect(() => {
    fetchVoucherById(Number(params?.id));
  }, [params?.id]);

  return (
    <>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <TimeSlotsForm
            timeSlotData={voucherData}
            SlotId={Number(params?.id)}
          />
        </>
      )}
    </>
  );
};
