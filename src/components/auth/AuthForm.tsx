
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Eye, EyeOff } from 'lucide-react';
import { sanitizeTextInput } from '@/utils/inputValidation';

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  error: string;
  isSignUp: boolean;
  isAdminLogin: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  error,
  isSignUp,
  isAdminLogin,
  onSubmit
}: AuthFormProps) => {
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // SECURITY FIX: Sanitize email input
    const sanitizedEmail = sanitizeTextInput(e.target.value.trim(), 254);
    setEmail(sanitizedEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // SECURITY FIX: Limit password length to prevent DoS
    const sanitizedPassword = e.target.value.substring(0, 128);
    setPassword(sanitizedPassword);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="votre@email.com"
            className="pl-10"
            required
            disabled={loading}
            maxLength={254}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        {isSignUp && (
          <p className="text-xs text-gray-500">
            8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre
          </p>
        )}
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            className="pl-10 pr-10"
            required
            disabled={loading}
            maxLength={128}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className={`w-full ${isAdminLogin ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={loading}
      >
        {loading 
          ? (isSignUp ? 'Création...' : 'Connexion...') 
          : (isSignUp ? 'Créer un compte' : 'Connexion')
        }
      </Button>
    </form>
  );
};

export default AuthForm;
