import React from "react";
import { PackageOpen, LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-white/5 bg-bg-surface/50 backdrop-blur-sm relative overflow-hidden",
        className
      )}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Decorative ambient ring */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-inner">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />
        <Icon className="h-10 w-10 text-blue-400 relative z-10" />
      </div>

      <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-400 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent-blue px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
