
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
      console.log('No user, setting admin status to false');
      setIsAdmin(false);
      setAdminRole(null);
      return;
    }

    try {
      console.log('Checking admin status for user:', user.id);
      
      // Use a direct query without RLS to avoid recursion
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user.id });

      if (error) {
        console.log('Error checking admin status:', error.message);
        // If there's an error with the function, try direct table access
        const { data: directData, error: directError } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (directError) {
          console.log('Direct query also failed:', directError.message);
          setIsAdmin(false);
          setAdminRole(null);
        } else if (directData) {
          console.log('Found admin role via direct query:', directData.role);
          setIsAdmin(true);
          setAdminRole(directData.role);
        } else {
          console.log('No admin role found via direct query');
          setIsAdmin(false);
          setAdminRole(null);
        }
      } else {
        console.log('Admin check result:', data);
        if (data) {
          // If the function returned true, get the role
          const { data: roleData, error: roleError } = await supabase
            .from('admin_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          if (roleError) {
            console.log('Error getting role:', roleError.message);
            setIsAdmin(true);
            setAdminRole('admin'); // Default role
          } else {
            setIsAdmin(true);
            setAdminRole(roleData.role);
          }
        } else {
          setIsAdmin(false);
          setAdminRole(null);
        }
      }
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      setIsAdmin(false);
      setAdminRole(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setAdminRole(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in error:', error.message);
    } else {
      console.log('Sign in successful');
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
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
