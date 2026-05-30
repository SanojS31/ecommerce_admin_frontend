import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export type PurchaseCategory = "goods" | "accessories" | "expense";
export type PurchasePaymentMethod =
  | "cash"
  | "upi"
  | "bank_transfer"
  | "card"
  | "other";

export interface PurchaseDetail {
  _id: string;
  category: PurchaseCategory;
  itemName: string;
  vendor?: string;
  purchaseDate: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
  paymentMethod: PurchasePaymentMethod;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseDetailPayload {
  category: PurchaseCategory;
  itemName: string;
  vendor?: string;
  purchaseDate: string;
  quantity: number;
  unitCost: number;
  paymentMethod: PurchasePaymentMethod;
  notes?: string;
}

export interface PurchaseDetailFilters {
  startDate?: string;
  endDate?: string;
}

async function getPurchaseDetails(filters?: PurchaseDetailFilters) {
  const params = new URLSearchParams();
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);

  const query = params.toString();
  const res = await httpClient.get(
    query
      ? `${adminApiRoutes.purchaseDetail.base}?${query}`
      : adminApiRoutes.purchaseDetail.base
  );
  return res.data;
}

async function createPurchaseDetail(data: PurchaseDetailPayload) {
  const res = await httpClient.post(adminApiRoutes.purchaseDetail.create, data);
  return res.data;
}

async function updatePurchaseDetail(data: {
  id: string;
  payload: PurchaseDetailPayload;
}) {
  const res = await httpClient.put(
    adminApiRoutes.purchaseDetail.update(data.id),
    data.payload
  );
  return res.data;
}

async function deletePurchaseDetail(id: string) {
  const res = await httpClient.delete(adminApiRoutes.purchaseDetail.delete(id));
  return res.data;
}

export function useGetPurchaseDetails(filters?: PurchaseDetailFilters) {
  return useQuery({
    queryKey: ["purchase-details", filters],
    queryFn: () => getPurchaseDetails(filters),
  });
}

export function useCreatePurchaseDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPurchaseDetail,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-details"] }),
  });
}

export function useUpdatePurchaseDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePurchaseDetail,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-details"] }),
  });
}

export function useDeletePurchaseDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePurchaseDetail,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-details"] }),
  });
}
