"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap as GMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Button } from "@app/ui/Button";
import { AppLoader } from "@app/ui/AppLoader";
import { Icon } from "@app/ui/Icon";

const containerStyle = {
  width: "100%",
  height: "400px",
};

type Coords = {
  lat: number;
  lng: number;
};
declare global {
  interface Window {
    google: any;
  }
}
const GOOGLE_MAP_LIBRARIES: (
  | "places"
  | "drawing"
  | "geometry"
  | "visualization"
)[] = ["places"];
interface GoogleMapProps {
  apiKey?: string;
  center: Coords;
  zoom?: number;
  countryCode?: string;
  markerImage?: string;
  showPlacesAutoComplete?: boolean;
  showMarker?: boolean;
  defaultToMyLocation?: boolean;
  onLatLngChanged?: (coords: Coords, address?: string) => void;
  onConfirm?: (coords: Coords, address: string) => void;
  setAddressInfo?: any;
  viewOnly?: boolean;
  addressInfo?: any;
  initialAddress?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY || "",
  center,
  zoom = 16,
  countryCode = "QA",
  markerImage,
  showPlacesAutoComplete = true,
  showMarker = true,
  defaultToMyLocation = false,
  onLatLngChanged,
  onConfirm,
  setAddressInfo,
  viewOnly,
  addressInfo,
  initialAddress,
}) => {
  const [position, setPosition] = useState<Coords>(center);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAP_LIBRARIES,
    region: countryCode,
  });

  const onLoadMap = useCallback((map: google.maps.Map) => {
    setMapRef(map);
    if (defaultToMyLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        map.setCenter(coords);
        handleReverseGeocode(coords);
      });
    }
  }, []);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPosition(coords);
      mapRef?.panTo(coords);
      handleReverseGeocode(coords);
    }
  };
  const handleMyLocationClick = () => {
    try {
      navigator.geolocation.getCurrentPosition((myLocation) => {
        const { latitude: lat, longitude: lng } = myLocation.coords;
        const coords = { lat, lng };
        setPosition(coords);
        mapRef?.panTo(coords);
        handleReverseGeocode(coords);
      });
    } catch (err) {
      // log the error
    }
  };
  const handleReverseGeocode = (coords: Coords) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        setCurrentAddress(address); // Update the current address state
        setAddressInfo({ lat: coords.lat, lng: coords.lng, address });
        onLatLngChanged?.(coords, address);
      }
    });
  };

  useEffect(() => {
    if (addressInfo?.lat && addressInfo?.lng) {
      setPosition({ lat: addressInfo.lat, lng: addressInfo.lng });
    }
  }, [addressInfo]);

  useEffect(() => {
    if (initialAddress) {
      setCurrentAddress(initialAddress);
    }
  }, [initialAddress]);

  return (
    <>
      {isLoaded ? (
        <div className="relative">
          {showPlacesAutoComplete && (
            <div className="flex items-center w-full gap-2 mb-4">
              <div className="flex-1">
                <Autocomplete
                  onLoad={(ac) => (autocompleteRef.current = ac)}
                  onPlaceChanged={onPlaceChanged}
                  options={{
                    componentRestrictions: { country: "QA" },
                  }}
                >
                  <input
                    type="text"
                    placeholder="search here..."
                    className="bg-input h-10 hover:bg-input-hover focus:bg-input-hover placeholder:text-text-tertiary w-full border p-2 focus:outline-none focus:ring-0 appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </Autocomplete>
              </div>
              <button
                className="h-10 w-10 flex items-center justify-center border bg-input hover:bg-input-hover"
                type="button"
                onClick={handleMyLocationClick}
              >
                <Icon icon="lucide:map-pin" className="text-black w-5 h-5" />
              </button>
            </div>
          )}

          <GMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={zoom}
            onLoad={onLoadMap}
            options={{
              fullscreenControl: false,
            }}
            onClick={(e) => {
              const coords = {
                lat: e.latLng?.lat() || 0,
                lng: e.latLng?.lng() || 0,
              };
              setPosition(coords);
              handleReverseGeocode(coords);
            }}
          >
            {showMarker && (
              <Marker
                position={position}
                draggable={!viewOnly}
                icon={markerImage}
                onDragEnd={(e) => {
                  const coords = {
                    lat: e.latLng?.lat() || 0,
                    lng: e.latLng?.lng() || 0,
                  };
                  setPosition(coords);
                  handleReverseGeocode(coords);
                }}
              />
            )}
          </GMap>
          <div className="absolute bottom-2 w-full flex flex-col justify-center p-3">
            <div className="bg-white w-full p-4 shadow-large rounded-md space-y-3">
              <p className="text-sm text-gray-500">
                Address: {currentAddress || "No address selected"}
              </p>
              <Button
                onClick={() => {
                  onConfirm?.(position, currentAddress);
                  setAddressInfo({
                    lat: position.lat,
                    lng: position.lng,
                    address: currentAddress,
                  });
                }}
                disabled={!position.lat || !position.lng || !currentAddress}
                color="primary"
                className="w-full"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <AppLoader />
        </div>
      )}
    </>
  );
};
