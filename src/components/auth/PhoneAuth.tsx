
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useAdminEmailAuthFlow } from '@/hooks/useAdminEmailAuthFlow';
import AdminEmailStep from './AdminEmailStep';
import AdminCodeStep from './AdminCodeStep';
import AuthSuccessStep from './AuthSuccessStep';

interface PhoneAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user';
}

const PhoneAuth = ({ onAuthSuccess, userType = 'admin' }: PhoneAuthProps) => {
  const {
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
  } = useAdminEmailAuthFlow(onAuthSuccess);

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
          <div className="mx-auto w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 'email' 
              ? 'Connexion Super Admin' 
              : 'Vérification du Code'
            }
          </CardTitle>
          <p className="text-gray-600">
            {step === 'email' 
              ? 'Entrez votre email administrateur'
              : `Code envoyé à ${email}`
            }
          </p>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'email' ? (
            <AdminEmailStep
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
              loading={loading}
            />
          ) : (
            <AdminCodeStep
              code={code}
              setCode={setCode}
              onSubmit={handleCodeSubmit}
              onBackToEmail={handleBackToEmail}
              onResendCode={handleResendCode}
              loading={loading}
              resendTimer={resendTimer}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneAuth;
