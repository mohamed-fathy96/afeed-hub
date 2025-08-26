import { useReducer } from "react";

// Define initial state
const initialState = {
  storesList: [] as any[],
  groups: [] as any[],
  cityRoles: [] as any[],
  selectedStore: null as any | null,
  selectedGroupId: null as number | null,
  selectedCityRole: null as any | null,
  isLoaderOpen: false,
  isLoading: false,
  openModal: false,
};

// Define actions
type Action =
  | { type: "SET_STORES_LIST"; payload: any[] }
  | { type: "SET_GROUPS"; payload: any[] }
  | { type: "SET_CITY_ROLES"; payload: any[] }
  | { type: "SET_SELECTED_STORE"; payload: any | null }
  | { type: "SET_SELECTED_GROUP_ID"; payload: number | null }
  | { type: "SET_SELECTED_CITY_ROLE"; payload: number | null }
  | { type: "SET_IS_LOADER_OPEN"; payload: boolean }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_OPEN_MODAL"; payload: boolean };

// Reducer function
const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_STORES_LIST":
      return { ...state, storesList: action.payload };
    case "SET_GROUPS":
      return { ...state, groups: action.payload };
    case "SET_CITY_ROLES":
      return { ...state, cityRoles: action.payload };
    case "SET_SELECTED_STORE":
      return { ...state, selectedStore: action.payload };
    case "SET_SELECTED_GROUP_ID":
      return { ...state, selectedGroupId: action.payload };
    case "SET_SELECTED_CITY_ROLE":
      return { ...state, selectedCityRole: action.payload };
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
const useRolesReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export default useRolesReducer;
