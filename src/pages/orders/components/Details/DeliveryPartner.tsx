import { OrderDetails } from "@app/lib/types/orders";

interface OrderDeliveryPartnerProps {
  order: OrderDetails | undefined;
}

const OrderDeliveryPartner = ({ order }: OrderDeliveryPartnerProps) => {
  
  return (
    <div className="flex items-center gap-3">
      {/* <img
        src={order?.im}
        height={40}
        width={40}
        className={`size-10 bg-base-content/10 `}
        alt="Avatar"
      /> */}
      <div className="grow">
        <p className="text-sm font-medium">{order?.orderDriver?.driverName}</p>
        <p className="text-sm text-base-content/80">
          {order?.orderDriver?.driverPhone}
        </p>
      </div>
    </div>
  );
};

export { OrderDeliveryPartner };
