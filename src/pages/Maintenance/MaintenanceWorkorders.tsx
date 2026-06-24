import React, { useState, useEffect } from "react";
import { useHotel } from "../../context/HotelContext";
import { DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { CheckSquare } from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";

export const MaintenanceWorkorders: React.FC = () => {
  const { workOrders, updateWorkOrderStatus } = useHotel();

  // Simulated Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Confirmation Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetWoId, setTargetWoId] = useState("");
  const [targetRoomNo, setTargetRoomNo] = useState("");

  const triggerResolveConfirmation = (woId: string, roomNo: string) => {
    setTargetWoId(woId);
    setTargetRoomNo(roomNo);
    setIsConfirmOpen(true);
  };

  const handleConfirmResolve = () => {
    if (!targetWoId) return;
    updateWorkOrderStatus(targetWoId, "Completed");
    setTargetWoId("");
    setTargetRoomNo("");
  };

  // Columns layout
  const columns = [
    {
      header: "Order ID",
      accessor: (item: any) => (
        <span className="font-bold text-rose-800 dark:text-rose-400">
          {item.id}
        </span>
      ),
      sortable: true,
      sortKey: "id"
    },
    {
      header: "Room #",
      accessor: "roomNumber",
      sortable: true
    },
    {
      header: "Category",
      accessor: "category",
      sortable: true
    },
    {
      header: "Issue / Description",
      accessor: "description",
      sortable: false
    },
    {
      header: "Priority",
      accessor: (item: any) => <StatusBadge status={item.priority} />,
      sortable: true,
      sortKey: "priority"
    },
    {
      header: "Status",
      accessor: (item: any) => <StatusBadge status={item.status} />,
      sortable: true,
      sortKey: "status"
    },
    {
      header: "Assigned Engineer",
      accessor: "assignedEngineerName",
      sortable: true
    },
    {
      header: "Action",
      accessor: (item: any) => (
        item.status !== "Completed" ? (
          <button
            onClick={() => triggerResolveConfirmation(item.id, item.roomNumber)}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 rounded-lg text-xs transition"
          >
            <CheckSquare className="w-3.5 h-3.5" /> Resolve
          </button>
        ) : (
          <span className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark font-semibold italic">
            Resolved
          </span>
        )
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in font-sans">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Card className="p-5 space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-3 pt-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex justify-between border-b pb-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
          Work Orders Ledger
        </h1>
        <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
          Historical log and search index of all property work orders.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Maintenance Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={workOrders}
            searchPlaceholder="Search by Room # or Engineer..."
            searchKey={(item) => `${item.roomNumber} ${item.assignedEngineerName} ${item.description}`}
            initialRowsPerPage={10}
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialog Gate */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmResolve}
        title="Resolve Maintenance Work Order"
        message={`Are you sure you want to resolve work order ${targetWoId} for Room ${targetRoomNo}?`}
        confirmText="Yes, Resolve"
        cancelText="Cancel"
        type="success"
      />
    </div>
  );
};
