/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
import { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import isEqual from "lodash/isEqual";
import SaveConfirmationModal from "./SaveConfirmationModal";
import StoreList from "./StoreList";

import { useToast } from "@app/helpers/hooks/use-toast";
import { AppErrorBoundary } from "@app/ui/ErrorBoundary";
import { debounce } from "@app/lib/utils/debounce";
import { modalContentData } from "./constants";
import { MapMasterService } from "@app/services/actions";
import jsts from "jsts";
import { Button } from "@app/ui/Button";
import Resync from "@iconify/icons-lucide/refresh-ccw";
import { Icon } from "@app/ui/Icon";

const polygonOptions = {
  fillColor: "#006782CC",
  fillOpacity: 0.4,
  strokeColor: "#006782",
  strokeOpacity: 1,
  strokeWeight: 1,
  clickable: true,
  editable: false,
  draggable: false,
  zIndex: 1,
};

const googleMapsAPI = import.meta.env.VITE_GOOGLE_MAP_KEY || "";

const defaultCenter = { lat: 25.286106, lng: 51.534817 };
declare global {
  interface Window {
    google: any;
  }
}

// Updated Store interface using API keys
interface Store {
  storeId: number;
  storeName: string;
  coordinates: { lat: number; lng: number }[];
}

interface CommonMapMasterProps {
  storeList: Store[];
  preview?: boolean;
  onStoreSave?: () => void;
}

const CommonMapMaster = ({
  storeList = [],
  preview = false,
  onStoreSave = () => null,
}: CommonMapMasterProps) => {
  const toast = useToast();
  const [geofencedMapCount, setGeofencedMapCount] = useState<number>(0);
  const mapRef = useRef<GoogleMapReact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [restrictionMapCountry, setRestrictionMapCountry] =
    useState<string>("QA");
  const [gMap, setGMap] = useState<any>(null);
  const [gMaps, setGMaps] = useState<any>(null);
  const [gMapsDrawingManager, setGMapsDrawingManager] = useState<any>(null);
  const [currentStore, setCurrentStore] = useState<any | null>(null);
  const [fitleredStores, setFilteredStores] = useState<any[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isExpended, setIsExpended] = useState<number>(-1);
  const selectedStore = useRef<any | null>(null);
  const storePolygonsArr = useRef<any[]>([]);
  const [storePolygons, setStorePolygons] = useState<any[]>(storeList);
  const [polygonsArray, setPolygonsArray] = useState<any[]>([]);
  const polygonsArr = useRef<any[]>([]);

  const [modalContent, setModalContent] = useState<any>(modalContentData?.[0]);
  const [buttonTxt, setButtonTxt] = useState<string>("Confirm");
  const [typeModal, setTypeModal] = useState<number>(-1);
  const [pendingFunc, setPendingFunc] = useState<{ func: () => void }>({
    func: () => null,
  });

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [mapType] = useState<string>("map");
  const validPolygon = useRef<boolean>(true);
  const polygonDragging = useRef<boolean>(false);
  const heatMapData: any = [];
  const notGeofencedMapData: any = [];
  const heatArray =
    mapType !== "map"
      ? mapType === "heatmap"
        ? heatMapData
        : notGeofencedMapData
      : [];

  const checkIfStorePolygonModifiedForCurrent = (
    store: any,
    skipCheck = false
  ) => {
    if (!skipCheck && store?.storeId) {
      // check if polygons have modified
      const newDataForStore = storePolygons?.find(
        (itm) => itm?.storeId === store?.storeId
      );
      if (newDataForStore) {
        if (!isEqual?.(newDataForStore?.coordinates, store?.coordinates)) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  };

  const checkIfStorePolygonModified = (
    store: any,
    skipCheck = false,
    prevStore = null
  ) => {
    const previousStore = prevStore || selectedStore.current;
    if (
      !skipCheck &&
      previousStore?.storeId &&
      previousStore?.storeId !== store?.storeId
    ) {
      // check if polygons have modified
      const newDataForStore =
        storePolygonsArr.current?.find(
          (itm) => itm?.storeId === previousStore?.storeId
        ) || null;
      if (newDataForStore) {
        if (
          !isEqual(newDataForStore?.coordinates, previousStore?.coordinates)
        ) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  };

  const scrollToAccordian = (store: any) => {
    const accordianWrapper: any = document.getElementById(
      "SubStoresList-AccordionItem-Wrapper"
    );
    const accordionItem = document.getElementById(
      `SubStoresList-AccordionItem-${store?.storeId}`
    );
    if (accordionItem) {
      const topPos = accordionItem.offsetTop - 16;
      accordianWrapper.scrollTop = topPos;
    }
  };

  const handleSelectStore = (store: any, skipCheck = false) => {
    // Check if there's a store in editing mode without saving its changes, before selecting the new store
    const checkIfModified = checkIfStorePolygonModified(store, skipCheck);
    if (checkIfModified) {
      // show alert for confirmation
      setModalContent(modalContentData[3]);
      setButtonTxt("Discard");
      setTypeModal(3);
      setIsConfirmOpen(true);
      // to select the store after discarding the changes if the user chose to discard the previous changes
      setPendingFunc({
        func: () => handleSelectStore(store),
      });
      // dont continue
      return false;
    }
    // selecting the store
    setCurrentStore(store);
    setIsExpended(store?.storeId);
    selectedStore.current = store;
    // scroll the content to selected store
    scrollToAccordian(store);
    // if store has polygon center the map to the first coordinates of that polygon
    if (store.coordinates.length > 0) {
      setMapCenter({
        lat: store.coordinates[0].lat,
        lng: store.coordinates[0].lng,
      });
    } else {
      setMapCenter(defaultCenter);
    }
  };

  const handleUnSelectStore = (store: any, skipCheck = false) => {
    // Check if there's a store in editing mode without saving its changes, before unselecting the new store
    const checkIfModified = checkIfStorePolygonModified(store, skipCheck);
    // Check if the unselected store in editing mode without saving its changes, before unselecting it
    const checkIfCurrentModified = checkIfStorePolygonModifiedForCurrent(
      store,
      skipCheck
    );
    if (checkIfModified || checkIfCurrentModified) {
      // show alert for confirmation
      setModalContent(modalContentData[3]);
      setButtonTxt("Discard");
      setTypeModal(3);
      setIsConfirmOpen(true);
      // dont continue
      return false;
    }
    // check if the store had a polygon
    const polygonStore =
      polygonsArray?.find(
        (itm) => itm?.flowardStore?.storeId === store?.storeId
      ) || null;
    polygonStore?.setPath(
      polygonStore ? polygonStore?.flowardStore?.coordinates : []
    );
    if (polygonStore) {
      // remove the edit polygon style and make editing and dragging false
      onPolygonSelected(polygonStore, false);
    }
    // unselect the store
    setCurrentStore(null);
    setIsExpended(-1);
    selectedStore.current = null;
    setStorePolygons(storeList);
    storePolygonsArr.current = storeList;
    // set the center of the map to selected Store coordinates
    setMapCenter({
      lat: storeList[0]?.coordinates[0]?.lat,
      lng: storeList[0]?.coordinates[0]?.lng,
    });
  };

  const handleSaveStore = async (selectedCurrentStore: any) => {
    const newDataForStore =
      storePolygonsArr.current?.find(
        (itm) => itm?.storeId === selectedCurrentStore?.storeId
      ) || null;
    // check if the store has polygon to avoid edge cases if they happened
    if (newDataForStore?.coordinates?.length > 0) {
      const payload = {
        coordinates: newDataForStore?.coordinates,
      };
      try {
        console.log(newDataForStore);

        const res = await MapMasterService.updateStoresWithPolygon(
          payload,
          newDataForStore?.storeId
        );
        if (res) {
          handleUnSelectStore(selectedCurrentStore, true);
          onStoreSave();
        }
        setIsConfirmOpen(false);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "An Error occured while saving the map data"
        );
      }
    } else {
      toast.error(
        "An Error occured while drawing, please cancel the drawn polygon and draw it again."
      );
    }
  };

  const onPolygonSelected = (polygon: any, selected = false) => {
    polygon.setOptions({
      editable: preview ? false : selected,
      draggable: preview ? false : selected,
      fillColor: selected
        ? validPolygon.current
          ? "#116d87"
          : "#FE3D5E"
        : "#006782CC",
      strokeColor: selected
        ? validPolygon.current
          ? "#116d87"
          : "#FE3D5E"
        : "#006782",
      strokeWeight: selected ? 3 : 1,
    });
  };

  const resetAllPolygonEditable = () => {
    polygonsArray.forEach((polygon) => onPolygonSelected(polygon, false));
  };

  const updateStorePolygonsData = (store: any, coordinates: any) => {
    setStorePolygons((val) => {
      const updatedData = val?.map((storeItem) => {
        if (storeItem.storeId === store.storeId) {
          return {
            ...storeItem,
            coordinates,
          };
        }
        return storeItem;
      });
      storePolygonsArr.current = updatedData;
      return updatedData;
    });
  };

  const convertPolygonArray = (polygon: any) => {
    const latLngs = polygon?.getPath()?.getArray() || [];
    const convertedLatLng = latLngs?.reduce(
      (acc: any, itm: any) =>
        acc.concat({
          lat: itm.lat(),
          lng: itm.lng(),
        }),
      []
    );
    return convertedLatLng;
  };

  const addPolygonsToArray = (polygon: any) => {
    let newArr = [];
    setPolygonsArray((val) => {
      newArr = val.concat(polygon);
      polygonsArr.current = newArr;
      return newArr;
    });
  };

  const updatePolygonsToArray = (polygon: any, store: any) => {
    setPolygonsArray((val) => {
      const updatedData = val?.map((storeItem) => {
        if (storeItem?.flowardStore?.storeId === store.storeId) {
          return polygon;
        }
        return storeItem;
      });
      polygonsArr.current = updatedData;
      return updatedData;
    });
  };

  const clearAllPolygonFromMap = (polygonArrayList: any[] = []) => {
    polygonArrayList?.forEach((itm: any) => itm?.setMap(null));
    setPolygonsArray([]);
    polygonsArr.current = [];
  };

  const onPolygonAdded = (polygon: any, store: any) => {
    const convertedLatLng = convertPolygonArray(polygon);
    updateStorePolygonsData(store, convertedLatLng);
    addPolygonsToArray(polygon);
  };

  const onPolygonUpdate = (polygon: any, store: any) => {
    const convertedLatLng = convertPolygonArray(polygon);
    updateStorePolygonsData(store, convertedLatLng);
    updatePolygonsToArray(polygon, store);
  };

  const initAllStoresPolygonOnMap = (stores: any, map: any, maps: any) => {
    if (!stores?.length || !map || !maps) return;

    clearAllPolygonFromMap(polygonsArray);

    const preloadedPolygons = stores
      .filter((store: any) => store?.coordinates?.length > 0)
      .map((storeItem: any) => {
        const polygon = new maps.Polygon({
          paths: storeItem.coordinates,
          ...polygonOptions,
          flowardStore: storeItem,
        });

        polygon.setMap(map);
        addPolygonListeners(polygon, storeItem, maps);

        return polygon;
      });

    addPolygonsToArray(preloadedPolygons);
  };

  const initDrawingTools = (map: any, maps: any) => {
    // Ensure drawing manager is initialized only once
    if (gMapsDrawingManager) return;

    const drawingManager = new maps.drawing.DrawingManager({
      drawingMode: maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: maps.ControlPosition.TOP_CENTER,
        drawingModes: [maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        ...polygonOptions,
        strokeWeight: 2, // Increase stroke weight for better visibility
        fillOpacity: 0.3, // Reduce fill opacity for better visibility
      },
    });

    drawingManager.setMap(map);
    setGMapsDrawingManager(drawingManager);

    // Add drawing complete listener
    maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      handlePolygonComplete(maps)
    );
  }; // <-- Added missing closing brace for initDrawingTools

  const handlePolygonComplete = (maps: any) => (polygon: any) => {
    const currentSlectedStore = selectedStore.current;
    if (!currentSlectedStore) {
      polygon.setMap(null);
      return;
    }

    polygon.flowardStore = currentSlectedStore;

    // Add event listeners
    addPolygonListeners(polygon, currentSlectedStore, maps);

    // Validate and process new polygon
    calcIntersection(polygon, currentSlectedStore, "add", gMapsDrawingManager);
  };

  const addPolygonListeners = (polygon: any, store: any, maps: any) => {
    polygon.addListener("click", () => handleSelectStore(store));

    polygon.addListener("dragstart", () => {
      polygonDragging.current = true;
    });

    polygon.addListener("dragend", () => {
      polygonDragging.current = false;
      calcIntersection(polygon, store, "update");
    });

    // Path change listeners with debouncing
    const handlePathChange = debounce(() => {
      if (!polygonDragging.current) {
        calcIntersection(polygon, store, "update");
      }
    }, 100);

    maps.event.addListener(polygon.getPath(), "set_at", handlePathChange);
    maps.event.addListener(polygon.getPath(), "insert_at", handlePathChange);
    maps.event.addListener(polygon.getPath(), "remove_at", handlePathChange);
  };

  const handleDrawingToolForStore = (
    drawingManager: any,
    store: any,
    maps: any,
    polygons: any
  ) => {
    if (drawingManager && store && maps) {
      // before enabling polygon tool, we check if a polygon already added for this store or not
      // if added, don't enable polygon againn (to avoid adding multiple polygons to same store)
      const storePolygon = polygons?.find(
        (polygon: any) => polygon?.flowardStore?.storeId === store?.storeId
      );
      const hasPolygon = !!storePolygon;
      resetAllPolygonEditable();

      drawingManager.setOptions({
        drawingMode:
          preview || hasPolygon ? null : gMaps.drawing.OverlayType.POLYGON,
        drawingControlOptions: {
          drawingModes:
            preview || hasPolygon ? [] : [gMaps.drawing.OverlayType.POLYGON],
        },
      });
      if (hasPolygon) {
        onPolygonSelected(storePolygon, true);
      }
    } else if (drawingManager && gMaps) {
      drawingManager.setOptions({
        drawingMode: null,
        drawingControlOptions: {
          drawingModes: [],
        },
      });
    }
  };

  const handleMapApiLoaded = (map: any, maps: any) => {
    if (!map || !maps) return;

    setGMap(map);
    setGMaps(maps);
    setIsLoading(false);

    // Set map options
    map.setOptions({
      minZoom: 10,
      maxZoom: 20,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "greedy",
    });

    // Initialize drawing tools
    initDrawingTools(map, maps);
  };

  const handleFilterReset = () => {
    setSearchText("");
    setMapCenter(defaultCenter);
    if (gMap && gMaps && storeList && storeList.length > 0) {
      initAllStoresPolygonOnMap(storeList, gMap, gMaps);
      setFilteredStores(storeList);
    }
  };

  const handleOpenConfirmSave = () => {
    setModalContent(modalContentData[2]);
    setButtonTxt("Confirm");
    setTypeModal(2);
    setIsConfirmOpen(true);
  };
  //calculate the percentage for not geofenced stores before publish or save as draft
  const handleModalOpen = (typeModal: any) => {
    const modalData = modalContent[typeModal];
    setModalContent(modalData);
    setButtonTxt("Confirm");
    setTypeModal(typeModal);
    setIsConfirmOpen(true);
  };
  const handleOpenConfirmPublish = () => {
    handleModalOpen(0);
  };

  // Add new modal content for radius removal
  const radiusRemovalModalContent = {
    title: "Remove Radius",
    description: "Are you sure you want to remove the radius for this store?",
    type: "warning",
  };

  const handleOpenConfirmRemove = () => {
    setModalContent(radiusRemovalModalContent);
    setButtonTxt("Remove");
    setTypeModal(4); // Using type 4 for radius removal
    setIsConfirmOpen(true);
  };

  const handleRemoveRadius = () => {
    if (currentStore) {
      // Remove polygon from map
      const polygonStore = polygonsArray?.find(
        (itm) => itm?.flowardStore?.storeId === currentStore?.storeId
      );
      if (polygonStore) {
        polygonStore.setMap(null);
        updateStorePolygonsData(currentStore, []);
        setPolygonsArray((prev) => prev.filter((p) => p !== polygonStore));
      }
      
      // Re-enable drawing tools
      if (gMapsDrawingManager && gMaps) {
        gMapsDrawingManager.setOptions({
          drawingMode: gMaps.drawing.OverlayType.POLYGON,
          drawingControlOptions: {
            drawingModes: [gMaps.drawing.OverlayType.POLYGON],
          },
        });
      }
      
      toast.success("Radius removed successfully");
    }
  };

  const handleSave = () => {
    switch (typeModal) {
      case 2:
        handleSaveStore(currentStore);
        break;
      case 3:
        setIsConfirmOpen(false);
        initAllStoresPolygonOnMap(storeList, gMap, gMaps);
        handleUnSelectStore(currentStore, true);
        validPolygon.current = true;
        pendingFunc.func();
        setPendingFunc({
          func: () => null,
        });
        break;
      case 4:
        handleRemoveRadius();
        setIsConfirmOpen(false);
        break;
      default:
        break;
    }
  };

  const handlePlaceSelect = (place: any) => {
    const { geometry } = place;
    const geoLocation = geometry.location;
    const lat = geoLocation.lat();
    const lng = geoLocation.lng();
    setMapCenter({ lat, lng });
  };

  // const toggleMap = (val: any) => {
  //   setMapType(val);
  // };

  // Start of handling overlap polygon
  // const processPoints = (geometry: any, callback: any, thisArg: any) => {
  //   // to convert the polygon from google polygon to jsts polygon
  //   if (window.google && geometry instanceof window.google.maps.LatLng) {
  //     callback.call(thisArg, geometry);
  //   } else if (geometry instanceof window.google.maps.Data.Point) {
  //     callback.call(thisArg, geometry.get());
  //   } else {
  //     geometry.getArray().forEach((g: any) => {
  //       processPoints(g, callback, thisArg);
  //     });
  //   }
  // };

  const createJstsPolygon = (geometryFactory: any, polygon: any) => {
    const gModel = new jsts.geom.PrecisionModel();
    const gReducer = new jsts.precision.GeometryPrecisionReducer(gModel);
    // to convert the polygon from google polygon to jsts polygon
    const path = polygon.getPath();
    const coordinates = path.getArray().map(function name(coord: any) {
      return new jsts.geom.Coordinate(coord.lat(), coord.lng());
    });
    coordinates.push(coordinates[0]);
    const shell = geometryFactory.createLinearRing(coordinates);
    return gReducer.reduce(geometryFactory.createPolygon(shell));
  };

  const calcIntersection = async (
    newPolygon: any,
    currentSlectedStore: any,
    actionType: any,
    drawingManager = gMapsDrawingManager
  ) => {
    if (newPolygon.getPath().getLength() < 3) {
      return;
    }
    const geometryFactory = new jsts.geom.GeometryFactory() as any;
    const newJstsPolygon = createJstsPolygon(geometryFactory, newPolygon);

    // Replace self-intersection check using IsValidOp instead of GeometryGraph and ConsistentAreaTester
    const res = [];
    const isValidOp = new (jsts.operation as any).valid.IsValidOp(
      newJstsPolygon
    );
    if (!isValidOp.isValid()) {
      const error = isValidOp.getValidationError();
      res.push([error.getErrorLocation().x, error.getErrorLocation().y]);
    }
    if (res.length > 0) {
      toast.error("Drawn polygon is overlapping itself, please draw again!");
      newPolygon.setMap(null);
      return true;
    } else {
      // iterate existing polygons and find if a new polygon intersects any of them
      const result = polygonsArr.current.filter((currentOverlay) => {
        if (
          currentOverlay?.flowardStore?.StoreId === currentSlectedStore?.StoreId
        )
          return false;
        const curPolygon = createJstsPolygon(geometryFactory, currentOverlay);
        const intersection = newJstsPolygon.intersection(curPolygon);
        return intersection.isEmpty() == false;
      });
      // if new polygon intersects any of exiting ones
      if (result.length > 0) {
        let interactedPolygon: any = createJstsPolygon(
          geometryFactory,
          result[0]
        );
        if (result.length > 1) {
          for (let unionInd = 1; unionInd < result.length; unionInd++) {
            const newPol = createJstsPolygon(geometryFactory, result[unionInd]);
            interactedPolygon = interactedPolygon.union(newPol);
          }
        }
        // check the type of polygon after removing the shared space
        try {
          const diff: any = newJstsPolygon.difference(
            interactedPolygon.union()
          );
          const resultType = diff.getGeometryType();
          switch (resultType) {
            case "Polygon":
              // if type is polygon then draw this new polygong
              const exteriorRing = diff.getExteriorRing();
              const numPoints = exteriorRing.getNumPoints();
              if (numPoints === 0) {
                toast.error("Please move the polygon outside!");
                validPolygon.current = false;
                if (actionType === "add") {
                  onPolygonAdded(newPolygon, currentSlectedStore);
                }
                if (actionType === "update") {
                  onPolygonUpdate(newPolygon, currentSlectedStore);
                }
                return false;
              } else {
                const coordinates = [];
                for (let i = 0; i < numPoints; i++) {
                  const point = exteriorRing.getPointN(i);
                  const obj = {
                    lat: point.getX(),
                    lng: point.getY(),
                  };
                  coordinates.push(obj);
                }
                newPolygon.setPath(coordinates);
                validPolygon.current = true;
                if (actionType === "add") {
                  onPolygonAdded(newPolygon, currentSlectedStore);
                  // addListnersAfterUpdate(newPolygon, currentSlectedStore);
                }
                if (actionType === "update") {
                  onPolygonUpdate(newPolygon, currentSlectedStore);
                  console.log("lister after update");

                  // addListnersAfterUpdate(newPolygon, currentSlectedStore);
                }
              }
              break;
            case "MultiPolygon":
              // if type is multi polygon then color it with red and disable saving
              toast.error("Too many overlaping, please draw again!");
              validPolygon.current = false;
              if (actionType === "add") {
                onPolygonAdded(newPolygon, currentSlectedStore);
              }
              if (actionType === "update") {
                onPolygonUpdate(newPolygon, currentSlectedStore);
              }
              break;
            default:
              // to handle edge cases same as multipolygon
              toast.error("Too many overlaping, please draw again!");
              validPolygon.current = false;
              if (actionType === "add") {
                onPolygonAdded(newPolygon, currentSlectedStore);
              }
              if (actionType === "update") {
                onPolygonUpdate(newPolygon, currentSlectedStore);
              }
              break;
          }
          if (actionType === "add") {
            drawingManager.setOptions({
              drawingMode: null,
              drawingControlOptions: {
                drawingModes: [],
              },
            });
          }
          return false;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
          // to do if add keep this if edit set previous polygon
          toast.error("Some error occurred, please draw again!");
          newPolygon.setMap(null);
          return true;
        }
      }
      validPolygon.current = true;
      if (actionType === "add") {
        onPolygonAdded(newPolygon, currentSlectedStore);
      }
      if (actionType === "update") {
        onPolygonUpdate(newPolygon, currentSlectedStore);
      }
      return false;
    }
  };
  // End of handling overlap polygon

  // initialize drawing tool once we have google maps initiallized
  useEffect(() => {
    if (gMap && gMaps) {
      initDrawingTools(gMap, gMaps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gMap, gMaps]);

  useEffect(() => {
    if (gMap && gMaps && storeList && storeList.length > 0) {
      setGeofencedMapCount(
        storeList?.filter((s) => s?.coordinates?.length > 0)?.length || 0
      );
      setStorePolygons(storeList);
      storePolygonsArr.current = storeList;
      initAllStoresPolygonOnMap(storeList, gMap, gMaps);
      setFilteredStores(storeList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gMap, gMaps, storeList]);

  // Toggle Drawing tool once a store is selected and we have initialized
  useEffect(() => {
    handleDrawingToolForStore(
      gMapsDrawingManager,
      currentStore,
      gMaps,
      polygonsArray
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gMapsDrawingManager, currentStore, gMaps, polygonsArray]);

  //when switch between Stores or when land for the first time to the master map page
  useEffect(() => {
    if (window.google && !isLoading) {
      const location = new window.google.maps.LatLng(
        mapCenter?.lat || defaultCenter.lat,
        mapCenter?.lng || defaultCenter.lng
      );
      const geocoder = new window.google.maps.Geocoder();

      // Reverse geocode the location to get the address components
      geocoder.geocode(
        {
          location: location,
        },
        (results: any, status: any) => {
          if (status === "OK") {
            // Find the country component in the address
            const countryComponent = results[0].address_components.find(
              (component: any) => {
                return component.types.includes("country");
              }
            );
            // Get the country name from the component
            const countryName = countryComponent?.short_name;
            // set the short name fpr restriction component map
            setRestrictionMapCountry(countryName);
          } else {
            // eslint-disable-next-line no-console
            console.error("Geocoder failed:", status);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (gMap && restrictionMapCountry && window.google) {
      const input = searchRef.current;
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: restrictionMapCountry },
        fields: ["name", "geometry.location", "place_id", "address_components"],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        handlePlaceSelect(place);
      });
    }
  }, [gMap, gMaps, restrictionMapCountry]);

  // Add new hook to automatically select the first item in the store list if none is selected
  useEffect(() => {
    if (!currentStore && storeList.length > 0) {
      handleSelectStore(storeList[0]);
      setMapCenter({
        lat: storeList[0]?.coordinates[0]?.lat,
        lng: storeList[0]?.coordinates[0]?.lng,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeList, currentStore]);

  return (
    <>
      {isConfirmOpen && (
        <AppErrorBoundary>
          <SaveConfirmationModal
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            handleSave={handleSave}
            modalContent={modalContent}
            buttonTxt={buttonTxt}
          />
        </AppErrorBoundary>
      )}
      <div className="page-wrapper">
        <AppErrorBoundary>
          <div className="bg-base-100 shadow rounded p-4 mb-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  ref={searchRef}
                  defaultValue={searchText}
                  placeholder="Search on Map"
                  className="w-full h-full p-2 border border-base-300 rounded"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleFilterReset}
                  color="primary"
                  className="h-full"
                  startIcon={
                    <>
                      <Icon icon={Resync} />
                    </>
                  }
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </AppErrorBoundary>
        <div className="flex flex-wrap flex-row">
          <div className="flex shrink-0  min-h-full w-1/4">
            {/* Only render store list once All google maps api have been loaded */}
            {gMap && gMaps && gMapsDrawingManager ? (
              <AppErrorBoundary>
                <StoreList
                  isDisabled={geofencedMapCount === 0}
                  stores={fitleredStores}
                  selectStorePolygon={handleSelectStore}
                  currentStore={currentStore}
                  handleSaveStore={handleOpenConfirmSave}
                  unselectStorePolygon={handleUnSelectStore}
                  handleSavePublish={handleOpenConfirmPublish}
                  preview={preview}
                  isExpended={isExpended}
                  polygonsArray={polygonsArray}
                  validPolygon={validPolygon}
                  handleRemoveRadius={handleRemoveRadius}
                  handleOpenConfirmRemove={handleOpenConfirmRemove}
                />
              </AppErrorBoundary>
            ) : null}
          </div>
          <div className="relative flex grow">
            <AppErrorBoundary>
              <GoogleMapReact
                style={{ height: "560px" }}
                ref={mapRef}
                center={mapCenter}
                bootstrapURLKeys={{
                  key: googleMapsAPI,
                  libraries: ["visualization", "drawing", "places"],
                }}
                defaultCenter={defaultCenter}
                defaultZoom={8}
                yesIWantToUseGoogleMapApiInternals
                options={{
                  fullscreenControl: false,
                  zoomControl: true,
                  mapTypeControl: true,
                  scaleControl: true,
                  streetViewControl: false,
                  rotateControl: false,
                  clickableIcons: false,
                }}
                onGoogleApiLoaded={({ map, maps }) =>
                  handleMapApiLoaded(map, maps)
                }
                heatmapLibrary={mapType !== "map"}
                heatmap={{
                  positions: heatArray,
                  options: {
                    radius: 30,
                    opacity: 0.9,
                  },
                }}
              />
            </AppErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonMapMaster;
