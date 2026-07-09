import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { useNotifications } from "../../../context/NotificationContext";

interface AssignRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

export const AssignRoomModal: React.FC<AssignRoomModalProps> = ({ isOpen, onClose, staff }) => {
  const queryClient = useQueryClient();
  const { addToast } = useNotifications();

  // Form State
  const [roomNumber, setRoomNumber] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [cleaningType, setCleaningType] = useState("Standard Cleaning");
  const [dueTime, setDueTime] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("30");
  const [notes, setNotes] = useState("");

  // Fetch eligible rooms
  const { data: eligibleRooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['eligible-rooms'],
    queryFn: () => api.get('/housekeeping/rooms/eligible'),
    enabled: isOpen
  });

  // Assign mutation
  const assignMutation = useMutation({
    mutationFn: (data: any) => api.post('/housekeeping/tasks', data),
    onSuccess: (data) => {
      addToast(`Room ${data.roomNumber} assigned to ${staff.name} successfully.`, "success");
      queryClient.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['housekeeping-staff'] });
      onClose();
      // Reset form
      setRoomNumber("");
      setNotes("");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to assign room.";
      addToast(msg, "error");
    }
  });

  if (!isOpen || !staff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return addToast("Please select a room", "warning");

    assignMutation.mutate({
      roomNumber,
      cleaningType,
      priority,
      assignedStaffId: staff.id,
      estimatedTime: parseInt(estimatedTime),
      dueTime: dueTime ? new Date(`1970-01-01T${dueTime}:00`).toISOString() : undefined,
      notes,
      status: "To Do"
    });
  };

  const assignedCount = staff.tasks?.length || 0;
  const isWorkloadHigh = assignedCount >= 8;
  const isWorkloadMax = assignedCount >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl z-10 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Assign Room to Housekeeping Staff</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            {/* Staff Info Card */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-start gap-4 border border-gray-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {staff.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{staff.name}</h3>
                    <p className="text-xs text-gray-500">{staff.employeeId} • {staff.shift} Shift</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    staff.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {staff.status}
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">Today's Workload</span>
                    <span className={isWorkloadMax ? "text-rose-600" : isWorkloadHigh ? "text-amber-600" : "text-gray-900"}>
                      {assignedCount} / 10 Tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isWorkloadMax ? 'bg-rose-500' : isWorkloadHigh ? 'bg-amber-500' : 'bg-primary'}`} 
                      style={{ width: `${Math.min((assignedCount / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {isWorkloadMax && (
              <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-lg p-3 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> Max daily workload (10 tasks) reached. Assignment will be rejected.
              </div>
            )}
            
            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2 md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Select Room <span className="text-rose-500">*</span></label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                >
                  <option value="">-- Choose an eligible room --</option>
                  {isLoadingRooms ? (
                    <option disabled>Loading rooms...</option>
                  ) : (
                    eligibleRooms.map((room: any) => (
                      <option key={room.roomNumber} value={room.roomNumber}>
                        Room {room.roomNumber} ({room.roomType}) - {room.status}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Cleaning Type</label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={cleaningType}
                  onChange={(e) => setCleaningType(e.target.value)}
                >
                  <option>Standard Cleaning</option>
                  <option>Deep Cleaning</option>
                  <option>Departure Cleaning</option>
                  <option>Arrival Cleaning</option>
                  <option>Maintenance Cleaning</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Priority</label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>VIP</option>
                  <option>Express</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Due Time (Optional)</label>
                <input 
                  type="time" 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Est. Cleaning Time (Mins)</label>
                <input 
                  type="number" 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  min="5"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Notes / Instructions</label>
                <textarea 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Guest requested extra towels..."
                ></textarea>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 rounded-b-2xl">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={assignMutation.isPending || isWorkloadMax}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg shadow-sm transition flex items-center gap-2"
            >
              {assignMutation.isPending ? "Assigning..." : <><CheckCircle size={16}/> Assign</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
