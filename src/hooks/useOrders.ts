import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export interface OrderItem {
  product: string;
  variant: string;
  name: string;
  image: string;
  attributes: Record<string, string>;
  price: number;
  quantity: number;
}

export interface PaymentProof {
  utrNumber: string;
  note?: string;
  submittedAt: string;
}

export interface StatusHistory {
  status: string;
  updatedAt: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user?: { _id: string; name: string; email: string; phone: string };
  manualCustomer?: { name: string; phone: string; email?: string };
  isManualOrder: boolean;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentProof?: PaymentProof;
  orderStatus: string;
  statusHistory: StatusHistory[];
  createdAt: string;
}

async function getAllOrders() {
  const res = await httpClient.get(adminApiRoutes.order.base);
  return res.data;
}

async function getOrderById(id: string) {
  const res = await httpClient.get(adminApiRoutes.order.getById(id));
  return res.data;
}

async function getPendingPayments() {
  const res = await httpClient.get(adminApiRoutes.order.pendingPayments);
  return res.data;
}

async function updateOrderStatus({
  id,
  status,
  note,
}: {
  id: string;
  status: string;
  note?: string;
}) {
  const res = await httpClient.patch(adminApiRoutes.order.updateStatus(id), {
    status,
    note,
  });
  return res.data;
}

async function approvePayment({ id, note }: { id: string; note?: string }) {
  const res = await httpClient.patch(
    adminApiRoutes.order.approvePayment(id),
    { note }
  );
  return res.data;
}

async function rejectPayment({ id, note }: { id: string; note?: string }) {
  const res = await httpClient.patch(
    adminApiRoutes.order.rejectPayment(id),
    { note }
  );
  return res.data;
}

async function createManualOrder(data: any) {
  const res = await httpClient.post(adminApiRoutes.order.createManual, data);
  return res.data;
}

export function useGetAllOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: getAllOrders });
}

export function useGetOrderById(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useGetPendingPayments() {
  return useQuery({
    queryKey: ["orders", "pending-payments"],
    queryFn: getPendingPayments,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["orders", vars.id] });
    },
  });
}

export function useApprovePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approvePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useRejectPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateManualOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createManualOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}