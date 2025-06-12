
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Shield } from 'lucide-react';
import { usePhoneAuthFlow } from '@/hooks/usePhoneAuthFlow';
import PhoneNumberStep from './PhoneNumberStep';
import OTPVerificationStep from './OTPVerificationStep';
import AuthSuccessStep from './AuthSuccessStep';

interface PhoneAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user';
}

const PhoneAuth = ({ onAuthSuccess, userType = 'user' }: PhoneAuthProps) => {
  const {
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
  } = usePhoneAuthFlow(onAuthSuccess);

  const isAdminLogin = userType === 'admin';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, setResendTimer]);

  if (step === 'success') {
    return <AuthSuccessStep />;
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
            <PhoneNumberStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSubmit={handlePhoneSubmit}
              loading={loading}
              isAdminLogin={isAdminLogin}
            />
          ) : (
            <OTPVerificationStep
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              onSubmit={handleOTPSubmit}
              onBackToPhone={handleBackToPhone}
              onResendOTP={handleResendOTP}
              loading={loading}
              resendTimer={resendTimer}
              isAdminLogin={isAdminLogin}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneAuth;
