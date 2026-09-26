import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Package,
  ArrowLeftRight,
  Building2,
  PlusCircle,
  TrendingUp,
  History,
  X,
  Sparkles,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { useNavigate } from "react-router-dom";

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    products,
    operations,
    warehouses,
    setSelectedWarehouse,
  } = useInventory();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Focus on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredOperations = operations.filter(
    (o) =>
      o.ref.toLowerCase().includes(query.toLowerCase()) ||
      o.partner.toLowerCase().includes(query.toLowerCase()) ||
      o.type.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.location.toLowerCase().includes(query.toLowerCase()) ||
      w.code.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectProduct = (sku: string) => {
    setIsCommandPaletteOpen(false);
    navigate(`/products?search=${encodeURIComponent(sku)}`);
  };

  const handleSelectOperation = (id: string) => {
    setIsCommandPaletteOpen(false);
    navigate(`/operations?opId=${id}`);
  };

  const handleSelectWarehouse = (id: string) => {
    setSelectedWarehouse(id);
    setIsCommandPaletteOpen(false);
    navigate("/warehouses");
  };

  const handleNavigate = (path: string) => {
    setIsCommandPaletteOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-bg-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 animate-fade-in">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-bg-base/60">
          <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, product, SKU, transfer or warehouse..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-gray-500 hover:text-white rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="ml-2 text-[10px] text-gray-500 uppercase tracking-widest font-mono border border-white/10 px-1.5 py-0.5 rounded">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Quick Actions (when query is short) */}
          {query.length === 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                Quick Actions
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleNavigate("/products?action=new")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">Add New SKU Item</div>
                    <div className="text-[10px] text-gray-500">Create catalog entry</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavigate("/operations?action=new_receipt")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ArrowLeftRight className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="font-medium">Create Inbound Receipt</div>
                    <div className="text-[10px] text-gray-500">PO consignment intake</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavigate("/moves")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <History className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="font-medium">Audit Move Ledger</div>
                    <div className="text-[10px] text-gray-500">Stock transaction history</div>
                  </div>
                </button>
                <button
                  onClick={() => handleNavigate("/warehouses")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Building2 className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-medium">Manage Facilities</div>
                    <div className="text-[10px] text-gray-500">Capacity & storage bays</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Products Results */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Package className="h-3 w-3 text-blue-400" />
                Products & Inventory ({filteredProducts.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p.sku)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/5 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <Package className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-gray-200 group-hover:text-white truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {p.sku} • {p.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-gray-200 font-medium">{p.totalStock} {p.unit}</div>
                      <div className={`text-[10px] ${
                        p.status === "low_stock"
                          ? "text-orange-400"
                          : p.status === "out_of_stock"
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}>
                        {p.status.replace("_", " ")}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Operations Results */}
          {filteredOperations.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <ArrowLeftRight className="h-3 w-3 text-emerald-400" />
                Active Operations & Transfers ({filteredOperations.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredOperations.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleSelectOperation(o.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/5 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-mono font-medium text-gray-200 group-hover:text-white">
                          {o.ref}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {o.partner} • {o.type.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-white/5 text-gray-300 border border-white/10">
                      {o.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Warehouses Results */}
          {filteredWarehouses.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-amber-400" />
                Warehouses & Facilities
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredWarehouses.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleSelectWarehouse(w.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/5 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200 group-hover:text-white">
                          {w.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {w.code} • {w.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">
                        {Math.round((w.usedCapacityUnits / w.totalCapacityUnits) * 100)}% Cap
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty Search */}
          {query.length > 0 &&
            filteredProducts.length === 0 &&
            filteredOperations.length === 0 &&
            filteredWarehouses.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>No matching inventory, operations or facilities found for "{query}".</p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-bg-base/80 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>Navigate with</span>
            <kbd className="rounded bg-white/5 px-1 py-0.5 text-[9px] border border-white/10 text-gray-400">↑</kbd>
            <kbd className="rounded bg-white/5 px-1 py-0.5 text-[9px] border border-white/10 text-gray-400">↓</kbd>
            <span>and</span>
            <kbd className="rounded bg-white/5 px-1 py-0.5 text-[9px] border border-white/10 text-gray-400">↵ Enter</kbd>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>Apex High-Performance Index</span>
          </div>
        </div>
      </div>
    </div>
  );
};
