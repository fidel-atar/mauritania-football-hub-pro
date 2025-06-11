
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
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
        } else {
          console.log('AuthContext: Initial session:', session?.user?.email);
          if (mounted) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('AuthContext: Unexpected error during session initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('AuthContext: Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthContext: User signed in:', session.user.email);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
    console.log('AuthContext: Attempting sign up for:', email);
    
    // Set up email confirmation redirect
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          email_confirm: true
        }
      }
    });
    
    if (error) {
      console.warn('AuthContext: Registration failed:', error.message);
    } else {
      console.log('AuthContext: Registration successful for:', email, '- Email verification sent');
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

  const contextValue: AuthContextType = {
    user,
    isAdmin,
    adminRole,
    loading: loading || adminLoading,
    signIn,
    signUp,
    signOut,
    checkAdminStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
