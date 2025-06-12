
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface AdminEmailStepProps {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const AdminEmailStep = ({ 
  email, 
  setEmail, 
  onSubmit, 
  loading 
}: AdminEmailStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Administrateur</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="pl-10"
            required
            disabled={loading}
          />
        </div>
        <p className="text-xs text-gray-500">
          Entrez votre email administrateur pour recevoir le code
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Envoi...' : 'Envoyer le code'}
      </Button>
    </form>
  );
};

export default AdminEmailStep;
