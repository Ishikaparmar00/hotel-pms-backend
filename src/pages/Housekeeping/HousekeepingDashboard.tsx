import React, { useState } from "react";
import { useHotel } from "../../context/HotelContext";
import { HousekeepingStats } from "./components/HousekeepingStats";
import { HousekeepingBoard } from "./components/HousekeepingBoard";
import { FloorView } from "./components/FloorView";
import { StaffDirectory } from "./components/StaffDirectory";
import { HousekeepingAnalytics } from "./components/HousekeepingAnalytics";
import { RoomDetailsDrawer } from "./components/RoomDetailsDrawer";
import { AssignRoomModal } from "./components/AssignRoomModal";
import { StaffProfileDrawer } from "./components/StaffProfileDrawer";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Bell, Filter, Printer, Download, Plus, LayoutDashboard, Map, Users, BarChart3, Settings } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export const HousekeepingDashboard: React.FC = () => {
  const { guests, roomDowntimes, updateHousekeepingStatus } = useHotel();
  const { addToast } = useNotifications();

  // Active Tab View
  const [activeTab, setActiveTab] = useState<"kanban" | "floor" | "staff" | "analytics">("kanban");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStaffForAssign, setSelectedStaffForAssign] = useState<any>(null);

  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [selectedStaffForProfile, setSelectedStaffForProfile] = useState<any>(null);

  // Auto-refreshing queries (every 30s as requested)
  const { data: staff = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ['housekeeping-staff'],
    queryFn: () => api.get('/housekeeping/staff'),
    refetchInterval: 30000,
  });

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['housekeeping-tasks'],
    queryFn: () => api.get('/housekeeping/tasks'),
    refetchInterval: 30000,
  });

  // Calculate live stats based on queried data
  const calculateStats = () => {
    const totalRooms = 150; // mock total
    const cleanRooms = tasks.filter((t: any) => t.status === "Completed").length + (totalRooms - tasks.length - roomDowntimes.length);
    const dirtyRooms = tasks.filter((t: any) => t.status === "To Do").length;
    const inspectedRooms = tasks.filter((t: any) => t.status === "Inspection").length;
    const outOfService = roomDowntimes.length;
    const cleaningInProgress = tasks.filter((t: any) => t.status === "In Progress").length;
    const availableStaff = staff.filter((s: any) => s.status === "Active").length || 12;
    const avgCleaningTime = 28; // calculated mock
    const pendingTasks = dirtyRooms;
    const completedToday = tasks.filter((t: any) => t.status === "Completed").length;

    return { totalRooms, cleanRooms, dirtyRooms, inspectedRooms, outOfService, cleaningInProgress, availableStaff, avgCleaningTime, pendingTasks, completedToday };
  };

  const handleRoomClick = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    setIsDrawerOpen(true);
  };

  const selectedTask = tasks.find((t: any) => t.roomNumber === selectedRoom);
  const selectedGuest = guests.find(g => g.roomNumber === selectedRoom && g.status === "Checked In");

  // Notifications Mock (Live Alerts)
  const notifications = [
    { id: 1, text: "VIP Room 402 requires immediate cleaning.", time: "2m ago", type: "urgent" },
    { id: 2, text: "Room 305 delayed by 15 minutes.", time: "10m ago", type: "warning" },
    { id: 3, text: "Room 208 ready for inspection.", time: "12m ago", type: "info" }
  ];

  return (
    <div className="space-y-6 font-sans pb-20 animate-fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Housekeeping Operations
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time room status, staff tracking, and cleaning analytics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2.5 rounded-xl hover:bg-gray-50 transition text-gray-600">
            <Filter size={18} />
          </button>
          <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2.5 rounded-xl hover:bg-gray-50 transition text-gray-600">
            <Download size={18} />
          </button>
          <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2.5 rounded-xl hover:bg-gray-50 transition text-gray-600">
            <Printer size={18} />
          </button>
          <button onClick={() => addToast("To assign a task, go to Staff Directory and click Assign Room", "info")} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2">
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* Live Notifications Panel */}
      <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
        <div className="flex-shrink-0 text-rose-500 bg-rose-50 p-2 rounded-lg">
          <Bell size={18} className="animate-bounce" />
        </div>
        <div className="flex-1 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-6 items-center">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${n.type === 'urgent' ? 'bg-rose-500' : n.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{n.text}</span>
              <span className="text-gray-400">{n.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <HousekeepingStats 
        stats={calculateStats()} 
        activeFilter={activeFilter} 
        onFilterSelect={setActiveFilter} 
      />

      {/* View Navigation Tabs */}
      <div className="flex items-center bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-xl w-max border border-gray-200/50 dark:border-slate-700/50">
        <button onClick={() => setActiveTab("kanban")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "kanban" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}>
          <LayoutDashboard size={16}/> Live Board
        </button>
        <button onClick={() => setActiveTab("floor")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "floor" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}>
          <Map size={16}/> Floor View
        </button>
        <button onClick={() => setActiveTab("staff")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "staff" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}>
          <Users size={16}/> Staff Directory
        </button>
        <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "analytics" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}>
          <BarChart3 size={16}/> Analytics
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {(isStaffLoading || isTasksLoading) && tasks.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === "kanban" && (
              <HousekeepingBoard 
                tasks={activeFilter && activeFilter !== "all" 
                  ? tasks.filter((t:any) => t.status.toLowerCase().includes(activeFilter.toLowerCase())) 
                  : tasks} 
                onTaskStatusChange={(id, status) => {
                  updateHousekeepingStatus(id.toString(), status as any);
                  addToast(`Task moved to ${status}`, "success");
                }}
                onRoomClick={handleRoomClick}
              />
            )}
            
            {activeTab === "floor" && (
              <FloorView 
                tasks={tasks} 
                downtimes={roomDowntimes}
                onRoomClick={handleRoomClick} 
              />
            )}

            {activeTab === "staff" && (
              <StaffDirectory 
                staff={staff} 
                onAssignClick={(s) => { setSelectedStaffForAssign(s); setIsAssignModalOpen(true); }}
                onProfileClick={(s) => { setSelectedStaffForProfile(s); setIsProfileDrawerOpen(true); }}
                onChatClick={(s) => addToast(`Internal chat opened with ${s.name}`, "info")}
              />
            )}

            {activeTab === "analytics" && (
              <HousekeepingAnalytics />
            )}
          </>
        )}
      </div>

      {/* Room Details Side Drawer */}
      {selectedRoom && (
        <RoomDetailsDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)}
          roomNumber={selectedRoom}
          task={selectedTask}
          guest={selectedGuest}
          onUpdateStatus={(taskId, status) => {
            updateHousekeepingStatus(taskId.toString(), status as any);
            addToast(`Room ${selectedRoom} status updated to ${status}`, "success");
            if(status === 'Completed') setIsDrawerOpen(false);
          }}
        />
      )}

      {/* Staff Profile Drawer */}
      {selectedStaffForProfile && (
        <StaffProfileDrawer 
          isOpen={isProfileDrawerOpen}
          onClose={() => setIsProfileDrawerOpen(false)}
          staff={selectedStaffForProfile}
        />
      )}

      {/* Assign Room Modal */}
      {selectedStaffForAssign && (
        <AssignRoomModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          staff={selectedStaffForAssign}
        />
      )}

    </div>
  );
};
