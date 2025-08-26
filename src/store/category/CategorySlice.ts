import { CategoryService } from "@app/services/actions";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//api

type Category = {
  id: number;
  title: string;
  parentTitle: string;
};

type CountriesState = {
  categoryList: Category[];
  isLoading: boolean;
};

const initialState: CountriesState = {
  categoryList: [],
  isLoading: false,
};

export const setCategoryList = createAsyncThunk(
  "Category/se",
  async ({ type = 1 }: { type?: number }) => {
    const body = {
      type,
    };  
    try {
      const res = await CategoryService.getCategoryList({});
      return res.data as Category[];
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ?? "Failed to get category list";

      throw new Error(errorMessage);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setCategoryList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        setCategoryList.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          
          state.categoryList = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(setCategoryList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default categorySlice.reducer;
