import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card } from "../../../components/ui/Card";
import { Clock, AlertTriangle, CheckCircle, Search, User, Play } from "lucide-react";

interface HousekeepingBoardProps {
  tasks: any[];
  onTaskStatusChange: (taskId: number, newStatus: string) => void;
  onRoomClick: (roomNumber: string) => void;
}

const columns = [
  { id: "To Do", title: "🟡 Assigned", bgColor: "bg-amber-50/50", borderColor: "border-amber-200" },
  { id: "In Progress", title: "🔵 Cleaning", bgColor: "bg-blue-50/50", borderColor: "border-blue-200" },
  { id: "Inspection", title: "🟣 Inspection", bgColor: "bg-purple-50/50", borderColor: "border-purple-200" },
  { id: "Completed", title: "🟢 Ready", bgColor: "bg-emerald-50/50", borderColor: "border-emerald-200" }
];

export const HousekeepingBoard: React.FC<HousekeepingBoardProps> = ({ tasks, onTaskStatusChange, onRoomClick }) => {
  // We need to keep local state for optimistic UI updates during drag
  const [boardData, setBoardData] = useState<Record<string, any[]>>({
    "To Do": [],
    "In Progress": [],
    "Inspection": [],
    "Completed": []
  });

  // Sync props to local state
  useEffect(() => {
    const newBoard = {
      "To Do": tasks.filter(t => t.status === "To Do"),
      "In Progress": tasks.filter(t => t.status === "In Progress"),
      "Inspection": tasks.filter(t => t.status === "Inspection"),
      "Completed": tasks.filter(t => t.status === "Completed")
    };
    setBoardData(newBoard);
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic update
    const sourceCol = [...boardData[source.droppableId]];
    const destCol = [...boardData[destination.droppableId]];
    
    const [movedTask] = sourceCol.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTask);

    setBoardData({
      ...boardData,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    });

    // Fire API call / Context update
    onTaskStatusChange(parseInt(draggableId.replace("task-", "")), destination.droppableId);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High": return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-700 border border-rose-200">High</span>;
      case "VIP": return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-700 border border-amber-200">VIP</span>;
      case "Medium": return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-700 border border-blue-200">Medium</span>;
      default: return <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-gray-100 text-gray-700 border border-gray-200">Low</span>;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
        {columns.map(col => (
          <div key={col.id} className={`rounded-xl p-4 min-h-[500px] border ${col.borderColor} ${col.bgColor} flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-sm">{col.title}</h3>
              <span className="bg-white text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-gray-100">
                {boardData[col.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={`flex-1 space-y-3 transition-colors ${snapshot.isDraggingOver ? "bg-black/5 rounded-lg p-1" : ""}`}
                >
                  {boardData[col.id]?.map((task, index) => (
                    <Draggable key={`task-${task.id}`} draggableId={`task-${task.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onRoomClick(task.roomNumber)}
                          className={`bg-white rounded-lg p-3.5 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative ${
                            snapshot.isDragging ? "shadow-lg rotate-2 scale-105 z-50 ring-2 ring-primary/50" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-extrabold text-gray-900 text-sm">Room {task.roomNumber}</span>
                            {getPriorityBadge(task.priority || "Low")}
                          </div>
                          
                          <p className="text-xs text-gray-600 font-semibold mb-3">{task.cleaningType || "Standard Clean"}</p>
                          
                          <div className="space-y-2 text-[10px] text-gray-500 font-medium">
                            <div className="flex items-center gap-1.5">
                              <User size={12} className="text-gray-400"/> 
                              <span>{task.assignedStaff?.name || task.assignedTo || "Unassigned"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-gray-400"/>
                                <span>Est. {task.estimatedTime || 30} mins</span>
                              </div>
                              {task.startedAt && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Started: {new Date(task.startedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
