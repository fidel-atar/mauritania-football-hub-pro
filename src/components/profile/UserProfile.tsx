
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProfileAvatar from './ProfileAvatar';
import ProfileForm from './ProfileForm';

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
      console.log('Fetching profile for user:', user?.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create a new one
          console.log('Profile not found, creating new profile');
          await createInitialProfile();
        } else {
          toast.error('Erreur lors du chargement du profil');
        }
        return;
      }

      console.log('Profile data fetched:', data);
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        location: data.location || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    try {
      const newProfileData = {
        id: user?.id,
        email: user?.email || '',
        full_name: user?.email || '',
        bio: null,
        avatar_url: null,
        phone: null,
        date_of_birth: null,
        location: null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      console.log('New profile created:', data);
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        bio: data.bio || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        location: data.location || '',
      });
    } catch (error) {
      console.error('Error creating initial profile:', error);
      toast.error('Erreur lors de la création du profil');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder');
      return;
    }

    setSaving(true);
    try {
      console.log('Saving profile data:', formData);
      
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error(`Erreur lors de la mise à jour: ${error.message}`);
        return;
      }

      console.log('Profile updated successfully:', data);
      toast.success('Profil mis à jour avec succès');
      setProfile(data);
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
          <ProfileAvatar 
            avatarUrl={profile?.avatar_url} 
            fullName={formData.full_name} 
          />
          
          <ProfileForm 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

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
