
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

interface PhoneNumberStepProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  isAdminLogin: boolean;
}

const PhoneNumberStep = ({ 
  phoneNumber, 
  setPhoneNumber, 
  onSubmit, 
  loading, 
  isAdminLogin 
}: PhoneNumberStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default PhoneNumberStep;
