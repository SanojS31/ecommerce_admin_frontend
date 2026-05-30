"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import {
  useGetAllUsers,
  useBlockUser,
  useUnblockUser,
  useGetUserOrders,
  User,
} from "@/hooks/useUsers";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

function getOrderStatusVariant(status: string) {
  const map: Record<string, any> = {
    confirmed: "success",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
    payment_pending: "warning",
    payment_review: "warning",
  };
  return map[status] || "default";
}

function UserOrdersModal({
  userId,
  userName,
  isOpen,
  onClose,
}: {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetUserOrders(userId);
  const orders = data?.orders || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${userName}'s Orders`} size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No orders found</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
            >
              <div>
                <p className="text-xs font-mono text-gray-600">{order.orderId}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ₹{order.totalAmount?.toLocaleString()}
                </p>
                <div className="mt-0.5">
                  <Badge
                    label={order.orderStatus}
                    variant={getOrderStatusVariant(order.orderStatus)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

export default function UsersSection() {
  const { data, isLoading } = useGetAllUsers();
  const { mutate: block } = useBlockUser();
  const { mutate: unblock } = useUnblockUser();

  const [ordersModal, setOrdersModal] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({ open: false, userId: "", userName: "" });

  const [search, setSearch] = useState("");

  const users: User[] = data?.users || [];

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Users</h2>
          <p className="text-xs text-gray-400 mt-0.5">{users.length} total</p>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full max-w-sm px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-500">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-sm">
                      {user.phone || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        label={user.isBlocked ? "Blocked" : "Active"}
                        variant={user.isBlocked ? "danger" : "success"}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setOrdersModal({
                              open: true,
                              userId: user._id,
                              userName: user.name,
                            })
                          }
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          title="View Orders"
                        >
                          <ShoppingBag size={14} />
                        </button>
                        {user.isBlocked ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => unblock(user._id)}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => block(user._id)}
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* User Orders Modal */}
      <UserOrdersModal
        isOpen={ordersModal.open}
        onClose={() =>
          setOrdersModal({ open: false, userId: "", userName: "" })
        }
        userId={ordersModal.userId}
        userName={ordersModal.userName}
      />
    </div>
  );
}
