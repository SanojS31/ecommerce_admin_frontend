"use client";
import { useState } from "react";
import { Plus, Pencil, Power, Image, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  useGetProducts,
  useCreateProduct,
  useToggleProduct,
  Product,
} from "@/hooks/useProducts";
import { useGetCategories } from "@/hooks/useCategories";
import { useGetBrands } from "@/hooks/useBrands";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface ProductFormData {
  name: string;
  description: string;
  basePrice: string;
  category: string;
  brand: string;
  options: string[];
  isFeatured: boolean;
  images: FileList | null;
}

const defaultForm: ProductFormData = {
  name: "",
  description: "",
  basePrice: "",
  category: "",
  brand: "",
  options: [],
  isFeatured: false,
  images: null,
};

const availableOptions = ["size", "ageGroup", "color"];

export default function ProductsPage() {
  const { data, isLoading } = useGetProducts();
  const { data: categoriesData } = useGetCategories();
  const { data: brandsData } = useGetBrands();
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: toggle } = useToggleProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormData>(defaultForm);

  const products: Product[] = data?.products || [];
  const categories = categoriesData?.categories?.filter((c: any) => c.isActive) || [];
  const brands = brandsData?.brands?.filter((b: any) => b.isActive) || [];

  const toggleOption = (opt: string) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.includes(opt)
        ? prev.options.filter((o) => o !== opt)
        : [...prev.options, opt],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("basePrice", form.basePrice);
    fd.append("category", form.category);
    fd.append("brand", form.brand);
    fd.append("options", JSON.stringify(form.options));
    fd.append("isFeatured", String(form.isFeatured));
    if (form.images) {
      Array.from(form.images).forEach((file) => fd.append("images", file));
    }
    create(fd, { onSuccess: () => { setModalOpen(false); setForm(defaultForm); } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Products</h2>
          <p className="text-xs text-gray-400 mt-0.5">{products.length} total</p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={14} />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Variants</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No products yet</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-9 h-9 rounded-lg object-cover border border-gray-100" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Image size={14} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.options.join(", ")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">
                      {typeof product.category === "object" ? product.category.name : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      ₹{product.basePrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-500">
                        {product.variants.length} variants
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge label={product.isActive ? "Active" : "Inactive"} variant={product.isActive ? "success" : "default"} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <ChevronRight size={14} />
                        </Link>
                        <button
                          onClick={() => toggle(product._id)}
                          className={`transition-colors ${product.isActive ? "text-green-500 hover:text-red-500" : "text-gray-400 hover:text-green-500"}`}
                        >
                          <Power size={14} />
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

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Product" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description"
                required
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                placeholder="599"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white"
              >
                <option value="">Select brand</option>
                {brands.map((brand: any) => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Featured
              </label>
              <select
                value={String(form.isFeatured)}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.value === "true" })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Variant Options
              </label>
              <div className="flex gap-2">
                {availableOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleOption(opt)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      form.options.includes(opt)
                        ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Select what variants this product will have
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setForm({ ...form, images: e.target.files })}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={creating} className="flex-1">
              {creating ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}