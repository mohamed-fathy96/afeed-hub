import React, { useState } from "react";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Order, OrderDetails, orderTrigger } from "@app/lib/types/orders";
import { OrderService } from "@app/services/actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalActions,
  Select,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import closeIcon from "@iconify/icons-lucide/x";

interface Props {
  order: OrderDetails | Order;
  onCloseModal: (updateData?: boolean) => void;
}

export const UpdateStatus: React.FC<Props> = ({ order, onCloseModal }) => {
  const [selectedStatus, setSelectedStatus] = useState<number>(
    order?.status - 1 || 0
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSubmit = async () => {
    const data = {
      trigger: selectedStatus,
    };
    setIsLoading(true);

    try {
      const res = await OrderService.updateStatus(data, order?.id);
      if (res) {
        toast.success("Status updated successfully");
        onCloseModal(true);
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update status");
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = (state: boolean) => setIsModalOpen(state);

  return (
    <>
      <Select
        className="w-full"
        name="refundTarget"
        onChange={(e) => {
          setSelectedStatus(Number(e.target.value));
          setIsModalOpen(true);
        }}
        value={selectedStatus}
        required
      >
        <option value="">Update Status</option>
        {orderTrigger.slice(1, -1).map((status, index) => (
          <option key={index} value={status.value}>
            {" "}
            {status.label}
          </option>
        ))}
      </Select>

      <Modal backdrop open={isModalOpen}>
        <ModalHeader>
          <Button
            size="sm"
            color="ghost"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={() => onClose(false)}
          >
            <Icon name="x" icon={closeIcon} />
          </Button>
          <h3 className="text-lg font-bold">Update Status</h3>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col space-y-4">
            Are you sure you want to update the status?
          </div>
        </ModalBody>

        <ModalActions>
          <Button color="error" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit} loading={isLoading}>
            Confirm
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
};
