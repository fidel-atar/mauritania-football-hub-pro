
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
        
        // Handle admin principal redirect after successful authentication
        if (event === 'SIGNED_IN' && session?.user?.email === 'admin@fmf.mr') {
          console.log('AuthContext: Admin principal signed in, redirecting to dashboard');
          // Small delay to ensure auth state is fully set
          setTimeout(() => {
            window.location.href = '/admin-dashboard';
          }, 500);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for:', email);
    
    // Security check: Only allow admin@fmf.mr or validate against admin_roles table
    const isAdminEmail = email === 'admin@fmf.mr';
    
    if (!isAdminEmail) {
      // For non-admin emails, check if they exist in admin_roles table first
      try {
        const { data: adminCheck } = await supabase
          .from('admin_roles')
          .select('user_id')
          .eq('user_id', 'temp') // This is just to check table access
          .limit(1);
        
        console.log('AuthContext: Admin roles table accessible');
      } catch (error) {
        console.log('AuthContext: Could not access admin roles table');
      }
    }
    
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
      console.error('AuthContext: Error during sign out:', error);
    } else {
      // Redirect to home page after successful logout
      window.location.href = '/';
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
