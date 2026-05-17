"use client";
import { ShoppingBag, Users, TrendingUp, Clock } from "lucide-react";
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
  value: string | number;
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

export default function DashboardSection() {
  const { data: overview } = useAnalyticsOverview();
  const { data: recentOrdersData } = useRecentOrders(5);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${overview?.data?.totalRevenue?.toLocaleString() || 0}`}
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/orders" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
            View all
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrdersData?.orders?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">No orders yet</td>
              </tr>
            ) : (
              recentOrdersData?.orders?.map((order: any) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{order.orderId}</td>
                  <td className="px-4 py-3.5 text-gray-700">
                    {order.isManualOrder ? order.manualCustomer?.name : order.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">₹{order.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <Badge label={order.orderStatus} variant={getOrderStatusVariant(order.orderStatus)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}