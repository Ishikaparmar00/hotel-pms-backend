import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Map, Bed, Check, Search, AlertCircle, Wrench } from "lucide-react";

interface FloorViewProps {
  tasks: any[];
  downtimes: any[]; // for Out Of Order rooms
  onRoomClick: (roomNumber: string) => void;
}

export const FloorView: React.FC<FloorViewProps> = ({ tasks, downtimes, onRoomClick }) => {
  // We mock a hotel with 4 floors, 10 rooms per floor for visualization.
  const floors = [1, 2, 3, 4];
  const roomsPerFloor = 10;

  const getRoomStatus = (roomNumber: string) => {
    // Check if room is out of order
    const ooo = downtimes.find(d => d.roomNumber === roomNumber);
    if (ooo) return "OOO";
    
    // Check housekeeping task
    const task = tasks.find(t => t.roomNumber === roomNumber);
    if (task) {
      if (task.status === "To Do") return "Dirty";
      if (task.status === "In Progress") return "Cleaning";
      if (task.status === "Inspection") return "Inspection";
      if (task.status === "Completed") return "Clean";
    }
    
    // Default to clean if no active task or downtime
    return "Clean";
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Clean": return "bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20";
      case "Dirty": return "bg-amber-400 border-amber-500 text-white shadow-amber-500/20";
      case "Cleaning": return "bg-blue-400 border-blue-500 text-white shadow-blue-500/20";
      case "Inspection": return "bg-purple-500 border-purple-600 text-white shadow-purple-500/20";
      case "OOO": return "bg-rose-500 border-rose-600 text-white shadow-rose-500/20";
      default: return "bg-gray-100 border-gray-200 text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Clean": return <Check size={14} />;
      case "Dirty": return <AlertCircle size={14} />;
      case "Cleaning": return <Wrench size={14} />;
      case "Inspection": return <Search size={14} />;
      case "OOO": return <Ban size={14} />;
      default: return <Bed size={14} />;
    }
  };

  const Ban = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
  );

  return (
    <div className="space-y-6">
      {/* Legend */}
      <Card className="p-4 bg-gray-50 dark:bg-slate-800/50 border-dashed">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Clean</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Dirty</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Cleaning</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Inspection</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Out of Order</span>
        </div>
      </Card>

      {/* Floors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {floors.map(floor => (
          <Card key={floor} className="overflow-hidden">
            <CardHeader className="bg-gray-50/80 dark:bg-slate-800/80 py-3 border-b border-gray-100 dark:border-slate-700">
              <CardTitle className="text-sm flex items-center gap-2"><Map size={16} className="text-primary"/> Floor {floor}</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: roomsPerFloor }).map((_, i) => {
                  const roomNumber = `${floor}0${i + 1}`.replace("010", "10"); // e.g. 101, 102...
                  const status = getRoomStatus(roomNumber);
                  const colorClass = getStatusColor(status);
                  
                  return (
                    <button
                      key={roomNumber}
                      onClick={() => onRoomClick(roomNumber)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95 ${colorClass}`}
                      title={`Room ${roomNumber} - ${status}`}
                    >
                      <span className="font-extrabold text-sm tracking-tight">{roomNumber}</span>
                      <div className="mt-1 opacity-90">
                        {getStatusIcon(status)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
