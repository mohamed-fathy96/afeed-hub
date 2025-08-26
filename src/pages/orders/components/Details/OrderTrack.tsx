import {
  OrderDetails,
  OrderStatusEnum,
  OrderTracking,
} from "@app/lib/types/orders";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { OrderService } from "@app/services/actions";
import { Icon } from "@app/ui/Icon";
import clipboardIcon from "@iconify/icons-lucide/clipboard";
import clipboardCheckIcon from "@iconify/icons-lucide/clipboard-check";
import packageOpenIcon from "@iconify/icons-lucide/package-open";
import truckIcon from "@iconify/icons-lucide/truck";
import clockIcon from "@iconify/icons-lucide/clock";
import xCircleIcon from "@iconify/icons-lucide/x-circle";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderTrackProps {
  order: OrderDetails;
}

const OrderTrack = ({ order }: OrderTrackProps) => {
  const [OrderTrack, setOrderTrack] = useState<OrderTracking>();
  const [animationDelay, setAnimationDelay] = useState(0);

  const fetchOrderTrack = async () => {
    try {
      const response = await OrderService.getTrackOrder(order?.id);
      if (response) {
        setOrderTrack(response.data);
        setAnimationDelay(100); // Trigger staggered animations
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch order");
      console.error("Error while fetching order track", error);
    }
  };

  useEffect(() => {
    if (order?.id) {
      fetchOrderTrack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // Define timeline steps with enhanced styling
  const timelineSteps = [
    {
      status: OrderStatusEnum.PendingPayment,
      label: "Order Placed",
      description: "order has been received and is being processed",
      icon: clipboardIcon,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      status: OrderStatusEnum.Placed,
      label: "Order Confirmed",
      description: "Order accepted and confirmed by the store",
      icon: clipboardCheckIcon,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    // {
    //   status: OrderStatusEnum.beingPicked,
    //   label: "Being Prepared",
    //   description: "Order is being prepared with care",
    //   icon: packageCheckIcon,
    //   color: "from-orange-500 to-orange-600",
    //   bgColor: "bg-orange-50",
    //   textColor: "text-orange-700",
    // },
    // {
    //   status: OrderStatusEnum.onTheWay,
    //   label: "Out for Delivery",
    //   description: "Driver is on the way to deliver the order",
    //   icon: truckIcon,
    //   color: "from-purple-500 to-purple-600",
    //   bgColor: "bg-purple-50",
    //   textColor: "text-purple-700",
    // },
    {
      status: OrderStatusEnum.Completed,
      label: "Delivered",
      description: "Order successfully delivered to the location",
      icon: packageOpenIcon,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
  ];

  const getStepInfo = (status: number) => {
    return timelineSteps.find((step) => step.status === status);
  };

  const getProgressPercentage = () => {
    if (!OrderTrack?.timeline) return 0;
    const completedSteps = OrderTrack.timeline.filter(
      (step) => step.isCompleted
    ).length;
    const totalSteps = OrderTrack.timeline.length;
    return (completedSteps / totalSteps) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Order Progress</h3>
            <p className="text-sm text-gray-600">Track the order status</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {Math.round(getProgressPercentage())}%
            </div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

        <div className="space-y-6">
          {OrderTrack?.timeline?.map((step, index) => {
            const stepInfo = getStepInfo(step.status);
            const isCompleted = step.isCompleted;

            return (
              <div
                key={index}
                className={`relative flex items-start gap-6 transition-all duration-500 ease-out`}
                style={{
                  animationDelay: `${index * animationDelay}ms`,
                  opacity: animationDelay > 0 ? 1 : 0,
                  transform:
                    animationDelay > 0 ? "translateY(0)" : "translateY(20px)",
                }}
              >
                {/* Timeline Node */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                      ${
                        isCompleted
                          ? `bg-gradient-to-br ${
                              stepInfo?.color || "from-gray-400 to-gray-500"
                            } text-white scale-110`
                          : "bg-white border-4 border-gray-300 text-gray-400"
                      }
                    `}
                  >
                    <Icon
                      icon={stepInfo?.icon || clipboardIcon}
                      className={`w-6 h-6 ${
                        isCompleted ? "animate-pulse" : ""
                      }`}
                    />
                  </div>

                  {/* Completion Checkmark */}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon
                        icon="lucide:check"
                        className="w-3 h-3 text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`
                    flex-1 rounded-xl border-2 transition-all duration-300 overflow-hidden
                    ${
                      isCompleted
                        ? `${
                            stepInfo?.bgColor || "bg-gray-50"
                          } border-current shadow-md`
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`font-bold text-lg ${
                          isCompleted
                            ? stepInfo?.textColor || "text-gray-700"
                            : "text-gray-500"
                        }`}
                      >
                        {step?.statusTitle || stepInfo?.label}
                      </h4>
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <Icon
                            icon="lucide:check-circle"
                            className="w-4 h-4"
                          />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>

                    <p
                      className={`text-sm mb-3 ${
                        isCompleted ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {stepInfo?.description || "Processing the order"}
                    </p>

                    <div className="flex items-center gap-2 text-xs">
                      <Icon
                        icon={clockIcon}
                        className="w-4 h-4 text-gray-400"
                      />
                      <span className="text-gray-600">
                        {step.timestamp
                          ? formatToLocalTime(step.timestamp)
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cancellation Status */}
          {OrderTrack?.isCancelled && (
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg text-white">
                  <Icon icon={xCircleIcon} className="w-7 h-7" />
                </div>
              </div>

              <div className="flex-1 bg-red-50 border-2 border-red-200 rounded-xl overflow-hidden">
                <div className="p-5">
                  <h4 className="font-bold text-lg text-red-700 mb-2">
                    Order Cancelled
                  </h4>
                  <p className="text-sm text-red-600 mb-3">
                    This order has been cancelled and will not be delivered.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Icon icon={clockIcon} className="w-4 h-4 text-red-400" />
                    <span className="text-red-600">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Delivery */}
          {!OrderTrack?.isCancelled &&
            OrderTrack?.estimatedDeliveryStart &&
            OrderTrack?.estimatedDeliveryEnd && (
              <div className="relative flex items-start gap-6">
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg text-white">
                    <Icon icon={truckIcon} className="w-7 h-7" />
                  </div>
                </div>

                <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-blue-700 mb-2">
                      Estimated Delivery
                    </h4>
                    <p className="text-sm text-blue-600 mb-3">
                      The order is expected to arrive between these times
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon
                          icon={clockIcon}
                          className="w-4 h-4 text-blue-500"
                        />
                        <span className="text-blue-700 font-medium">
                          {formatToLocalTime(OrderTrack.estimatedDeliveryStart)}
                        </span>
                        <span className="text-blue-600">to</span>
                        <span className="text-blue-700 font-medium">
                          {formatToLocalTime(OrderTrack.estimatedDeliveryEnd)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export { OrderTrack };
