import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowDownUp,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  SlidersHorizontal,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { OperationType } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

export const MovesPage: React.FC = () => {
  const { moveHistory } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | OperationType>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredMoves = useMemo(() => {
    let filtered = moveHistory.filter((m) => {
      const matchSearch =
        searchQuery === "" ||
        m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === "all" || m.operationType === typeFilter;

      return matchSearch && matchType;
    });

    if (sortOrder === "oldest") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [moveHistory, searchQuery, typeFilter, sortOrder]);

  const getOpIcon = (type: OperationType) => {
    switch (type) {
      case "receipt":
        return <ArrowDownLeft className="h-4 w-4 text-blue-400" />;
      case "delivery":
        return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
      case "transfer":
        return <ArrowLeftRight className="h-4 w-4 text-purple-400" />;
      case "adjustment":
        return <SlidersHorizontal className="h-4 w-4 text-orange-400" />;
    }
  };

  const handleExportCSV = () => {
    const headers = "Timestamp,Reference,Type,Product,SKU,Quantity,Unit,From,To,User,Status\n";
    const rows = filteredMoves
      .map(
        (m) =>
          `"${m.timestamp}","${m.reference}","${m.operationType}","${m.productName}","${m.sku}",${m.quantity},"${m.unit}","${m.fromLocation}","${m.toLocation}","${m.user}","${m.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Apex-StockMoves-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Audit Trail & Move Ledger
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Complete inventory transfer history across all locations — bank-statement precision.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-200 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Download className="h-4 w-4 text-gray-400" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Moves",
            value: moveHistory.length,
            icon: ArrowLeftRight,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          },
          {
            label: "Inbound Receipts",
            value: moveHistory.filter((m) => m.operationType === "receipt").length,
            icon: ArrowDownLeft,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            label: "Outbound Dispatches",
            value: moveHistory.filter((m) => m.operationType === "delivery").length,
            icon: ArrowUpRight,
            color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          },
          {
            label: "Transfers",
            value: moveHistory.filter((m) => m.operationType === "transfer").length,
            icon: ArrowLeftRight,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-white">{stat.value}</div>
              <div className="text-[11px] text-gray-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product, SKU, reference, or operator..."
            className="w-full rounded-xl bg-bg-surface border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 bg-bg-surface border border-white/10 rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "receipt", label: "Receipt" },
              { id: "delivery", label: "Delivery" },
              { id: "transfer", label: "Transfer" },
              { id: "adjustment", label: "Adjust" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  typeFilter === f.id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-surface border border-white/10 text-xs font-medium text-gray-300 hover:border-white/20 transition-all"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-gray-400" />
            <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>
      </div>

      {/* The Ledger Table */}
      {filteredMoves.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No Ledger Entries Found"
          description="There are no matching stock movement transactions for your current filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setTypeFilter("all");
          }}
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="sticky top-0">
                <tr className="border-b border-white/10 bg-bg-surface text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-4">Date / Time</th>
                  <th className="py-4 px-4">Reference</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Product</th>
                  <th className="py-4 px-4">Source → Destination</th>
                  <th className="py-4 px-4 text-right">Quantity</th>
                  <th className="py-4 px-4">Operator</th>
                  <th className="py-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMoves.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                      idx % 2 === 0 ? "" : "bg-white/[0.01]"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-gray-400 whitespace-nowrap">
                      {m.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white whitespace-nowrap">
                      {m.reference}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getOpIcon(m.operationType)}
                        <span className="capitalize font-medium text-gray-300">
                          {m.operationType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{m.productName}</div>
                      <div className="text-[10px] font-mono text-gray-500">{m.sku}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-[11px] max-w-[260px] truncate">
                      <span>{m.fromLocation}</span>
                      <span className="text-gray-600 mx-1">→</span>
                      <span className="text-gray-300">{m.toLocation}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black">
                      <span
                        className={`text-sm ${
                          m.quantity > 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                      <div className="text-[10px] text-gray-500">{m.unit}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                      {m.user}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge
                        variant={
                          m.status === "done"
                            ? "done"
                            : m.status === "reverted"
                            ? "cancelled"
                            : "waiting"
                        }
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
