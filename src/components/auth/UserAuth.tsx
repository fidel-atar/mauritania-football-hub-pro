
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { validateAuthInput } from '@/utils/authValidation';
import AuthHeader from './AuthHeader';
import AuthForm from './AuthForm';
import AuthFooter from './AuthFooter';

interface UserAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user';
}

const UserAuth = ({ onAuthSuccess, userType = 'user' }: UserAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const isAdminLogin = userType === 'admin';

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateAuthInput(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('Un compte existe déjà avec cet email. Essayez de vous connecter.');
          } else if (error.message.includes('Email address invalid')) {
            setError('Adresse email invalide');
          } else {
            setError('Erreur lors de la création du compte. Veuillez réessayer.');
          }
          return;
        }
        
        toast.success('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte avant de vous connecter.');
        setIsSignUp(false);
        setPassword('');
        setError('');
        return;
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Email ou mot de passe incorrect');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
          } else if (error.message.includes('Too many requests')) {
            setError('Trop de tentatives. Veuillez réessayer dans quelques minutes');
          } else {
            setError('Erreur de connexion. Veuillez réessayer.');
          }
          return;
        }
        
        toast.success('Connexion réussie');
        
        if (onAuthSuccess) {
          onAuthSuccess();
        }
        
        if (!isAdminLogin) {
          navigate('/');
        }
      }
      
    } catch (error) {
      console.error('Unexpected auth error:', error);
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [email, password, isSignUp, signIn, signUp, onAuthSuccess, isAdminLogin, navigate]);

  const handleToggleSignUp = useCallback(() => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
  }, [isSignUp]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 md:px-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <AuthHeader isAdminLogin={isAdminLogin} isSignUp={isSignUp} />
        <CardContent className="p-4 md:p-6">
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            error={error}
            isSignUp={isSignUp}
            isAdminLogin={isAdminLogin}
            onSubmit={handleSubmit}
          />
          <AuthFooter
            isSignUp={isSignUp}
            isAdminLogin={isAdminLogin}
            loading={loading}
            onToggleSignUp={handleToggleSignUp}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAuth;
