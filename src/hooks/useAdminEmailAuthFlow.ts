
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminEmailAuthFlow = (onAuthSuccess?: () => void) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendCode = async (adminEmail: string) => {
    try {
      const authCode = generateCode();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      console.log(`[DEV] Admin code for ${adminEmail}: ${authCode}`);
      
      // Store admin code in phone_auth table temporarily
      const { data: updateData, error: updateError } = await supabase
        .from('phone_auth')
        .update({
          otp_code: authCode,
          otp_expires_at: expiresAt.toISOString(),
          is_verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('phone_number', adminEmail)
        .select();

      // If no record was updated, insert a new one
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('phone_auth')
          .insert({
            phone_number: adminEmail, // Using email as identifier
            otp_code: authCode,
            otp_expires_at: expiresAt.toISOString(),
            is_verified: false
          });

        if (insertError) {
          console.error('Error inserting admin code:', insertError);
          throw insertError;
        }
      } else if (updateError) {
        console.error('Error updating admin code:', updateError);
        throw updateError;
      }

      toast.success(`Code admin envoyé à ${adminEmail}`, {
        description: `[Développement] Code: ${authCode}`,
        duration: 10000,
      });
      setResendTimer(60);
      
    } catch (error) {
      console.error('Error sending admin code:', error);
      throw error;
    }
  };

  const handleEmailSubmit = async () => {
    setError('');

    if (!email.trim()) {
      setError('Veuillez saisir votre email administrateur');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      return;
    }

    setLoading(true);
    try {
      await sendCode(email);
      setStep('code');
    } catch (error) {
      console.error('Email submit error:', error);
      setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    setError('');

    if (!code.trim() || code.length !== 6) {
      setError('Veuillez saisir le code à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      // Verify code using the same OTP verification function
      const { data, error } = await supabase.rpc('verify_otp', {
        p_phone_number: email, // Using email as identifier
        p_otp_code: code
      });

      if (error) {
        console.error('Code verification error:', error);
        throw error;
      }

      if (!data) {
        setError('Code invalide ou expiré');
        return;
      }

      // Sign in the admin user with email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: email // Using email as password for admin
      });

      if (authError && authError.message.includes('Invalid login credentials')) {
        // Create admin account if it doesn't exist
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: email,
          options: {
            data: {
              full_name: 'Super Admin',
              is_phone_verified: true,
              admin_email: email
            }
          }
        });

        if (signUpError) {
          console.error('Admin sign up error:', signUpError);
          throw signUpError;
        }

        console.log('New super admin created');
      } else if (authError) {
        console.error('Admin auth error:', authError);
        throw authError;
      }

      setStep('success');
      
      setTimeout(() => {
        toast.success('Connexion super admin réussie', {
          description: 'Accès administrateur accordé'
        });
        
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('Error verifying admin code:', error);
      setError(error.message || 'Erreur lors de la vérification du code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      await sendCode(email);
      toast.success('Code admin renvoyé');
    } catch (error) {
      console.error('Resend error:', error);
      setError('Erreur lors du renvoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
  };

  return {
    email,
    setEmail,
    code,
    setCode,
    step,
    loading,
    error,
    resendTimer,
    setResendTimer,
    handleEmailSubmit,
    handleCodeSubmit,
    handleResendCode,
    handleBackToEmail
  };
};
