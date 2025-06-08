
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, Crown, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserSignup from './UserSignup';
import AdminRequestForm from './AdminRequestForm';

type AuthMode = 'selection' | 'user_signup' | 'admin_request' | 'admin_selection';
type UserRoleType = 'user';
type AdminRoleType = 'admin_general' | 'super_admin';
type AppRoleType = UserRoleType | AdminRoleType;

const RoleSelectionAuth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('selection');
  const [selectedRole, setSelectedRole] = useState<AppRoleType | null>(null);
  const { user, profile, signOut } = useAuth();

  const handleRoleSelect = (role: AppRoleType) => {
    setSelectedRole(role);
    if (role === 'user') {
      setAuthMode('user_signup');
    } else {
      setAuthMode('admin_request');
    }
  };

  const handleAdminSelection = () => {
    setAuthMode('admin_selection');
  };

  const handleBack = () => {
    setAuthMode('selection');
    setSelectedRole(null);
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthMode('selection');
    setSelectedRole(null);
  };

  // If user is already logged in, show disconnect option
  if (user && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-fmf-green rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-fmf-green">
              Bienvenue, {profile.full_name || 'Utilisateur'}
            </CardTitle>
            <p className="text-gray-600">
              Connecté en tant que: <span className="font-semibold">{profile.role === 'user' ? 'Utilisateur' : 'Administrateur'}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Se déconnecter</span>
            </Button>
            
            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Vous pouvez vous déconnecter et vous reconnecter avec un autre compte</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authMode === 'user_signup') {
    return <UserSignup onBack={handleBack} />;
  }

  if (authMode === 'admin_request' && selectedRole && selectedRole !== 'user') {
    return <AdminRequestForm role={selectedRole} onBack={handleBack} />;
  }

  if (authMode === 'admin_selection') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="absolute left-4 top-4"
            >
              ← Retour
            </Button>
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-fmf-green">
              Types d'Administration
            </CardTitle>
            <p className="text-gray-600">
              Choisissez votre niveau d'accès administrateur
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleRoleSelect('admin_general')}
              variant="outline"
              className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-orange-50 hover:border-orange-300"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin Général</h3>
                <p className="text-sm text-gray-500">Gestion des équipes et des matchs</p>
              </div>
            </Button>

            <Button
              onClick={() => handleRoleSelect('super_admin')}
              variant="outline"
              className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-red-50 hover:border-red-300"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Super Admin</h3>
                <p className="text-sm text-gray-500">Accès complet au système</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-fmf-green rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-fmf-green">
            Bienvenue sur Super D1
          </CardTitle>
          <p className="text-gray-600">
            Choisissez votre type de compte
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleRoleSelect('user')}
            variant="outline"
            className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-blue-50 hover:border-blue-300"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Utilisateur</h3>
              <p className="text-sm text-gray-500">Accès aux fonctionnalités publiques</p>
            </div>
          </Button>

          <Button
            onClick={handleAdminSelection}
            variant="outline"
            className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-orange-50 hover:border-orange-300"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Administrateur</h3>
              <p className="text-sm text-gray-500">Gestion et administration</p>
            </div>
          </Button>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Les demandes d'administration nécessitent une approbation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionAuth;
