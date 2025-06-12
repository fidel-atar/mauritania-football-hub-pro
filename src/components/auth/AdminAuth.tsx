
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
}

const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { checkAdminStatus } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('AdminAuth: Attempting admin login with email:', email);
      
      // Verify the OTP code
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (verifyError) {
        console.error('AdminAuth: OTP verification failed:', verifyError);
        setError('Code de vérification invalide ou expiré');
        return;
      }

      if (data.user) {
        console.log('AdminAuth: OTP verified successfully, user:', data.user.email);
        
        // Check admin status after successful authentication
        await checkAdminStatus();
        
        console.log('AdminAuth: Admin login successful');
        onAuthSuccess?.();
      }
    } catch (error: any) {
      console.error('AdminAuth: Login error:', error);
      setError('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 md:px-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Connexion Admin
          </CardTitle>
          <p className="text-gray-600">
            Entrez votre email et code d'accès
          </p>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Administrateur</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code d'accès</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                disabled={loading}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-gray-500">
                Code à 6 chiffres d'accès administrateur
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
