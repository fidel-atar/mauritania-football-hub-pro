
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
      console.log('useAdminStatus: Checking admin status for user:', user.id, user.email);
      
      // Check if user is admin principal (special case)
      if (user.email === 'admin@fmf.mr') {
        console.log('useAdminStatus: Admin principal detected, setting admin to true');
        setIsAdmin(true);
        setAdminRole('super_admin');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('useAdminStatus: Admin check result:', { data, error, userEmail: user.email });

      if (error) {
        console.warn('useAdminStatus: Admin status check failed:', error);
        setIsAdmin(false);
        setAdminRole(null);
      } else if (data) {
        console.log('useAdminStatus: User is admin with role:', data.role);
        setIsAdmin(true);
        setAdminRole(data.role);
      } else {
        console.log('useAdminStatus: User is not admin');
        setIsAdmin(false);
        setAdminRole(null);
      }
    } catch (error) {
      console.error('useAdminStatus: Unexpected error during admin check:', error);
      setIsAdmin(false);
      setAdminRole(null);
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
