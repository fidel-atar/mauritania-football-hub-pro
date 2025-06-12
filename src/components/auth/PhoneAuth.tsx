
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Shield } from 'lucide-react';
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
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
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

      if (error) throw error;

      // In production, you would send SMS here
      toast.success(`Code OTP envoyé au ${phone}. Code de développement: ${otp}`);
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
      setError('Erreur lors de l\'envoi du code OTP');
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
      const { data, error } = await supabase.rpc('verify_otp', {
        p_phone_number: phoneNumber,
        p_otp_code: otpCode
      });

      if (error) throw error;

      if (!data) {
        setError('Code OTP invalide ou expiré');
        return;
      }

      // Create or update user profile
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          phone_number: phoneNumber,
          is_phone_verified: true,
          email: `${phoneNumber.replace('+', '')}@phone.local`,
          full_name: phoneNumber
        });

      if (profileError) throw profileError;

      toast.success('Connexion réussie');
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Erreur lors de la vérification du code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      await sendOTP(phoneNumber);
    } catch (error) {
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
              ? 'Entrez votre numéro de téléphone'
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
                  Format: +222XXXXXXXX (numéro mauritanien)
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
                >
                  ← Changer le numéro
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={loading || resendTimer > 0}
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
