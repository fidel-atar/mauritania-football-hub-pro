
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
      
      // First check the admin_roles table
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
        return;
      }

      // If no admin role found, check if user has admin phone number in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('phone_number, is_phone_verified')
        .eq('id', user.id)
        .maybeSingle();

      console.log('useAdminStatus: Profile data:', { profileData, profileError });

      // Check if this is one of the admin phone numbers
      const adminPhones = ['+22242740882', '+22234330002'];
      if (profileData && profileData.phone_number && adminPhones.includes(profileData.phone_number)) {
        console.log('useAdminStatus: User has admin phone number, setting as admin');
        setIsAdmin(true);
        setAdminRole('super_admin');
        
        // Auto-assign admin role in database if missing
        const { error: insertError } = await supabase
          .from('admin_roles')
          .insert({ user_id: user.id, role: 'super_admin' })
          .on('conflict', (conflict) => conflict.ignore());
          
        if (insertError) {
          console.warn('Failed to auto-assign admin role:', insertError);
        }
        return;
      }

      // If authenticated but no admin privileges found
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
