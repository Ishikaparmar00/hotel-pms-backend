import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useHotel } from "../../context/HotelContext";
import { Modal } from "../../components/ui/Modal";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog";
import { FormError } from "../../components/ui/FormError";
import { 
  Sparkles, 
  Clock, 
  ListTodo, 
  Users, 
  CheckSquare, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  UserPlus, 
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  Cell 
} from "recharts";

export const HousekeepingDashboard: React.FC = () => {
  const { housekeepingTasks, housekeepers, updateHousekeepingStatus } = useHotel();
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffStatus, setNewStaffStatus] = useState<"Active" | "Break">("Active");
  const [nameError, setNameError] = useState("");

  // Simulated Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Confirmation Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetTaskId, setTargetTaskId] = useState("");
  const [targetRoomNo, setTargetRoomNo] = useState("");

  const triggerCompleteConfirmation = (taskId: string, roomNo: string) => {
    setTargetTaskId(taskId);
    setTargetRoomNo(roomNo);
    setIsConfirmOpen(true);
  };

  const handleConfirmComplete = () => {
    if (!targetTaskId) return;
    updateHousekeepingStatus(targetTaskId, "Completed");
    setTargetTaskId("");
    setTargetRoomNo("");
  };

  // Local helper for Add Staff
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      setNameError("Staff member name is required.");
      return;
    }
    
    setNameError("");
    alert(`Staff ${newStaffName} added to today's housekeeping shift roster.`);
    setIsAddStaffOpen(false);
    setNewStaffName("");
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 mt-1">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Grid: Kanban & Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, colIdx) => (
              <div key={colIdx} className="bg-[#F8F9FB] dark:bg-slate-800/40 border border-customBorder-light dark:border-customBorder-dark rounded-2xl p-4 space-y-4 min-h-[400px]">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, cardIdx) => (
                    <Card key={cardIdx} className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <div className="flex justify-between border-t border-customBorder-light/50 pt-2">
                        <Skeleton className="h-2 w-1/4" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex justify-between p-2 border rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-2.5 w-10" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Divide tasks by status for Kanban columns
  const todoTasks = housekeepingTasks.filter(t => t.status === "To Do");
  const inProgressTasks = housekeepingTasks.filter(t => t.status === "In Progress");
  const completedTasks = housekeepingTasks.filter(t => t.status === "Completed");

  // Recharts staff efficiency chart data
  const efficiencyData = housekeepers
    .filter(h => h.status === "Active")
    .slice(0, 5)
    .map(h => ({
      name: h.name.split(" ")[0],
      efficiency: h.efficiencyScore
    }));

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
            Housekeeping Operations
          </h1>
          <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
            Real-time room occupancy cleaning cycles and shift rosters.
          </p>
        </div>
      </div>

      {/* Housekeeping Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-5 shadow-premium flex items-center space-x-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Avg. Clean Time</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">28m 45s</p>
          </div>
        </div>

        <div className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-5 shadow-premium flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Tasks Remaining</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">{todoTasks.length + inProgressTasks.length} Tasks</p>
          </div>
        </div>

        <div className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-5 shadow-premium flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Active Staff</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">
              {housekeepers.filter(h => h.status === "Active").length} / {housekeepers.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-5 shadow-premium flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider">Completed Today</p>
            <p className="text-2xl font-bold text-customText-light dark:text-white mt-1">{completedTasks.length + 42} Rooms</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Kanban and Staff load split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Kanban Board Columns (left 2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Column 1: To Do */}
            <div className="bg-[#F8F9FB] dark:bg-slate-800/40 border border-customBorder-light dark:border-customBorder-dark rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-customText-light dark:text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  To Do
                </h3>
                <StatusBadge status={`${todoTasks.length} Rooms`} />
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] flex flex-col justify-start">
                {todoTasks.length > 0 ? (
                  todoTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-customText-light dark:text-white">Room {task.roomNumber}</span>
                        <StatusBadge status={task.priority} />
                      </div>
                      
                      <div className="text-xs text-customText-mutedLight dark:text-customText-mutedDark flex justify-between items-center">
                        <span>{task.type}</span>
                        <span className="font-semibold text-customText-light dark:text-white">{task.assignedTo}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-customBorder-light/50 dark:border-[#334155]/50">
                        <span className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">
                          {task.lastUpdated}
                        </span>
                        <button
                          onClick={() => updateHousekeepingStatus(task.id, "In Progress")}
                          className="p-1 text-primary hover:bg-primary/5 rounded transition-all"
                          title="Start Cleaning"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-customText-mutedLight dark:text-customText-mutedDark space-y-2 border border-dashed border-customBorder-light dark:border-[#334155] rounded-xl bg-white dark:bg-customCard-dark">
                    <span className="text-xl">🧹</span>
                    <p className="text-[10px] font-bold">No rooms in To Do queue</p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-[#F8F9FB] dark:bg-slate-800/40 border border-customBorder-light dark:border-customBorder-dark rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-customText-light dark:text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  In Progress
                </h3>
                <StatusBadge status={`${inProgressTasks.length} Rooms`} />
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] flex flex-col justify-start">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-customText-light dark:text-white">Room {task.roomNumber}</span>
                        <StatusBadge status={task.priority} />
                      </div>
                      
                      <div className="text-xs text-customText-mutedLight dark:text-customText-mutedDark flex justify-between items-center">
                        <span>{task.type}</span>
                        <span className="font-semibold text-customText-light dark:text-white">{task.assignedTo}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-customBorder-light/50 dark:border-[#334155]/50">
                        <button
                          onClick={() => updateHousekeepingStatus(task.id, "To Do")}
                          className="p-1 text-customText-mutedLight hover:bg-slate-100 rounded transition"
                          title="Revert to To Do"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => triggerCompleteConfirmation(task.id, task.roomNumber)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition flex items-center gap-0.5 text-[10px] font-bold"
                          title="Mark Completed"
                        >
                          <Check className="w-3.5 h-3.5" /> Done
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-customText-mutedLight dark:text-customText-mutedDark space-y-2 border border-dashed border-customBorder-light dark:border-[#334155] rounded-xl bg-white dark:bg-customCard-dark">
                    <span className="text-xl">🧼</span>
                    <p className="text-[10px] font-bold">No rooms cleaning in progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="bg-[#F8F9FB] dark:bg-slate-800/40 border border-customBorder-light dark:border-customBorder-dark rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-customText-light dark:text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Completed
                </h3>
                <StatusBadge status={`${completedTasks.length} Rooms`} />
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] flex flex-col justify-start">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-xl p-4 shadow-sm hover:shadow-md transition opacity-80 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-customText-light dark:text-white line-through">Room {task.roomNumber}</span>
                        <StatusBadge status="Completed" />
                      </div>
                      
                      <div className="text-xs text-customText-mutedLight dark:text-customText-mutedDark flex justify-between items-center">
                        <span>{task.type}</span>
                        <span className="font-semibold text-customText-light dark:text-white">{task.assignedTo}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-customBorder-light/50 dark:border-[#334155]/50 text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">
                        <span>Clean cycle completed</span>
                        <button
                          onClick={() => updateHousekeepingStatus(task.id, "In Progress")}
                          className="p-1 hover:text-primary rounded transition"
                          title="Re-open Task"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-customText-mutedLight dark:text-customText-mutedDark space-y-2 border border-dashed border-customBorder-light dark:border-[#334155] rounded-xl bg-white dark:bg-customCard-dark">
                    <span className="text-xl">✨</span>
                    <p className="text-[10px] font-bold">No clean cycles completed yet</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right sidebars: Staff Directory and Efficiency Trends */}
        <div className="space-y-6">
          
          {/* Staff Directory Panel */}
          <Card>
            <CardHeader className="border-b-0 pb-1">
              <CardTitle className="flex justify-between items-center w-full">
                <span>Staff Directory</span>
                <button
                  onClick={() => setIsAddStaffOpen(true)}
                  className="p-2 text-primary hover:bg-primary/5 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                >
                  <UserPlus className="w-4 h-4" /> Add Staff
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {housekeepers.map((hk) => (
                  <div 
                    key={hk.id} 
                    className="flex items-center justify-between p-3 rounded-xl border border-customBorder-light dark:border-[#334155] hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={hk.avatarUrl}
                        alt={hk.name}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700"
                      />
                      <div>
                        <p className="font-bold text-xs text-customText-light dark:text-[#F8FAFC]">
                          {hk.name}
                        </p>
                        <div className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark flex items-center gap-2 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${hk.status === "Active" ? "bg-emerald-500" : hk.status === "Break" ? "bg-purple-500" : "bg-zinc-400"}`}></span>
                          {hk.status === "Active" && hk.assignedRooms.length > 0 
                            ? `In Room ${hk.assignedRooms[0]}` 
                            : hk.status
                          }
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-customText-light dark:text-white">
                        {hk.completedToday} / 12
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark font-bold mt-0.5">
                        Completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Trend Chart */}
          <Card className="bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
            <CardHeader className="border-b-0 pb-1">
              <CardTitle className="text-white flex items-center gap-1.5 text-base">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Efficiency Trend
              </CardTitle>
              <span className="text-[10px] text-white/70 font-semibold">+12% faster than last Tuesday</span>
            </CardHeader>
            <CardContent>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" fontSize={9} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Efficiency"]}
                      contentStyle={{ background: "#1E293B", border: "none", borderRadius: "10px", fontSize: "11px" }}
                    />
                    <Bar dataKey="efficiency" radius={[6, 6, 0, 0]}>
                      {efficiencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 4 ? "#F97316" : "rgba(255, 255, 255, 0.85)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddStaffOpen}
        onClose={() => {
          setIsAddStaffOpen(false);
          setNameError("");
        }}
        title="Add Staff to Shift"
      >
        <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <label className="block text-customText-light dark:text-white">Staff Member Name</label>
            <input
              type="text"
              placeholder="e.g. Maria Sharapova"
              value={newStaffName}
              onChange={(e) => {
                setNewStaffName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
            />
            <FormError message={nameError} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-customText-light dark:text-white">Shift Role Status</label>
            <select
              value={newStaffStatus}
              onChange={(e) => setNewStaffStatus(e.target.value as any)}
              className="w-full bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-white focus:outline-none"
            >
              <option value="Active">Active Duty</option>
              <option value="Break">On Break</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold shadow-md transition transform active:scale-95 mt-4"
          >
            Assign to Shift
          </button>
        </form>
      </Modal>

      {/* Confirmation Dialog Gate */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmComplete}
        title="Confirm Clean Cycle Completion"
        message={`Are you sure you want to mark Room ${targetRoomNo} clean cycle as Completed & Ready for front office guest assignment?`}
        confirmText="Yes, Complete Task"
        cancelText="Cancel"
        type="success"
      />
    </div>
  );
};
