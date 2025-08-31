import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
//api
import { AuthService } from "@app/services/actions";
import { LocalStorageKeys } from "@app/lib/helpers/constants/helpers";
import LocalStorageManager from "@app/localStore/LocalStorageManger";
import { useToast } from "@app/helpers/hooks/use-toast";
import { routes } from "@app/lib/routes";

interface AuthState {
  decodedToken: any;
  refreshToken: string;
  isLoading: boolean;
}

interface LoginUserPayload {
  email: string;
  password: string;
}

const initialState: AuthState = {
  decodedToken: (() => {
    try {
      const token = LocalStorageManager.getItem(LocalStorageKeys.TOKEN);
      return token ? jwtDecode(token) : "";
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      // Clear invalid token
      LocalStorageManager.removeItem(LocalStorageKeys.TOKEN);
      return "";
    }
  })(),
  refreshToken:
    LocalStorageManager.getItem(LocalStorageKeys.REFRESHTOKEN) || "",
  isLoading: false,
};
export const setLoginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginUserPayload) => {
    const bodyData = {
      email,
      password,
    };
    const toast = useToast();

    try {
      const res = await AuthService.getLoginUser(bodyData);
      toast.success("Logged in successfully");
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to login");
      throw err;
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserPermissions: (state: any, action) => {
      state.userPermissions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setLoginUser.fulfilled, (state, action) => {
        LocalStorageManager.setItem(
          LocalStorageKeys.TOKEN,
          action.payload.accessToken
        );
        LocalStorageManager.setItem(
          LocalStorageKeys.REFRESHTOKEN,
          action.payload.refreshToken
        );
        state.isLoading = false;
        window.location.href = routes.dashboard.creators.index;
      })
      .addCase(setLoginUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export const { setUserPermissions } = authSlice.actions;
export default authSlice.reducer;
