import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export interface StoreConfig {
  upiId: string;
  upiName: string;
  qrCodeImage: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  isActive: boolean;
}

async function getStoreConfig() {
  const res = await httpClient.get(adminApiRoutes.storeConfig.get);
  return res.data;
}

async function updateStoreConfig(formData: FormData) {
  const res = await httpClient.put(
    adminApiRoutes.storeConfig.update,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

export function useGetStoreConfig() {
  return useQuery({ queryKey: ["store-config"], queryFn: getStoreConfig });
}

export function useUpdateStoreConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateStoreConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store-config"] }),
  });
}