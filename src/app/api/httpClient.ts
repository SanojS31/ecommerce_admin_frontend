import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminAccessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminRefreshToken");
}

function saveTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("adminAccessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("adminRefreshToken", refreshToken);
  }
}

function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminData");
}

function redirectToLogin() {
  if (
    typeof window === "undefined" ||
    window.location.pathname.includes("/login")
  )
    return;
  window.location.href = "/login";
}

let refreshTokenRequest: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  if (!refreshTokenRequest) {
    refreshTokenRequest = axios
      .post(
        "/api/admin/auth/refresh-token",
        { refreshToken },
        { baseURL: API_BASE_URL, withCredentials: true }
      )
      .then((res) => {
        const { accessToken, refreshToken: newRefresh } = res.data;
        saveTokens(accessToken, newRefresh);
        return accessToken;
      })
      .finally(() => {
        refreshTokenRequest = null;
      });
  }

  return refreshTokenRequest;
}

// Request interceptor — attach token
httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      try {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();
        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        originalRequest.headers = headers;
        return httpClient(originalRequest);
      } catch {
        clearAuth();
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      clearAuth();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export { saveTokens, clearAuth, getAccessToken };
export default httpClient;
