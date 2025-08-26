import { OrderDetails } from "@app/lib/types/orders";
import { Card, CardBody, SectionHeader } from "@app/ui";
import { Icon } from "@app/ui/Icon";

interface OrderProps {
  order: OrderDetails;
}

const TimeSlot = ({ order }: OrderProps) => {
  return (
    <Card className="bg-base-100">
      <CardBody className="space-y-4">
        <SectionHeader
          title="Time Slot"
          description="Time slot for the order"
          type="info"
        />
        {/* Main Time Slot */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Icon icon="lucide:calendar" className="w-5 h-5 text-gray-600" />
          <div className="flex-1">
            <span className="font-medium text-gray-700">Scheduled Time</span>
            <p className="text-gray-900 font-semibold mt-1">
              {order?.timeslot?.title || "N/A"}
            </p>
          </div>
        </div>

        {/* Delivery Window */}
        {order?.timeslot?.fromTime && order?.timeslot?.toTime && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Icon icon="lucide:clock-4" className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <span className="font-medium text-blue-900">Delivery Window</span>
              <p className="text-blue-900 font-semibold mt-1">
                {order.timeslot.fromTime} - {order.timeslot.toTime}
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export { TimeSlot };
