import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, CheckCircle, Camera, PenTool, Image as ImageIcon, CheckSquare, XSquare, QrCode } from "lucide-react";

interface RoomDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roomNumber: string;
  task: any; // Housekeeping Task if any
  guest: any; // Current Guest if any
  onUpdateStatus: (taskId: number, status: string) => void;
}

export const RoomDetailsDrawer: React.FC<RoomDetailsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  roomNumber, 
  task, 
  guest,
  onUpdateStatus 
}) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!isOpen) return null;

  // Mock checklist state
  const initialChecklist = [
    { id: 1, label: "Bathroom & Toiletries", status: "pending" },
    { id: 2, label: "Beds & Linens", status: "pending" },
    { id: 3, label: "Dusting & Vacuum", status: "pending" },
    { id: 4, label: "Mini Bar Replenishment", status: "pending" },
    { id: 5, label: "Towels & Amenities", status: "pending" },
    { id: 6, label: "Windows & Balcony", status: "pending" }
  ];

  const [checklist, setChecklist] = useState(initialChecklist);

  const toggleCheck = (id: number, status: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-900/40 z-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Room {roomNumber}</h2>
            <p className="text-xs text-gray-500 font-semibold">{task ? task.cleaningType : "Clean/Vacant"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full text-gray-500 transition">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            Info
          </button>
          <button 
            onClick={() => setActiveTab("checklist")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'checklist' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            Checklist
          </button>
          <button 
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'media' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            Media & QR
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === "info" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-gray-500">Status</span>
                  <span className={`font-bold ${task ? 'text-blue-600' : 'text-emerald-600'}`}>{task ? task.status : "Clean"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-gray-500">Assigned To</span>
                  <span className="font-bold text-gray-900 dark:text-white">{task?.assignedStaff?.name || task?.assignedTo || "Unassigned"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-gray-500">Guest Name</span>
                  <span className="font-bold text-gray-900 dark:text-white">{guest?.name || "Vacant"}</span>
                </div>
                {guest && (
                  <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                    <span className="font-semibold text-gray-500">Stay Duration</span>
                    <span className="font-bold text-gray-900 dark:text-white">{guest.arrivalDate} - {guest.departureDate}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-gray-500">Priority</span>
                  <span className="font-bold text-rose-600">{task?.priority || "Normal"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Action Center</h4>
                {task && task.status !== "Completed" && (
                  <button 
                    onClick={() => onUpdateStatus(task.id, task.status === 'To Do' ? 'In Progress' : 'Completed')}
                    className="w-full bg-[#003B95] hover:bg-blue-800 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"
                  >
                    <CheckCircle size={18}/> 
                    {task.status === 'To Do' ? 'Start Cleaning' : 'Mark as Completed'}
                  </button>
                )}
                <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition">
                  <PenTool size={18}/> Request Maintenance
                </button>
              </div>
            </div>
          )}

          {activeTab === "checklist" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs font-semibold text-gray-500 mb-4">Interactive room cleaning checklist. Tap to mark status.</p>
              
              <div className="space-y-3">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                    <span className={`text-sm font-semibold ${item.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                      {item.label}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleCheck(item.id, 'done')}
                        className={`p-1.5 rounded transition ${item.status === 'done' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500 hover:bg-emerald-50 hover:text-emerald-500'}`}
                      >
                        <CheckSquare size={16} />
                      </button>
                      <button 
                        onClick={() => toggleCheck(item.id, 'failed')}
                        className={`p-1.5 rounded transition ${item.status === 'failed' ? 'bg-rose-100 text-rose-600' : 'bg-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-500'}`}
                      >
                        <XSquare size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Image Upload Mockup */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><ImageIcon size={18}/> Image Documentation</h4>
                <p className="text-xs text-gray-500">Upload before/after photos for quality assurance.</p>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                  <Camera size={32} className="text-gray-400 mb-2"/>
                  <span className="text-sm font-bold text-[#003B95]">Tap to capture or upload</span>
                  <span className="text-[10px] text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 my-4"></div>

              {/* QR Code */}
              <div className="space-y-3 flex flex-col items-center">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 w-full"><QrCode size={18}/> Room QR Gateway</h4>
                <p className="text-xs text-gray-500 w-full text-left">Scan this code from staff mobile app to open checklist.</p>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <QRCodeSVG value={`https://eventhub360.app/housekeeping/scan/${roomNumber}`} size={150} level="H" />
                </div>
                <p className="text-[10px] font-bold text-gray-400">ID: {roomNumber}-HK-GATEWAY</p>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};
