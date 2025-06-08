
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, Crown, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AdminRoleType = 'admin_general' | 'super_admin';

interface AdminRequestFormProps {
  role: AdminRoleType;
  onBack: () => void;
}

const AdminRequestForm = ({ role, onBack }: AdminRequestFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [reason, setReason] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const getRoleInfo = (role: AdminRoleType) => {
    switch (role) {
      case 'admin_general':
        return {
          title: 'Admin Général',
          icon: Shield,
          color: 'orange',
          description: 'Gestion des équipes et des matchs'
        };
      case 'super_admin':
        return {
          title: 'Super Admin',
          icon: Crown,
          color: 'red',
          description: 'Accès complet au système'
        };
      default:
        return {
          title: 'Admin',
          icon: Shield,
          color: 'gray',
          description: 'Administration'
        };
    }
  };

  const roleInfo = getRoleInfo(role);
  const IconComponent = roleInfo.icon;

  const validateInput = () => {
    if (!email || !password || !fullName || !reason) {
      return 'Tous les champs sont requis';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Format d\'email invalide';
    }
    
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (fullName.trim().length < 2) {
      return 'Le nom complet doit contenir au moins 2 caractères';
    }
    
    if (reason.trim().length < 20) {
      return 'La justification doit contenir au moins 20 caractères';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    try {
      // Create the user account
      const { error: signUpError } = await signUp(email, password, fullName);
      
      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('Un compte avec cet email existe déjà');
        } else {
          setError('Erreur lors de la création du compte');
        }
        return;
      }

      // Wait for the profile to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Erreur lors de la création du compte');
        return;
      }

      // Create the admin role request
      const { error: requestError } = await supabase
        .from('admin_role_requests')
        .insert({
          user_id: user.id,
          requested_role: role,
          reason: reason.trim()
        });

      if (requestError) {
        console.error('Request creation error:', requestError);
        setError('Erreur lors de la soumission de la demande');
        return;
      }

      setSuccess(true);
      toast.success('Demande soumise avec succès');
    } catch (error) {
      console.error('Admin request error:', error);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className={`mx-auto w-16 h-16 bg-${roleInfo.color}-100 rounded-full flex items-center justify-center mb-4`}>
              <IconComponent className={`w-8 h-8 text-${roleInfo.color}-600`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Demande Soumise
            </h2>
            <p className="text-gray-600 mb-6">
              Votre demande pour devenir <strong>{roleInfo.title}</strong> a été soumise avec succès. 
              Un superviseur examinera votre demande et vous contactera bientôt.
            </p>
            <Button onClick={onBack} variant="outline">
              Retour à l'accueil
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className={`mx-auto w-12 h-12 bg-${roleInfo.color}-100 rounded-full flex items-center justify-center mb-4`}>
            <IconComponent className={`w-6 h-6 text-${roleInfo.color}-600`} />
          </div>
          <CardTitle className="text-2xl font-bold text-fmf-green">
            Demande {roleInfo.title}
          </CardTitle>
          <p className="text-gray-600">
            {roleInfo.description}
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
              <Label htmlFor="fullName">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
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
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
            
            <div className="space-y-2">
              <Label htmlFor="reason">Justification de la demande</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Expliquez pourquoi vous souhaitez obtenir ce rôle d'administration et quelle est votre expérience pertinente..."
                className="min-h-[100px]"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Minimum 20 caractères requis
              </p>
            </div>
            
            <Button 
              type="submit" 
              className={`w-full bg-${roleInfo.color}-600 hover:bg-${roleInfo.color}-700`}
              disabled={loading}
            >
              {loading ? 'Soumission...' : 'Soumettre la demande'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Votre demande sera examinée par un superviseur. 
              Vous recevrez une notification par email une fois la décision prise.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequestForm;
