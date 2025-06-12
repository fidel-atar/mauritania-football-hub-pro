
import React from 'react';
import SecureAdminLogin from '@/components/admin/SecureAdminLogin';
import UserProfile from '@/components/profile/UserProfile';

interface ModalManagerProps {
  showAdminLogin: boolean;
  showUserProfile: boolean;
  onCloseAdminLogin: () => void;
  onCloseUserProfile: () => void;
  onAdminLoginSuccess: () => void;
}

const ModalManager = ({
  showAdminLogin,
  showUserProfile,
  onCloseAdminLogin,
  onCloseUserProfile,
  onAdminLoginSuccess
}: ModalManagerProps) => {
  return (
    <>
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-1 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={onCloseAdminLogin}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <SecureAdminLogin onLoginSuccess={onAdminLoginSuccess} />
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-1 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 p-4">
              <h2 className="text-lg font-semibold">Mon Profil</h2>
              <button
                onClick={onCloseUserProfile}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <UserProfile />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalManager;
