import { Card, CardBody, SectionHeader } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { OrderDetails } from "@app/lib/types/orders";
import { OrderService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { useEffect, useState } from "react";

interface IpInfoProps {
  order: OrderDetails;
}

const IpInfo = ({ order }: IpInfoProps) => {
  const [ipInfo, setIpInfo] = useState<any>(null);
  const toast = useToast();
  const getIpInfo = async (id: number | undefined) => {
    try {
      const res = await OrderService.getOrderIpInfo(id);
      if (res) {
        setIpInfo(JSON.parse(res?.data?.data));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get IP info");
    }
  };
  useEffect(() => {
    if (order) {
      getIpInfo(order?.id);
    }
  }, [order]);

  return (
    <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardBody>
        <SectionHeader
          title="IP Information"
          description="IP information for the order"
          type="info"
          icon="lucide:globe"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <Icon icon="lucide:map-plus" fontSize={40} className="px-2" />
          <div className="grow">
            <p className="text-sm font-medium">Region</p>
            <p className="text-sm text-base-content/80">
              {ipInfo?.region}, {ipInfo?.city}
            </p>
          </div>
        </div>
        <div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <Icon icon="lucide:network" fontSize={40} className="px-2" />
            <div className="grow">
              <p className="text-sm font-medium">IP</p>
              <p className="text-sm text-base-content/80">{ipInfo?.ip}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <Icon icon="lucide:hourglass" fontSize={40} className="px-2" />
            <div className="grow">
              <p className="text-sm font-medium">Timezone</p>
              <p className="text-sm text-base-content/80">{ipInfo?.timezone}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${ipInfo?.loc}`}
            target="_blank"
            rel="noreferrer"
            className="hover:bg-primary/20 hover:text-primary rounded-full p-2 "
          >
            <Icon icon="lucide:map-pin" fontSize={18} />
          </a>
        </div>
      </CardBody>
    </Card>
  );
};

export { IpInfo };
