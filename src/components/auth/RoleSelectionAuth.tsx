
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, Crown, Mail } from 'lucide-react';
import UserSignup from './UserSignup';
import AdminRequestForm from './AdminRequestForm';

type AuthMode = 'selection' | 'user_signup' | 'admin_request';
type RoleType = 'user' | 'admin_matches' | 'admin_teams' | 'admin_players' | 'super_admin';

const RoleSelectionAuth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('selection');
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    if (role === 'user') {
      setAuthMode('user_signup');
    } else {
      setAuthMode('admin_request');
    }
  };

  const handleBack = () => {
    setAuthMode('selection');
    setSelectedRole(null);
  };

  if (authMode === 'user_signup') {
    return <UserSignup onBack={handleBack} />;
  }

  if (authMode === 'admin_request' && selectedRole) {
    return <AdminRequestForm role={selectedRole} onBack={handleBack} />;
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
            onClick={() => handleRoleSelect('admin_matches')}
            variant="outline"
            className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-orange-50 hover:border-orange-300"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Admin Matchs</h3>
              <p className="text-sm text-gray-500">Gestion des matchs et événements</p>
            </div>
          </Button>

          <Button
            onClick={() => handleRoleSelect('admin_teams')}
            variant="outline"
            className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-purple-50 hover:border-purple-300"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Admin Équipes</h3>
              <p className="text-sm text-gray-500">Gestion des équipes</p>
            </div>
          </Button>

          <Button
            onClick={() => handleRoleSelect('admin_players')}
            variant="outline"
            className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-green-50 hover:border-green-300"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Admin Joueurs</h3>
              <p className="text-sm text-gray-500">Gestion des joueurs</p>
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

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Les demandes d'administration nécessitent une approbation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionAuth;
