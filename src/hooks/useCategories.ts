import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

async function getCategories() {
  const res = await httpClient.get(adminApiRoutes.category.base);
  return res.data;
}

async function createCategory(formData: FormData) {
  const res = await httpClient.post(
    adminApiRoutes.category.create,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function updateCategory({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const res = await httpClient.put(
    adminApiRoutes.category.update(id),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function toggleCategory(id: string) {
  const res = await httpClient.patch(adminApiRoutes.category.toggle(id));
  return res.data;
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useToggleCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}