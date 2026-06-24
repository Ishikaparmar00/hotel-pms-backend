import React from "react";
import { StatusBadge } from "./StatusBadge";
import { Calendar, User, Clock } from "lucide-react";

interface TimelineItem {
  id: string;
  roomNumber: string;
  category: string;
  reason: string;
  startDate: string;
  endDate: string;
  progress: number;
  estDays: number;
  status: "Awaiting Approval" | "In Repairs" | "Ready for Reinstated";
  engineerName?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  // Format simple date representation
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="overflow-x-auto border border-customBorder-light dark:border-customBorder-dark rounded-xl bg-white dark:bg-customCard-dark shadow-sm">
      <div className="min-w-[700px] divide-y divide-customBorder-light dark:divide-customBorder-dark">
        {/* Table header */}
        <div className="grid grid-cols-12 bg-[#F8F9FB] dark:bg-slate-800 text-xs font-semibold uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark py-3 px-6">
          <div className="col-span-2">Room / Area</div>
          <div className="col-span-4">Repair Issue & Reason</div>
          <div className="col-span-3">Schedule Timeline</div>
          <div className="col-span-2">Progress status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Rows */}
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 py-4 px-6 items-center hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Room details */}
              <div className="col-span-2">
                <span className="font-bold text-sm text-customText-light dark:text-customText-dark bg-gray-100 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-customBorder-light dark:border-customBorder-dark">
                  Room {item.roomNumber}
                </span>
                <div className="text-xs text-customText-mutedLight dark:text-customText-mutedDark mt-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1"></span>
                  {item.category}
                </div>
              </div>

              {/* Repair Reason */}
              <div className="col-span-4 pr-4">
                <p className="text-sm font-semibold text-customText-light dark:text-customText-dark line-clamp-1">
                  {item.reason}
                </p>
                <div className="text-xs text-customText-mutedLight dark:text-customText-mutedDark mt-1 flex items-center gap-3">
                  {item.engineerName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-primary" />
                      {item.engineerName}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.estDays} days est
                  </span>
                </div>
              </div>

              {/* Timeline duration */}
              <div className="col-span-3">
                <div className="flex items-center text-xs text-customText-light dark:text-customText-dark gap-2">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  <span>{formatDate(item.startDate)}</span>
                  <span className="text-gray-400">→</span>
                  <span>{formatDate(item.endDate)}</span>
                </div>
                {/* Visual duration bar */}
                <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2 relative">
                  <div
                    className="absolute bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Progress & Badge */}
              <div className="col-span-2">
                <StatusBadge status={item.status} />
                <span className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark ml-2">
                  {item.progress}%
                </span>
              </div>

              {/* Re-activation Approval trigger */}
              <div className="col-span-1 text-right">
                <span className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark">
                  ID: {item.id}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-customText-mutedLight dark:text-customText-mutedDark text-sm">
            No Out of Order rooms in maintenance queue.
          </div>
        )}
      </div>
    </div>
  );
};
