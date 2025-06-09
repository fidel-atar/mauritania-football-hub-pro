
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

interface AuthHeaderProps {
  isAdminLogin: boolean;
  isSignUp: boolean;
}

const AuthHeader = ({ isAdminLogin, isSignUp }: AuthHeaderProps) => {
  const IconComponent = isAdminLogin ? Shield : User;
  const iconBgColor = isAdminLogin ? 'bg-red-600' : 'bg-blue-600';
  
  const getTitle = () => {
    if (isAdminLogin) {
      return isSignUp ? 'Créer un compte admin' : 'Connexion admin';
    }
    return isSignUp ? 'Créer un compte' : 'Connexion utilisateur';
  };
  
  const getDescription = () => {
    if (isAdminLogin) {
      return isSignUp 
        ? 'Créez votre compte administrateur pour accéder au panneau d\'administration'
        : 'Connectez-vous avec votre compte administrateur';
    }
    return isSignUp 
      ? 'Créez votre compte pour accéder à toutes les fonctionnalités'
      : 'Connectez-vous avec votre compte utilisateur';
  };

  return (
    <CardHeader className="text-center">
      <div className={`mx-auto w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <CardTitle className="text-2xl font-bold text-gray-900">
        {getTitle()}
      </CardTitle>
      <p className="text-gray-600">
        {getDescription()}
      </p>
    </CardHeader>
  );
};

export default AuthHeader;
