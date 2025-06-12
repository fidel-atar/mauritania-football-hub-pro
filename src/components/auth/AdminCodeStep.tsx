
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import OTPInput from './OTPInput';

interface AdminCodeStepProps {
  code: string;
  setCode: (value: string) => void;
  onSubmit: () => void;
  onBackToEmail: () => void;
  onResendCode: () => void;
  loading: boolean;
  resendTimer: number;
}

const AdminCodeStep = ({
  code,
  setCode,
  onSubmit,
  onBackToEmail,
  onResendCode,
  loading,
  resendTimer
}: AdminCodeStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Code de vérification</Label>
        <OTPInput
          value={code}
          onChange={setCode}
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          Code à 6 chiffres envoyé par email
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Vérification...' : 'Vérifier le code'}
      </Button>

      <div className="flex justify-between items-center text-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={onBackToEmail}
          disabled={loading}
          className="text-xs"
        >
          ← Changer l'email
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={onResendCode}
          disabled={loading || resendTimer > 0}
          className="text-xs"
        >
          {resendTimer > 0 ? `Renvoyer (${resendTimer}s)` : 'Renvoyer'}
        </Button>
      </div>
    </form>
  );
};

export default AdminCodeStep;
