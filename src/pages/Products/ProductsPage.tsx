import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  Download,
  Barcode,
  ChevronDown,
  ChevronRight,
  Boxes,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  Sparkles,
  Building2,
  History,
  Tag,
  Check,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { Product, StockStatus } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { SlideDrawer } from "../../components/ui/SlideDrawer";
import { Modal } from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency } from "../../lib/utils";

export const ProductsPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    warehouses,
    selectedWarehouse,
    moveHistory,
  } = useInventory();

  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialSearch = searchParams.get("search") || searchParams.get("sku") || "";
  const initialStatus = searchParams.get("status") || "all";
  const initialAction = searchParams.get("action");

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Expandable row state
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Slide Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(initialAction === "new");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Barcode Modal state
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);

  // History Inspector state
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);

  // Form State for Drawer
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Network Hardware",
    unitPrice: 0,
    costPrice: 0,
    totalStock: 0,
    minStock: 20,
    maxStock: 500,
    barcode: "",
    unit: "Units",
    locationCode: "Rack A-01",
    tags: "High Value, Fast Mover",
    supplier: "",
    description: "",
    warehouseStock: {} as Record<string, number>,
  });

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery);

      // Status
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      // Category
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      // Warehouse Scope
      const matchesWarehouse =
        selectedWarehouse === "all" ||
        (p.warehouseStock[selectedWarehouse] && p.warehouseStock[selectedWarehouse] > 0);

      return matchesSearch && matchesStatus && matchesCategory && matchesWarehouse;
    });
  }, [products, searchQuery, statusFilter, categoryFilter, selectedWarehouse]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddDrawer = () => {
    setEditingProduct(null);
    const initialWhStock: Record<string, number> = {};
    warehouses.forEach((w) => {
      initialWhStock[w.id] = 0;
    });

    setFormData({
      sku: `SKU-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: "Network Hardware",
      unitPrice: 250,
      costPrice: 150,
      totalStock: 100,
      minStock: 30,
      maxStock: 600,
      barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      unit: "Units",
      locationCode: "Rack A-01-B1",
      tags: "Standard, Active",
      supplier: "Global Interconnect Ltd",
      description: "",
      warehouseStock: initialWhStock,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unitPrice: product.unitPrice,
      costPrice: product.costPrice,
      totalStock: product.totalStock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      barcode: product.barcode,
      unit: product.unit,
      locationCode: product.locationCode,
      tags: product.tags.join(", "),
      supplier: product.supplier || "",
      description: product.description || "",
      warehouseStock: { ...product.warehouseStock },
    });
    setIsDrawerOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // Compute status
    let computedStatus: StockStatus = "in_stock";
    if (formData.totalStock === 0) computedStatus = "out_of_stock";
    else if (formData.totalStock <= formData.minStock) computedStatus = "low_stock";

    const tagList = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData,
        status: computedStatus,
        tags: tagList,
      });
    } else {
      addProduct({
        ...formData,
        status: computedStatus,
        tags: tagList,
      });
    }

    setIsDrawerOpen(false);
  };

  const handleExportCSV = () => {
    const headers = "SKU,Name,Category,Total Stock,Unit,Unit Price,Cost Price,Status,Barcode\n";
    const rows = filteredProducts
      .map(
        (p) =>
          `"${p.sku}","${p.name}","${p.category}",${p.totalStock},"${p.unit}",${p.unitPrice},${p.costPrice},"${p.status}","${p.barcode}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Apex-Inventory-Export-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Inventory & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse, monitor stock levels, multi-warehouse allocations, and item SKUs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-200 transition-all active:scale-95"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5 text-gray-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddDrawer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filter Pills + View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU or barcode..."
            className="w-full rounded-xl bg-bg-surface border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Middle & Right: Status Filter Pills + Category + View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Pills */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
            {[
              { id: "all", label: "All Stock" },
              { id: "in_stock", label: "In Stock" },
              { id: "low_stock", label: "Low Stock" },
              { id: "out_of_stock", label: "Depleted" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-bg-surface border border-white/10 px-3 py-1.5 text-xs text-gray-300 focus:border-blue-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No Products Found"
          description="Try adjusting your search query, status filters or warehouse scope."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
        />
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4 w-8"></th>
                  <th className="py-3.5 px-4">Item & SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Available Qty</th>
                  <th className="py-3.5 px-4 text-right">Unit Price</th>
                  <th className="py-3.5 px-4 text-right">Total Value</th>
                  <th className="py-3.5 px-4">Primary Bin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const isExpanded = !!expandedRows[p.id];
                  const totalValue = p.totalStock * p.unitPrice;

                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          isExpanded ? "bg-white/[0.02]" : ""
                        }`}
                        onClick={() => toggleRow(p.id)}
                      >
                        {/* Expand Chevron */}
                        <td className="py-3.5 px-4 text-gray-500">
                          <button
                            type="button"
                            className="p-1 hover:text-white rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(p.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-blue-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        {/* Product Name & SKU */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white hover:text-blue-400 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[11px] font-mono text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{p.sku}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Barcode className="h-3 w-3" /> {p.barcode}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium">
                            {p.category}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-mono font-bold text-sm text-white">
                            {p.totalStock}
                          </span>
                          <span className="text-[11px] text-gray-500 ml-1">{p.unit}</span>
                        </td>

                        {/* Unit Price */}
                        <td className="py-3.5 px-4 text-right font-mono text-gray-300">
                          {formatCurrency(p.unitPrice)}
                        </td>

                        {/* Total Value */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-emerald-400">
                          {formatCurrency(totalValue)}
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                          {p.locationCode}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <Badge status={p.status} size="sm" />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setBarcodeProduct(p)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-white/5 transition-colors"
                              title="Print Barcode Label"
                            >
                              <Barcode className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setHistoryProduct(p)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-white/5 transition-colors"
                              title="Stock Move History"
                            >
                              <History className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditDrawer(p)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                              title="Delete SKU"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* EXPANDABLE MULTI-WAREHOUSE BREAKDOWN */}
                      {isExpanded && (
                        <tr className="bg-white/[0.015] border-b border-white/5">
                          <td colSpan={9} className="p-4 pl-12">
                            <div className="p-4 rounded-xl bg-bg-base/70 border border-white/10 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-emerald-400" />
                                  Multi-Warehouse Stock Allocation Breakdown
                                </span>
                                <span className="text-[11px] font-mono text-gray-400">
                                  Safety Min: {p.minStock} | Max Cap: {p.maxStock} {p.unit}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                                {warehouses.map((wh) => {
                                  const whQty = p.warehouseStock[wh.id] || 0;
                                  return (
                                    <div
                                      key={wh.id}
                                      className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                                    >
                                      <div className="text-[11px] font-medium text-gray-300 truncate">
                                        {wh.name}
                                      </div>
                                      <div className="text-[10px] text-gray-500">{wh.code}</div>
                                      <div className="mt-2 flex items-baseline justify-between">
                                        <span className="font-mono text-sm font-bold text-white">
                                          {whQty}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{p.unit}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Tags & Meta */}
                              <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[11px]">
                                <span className="text-gray-500">Item Tags:</span>
                                <div className="flex items-center gap-1.5">
                                  {p.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px]"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-gray-500 ml-auto">
                                  Supplier: <strong className="text-gray-300">{p.supplier}</strong>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                    {p.category}
                  </span>
                  <Badge status={p.status} size="sm" />
                </div>

                <h3 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-[11px] font-mono text-gray-500 mt-1">{p.sku}</p>

                <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Total Stock</span>
                    <span className="font-mono font-bold text-white">
                      {p.totalStock} {p.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Unit Price</span>
                    <span className="font-mono text-gray-300">{formatCurrency(p.unitPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Valuation</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatCurrency(p.totalStock * p.unitPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500">{p.locationCode}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBarcodeProduct(p)}
                    className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-white/5"
                    title="Barcode"
                  >
                    <Barcode className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditDrawer(p)}
                    className="p-1.5 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-white/5"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SLIDE-OVER DRAWER: ADD / EDIT PRODUCT */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct ? "Edit Product SKU" : "Create New Catalog Product"}
        subtitle="Configure physical item specifications, pricing, safety buffers, and multi-location balances."
        width="xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              className="px-5 py-2 rounded-xl bg-accent-blue hover:bg-blue-600 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              {editingProduct ? "Save Changes" : "Create Product SKU"}
            </button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSaveProduct} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              General Information
            </h4>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Product Title / Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Quantum Optical Transceiver 400G"
                required
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">SKU Code</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-XXX-0000"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Network Hardware"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Unit */}
          <div className="space-y-4 border-t border-white/5 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pricing & Valuation
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })
                  }
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Cost Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                  }
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Unit of Measure</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="Units, Boxes, Kg"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stock Levels & Buffer */}
          <div className="space-y-4 border-t border-white/5 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Stock Thresholds & Location
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Total On-Hand</label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalStock}
                  onChange={(e) =>
                    setFormData({ ...formData, totalStock: parseInt(e.target.value, 10) || 0 })
                  }
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Min Safety Buffer</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })
                  }
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Storage Location</label>
                <input
                  type="text"
                  value={formData.locationCode}
                  onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
                  placeholder="Rack A-04-B3"
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Barcode / UPC</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="12-digit standard barcode"
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Warehouse Allocation */}
          <div className="space-y-4 border-t border-white/5 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Facility Allocations
            </h4>
            <div className="space-y-2">
              {warehouses.map((wh) => (
                <div key={wh.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-gray-300 font-medium">{wh.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={formData.warehouseStock[wh.id] || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setFormData({
                          ...formData,
                          warehouseStock: {
                            ...formData.warehouseStock,
                            [wh.id]: val,
                          },
                        });
                      }}
                      className="w-20 rounded-lg bg-white/[0.05] border border-white/10 px-2 py-1 text-xs font-mono text-right text-white focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-xs text-gray-500">{formData.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </SlideDrawer>

      {/* MODAL: BARCODE & LABEL PRINTING */}
      {barcodeProduct && (
        <Modal
          isOpen={!!barcodeProduct}
          onClose={() => setBarcodeProduct(null)}
          title="Print High-Density Barcode Label"
          subtitle="Enterprise 1D Code-128 / QR dispatch format"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-gray-500 font-mono">Zebra ZT411 Ready</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
              >
                Send to Thermal Printer
              </button>
            </div>
          }
        >
          <div className="p-6 rounded-xl bg-white text-black text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-600">
              <span>APEX LOGISTICS TAG</span>
              <span>{barcodeProduct.category}</span>
            </div>

            <div className="text-left">
              <h4 className="text-sm font-black text-black">{barcodeProduct.name}</h4>
              <p className="text-xs font-mono font-bold text-gray-700 mt-0.5">{barcodeProduct.sku}</p>
            </div>

            {/* Generated Mock Barcode Lines */}
            <div className="py-3 flex flex-col items-center justify-center">
              <div className="flex items-end justify-center h-16 w-64 gap-[3px] bg-white p-1">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{
                      width: i % 3 === 0 ? "4px" : i % 2 === 0 ? "2px" : "1px",
                      height: i % 5 === 0 ? "100%" : "85%",
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs tracking-widest font-bold mt-1 text-black">
                *{barcodeProduct.barcode}*
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-300 pt-2 text-[10px] font-mono text-gray-800">
              <span>LOC: {barcodeProduct.locationCode}</span>
              <span>UNIT: {barcodeProduct.unit}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: STOCK MOVE HISTORY FOR SKU */}
      {historyProduct && (
        <Modal
          isOpen={!!historyProduct}
          onClose={() => setHistoryProduct(null)}
          title={`Movement History: ${historyProduct.name}`}
          subtitle={`Audited ledger transfers for SKU ${historyProduct.sku}`}
          maxWidth="2xl"
        >
          <div className="space-y-3">
            {moveHistory.filter((m) => m.sku === historyProduct.sku).length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No stock movement recorded for this SKU yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase font-semibold text-gray-500">
                      <th className="py-2">Date</th>
                      <th className="py-2">Reference</th>
                      <th className="py-2">Source → Target</th>
                      <th className="py-2 text-right">Quantity</th>
                      <th className="py-2">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {moveHistory
                      .filter((m) => m.sku === historyProduct.sku)
                      .map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 font-mono text-gray-400">{m.timestamp}</td>
                          <td className="py-2 font-mono text-white font-medium">{m.reference}</td>
                          <td className="py-2 text-gray-400 truncate max-w-[180px]">
                            {m.fromLocation} → {m.toLocation}
                          </td>
                          <td className="py-2 text-right font-mono font-bold">
                            <span className={m.quantity > 0 ? "text-emerald-400" : "text-rose-400"}>
                              {m.quantity > 0 ? `+${m.quantity}` : m.quantity} {m.unit}
                            </span>
                          </td>
                          <td className="py-2 text-gray-400">{m.user}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
