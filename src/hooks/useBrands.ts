import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

async function getBrands() {
  const res = await httpClient.get(adminApiRoutes.brand.base);
  return res.data;
}

async function createBrand(formData: FormData) {
  const res = await httpClient.post(
    adminApiRoutes.brand.create,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function updateBrand({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const res = await httpClient.put(
    adminApiRoutes.brand.update(id),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function toggleBrand(id: string) {
  const res = await httpClient.patch(adminApiRoutes.brand.toggle(id));
  return res.data;
}

export function useGetBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
}

export function useToggleBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleBrand,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
}