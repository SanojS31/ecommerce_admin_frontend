"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
} from "lucide-react";
import {
  useGetAllOrders,
  useApprovePayment,
  useRejectPayment,
  useCreateManualOrder,
  Order,
} from "@/hooks/useOrders";
import { useGetProducts } from "@/hooks/useProducts";
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
    refunded: "info",
  };
  return map[status] || "default";
}

const STATUS_FILTERS = [
  "all",
  "payment_pending",
  "payment_review",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

interface ManualOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface ManualOrderForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  isPaid: boolean;
  note: string;
  items: ManualOrderItem[];
}

const defaultManualForm: ManualOrderForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "upi",
  isPaid: false,
  note: "",
  items: [{ productId: "", variantId: "", quantity: 1 }],
};

export default function OrdersSection() {
  const router = useRouter();
  const { data, isLoading } = useGetAllOrders();
  const { data: productsData } = useGetProducts();
  const { mutate: approve, isPending: approving } = useApprovePayment();
  const { mutate: reject, isPending: rejecting } = useRejectPayment();
  const { mutate: createManual, isPending: creating } = useCreateManualOrder();

  const [statusFilter, setStatusFilter] = useState("all");
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState<ManualOrderForm>(defaultManualForm);
  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    type: "approve" | "reject";
    orderId: string;
  }>({ open: false, type: "approve", orderId: "" });
  const [actionNote, setActionNote] = useState("");

  const orders: Order[] = data?.orders || [];
  const products = productsData?.products || [];

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);

  const openNoteModal = (
    type: "approve" | "reject",
    orderId: string
  ) => {
    setActionNote("");
    setNoteModal({ open: true, type, orderId });
  };

  const handleAction = () => {
    const fn = noteModal.type === "approve" ? approve : reject;
    fn(
      { id: noteModal.orderId, note: actionNote || undefined },
      { onSuccess: () => setNoteModal({ open: false, type: "approve", orderId: "" }) }
    );
  };

  const addManualItem = () => {
    setManualForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", variantId: "", quantity: 1 }],
    }));
  };

  const removeManualItem = (index: number) => {
    setManualForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateManualItem = (
    index: number,
    field: keyof ManualOrderItem,
    value: string | number
  ) => {
    setManualForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    createManual(
      {
        customerName: manualForm.customerName,
        customerPhone: manualForm.customerPhone,
        customerEmail: manualForm.customerEmail || undefined,
        shippingAddress: {
          fullName: manualForm.fullName,
          phone: manualForm.phone,
          addressLine: manualForm.addressLine,
          city: manualForm.city,
          state: manualForm.state,
          pincode: manualForm.pincode,
          isDefault: false,
        },
        paymentMethod: manualForm.paymentMethod,
        isPaid: manualForm.isPaid,
        note: manualForm.note || undefined,
        items: manualForm.items,
      },
      {
        onSuccess: () => {
          setManualModalOpen(false);
          setManualForm(defaultManualForm);
        },
      }
    );
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Orders</h2>
          <p className="text-xs text-gray-400 mt-0.5">{orders.length} total</p>
        </div>
        <Button onClick={() => setManualModalOpen(true)} size="sm">
          <Plus size={14} />
          Manual Order
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-lg border whitespace-nowrap transition-colors ${
              statusFilter === s
                ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-600">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-900">
                        {order.isManualOrder
                          ? order.manualCustomer?.name
                          : order.user?.name || "—"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.isManualOrder
                          ? order.manualCustomer?.phone
                          : order.user?.phone || ""}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <Badge
                          label={order.paymentStatus}
                          variant={getPaymentStatusVariant(order.paymentStatus)}
                        />
                        {order.paymentProof && (
                          <p className="text-xs text-gray-400">
                            UTR: {order.paymentProof.utrNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        label={order.orderStatus}
                        variant={getOrderStatusVariant(order.orderStatus)}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {order.paymentStatus === "payment_submitted" && (
                          <>
                            <button
                              onClick={() => openNoteModal("approve", order._id)}
                              className="text-green-500 hover:text-green-700 transition-colors"
                              title="Approve Payment"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => openNoteModal("reject", order._id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Reject Payment"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => router.push(`/orders/${order._id}`)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          title="View Details"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Approve/Reject Note Modal */}
      <Modal
        isOpen={noteModal.open}
        onClose={() => setNoteModal({ open: false, type: "approve", orderId: "" })}
        title={noteModal.type === "approve" ? "Approve Payment" : "Reject Payment"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {noteModal.type === "approve"
              ? "Confirm that you have verified the payment in your bank account."
              : "Reject this payment. Stock will be restored and order will be cancelled."}
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Note (optional)
            </label>
            <textarea
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder={
                noteModal.type === "approve"
                  ? "e.g. Payment verified in bank"
                  : "e.g. UTR not found in statement"
              }
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setNoteModal({ open: false, type: "approve", orderId: "" })
              }
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant={noteModal.type === "approve" ? "primary" : "danger"}
              onClick={handleAction}
              disabled={approving || rejecting}
              className="flex-1"
            >
              {approving || rejecting
                ? "Processing..."
                : noteModal.type === "approve"
                ? "Approve"
                : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manual Order Modal */}
      <Modal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        title="Create Manual Order"
        size="lg"
      >
        <form onSubmit={handleCreateManual} className="space-y-5">
          {/* Customer Info */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Customer Info
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.customerName}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, customerName: e.target.value })
                  }
                  placeholder="Customer name"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.customerPhone}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, customerPhone: e.target.value })
                  }
                  placeholder="9876543210"
                  required
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={manualForm.customerEmail}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, customerEmail: e.target.value })
                  }
                  placeholder="customer@email.com"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Shipping Address
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.fullName}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, fullName: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.phone}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, phone: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.addressLine}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, addressLine: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.city}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, city: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.state}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, state: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  value={manualForm.pincode}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, pincode: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Items
              </p>
              <button
                type="button"
                onClick={addManualItem}
                className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <Plus size={12} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {manualForm.items.map((item, index) => {
                const selectedProduct = products.find(
                  (p: any) => p._id === item.productId
                );
                return (
                  <div key={index} className="grid grid-cols-7 gap-2 items-end">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          updateManualItem(index, "productId", e.target.value)
                        }
                        required
                        className={inputClass}
                      >
                        <option value="">Select</option>
                        {products.map((p: any) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Variant
                      </label>
                      <select
                        value={item.variantId}
                        onChange={(e) =>
                          updateManualItem(index, "variantId", e.target.value)
                        }
                        required
                        className={inputClass}
                      >
                        <option value="">Select</option>
                        {selectedProduct?.variants
                          ?.filter((v: any) => v.isActive)
                          .map((v: any) => {
                            const attrs = Object.entries(v.attributes || {})
                              .filter(([_, val]) => val)
                              .map(([_, val]) => val)
                              .join(" / ");
                            return (
                              <option key={v._id} value={v._id}>
                                {attrs || v._id} — ₹{v.price}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateManualItem(index, "quantity", Number(e.target.value))
                        }
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      {manualForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeManualItem(index)}
                          className="w-full py-2.5 text-xs text-red-400 hover:text-red-600 border border-gray-200 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Payment
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Method
                </label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, paymentMethod: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="manual">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Payment Status
                </label>
                <select
                  value={String(manualForm.isPaid)}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      isPaid: e.target.value === "true",
                    })
                  }
                  className={inputClass}
                >
                  <option value="false">Pending</option>
                  <option value="true">Already Paid</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Note
                </label>
                <input
                  value={manualForm.note}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, note: e.target.value })
                  }
                  placeholder="e.g. Customer called from Instagram"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setManualModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating} className="flex-1">
              {creating ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
