import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ConciergeBell, 
  Sparkles, 
  Wrench, 
  Receipt, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  FolderLock,
  LogOut,
  ChevronDown,
  ChevronRight,
  Map,
  Building
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [maintenanceOpen, setMaintenanceOpen] = React.useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Front Desk", path: "/frontdesk", icon: <ConciergeBell className="w-5 h-5" /> },
    { name: "Housekeeping", path: "/housekeeping", icon: <Sparkles className="w-5 h-5" /> },
  ];

  const maintenanceSubItems = [
    { name: "Maintenance Queue", path: "/maintenance" },
    { name: "Incident Mgmt", path: "/maintenance/incidents" },
    { name: "Inventory Tracker", path: "/maintenance-inventory" },
    { name: "Work Orders List", path: "/maintenance-workorders" },
  ];

  const secondaryMenuItems = [
    { name: "Nearby Hotels", path: "/nearby-hotels", icon: <Map className="w-5 h-5 text-indigo-500" /> },
    { name: "Billing", path: "/billing", icon: <Receipt className="w-5 h-5" /> },
    { name: "Reservations", path: "/reservations", icon: <Calendar className="w-5 h-5" /> },
    { name: "Guests", path: "/guests", icon: <Users className="w-5 h-5" /> },
  ];

  const bottomMenuItems = [
    { name: "Hotel Master", path: "/hotel-master", icon: <Building className="w-5 h-5 text-emerald-500" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
    { name: "Support", path: "/support", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  if (user && (user.role === 'Super Admin' || user.role === 'Admin')) {
    bottomMenuItems.unshift({ name: "Staff Directory", path: "/staff-management", icon: <Users className="w-5 h-5 text-blue-500" /> });
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 fixed inset-y-0 left-0 bg-white dark:bg-[#1E293B] border-r border-customBorder-light dark:border-customBorder-dark flex flex-col justify-between z-30 font-sans select-none">
      <div>
        {/* Logo Section */}
        <div className="px-6 py-5 border-b border-customBorder-light dark:border-[#334155] flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight text-primary dark:text-[#F8FAFC]">
              EventHub360
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-secondary tracking-widest mt-0.5">
            Elite PMS Edition
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-5 space-y-1 overflow-y-auto max-h-[68vh]">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary/5 dark:bg-primary/15 text-primary border-l-4 border-primary pl-3"
                  : "text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-customText-light dark:hover:text-[#F8FAFC]"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Maintenance Accordion */}
          <div className="space-y-1">
            <button
              onClick={() => setMaintenanceOpen(!maintenanceOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                location.pathname.startsWith("/maintenance")
                  ? "bg-primary/5 dark:bg-primary/15 text-primary border-l-4 border-primary pl-3"
                  : "text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-customText-light dark:hover:text-[#F8FAFC]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Wrench className="w-5 h-5" />
                <span>Maintenance</span>
              </div>
              {maintenanceOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {maintenanceOpen && (
              <div className="pl-12 pr-2 py-1 space-y-1">
                {maintenanceSubItems.map((sub) => (
                  <Link
                    key={sub.name}
                    to={sub.path}
                    className={`block py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                      location.pathname === sub.path
                        ? "text-primary bg-primary/5 dark:bg-primary/10 font-bold"
                        : "text-customText-mutedLight dark:text-customText-mutedDark hover:text-customText-light dark:hover:text-[#F8FAFC]"
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {secondaryMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary/5 dark:bg-primary/15 text-primary border-l-4 border-primary pl-3"
                  : "text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-customText-light dark:hover:text-[#F8FAFC]"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar Footer - Settings, Support, Profile */}
      <div className="border-t border-customBorder-light dark:border-[#334155] p-4 space-y-3 bg-[#F8F9FB]/50 dark:bg-slate-800/20">
        <div className="space-y-1">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary/5 text-primary border-l-4 border-primary pl-3"
                  : "text-customText-mutedLight dark:text-customText-mutedDark hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-customText-light"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-customBorder-light dark:border-[#334155] shadow-sm">
            <div className="flex items-center space-x-2.5">
              <img
                src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-customText-light dark:text-customText-dark truncate leading-tight">
                  {`${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-[10px] text-customText-mutedLight dark:text-customText-mutedDark truncate">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
