import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  SlidersHorizontal,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  ChevronRight,
  Building2,
  Calendar,
  Truck,
  Sparkles,
  LayoutGrid,
  List,
  UserCheck,
  FileText,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { Operation, OperationType, OperationStatus } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { SlideDrawer } from "../../components/ui/SlideDrawer";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency } from "../../lib/utils";

export const OperationsPage: React.FC = () => {
  const {
    operations,
    products,
    warehouses,
    validateOperation,
    updateOperationStatus,
    addOperation,
  } = useInventory();

  const [searchParams, setSearchParams] = useSearchParams();

  // Operation Type Tab
  const initialType = (searchParams.get("type") as OperationType) || "receipt";
  const initialOpId = searchParams.get("opId");
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<OperationType>(initialType);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected detail operation
  const [selectedOp, setSelectedOp] = useState<Operation | null>(() => {
    return initialOpId ? operations.find((o) => o.id === initialOpId) || null : null;
  });

  // Validating loader state
  const [isValidating, setIsValidating] = useState(false);

  // New Operation Drawer
  const [isNewOpOpen, setIsNewOpOpen] = useState(
    initialAction === "new_receipt" || initialAction === "new_delivery"
  );
  const [newOpType, setNewOpType] = useState<OperationType>(
    initialAction === "new_delivery" ? "delivery" : "receipt"
  );

  // Printable Delivery Slip Modal
  const [printOp, setPrintOp] = useState<Operation | null>(null);

  // Filter operations for active tab and search
  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      const matchesType = op.type === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        op.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.lines.some((l) => l.productName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesSearch;
    });
  }, [operations, activeTab, searchQuery]);

  // Kanban Columns
  const kanbanColumns: { id: OperationStatus; label: string; count: number }[] = [
    {
      id: "draft",
      label: "Draft Consignment",
      count: filteredOperations.filter((o) => o.status === "draft").length,
    },
    {
      id: "waiting",
      label: "Waiting Availability",
      count: filteredOperations.filter((o) => o.status === "waiting").length,
    },
    {
      id: "ready",
      label: "Ready / In Transit",
      count: filteredOperations.filter((o) => o.status === "ready").length,
    },
    {
      id: "done",
      label: "Done / Validated",
      count: filteredOperations.filter((o) => o.status === "done").length,
    },
  ];

  const handleValidate = async (id: string) => {
    setIsValidating(true);
    const success = await validateOperation(id);
    setIsValidating(false);
    if (success && selectedOp && selectedOp.id === id) {
      const updated = operations.find((o) => o.id === id);
      if (updated) setSelectedOp({ ...updated, status: "done" });
    }
  };

  const getTabIcon = (type: OperationType) => {
    switch (type) {
      case "receipt":
        return ArrowDownLeft;
      case "delivery":
        return ArrowUpRight;
      case "transfer":
        return ArrowLeftRight;
      case "adjustment":
        return SlidersHorizontal;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Operations & Shipments
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track receipts, warehouse pick-pack-ship deliveries, transfers and cycle adjustments.
          </p>
        </div>

        <button
          onClick={() => {
            setNewOpType(activeTab);
            setIsNewOpOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New {activeTab.toUpperCase()}</span>
        </button>
      </div>

      {/* Operation Type Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-bg-surface border border-white/10 rounded-2xl">
          {[
            { id: "receipt", label: "Inbound Receipts", icon: ArrowDownLeft },
            { id: "delivery", label: "Outbound Deliveries", icon: ArrowUpRight },
            { id: "transfer", label: "Internal Transfers", icon: ArrowLeftRight },
            { id: "adjustment", label: "Physical Adjustments", icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const count = operations.filter((o) => o.type === tab.id).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as OperationType);
                  setSearchParams({ type: tab.id });
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-gray-500"}`} />
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View mode toggle + Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference or partner..."
              className="w-full rounded-xl bg-bg-surface border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-bg-surface border border-white/10 rounded-xl">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "kanban" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="List Table"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Board: Kanban or Table */}
      {filteredOperations.length === 0 ? (
        <EmptyState
          icon={Truck}
          title={`No ${activeTab.toUpperCase()} Operations`}
          description={`There are currently no active ${activeTab} documents matching your search filter.`}
          actionLabel={`Create ${activeTab.toUpperCase()}`}
          onAction={() => {
            setNewOpType(activeTab);
            setIsNewOpOpen(true);
          }}
        />
      ) : viewMode === "kanban" ? (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colOps = filteredOperations.filter((o) => o.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-2xl bg-bg-surface/60 border border-white/5 p-3.5 flex flex-col min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {col.count}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colOps.map((op) => (
                    <div
                      key={op.id}
                      onClick={() => setSelectedOp(op)}
                      className="glass-card p-4 rounded-xl cursor-pointer group hover:border-blue-500/40 transition-all space-y-3"
                    >
                      {/* Top Ref & Priority */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {op.ref}
                        </span>
                        {op.priority && op.priority !== "normal" && (
                          <span
                            className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                              op.priority === "critical"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {op.priority}
                          </span>
                        )}
                      </div>

                      {/* Partner & Location */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-200 line-clamp-1">
                          {op.partner}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {op.sourceLocation.split("/")[0]} → {op.destinationLocation.split("/")[0]}
                        </p>
                      </div>

                      {/* Line Items Count & Date */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-medium text-gray-300">
                          {op.lines.length} Line Item{op.lines.length > 1 ? "s" : ""}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500">
                          {op.scheduledDate.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  ))}

                  {colOps.length === 0 && (
                    <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-gray-600 text-xs">
                      No operations in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Partner / Customer</th>
                  <th className="py-3.5 px-4">Origin → Destination</th>
                  <th className="py-3.5 px-4">Scheduled Date</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOperations.map((op) => (
                  <tr
                    key={op.id}
                    onClick={() => setSelectedOp(op)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white hover:text-blue-400">
                      {op.ref}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-200">{op.partner}</td>
                    <td className="py-3.5 px-4 text-gray-400 text-[11px] max-w-xs truncate">
                      {op.sourceLocation} → {op.destinationLocation}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-400">{op.scheduledDate}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-gray-200">
                      {op.lines.length}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={op.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOp(op);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OPERATION DETAIL SLIDE-OVER DRAWER */}
      {selectedOp && (
        <SlideDrawer
          isOpen={!!selectedOp}
          onClose={() => setSelectedOp(null)}
          title={`Consignment: ${selectedOp.ref}`}
          subtitle={`${selectedOp.type.toUpperCase()} • ${selectedOp.partner}`}
          width="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintOp(selectedOp)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedOp.status !== "done" && (
                  <button
                    type="button"
                    disabled={isValidating}
                    onClick={() => handleValidate(selectedOp.id)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isValidating ? "Validating Ledger..." : "Validate & Post Stock"}</span>
                  </button>
                )}
                {selectedOp.status === "done" && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                    Validated on {selectedOp.validatedAt}
                  </span>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Status & Meta Card */}
            <div className="p-4 rounded-2xl bg-bg-base/70 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <Badge status={selectedOp.status} size="md" />
                <span className="text-xs font-mono text-gray-400">
                  Scheduled: <strong className="text-white">{selectedOp.scheduledDate}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-semibold">
                    Origin / Source
                  </span>
                  <span className="text-white font-medium">{selectedOp.sourceLocation}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-semibold">
                    Destination / Dock
                  </span>
                  <span className="text-white font-medium">{selectedOp.destinationLocation}</span>
                </div>
              </div>

              {selectedOp.trackingNumber && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Carrier Waybill / Tracking:</span>
                  <span className="font-mono text-blue-400 font-semibold">
                    {selectedOp.trackingNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Manifest Line Items ({selectedOp.lines.length})
                </h4>
              </div>

              <div className="rounded-xl border border-white/10 overflow-hidden bg-bg-base/40">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      <th className="py-2.5 px-3">Item / SKU</th>
                      <th className="py-2.5 px-3 text-right">Requested</th>
                      <th className="py-2.5 px-3 text-right">Done Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {selectedOp.lines.map((line) => (
                      <tr key={line.id}>
                        <td className="py-2.5 px-3 font-sans">
                          <div className="font-semibold text-white">{line.productName}</div>
                          <div className="text-[10px] font-mono text-gray-500">{line.sku}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right text-white font-bold">
                          {line.demandQty} {line.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={
                              selectedOp.status === "done" || line.doneQty === line.demandQty
                                ? "text-emerald-400 font-bold"
                                : "text-amber-400"
                            }
                          >
                            {selectedOp.status === "done" ? line.demandQty : line.doneQty} {line.unit}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-400">
                          {line.price ? formatCurrency(line.price) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedOp.notes && (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400">
                <span className="font-semibold text-gray-300 block mb-1">Operational Notes:</span>
                <p className="leading-relaxed">{selectedOp.notes}</p>
              </div>
            )}
          </div>
        </SlideDrawer>
      )}

      {/* CREATE NEW OPERATION SLIDE DRAWER */}
      <SlideDrawer
        isOpen={isNewOpOpen}
        onClose={() => setIsNewOpOpen(false)}
        title={`Create New ${newOpType.toUpperCase()}`}
        subtitle="Initiate a draft receipt, outbound dispatch or internal inventory transfer."
        width="xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const partner = (form.elements.namedItem("partner") as HTMLInputElement).value;
            const src = (form.elements.namedItem("src") as HTMLInputElement).value;
            const dest = (form.elements.namedItem("dest") as HTMLInputElement).value;
            const selectedProdId = (form.elements.namedItem("prod") as HTMLSelectElement).value;
            const qty = parseInt((form.elements.namedItem("qty") as HTMLInputElement).value, 10) || 10;

            const targetProd = products.find((p) => p.id === selectedProdId) || products[0];

            addOperation({
              ref: `WH/${newOpType === "receipt" ? "IN" : newOpType === "delivery" ? "OUT" : "INT"}/2026/00${Math.floor(100 + Math.random() * 900)}`,
              type: newOpType,
              status: "ready",
              partner,
              sourceLocation: src,
              destinationLocation: dest,
              scheduledDate: new Date().toISOString().substring(0, 10) + " 15:00",
              priority: "normal",
              lines: [
                {
                  id: `line-${Date.now()}`,
                  productId: targetProd.id,
                  productName: targetProd.name,
                  sku: targetProd.sku,
                  demandQty: qty,
                  doneQty: 0,
                  unit: targetProd.unit,
                  price: targetProd.unitPrice,
                },
              ],
            });

            setIsNewOpOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Partner / Vendor / Customer</label>
            <input
              name="partner"
              type="text"
              required
              placeholder="e.g. Photonics Corp Global or AWS Data Center"
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Source Location</label>
              <input
                name="src"
                type="text"
                defaultValue="Austin Central Fulfillment / Stock"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Destination Location</label>
              <input
                name="dest"
                type="text"
                defaultValue="Berlin Euro Hub / High-Bay N"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Select SKU Line Item</label>
            <select
              name="prod"
              className="w-full rounded-xl bg-bg-surface border border-white/10 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Available: {p.totalStock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Consignment Quantity</label>
            <input
              name="qty"
              type="number"
              min="1"
              defaultValue="50"
              required
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent-blue py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
          >
            Create Operation
          </button>
        </form>
      </SlideDrawer>

      {/* PRINTABLE DELIVERY SLIP MODAL */}
      {printOp && (
        <Modal
          isOpen={!!printOp}
          onClose={() => setPrintOp(null)}
          title="Print Consignment Bill of Lading"
          subtitle="Official logistics transfer manifest"
          maxWidth="lg"
          footer={
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-semibold hover:bg-blue-600"
            >
              Print Document
            </button>
          }
        >
          <div className="p-6 bg-white text-black rounded-xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h3 className="text-base font-black tracking-tight">APEX GLOBAL LOGISTICS</h3>
                <p className="text-[10px] text-gray-600">CERTIFIED INVENTORY TRANSFER BILL OF LADING</p>
              </div>
              <div className="text-right font-mono">
                <div className="font-bold text-sm">{printOp.ref}</div>
                <div className="text-[10px] text-gray-600">{printOp.scheduledDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-3">
              <div>
                <strong className="text-[10px] uppercase text-gray-500 block">Shipped From:</strong>
                <p className="font-semibold">{printOp.sourceLocation}</p>
              </div>
              <div>
                <strong className="text-[10px] uppercase text-gray-500 block">Deliver To / Partner:</strong>
                <p className="font-semibold">{printOp.partner}</p>
                <p className="text-[10px] text-gray-600">{printOp.destinationLocation}</p>
              </div>
            </div>

            <div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black text-[10px] uppercase">
                    <th className="py-1">Description</th>
                    <th className="py-1">SKU</th>
                    <th className="py-1 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {printOp.lines.map((l) => (
                    <tr key={l.id}>
                      <td className="py-1.5 font-bold">{l.productName}</td>
                      <td className="py-1.5 font-mono text-[10px]">{l.sku}</td>
                      <td className="py-1.5 text-right font-mono font-bold">
                        {l.demandQty} {l.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-gray-300 flex items-center justify-between text-[10px] text-gray-600">
              <span>Driver Signature: __________________</span>
              <span>Receiver Signature: __________________</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
