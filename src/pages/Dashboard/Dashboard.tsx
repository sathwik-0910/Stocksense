import React, { useState } from "react";
import {
  Boxes,
  DollarSign,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useInventory } from "../../context/InventoryContext";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../lib/utils";
import { stockTrendChartData, categoryDistributionData } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { kpiData, products, operations, moveHistory, selectedWarehouse, warehouses } = useInventory();
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("7d");
  const [docFilter, setDocFilter] = useState<"all" | "receipt" | "delivery" | "transfer">("all");
  const navigate = useNavigate();

  const activeWarehouseName =
    selectedWarehouse === "all"
      ? "Global Network (All Facilities)"
      : warehouses.find((w) => w.id === selectedWarehouse)?.name;

  const filteredMoves = moveHistory
    .filter((m) => {
      if (docFilter === "all") return true;
      return m.operationType === docFilter;
    })
    .slice(0, 6);

  const pendingOps = operations
    .filter((o) => o.status !== "done" && o.status !== "cancelled")
    .slice(0, 5);

  const lowStockProducts = products
    .filter((p) => p.status === "low_stock" || p.status === "out_of_stock")
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome & Global Scope Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Live Operations Hub
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">{activeWarehouseName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Executive Inventory Control
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time stock velocity, valuation telemetry, and multi-hub fulfilment pipeline.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate("/products?action=new")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-gray-200 hover:text-white transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 text-blue-400" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => navigate("/operations?action=new_receipt")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            <span>New Receipt</span>
          </button>

          <button
            onClick={() => navigate("/operations?action=new_delivery")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-emerald hover:bg-emerald-600 text-xs font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>New Delivery</span>
          </button>
        </div>
      </div>

      {/* AI Smart Insights Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-emerald-950/20 border border-blue-500/20 backdrop-blur-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white">AI Inventory Copilot Recommendation: </span>
            <span className="text-gray-300">
              Demand spike detected for <strong className="text-blue-300">Titan AI Boards (SKU-MCU-3310)</strong>. 28 units remaining — buffer runout in ~4.2 days.
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate("/operations?action=new_receipt&sku=SKU-MCU-3310")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
        >
          <span>Create Auto-PO</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Valuation */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Stock Value</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            <AnimatedCounter value={kpiData.totalValuation} prefix="$" />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +12.4% vs last mo
            </span>
            <span className="text-gray-500 font-mono">{products.length} Active Catalog SKUs</span>
          </div>
        </div>

        {/* Metric 2: Low & Depleted Stock */}
        <div
          onClick={() => navigate("/products?status=low_stock")}
          className="glass-card p-5 rounded-2xl relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Shortage Alerts</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
            <AnimatedCounter value={kpiData.lowStockCount} className="text-orange-400" />
            <span className="text-xs font-normal text-gray-400">low /</span>
            <AnimatedCounter value={kpiData.outOfStockCount} className="text-rose-400" />
            <span className="text-xs font-normal text-gray-400">empty</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-orange-300 font-medium hover:underline">View impacted SKUs</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Pending Inbound & Outbound */}
        <div
          onClick={() => navigate("/operations")}
          className="glass-card p-5 rounded-2xl relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Fulfillment Queue</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
            <AnimatedCounter value={kpiData.pendingReceipts} className="text-blue-400" />
            <span className="text-xs font-normal text-gray-400">IN /</span>
            <AnimatedCounter value={kpiData.pendingDeliveries} className="text-emerald-400" />
            <span className="text-xs font-normal text-gray-400">OUT</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-blue-300 font-medium">Ready for dock intake</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 4: Stock Accuracy */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Audit Accuracy</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            <AnimatedCounter value={kpiData.stockAccuracyRate} suffix="%" decimals={1} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-purple-300 font-mono">Turnover: {kpiData.monthlyTurnoverRate}x/mo</span>
            <span className="text-emerald-400 font-semibold">Verified</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Flow Velocity Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Throughput & Stock Velocity
              </h3>
              <p className="text-xs text-gray-400">
                Inbound receipts vs outbound dispatch volumes over time
              </p>
            </div>
            {/* Range Pills */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/5 rounded-xl self-start sm:self-auto">
              {(["7d", "30d", "90d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    dateRange === r
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockTrendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="receiptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#52525B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                />
                <YAxis
                  stroke="#52525B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141416",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Area
                  type="monotone"
                  dataKey="receipts"
                  name="Inbound Receipts"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#receiptGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  name="Outbound Deliveries"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#deliveryGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Inbound Inflow</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Outbound Outflow</span>
              </span>
            </div>
            <span className="font-mono text-[11px] text-gray-500">Peak Rate: 890 units/day</span>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Category Valuation</h3>
            <p className="text-xs text-gray-400">Stock distribution across product classes</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141416",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  formatter={((value: any, name: any) => [`${value}% of Inventory`, "Share"]) as any}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs text-gray-400 uppercase font-mono">Classes</span>
              <span className="text-lg font-bold text-white font-mono">5</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {categoryDistributionData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="font-mono text-gray-400 shrink-0 font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Operations & Stock Shortages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Active Operations Pipeline */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Active Consignments</h3>
              <p className="text-xs text-gray-400">Shipments awaiting intake, packing or validation</p>
            </div>
            <button
              onClick={() => navigate("/operations")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>All Operations</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingOps.map((op) => (
              <div
                key={op.id}
                onClick={() => navigate(`/operations?opId=${op.id}`)}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-lg bg-white/5 text-gray-300 border border-white/10 shrink-0 group-hover:border-blue-500/30">
                    <ArrowLeftRight className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {op.ref}
                      </span>
                      <Badge status={op.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {op.partner} • {op.lines.length} Line items
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-gray-400">{op.scheduledDate.split(" ")[0]}</span>
                  <div className="text-[10px] uppercase font-semibold text-gray-500">{op.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Critical Low Stock Items */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Stock Shortage Monitor</h3>
              <p className="text-xs text-gray-400">Items below recommended safety thresholds</p>
            </div>
            <button
              onClick={() => navigate("/products?status=low_stock")}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
            >
              <span>View Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products?search=${encodeURIComponent(p.sku)}`)}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-xs text-white group-hover:text-orange-300 transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      {p.sku} • Min buffer: {p.minStock} {p.unit}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-orange-400">
                    {p.totalStock} <span className="text-xs font-normal text-gray-400">{p.unit}</span>
                  </div>
                  <Badge status={p.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Stock Ledger / Recent Activity Feed */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Live Stock Movement Ledger</h3>
            <p className="text-xs text-gray-400">Real-time bank statement-style transaction entries</p>
          </div>

          {/* Document Type Pill Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/5 rounded-xl">
            {(["all", "receipt", "delivery", "transfer"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setDocFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  docFilter === filter
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {filter === "all" ? "All Moves" : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3">Item / SKU</th>
                <th className="py-3 px-3">Source → Destination</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3">Operator</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMoves.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono text-gray-400 whitespace-nowrap">{m.timestamp}</td>
                  <td className="py-3 px-3 font-mono font-medium text-white whitespace-nowrap">{m.reference}</td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-gray-200">{m.productName}</div>
                    <div className="text-[10px] font-mono text-gray-500">{m.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-[11px] max-w-xs truncate">
                    <span>{m.fromLocation}</span>
                    <span className="text-gray-600 mx-1">→</span>
                    <span className="text-gray-300">{m.toLocation}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={m.quantity > 0 ? "text-emerald-400" : "text-rose-400"}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-400">{m.user}</td>
                  <td className="py-3 px-3 text-right">
                    <Badge variant={m.status === "done" ? "done" : "waiting"} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>Showing latest {filteredMoves.length} audited ledger transactions</span>
          <button
            onClick={() => navigate("/moves")}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Open Complete Audit Trail</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
