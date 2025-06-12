
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminEmailAuthFlow = (onAuthSuccess?: () => void) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, code: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('useAdminEmailAuthFlow: Attempting admin login with email:', email);
      
      // Check if email exists in admin_roles table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_roles')
        .select('user_id, role')
        .eq('user_id', email)
        .single();

      if (adminError || !adminData) {
        console.error('useAdminEmailAuthFlow: Admin not found:', adminError);
        setError('Email ou code d\'accès invalide');
        return false;
      }

      // Check fixed code
      if (code !== '123456') {
        console.error('useAdminEmailAuthFlow: Invalid code');
        setError('Code d\'accès invalide');
        return false;
      }

      console.log('useAdminEmailAuthFlow: Admin login successful');
      onAuthSuccess?.();
      return true;

    } catch (error: any) {
      console.error('useAdminEmailAuthFlow: Login error:', error);
      setError('Erreur lors de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    code,
    setCode,
    loading,
    error,
    handleLogin
  };
};
