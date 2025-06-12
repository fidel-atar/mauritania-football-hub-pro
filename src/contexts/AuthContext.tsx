
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAdmin, adminRole, loading: adminLoading, checkAdminStatus } = useAdminStatus(user);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session check:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // If user just signed in, check admin status after a short delay
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            console.log('AuthProvider: Triggering admin status check after sign in');
            await checkAdminStatus();
          }, 1000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    phoneNumber: null, // No phone auth anymore
    isVerified: !!user, // User is verified if authenticated
    isAdmin,
    adminRole,
    loading: loading || adminLoading,
    signOut,
    checkAdminStatus
  };

  console.log('AuthProvider: Current state - user:', user?.email, 'isAdmin:', isAdmin, 'adminRole:', adminRole);

  return (
    <AuthContext.Provider value={value}>
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
