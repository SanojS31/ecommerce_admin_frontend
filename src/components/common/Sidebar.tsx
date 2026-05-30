"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Bookmark,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ReceiptText,
  LogOut,
  X,
} from "lucide-react";
import { clearAuth } from "@/app/api/httpClient";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Tag,
  Bookmark,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ReceiptText,
};

const menus = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { name: "Categories", path: "/categories", icon: "Tag" },
  { name: "Brands", path: "/brands", icon: "Bookmark" },
  { name: "Products", path: "/products", icon: "Package" },
  { name: "Orders", path: "/orders", icon: "ShoppingBag" },
  { name: "Users", path: "/users", icon: "Users" },
  { name: "Purchase Details", path: "/purchase-details", icon: "ReceiptText" },
  { name: "Store Config", path: "/store-config", icon: "Settings" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="h-full w-56 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <Link
          href="/dashboard"
          className="flex items-center"
          aria-label="Mirni Collections dashboard"
        >
          <img
            src="/MIRNI_logo.svg"
            alt="Mirni Collections"
            className="h-12 w-12 rounded-lg object-contain"
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = iconMap[menu.icon];
          const isActive =
            pathname === menu.path ||
            pathname.startsWith(menu.path + "/");

          return (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[var(--brand-primary)] text-white"
                  : "text-gray-500 hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary-hover)]"
              }`}
            >
              <Icon size={16} />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
