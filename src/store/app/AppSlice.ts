import { createSlice } from '@reduxjs/toolkit';

// Define the type for the state
interface AppState {
  isLoaderOpen: boolean;
}

// Initial state
const initialState: AppState = {
  isLoaderOpen: false,
};

// Create a slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openLoader: (state) => {
      state.isLoaderOpen = true;
    },
    closeLoader: (state) => {
      state.isLoaderOpen = false;
    },
  },
});

// Destructure and export the actions
export const { openLoader, closeLoader } = appSlice.actions;

// Export the reducer
export default appSlice.reducer;
