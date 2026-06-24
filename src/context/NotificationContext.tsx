import React, { createContext, useContext, useState, useEffect } from "react";
import { recentActivities } from "../data/mockData";
import { RecentActivity } from "../types";

export interface ToastAlert {
  id: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  duration?: number;
}

interface NotificationContextType {
  notifications: RecentActivity[];
  toasts: ToastAlert[];
  addToast: (message: string, type: ToastAlert["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  addSystemNotification: (message: string, status: RecentActivity["status"], type?: RecentActivity["type"]) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<RecentActivity[]>([]);
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // Seed with initial activities
  useEffect(() => {
    setNotifications(recentActivities);
  }, []);

  const addToast = (message: string, type: ToastAlert["type"], duration = 4000) => {
    const id = `TOAST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addSystemNotification = (
    message: string, 
    status: RecentActivity["status"], 
    type: RecentActivity["type"] = "system"
  ) => {
    const newNotif: RecentActivity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      time: "Just now",
      type,
      message,
      status
    };
    setNotifications((prev) => [newNotif, ...prev]);
    // Also push a toast alert
    addToast(message, status === "success" ? "success" : status === "warning" ? "warning" : status === "error" ? "error" : "info");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        addToast,
        removeToast,
        addSystemNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
