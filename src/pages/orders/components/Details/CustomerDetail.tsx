import { Card, CardBody, SectionHeader } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { OrderDetails } from "@app/lib/types/orders";
import { useToast } from "@app/helpers/hooks/use-toast";

interface OrderCustomerDetailProps {
  order: OrderDetails;
}

const OrderCustomerDetail = ({ order }: OrderCustomerDetailProps) => {
  const toast = useToast();

  const copyToClipboard = (text: string, label: string = "Copied!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };
  return (
    <Card className="bg-base-100">
      <CardBody>
        <SectionHeader
          title="Customer Details"
          description="Customer details for the order"
          icon="lucide:user"
          type="info"
        />

        <table className="table">
          <tbody>
            <tr>
              <td className="font-medium">Name</td>
              <td className="flex items-center gap-2">
                <span className="flex-grow">{order?.user?.name || "-"}</span>
              </td>
            </tr>
            <tr>
              <td className="font-medium">Phone</td>
              <td className="flex items-center gap-2">
                {order?.user?.phoneNumber && (
                  <Icon
                    icon="lucide:phone"
                    className="text-base-content/80"
                    fontSize={18}
                  />
                )}
                <span className="flex-grow">
                  {order?.user?.phoneNumber || "-"}
                </span>
                {order?.user?.phoneNumber && (
                  <Icon
                    icon="lucide:copy"
                    className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                    fontSize={18}
                    onClick={() =>
                      copyToClipboard(
                        order?.user?.phoneNumber,
                        "Phone number copied!"
                      )
                    }
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className="font-medium">Email</td>
              <td className="flex items-center gap-2">
                {order?.user?.email && (
                  <Icon
                    icon="lucide:mail"
                    className="text-base-content/80"
                    fontSize={18}
                  />
                )}
                <span className="flex-grow">{order?.user?.email || "-"}</span>
                {order?.user?.email && (
                  <Icon
                    icon="lucide:copy"
                    className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                    fontSize={18}
                    onClick={() =>
                      copyToClipboard(order?.user?.email, "Email copied!")
                    }
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export { OrderCustomerDetail };
