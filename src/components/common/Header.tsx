"use client";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/categories": "Categories",
  "/brands": "Brands",
  "/products": "Products",
  "/orders": "Orders",
  "/users": "Users",
  "/store-config": "Store Config",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const stored = localStorage.getItem("adminData");
    if (stored) {
      const data = JSON.parse(stored);
      setAdminName(data?.name || "Admin");
    }
  }, []);

  const title =
    Object.entries(pageTitles).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] || "Admin Panel";

  return (
    <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {adminName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
}