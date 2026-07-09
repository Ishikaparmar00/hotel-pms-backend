import React from "react";
import { X, Phone, Mail, Award, Clock, CalendarCheck, CheckSquare, ListTodo } from "lucide-react";

interface StaffProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

export const StaffProfileDrawer: React.FC<StaffProfileDrawerProps> = ({ isOpen, onClose, staff }) => {
  if (!isOpen || !staff) return null;

  const assignedTasks = staff.tasks || [];
  const completedTasks = assignedTasks.filter((t: any) => t.status === "Completed");
  const pendingTasks = assignedTasks.filter((t: any) => t.status !== "Completed");

  // Calculate Avg Time (if completed)
  const avgTime = completedTasks.length > 0 
    ? Math.round(completedTasks.reduce((acc: number, t: any) => acc + (t.actualTime || t.estimatedTime || 30), 0) / completedTasks.length)
    : 0;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-900/40 z-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-[#003B95] to-blue-600">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 border-b border-gray-100 dark:border-slate-800 flex flex-col items-center -mt-12 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 p-1 mb-3">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-3xl shadow-inner">
              {staff.name.charAt(0)}
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center">{staff.name}</h2>
          <p className="text-sm text-gray-500 font-semibold">{staff.employeeId} • {staff.department}</p>
          
          <div className="flex gap-2 mt-4">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              staff.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 
              staff.status === 'Busy' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {staff.status}
            </span>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-blue-100 text-blue-700">
              {staff.shift} Shift
            </span>
          </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30 dark:bg-slate-900">
          
          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4">
            <a href={`tel:${staff.mobileNumber}`} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-gray-100 transition cursor-pointer">
              <Phone size={20} className="text-gray-400 mb-2" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">Call</span>
              <span className="text-[10px] text-gray-500">{staff.mobileNumber}</span>
            </a>
            <a href={`mailto:${staff.email}`} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-gray-100 transition cursor-pointer">
              <Mail size={20} className="text-gray-400 mb-2" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">Email</span>
              <span className="text-[10px] text-gray-500 truncate w-full text-center">{staff.email}</span>
            </a>
          </div>

          {/* Performance Stats */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Award size={14}/> Performance (Today)</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                <span className="text-gray-400 mb-1 flex justify-center"><ListTodo size={18}/></span>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{assignedTasks.length}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">Assigned</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/50 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
                <span className="text-emerald-500 mb-1 flex justify-center"><CheckSquare size={18}/></span>
                <p className="text-xl font-extrabold text-emerald-600">{completedTasks.length}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">Completed</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                <span className="text-amber-500 mb-1 flex justify-center"><Clock size={18}/></span>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{avgTime}m</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">Avg Time</p>
              </div>
            </div>
          </div>

          {/* Current Assignment */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><CalendarCheck size={14}/> Today's Assignment</h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              {pendingTasks.length > 0 ? (
                <ul className="divide-y divide-gray-50 dark:divide-slate-700">
                  {pendingTasks.map((t: any) => (
                    <li key={t.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">Room {t.roomNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>{t.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{t.cleaningType} • Est. {t.estimatedTime}m</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm font-semibold">
                  No pending assignments today.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
