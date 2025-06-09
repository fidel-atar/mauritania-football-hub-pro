
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user'; // Add prop to know if this is admin login
}

const UserAuth = ({ onAuthSuccess, userType = 'user' }: UserAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, checkAdminStatus } = useAuth();
  const navigate = useNavigate();

  const validateInput = (email: string, password: string) => {
    if (!email || !password) {
      return 'Tous les champs sont requis';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Format d\'email invalide';
    }
    
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateInput(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('User already registered')) {
          setError('Un compte existe déjà avec cet email');
        } else {
          setError('Erreur de connexion. Veuillez réessayer.');
        }
        return;
      }
      
      if (isSignUp) {
        toast.success('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
      } else {
        toast.success('Connexion réussie');
        
        // If this is an admin login, check admin status and redirect to admin dashboard
        if (userType === 'admin') {
          setTimeout(async () => {
            await checkAdminStatus();
            navigate('/admin-dashboard');
          }, 500);
        } else {
          // For regular users, go to home page
          navigate('/');
        }
      }
      
      // Call the success callback if provided
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Créer un compte' : 'Connexion utilisateur'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Créez votre compte pour accéder à toutes les fonctionnalités'
              : 'Connectez-vous avec votre compte utilisateur'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="votre@email.com"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
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
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading 
                ? (isSignUp ? 'Création...' : 'Connexion...') 
                : (isSignUp ? 'Créer un compte' : 'Se connecter')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              disabled={loading}
            >
              {isSignUp 
                ? 'Déjà un compte ? Se connecter'
                : 'Pas de compte ? Créer un compte'
              }
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Accédez à toutes les fonctionnalités de l'application</p>
            {isSignUp && (
              <p className="text-xs mt-2 text-gray-500">
                En créant un compte, vous acceptez nos conditions d'utilisation
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAuth;
