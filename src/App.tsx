import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HotelProvider } from "./context/HotelContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Dashboards & Pages
import { DashboardHome } from "./pages/Dashboard/DashboardHome";
import { FrontDeskDashboard } from "./pages/FrontDesk/FrontDeskDashboard";
import { HousekeepingDashboard } from "./pages/Housekeeping/HousekeepingDashboard";
import { MaintenanceDashboard } from "./pages/Maintenance/MaintenanceDashboard";
import { MaintenanceInventory } from "./pages/Maintenance/MaintenanceInventory";
import { MaintenanceWorkorders } from "./pages/Maintenance/MaintenanceWorkorders";
import { BillingDashboard } from "./pages/Billing/BillingDashboard";
import { ReservationsDashboard } from "./pages/Reservations/ReservationsDashboard";
import { GuestsDashboard } from "./pages/Guests/GuestsDashboard";

// Reusable Placeholder Page for unimplemented sidebar routes
const PlaceholderPage: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-customText-light dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-customText-mutedLight dark:text-customText-mutedDark mt-1">
          {desc}
        </p>
      </div>

      <div className="bg-white dark:bg-customCard-dark border border-customBorder-light dark:border-[#334155] rounded-2xl p-12 text-center shadow-premium">
        <span className="text-4xl">⚙️</span>
        <h3 className="text-base font-bold text-customText-light dark:text-white mt-4">Module Under Configuration</h3>
        <p className="text-xs text-customText-mutedLight dark:text-customText-mutedDark mt-1 max-w-md mx-auto">
          The {title} suite is being optimized. You can navigate back to the Dashboard, Front Desk, Housekeeping, Maintenance or Billing modules in the sidebar.
        </p>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <HotelProvider>
            <DashboardLayout>
              <Routes>
                {/* Executive Overview */}
                <Route path="/" element={<DashboardHome />} />
                
                {/* Front Desk & CSV Import */}
                <Route path="/frontdesk" element={<FrontDeskDashboard />} />
                
                {/* Housekeeping Kanban */}
                <Route path="/housekeeping" element={<HousekeepingDashboard />} />
                
                {/* Maintenance Dashboard & Queue */}
                <Route path="/maintenance" element={<MaintenanceDashboard />} />
                
                {/* Inventory Timeline */}
                <Route path="/maintenance-inventory" element={<MaintenanceInventory />} />
                
                {/* Work Orders Ledger */}
                <Route path="/maintenance-workorders" element={<MaintenanceWorkorders />} />
                
                {/* Billing & Folio Postings */}
                <Route path="/billing" element={<BillingDashboard />} />

                {/* Skeletons/Placeholders */}
                <Route path="/reservations" element={<ReservationsDashboard />} />
                <Route path="/guests" element={<GuestsDashboard />} />

                <Route 
                  path="/settings" 
                  element={<PlaceholderPage title="Property Settings" desc="Configure room configuration classes, night audit rules, and housekeeping clean times." />} 
                />
                <Route 
                  path="/support" 
                  element={<PlaceholderPage title="PMS Concierge Support" desc="Request technical assistance, view knowledge base, or contact service desk." />} 
                />

                {/* Catch all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          </HotelProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
