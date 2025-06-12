
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import OTPInput from './OTPInput';

interface OTPVerificationStepProps {
  otpCode: string;
  setOtpCode: (value: string) => void;
  onSubmit: () => void;
  onBackToPhone: () => void;
  onResendOTP: () => void;
  loading: boolean;
  resendTimer: number;
  isAdminLogin: boolean;
}

const OTPVerificationStep = ({
  otpCode,
  setOtpCode,
  onSubmit,
  onBackToPhone,
  onResendOTP,
  loading,
  resendTimer,
  isAdminLogin
}: OTPVerificationStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onClick={onBackToPhone}
          disabled={loading}
          className="text-xs"
        >
          ← Changer le numéro
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={onResendOTP}
          disabled={loading || resendTimer > 0}
          className="text-xs"
        >
          {resendTimer > 0 ? `Renvoyer (${resendTimer}s)` : 'Renvoyer'}
        </Button>
      </div>
    </form>
  );
};

export default OTPVerificationStep;
