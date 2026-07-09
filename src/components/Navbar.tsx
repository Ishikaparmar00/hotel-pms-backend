import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  Bell, 
  Grid, 
  Sun, 
  Moon, 
  Printer, 
  History,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  SlidersHorizontal
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

interface NavbarProps {
  onCheckInClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCheckInClick }) => {
  const { user } = useAuth();
  const { notifications, toasts, removeToast } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 right-0 left-0 bg-white/85 dark:bg-[#1E293B]/85 backdrop-blur-md border-b border-customBorder-light dark:border-customBorder-dark h-16 flex items-center justify-between px-8 z-20 font-sans">
      
      {/* Search Bar section */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-customText-mutedLight dark:text-customText-mutedDark" />
          <input
            type="text"
            placeholder="Search reservations, guests or room status..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8F9FB] dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-customText-light dark:text-customText-dark transition-all duration-200"
          />
        </div>
      </div>

      {/* Center Nav Link options matching screenshot */}
      <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-customText-mutedLight dark:text-customText-mutedDark uppercase tracking-wider ml-6">
        <Link to="/reservations" className={`${location.pathname.includes('/reservations') ? 'text-primary dark:text-[#FB923C] border-b-2 border-primary dark:border-[#FB923C]' : 'hover:text-customText-light dark:hover:text-white transition'} pb-5 pt-5 cursor-pointer`}>All Bookings</Link>
        <Link to="/maintenance-workorders" className={`${location.pathname.includes('/maintenance-workorders') ? 'text-primary dark:text-[#FB923C] border-b-2 border-primary dark:border-[#FB923C]' : 'hover:text-customText-light dark:hover:text-white transition'} pb-5 pt-5 cursor-pointer`}>Pending Approvals</Link>
        <Link to="/hotel-master" className={`${location.pathname.includes('/hotel-master') ? 'text-primary dark:text-[#FB923C] border-b-2 border-primary dark:border-[#FB923C]' : 'hover:text-customText-light dark:hover:text-white transition'} pb-5 pt-5 cursor-pointer`}>Active Room Blocks</Link>
        <Link to="/housekeeping" className={`${location.pathname.includes('/housekeeping') ? 'text-primary dark:text-[#FB923C] border-b-2 border-primary dark:border-[#FB923C]' : 'hover:text-customText-light dark:hover:text-white transition'} pb-5 pt-5 cursor-pointer`}>Housekeeping Logs</Link>
      </div>

      {/* Right Control Panels */}
      <div className="flex items-center space-x-4">
        {/* Print report icon */}
        <button 
          className="p-2 text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          title="Print Folio/Report"
          onClick={() => window.print()}
        >
          <Printer className="w-5 h-5" />
        </button>

        {/* Dark/Light mode button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Real-time notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all relative"
            title="Notifications Log"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary dark:bg-secondary rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse-soft"></span>
            )}
          </button>

          {/* Notifications Dropdown Bubble */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1E293B] border border-customBorder-light dark:border-customBorder-dark rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-96">
              <div className="px-4 py-3 border-b border-customBorder-light dark:border-customBorder-dark bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-customText-light dark:text-customText-dark">PMS Live Alerts</span>
                <span className="text-[10px] text-primary dark:text-[#FB923C] font-semibold">{notifications.length} Active</span>
              </div>
              
              <div className="overflow-y-auto divide-y divide-customBorder-light dark:divide-customBorder-dark flex-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition flex items-start space-x-3 text-xs">
                      <div className="mt-0.5">{getStatusIcon(n.status)}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-customText-light dark:text-[#F8FAFC]">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-customText-mutedLight dark:text-customText-mutedDark">
                    No system alerts.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Check In Action button (Gradient) */}
        <button
          onClick={onCheckInClick}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 transform active:scale-95"
        >
          Check In
        </button>
      </div>

      {/* Floating Toast Notification Box (bottom right) */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50 pointer-events-none max-w-md w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-center justify-between space-x-4 border text-xs font-semibold animate-slide-in transition-all duration-300 ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-800"
                : toast.type === "warning"
                ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-800"
                : toast.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-800"
                : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/90 dark:text-blue-300 dark:border-blue-800"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {getStatusIcon(toast.type)}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </header>
  );
};
