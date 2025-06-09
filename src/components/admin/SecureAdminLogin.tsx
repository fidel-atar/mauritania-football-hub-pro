
import React from 'react';
import UserAuth from '@/components/auth/UserAuth';

interface SecureAdminLoginProps {
  onLoginSuccess?: () => void;
}

const SecureAdminLogin = ({ onLoginSuccess }: SecureAdminLoginProps) => {
  return (
    <UserAuth 
      userType="admin" 
      onAuthSuccess={onLoginSuccess}
    />
  );
};

export default SecureAdminLogin;
