import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Phone, MessageSquare, UserPlus, User, Clock } from "lucide-react";

interface StaffDirectoryProps {
  staff: any[];
  onAssignClick: (staff: any) => void;
  onProfileClick: (staff: any) => void;
  onChatClick: (staff: any) => void;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({ staff, onAssignClick, onProfileClick, onChatClick }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Available": return "bg-emerald-500";
      case "Busy": return "bg-rose-500";
      case "Break": return "bg-amber-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((s, idx) => {
        // Calculate workload based on fetched tasks
        const assignedTasks = s.tasks?.length || 0;
        const completedTasks = s.tasks?.filter((t:any) => t.status === "Completed")?.length || 0;
        const avgTime = completedTasks > 0 ? Math.round(s.tasks?.filter((t:any) => t.status === "Completed").reduce((acc:number, t:any) => acc + (t.actualTime || t.estimatedTime || 30), 0) / completedTasks) : 0;
        const currentStatus = s.status || "Offline";
        const progressPercent = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0;

        return (
          <Card key={s.id || idx} className="overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-inner">
                      {s.name ? s.name.charAt(0) : "U"}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(currentStatus)}`}></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{s.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.employeeId} • {s.shift} Shift</p>
                    <p className="text-[10px] font-bold text-primary mt-1 bg-primary/10 inline-block px-2 py-0.5 rounded-full">
                      Floor {s.assignedFloor || "Any"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {/* Workload Progress */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Today's Workload</span>
                    <span className="text-gray-900 dark:text-white">{assignedTasks} / 10 Tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((assignedTasks / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 text-center border border-gray-100 dark:border-slate-700">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Completed</p>
                    <p className="font-extrabold text-gray-900 dark:text-white">{completedTasks}</p>
                  </div>
                  <div className="w-px bg-gray-200 dark:bg-slate-700"></div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Avg Time</p>
                    <p className="font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      <Clock size={12}/> {avgTime}m
                    </p>
                  </div>
                  <div className="w-px bg-gray-200 dark:bg-slate-700"></div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Status</p>
                    <p className={`font-extrabold text-xs mt-0.5 ${
                      currentStatus === 'Available' ? 'text-emerald-600' :
                      currentStatus === 'Busy' ? 'text-rose-600' :
                      currentStatus === 'Break' ? 'text-amber-500' : 'text-gray-500'
                    }`}>
                      {currentStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-4 gap-2">
                <button 
                  onClick={() => onAssignClick(s)}
                  className="col-span-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1.5 transition"
                >
                  <UserPlus size={14}/> Assign Room
                </button>
                <button 
                  onClick={() => onProfileClick(s)}
                  className="col-span-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1.5 transition"
                >
                  <User size={14}/> View Profile
                </button>
                <a 
                  href={s.mobileNumber ? `tel:${s.mobileNumber}` : '#'}
                  onClick={(e) => {
                    if (!s.mobileNumber) {
                      e.preventDefault();
                      alert("Phone number not available.");
                    }
                  }}
                  className="col-span-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1.5 transition text-center"
                >
                  <Phone size={14}/> Call
                </a>
                <button 
                  onClick={() => onChatClick(s)}
                  className="col-span-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1.5 transition"
                >
                  <MessageSquare size={14}/> Chat
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

