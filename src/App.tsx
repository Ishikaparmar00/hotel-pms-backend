import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HotelProvider } from "./context/HotelContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DashboardLayout } from "./layouts/DashboardLayout";

import { AuthLayout } from "./layouts/AuthLayout";

// Auth Pages
import { Welcome } from "./pages/Auth/Welcome";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { VerifyOTP } from "./pages/Auth/VerifyOTP";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import { AccountCreated } from "./pages/Auth/AccountCreated";

// Dashboards & Pages
import { DashboardHome } from "./pages/Dashboard/DashboardHome";
import { FrontDeskDashboard } from "./pages/FrontDesk/FrontDeskDashboard";
import { HousekeepingDashboard } from "./pages/Housekeeping/HousekeepingDashboard";
import { MaintenanceDashboard } from "./pages/Maintenance/MaintenanceDashboard";
import { MaintenanceInventory } from "./pages/Maintenance/MaintenanceInventory";
import { MaintenanceWorkorders } from "./pages/Maintenance/MaintenanceWorkorders";
import { IncidentDashboard } from "./pages/Maintenance/IncidentManagement/IncidentDashboard";

import { BillingDashboard } from "./pages/Billing/BillingDashboard";
import { ReservationsDashboard } from "./pages/Reservations/ReservationsDashboard";
import { GuestsDashboard } from "./pages/Guests/GuestsDashboard";
import { NearbyHotels } from "./pages/NearbyHotels";
import { HotelMasterDashboard } from "./pages/HotelMaster/HotelMasterDashboard";
import { HotelForm } from "./pages/HotelMaster/HotelForm";
import { HotelDetails } from "./pages/HotelMaster/HotelDetails";
import { HotelPublicDetails } from "./pages/HotelPublicDetails";
import { HotelDiscoveryProvider } from "./context/HotelDiscoveryContext";
import { StaffDirectory } from "./pages/StaffManagement/StaffDirectory";

// Reusable Placeholder Page for unimplemented sidebar routes
const PlaceholderPage: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-lg">
        <span className="text-4xl">⚙️</span>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mt-4">Module Under Configuration</h3>
      </div>
    </div>
  );
};

// Protect Routes logic
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center font-bold text-gray-500 text-xl">Loading...</div>;
  return isAuthenticated ? <DashboardLayout><Outlet/></DashboardLayout> : <Navigate to="/auth/welcome" replace />;
};

const RoleRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />;
  }
  return <Navigate to="/" replace />; // Unauthorized logic
};

// Ensure users who are already logged in cannot hit /login
const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <HotelProvider>
            <HotelDiscoveryProvider>
              <Routes>
                
                {/* Public Auth Routes */}
                <Route element={<GuestRoute />}>
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="verify-otp" element={<VerifyOTP />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="account-created" element={<AccountCreated />} />
                    <Route path="" element={<Navigate to="/auth/welcome" replace />} />
                  </Route>
                </Route>

                {/* Protected App Routes */}
                <Route element={<ProtectedRoute />}>
                  
                  {/* Global Access */}
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/settings" element={<PlaceholderPage title="Property Settings" desc="Configure rules." />} />
                  <Route path="/support" element={<PlaceholderPage title="PMS Support" desc="Request technical assistance." />} />

                  {/* RBAC Routes */}
                  <Route element={<RoleRoute allowedRoles={['Super Admin', 'Admin', 'Hotel Owner']} />}>
                    <Route path="/staff-management" element={<StaffDirectory />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={['Super Admin', 'Admin', 'Hotel Owner', 'Front Desk', 'General Manager']} />}>
                    <Route path="/frontdesk" element={<FrontDeskDashboard />} />
                    <Route path="/reservations" element={<ReservationsDashboard />} />
                    <Route path="/guests" element={<GuestsDashboard />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={['Super Admin', 'Admin', 'Hotel Owner', 'Housekeeping', 'General Manager']} />}>
                    <Route path="/housekeeping" element={<HousekeepingDashboard />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={['Super Admin', 'Admin', 'Hotel Owner', 'Maintenance', 'General Manager']} />}>
                    <Route path="/maintenance" element={<MaintenanceDashboard />} />
                    <Route path="/maintenance-inventory" element={<MaintenanceInventory />} />
                    <Route path="/maintenance-workorders" element={<MaintenanceWorkorders />} />
                    <Route path="/maintenance/incidents" element={<IncidentDashboard />} />

                  </Route>

                  <Route element={<RoleRoute allowedRoles={['Super Admin', 'Admin', 'Hotel Owner', 'Finance', 'General Manager']} />}>
                    <Route path="/billing" element={<BillingDashboard />} />
                  </Route>

                  {/* Global Tools */}
                  <Route path="/nearby-hotels" element={<NearbyHotels />} />
                  <Route path="/discovery" element={<NearbyHotels />} />
                  <Route path="/hotel/:id" element={<HotelPublicDetails />} />
                  <Route path="/hotel-master" element={<HotelMasterDashboard />} />
                  <Route path="/hotel-master/add" element={<HotelForm />} />
                  <Route path="/hotel-master/:id" element={<HotelDetails />} />

                </Route>

                {/* Catch all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </HotelDiscoveryProvider>
          </HotelProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
