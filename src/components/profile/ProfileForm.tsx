
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileFormData {
  full_name: string;
  bio: string;
  phone: string;
  date_of_birth: string;
  location: string;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  onInputChange: (field: string, value: string) => void;
}

const ProfileForm = ({ formData, onInputChange }: ProfileFormProps) => {
  return (
    <>
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Nom complet</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => onInputChange('full_name', e.target.value)}
            placeholder="Votre nom complet"
          />
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Votre numéro de téléphone"
          />
        </div>

        <div>
          <Label htmlFor="date_of_birth">Date de naissance</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => onInputChange('date_of_birth', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="Votre ville"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Biographie</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          placeholder="Parlez-nous de vous..."
          rows={4}
        />
      </div>
    </>
  );
};

export default ProfileForm;
