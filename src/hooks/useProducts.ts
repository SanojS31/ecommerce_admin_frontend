import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export interface VariantAttributes {
  size?: string;
  ageGroup?: string;
  color?: string;
}

export interface Variant {
  _id: string;
  attributes: VariantAttributes;
  stock: number;
  price: number;
  sku?: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  category: { _id: string; name: string };
  brand: { _id: string; name: string };
  options: string[];
  variants: Variant[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
}

async function getProducts() {
  const res = await httpClient.get(adminApiRoutes.product.base);
  return res.data;
}

async function getProductById(id: string) {
  const res = await httpClient.get(adminApiRoutes.product.getById(id));
  return res.data;
}

async function createProduct(formData: FormData) {
  const res = await httpClient.post(
    adminApiRoutes.product.create,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function updateProduct({ id, formData }: { id: string; formData: FormData }) {
  const res = await httpClient.put(
    adminApiRoutes.product.update(id),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}

async function toggleProduct(id: string) {
  const res = await httpClient.patch(adminApiRoutes.product.toggle(id));
  return res.data;
}

async function addVariant({
  productId,
  data,
}: {
  productId: string;
  data: { attributes: VariantAttributes; stock: number; price: number; sku?: string };
}) {
  const res = await httpClient.post(
    adminApiRoutes.product.addVariant(productId),
    data
  );
  return res.data;
}

async function updateVariant({
  productId,
  variantId,
  data,
}: {
  productId: string;
  variantId: string;
  data: Partial<{ attributes: VariantAttributes; stock: number; price: number; sku: string }>;
}) {
  const res = await httpClient.put(
    adminApiRoutes.product.updateVariant(productId, variantId),
    data
  );
  return res.data;
}

async function toggleVariant({
  productId,
  variantId,
}: {
  productId: string;
  variantId: string;
}) {
  const res = await httpClient.patch(
    adminApiRoutes.product.toggleVariant(productId, variantId)
  );
  return res.data;
}

export function useGetProducts() {
  return useQuery({ queryKey: ["products"], queryFn: getProducts });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["products", vars.id] });
    },
  });
}

export function useToggleProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useAddVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addVariant,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["products", vars.productId] });
    },
  });
}

export function useUpdateVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateVariant,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["products", vars.productId] });
    },
  });
}

export function useToggleVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleVariant,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["products", vars.productId] });
    },
  });
}