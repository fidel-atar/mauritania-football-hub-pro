
import React from 'react';
import AdminAuth from '@/components/auth/AdminAuth';

interface SecureAdminLoginProps {
  onLoginSuccess?: () => void;
}

const SecureAdminLogin = ({ onLoginSuccess }: SecureAdminLoginProps) => {
  return (
    <AdminAuth onAuthSuccess={onLoginSuccess} />
  );
};

export default SecureAdminLogin;
