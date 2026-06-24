import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "General Manager" | "Front Office Manager" | "Executive Housekeeper" | "Chief Engineer";
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: User["role"]) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: "USR-001",
  name: "Alexander Vance",
  email: "a.vance@eventhub360.com",
  role: "General Manager",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate reading session
    const timer = setTimeout(() => {
      setUser(DEFAULT_USER);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, role: User["role"]) => {
    setIsLoading(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    const name = email.split("@")[0].split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") || "Staff Member";
    setUser({
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    });
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
