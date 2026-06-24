import React from "react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const normalized = status.trim().toLowerCase();

  let styles = "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200 border-gray-200 dark:border-slate-700";

  // Front Desk / Reservation status styles
  if (normalized === "checked in") {
    styles = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20";
  } else if (normalized === "checked out") {
    styles = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  } else if (normalized === "confirmed" || normalized === "reserved") {
    styles = "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20";
  } else if (normalized === "cancelled") {
    styles = "bg-rose-50 text-rose-600 line-through dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20";
  }
  
  // Housekeeping / Maintenance priority / status styles
  else if (normalized === "urgent" || normalized === "emergency" || normalized === "critical") {
    styles = "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 animate-pulse-soft font-bold";
  } else if (normalized === "high") {
    styles = "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";
  } else if (normalized === "medium") {
    styles = "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
  } else if (normalized === "low") {
    styles = "bg-blue-50/50 text-blue-600 dark:bg-blue-500/5 dark:text-blue-400 border-blue-100 dark:border-blue-500/10";
  }
  
  // Work Order / Housekeeping statuses
  else if (normalized === "pending" || normalized === "to do") {
    styles = "bg-yellow-50 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/25";
  } else if (normalized === "in progress" || normalized === "in repairs") {
    styles = "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20";
  } else if (normalized === "completed") {
    styles = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
  }
  
  // Inventory status styles
  else if (normalized === "low stock") {
    styles = "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20 font-medium";
  } else if (normalized === "out of stock" || normalized === "ooo") {
    styles = "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 font-semibold";
  } else if (normalized === "in stock" || normalized === "clean" || normalized === "vacant" || normalized === "active") {
    styles = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
  } else if (normalized === "break" || normalized === "awaiting approval") {
    styles = "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20";
  } else if (normalized === "off-duty" || normalized === "dirty") {
    styles = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      {status}
    </span>
  );
};
