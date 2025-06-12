
import React from 'react';
import PhoneAuth from './PhoneAuth';

interface UserAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user';
}

const UserAuth = ({ onAuthSuccess, userType = 'admin' }: UserAuthProps) => {
  return (
    <PhoneAuth 
      userType="admin" 
      onAuthSuccess={onAuthSuccess}
    />
  );
};

export default UserAuth;
