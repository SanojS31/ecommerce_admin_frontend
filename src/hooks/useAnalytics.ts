import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/api/httpClient";
import { adminApiRoutes } from "@/utils/constants";

async function getOverview() {
  const res = await httpClient.get(adminApiRoutes.analytics.overview);
  return res.data;
}

async function getRecentOrders(
  limit: number,
  filters?: { startDate?: string; endDate?: string }
) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);

  const res = await httpClient.get(
    `${adminApiRoutes.analytics.recentOrders}?${params.toString()}`
  );
  return res.data;
}

async function getMonthlySales(year: number) {
  const res = await httpClient.get(
    `${adminApiRoutes.analytics.salesChart}?year=${year}`
  );
  return res.data;
}

async function getTopProducts(limit: number) {
  const res = await httpClient.get(
    `${adminApiRoutes.analytics.topProducts}?limit=${limit}`
  );
  return res.data;
}

async function getOrderStatusBreakdown() {
  const res = await httpClient.get(adminApiRoutes.analytics.orderStatus);
  return res.data;
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: getOverview,
  });
}

export function useRecentOrders(
  limit = 10,
  filters?: { startDate?: string; endDate?: string }
) {
  return useQuery({
    queryKey: ["analytics", "recent-orders", limit, filters],
    queryFn: () => getRecentOrders(limit, filters),
  });
}

export function useMonthlySales(year: number) {
  return useQuery({
    queryKey: ["analytics", "monthly-sales", year],
    queryFn: () => getMonthlySales(year),
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ["analytics", "top-products", limit],
    queryFn: () => getTopProducts(limit),
  });
}

export function useOrderStatusBreakdown() {
  return useQuery({
    queryKey: ["analytics", "order-status"],
    queryFn: getOrderStatusBreakdown,
  });
}
