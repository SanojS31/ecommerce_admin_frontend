import { useMutation } from "@tanstack/react-query";
import httpClient, { saveTokens, clearAuth } from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";
import { useRouter } from "next/navigation";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  msg: string;
  accessToken: string;
  refreshToken: string;
  admin: AdminData;
}

async function adminLogin(payload: AdminLoginPayload) {
  const res = await httpClient.post<AdminLoginResponse>(
    adminApiRoutes.auth.login,
    payload
  );
  return res.data;
}

async function adminLogout() {
  const res = await httpClient.post(adminApiRoutes.auth.logout);
  return res.data;
}

export function useAdminLogin() {
  const router = useRouter();

  return useMutation<AdminLoginResponse, unknown, AdminLoginPayload>({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      router.push("/dashboard");
    },
  });
}

export function useAdminLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: adminLogout,
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
    onError: () => {
      clearAuth();
      router.push("/login");
    },
  });
}