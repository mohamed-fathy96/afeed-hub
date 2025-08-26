import { useState } from "react";
import { Card } from "@app/ui/Card";
import { Icon } from "@app/ui/Icon";
import { Button, Radio } from "@mui/material";
import { AddressList as AddressListType } from "@app/lib/types/orders";

interface AddressListProps {
  addressItems: AddressListType[];
  refetchAddress: () => Promise<any>;
  setAddressId: (adrId: number) => void;
}

export const AddressList = ({
  addressItems,
  setAddressId,
}: AddressListProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-3">
      {addressItems?.length > 0 ? (
        <div className="flex flex-col gap-4">
          {addressItems.map((address) => (
            <Card
              key={address.id}
              className={`flex flex-row items-center gap-4 p-4 rounded-lg shadow-md transition-all border border-gray-100 hover:border-primary bg-white ${
                selectedAddress === String(address.id)
                  ? "ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => {
                setSelectedAddress(String(address.id));
                setAddressId(Number(address.id));
              }}
              style={{ cursor: "pointer" }}
            >
              <Radio
                checked={selectedAddress === String(address.id)}
                onChange={() => {
                  setSelectedAddress(String(address.id));
                  setAddressId(Number(address.id));
                }}
                value={address.id}
                name="selectedAddress"
                className="w-5 h-5 accent-primary focus:ring-2 focus:ring-primary flex-shrink-0"
              />
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-base flex items-center gap-2">
                  <Icon icon="lucide:map-pin" className="text-primary" />
                  {address.name}
                </span>
                {address.addressLine1 && (
                  <span className="text-sm flex items-center gap-1">
                    <Icon icon="lucide:map-pin" className="text-primary" />
                    {address.addressLine1}
                  </span>
                )}
                <span className="text-sm flex items-center gap-1">
                  <Icon icon="lucide:phone" className="text-primary" />
                  {address.contactPhoneNumber}
                </span>
                {address.additionalInstructions && (
                  <span className="text-sm flex gap-1">
                    <span className="text-gray-500">Notes:</span>
                    <span className="text-gray-500">
                      {address.additionalInstructions}
                    </span>
                  </span>
                )}
                {address.zone && (
                  <span className="text-sm flex items-center gap-1">
                    <Icon icon="lucide:map-pin" className="text-primary" />
                    {address.zone}
                  </span>
                )}
                {address.coordinate && (
                  <span className="text-sm flex items-center gap-1 p-2 bg-primary/10 rounded-md">
                    <a
                      href={`https://maps.google.com/?q=${address.coordinate.latitude},${address.coordinate.longitude}`}
                      target="_blank"
                      className="flex items-center gap-1"
                      rel="noopener noreferrer"
                    >
                      <Icon icon="lucide:map" /> View on Google Maps
                    </a>
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-tertiary">
          <Icon icon="lucide:map-pin" className="text-4xl mb-2 text-gray-300" />
          <p className="text-base font-medium">No address found</p>
          <p className="text-sm text-gray-400">
            Add a new address to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressList;
