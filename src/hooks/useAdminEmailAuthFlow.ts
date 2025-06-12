
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
      
      // Verify the OTP code
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (verifyError) {
        console.error('useAdminEmailAuthFlow: OTP verification failed:', verifyError);
        setError('Code de vérification invalide ou expiré');
        return false;
      }

      if (data.user) {
        console.log('useAdminEmailAuthFlow: Admin login successful');
        onAuthSuccess?.();
        return true;
      }

      return false;
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
