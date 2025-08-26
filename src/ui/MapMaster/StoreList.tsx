import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionTitle,
  Button,
  CardBody,
} from "@app/ui";

interface Store {
  storeId: number;
  storeName: string;
  coordinates: Array<{ lat: number; lng: number }>;
}

interface StoreListProps {
  isDisabled?: boolean;
  stores: Store[];
  selectStorePolygon: (store: Store) => void;
  currentStore: Store | null;
  handleSaveStore: () => void;
  unselectStorePolygon: (store: Store) => void;
  handleSaveDraft?: () => void;
  handleSavePublish?: () => void;
  preview?: boolean;
  isExpended: number;
  polygonsArray: any[];
  validPolygon: React.MutableRefObject<boolean>;
  handleRemoveRadius: () => void;
  handleOpenConfirmRemove: () => void;
}

const StoreList: React.FC<StoreListProps> = ({
  // isDisabled = false,
  stores = [],
  selectStorePolygon,
  currentStore,
  handleSaveStore,
  unselectStorePolygon,
  preview = false,
  isExpended,
  polygonsArray,
  validPolygon,
  handleOpenConfirmRemove,
  // handleSavePublish,
  // handleSaveDraft,
}) => {
  // Expand current store when polygon changes on map.
  useEffect(() => {
    if (currentStore) {
      selectStorePolygon(currentStore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygonsArray]);

  const hasPolygon = (storeId: number) =>
    polygonsArray.some((polygon) => polygon?.flowardStore?.storeId === storeId);

  return (
    <CardBody className="bg-base-100" id="storeList-AccordionItem">
      {stores?.map((store) => {
        const isSelected = currentStore?.storeId === store.storeId;
        const storeHasPolygon = hasPolygon(store.storeId);
        // Force re-render by including current expansion state
        const accordionKey = `storeList-AccordionItem-${store.storeId}-${
          isExpended === store.storeId ? "open" : "closed"
        }`;

        return (
          <Accordion
            key={accordionKey}
            className={`border rounded-lg ${
              isSelected ? "border-primary" : ""
            }`}
            tabIndex={store.storeId}
            icon="arrow"
            defaultChecked={isExpended === store.storeId}
            onChange={() => {
              if (isExpended === store.storeId) {
                unselectStorePolygon(store);
              } else {
                selectStorePolygon(store);
              }
            }}
          >
            <AccordionTitle>{store.storeName}</AccordionTitle>
            <AccordionContent>
              {!preview && (
                <div className="border-t border-base-200 pt-2">
                  {storeHasPolygon && isSelected && (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveStore}
                          color="primary"
                          size="sm"
                          disabled={!validPolygon.current}
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleOpenConfirmRemove}
                          color="error"
                          size="sm"
                        >
                          Remove Radius
                        </Button>
                      </div>
                      <span className="text-base-content">
                        {!validPolygon.current ? "Invalid polygon shape" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </AccordionContent>
          </Accordion>
        );
      })}
    </CardBody>
  );
};

export default StoreList;
