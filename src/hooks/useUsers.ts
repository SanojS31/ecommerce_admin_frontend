import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  addresses: any[];
  createdAt: string;
}

async function getAllUsers() {
  const res = await httpClient.get(adminApiRoutes.user.base);
  return res.data;
}

async function getUserById(id: string) {
  const res = await httpClient.get(adminApiRoutes.user.getById(id));
  return res.data;
}

async function getUserOrders(id: string) {
  const res = await httpClient.get(adminApiRoutes.user.getOrders(id));
  return res.data;
}

async function blockUser(id: string) {
  const res = await httpClient.patch(adminApiRoutes.user.block(id));
  return res.data;
}

async function unblockUser(id: string) {
  const res = await httpClient.patch(adminApiRoutes.user.unblock(id));
  return res.data;
}

export function useGetAllUsers() {
  return useQuery({ queryKey: ["users"], queryFn: getAllUsers });
}

export function useGetUserById(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

export function useGetUserOrders(id: string) {
  return useQuery({
    queryKey: ["users", id, "orders"],
    queryFn: () => getUserOrders(id),
    enabled: !!id,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}