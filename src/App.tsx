import { Outlet } from "react-router-dom";
import { LayoutContextProvider } from "./store/globale/layout";
import AdminLayout from "./components/layout/(layout)";
import { Toaster } from "sonner";
import {
  isAuthenticated,
  LocalStorageKeys,
} from "@app/lib/helpers/constants/helpers";
import PermissionsService from "./services/actions/permissionService";
import { useEffect } from "react";
import LocalStorageManager from "./localStore/LocalStorageManger";
import { useAppDispatch } from "./lib/hooks/useStore";
import { setUserPermissions } from "./store/auth/AuthSlice";
import { useToast } from "./helpers/hooks/use-toast";
import { GlobalContextProvider } from "./store/globale/global";
import { Theme } from "./ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  const appTitle = import.meta.env.VITE_APP_NAME || "Afeed Dashboard";
  const permissionFromLocalStorage = LocalStorageManager.getItem(
    LocalStorageKeys.PERMISSIONS
  );
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  });
  document.title = appTitle;
  const toast = useToast();
  const dispatch = useAppDispatch();
  const fetchUserPermissions = async () => {
    try {
      const res = await PermissionsService.getUserPermissions();
      dispatch(setUserPermissions(res.data));
      LocalStorageManager.setItem(LocalStorageKeys.PERMISSIONS, res.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get user permissions"
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated() && !permissionFromLocalStorage) {
      fetchUserPermissions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <GlobalContextProvider>
          <LayoutContextProvider>
            {isAuthenticated() ? (
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            ) : (
              <Outlet />
            )}
          </LayoutContextProvider>
          <Toaster className="toaster-container" richColors />
        </GlobalContextProvider>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;
