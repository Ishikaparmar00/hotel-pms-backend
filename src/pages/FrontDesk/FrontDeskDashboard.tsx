import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useHotel } from "../../context/HotelContext";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { 
  Building2, 
  Calendar, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Check, 
  Percent, 
  Plus,
  Key,
  FolderDown,
  Info,
  ChevronDown
} from "lucide-react";

export const FrontDeskDashboard: React.FC = () => {
  const { guests, reservations, importCSVGuests, groupBlocks } = useHotel();
  
  // Simulated loading state
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"All Guests" | "Not Checked In" | "In-House">("All Guests");
  const [csvRawText, setCsvRawText] = useState("");
  const [importSummary, setImportSummary] = useState<{ successCount: number; errors: string[] } | null>(null);

  // CSV commit confirmation state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Group reservation blocks stats matching screenshot GTS-2024-001 style
  const mockBlock = {
    groupName: "Global Tech Summit 2024",
    location: "Main Ballroom & North Wing Conference Center",
    dates: "Oct 12 — Oct 18, 2024",
    cutoff: "Sept 28, 2024",
    groupId: "#GTS-2024-001",
    blocked: 450,
    pickupRate: 78.4,
    pickedUp: 353,
    remaining: 97
  };

  // Mock table rows to match layout and guest listings exactly
  const mockRoomingList = [
    { name: "Sarah Anders", conf: "Conf: #928374", roomType: "King Executive", dates: "Oct 12 — Oct 15", nights: "3 Nights", status: "Confirmed", billing: "MST" },
    { name: "James Miller", conf: "Conf: #928375", roomType: "Double Queen", dates: "Oct 12 — Oct 18", nights: "6 Nights", status: "Pending", billing: "IND" },
    { name: "Elena Lopez", conf: "Missing Arrival Time", roomType: "King Executive", dates: "Oct 13 — Oct 16", nights: "3 Nights", status: "Warning", billing: "IND" }
  ];

  // Handle local CSV parser submit
  const handleCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvRawText.trim()) return;

    // Simple parser: lines separated by newline, fields by comma
    // Expected format: Name, RoomNumber, Status, SuiteName
    const lines = csvRawText.trim().split("\n");
    const parsedList: any[] = [];
    
    lines.forEach((line) => {
      const parts = line.split(",");
      if (parts.length >= 2) {
        parsedList.push({
          name: parts[0].trim(),
          roomNumber: parts[1].trim(),
          vipStatus: parts[2]?.trim().toLowerCase() === "vip",
          loyaltyTier: (parts[3]?.trim() as any) || "Standard",
          suiteName: parts[4]?.trim() || "Standard Room",
          status: (parts[5]?.trim() as any) || "Reserved",
          email: `${parts[0].trim().toLowerCase().replace(" ", ".")}@example.com`,
          phone: "+1 (555) 123-4567"
        });
      }
    });

    if (parsedList.length > 0) {
      const result = importCSVGuests(parsedList);
      setImportSummary(result);
      setCsvRawText("");
    }
  };

  const handleCommitImport = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmCommit = () => {
    alert("Import committed successfully!");
    setImportSummary(null);
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

        {/* Large Block Skeleton */}
        <Card className="p-5 space-y-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>

        {/* 4 KPIs grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-7 w-1/2" />
            </Card>
          ))}
        </div>

        {/* Two-column layout skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
          </Card>
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </Card>
            <Card className="p-4 flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
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
            Front Desk Desk
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            Group check-in blocks, CSV guest lists validation, and individual registrations.
          </p>
        </div>
      </div>

      {/* Active Block Group Reservation info matching screenshot */}
      <Card className="relative overflow-hidden bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
        <CardHeader className="flex justify-between items-start border-b-0 pb-1">
          <div>
            <span className="bg-rose-500/10 text-primary dark:text-[#FB923C] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Active Block
            </span>
            <CardTitle className="mt-2 text-base font-bold text-customText-light dark:text-white">
              {mockBlock.groupName}
            </CardTitle>
            <p className="text-xs text-customText-mutedLight dark:text-customText-mutedDark mt-0.5">
              📍 {mockBlock.location}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button className="px-4 py-2 border border-customBorder-light dark:border-[#334155] rounded-xl text-xs font-bold text-customText-light dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Edit Block
            </button>
            <button className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition hover:from-primary-hover hover:to-secondary-dark flex items-center gap-1.5 active:scale-95">
              <UploadCloud className="w-4 h-4" /> Import Rooming List
            </button>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <p className="text-customText-mutedLight">Block Dates</p>
              <p className="text-customText-light dark:text-white font-bold mt-1">{mockBlock.dates}</p>
            </div>
            <div>
              <p className="text-customText-mutedLight">Cut-off Date</p>
              <p className="text-primary dark:text-[#FB923C] font-bold mt-1">{mockBlock.cutoff}</p>
            </div>
            <div>
              <p className="text-customText-mutedLight">Group ID</p>
              <p className="text-customText-light dark:text-white font-bold mt-1">{mockBlock.groupId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-customText-mutedLight uppercase tracking-wider">Total Rooms Blocked</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">{mockBlock.blocked}</p>
            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-500 mt-1">
              ↗ 12% vs last week
            </span>
          </div>
        </Card>

        <Card className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-customText-mutedLight uppercase tracking-wider">Pickup Rate</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">{mockBlock.pickupRate}%</p>
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-primary h-full rounded-full" style={{ width: `${mockBlock.pickupRate}%` }}></div>
            </div>
          </div>
        </Card>

        <Card className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-customText-mutedLight uppercase tracking-wider">Rooms Picked Up</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">{mockBlock.pickedUp}</p>
          </div>
        </Card>

        <Card className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-customText-mutedLight uppercase tracking-wider">Inventory Remaining</p>
            <p className="text-2xl font-bold text-primary dark:text-[#FB923C] mt-1">{mockBlock.remaining}</p>
          </div>
        </Card>
      </div>

      {/* Main Grid: Guest List & Importer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3): Guest List table */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-0 pb-1 gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-customBorder-light dark:border-[#334155] text-xs font-semibold">
                {(["All Guests", "Not Checked In", "In-House"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === tab 
                        ? "bg-primary text-white font-bold" 
                        : "text-customText-mutedLight hover:text-customText-light"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="p-2 border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                  <Key className="w-4 h-4 text-customText-mutedLight" />
                </button>
                <button className="p-2 border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                  <Check className="w-4 h-4 text-customText-mutedLight" />
                </button>
                <button className="px-3.5 py-1.5 border border-customBorder-light dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-customText-light dark:text-white flex items-center gap-1 transition">
                  Bulk Actions <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F8F9FB] dark:bg-slate-800/80 border-b border-customBorder-light dark:border-[#334155] text-customText-mutedLight dark:text-customText-mutedDark uppercase font-bold tracking-wider py-3.5">
                      <th className="px-4 py-3"><input type="checkbox" /></th>
                      <th className="px-4 py-3">Guest Name</th>
                      <th className="px-4 py-3">Room Type</th>
                      <th className="px-4 py-3">Arrival / Departure</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Billing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-customBorder-light/50 dark:divide-[#334155]/50 font-semibold">
                    {mockRoomingList.map((item, idx) => (
                      <tr 
                        key={idx} 
                        className={`hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition ${
                          item.status === "Warning" ? "bg-rose-500/5 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" : ""
                        }`}
                      >
                        <td className="px-4 py-4"><input type="checkbox" /></td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-xs text-customText-light dark:text-white">{item.name}</p>
                          <p className={`text-[10px] ${item.status === "Warning" ? "text-rose-500 font-bold" : "text-customText-mutedLight"}`}>{item.conf}</p>
                        </td>
                        <td className="px-4 py-4 text-customText-light dark:text-white">{item.roomType}</td>
                        <td className="px-4 py-4">
                          <p className="text-customText-light dark:text-white">{item.dates}</p>
                          <p className="text-[10px] text-customText-mutedLight">{item.nights}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            item.status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            item.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse-soft"
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 flex items-center gap-1.5">
                          <span className="text-[9px] text-customText-mutedLight">IND</span>
                          {/* Toggle switch mock */}
                          <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer ${item.billing === "MST" ? "bg-primary" : "bg-gray-200 dark:bg-slate-700"}`}>
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${item.billing === "MST" ? "translate-x-4" : ""}`}></div>
                          </div>
                          <span className="text-[9px] font-bold text-customText-light dark:text-white">MST</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): CSV Importer form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">CSV Rooming List Importer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCSVSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-customText-light dark:text-white">Paste CSV Data</label>
                  <p className="text-[9px] text-customText-mutedLight leading-none">Format: Name, RoomNumber, VIP (optional), Loyalty, RoomType, Status</p>
                  <textarea
                    rows={6}
                    value={csvRawText}
                    onChange={(e) => setCsvRawText(e.target.value)}
                    placeholder="e.g. Elena Lopez, 104, VIP, Gold, Deluxe Room, Checked In"
                    className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white font-mono text-[10px] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1E293B] hover:bg-slate-900 text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  Validate Data
                </button>
              </form>

              {importSummary && (
                <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-customBorder-light dark:border-[#334155] space-y-3.5 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">{importSummary.successCount} Rows Validated</span>
                  </div>
                  
                  {importSummary.errors.length > 0 && (
                    <div className="space-y-1.5 text-rose-500">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 animate-pulse-soft" />
                        <span className="font-bold">{importSummary.errors.length} Rows Require Attention</span>
                      </div>
                      <div className="pl-6 max-h-24 overflow-y-auto space-y-1 text-[10px] text-customText-mutedLight">
                        {importSummary.errors.map((err, i) => (
                          <p key={i}>• {err}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCommitImport}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1 shadow-md"
                  >
                    Commit Import
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Screenshot-specific import summary widget */}
          <Card className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-customBorder-light dark:border-[#334155] flex flex-col justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-red-150/15 text-primary rounded-2xl">📄</span>
              <div>
                <p className="font-extrabold text-xs text-customText-light dark:text-white">Recent Import: Rooming_List_v4.csv</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">142 rows validated. <span className="text-rose-500 font-bold">3 rows require attention.</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-bold text-customText-mutedLight dark:text-customText-mutedDark">
              <button onClick={() => alert("Reviewing errors.")} className="text-primary hover:underline">Review 3 errors</button>
              <span>|</span>
              <button onClick={() => alert("Downloading original.")} className="hover:underline">Download original log</button>
            </div>
          </Card>
        </div>

      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCommit}
        title="Confirm Guest Import Commit"
        message={`Are you sure you want to commit the parsed guest list to the active registry? This will register all validated guests as Reserved.`}
        confirmText="Yes, Commit Import"
        cancelText="Cancel"
        type="warning"
      />

    </div>
  );
};
