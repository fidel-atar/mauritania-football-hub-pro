
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validatePhoneNumber } from '@/utils/inputValidation';

export const usePhoneAuthFlow = (onAuthSuccess?: () => void) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (phone: string) => {
    try {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      
      // First, try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('phone_auth')
        .update({
          otp_code: otp,
          otp_expires_at: expiresAt.toISOString(),
          is_verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('phone_number', phone)
        .select();

      // If no record was updated, insert a new one
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('phone_auth')
          .insert({
            phone_number: phone,
            otp_code: otp,
            otp_expires_at: expiresAt.toISOString(),
            is_verified: false
          });

        if (insertError) {
          console.error('Error inserting OTP:', insertError);
          throw insertError;
        }
      } else if (updateError) {
        console.error('Error updating OTP:', updateError);
        throw updateError;
      }

      toast.success(`Code OTP envoyé au ${phone}`, {
        description: `[Développement] Code: ${otp}`,
        duration: 10000,
      });
      setResendTimer(60);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const handlePhoneSubmit = async () => {
    setError('');

    if (!phoneNumber.trim()) {
      setError('Veuillez saisir votre numéro de téléphone');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Numéro de téléphone invalide. Format: +222XXXXXXXX');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      setStep('otp');
    } catch (error) {
      console.error('Phone submit error:', error);
      setError('Erreur lors de l\'envoi du code OTP. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    setError('');

    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('Veuillez saisir le code OTP à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP
      const { data, error } = await supabase.rpc('verify_otp', {
        p_phone_number: phoneNumber,
        p_otp_code: otpCode
      });

      if (error) {
        console.error('OTP verification error:', error);
        throw error;
      }

      if (!data) {
        setError('Code OTP invalide ou expiré');
        return;
      }

      // Create a valid email format for Supabase Auth using gmail.com domain
      const emailFromPhone = `phone${phoneNumber.replace(/\+/g, '').replace(/\s/g, '')}@gmail.com`;
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailFromPhone,
        password: phoneNumber
      });

      if (authError && authError.message.includes('Invalid login credentials')) {
        // User doesn't exist, create account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: emailFromPhone,
          password: phoneNumber,
          options: {
            data: {
              phone_number: phoneNumber,
              full_name: phoneNumber,
              is_phone_verified: true
            }
          }
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw signUpError;
        }

        console.log('New user created with phone authentication');
      } else if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      } else if (authData.user) {
        // Update existing profile with phone verification
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone_number: phoneNumber,
            is_phone_verified: true
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      setStep('success');
      
      setTimeout(() => {
        toast.success('Connexion réussie', {
          description: 'Vous êtes maintenant connecté'
        });
        
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Erreur lors de la vérification du code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      await sendOTP(phoneNumber);
      toast.success('Code OTP renvoyé');
    } catch (error) {
      console.error('Resend error:', error);
      setError('Erreur lors du renvoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpCode('');
    setError('');
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otpCode,
    setOtpCode,
    step,
    loading,
    error,
    resendTimer,
    setResendTimer,
    handlePhoneSubmit,
    handleOTPSubmit,
    handleResendOTP,
    handleBackToPhone
  };
};
