import type { Coords, MapOptions } from "google-map-react";
export interface GoogleMapProps {
  __T: (key: string) => string;
  apiKey?: string;
  children?: React.ReactNode;
  zoom?: number;
  center?: Coords;
  onAPILoaded?(maps: { map: any; maps: any; ref: Element | null }): void;
  mapOptions?: MapOptions;
  libraries?: string[] | string | undefined;
  showMarker?: boolean;
  showPlacesAutoComplete?: boolean;
  onLatLngChanged?(latLng: Coords, address?: any): any;
  markerImage?: string;
  countryCode?: string;
  searchInputName?: string;
  searchInputPlaceholder?: string;
  defaultToMyLocation?: boolean;
  setAddressInfo?: any;
  viewOnly?: boolean;
  addressInfo?: any;
}
