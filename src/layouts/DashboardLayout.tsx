import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Modal } from "../components/ui/Modal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useHotel } from "../context/HotelContext";
import { UserCheck, ShieldAlert, ArrowRight, Home } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { reservations, checkInReservation } = useHotel();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState("");
  const [incidentalAuthorized, setIncidentalAuthorized] = useState(false);
  const [roomAssigned, setRoomAssigned] = useState("402"); // default

  // Get only "Confirmed" reservations to display in the check-in list
  const pendingCheckins = reservations.filter(r => r.status === "Confirmed");
  const selectedRes = reservations.find(r => r.id === selectedResId);

  const handleCompleteCheckIn = () => {
    if (!selectedResId) return;
    checkInReservation(selectedResId);
    
    // Reset modal states
    setIsCheckInOpen(false);
    setSelectedResId("");
    setIncidentalAuthorized(false);
  };

  return (
    <div className="min-h-screen bg-customBg-light dark:bg-customBg-dark flex font-sans">
      {/* Fixed Sidebar navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Sticky Navbar */}
        <Navbar onCheckInClick={() => setIsCheckInOpen(true)} />

        {/* Dynamic page content scroll wrapper */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Registration & Check-in Modal */}
      <Modal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        title="EventHub360 - Guest Registration Desk"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel - Select Guest */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark">
              Select Incoming Reservation
            </h4>
            
            {pendingCheckins.length > 0 ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-customText-light dark:text-customText-dark">
                  Guest Name / Res ID
                </label>
                <select
                  value={selectedResId}
                  onChange={(e) => {
                    setSelectedResId(e.target.value);
                    setIncidentalAuthorized(false);
                  }}
                  className="w-full text-xs bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-customText-dark focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Choose Guest --</option>
                  {pendingCheckins.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.guestName} ({res.id}) - Room {res.roomNumber}
                    </option>
                  ))}
                </select>

                {selectedRes && (
                  <div className="p-4 bg-[#F8F9FB] dark:bg-slate-800 rounded-xl border border-customBorder-light dark:border-[#334155] space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-customText-mutedLight">Room Type:</span>
                      <span className="font-bold text-customText-light dark:text-white">{selectedRes.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-customText-mutedLight">Arrival Date:</span>
                      <span className="font-bold text-customText-light dark:text-white">{selectedRes.arrivalDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-customText-mutedLight">Departure Date:</span>
                      <span className="font-bold text-customText-light dark:text-white">{selectedRes.departureDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-customText-mutedLight">Nightly Rate:</span>
                      <span className="font-bold text-primary dark:text-[#FB923C]">${selectedRes.rate}/night</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-customText-mutedLight dark:text-customText-mutedDark">
                No pending confirmed arrivals for today.
              </div>
            )}
          </div>

          {/* Right Panel - Verification & Check In */}
          <div className="border-t md:border-t-0 md:border-l border-customBorder-light dark:border-[#334155] pt-6 md:pt-0 md:pl-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-customText-mutedLight dark:text-customText-mutedDark flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                Arrival Verification
              </h4>

              {selectedRes ? (
                <div className="space-y-4 text-xs">
                  {/* Identity Check */}
                  <div className="flex items-center justify-between p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                    <div className="flex flex-col">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">ID Verification</span>
                      <span className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">Passport verified on file</span>
                    </div>
                    <StatusBadge status="Completed" />
                  </div>

                  {/* Incidental deposit */}
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl">
                    <div className="flex flex-col">
                      <span className="font-bold text-customText-light dark:text-white">Incidental Deposit</span>
                      <span className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark">Hold $150.00 credit</span>
                    </div>
                    <button
                      onClick={() => setIncidentalAuthorized(true)}
                      disabled={incidentalAuthorized}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        incidentalAuthorized 
                          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" 
                          : "bg-primary text-white hover:bg-primary-hover active:scale-95"
                      }`}
                    >
                      {incidentalAuthorized ? "Authorized" : "Authorize"}
                    </button>
                  </div>

                  {/* Room Assignment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-customText-light dark:text-customText-dark flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-primary" /> Assign Room
                    </label>
                    <select
                      value={roomAssigned}
                      onChange={(e) => setRoomAssigned(e.target.value)}
                      className="w-full text-xs bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl p-2.5 text-customText-light dark:text-customText-dark focus:outline-none"
                    >
                      <option value="402">Room 402 (Ready - King Suite)</option>
                      <option value="102">Room 102 (Ready - Standard)</option>
                      <option value="108">Room 108 (Ready - Standard)</option>
                      <option value="301">Room 301 (Ready - Deluxe)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-amber-700 dark:text-amber-500">
                  <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <p>Please select a guest arrival reservation from the left panel to execute identity verification and room key card check-in.</p>
                </div>
              )}
            </div>

            {selectedRes && (
              <button
                onClick={handleCompleteCheckIn}
                disabled={!incidentalAuthorized}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-dark text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
              >
                <span>Complete Check-in</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
