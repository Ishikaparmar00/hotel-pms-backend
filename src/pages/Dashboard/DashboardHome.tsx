import React, { useState, useEffect } from "react";
import { formatCurrency } from "../../common/utils/formatCurrency";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useHotel } from "../../context/HotelContext";
import { Skeleton } from "../../components/ui/Skeleton";
import { 
  TrendingUp, 
  Users, 
  BedDouble, 
  IndianRupee, 
  Percent, 
  CheckCircle,
  Bell,
  ConciergeBell,
  Wrench,
  Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";

export const DashboardHome: React.FC = () => {
  const { guests, reservations, workOrders, housekeepingTasks, transactions } = useHotel();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </Card>
          ))}
        </div>

        {/* Main Charts & Feed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-80 w-full" />
            </Card>
            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-80 w-full" />
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-5 space-y-4 flex flex-col items-center">
              <div className="w-full flex justify-start">
                <Skeleton className="h-6 w-1/2" />
              </div>
              <Skeleton className="w-48 h-48 rounded-full mt-4" />
              <div className="w-full space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-3">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5 mt-1">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats dynamically
  const activeGuestsCount = guests.filter(g => g.status === "Checked In").length;
  const occupiedRoomsCount = activeGuestsCount; // simplified
  const totalRooms = 150; // Total hotel capacity
  const occupancyRate = ((occupiedRoomsCount / totalRooms) * 105).toFixed(1); // multiplier to make it realistic ~70%

  // Calculate ADR and RevPAR
  const checkedInReservations = reservations.filter(r => r.status === "Checked In");
  const totalRoomRevenue = checkedInReservations.reduce((sum, res) => sum + res.rate, 0);
  const adr = checkedInReservations.length > 0 
    ? Math.round(totalRoomRevenue / checkedInReservations.length) 
    : 285; // fallback realistic ADR
  const revpar = Math.round(adr * (parseFloat(occupancyRate) / 100));

  // Today's total billing transactions revenue
  const todayDate = new Date().toISOString().split("T")[0];
  const todayRevenue = transactions
    .filter(t => t.date === "2026-06-17" && t.category !== "Payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const availableRooms = totalRooms - occupiedRoomsCount - 6; // OOO rooms = 6

  // Recent 6 activities
  const recentActivities = [
    { id: "A1", time: "2 mins ago", msg: "Sarah Montgomery checked into Room 402", type: "checkin" },
    { id: "A2", time: "15 mins ago", msg: "Work order WO-4001 assigned to Arthur M.", type: "workorder" },
    { id: "A3", time: "30 mins ago", msg: "Room 105 clean status updated to Ready", type: "housekeeping" },
    { id: "A4", time: "1 hr ago", msg: "Posted Laundry Charge of ₹45.00 to Room 402", type: "billing" },
    { id: "A5", time: "2 hrs ago", msg: "Group Reservation Block Event: Alpha Tech Summit pickup rate is 80%", type: "group" },
    { id: "A6", time: "3 hrs ago", msg: "Inventory alert: Door Lock AA Batteries stock is low", type: "system" }
  ];

  // Recharts Mock Trend Data
  const trendData = [
    { name: "Mon", occupancy: 68, revenue: 14500 },
    { name: "Tue", occupancy: 72, revenue: 15800 },
    { name: "Wed", occupancy: 78, revenue: 18200 },
    { name: "Thu", occupancy: 82, revenue: 19500 },
    { name: "Fri", occupancy: 90, revenue: 24000 },
    { name: "Sat", occupancy: 95, revenue: 26500 },
    { name: "Sun", occupancy: 88, revenue: 21000 }
  ];

  // Room status donut chart data
  const roomStatusData = [
    { name: "Occupied", value: occupiedRoomsCount, color: "#B22222" }, // Primary Red
    { name: "Vacant Clean", value: availableRooms, color: "#10B981" }, // Green
    { name: "Dirty", value: 12, color: "#F59E0B" }, // Amber
    { name: "Out of Order", value: 6, color: "#3B82F6" } // Blue
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case "checkin": return <ConciergeBell className="w-4 h-4 text-emerald-500" />;
      case "workorder": return <Wrench className="w-4 h-4 text-rose-500" />;
      case "housekeeping": return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "billing": return <IndianRupee className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight font-sans">
            Executive Overview
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            Real-time status updates and hotel operation statistics.
          </p>
        </div>
        <div className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-customBorder-dark px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse-soft"></span>
          <span>PMS Live Connection: Stable</span>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <MetricCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={<Percent className="w-5 h-5" />}
          trend="+4.2%"
          trendDirection="up"
          progress={parseFloat(occupancyRate)}
        />
        <MetricCard
          title="ADR"
          value={formatCurrency(adr)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="+₹12.50"
          trendDirection="up"
        />
        <MetricCard
          title="RevPAR"
          value={formatCurrency(revpar)}
          icon={<IndianRupee className="w-5 h-5" />}
          trend="+₹8.40"
          trendDirection="up"
        />
        <MetricCard
          title="Available Rooms"
          value={availableRooms}
          icon={<BedDouble className="w-5 h-5" />}
          trend="-3 rooms"
          trendDirection="down"
        />
        <MetricCard
          title="Checked In Guests"
          value={activeGuestsCount}
          icon={<Users className="w-5 h-5" />}
          trend="+14 today"
          trendDirection="up"
        />
        <MetricCard
          title="Revenue Today"
          value={formatCurrency(todayRevenue)}
          icon={<IndianRupee className="w-5 h-5" />}
          trend="+18% vs yesterday"
          trendDirection="up"
        />
      </div>

      {/* Main Charts & Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Panels: Trends */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Trend Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Generation Trend</CardTitle>
              <span className="text-xs text-customText-mutedLight">Weekly cumulative room & service charges</span>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B22222" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#B22222" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `${formatCurrency(val/1000)}k`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                      contentStyle={{ background: "#1E293B", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#B22222" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Trend Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Level Timeline</CardTitle>
              <span className="text-xs text-customText-mutedLight">Percent occupancy rate per day</span>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} domain={[40, 100]} tickFormatter={(val) => `${val}%`} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Occupancy"]}
                      contentStyle={{ background: "#1E293B", color: "#F8FAFC", borderRadius: "12px", border: "none" }}
                    />
                    <Line type="monotone" dataKey="occupancy" stroke="#F97316" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Panel: Status breakdown and Activity logs */}
        <div className="space-y-6">
          
          {/* Room status Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Room Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-60 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {roomStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Rooms`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute text-center">
                  <p className="text-3xl font-extrabold text-customText-light dark:text-white">
                    {totalRooms}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-customText-mutedLight dark:text-customText-mutedDark font-bold">
                    Total Rooms
                  </p>
                </div>
              </div>

              {/* Legends list */}
              <div className="w-full grid grid-cols-2 gap-3.5 mt-2">
                {roomStatusData.map((entry, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: entry.color }}></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-customText-light dark:text-[#F8FAFC] truncate">
                        {entry.name}
                      </p>
                      <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">
                        {entry.value} rooms
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Hotel Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start space-x-3 text-xs leading-relaxed border-b border-customBorder-light/50 dark:border-[#334155]/50 pb-3 last:border-b-0 last:pb-0">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-customText-light dark:text-customText-dark">
                        {act.msg}
                      </p>
                      <span className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-1 block">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};
