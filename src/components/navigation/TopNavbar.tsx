import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Building2,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Palette,
  Check,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { Link, useNavigate } from "react-router-dom";

export const TopNavbar: React.FC = () => {
  const {
    currentUser,
    logout,
    users,
    login,
    warehouses,
    selectedWarehouse,
    setSelectedWarehouse,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsCommandPaletteOpen,
    activeAccent,
    setActiveAccent,
  } = useInventory();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [isAccentOpen, setIsAccentOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const warehouseRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (warehouseRef.current && !warehouseRef.current.contains(event.target as Node)) {
        setIsWarehouseOpen(false);
      }
      if (accentRef.current && !accentRef.current.contains(event.target as Node)) {
        setIsAccentOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeWarehouseObj = warehouses.find((w) => w.id === selectedWarehouse);

  const accents: Array<{ id: "emerald" | "blue" | "violet" | "cyan"; label: string; color: string }> = [
    { id: "emerald", label: "Electric Emerald", color: "bg-emerald-500" },
    { id: "blue", label: "Cyber Blue", color: "bg-blue-500" },
    { id: "violet", label: "Neon Violet", color: "bg-purple-500" },
    { id: "cyan", label: "Hyper Cyan", color: "bg-cyan-500" },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-white/5 bg-bg-base/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Quick Search Button & Warehouse selector */}
      <div className="flex items-center gap-3">
        {/* Command Palette trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 transition-all text-xs font-medium w-48 sm:w-64 group shadow-inner"
        >
          <Search className="h-3.5 w-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
          <span className="flex-1 text-left">Search inventory, orders...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-gray-300">
            ⌘K
          </kbd>
        </button>

        {/* Warehouse Selector */}
        <div className="relative" ref={warehouseRef}>
          <button
            onClick={() => setIsWarehouseOpen(!isWarehouseOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 text-xs font-medium text-gray-300 transition-all"
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">
              {selectedWarehouse === "all" ? "All Warehouses" : activeWarehouseObj?.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>

          {isWarehouseOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl border border-white/10 bg-bg-surface p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Switch Facility Scope
              </div>
              <button
                onClick={() => {
                  setSelectedWarehouse("all");
                  setIsWarehouseOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                  selectedWarehouse === "all"
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <span>🌐 All Global Warehouses</span>
                {selectedWarehouse === "all" && <Check className="h-3.5 w-3.5" />}
              </button>
              <div className="my-1 border-t border-white/5" />
              {warehouses.map((wh) => (
                <button
                  key={wh.id}
                  onClick={() => {
                    setSelectedWarehouse(wh.id);
                    setIsWarehouseOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    selectedWarehouse === wh.id
                      ? "bg-emerald-500/10 text-emerald-400 font-medium"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex flex-col items-start truncate text-left">
                    <span className="truncate font-medium">{wh.name}</span>
                    <span className="text-[10px] text-gray-500">{wh.location}</span>
                  </div>
                  {selectedWarehouse === wh.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Theme Accent, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Accent Selector */}
        <div className="relative" ref={accentRef}>
          <button
            onClick={() => setIsAccentOpen(!isAccentOpen)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            title="Customize Accent Glow"
          >
            <Palette className="h-4 w-4" />
          </button>

          {isAccentOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-bg-surface p-2 shadow-2xl z-50 animate-fade-in">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Accent Theme
              </div>
              {accents.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setActiveAccent(acc.id);
                    setIsAccentOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    activeAccent === acc.id ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${acc.color}`} />
                  <span>{acc.label}</span>
                  {activeAccent === acc.id && <Check className="h-3 w-3 ml-auto text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-bg-surface p-3 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 px-2">
                <span className="text-xs font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-emerald-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No notifications right now.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.actionLink) navigate(n.actionLink);
                        setIsNotifOpen(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                        !n.read
                          ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                          : "border-transparent hover:bg-white/[0.02] opacity-70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Account Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all group"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={currentUser?.name || "User"}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="text-xs font-medium text-gray-200 hidden md:inline-block max-w-[90px] truncate">
              {currentUser?.name || "Guest"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-bg-surface p-2 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
              {/* User Header */}
              <div className="px-3 py-2.5 border-b border-white/5">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{currentUser?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="h-2.5 w-2.5" />
                    {currentUser?.role}
                  </span>
                </div>
              </div>

              {/* Switch Demo Profiles */}
              <div className="py-2 border-b border-white/5">
                <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Switch Demo Persona
                </p>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      login(u);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      currentUser?.id === u.id
                        ? "bg-white/10 text-white font-medium"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="h-4 w-4 rounded-full object-cover" />
                    <span className="truncate">{u.name}</span>
                    <span className="text-[10px] text-gray-500 ml-auto">{u.role.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Links */}
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span>My Profile & Security</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
