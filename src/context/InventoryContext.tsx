import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Product,
  Operation,
  MoveLedgerEntry,
  Warehouse,
  UserProfile,
  NotificationItem,
  KPIData,
  OperationStatus,
  OperationType,
} from "../types";
import {
  initialProducts,
  initialOperations,
  initialMoveHistory,
  initialWarehouses,
  mockUsers,
  initialNotifications,
} from "../data/mockData";

interface InventoryContextType {
  // Auth
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  users: UserProfile[];

  // Warehouse selection
  selectedWarehouse: string; // 'all' or warehouse.id
  setSelectedWarehouse: (id: string) => void;
  warehouses: Warehouse[];
  addWarehouse: (wh: Omit<Warehouse, "id">) => void;
  updateWarehouse: (wh: Warehouse) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "updatedAt">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Operations
  operations: Operation[];
  addOperation: (op: Omit<Operation, "id">) => void;
  updateOperationStatus: (id: string, status: OperationStatus) => void;
  validateOperation: (id: string) => Promise<boolean>;
  deleteOperation: (id: string) => void;

  // Ledger
  moveHistory: MoveLedgerEntry[];
  addMoveEntry: (entry: Omit<MoveLedgerEntry, "id" | "timestamp">) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // KPIs
  kpiData: KPIData;

  // UI States
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  activeAccent: "emerald" | "blue" | "violet" | "cyan";
  setActiveAccent: (accent: "emerald" | "blue" | "violet" | "cyan") => void;
  triggerCelebration: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("apex_ims_user");
    return saved ? JSON.parse(saved) : mockUsers[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("apex_ims_user");
  });

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem("apex_ims_warehouses");
    return saved ? JSON.parse(saved) : initialWarehouses;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("apex_ims_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [operations, setOperations] = useState<Operation[]>(() => {
    const saved = localStorage.getItem("apex_ims_operations");
    return saved ? JSON.parse(saved) : initialOperations;
  });

  const [moveHistory, setMoveHistory] = useState<MoveLedgerEntry[]>(() => {
    const saved = localStorage.getItem("apex_ims_moves");
    return saved ? JSON.parse(saved) : initialMoveHistory;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("apex_ims_notifs");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeAccent, setActiveAccent] = useState<"emerald" | "blue" | "violet" | "cyan">("emerald");

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("apex_ims_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("apex_ims_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("apex_ims_warehouses", JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem("apex_ims_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("apex_ims_operations", JSON.stringify(operations));
  }, [operations]);

  useEffect(() => {
    localStorage.setItem("apex_ims_moves", JSON.stringify(moveHistory));
  }, [moveHistory]);

  useEffect(() => {
    localStorage.setItem("apex_ims_notifs", JSON.stringify(notifications));
  }, [notifications]);

  // Auth actions
  const login = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("apex_ims_user");
  };

  // Warehouse actions
  const addWarehouse = (wh: Omit<Warehouse, "id">) => {
    const newWh: Warehouse = {
      ...wh,
      id: `wh-${Date.now().toString(36)}`,
    };
    setWarehouses((prev) => [newWh, ...prev]);
  };

  const updateWarehouse = (wh: Warehouse) => {
    setWarehouses((prev) => prev.map((item) => (item.id === wh.id ? wh : item)));
  };

  // Product actions
  const addProduct = (prodData: Omit<Product, "id" | "updatedAt">) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now().toString(36)}`,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (prod: Product) => {
    const updatedProd = {
      ...prod,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? updatedProd : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Operation actions
  const addOperation = (opData: Omit<Operation, "id">) => {
    const newOp: Operation = {
      ...opData,
      id: `op-${Date.now().toString(36)}`,
    };
    setOperations((prev) => [newOp, ...prev]);
  };

  const updateOperationStatus = (id: string, status: OperationStatus) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status } : op))
    );
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
      });
    } catch {
      // ignore
    }
  };

    const validateOperation = async (id: string): Promise<boolean> => {
    const op = operations.find((o) => o.id === id);
    if (!op) return false;

    const validatedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    const validatedBy = currentUser ? currentUser.name : "System Operator";

    const updatedLines = op.lines.map((line) => ({
      ...line,
      doneQty: line.demandQty,
    }));

    setProducts((prevProds) => {
      return prevProds.map((prod) => {
        const line = op.lines.find(
          (l) => l.productId === prod.id || l.sku === prod.sku
        );
        if (!line) return prod;

        let newTotalStock = prod.totalStock;
        const newWarehouseStock = { ...prod.warehouseStock };

        if (op.type === "receipt") {
          newTotalStock += line.demandQty;
          if (op.destinationLocation) {
            newWarehouseStock[op.destinationLocation] =
              (newWarehouseStock[op.destinationLocation] || 0) + line.demandQty;
          }
        } else if (op.type === "delivery") {
          newTotalStock -= line.demandQty;
          if (op.sourceLocation) {
            newWarehouseStock[op.sourceLocation] =
              (newWarehouseStock[op.sourceLocation] || 0) - line.demandQty;
          }
        } else if (op.type === "transfer") {
          if (op.sourceLocation) {
            newWarehouseStock[op.sourceLocation] =
              (newWarehouseStock[op.sourceLocation] || 0) - line.demandQty;
          }
          if (op.destinationLocation) {
            newWarehouseStock[op.destinationLocation] =
              (newWarehouseStock[op.destinationLocation] || 0) + line.demandQty;
          }
        } else if (op.type === "adjustment") {
          newTotalStock += line.demandQty;
          if (op.destinationLocation) {
            newWarehouseStock[op.destinationLocation] =
              (newWarehouseStock[op.destinationLocation] || 0) + line.demandQty;
          }
        }

        newTotalStock = Math.max(0, newTotalStock);

        let newStatus = prod.status;
        if (newTotalStock === 0) newStatus = "out_of_stock";
        else if (newTotalStock <= prod.minStock) newStatus = "low_stock";
        else newStatus = "in_stock";

        if (
          newStatus !== prod.status &&
          (newStatus === "low_stock" || newStatus === "out_of_stock")
        ) {
          setNotifications((prevN) => [
  {
    id: `notif-${Date.now().toString(36)}`,
    type: "warning",
    title: newStatus === "out_of_stock" ? "Out of stock" : "Low stock alert",
    message: `${prod.name} (${prod.sku}) is now ${newStatus.replace("_", " ")}.`,
    timestamp: validatedAt,
    read: false,
    actionLink: `/products?search=${prod.sku}`,
  },
  ...prevN,
]);
        }

        return {
          ...prod,
          totalStock: newTotalStock,
          warehouseStock: newWarehouseStock,
          status: newStatus,
          updatedAt: validatedAt,
        };
      });
    });

    op.lines.forEach((line) => {
      let qtyDelta = line.demandQty;
      if (op.type === "delivery") qtyDelta = -line.demandQty;

      const newMove: MoveLedgerEntry = {
        id: `move-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .substring(2, 5)}`,
        timestamp: validatedAt,
        reference: op.ref,
        operationType: op.type,
        productName: line.productName,
        sku: line.sku,
        fromLocation: op.sourceLocation,
        toLocation: op.destinationLocation,
        quantity: qtyDelta,
        unit: line.unit,
        user: validatedBy,
        status: "done",
      };
      setMoveHistory((prev) => [newMove, ...prev]);
    });

    setOperations((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "done" as OperationStatus,
              lines: updatedLines,
              validatedAt,
              validatedBy,
            }
          : o
      )
    );

    triggerCelebration();
    return true;
  };

  const deleteOperation = (id: string) => {
    setOperations((prev) => prev.filter((o) => o.id !== id));
  };

  const addMoveEntry = (entry: Omit<MoveLedgerEntry, "id" | "timestamp">) => {
    const newEntry: MoveLedgerEntry = {
      ...entry,
      id: `move-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setMoveHistory((prev) => [newEntry, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Filtered dataset for KPIs
  const filteredProducts =
    selectedWarehouse === "all"
      ? products
      : products.filter((p) => (p.warehouseStock[selectedWarehouse] || 0) > 0);

  const totalValuation = filteredProducts.reduce(
    (sum, p) => sum + p.totalStock * p.unitPrice,
    0
  );
  const lowStockCount = filteredProducts.filter((p) => p.status === "low_stock").length;
  const outOfStockCount = filteredProducts.filter((p) => p.status === "out_of_stock").length;

  const pendingReceipts = operations.filter(
    (o) => o.type === "receipt" && o.status !== "done" && o.status !== "cancelled"
  ).length;

  const pendingDeliveries = operations.filter(
    (o) => o.type === "delivery" && o.status !== "done" && o.status !== "cancelled"
  ).length;

  const scheduledTransfers = operations.filter(
    (o) => o.type === "transfer" && o.status !== "done" && o.status !== "cancelled"
  ).length;

  const kpiData: KPIData = {
    totalProducts: filteredProducts.length,
    totalValuation,
    lowStockCount,
    outOfStockCount,
    pendingReceipts,
    pendingDeliveries,
    scheduledTransfers,
    stockAccuracyRate: 99.4,
    monthlyTurnoverRate: 4.8,
  };

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        users: mockUsers,
        selectedWarehouse,
        setSelectedWarehouse,
        warehouses,
        addWarehouse,
        updateWarehouse,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        operations,
        addOperation,
        updateOperationStatus,
        validateOperation,
        deleteOperation,
        moveHistory,
        addMoveEntry,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        kpiData,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        activeAccent,
        setActiveAccent,
        triggerCelebration,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
