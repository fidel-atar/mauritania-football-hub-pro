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
  const { signIn, signUp } = useAuth();
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
        
        // Handle different types of authentication errors
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('User already registered')) {
          setError('Un compte existe déjà avec cet email');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else if (error.message.includes('Too many requests')) {
          setError('Trop de tentatives. Veuillez réessayer dans quelques minutes');
        } else {
          setError('Erreur de connexion. Veuillez réessayer.');
        }
        
        // Keep the user on the auth page when there's an error
        return;
      }
      
      if (isSignUp) {
        toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setIsSignUp(false); // Switch to login mode after successful signup
        setPassword(''); // Clear password for security
        setError('');
      } else {
        toast.success('Connexion réussie');
        
        // Only redirect for admin users or call success callback
        if (isAdminLogin && email === 'admin@fmf.mr') {
          console.log('UserAuth: Admin principal login - AuthContext will handle redirect');
        } else if (isAdminLogin) {
          // For regular admin users
          navigate('/admin-dashboard');
        } else {
          // For regular users, navigate to home
          navigate('/');
        }
        
        // Call the success callback if provided
        if (onAuthSuccess) {
          console.log('UserAuth: Calling onAuthSuccess callback');
          onAuthSuccess();
        }
      }
      
    } catch (error) {
      console.error('UserAuth: Unexpected auth error:', error);
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
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
