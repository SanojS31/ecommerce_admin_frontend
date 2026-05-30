"use client";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import {
  useGetStoreConfig,
  useUpdateStoreConfig,
  StoreConfig,
} from "@/hooks/useStoreConfig";
import Button from "@/components/ui/Button";

export default function StoreConfigSection() {
  const { data, isLoading } = useGetStoreConfig();
  const { mutate: update, isPending } = useUpdateStoreConfig();

  const [form, setForm] = useState<Partial<StoreConfig>>({
    upiId: "",
    upiName: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.config) {
      const c = data.config;
      setForm({
        upiId: c.upiId || "",
        upiName: c.upiName || "",
        bankName: c.bankName || "",
        accountHolderName: c.accountHolderName || "",
        accountNumber: c.accountNumber || "",
        ifscCode: c.ifscCode || "",
      });
      if (c.qrCodeImage) setQrPreview(c.qrCodeImage);
    }
  }, [data]);

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) fd.append(key, String(value));
    });
    if (qrFile) fd.append("qrCodeImage", qrFile);

    update(fd, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-white";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Store Config</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Payment details shown to customers when they place an order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* UPI Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            UPI Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                UPI ID <span className="text-red-500">*</span>
              </label>
              <input
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                placeholder="yourname@upi"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                UPI Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.upiName}
                onChange={(e) => setForm({ ...form, upiName: e.target.value })}
                placeholder="Your Business Name"
                required
                className={inputClass}
              />
            </div>

            {/* QR Code */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                QR Code Image
              </label>
              <div className="flex items-start gap-4">
                {qrPreview ? (
                  <img
                    src={qrPreview}
                    alt="QR Code"
                    className="w-24 h-24 rounded-lg object-contain border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <Upload size={18} className="text-gray-300" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrChange}
                    className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Upload UPI QR code image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Bank Account Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="State Bank of India"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.accountHolderName}
                onChange={(e) =>
                  setForm({ ...form, accountHolderName: e.target.value })
                }
                placeholder="Your Name"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                value={form.accountNumber}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
                placeholder="1234567890"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                value={form.ifscCode}
                onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
                placeholder="SBIN0001234"
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          {saved && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Saved successfully
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
