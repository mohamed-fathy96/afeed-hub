import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { setBaseUrl } from "./SetBaseUrl";
import i18n from "@app/../i18nextConf";
import LocalStorageManager from "@app/localStore/LocalStorageManger";
import { LocalStorageKeys } from "@app/lib/helpers/constants/helpers";
import { routes } from "@app/lib/routes";
import { jwtDecode } from "jwt-decode";

const base = setBaseUrl();

export const apiGatewayService = axios.create({
  baseURL: base.gateway,
});

// Decode JWT to get expiration time
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    return exp <= currentTime + 60; // Check if token will expire in the next 1 minute
  } catch {
    return true; // Treat invalid tokens as expired
  }
};

// Refresh token logic
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const onAccessTokenRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = LocalStorageManager.getItem(
    LocalStorageKeys.REFRESHTOKEN
  );
  const accessToken = LocalStorageManager.getItem(LocalStorageKeys.TOKEN);

  if (!refreshToken || !accessToken) return null;

  try {
    const response = await axios.post(
      `${base.gateway}identity/api/hub/Account/refresh-token`,
      { refreshToken, accessToken },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": i18n.language || "en",
          Authorization: `Bearer ${accessToken}`,
          "x-store-id":
            LocalStorageManager.getItem(LocalStorageKeys.STOREID) || "1",
        },
      }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    // Store new tokens
    LocalStorageManager.setItem(LocalStorageKeys.TOKEN, newAccessToken);
    LocalStorageManager.setItem(LocalStorageKeys.REFRESHTOKEN, newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.clear();
    window.location.href = routes.auth.login;
    return null;
  }
};

// Request interceptor
const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  let token = LocalStorageManager.getItem(LocalStorageKeys.TOKEN);

  if (token && isTokenExpired(token)) {
    if (!isRefreshing) {
      isRefreshing = true;
      token = await refreshAccessToken();
      isRefreshing = false;
      onAccessTokenRefreshed(token);
    } else {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          if (config.headers && newToken) {
            config.headers["Authorization"] = `Bearer ${newToken}`;
          }
          resolve(config);
        });
      });
    }
  }

  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["accept-language"] = i18n.language || "en";
    config.headers["x-store-id"] =
      LocalStorageManager.getItem(LocalStorageKeys.STOREID) || "1";
  }
  return config;
};

// Response interceptor error
const responseInterceptorError = async (
  error: AxiosError
): Promise<AxiosError> => {
  if (error.response && error.response.status === 401) {
    // Unauthorized - clear tokens and redirect to login
    localStorage.clear();
    window.location.href = routes.auth.login;
  }
  return Promise.reject(error);
};

// Add interceptors
apiGatewayService.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
apiGatewayService.interceptors.response.use(
  (response) => response,
  responseInterceptorError
);
