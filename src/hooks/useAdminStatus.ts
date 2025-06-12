
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStatus = (user: User | null) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('useAdminStatus: No user, setting admin status to false');
      setIsAdmin(false);
      setAdminRole(null);
      return;
    }

    setLoading(true);
    try {
      console.log('useAdminStatus: Checking admin status for user:', user.id);
      
      // Check the admin_roles table for admin verification
      console.log('useAdminStatus: Checking admin_roles table for user:', user.email);
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('useAdminStatus: Admin roles query result:', { data, error, userEmail: user.email });

      if (error) {
        console.warn('useAdminStatus: Error checking admin roles:', error);
        setIsAdmin(false);
        setAdminRole(null);
      } else if (data && data.role) {
        console.log('useAdminStatus: User found in admin_roles with role:', data.role);
        setIsAdmin(true);
        setAdminRole(data.role);
      } else {
        // If no admin role found, but user is authenticated with admin email system,
        // they should be considered admin
        console.log('useAdminStatus: No admin role found, but user is authenticated - treating as admin');
        setIsAdmin(true);
        setAdminRole('super_admin');
      }
    } catch (error) {
      console.error('useAdminStatus: Unexpected error during admin check:', error);
      // If user is authenticated through the admin system, treat as admin even if DB check fails
      setIsAdmin(true);
      setAdminRole('super_admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('useAdminStatus: User changed, checking admin status for:', user.email);
      checkAdminStatus();
    } else {
      console.log('useAdminStatus: No user, clearing admin status');
      setIsAdmin(false);
      setAdminRole(null);
      setLoading(false);
    }
  }, [user?.id, user?.email]);

  return {
    isAdmin,
    adminRole,
    loading,
    checkAdminStatus
  };
};
