
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
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
      console.log('AuthContext: Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log security events (without sensitive data)
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthContext: User authentication successful');
          
          // Check if this is the admin principal and redirect immediately
          if (session.user.email === 'admin@fmf.mr') {
            console.log('AuthContext: Admin principal detected, redirecting to admin dashboard');
            // Use a more immediate redirect for admin principal
            setTimeout(() => {
              console.log('AuthContext: Executing redirect to admin dashboard');
              window.location.href = '/admin-dashboard';
            }, 100);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthContext: User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.warn('AuthContext: Authentication failed:', error.message);
    } else {
      console.log('AuthContext: Authentication successful for:', email);
      
      // For admin principal, trigger immediate redirect after successful login
      if (email === 'admin@fmf.mr') {
        console.log('AuthContext: Admin principal login, will redirect shortly');
      }
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.warn('AuthContext: Registration failed');
    }
    return { error };
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthContext: Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      adminRole,
      loading: loading || adminLoading,
      signIn,
      signUp,
      signOut,
      checkAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
