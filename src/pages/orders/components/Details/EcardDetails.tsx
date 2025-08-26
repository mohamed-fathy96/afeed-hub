import { decryptWithSecretKey } from "@app/lib/helpers/crypto";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";
import { Button, Card } from "@app/ui";
import { CopyToClipboard } from "@app/ui/Copy/CopyToClipboard";
import { Icon } from "@app/ui/Icon";
import { ImageWithFallback } from "@app/ui/Image";
import { useEffect, useState } from "react";

export const EcardDetails = ({
  selectedCardProduct,
  setCardDetailsModalOpen,
}: {
  selectedCardProduct: any;
  setCardDetailsModalOpen: (open: boolean) => void;
}) => {
  const [decryptedPins, setDecryptedPins] = useState<string[]>([]);
  useEffect(() => {
    const decryptPins = async () => {
      if (selectedCardProduct?.eCards) {
        const pins = await Promise.all(
          selectedCardProduct.eCards.map((eCard: any) =>
            decryptWithSecretKey(String(eCard.pinCode))
          )
        );
        setDecryptedPins(pins);
      } else {
        setDecryptedPins([]);
      }
    };
    decryptPins();
  }, [selectedCardProduct]);

  return (
    <Card className="rounded-t-lg bg-base-100 h-full border-none">
      <div className="bg-[#EDF0FE] p-4 relative">
        <Button
          size="sm"
          type="button"
          shape="circle"
          className="absolute right-2 top-2"
          aria-label="Close Drawer"
          onClick={() => setCardDetailsModalOpen(false)}
        >
          <Icon icon="lucide:x" />
        </Button>
        <h4 className="font-bold ">Card Details</h4>
      </div>
      <div className="p-4">
        {selectedCardProduct ? (
          selectedCardProduct.eCards &&
          selectedCardProduct.eCards.length > 0 ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src={selectedCardProduct.image}
                  alt={selectedCardProduct.name || "Product"}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-bold text-lg">
                    {selectedCardProduct.name ||
                      selectedCardProduct.nameEn ||
                      ""}
                  </div>
                  <div className="text-sm text-gray-600">
                    SKU: {selectedCardProduct.sku}
                  </div>
                  <div className="text-sm text-gray-600">
                    Currency: {selectedCardProduct.eCards[0].baseCurrencySymbol}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="text-sm text-gray-600">Serial Numbers:</div>
                {selectedCardProduct.eCards.map((eCard: any) => (
                  <div className="flex items-center" key={eCard.serialNumber}>
                    <div>{eCard.serialNumber}</div>
                    <div className="z-10">
                      <CopyToClipboard text={eCard.serialNumber} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded">
                  <thead className="bg-base-100">
                    <tr>
                      <RestrictedWrapper
                        requiredPermissions={"orders"}
                        action={"view_pin_code"}
                      >
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                          Pin Code
                        </th>
                      </RestrictedWrapper>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                        Masked Pin Code
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedCardProduct.eCards.map(
                      (eCard: any, idx: number) => (
                        <tr key={eCard.serialNumber || idx}>
                          <RestrictedWrapper
                            requiredPermissions="orders"
                            action="view_pin_code"
                          >
                            <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                              {decryptedPins[idx] || "Decrypting..."}
                              <CopyToClipboard text={decryptedPins[idx]} />
                            </td>
                          </RestrictedWrapper>
                          <td className="px-4 py-2 whitespace-nowrap font-mono">
                            {eCard.maskedPinCode}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>No card details available.</div>
          )
        ) : (
          <div>No product selected.</div>
        )}
      </div>
    </Card>
  );
};
