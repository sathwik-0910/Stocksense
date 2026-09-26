import React, { useState } from "react";
import {
  Building2,
  Plus,
  Users,
  Layers,
  MapPin,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  Shield,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { Warehouse } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { formatNumber } from "../../lib/utils";

export const WarehousesPage: React.FC = () => {
  const { warehouses, addWarehouse, setSelectedWarehouse, selectedWarehouse } = useInventory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    address: "",
    totalCapacityUnits: 100000,
    usedCapacityUnits: 45000,
    sqFt: 60000,
    zonesCount: 10,
    activeStaff: 25,
    status: "active" as const,
    manager: "",
    managerEmail: "",
  });

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    addWarehouse({
      ...formData,
      code: formData.code.toUpperCase(),
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Facilities & Warehouses
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage global storage hubs, bin capacities, zones, and facility manager staffing.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              code: `WH-${Math.random().toString(36).substring(2, 5).toUpperCase()}-0${warehouses.length + 1}`,
              name: "",
              location: "",
              address: "",
              totalCapacityUnits: 80000,
              usedCapacityUnits: 20000,
              sqFt: 50000,
              zonesCount: 8,
              activeStaff: 18,
              status: "active",
              manager: "",
              managerEmail: "",
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Warehouse</span>
        </button>
      </div>

      {/* Global Capacity Metric Header */}
      <div className="p-6 rounded-2xl bg-bg-surface border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Global Distribution Grid</h3>
            <p className="text-xs text-gray-400">
              {warehouses.length} Active Fulfillment Centers Across 3 Continents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Capacity</span>
            <div className="text-lg font-bold font-mono text-white">
              {formatNumber(warehouses.reduce((sum, w) => sum + w.totalCapacityUnits, 0))} <span className="text-xs font-normal text-gray-500">Units</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">Utilized</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {Math.round(
                (warehouses.reduce((sum, w) => sum + w.usedCapacityUnits, 0) /
                  warehouses.reduce((sum, w) => sum + w.totalCapacityUnits, 0)) *
                  100
              )}
              %
            </div>
          </div>
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Staff</span>
            <div className="text-lg font-bold font-mono text-white">
              {warehouses.reduce((sum, w) => sum + w.activeStaff, 0)} <span className="text-xs font-normal text-gray-500">Operators</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const utilPercent = Math.round((wh.usedCapacityUnits / wh.totalCapacityUnits) * 100);
          const isSelected = selectedWarehouse === wh.id;

          return (
            <div
              key={wh.id}
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all ${
                isSelected ? "border-emerald-500/40 shadow-emerald-500/10 ring-1 ring-emerald-500/30" : ""
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                      {wh.code}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {wh.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      wh.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        wh.status === "active" ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    {wh.status === "active" ? "Operational" : "Maintenance"}
                  </span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-4">
                  <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <span className="truncate">{wh.address}, {wh.location}</span>
                </p>

                {/* Capacity Progress Bar */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Capacity Utilization</span>
                    <span className="font-mono font-bold text-white">{utilPercent}%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        utilPercent > 90
                          ? "bg-rose-500"
                          : utilPercent > 75
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${utilPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-1">
                    <span>{formatNumber(wh.usedCapacityUnits)} used</span>
                    <span>{formatNumber(wh.totalCapacityUnits)} total</span>
                  </div>
                </div>

                {/* Metrics 3-Col */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Footprint</div>
                    <div className="font-mono font-semibold text-gray-200 mt-0.5">
                      {formatNumber(wh.sqFt)} <span className="text-[10px] text-gray-500">sq ft</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Zones</div>
                    <div className="font-mono font-semibold text-gray-200 mt-0.5">
                      {wh.zonesCount} <span className="text-[10px] text-gray-500">Bays</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Staff</div>
                    <div className="font-mono font-semibold text-gray-200 mt-0.5">
                      {wh.activeStaff} <span className="text-[10px] text-gray-500">Operators</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Manager + Scope Toggle */}
              <div className="mt-4 pt-3 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Lead Manager</div>
                  <div className="text-xs font-semibold text-gray-300">{wh.manager}</div>
                </div>

                <button
                  onClick={() => setSelectedWarehouse(isSelected ? "all" : wh.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                  }`}
                >
                  {isSelected ? "Active Scope" : "Filter Scope"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD WAREHOUSE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Storage Facility"
        subtitle="Register a new distribution center or regional fulfillment hub."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateWarehouse} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Facility Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="WH-NYC-06"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Facility Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="New York Express Logistics"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">City, Country</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="New York, USA"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="55 Water St, Pier 12"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Total Capacity</label>
              <input
                type="number"
                min="1000"
                value={formData.totalCapacityUnits}
                onChange={(e) =>
                  setFormData({ ...formData, totalCapacityUnits: parseInt(e.target.value, 10) || 0 })
                }
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Sq. Footage</label>
              <input
                type="number"
                min="100"
                value={formData.sqFt}
                onChange={(e) =>
                  setFormData({ ...formData, sqFt: parseInt(e.target.value, 10) || 0 })
                }
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Staff Count</label>
              <input
                type="number"
                min="1"
                value={formData.activeStaff}
                onChange={(e) =>
                  setFormData({ ...formData, activeStaff: parseInt(e.target.value, 10) || 0 })
                }
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Manager Name</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="Marcus Sterling"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Manager Email</label>
              <input
                type="email"
                value={formData.managerEmail}
                onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                placeholder="m.sterling@apex-ims.io"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Create Facility Node
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
