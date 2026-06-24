import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { useHotel } from "../../context/HotelContext";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { FormError } from "../../components/ui/FormError";
import { 
  Wrench, 
  AlertOctagon, 
  DollarSign, 
  Bed, 
  TrendingDown, 
  Plus, 
  ArrowRight,
  User,
  Settings,
  UploadCloud,
  CheckCircle,
  Clock,
  Sparkles,
  Camera,
  Layers,
  Thermometer,
  ShieldAlert
} from "lucide-react";

export const MaintenanceDashboard: React.FC = () => {
  const { workOrders, engineers, createWorkOrder, updateWorkOrderStatus } = useHotel();
  const [isNewWoOpen, setIsNewWoOpen] = useState(false);
  
  // Work order form state
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState<any>("Plumbing");
  const [priority, setPriority] = useState<any>("Medium");
  const [engineerId, setEngineerId] = useState("");
  const [description, setDescription] = useState("");

  // Validation states
  const [roomError, setRoomError] = useState("");
  const [descError, setDescError] = useState("");
  const [engineerError, setEngineerError] = useState("");

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

  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    if (!room.trim()) {
      setRoomError("Room number or location is required.");
      hasError = true;
    } else {
      setRoomError("");
    }

    if (!description.trim() || description.trim().length < 5) {
      setDescError("Please enter a valid description (at least 5 characters).");
      hasError = true;
    } else {
      setDescError("");
    }

    if (!engineerId) {
      setEngineerError("Please assign an engineer to this task.");
      hasError = true;
    } else {
      setEngineerError("");
    }

    if (hasError) return;
    
    const eng = engineers.find(e => e.id === engineerId);

    createWorkOrder({
      roomNumber: room,
      category,
      priority,
      status: "Pending",
      assignedEngineerId: engineerId,
      assignedEngineerName: eng ? eng.name : "Arthur M.",
      description
    });

    setIsNewWoOpen(false);
    setRoom("");
    setDescription("");
    setEngineerId("");
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
          <Skeleton className="h-10 w-48" />
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex gap-4">
              <div className="flex-1 space-y-2 mt-1">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            </Card>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card className="p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
              <div className="space-y-3 pt-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex justify-between border-b pb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="p-5 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-28 w-full" />
              </Card>
              <Card className="p-5 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-28 w-full" />
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }



  // Filter queue for top WO entries matching the exact screenshot list style
  const mockQueue = [
    { id: "#WO-4812", room: "Room 402", category: "HVAC Leakage", type: "snowflake", priority: "Emergency", status: "In Progress", created: "2h ago" },
    { id: "#WO-4809", room: "Lobby West", category: "Flickering Lighting", type: "lightning", priority: "High", status: "Pending", created: "5h ago" },
    { id: "#WO-4795", room: "Room 105", category: "Plumbing - Slow Drain", type: "drop", priority: "Low", status: "Resolved", created: "1d ago" }
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
            Maintenance & Engineering
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            Work order queues, engineers dispatch, parts inventory, and facility asset integrity.
          </p>
        </div>
        <button
          onClick={() => setIsNewWoOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 hover:from-primary-hover hover:to-secondary-dark"
        >
          <Plus className="w-4 h-4" /> Create Work Order
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Open Tickets</p>
            <p className="text-3xl font-extrabold text-customText-light dark:text-white">24</p>
            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-500">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -12% vs last wk
            </span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-primary">
            <Wrench className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Emergency Alerts</p>
            <p className="text-3xl font-extrabold text-customText-light dark:text-white">03</p>
            <span className="text-xs text-rose-500 font-bold">! High Impact</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Parts Expenditure</p>
            <p className="text-3xl font-extrabold text-customText-light dark:text-white">$1,420</p>
            <span className="text-xs text-customText-mutedLight dark:text-customText-mutedDark font-semibold">Budget: $5k / Mo</span>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl text-yellow-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Out of Order Rooms</p>
            <p className="text-3xl font-extrabold text-customText-light dark:text-white">07</p>
            <span className="text-xs text-customText-mutedLight dark:text-customText-mutedDark font-semibold">2.1% total inventory</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
            <Bed className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3): Maintenance Queue & Costs */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Active Maintenance Queue table */}
          <Card>
            <CardHeader className="flex justify-between items-center border-b-0 pb-1">
              <CardTitle>Active Maintenance Queue</CardTitle>
              <div className="flex gap-2.5">
                <button className="px-3.5 py-1.5 border border-customBorder-light dark:border-[#334155] rounded-xl text-xs font-bold text-customText-light dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Export CSV
                </button>
                <button className="px-3.5 py-1.5 border border-customBorder-light dark:border-[#334155] rounded-xl text-xs font-bold text-customText-light dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Filters
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F8F9FB] dark:bg-slate-800/80 border-b border-customBorder-light dark:border-[#334155] text-customText-mutedLight dark:text-customText-mutedDark uppercase font-bold tracking-wider py-3.5">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Room/Category</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-customBorder-light/55 dark:divide-[#334155]/55">
                    {mockQueue.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition">
                        <td className="px-4 py-4 font-bold text-rose-800 dark:text-rose-400">
                          {item.id}
                          <span className="block text-[10px] font-medium text-customText-mutedLight dark:text-customText-mutedDark mt-0.5">Created {item.created}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-xs text-customText-light dark:text-white">{item.room}</p>
                              <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={item.priority} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              item.status === "In Progress" ? "bg-amber-500 animate-pulse-soft" : 
                              item.status === "Resolved" ? "bg-emerald-500" : "bg-zinc-400"
                            }`}></span>
                            <span className="font-semibold text-customText-light dark:text-white">{item.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Repair Cost Tracker & Inventory Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Repair Cost Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Repair Cost Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <span className="text-customText-mutedLight">Compressor Part (HVAC)</span>
                  <span className="font-bold text-customText-light dark:text-white">$425.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <span className="text-customText-mutedLight">Labor (Emergency 4h)</span>
                  <span className="font-bold text-customText-light dark:text-white">$320.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <span className="text-customText-mutedLight">Fittings & Sealants</span>
                  <span className="font-bold text-customText-light dark:text-white">$45.50</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-customBorder-light dark:border-[#334155]">
                  <span className="font-bold text-customText-light dark:text-white">Total WO Cost</span>
                  <span className="text-sm font-extrabold text-primary dark:text-[#FB923C]">$790.50</span>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-center p-3.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-1 bg-rose-500/15 text-rose-600 rounded">💡</span>
                    <div>
                      <p className="font-bold text-customText-light dark:text-white">GU24 LED Bulbs</p>
                      <p className="text-[10px] text-rose-500">Low Stock: 4 units left</p>
                    </div>
                  </div>
                  <button className="text-primary dark:text-[#FB923C] text-[10px] font-bold hover:underline">
                    Reorder
                  </button>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-1 bg-amber-500/15 text-amber-600 rounded">⚙️</span>
                    <div>
                      <p className="font-bold text-customText-light dark:text-white">Filter Sets (Size 2)</p>
                      <p className="text-[10px] text-amber-500">Stock: 12 units</p>
                    </div>
                  </div>
                  <button className="text-customText-mutedLight dark:text-customText-mutedDark text-[10px] font-bold hover:underline">
                    Manage
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column (1/3): Visual Documentation, Alerts, Engineers */}
        <div className="space-y-6">
          
          {/* Visual Documentation Photo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3.5">
                {/* Photo 1 */}
                <div className="relative rounded-xl overflow-hidden group aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60" 
                    alt="Before repair" 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-[9px] text-white font-semibold uppercase tracking-wider">BEFORE (Room 402)</span>
                  </div>
                </div>

                {/* Photo 2 */}
                <div className="relative rounded-xl overflow-hidden group aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=300&auto=format&fit=crop&q=60" 
                    alt="After repair" 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-[9px] text-emerald-300 font-semibold uppercase tracking-wider bg-emerald-950/80 px-1 rounded">AFTER REPAIR</span>
                  </div>
                </div>

                {/* Photo 3 */}
                <div className="relative rounded-xl overflow-hidden group aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1565538810844-1e119412e866?w=300&auto=format&fit=crop&q=60" 
                    alt="Lobby West Lighting" 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-[9px] text-white font-semibold uppercase tracking-wider">REPORT (Lobby)</span>
                  </div>
                </div>

                {/* Upload Button mock */}
                <div className="border border-dashed border-customBorder-light dark:border-[#334155] rounded-xl flex flex-col items-center justify-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
                  <Camera className="w-5 h-5 text-customText-mutedLight" />
                  <span className="text-[9px] font-bold text-customText-mutedLight mt-1.5 uppercase">Upload Photo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts Panel */}
          <Card className="bg-primary text-white border-0 shadow-xl">
            <CardHeader className="border-b-0 pb-1">
              <CardTitle className="text-white flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <AlertOctagon className="w-4.5 h-4.5 text-secondary animate-pulse-soft" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              <div className="p-3 bg-white/10 rounded-xl space-y-1">
                <p className="text-secondary font-bold">Elevator #3 (B-Service)</p>
                <p className="text-[10px] text-white/80">Safety inspection overdue by 48 hours. Requires immediate tag-out.</p>
              </div>

              <div className="p-3 bg-white/10 rounded-xl space-y-1">
                <p className="text-white font-bold">Server Room Humidity</p>
                <p className="text-[10px] text-white/80">Spike detected (68%). Potential cooling failover initiated.</p>
              </div>
            </CardContent>
          </Card>

          {/* On Duty Engineers */}
          <Card>
            <CardHeader>
              <CardTitle>On-Duty Engineers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-customBorder-light dark:border-[#334155]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-customText-light">MT</div>
                  <div>
                    <p className="font-bold text-customText-light dark:text-white">Mike Thompson</p>
                    <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">Working [HVAC #4812]</p>
                  </div>
                </div>
                <StatusBadge status="Active" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-customBorder-light dark:border-[#334155]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-customText-light">SJ</div>
                  <div>
                    <p className="font-bold text-customText-light dark:text-white">Sarah Jenkins</p>
                    <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">On Break</p>
                  </div>
                </div>
                <StatusBadge status="Break" />
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Create Work Order Modal */}
      <Modal
        isOpen={isNewWoOpen}
        onClose={() => setIsNewWoOpen(false)}
        title="Create Maintenance Work Order"
      >
        <form onSubmit={handleCreateWO} className="space-y-4 text-xs font-semibold">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-customText-light dark:text-white">Room / Location</label>
              <input
                type="text"
                placeholder="e.g. 402, Lobby West"
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                  if (e.target.value.trim()) setRoomError("");
                }}
                className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
              />
              <FormError message={roomError} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-customText-light dark:text-white">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Painting">Painting</option>
                <option value="Leakage">Leakage</option>
                <option value="Furniture">Furniture</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-customText-light dark:text-white">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-customText-light dark:text-white">Assign Engineer</label>
              <select
                value={engineerId}
                onChange={(e) => {
                  setEngineerId(e.target.value);
                  if (e.target.value) setEngineerError("");
                }}
                className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
              >
                <option value="">-- Choose Engineer --</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.specialty})
                  </option>
                ))}
              </select>
              <FormError message={engineerError} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-customText-light dark:text-white">Problem Description</label>
            <textarea
              rows={3}
              placeholder="e.g. Faucet leaking or AC fan rattling..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim().length >= 5) setDescError("");
              }}
              className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
            />
            <FormError message={descError} />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold shadow-md transition transform active:scale-95 mt-4"
          >
            Dispatch Engineer
          </button>
        </form>
      </Modal>

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
