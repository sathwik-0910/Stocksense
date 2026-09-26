import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  ArrowLeftRight,
  ClipboardList,
  Building2,
  Settings,
  Flame,
  LifeBuoy
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useInventory } from "../../context/InventoryContext";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { kpiData, activeAccent } = useInventory();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    {
      name: "Products",
      path: "/products",
      icon: PackageSearch,
      badge: kpiData.lowStockCount > 0 ? kpiData.lowStockCount : null,
      urgent: true,
    },
    {
      name: "Operations",
      path: "/operations",
      icon: ArrowLeftRight,
      badge: kpiData.pendingReceipts + kpiData.pendingDeliveries,
    },
    { name: "Stock Moves", path: "/moves", icon: ClipboardList },
    { name: "Warehouses", path: "/warehouses", icon: Building2 },
  ];

  type AccentSettings = Record<string, string>;
  const activeStyles: AccentSettings = {
    emerald: "bg-emerald-500/10 text-emerald-400 before:bg-emerald-500",
    blue: "bg-blue-500/10 text-blue-400 before:bg-blue-500",
    violet: "bg-violet-500/10 text-violet-400 before:bg-violet-500",
    cyan: "bg-cyan-500/10 text-cyan-400 before:bg-cyan-500",
  };

  const getAccentHover = () => {
    switch (activeAccent) {
      case "emerald": return "hover:text-emerald-300";
      case "violet": return "hover:text-violet-300";
      case "cyan": return "hover:text-cyan-300";
      default: return "hover:text-blue-300";
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-white/5 bg-bg-base/95 backdrop-blur-md hidden lg:flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br from-${activeAccent}-400 to-${activeAccent}-600 flex items-center justify-center text-white shadow-lg shadow-${activeAccent}-500/20 group-hover:scale-105 transition-transform`}>
            <Flame className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">APEX<span className="text-gray-500 font-medium"> IMS</span></span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? activeStyles[activeAccent]
                  : `text-gray-400 hover:bg-white/5 ${getAccentHover()}`
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-md before:bg-current bg-current" />
              )}

              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "" : "text-gray-500 group-hover:text-current transition-colors")} />
                {item.name}
              </div>

              {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  item.urgent
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-white/10 text-gray-300 border border-white/5"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Nav */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-200"
        >
          <Settings className="h-5 w-5 text-gray-500" />
          System Settings
        </Link>
        <Link
          to="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-200"
        >
          <LifeBuoy className="h-5 w-5 text-gray-500" />
          Help & Support
        </Link>
      </div>
    </aside>
  );
};
