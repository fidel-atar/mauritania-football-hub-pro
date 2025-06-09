
import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthFooterProps {
  isSignUp: boolean;
  isAdminLogin: boolean;
  loading: boolean;
  onToggleSignUp: () => void;
}

const AuthFooter = ({ isSignUp, isAdminLogin, loading, onToggleSignUp }: AuthFooterProps) => {
  return (
    <>
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          onClick={onToggleSignUp}
          disabled={loading}
        >
          {isSignUp 
            ? 'Déjà un compte ? Se connecter'
            : 'Pas de compte ? Créer un compte'
          }
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          {isAdminLogin 
            ? 'Accédez au panneau d\'administration'
            : 'Accédez à toutes les fonctionnalités de l\'application'
          }
        </p>
        {isSignUp && (
          <p className="text-xs mt-2 text-gray-500">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </p>
        )}
      </div>
    </>
  );
};

export default AuthFooter;
