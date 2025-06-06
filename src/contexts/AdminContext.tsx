
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminPassword: string | null;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Simple admin password - in production, this should be more secure
const ADMIN_PASSWORD = "admin123";

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is already logged in (stored in localStorage)
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword(storedAuth);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword(password);
      localStorage.setItem('adminAuth', password);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminPassword(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminPassword, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
