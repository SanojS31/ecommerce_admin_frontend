"use client";
import { useState } from "react";
import { Plus, Pencil, Power, Image } from "lucide-react";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useToggleCategory,
  Category,
} from "@/hooks/useCategories";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface CategoryFormData {
  name: string;
  description: string;
  image: File | null;
}

const defaultForm: CategoryFormData = {
  name: "",
  description: "",
  image: null,
};

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();
  const { mutate: toggle } = useToggleCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>(defaultForm);

  const categories: Category[] = data?.categories || [];

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "", image: null });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    if (form.description) fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    if (editing) {
      update(
        { id: editing._id, formData: fd },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      create(fd, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {categories.length} total
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={14} />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No categories yet
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Image size={13} className="text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        label={cat.isActive ? "Active" : "Inactive"}
                        variant={cat.isActive ? "success" : "default"}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => toggle(cat._id)}
                          className={`transition-colors ${
                            cat.isActive
                              ? "text-green-500 hover:text-red-500"
                              : "text-gray-400 hover:text-green-500"
                          }`}
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Maternity Wear"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Optional description"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files?.[0] || null })
              }
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {editing?.image && !form.image && (
              <img
                src={editing.image}
                alt=""
                className="mt-2 w-16 h-16 rounded-lg object-cover border border-gray-100"
              />
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || updating}
              className="flex-1"
            >
              {creating || updating
                ? "Saving..."
                : editing
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}