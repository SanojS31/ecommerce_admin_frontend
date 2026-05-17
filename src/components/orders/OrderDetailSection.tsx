"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { useGetOrderById, useUpdateOrderStatus } from "@/hooks/useOrders";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  created: ["confirmed", "cancelled"],
  payment_pending: ["cancelled"],
  payment_review: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

function getOrderStatusVariant(status: string) {
  const map: Record<string, any> = {
    confirmed: "success",
    shipped: "info",
    delivered: "success",
    cancelled: "danger",
    payment_pending: "warning",
    payment_review: "warning",
    returned: "danger",
    created: "default",
  };
  return map[status] || "default";
}

function getPaymentStatusVariant(status: string) {
  const map: Record<string, any> = {
    completed: "success",
    payment_submitted: "warning",
    pending: "default",
    failed: "danger",
  };
  return map[status] || "default";
}

export default function OrderDetailSection() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { data, isLoading } = useGetOrderById(orderId);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");

  const order = data?.order;
  const allowedTransitions = order
    ? ORDER_STATUS_TRANSITIONS[order.orderStatus] || []
    : [];

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    updateStatus(
      { id: orderId, status: selectedStatus, note: note || undefined },
      { onSuccess: () => { setStatusModal(false); setNote(""); } }
    );
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Order not found
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 font-mono">
              {order.orderId}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        {allowedTransitions.length > 0 && (
          <Button
            size="sm"
            onClick={() => { setSelectedStatus(allowedTransitions[0]); setStatusModal(true); }}
          >
            Update Status
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order Status + Payment */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Order Status</p>
            <Badge
              label={order.orderStatus}
              variant={getOrderStatusVariant(order.orderStatus)}
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Payment Status</p>
            <Badge
              label={order.paymentStatus}
              variant={getPaymentStatusVariant(order.paymentStatus)}
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Payment Method</p>
            <p className="text-sm text-gray-700 capitalize">{order.paymentMethod}</p>
          </div>
          {order.paymentProof && (
            <div className="bg-yellow-50 rounded-lg p-3">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                Payment Proof
              </p>
              <p className="text-xs text-yellow-700">
                UTR: {order.paymentProof.utrNumber}
              </p>
              {order.paymentProof.note && (
                <p className="text-xs text-yellow-600 mt-0.5">
                  {order.paymentProof.note}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Customer + Address */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Customer</p>
            <p className="text-sm font-medium text-gray-900">
              {order.isManualOrder
                ? order.manualCustomer?.name
                : order.user?.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {order.isManualOrder
                ? order.manualCustomer?.phone
                : order.user?.phone}
            </p>
            <p className="text-xs text-gray-400">
              {order.isManualOrder
                ? order.manualCustomer?.email
                : order.user?.email}
            </p>
            {order.isManualOrder && (
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                Manual Order
              </span>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Shipping Address
            </p>
            <p className="text-sm text-gray-700">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {order.shippingAddress.addressLine}
            </p>
            <p className="text-xs text-gray-500">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
            <p className="text-xs text-gray-500">{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Order Summary</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-700">₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-700">₹{order.shippingCharge}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-700">₹{order.tax}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="text-green-600">-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-4 py-3.5 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Items</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Variant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any, i: number ) => {
              const attrs = Object.entries(item.attributes || {})
                .filter(([_, v]) => v)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ");
              return (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100" />
                      )}
                      <span className="text-gray-900 font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{attrs || "—"}</td>
                  <td className="px-4 py-3.5 text-gray-700">₹{item.price?.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3.5 text-gray-700 font-medium">
                    ₹{(item.price * item.quantity)?.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status History */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900 mb-4">Status History</p>
        <div className="space-y-3">
          {order.statusHistory?.map((h: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <Badge label={h.status} variant={getOrderStatusVariant(h.status)} />
                  <span className="text-xs text-gray-400">
                    {new Date(h.updatedAt).toLocaleString("en-IN")}
                  </span>
                </div>
                {h.note && (
                  <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        title="Update Order Status"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={inputClass}
            >
              {allowedTransitions.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setStatusModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isPending || !selectedStatus}
              className="flex-1"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}