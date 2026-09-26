import React from "react";
import { cn } from "../../lib/utils";
import { StockStatus, OperationStatus, OperationType } from "../../types";

interface BadgeProps {
  children?: React.ReactNode;
  variant?:
    | "default"
    | "draft"
    | "waiting"
    | "ready"
    | "done"
    | "cancelled"
    | "lowstock"
    | "outofstock"
    | "instock"
    | "receipt"
    | "delivery"
    | "transfer"
    | "adjustment"
    | "blue"
    | "emerald"
    | "purple"
    | "orange";
  status?: StockStatus | OperationStatus | OperationType;
  className?: string;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  className,
  size = "md",
  dot = true,
}) => {
  // Determine variant from status if provided
  let determinedVariant = variant || "default";
  let label = children;

  if (status) {
    switch (status) {
      case "in_stock":
        determinedVariant = "instock";
        label = label || "In Stock";
        break;
      case "low_stock":
        determinedVariant = "lowstock";
        label = label || "Low Stock";
        break;
      case "out_of_stock":
        determinedVariant = "outofstock";
        label = label || "Out of Stock";
        break;
      case "draft":
        determinedVariant = "draft";
        label = label || "Draft";
        break;
      case "waiting":
        determinedVariant = "waiting";
        label = label || "Waiting";
        break;
      case "ready":
        determinedVariant = "ready";
        label = label || "Ready";
        break;
      case "done":
        determinedVariant = "done";
        label = label || "Done";
        break;
      case "cancelled":
        determinedVariant = "cancelled";
        label = label || "Cancelled";
        break;
      case "receipt":
        determinedVariant = "emerald";
        label = label || "Receipt";
        break;
      case "delivery":
        determinedVariant = "blue";
        label = label || "Delivery";
        break;
      case "transfer":
        determinedVariant = "purple";
        label = label || "Transfer";
        break;
      case "adjustment":
        determinedVariant = "orange";
        label = label || "Adjustment";
        break;
    }
  }

  const variantStyles: Record<string, { bg: string; text: string; border: string; dotColor: string }> = {
    default: {
      bg: "bg-gray-800/60",
      text: "text-gray-300",
      border: "border-gray-700/50",
      dotColor: "bg-gray-400",
    },
    draft: {
      bg: "bg-zinc-800/70",
      text: "text-zinc-300",
      border: "border-zinc-700/60",
      dotColor: "bg-zinc-400",
    },
    waiting: {
      bg: "bg-amber-950/40",
      text: "text-amber-300",
      border: "border-amber-500/30",
      dotColor: "bg-amber-400 animate-pulse",
    },
    ready: {
      bg: "bg-blue-950/40",
      text: "text-blue-300",
      border: "border-blue-500/30",
      dotColor: "bg-blue-400",
    },
    done: {
      bg: "bg-emerald-950/40",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      dotColor: "bg-emerald-400",
    },
    cancelled: {
      bg: "bg-rose-950/40",
      text: "text-rose-300",
      border: "border-rose-500/30",
      dotColor: "bg-rose-400",
    },
    lowstock: {
      bg: "bg-orange-950/40",
      text: "text-orange-300",
      border: "border-orange-500/30",
      dotColor: "bg-orange-400 animate-pulse",
    },
    outofstock: {
      bg: "bg-red-950/40",
      text: "text-red-300",
      border: "border-red-500/30",
      dotColor: "bg-red-500",
    },
    instock: {
      bg: "bg-emerald-950/40",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      dotColor: "bg-emerald-400",
    },
    blue: {
      bg: "bg-blue-950/40",
      text: "text-blue-300",
      border: "border-blue-500/30",
      dotColor: "bg-blue-400",
    },
    emerald: {
      bg: "bg-emerald-950/40",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      dotColor: "bg-emerald-400",
    },
    purple: {
      bg: "bg-purple-950/40",
      text: "text-purple-300",
      border: "border-purple-500/30",
      dotColor: "bg-purple-400",
    },
    orange: {
      bg: "bg-orange-950/40",
      text: "text-orange-300",
      border: "border-orange-500/30",
      dotColor: "bg-orange-400",
    },
  };

  const style = variantStyles[determinedVariant] || variantStyles.default;

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium tracking-wide",
    md: "text-xs px-2.5 py-1 font-medium",
    lg: "text-sm px-3 py-1.5 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm transition-colors",
        style.bg,
        style.text,
        style.border,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-white/10", style.dotColor)}
        />
      )}
      <span>{label}</span>
    </span>
  );
};
