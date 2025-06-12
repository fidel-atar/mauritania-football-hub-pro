
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validatePhoneNumber } from '@/utils/inputValidation';
import OTPInput from './OTPInput';

interface PhoneAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user';
}

const PhoneAuth = ({ onAuthSuccess, userType = 'user' }: PhoneAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const isAdminLogin = userType === 'admin';

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (phone: string) => {
    try {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      
      const { error } = await supabase
        .from('phone_auth')
        .upsert({
          phone_number: phone,
          otp_code: otp,
          otp_expires_at: expiresAt.toISOString(),
          is_verified: false
        });

      if (error) {
        console.error('Error storing OTP:', error);
        throw error;
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Sign in with Supabase Auth using phone as email
      const emailFromPhone = `${phoneNumber.replace(/\+/g, '')}@phone.local`;
      
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

        // Profile will be created automatically by the trigger
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

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 md:px-4">
        <Card className="w-full max-w-sm md:max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Connexion réussie !
            </CardTitle>
            <p className="text-gray-600">
              Vous allez être redirigé automatiquement...
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 md:px-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-12 h-12 ${isAdminLogin ? 'bg-red-600' : 'bg-blue-600'} rounded-full flex items-center justify-center mb-4`}>
            {isAdminLogin ? <Shield className="w-6 h-6 text-white" /> : <Phone className="w-6 h-6 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 'phone' 
              ? (isAdminLogin ? 'Connexion Admin' : 'Connexion') 
              : 'Vérification OTP'
            }
          </CardTitle>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Entrez votre numéro de téléphone mauritanien'
              : `Code envoyé au ${phoneNumber}`
            }
          </p>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+222 XX XX XX XX"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Format mauritanien: +222XXXXXXXX
                </p>
              </div>
              
              <Button 
                type="submit" 
                className={`w-full ${isAdminLogin ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Envoyer le code OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Code de vérification</Label>
                <OTPInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Code à 6 chiffres envoyé par SMS
                </p>
              </div>
              
              <Button 
                type="submit" 
                className={`w-full ${isAdminLogin ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={loading}
              >
                {loading ? 'Vérification...' : 'Vérifier le code'}
              </Button>

              <div className="flex justify-between items-center text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToPhone}
                  disabled={loading}
                  className="text-xs"
                >
                  ← Changer le numéro
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={loading || resendTimer > 0}
                  className="text-xs"
                >
                  {resendTimer > 0 ? `Renvoyer (${resendTimer}s)` : 'Renvoyer'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneAuth;
