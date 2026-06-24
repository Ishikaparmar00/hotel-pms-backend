import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useHotel } from "../../context/HotelContext";
import { useNotifications } from "../../context/NotificationContext";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  ConciergeBell, 
  AlertOctagon, 
  Search,
  CheckCircle,
  HelpCircle,
  FileCheck,
  CreditCard,
  Bed,
  Sparkles,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Printer
} from "lucide-react";

export const ReservationsDashboard: React.FC = () => {
  const { reservations, checkInReservation } = useHotel();
  const { addToast } = useNotifications();

  // Simulated load state
  const [isLoading, setIsLoading] = useState(true);

  // Selected guest state in verification panel
  const [selectedGuestId, setSelectedGuestId] = useState("RES-5000"); // Elena Vance (linked in mock data)
  const [incidentalAuthorized, setIncidentalAuthorized] = useState(false);
  const [assignedRoom, setAssignedRoom] = useState("Executive Suite - 402 (Ready)");

  // Check-in confirmation state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Mock arrivals list matching first screenshot details exactly
  const [arrivals, setArrivals] = useState([
    { id: "RES-5000", name: "Elena Vance", resNo: "RESERVATION #RT829", roomType: "Executive Suite", time: "14:20", tier: "VIP - DIAMOND", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
    { id: "RES-5001", name: "Marcus Thorne", resNo: "RESERVATION #RT82833", roomType: "Luxury King", time: "15:10", tier: "GOLD ELITE", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { id: "RES-5002", name: "Siobhan Roy", resNo: "RESERVATION #RT82816", roomType: "Presidential P1", time: "16:45", tier: "VIP - VVIP", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siobhan" },
    { id: "RES-5003", name: "David Kessler", resNo: "RESERVATION #RT82984", roomType: "Standard Twin", time: "17:30", tier: "NEW GUEST", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    { id: "RES-5004", name: "Akira Tanaka", resNo: "RESERVATION #RT82314", roomType: "Executive Suite", time: "18:00", tier: "CORPORATE", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akira" }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const selectedGuest = arrivals.find(g => g.id === selectedGuestId) || arrivals[0];

  const handleCompleteCheckin = () => {
    if (!incidentalAuthorized) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmCheckin = () => {
    // Check in the guest in our global context state
    checkInReservation(selectedGuestId);
    addToast(`${selectedGuest.name} checked in successfully to ${assignedRoom}!`, "success");
    
    // Remove checked in guest from arrivals list to demonstrate state change
    setArrivals(prev => prev.filter(g => g.id !== selectedGuestId));
    
    // Select next guest if list not empty
    const remaining = arrivals.filter(g => g.id !== selectedGuestId);
    if (remaining.length > 0) {
      setSelectedGuestId(remaining[0].id);
      setIncidentalAuthorized(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in font-sans">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 w-1/3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Layout Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 space-y-6">
            {/* 4 KPIs grid skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4 space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </Card>
              ))}
            </div>

            {/* Quick links skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>

            {/* Table Card skeleton */}
            <Card className="p-5 space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-64 w-full" />
            </Card>
          </div>

          {/* Sidebar Verification Desk skeleton */}
          <div className="xl:col-span-4 bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-slate-800 rounded-2xl p-5 space-y-5">
            <Skeleton className="h-5 w-1/2" />
            <div className="flex flex-col items-center space-y-3 pt-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
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
            Reservations Control Desk
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            Real-time arrivals roster, guest profile identity check and key card room allocations.
          </p>
        </div>
      </div>

      {/* Main Grid: Arrivals Table & Verification Sidebar Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (8 cols): Arrivals Ledger & Stats */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* KPI Mini Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 shadow-sm border border-customBorder-light">
              <p className="text-[10px] uppercase font-bold text-customText-mutedLight tracking-wider">Total Arrivals</p>
              <div className="flex items-baseline space-x-2 mt-1.5">
                <span className="text-xl font-black text-customText-light dark:text-white">42</span>
                <span className="text-[10px] font-bold text-emerald-600">+12%</span>
              </div>
              <p className="text-[9px] text-customText-mutedLight mt-1">28 checked in so far</p>
            </Card>

            <Card className="p-4 shadow-sm border border-customBorder-light">
              <p className="text-[10px] uppercase font-bold text-customText-mutedLight tracking-wider">Total Departures</p>
              <div className="flex items-baseline space-x-2 mt-1.5">
                <span className="text-xl font-black text-customText-light dark:text-white">38</span>
                <span className="text-[9px] text-customText-mutedLight">Today</span>
              </div>
              <p className="text-[9px] text-emerald-600 font-bold mt-1">✓ 32 Balanced</p>
            </Card>

            <Card className="p-4 shadow-sm border border-customBorder-light">
              <p className="text-[10px] uppercase font-bold text-customText-mutedLight tracking-wider">Occupancy</p>
              <div className="flex items-baseline space-x-2 mt-1.5">
                <span className="text-xl font-black text-customText-light dark:text-white">92.4%</span>
              </div>
              <p className="text-[9px] text-customText-mutedLight mt-1">Near capacity tonight</p>
            </Card>

            <Card className="p-4 shadow-sm border border-customBorder-light">
              <p className="text-[10px] uppercase font-bold text-customText-mutedLight tracking-wider">Rooms OOO</p>
              <div className="flex items-baseline space-x-2 mt-1.5">
                <span className="text-xl font-black text-primary dark:text-rose-400">06</span>
                <span className="text-[9px] text-rose-500 font-bold">Alert</span>
              </div>
              <p className="text-[9px] text-customText-mutedLight mt-1">4 Maint, 2 VIP Prep</p>
            </Card>
          </div>

          {/* Quick links to actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button 
              onClick={() => alert("Walk-in registration initiated.")}
              className="p-3 bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl flex items-center justify-between text-xs font-bold text-customText-light dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary/5 text-primary rounded-lg">👤</span>
                <span>Walk-in Guest Registration</span>
              </div>
              <ChevronRight className="w-4 h-4 text-customText-mutedLight" />
            </button>

            <button 
              onClick={() => alert("Search guest records.")}
              className="p-3 bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl flex items-center justify-between text-xs font-bold text-customText-light dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary/5 text-primary rounded-lg">🔍</span>
                <span>Search Reservation Records</span>
              </div>
              <ChevronRight className="w-4 h-4 text-customText-mutedLight" />
            </button>

            <button 
              onClick={() => alert("Bulk check-in sheet.")}
              className="p-3 bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl flex items-center justify-between text-xs font-bold text-customText-light dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary/5 text-primary rounded-lg">👥</span>
                <span>Group Block Check-in</span>
              </div>
              <ChevronRight className="w-4 h-4 text-customText-mutedLight" />
            </button>
          </div>

          {/* Arrivals ledger */}
          <Card>
            <CardHeader className="flex justify-between items-center border-b-0 pb-1">
              <div className="flex space-x-6 text-xs font-bold text-customText-mutedLight uppercase">
                <span className="text-primary border-b-2 border-primary pb-3 cursor-pointer">Today's Arrivals</span>
                <span className="hover:text-customText-light cursor-pointer">Today's Departures</span>
                <span className="hover:text-customText-light cursor-pointer">Stay-overs</span>
              </div>
              <button className="px-3 py-1.5 border border-customBorder-light dark:border-[#334155] rounded-xl text-[10px] font-bold text-customText-light dark:text-white flex items-center gap-1">
                Sort by Time
              </button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-customBorder-light dark:border-[#334155] text-customText-mutedLight dark:text-customText-mutedDark uppercase font-bold tracking-wider py-3">
                      <th className="px-4 py-2.5">Guest Details</th>
                      <th className="px-4 py-2.5">Room Type</th>
                      <th className="px-4 py-2.5">Arrival/Room</th>
                      <th className="px-4 py-2.5">Status/Balance</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-customBorder-light/50 dark:divide-[#334155]/50 font-semibold">
                    {arrivals.length > 0 ? (
                      arrivals.map((g) => (
                        <tr 
                          key={g.id} 
                          onClick={() => setSelectedGuestId(g.id)}
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition cursor-pointer ${
                            selectedGuestId === g.id ? "bg-primary/5 dark:bg-primary/15 border-l-4 border-primary pl-2.5" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5 flex items-center space-x-3">
                            <img src={g.avatar} className="w-8 h-8 rounded-full bg-slate-100 object-cover" alt="" />
                            <div>
                              <p className="font-extrabold text-xs text-customText-light dark:text-white leading-tight">{g.name}</p>
                              <p className="text-[10px] text-customText-mutedLight mt-0.5">{g.resNo}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-customText-light dark:text-white">{g.roomType}</td>
                          <td className="px-4 py-3.5 text-customText-light dark:text-white">{g.time}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold ${
                              g.tier.includes("VIP") ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" :
                              g.tier.includes("GOLD") ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                            }`}>
                              {g.tier}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right text-customText-mutedLight">
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-customText-mutedLight">
                          All today's guest arrivals have been successfully checked in.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Side (4 cols): Guest Verification sidebar */}
        <div className="xl:col-span-4 bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-2xl p-5 shadow-premium space-y-6">
          <div className="flex items-center justify-between border-b border-customBorder-light dark:border-[#334155] pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-customText-light dark:text-white">
              Verification Desk
            </h3>
            <StatusBadge status="Manual Audit" />
          </div>

          {selectedGuest ? (
            <div className="space-y-6">
              {/* Profile Card details */}
              <div className="flex flex-col items-center text-center space-y-2">
                <img 
                  src={selectedGuest.avatar} 
                  className="w-16 h-16 rounded-full border border-customBorder-light shadow-md"
                  alt="" 
                />
                <div>
                  <h4 className="font-extrabold text-base text-customText-light dark:text-white">
                    {selectedGuest.name}
                  </h4>
                  <p className="text-xs text-primary dark:text-[#FB923C] font-semibold flex items-center justify-center gap-1 mt-0.5">
                    ★ Diamond Elite Member
                  </p>
                </div>
              </div>

              {/* Steps check */}
              <div className="space-y-4 text-xs font-semibold">
                {/* ID verified check */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">ID Verified (Passport)</span>
                    <span className="text-[10px] text-customText-mutedLight">Scanned & checked on file</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>

                {/* Incidental deposit */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-customBorder-light dark:border-[#334155] rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-customText-light dark:text-white">Incidental Deposit</span>
                    <span className="text-[10px] text-customText-mutedLight">Hold authorization required</span>
                  </div>
                  <button
                    onClick={() => {
                      setIncidentalAuthorized(true);
                      addToast("Credit card pre-authorization for $150.00 success.", "success");
                    }}
                    disabled={incidentalAuthorized}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      incidentalAuthorized 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                        : "bg-primary text-white hover:bg-primary-hover shadow-sm active:scale-95"
                    }`}
                  >
                    {incidentalAuthorized ? "Authorized" : "Authorize"}
                  </button>
                </div>

                {/* Room assignment selection */}
                <div className="space-y-1.5">
                  <label className="block text-customText-light dark:text-white">Room Assignment</label>
                  <select
                    value={assignedRoom}
                    onChange={(e) => setAssignedRoom(e.target.value)}
                    className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
                  >
                    <option value="Executive Suite - 402 (Ready)">Executive Suite - 402 (Ready)</option>
                    <option value="Executive Suite - 501 (Ready)">Executive Suite - 501 (Ready)</option>
                    <option value="Luxury King - 302 (Ready)">Luxury King - 302 (Ready)</option>
                    <option value="Standard Twin - 102 (Ready)">Standard Twin - 102 (Ready)</option>
                  </select>
                </div>

                {/* Stay preferences tags */}
                <div className="space-y-1.5">
                  <label className="block text-customText-light dark:text-white">Stay Preferences</label>
                  <div className="flex flex-wrap gap-2 pt-1 text-[9px] uppercase tracking-wider text-customText-mutedLight font-bold">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded">Quiet Room</span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded">Extra Pillows</span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded">Allergy Free</span>
                  </div>
                </div>
              </div>

              {/* Complete button */}
              <button
                onClick={handleCompleteCheckin}
                disabled={!incidentalAuthorized}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-dark text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
              >
                Complete Check-in
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-customText-mutedLight">
              Select an arrival row from the table to complete check-in verification.
            </div>
          )}
        </div>

      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCheckin}
        title="Confirm Guest Registration Check-in"
        message={`Are you sure you want to register ${selectedGuest?.name} as In-House and authorize the check-in card lock release for ${assignedRoom}?`}
        confirmText="Complete Check-in"
        cancelText="Cancel"
        type="success"
      />

    </div>
  );
};
