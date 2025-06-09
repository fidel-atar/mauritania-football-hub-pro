
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfileData {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  location: string | null;
  email: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    date_of_birth: '',
    location: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('Erreur lors du chargement du profil');
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          location: data.location || '',
        });
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user?.id,
          email: user?.email || '',
          full_name: user?.email || '',
        };
        setProfile(newProfile as UserProfileData);
        setFormData({
          full_name: user?.email || '',
          bio: '',
          phone: '',
          date_of_birth: '',
          location: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Erreur lors de la mise à jour du profil');
        return;
      }

      toast.success('Profil mis à jour avec succès');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Vous devez être connecté pour voir votre profil</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Mon Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>
                {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Changer la photo
            </Button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Votre ville"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Parlez-nous de vous..."
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
