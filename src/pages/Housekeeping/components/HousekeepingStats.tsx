import React from "react";
import { Card } from "../../../components/ui/Card";
import { 
  BedDouble, 
  Sparkles, 
  Wrench, 
  Search, 
  Ban, 
  Loader, 
  Users, 
  Clock, 
  ListTodo, 
  CheckSquare 
} from "lucide-react";

interface HousekeepingStatsProps {
  stats: {
    totalRooms: number;
    cleanRooms: number;
    dirtyRooms: number;
    inspectedRooms: number;
    outOfService: number;
    cleaningInProgress: number;
    availableStaff: number;
    avgCleaningTime: number; // in minutes
    pendingTasks: number;
    completedToday: number;
  };
  onFilterSelect: (filterType: string) => void;
  activeFilter: string | null;
}

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  filterKey: string;
  isActive: boolean;
  onClick: (key: string) => void;
}> = ({ title, value, icon, trend, trendDirection, filterKey, isActive, onClick }) => {
  return (
    <Card 
      onClick={() => onClick(filterKey)}
      className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
        isActive 
          ? "border-primary shadow-md bg-primary/5 dark:bg-primary/10" 
          : "border-transparent hover:border-gray-200 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300"}`}>
          {icon}
        </div>
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          trendDirection === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 
          trendDirection === 'down' ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' :
          'text-gray-600 bg-gray-50 dark:bg-gray-800'
        }`}>
          {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '-'} {trend}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-extrabold text-customText-light dark:text-white">{value}</p>
        <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider mt-1">{title}</p>
      </div>
    </Card>
  );
};

export const HousekeepingStats: React.FC<HousekeepingStatsProps> = ({ stats, onFilterSelect, activeFilter }) => {
  const handleSelect = (key: string) => {
    // Toggle filter off if clicking the already active one
    onFilterSelect(activeFilter === key ? "" : key);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatCard 
        title="Total Rooms" 
        value={stats.totalRooms} 
        icon={<BedDouble size={20}/>} 
        trend="0%" trendDirection="neutral" 
        filterKey="all" isActive={activeFilter === "all"} onClick={handleSelect} 
      />
      <StatCard 
        title="Clean Rooms" 
        value={stats.cleanRooms} 
        icon={<Sparkles size={20}/>} 
        trend="12%" trendDirection="up" 
        filterKey="clean" isActive={activeFilter === "clean"} onClick={handleSelect} 
      />
      <StatCard 
        title="Dirty Rooms" 
        value={stats.dirtyRooms} 
        icon={<Wrench size={20}/>} 
        trend="5%" trendDirection="down" 
        filterKey="dirty" isActive={activeFilter === "dirty"} onClick={handleSelect} 
      />
      <StatCard 
        title="Inspected" 
        value={stats.inspectedRooms} 
        icon={<Search size={20}/>} 
        trend="8%" trendDirection="up" 
        filterKey="inspected" isActive={activeFilter === "inspected"} onClick={handleSelect} 
      />
      <StatCard 
        title="Out of Service" 
        value={stats.outOfService} 
        icon={<Ban size={20}/>} 
        trend="1%" trendDirection="neutral" 
        filterKey="oos" isActive={activeFilter === "oos"} onClick={handleSelect} 
      />
      <StatCard 
        title="In Progress" 
        value={stats.cleaningInProgress} 
        icon={<Loader size={20}/>} 
        trend="20%" trendDirection="up" 
        filterKey="progress" isActive={activeFilter === "progress"} onClick={handleSelect} 
      />
      <StatCard 
        title="Available Staff" 
        value={stats.availableStaff} 
        icon={<Users size={20}/>} 
        trend="2" trendDirection="neutral" 
        filterKey="staff" isActive={activeFilter === "staff"} onClick={handleSelect} 
      />
      <StatCard 
        title="Avg. Time" 
        value={`${stats.avgCleaningTime}m`} 
        icon={<Clock size={20}/>} 
        trend="3m" trendDirection="down" 
        filterKey="time" isActive={activeFilter === "time"} onClick={handleSelect} 
      />
      <StatCard 
        title="Pending Tasks" 
        value={stats.pendingTasks} 
        icon={<ListTodo size={20}/>} 
        trend="15%" trendDirection="down" 
        filterKey="pending" isActive={activeFilter === "pending"} onClick={handleSelect} 
      />
      <StatCard 
        title="Completed Today" 
        value={stats.completedToday} 
        icon={<CheckSquare size={20}/>} 
        trend="30%" trendDirection="up" 
        filterKey="completed" isActive={activeFilter === "completed"} onClick={handleSelect} 
      />
    </div>
  );
};
