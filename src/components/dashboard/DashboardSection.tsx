"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useAnalyticsOverview, useRecentOrders } from "@/hooks/useAnalytics";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}

function getOrderStatusVariant(status: string) {
  const map: Record<string, any> = {
    confirmed: "success",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
    payment_pending: "warning",
    payment_review: "warning",
    created: "default",
  };
  return map[status] || "default";
}

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function DashboardSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const hasDateFilter = Boolean(startDate || endDate);

  const { data: overview } = useAnalyticsOverview();
  const { data: recentOrdersData } = useRecentOrders(
    hasDateFilter ? 100 : 5,
    hasDateFilter ? { startDate, endDate } : undefined
  );

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={
            <>
              &#8377;{overview?.data?.totalRevenue?.toLocaleString() || 0}
            </>
          }
          icon={TrendingUp}
        />
        <StatCard
          label="Total Orders"
          value={overview?.data?.totalOrders || 0}
          icon={ShoppingBag}
        />
        <StatCard
          label="Total Users"
          value={overview?.data?.totalUsers || 0}
          icon={Users}
        />
        <StatCard
          label="Pending Payments"
          value={overview?.data?.pendingPayments || 0}
          icon={Clock}
          sub="Awaiting approval"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex flex-col gap-3 px-5 py-4 border-b border-gray-100 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Orders
            </h2>
            {hasDateFilter && (
              <p className="mt-1 text-xs text-gray-500">
                {recentOrdersData?.summary?.totalOrders || 0} orders | Sales:{" "}
                &#8377;
                {(recentOrdersData?.summary?.totalSales || 0).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <label className="space-y-1">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Start
              </span>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 px-3 text-xs text-gray-700 outline-none transition-colors focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                End
              </span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 px-3 text-xs text-gray-700 outline-none transition-colors focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </label>
            {hasDateFilter && (
              <button
                type="button"
                onClick={clearDateFilter}
                aria-label="Clear date filter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
            <Link
              href="/orders"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <Calendar size={13} />
              View all
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrdersData?.orders?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-gray-400 text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrdersData?.orders?.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-600">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      {order.isManualOrder
                        ? order.manualCustomer?.name
                        : order.user?.name || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      &#8377;{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        label={order.orderStatus}
                        variant={getOrderStatusVariant(order.orderStatus)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
