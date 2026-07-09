import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { AvatarGroup } from "../../components/ui/AvatarGroup";
import { useHotel } from "../../context/HotelContext";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { 
  AlertTriangle, 
  Calendar, 
  UserCheck, 
  ArrowRight,
  TrendingDown, 
  Flag,
  FileCheck,
  Plus
} from "lucide-react";

export const MaintenanceInventory: React.FC = () => {
  const { roomDowntimes, reinstateRoom, approveDowntime, engineers } = useHotel();
  const [isLoading, setIsLoading] = useState(true);

  // Reinstatement confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetDowntimeId, setTargetDowntimeId] = useState("");
  const [targetRoomNo, setTargetRoomNo] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Active Engineer list with current ETA to match screenshot exactly
  const mockEngineers = [
    { name: "John Doe", eta: "4h", task: "Suite 402 - Renovation", status: "In Progress" },
    { name: "Sara Jenkins", eta: "2h", task: "Room 215 - Plumbing", status: "On Route" },
    { name: "Michael Chang", eta: "Tomorrow", task: "Floor 3 - Deep Cleaning", status: "Scheduled" }
  ];

  const triggerReinstateConfirmation = (id: string, roomNo: string) => {
    setTargetDowntimeId(id);
    setTargetRoomNo(roomNo);
    setIsConfirmOpen(true);
  };

  const handleConfirmReinstate = () => {
    if (!targetDowntimeId) return;
    reinstateRoom(targetDowntimeId);
    setTargetDowntimeId("");
    setTargetRoomNo("");
  };

  // Re-Inspect action trigger
  const handleReInspect = (id: string) => {
    alert(`Re-Inspection request issued for Room ${id}. Assigned supervisor notified.`);
  };

  // Stacked active engineers avatars list
  const activeEngAvatars = engineers
    .filter(e => e.status === "Active")
    .map(e => ({ name: e.name, avatarUrl: e.avatarUrl }));

  // Date list for the Gantt Chart Header (Oct 12 to 24)
  const timelineDates = ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in font-sans">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 w-1/3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-3 w-5/6" />
          </Card>
          <Card className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </Card>
          <Card className="flex items-center justify-between">
            <div className="space-y-3 w-2/3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="w-16 h-10 rounded-xl" />
          </Card>
        </div>

        {/* Gantt Chart Skeleton */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </Card>

        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-3">
              <div className="p-4 border border-customBorder-light dark:border-slate-800 rounded-2xl space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
              <div className="p-4 border border-customBorder-light dark:border-slate-800 rounded-2xl flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </Card>
          <Card className="p-5 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-customBorder-light dark:border-slate-800 rounded-xl">
                  <div className="flex items-center space-x-3 w-1/2">
                    <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                    <div className="space-y-1.5 w-full">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
            Room Inventory Tracker
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            Monitoring Out-of-Order (OOO) and Out-of-Service (OOS) statuses.
          </p>
        </div>
        <button
          onClick={() => alert("Room flagged for inspection.")}
          className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
        >
          <Flag className="w-4 h-4" /> Flag Room
        </button>
      </div>

      {/* Top Section Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Revenue Loss Estimator */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-3.5 bottom-3 text-slate-100 dark:text-slate-800/40 pointer-events-none">
            📈
          </div>
          <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">
            Revenue Loss Estimator (Daily)
          </p>
          <div className="flex items-baseline justify-between mt-2.5">
            <p className="text-3xl font-extrabold text-primary dark:text-rose-400">
              -₹4,280.00
            </p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
              +1.2% RevPAR Impact vs. Last Week
            </span>
          </div>
          <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-2">
            12 rooms currently OOO/OOS (8.5% of total inventory)
          </p>
        </Card>

        {/* Reason Breakdown */}
        <Card>
          <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">
            Reason Breakdown
          </p>
          <div className="grid grid-cols-2 gap-2.5 mt-2.5 text-xs font-semibold text-customText-light dark:text-white">
            <div className="flex justify-between border-b border-customBorder-light dark:border-[#334155] pb-1">
              <span className="text-customText-mutedLight">• Painting</span>
              <span>4 Rooms</span>
            </div>
            <div className="flex justify-between border-b border-customBorder-light dark:border-[#334155] pb-1">
              <span className="text-customText-mutedLight">• Leakage</span>
              <span>3 Rooms</span>
            </div>
            <div className="flex justify-between border-b border-customBorder-light dark:border-[#334155] pb-1">
              <span className="text-customText-mutedLight">• Deep Clean</span>
              <span>3 Rooms</span>
            </div>
            <div className="flex justify-between border-b border-customBorder-light dark:border-[#334155] pb-1">
              <span className="text-customText-mutedLight">• Broken Furn.</span>
              <span>2 Rooms</span>
            </div>
          </div>
        </Card>

        {/* Engineers Active */}
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">
              Engineers Active
            </p>
            <p className="text-3xl font-extrabold text-customText-light dark:text-white mt-1">
              {activeEngAvatars.length}
            </p>
            <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-1.5">
              5 Team members assigned to 8 active projects
            </p>
          </div>
          <AvatarGroup items={activeEngAvatars} max={3} />
        </Card>
      </div>

      {/* Timeline Gantt Chart Grid */}
      <Card>
        <CardHeader className="flex justify-between items-center pb-2 border-b-0">
          <CardTitle>Inventory Downtime Timeline</CardTitle>
          <div className="flex items-center gap-3.5 text-xs">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-customText-mutedLight font-semibold">OOO (Major)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-customText-mutedLight font-semibold">OOS (Minor)</span>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-customBorder-light dark:border-[#334155] font-bold">
              <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-customText-light dark:text-white shadow-sm cursor-pointer">14 Days</span>
              <span className="px-2 py-1 text-customText-mutedLight cursor-pointer">Month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Gantt Timeline */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-customBorder-light dark:border-[#334155] text-[10px] font-bold text-customText-mutedLight uppercase bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-3 py-2 text-left w-24">Room #</th>
                  {timelineDates.map(d => (
                    <th key={d} className={`px-2.5 py-2 min-w-[32px] ${d === "15" ? "bg-primary/5 text-primary border-x border-primary/20" : ""}`}>
                      Oct {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-customBorder-light/50 dark:divide-[#334155]/50 text-xs">
                {/* Suite 402 row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="px-3 py-4 text-left font-bold text-customText-light dark:text-white">Suite 402</td>
                  {timelineDates.map(d => (
                    <td key={d} className={`px-1 py-3 relative ${d === "15" ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      {d === "12" && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[120px] h-6 bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center rounded-lg shadow-sm z-10 leading-none">
                          🚨 Renov
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Room 215 row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="px-3 py-4 text-left font-bold text-customText-light dark:text-white">Room 215</td>
                  {timelineDates.map(d => (
                    <td key={d} className={`px-1 py-3 relative ${d === "15" ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      {d === "13" && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[90px] h-6 bg-amber-400 text-slate-900 font-bold text-[9px] flex items-center justify-center rounded-lg shadow-sm z-10 leading-none">
                          ⚡ AC Leak
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Room 108 row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="px-3 py-4 text-left font-bold text-customText-light dark:text-white">Room 108</td>
                  {timelineDates.map(d => (
                    <td key={d} className={`px-1 py-3 relative ${d === "15" ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      {d === "12" && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[70px] h-6 bg-purple-500 text-white font-bold text-[9px] flex items-center justify-center rounded-lg shadow-sm z-10 leading-none">
                          🧼 Deep Cln
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Room 501 row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="px-3 py-4 text-left font-bold text-customText-light dark:text-white">Room 501</td>
                  {timelineDates.map(d => (
                    <td key={d} className={`px-1 py-3 relative ${d === "15" ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      {d === "14" && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[140px] h-6 bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center rounded-lg shadow-sm z-10 leading-none">
                          🪑 Furniture Replace
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reinstatement Approvals Queue & Engineer Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Reinstatement Approvals */}
        <Card>
          <CardHeader className="flex justify-between items-center border-b-0 pb-1">
            <CardTitle>Inventory Reinstatement</CardTitle>
            <StatusBadge status="3 Pending Approval" />
          </CardHeader>
          <CardContent className="space-y-4">
            {roomDowntimes
              .filter(dt => dt.status === "Ready for Reinstated")
              .map(dt => (
                <div 
                  key={dt.id} 
                  className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-customBorder-light dark:border-[#334155] space-y-4 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-customText-light dark:text-white">{dt.roomNumber === "105" ? "Deluxe Room 305" : `Room ${dt.roomNumber}`}</p>
                      <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-0.5">Maintenance Complete by Mike R.</p>
                    </div>
                    <button 
                      onClick={() => alert("Checklist opened.")}
                      className="text-primary text-[10px] font-bold hover:underline"
                    >
                      View Checklist
                    </button>
                  </div>

                  <div className="flex gap-4 text-[10px] font-semibold text-emerald-600">
                    <span className="flex items-center gap-1">✓ Painting Inspection Pass</span>
                    <span className="flex items-center gap-1">✓ Odor Neutralization Pass</span>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => triggerReinstateConfirmation(dt.id, dt.roomNumber)}
                      className="flex-1 bg-[#A21C1C] hover:bg-[#821414] text-white py-2 rounded-xl font-bold transition shadow-sm"
                    >
                      Approve & Release
                    </button>
                    <button
                      onClick={() => handleReInspect(dt.roomNumber)}
                      className="px-4 border border-customBorder-light dark:border-[#334155] text-customText-light dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 py-2 rounded-xl font-bold transition"
                    >
                      Re-Inspect
                    </button>
                  </div>
                </div>
              ))}

            {/* Standard 112 progress bar item */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-customBorder-light/50 dark:border-[#334155]/50 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-customText-light dark:text-white">Standard 112</p>
                <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-0.5">Awaiting Final Walkthrough</p>
              </div>
              <div className="w-1/3 bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-2/3 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Engineer Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Engineer Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {mockEngineers.map((eng, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-xl border border-customBorder-light dark:border-[#334155] hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-customText-light uppercase shrink-0">
                      {eng.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-customText-light dark:text-[#F8FAFC]">
                        {eng.name}
                      </p>
                      <p className="text-[10px] text-primary dark:text-[#FB923C] font-semibold mt-0.5">
                        {eng.task}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-customText-light dark:text-white">
                      ETA: {eng.eta}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1 ${
                      eng.status === "In Progress" ? "bg-rose-500/10 text-rose-500" : 
                      eng.status === "On Route" ? "bg-amber-500/10 text-amber-600" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}>
                      {eng.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Assigning project.")}
              className="w-full border border-dashed border-customBorder-light dark:border-[#334155] text-customText-mutedLight dark:text-customText-mutedDark py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              <Plus className="w-4 h-4" /> Assign New Project
            </button>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmReinstate}
        title="Confirm Room Reinstatement"
        message={`Are you sure you want to approve the reinstatement of Room ${targetRoomNo === "105" ? "305" : targetRoomNo} and release it back to the available room inventory?`}
        confirmText="Approve & Release"
        cancelText="Cancel"
        type="success"
      />

    </div>
  );
};
