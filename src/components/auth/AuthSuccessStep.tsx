
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const AuthSuccessStep = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 md:px-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Connexion réussie !
          </CardTitle>
          <p className="text-gray-600">
            Vous allez être redirigé automatiquement...
          </p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AuthSuccessStep;
