
import React, { createContext, useContext } from 'react';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';

interface AuthContextType {
  user: any;
  phoneNumber: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  adminRole: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authData = usePhoneAuth();

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth hook called outside of AuthProvider context');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
