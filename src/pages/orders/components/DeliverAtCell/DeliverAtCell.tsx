import { useState } from "react";
import { Button } from "@app/ui/Button";
// import { OrdersService } from "@app/services/actions";
import { Order } from "@app/lib/types/orders";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { OrderService } from "@app/services/actions";
import { Icon } from "@app/ui/Icon";

export const DeliveryAtCell = ({ rowData }: { rowData: Order }) => {
  const [distance, setDistance] = useState(rowData?.distance || null);
  const [isLoading, setIsLoading] = useState(false);
  const deliverySchedule = rowData?.deliverDateType;
  const deliverAt = formatToLocalTime(rowData?.deliverDateAt ?? "");

  const handleCalcDistance = async () => {
    try {
      setIsLoading(true);
      const res: any = await OrderService.getDistanceById(rowData?.id);
      if (res) {
        setDistance(res?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate icon based on delivery schedule
  let deliveryIcon;
  switch (deliverySchedule) {
    case 0: // now
      deliveryIcon = <Icon icon="lucide:zap" className="w-4 h-4" />;
      break;
    case 1: // later
      deliveryIcon = <Icon icon="lucide:clock" className="w-4 h-4" />;
      break;
    default:
      deliveryIcon = <Icon icon="lucide:help-circle" className="w-4 h-4" />;
      break;
  }

  const sourceClassName =
    rowData?.orderSource === 1
      ? "bg-yellow-100 border-l-4 border-yellow-400"
      : rowData?.orderSource === 2
      ? "bg-red-100 border-l-4 border-red-400"
      : "";

  return (
    <div className={`p-3 rounded ${sourceClassName}`}>
      <div className="flex items-center gap-2 mb-2">
        {deliveryIcon}
        <span className="font-medium">{deliverAt.toLocaleString()}</span>
      </div>

      {distance?.distanceKm ? (
        <div className="flex items-center gap-1 text-xs mb-2">
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
            <Icon icon="lucide:map" className="w-3 h-3 mr-1" />
            {distance.distanceText}
          </div>
          <span className="text-gray-500 mx-1">•</span>
          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
            <Icon icon="lucide:clock" className="w-3 h-3 mr-1" />
            {distance.durationText}
          </div>
        </div>
      ) : null}
    </div>
  );
};
