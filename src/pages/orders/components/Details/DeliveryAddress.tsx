import { useToast } from "@app/helpers/hooks/use-toast";
import { OrderDetails } from "@app/lib/types/orders";
import {
  Button,
  Card,
  CardBody,
  ModalActions,
  ModalBody,
  ModalHeader,
  SectionHeader,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { AddressList } from "../Address";
import { useState } from "react";
import Modal from "@app/ui/Modal/Modal";
import { AddressForm } from "@app/components/form/order/AddressForm/AdressForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderService, UserService } from "@app/services/actions";
import { AppLoader } from "@app/ui/AppLoader";

interface OrderProps {
  order: OrderDetails;
  fetchOrder: () => void;
}

const OrderDeliveryAddress = ({ order, fetchOrder }: OrderProps) => {
  const toast = useToast();
  const [addressId, setAddressId] = useState<number | null>(null);
  const [showAddressListModal, setShowAddressListModal] = useState(false);
  const [showAddressFormModal, setShowAddressFormModal] = useState(false);
  const url = `https://www.google.com/maps/search/?api=1&query=${order?.userAddress?.latitude},${order?.userAddress?.longitude}`;

  const copyToClipboard = (text: string, label: string = "Copied!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const {
    data: addressList = [],
    isLoading: isAddressListLoading,
    refetch: refetchAddressList,
  } = useQuery({
    queryKey: ["addressList"],
    queryFn: async () => {
      const res = await UserService.getAddressList(order?.user?.id);
      return res?.data || [];
    },
    enabled: !!order?.user?.id && !!showAddressListModal,
  });

  const { mutate: saveOrderAddress, isPending: isSavingOrderAddress } =
    useMutation({
      mutationFn: async (data: any) => {
        const res = await OrderService.saveOrderAddress(data, order?.id);
        return res?.data || [];
      },
      onSuccess: (res) => {
        toast.success(res?.message || "Address saved successfully");
        refetchAddressList();
        fetchOrder();
      },
      onError: (e: any) => {
        toast.error(e?.response?.data?.message || "Failed to save address");
      },
    });

  return (
    <div className="space-y-2">
      <Card className="bg-base-100">
        <CardBody className="space-y-1">
          <div className="flex items-start justify-between">
            <SectionHeader
              title="Delivery Address"
              description=""
              type="warning"
              icon="lucide:map-pin"
            />
            <div className="flex items-center gap-2">
              <Button
                color="success"
                size="sm"
                onClick={() => setShowAddressFormModal(true)}
              >
                <Icon icon="lucide:plus" className="w-4 h-4" />
              </Button>
              <Button
                color="info"
                size="sm"
                onClick={() => setShowAddressListModal(true)}
              >
                <Icon icon="lucide:edit" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Address Information */}
          <div className="space-y-2">
            {/* Phone Number */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:phone" className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Phone Number</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold">
                  {order?.userAddress?.phoneNumber || "N/A"}
                </span>
                {order?.userAddress?.phoneNumber && (
                  <Icon
                    icon="lucide:copy"
                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() =>
                      copyToClipboard(
                        order?.userAddress?.phoneNumber,
                        "Phone number copied!"
                      )
                    }
                  />
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Icon
                  icon="lucide:map-pin"
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-green-900">
                      Delivery Address
                    </span>
                    {url && (
                      <Button
                        color="ghost"
                        size="xs"
                        className="hover:bg-green-200 hover:text-green-700"
                        onClick={() => window.open(url, "_blank")}
                      >
                        <Icon icon="lucide:map" className="w-4 h-4" />
                        <span className="ml-1">View Map</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-green-700 mb-1">
                    {order?.userAddress?.addressName || "N/A"}
                  </p>
                  <p className="text-green-900 font-medium">
                    {order?.userAddress?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Instructions */}
            {order?.userAddress?.additionalInstructions && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Icon
                  icon="lucide:message-square"
                  className="w-5 h-5 text-blue-600 mt-0.5"
                />
                <div className="flex-1">
                  <span className="font-medium text-blue-900">
                    Additional Instructions
                  </span>
                  <p className="text-sm text-blue-700 mt-1">
                    {order?.userAddress?.additionalInstructions}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {order?.notes && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <Icon
                  icon="lucide:sticky-note"
                  className="w-5 h-5 text-purple-600 mt-0.5"
                />
                <div className="flex-1">
                  <span className="font-medium text-purple-900">
                    Order Notes
                  </span>
                  <p className="text-sm text-purple-700 mt-1">{order?.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Modals */}
          <Modal
            open={showAddressListModal}
            onClose={() => setShowAddressListModal(false)}
            backdrop={!showAddressListModal}
            className="p-0"
          >
            <ModalHeader className="p-4 sticky top-0 bg-white z-10 shadow-sm border-b">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-medium text-gray-700 mb-1">
                  My Addresses
                </h2>
                <button
                  type="button"
                  className="flex items-center gap-2"
                  onClick={() => setShowAddressListModal(false)}
                >
                  <Icon icon="lucide:x" fontSize={16} />
                </button>
              </div>
              <Button
                type="button"
                color="ghost"
                size="xs"
                className="flex items-center"
                onClick={() => {
                  setShowAddressFormModal(true);
                  setShowAddressListModal(false);
                }}
              >
                <Icon icon="lucide:plus" fontSize={16} />
                Add New Address
              </Button>
            </ModalHeader>
            <ModalBody className="p-4">
              {isAddressListLoading ? (
                <AppLoader />
              ) : (
                <AddressList
                  addressItems={addressList}
                  refetchAddress={refetchAddressList}
                  setAddressId={(addressId) => {
                    setAddressId(addressId);
                  }}
                />
              )}
            </ModalBody>
            <ModalActions className="flex sticky bottom-0 p-4 w-full bg-white shadow-sm border-t">
              <Button
                color="ghost"
                onClick={() => {
                  setShowAddressListModal(false);
                  setAddressId(null);
                }}
              >
                <Icon icon="lucide:x" fontSize={16} />
                Close
              </Button>
              <Button
                color="primary"
                disabled={!addressId}
                onClick={() => {
                  setShowAddressListModal(false);
                  saveOrderAddress({
                    addressId: addressId,
                    orderId: order?.id,
                  });
                }}
                loading={isSavingOrderAddress}
              >
                <Icon icon="lucide:plus" fontSize={16} />
                Select Address
              </Button>
            </ModalActions>
          </Modal>

          {showAddressFormModal && (
            <AddressForm
              onSubmit={(data: any) => {
                const payload = {
                  ...data,
                  addressId: 0,
                };
                saveOrderAddress(payload);
                fetchOrder();
              }}
              storeId={1}
              open={showAddressFormModal}
              setOpen={setShowAddressFormModal}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export { OrderDeliveryAddress };
