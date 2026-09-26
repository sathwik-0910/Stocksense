export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  totalStock: number;
  minStock: number;
  maxStock: number;
  barcode: string;
  status: StockStatus;
  warehouseStock: {
    [warehouseId: string]: number;
  };
  locationCode: string;
  tags: string[];
  unit: string;
  weightKg?: number;
  supplier?: string;
  updatedAt: string;
  description?: string;
}

export type OperationType = "receipt" | "delivery" | "transfer" | "adjustment";
export type OperationStatus = "draft" | "waiting" | "ready" | "done" | "cancelled";

export interface OperationLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  demandQty: number;
  doneQty: number;
  unit: string;
  price?: number;
}

export interface Operation {
  id: string;
  ref: string; // e.g., WH/IN/00142 or WH/OUT/00098
  type: OperationType;
  status: OperationStatus;
  partner: string; // Vendor name for receipt, Customer for delivery
  sourceLocation: string;
  destinationLocation: string;
  scheduledDate: string;
  lines: OperationLine[];
  notes?: string;
  validatedAt?: string;
  validatedBy?: string;
  trackingNumber?: string;
  priority?: "normal" | "urgent" | "critical";
}

export interface MoveLedgerEntry {
  id: string;
  timestamp: string;
  reference: string;
  operationType: OperationType;
  productName: string;
  sku: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  unit: string;
  user: string;
  status: "done" | "pending" | "reverted";
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  address: string;
  totalCapacityUnits: number;
  usedCapacityUnits: number;
  sqFt: number;
  zonesCount: number;
  activeStaff: number;
  status: "active" | "maintenance" | "full";
  manager: string;
  managerEmail: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Inventory Manager" | "Logistics Lead" | "Auditor";
  avatar: string;
  warehouseAccess: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success" | "urgent";
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface KPIData {
  totalProducts: number;
  totalValuation: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  scheduledTransfers: number;
  stockAccuracyRate: number;
  monthlyTurnoverRate: number;
}
