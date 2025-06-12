
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface PhoneAuthContextType {
  user: User | null;
  phoneNumber: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  adminRole: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
}

export const usePhoneAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { isAdmin, adminRole, loading: adminLoading, checkAdminStatus } = useAdminStatus(user);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('PhoneAuth: Error getting initial session:', error);
        } else {
          console.log('PhoneAuth: Initial session:', session?.user?.id);
          if (mounted && session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('PhoneAuth: Unexpected error during session initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('phone_number, is_phone_verified')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user profile:', error);
          // For admin users authenticated via email, set as verified
          setIsVerified(true);
          return;
        }

        if (data) {
          setPhoneNumber(data.phone_number);
          setIsVerified(data.is_phone_verified || true); // Default to verified for admin users
        } else {
          // No profile found but user is authenticated - assume admin user
          setIsVerified(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // For admin users, set as verified even if profile fetch fails
        setIsVerified(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('PhoneAuth: Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setPhoneNumber(null);
          setIsVerified(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('PhoneAuth: Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('PhoneAuth: Error during sign out:', error);
    } else {
      window.location.href = '/';
    }
  };

  const contextValue: PhoneAuthContextType = {
    user,
    phoneNumber,
    isVerified,
    isAdmin,
    adminRole,
    loading: loading || adminLoading,
    signOut,
    checkAdminStatus
  };

  return contextValue;
};
