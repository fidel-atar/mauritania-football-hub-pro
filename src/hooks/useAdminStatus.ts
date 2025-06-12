
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
      
      // Check the admin_roles table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('useAdminStatus: Admin roles query result:', { adminData, adminError });

      if (adminData && adminData.role) {
        console.log('useAdminStatus: User found in admin_roles with role:', adminData.role);
        setIsAdmin(true);
        setAdminRole(adminData.role);
        
        // Force a small delay to ensure UI updates
        setTimeout(() => {
          console.log('useAdminStatus: Admin status updated - isAdmin:', true, 'role:', adminData.role);
        }, 100);
        return;
      }

      // If no admin role found, user is not admin
      console.log('useAdminStatus: User authenticated but not admin');
      setIsAdmin(false);
      setAdminRole(null);

    } catch (error) {
      console.error('useAdminStatus: Error during admin check:', error);
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
