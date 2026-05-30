"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  PurchaseDetail,
  PurchaseDetailPayload,
  useCreatePurchaseDetail,
  useDeletePurchaseDetail,
  useGetPurchaseDetails,
  useUpdatePurchaseDetail,
} from "@/hooks/usePurchaseDetails";

const today = () => new Date().toISOString().slice(0, 10);

const defaultForm: PurchaseDetailPayload = {
  category: "goods",
  itemName: "",
  vendor: "",
  purchaseDate: today(),
  quantity: 1,
  unitCost: 0,
  paymentMethod: "cash",
  notes: "",
};

const categoryLabels: Record<string, string> = {
  goods: "Goods",
  accessories: "Accessories",
  expense: "Expense",
};

const categoryVariant: Record<string, "default" | "success" | "warning"> = {
  goods: "success",
  accessories: "warning",
  expense: "default",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(value = 0) {
  return `Rs ${Number(value).toLocaleString()}`;
}

export default function PurchaseDetailsSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const hasDateFilter = Boolean(startDate || endDate);
  const { data, isLoading } = useGetPurchaseDetails(
    hasDateFilter ? { startDate, endDate } : undefined
  );
  const { mutate: create, isPending: creating } = useCreatePurchaseDetail();
  const { mutate: update, isPending: updating } = useUpdatePurchaseDetail();
  const { mutate: remove } = useDeletePurchaseDetail();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PurchaseDetail | null>(null);
  const [form, setForm] = useState<PurchaseDetailPayload>(defaultForm);

  const purchases: PurchaseDetail[] = data?.purchases || [];
  const summary = data?.summary;

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, purchaseDate: today() });
    setModalOpen(true);
  };

  const openEdit = (purchase: PurchaseDetail) => {
    setEditing(purchase);
    setForm({
      category: purchase.category,
      itemName: purchase.itemName,
      vendor: purchase.vendor || "",
      purchaseDate: purchase.purchaseDate.slice(0, 10),
      quantity: purchase.quantity,
      unitCost: purchase.unitCost,
      paymentMethod: purchase.paymentMethod,
      notes: purchase.notes || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      unitCost: Number(form.unitCost),
    };

    if (editing) {
      update(
        { id: editing._id, payload },
        { onSuccess: () => setModalOpen(false) }
      );
      return;
    }

    create(payload, { onSuccess: () => setModalOpen(false) });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this purchase detail?")) {
      remove(id);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Purchase Details
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Record goods, accessories, and other expenses
          </p>
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
          <Button onClick={openCreate} size="sm" className="h-9">
            <Plus size={14} />
            Add Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Total Spend</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {formatMoney(summary?.totalAmount)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Records</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {summary?.totalRecords || 0}
          </p>
        </div>
        {["goods", "accessories"].map((category) => {
          const item = summary?.byCategory?.find(
            (row: any) => row.category === category
          );
          return (
            <div
              key={category}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <p className="text-xs text-gray-500 font-medium">
                {categoryLabels[category]}
              </p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {formatMoney(item?.totalAmount)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-400 text-sm"
                    >
                      No purchase records yet
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-gray-500">
                        {formatDate(purchase.purchaseDate)}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-900">
                          {purchase.itemName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {purchase.vendor || "No vendor"} -{" "}
                          {purchase.paymentMethod.replace("_", " ")}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          label={categoryLabels[purchase.category]}
                          variant={categoryVariant[purchase.category]}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">
                        {purchase.quantity}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {formatMoney(purchase.totalAmount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(purchase)}
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(purchase._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Purchase Detail" : "Add Purchase Detail"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as any })
              }
              className={inputClass}
            >
              <option value="goods">Goods</option>
              <option value="accessories">Accessories</option>
              <option value="expense">Other Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Purchase Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) =>
                setForm({ ...form, purchaseDate: e.target.value })
              }
              required
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              placeholder="Cotton fabric, packing covers, delivery expense"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vendor
            </label>
            <input
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              placeholder="Supplier name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Payment Method
            </label>
            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value as any })
              }
              className={inputClass}
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Unit Cost <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.unitCost}
              onChange={(e) =>
                setForm({ ...form, unitCost: Number(e.target.value) })
              }
              required
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="col-span-2 flex items-center justify-between pt-2">
            <p className="text-sm font-medium text-gray-700">
              Total: {formatMoney(Number(form.quantity) * Number(form.unitCost))}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating
                  ? "Saving..."
                  : editing
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
