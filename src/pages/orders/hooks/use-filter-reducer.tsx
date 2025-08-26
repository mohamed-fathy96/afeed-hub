import { useReducer } from "react";

// Define initial state
const initialState = {
  storesList: [] as any[],
  citiesList: [] as any[],
  orderCounts: {} as any,
  selectedStore: null as any | null,
  selectedCity: null as number | null,
  isLoaderOpen: false,
  isLoading: false,
};

// Define actions
type Action =
  | { type: "SET_STORES_LIST"; payload: any[] }
  | { type: "SET_CITIES_LIST"; payload: any[] }
  | { type: "SET_ORDER_COUNTS"; payload: any[] }
  | { type: "SET_CITY_ROLES"; payload: any[] }
  | { type: "SET_SELECTED_STORE"; payload: any | null }
  | { type: "SET_SELECTED_CITY"; payload: number | null }
  | { type: "SET_IS_LOADER_OPEN"; payload: boolean }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_OPEN_MODAL"; payload: boolean };

// Reducer function
const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_STORES_LIST":
      return { ...state, storesList: action.payload };
    case "SET_CITIES_LIST":
      return { ...state, citiesList: action.payload };
    case "SET_ORDER_COUNTS":
      return { ...state, orderCounts: action.payload };
    case "SET_SELECTED_STORE":
      return { ...state, selectedStore: action.payload };

    case "SET_SELECTED_CITY":
      return { ...state, selectedCity: action.payload };
    case "SET_IS_LOADER_OPEN":
      return { ...state, isLoaderOpen: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_OPEN_MODAL":
      return { ...state, openModal: action.payload };
    default:
      return state;
  }
};

// Custom hook
const useFilterReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export default useFilterReducer;
