
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('AuthContext: No user, setting admin status to false');
      setIsAdmin(false);
      setAdminRole(null);
      return;
    }

    try {
      console.log('AuthContext: Checking admin status for user:', user.id, user.email);
      
      // Use a direct query to check admin status
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('AuthContext: Admin check result:', { data, error, userEmail: user.email });

      if (error) {
        console.warn('AuthContext: Admin status check failed:', error);
        setIsAdmin(false);
        setAdminRole(null);
      } else if (data) {
        console.log('AuthContext: User is admin with role:', data.role);
        setIsAdmin(true);
        setAdminRole(data.role);
      } else {
        console.log('AuthContext: User is not admin');
        setIsAdmin(false);
        setAdminRole(null);
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error during admin check:', error);
      setIsAdmin(false);
      setAdminRole(null);
    }
  };

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
          // Check admin status immediately after sign in
          setTimeout(() => {
            if (session?.user) {
              checkAdminStatus();
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthContext: User signed out');
          // Clear admin status on sign out
          setIsAdmin(false);
          setAdminRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('AuthContext: User changed, checking admin status for:', user.email);
      checkAdminStatus();
    } else {
      console.log('AuthContext: No user, clearing admin status');
      setIsAdmin(false);
      setAdminRole(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.warn('AuthContext: Authentication failed:', error.message);
    } else {
      console.log('AuthContext: Authentication successful for:', email);
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
      console.error('AuthContext: Error during sign out');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      adminRole,
      loading,
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
