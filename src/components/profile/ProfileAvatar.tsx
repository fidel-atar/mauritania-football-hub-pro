
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  fullName: string;
}

const ProfileAvatar = ({ avatarUrl, fullName }: ProfileAvatarProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      <Button variant="outline" size="sm">
        <Camera className="w-4 h-4 mr-2" />
        Changer la photo
      </Button>
    </div>
  );
};

export default ProfileAvatar;
