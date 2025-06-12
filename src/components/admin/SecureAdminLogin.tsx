
import React from 'react';
import PhoneAuth from '@/components/auth/PhoneAuth';

interface SecureAdminLoginProps {
  onLoginSuccess?: () => void;
}

const SecureAdminLogin = ({ onLoginSuccess }: SecureAdminLoginProps) => {
  return (
    <PhoneAuth 
      userType="admin" 
      onAuthSuccess={onLoginSuccess}
    />
  );
};

export default SecureAdminLogin;
