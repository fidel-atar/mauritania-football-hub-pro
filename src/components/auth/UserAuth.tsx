
import React from 'react';
import PhoneAuth from './PhoneAuth';

interface UserAuthProps {
  onAuthSuccess?: () => void;
  userType?: 'admin' | 'user';
}

const UserAuth = ({ onAuthSuccess, userType = 'user' }: UserAuthProps) => {
  return (
    <PhoneAuth 
      userType={userType} 
      onAuthSuccess={onAuthSuccess}
    />
  );
};

export default UserAuth;
