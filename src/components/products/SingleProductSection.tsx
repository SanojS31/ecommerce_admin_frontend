"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Power, Image } from "lucide-react";
import {
  useGetProductById,
  useAddVariant,
  useUpdateVariant,
  useToggleVariant,
  Variant,
  VariantAttributes,
} from "@/hooks/useProducts";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const AGE_OPTIONS = [
  "0-3 months", "3-6 months", "6-12 months",
  "1-2 years", "2-3 years", "3-4 years",
  "4-5 years", "5-6 years", "6-7 years", "7-8 years",
];
const COLOR_OPTIONS = [
  "Red", "Blue", "Green", "Black", "White",
  "Yellow", "Pink", "Purple", "Orange", "Grey", "Navy", "Maroon",
];

interface VariantForm {
  size: string;
  ageGroup: string;
  color: string;
  stock: string;
  price: string;
  sku: string;
}

const defaultVariantForm: VariantForm = {
  size: "", ageGroup: "", color: "", stock: "", price: "", sku: "",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const { data, isLoading } = useGetProductById(productId);
  const { mutate: addVariant, isPending: adding } = useAddVariant();
  const { mutate: updateVariant, isPending: updating } = useUpdateVariant();
  const { mutate: toggleVariant } = useToggleVariant();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [form, setForm] = useState<VariantForm>(defaultVariantForm);

  const product = data?.product;

  const openAddVariant = () => {
    setEditingVariant(null);
    setForm(defaultVariantForm);
    setModalOpen(true);
  };

  const openEditVariant = (variant: Variant) => {
    setEditingVariant(variant);
    setForm({
      size: (variant.attributes as any).size || "",
      ageGroup: (variant.attributes as any).ageGroup || "",
      color: (variant.attributes as any).color || "",
      stock: String(variant.stock),
      price: String(variant.price),
      sku: variant.sku || "",
    });
    setModalOpen(true);
  };

  const handleVariantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attributes: VariantAttributes = {};
    if (form.size) attributes.size = form.size as any;
    if (form.ageGroup) attributes.ageGroup = form.ageGroup as any;
    if (form.color) attributes.color = form.color as any;

    if (editingVariant) {
      updateVariant(
        {
          productId,
          variantId: editingVariant._id,
          data: {
            attributes,
            stock: Number(form.stock),
            price: Number(form.price),
            sku: form.sku || undefined,
          },
        },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      addVariant(
        {
          productId,
          data: {
            attributes,
            stock: Number(form.stock),
            price: Number(form.price),
            sku: form.sku || undefined,
          },
        },
        { onSuccess: () => { setModalOpen(false); setForm(defaultVariantForm); } }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Product not found
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{product.name}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {typeof product.category === "object" ? product.category.name : ""} ·{" "}
            {typeof product.brand === "object" ? product.brand.name : ""}
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Images</p>
          <div className="grid grid-cols-3 gap-2">
            {product.images?.length > 0 ? (
              product.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-full aspect-square rounded-lg object-cover border border-gray-100"
                />
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center h-24 bg-gray-50 rounded-lg">
                <Image size={20} className="text-gray-300" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:col-span-2">
          <p className="text-xs font-medium text-gray-500 mb-3">Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">Base Price</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                ₹{product.basePrice?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <div className="mt-0.5">
                <Badge
                  label={product.isActive ? "Active" : "Inactive"}
                  variant={product.isActive ? "success" : "default"}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Options</p>
              <p className="text-sm text-gray-700 mt-0.5">
                {product.options?.join(", ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Featured</p>
              <p className="text-sm text-gray-700 mt-0.5">
                {product.isFeatured ? "Yes" : "No"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400">Description</p>
              <p className="text-sm text-gray-700 mt-0.5">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Variants</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {product.variants?.length || 0} variants
            </p>
          </div>
          <Button onClick={openAddVariant} size="sm">
            <Plus size={14} />
            Add Variant
          </Button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Attributes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {product.variants?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No variants yet. Add your first variant.
                </td>
              </tr>
            ) : (
              product.variants?.map((variant: Variant) => {
                const attrs = variant.attributes as any;
                const attrText = Object.entries(attrs)
                  .filter(([_, v]) => v)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ");

                return (
                  <tr
                    key={variant._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-700 font-medium">{attrText || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      ₹{variant.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-medium ${variant.stock === 0 ? "text-red-500" : "text-gray-700"}`}>
                        {variant.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">
                      {variant.sku || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        label={variant.isActive ? "Active" : "Inactive"}
                        variant={variant.isActive ? "success" : "default"}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditVariant(variant)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() =>
                            toggleVariant({ productId, variantId: variant._id })
                          }
                          className={`transition-colors ${
                            variant.isActive
                              ? "text-green-500 hover:text-red-500"
                              : "text-gray-400 hover:text-green-500"
                          }`}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Variant Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVariant ? "Edit Variant" : "Add Variant"}
        size="sm"
      >
        <form onSubmit={handleVariantSubmit} className="space-y-4">
          {product.options?.includes("size") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
              <select
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white"
              >
                <option value="">Select size</option>
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {product.options?.includes("ageGroup") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age Group</label>
              <select
                value={form.ageGroup}
                onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white"
              >
                <option value="">Select age group</option>
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}

          {product.options?.includes("color") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
              <select
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white"
              >
                <option value="">Select color</option>
                {COLOR_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="599"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="20"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="e.g. MAT-TOP-S"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={adding || updating} className="flex-1">
              {adding || updating ? "Saving..." : editingVariant ? "Update" : "Add Variant"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
