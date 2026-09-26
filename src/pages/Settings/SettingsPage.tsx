import React, { useState } from "react";
import {
  User,
  Palette,
  Bell,
  Shield,
  Database,
  Check,
  RefreshCw,
  Sparkles,
  Lock,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import {
  initialProducts,
  initialOperations,
  initialMoveHistory,
  initialWarehouses,
  mockUsers,
} from "../../data/mockData";

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    activeAccent,
    setActiveAccent,
    triggerCelebration,
  } = useInventory();

  const [activeTab, setActiveTab] = useState<"profile" | "theme" | "rules" | "data">("theme");
  const [isSaved, setIsSaved] = useState(false);

  const accents: Array<{ id: "emerald" | "blue" | "violet" | "cyan"; label: string; color: string; desc: string }> = [
    {
      id: "emerald",
      label: "Electric Emerald",
      color: "bg-emerald-500",
      desc: "High-contrast emerald glow with deep slate elevation",
    },
    {
      id: "blue",
      label: "Cyber Blue",
      color: "bg-blue-500",
      desc: "Linear-inspired precision cobalt blue highlights",
    },
    {
      id: "violet",
      label: "Neon Violet",
      color: "bg-purple-500",
      desc: "Futuristic ultraviolet glow with vibrant status badges",
    },
    {
      id: "cyan",
      label: "Hyper Cyan",
      color: "bg-cyan-500",
      desc: "Ultra-crisp cyan neon designed for high-density monitoring",
    },
  ];

  const handleResetDemoData = () => {
    localStorage.setItem("apex_ims_products", JSON.stringify(initialProducts));
    localStorage.setItem("apex_ims_operations", JSON.stringify(initialOperations));
    localStorage.setItem("apex_ims_moves", JSON.stringify(initialMoveHistory));
    localStorage.setItem("apex_ims_warehouses", JSON.stringify(initialWarehouses));
    localStorage.setItem("apex_ims_user", JSON.stringify(mockUsers[0]));
    window.location.reload();
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    triggerCelebration();
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          System Preferences & Theme
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Customize your dark aesthetic, alert thresholds, profile credentials and database states.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-bg-surface border border-white/10 rounded-2xl overflow-x-auto">
        {[
          { id: "theme", label: "Theme & Glow", icon: Palette },
          { id: "profile", label: "Profile & Role", icon: User },
          { id: "rules", label: "Inventory Thresholds", icon: Bell },
          { id: "data", label: "Data Management", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white/10 text-white shadow-lg border border-white/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4 text-emerald-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: THEME & GLOW */}
      {activeTab === "theme" && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Theme Glow & Micro-Interaction Accents
            </h3>
            <p className="text-xs text-gray-400">
              Select your preferred dark mode accent luminescence. This updates primary CTAs, active indicators and charts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accents.map((acc) => {
              const isSelected = activeAccent === acc.id;

              return (
                <div
                  key={acc.id}
                  onClick={() => {
                    setActiveAccent(acc.id);
                    triggerCelebration();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white/[0.06] border-white/30 shadow-xl"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-4 w-4 rounded-full ${acc.color} ring-2 ring-white/20`} />
                      <span className="font-semibold text-white text-xs">{acc.label}</span>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">{acc.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <span className="text-xs font-bold text-white block">Visual Effects Engine</span>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <div>
                <span className="font-medium block">Confetti on Validation</span>
                <span className="text-[11px] text-gray-500">Trigger celebratory particle bursts on ledger post</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-white/5">
              <div>
                <span className="font-medium block">Animated Number Counters</span>
                <span className="text-[11px] text-gray-500">Smooth easing on KPI number changes</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE & CREDENTIALS */}
      {activeTab === "profile" && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Active User Profile</h3>
            <p className="text-xs text-gray-400">View current identity, security role and permission scope.</p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/10"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{currentUser?.name}</h4>
              <p className="text-xs text-gray-400">{currentUser?.email}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="h-3 w-3" />
                {currentUser?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={currentUser?.name}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={currentUser?.email}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                {isSaved ? "Saved Successfully!" : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: RULES & THRESHOLDS */}
      {activeTab === "rules" && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Safety Buffers & Alert Automation
            </h3>
            <p className="text-xs text-gray-400">
              Configure trigger conditions for auto-reordering and real-time email notifications.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Auto Low-Stock Warnings</span>
                  <span className="text-gray-500 text-[11px]">
                    Trigger notification when any SKU drops below its minimum threshold
                  </span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-emerald-500 h-4 w-4" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">AI Copilot Purchase Order Suggestions</span>
                  <span className="text-gray-500 text-[11px]">
                    Automatically analyze consumption velocity and recommend PO drafts
                  </span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-emerald-500 h-4 w-4" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Strict Consignment Validation</span>
                  <span className="text-gray-500 text-[11px]">
                    Require physical count verification before marking transfers as DONE
                  </span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-emerald-500 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATA RESET */}
      {activeTab === "data" && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Data & Demo State</h3>
            <p className="text-xs text-gray-400">
              Manage client-side persistent storage and reset mock scenario data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-rose-300">Reset Demo Database to Initial Seed</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Restores default 12 SKUs, 8 Operations, 5 Global Warehouses, and clean move ledger.
              </p>
            </div>
            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
