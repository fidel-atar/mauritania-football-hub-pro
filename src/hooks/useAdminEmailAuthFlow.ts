
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminEmailAuthFlow = (onAuthSuccess?: () => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('useAdminEmailAuthFlow: Attempting admin login with email:', email);
      
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('useAdminEmailAuthFlow: Sign in failed:', signInError);
        setError('Email ou mot de passe invalide');
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
    password,
    setPassword,
    loading,
    error,
    handleLogin
  };
};
