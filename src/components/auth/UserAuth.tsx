
import React, { useState } from 'react';
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
  const { signIn, signUp, checkAdminStatus } = useAuth();
  const navigate = useNavigate();

  const isAdminLogin = userType === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log(`UserAuth: Starting ${isSignUp ? 'signup' : 'login'} for ${userType} user with email:`, email);
    
    const validationError = validateAuthInput(email, password);
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
        console.error('UserAuth: Auth error:', error);
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
        
        // Check if this is admin principal - let AuthContext handle the redirection
        if (email === 'admin@fmf.mr') {
          console.log('UserAuth: Admin principal login detected, AuthContext will handle redirection');
          // AuthContext will automatically redirect, but we can add a fallback
          setTimeout(() => {
            console.log('UserAuth: Fallback redirect for admin principal');
            navigate('/admin-dashboard');
          }, 2000);
        } else if (isAdminLogin) {
          // For other admin logins, wait for auth context to update then check admin status
          console.log('UserAuth: Admin login detected, waiting for auth context update...');
          setTimeout(async () => {
            console.log('UserAuth: Checking admin status and redirecting to admin dashboard...');
            await checkAdminStatus();
            navigate('/admin-dashboard');
          }, 1000);
        } else {
          // For regular users, redirect to home
          console.log('UserAuth: Regular user login, redirecting to home');
          navigate('/');
        }
      }
      
      // Call the success callback if provided
      if (onAuthSuccess) {
        console.log('UserAuth: Calling onAuthSuccess callback');
        onAuthSuccess();
      }
      
    } catch (error) {
      console.error('UserAuth: Unexpected auth error:', error);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <AuthHeader isAdminLogin={isAdminLogin} isSignUp={isSignUp} />
        <CardContent>
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
