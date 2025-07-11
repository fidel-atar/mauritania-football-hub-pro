
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import UserMenu from "./UserMenu";
import MobileNavigation from "./MobileNavigation";
import ModalManager from "./ModalManager";
import AdminButton from "./AdminButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Header: Auth context not available, falling back to defaults');
    authData = {
      isAdmin: false,
      user: null,
      signOut: async () => {}
    };
  }

  const { isAdmin, user, signOut } = authData;
  const { getTotalItems, isLoading } = useCart();
  const totalItems = getTotalItems();

  // Debug logging for admin button visibility
  React.useEffect(() => {
    console.log('Header: Auth state debug - user:', user?.id, 'isAdmin:', isAdmin);
  }, [user, isAdmin]);

  React.useEffect(() => {
    const handleOpenAdminLogin = (event: CustomEvent) => {
      console.log(`Header: Admin login requested for: ${event.detail}`);
      setShowAdminLogin(true);
    };

    window.addEventListener('openAdminLogin', handleOpenAdminLogin as EventListener);
    
    return () => {
      window.removeEventListener('openAdminLogin', handleOpenAdminLogin as EventListener);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    console.log('Header: Signing out user');
    await signOut();
  };

  const handleShowProfile = () => {
    console.log('Header: Showing user profile');
    setShowUserProfile(true);
  };

  const handleAdminLoginSuccess = () => {
    console.log('Header: Admin login successful, closing modal');
    setShowAdminLogin(false);
  };

  // Show admin button if user exists and is admin
  const showAdminButton = user && isAdmin;

  console.log('Header: Admin button visibility - showAdminButton:', showAdminButton, 'conditions:', {
    hasUser: !!user,
    isAdmin
  });

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link to="/" className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              <img 
                src="/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png" 
                alt="Super D1-Mauritanie Logo" 
                className="h-8 w-8 md:h-12 md:w-12 object-contain"
              />
              <span className="font-bold text-sm md:text-xl text-fmf-green hidden sm:block">
                Super D1-Mauritanie
              </span>
              <span className="font-bold text-xs text-fmf-green sm:hidden">
                FMF
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              {showAdminButton && (
                <AdminButton />
              )}
              
              <UserMenu
                user={user}
                totalItems={totalItems}
                isLoading={isLoading}
                onSignOut={handleSignOut}
                onShowProfile={handleShowProfile}
              />
            </div>

            <div className="md:hidden flex items-center gap-1">
              {showAdminButton && (
                <AdminButton isMobile />
              )}
              
              <UserMenu
                user={user}
                totalItems={totalItems}
                isLoading={isLoading}
                onSignOut={handleSignOut}
                onShowProfile={handleShowProfile}
              />
              
              <button 
                onClick={toggleMenu}
                className="text-gray-700 hover:text-fmf-green transition-colors p-2 touch-target"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <MobileNavigation 
            isMenuOpen={isMenuOpen} 
            onMenuClose={() => setIsMenuOpen(false)}
            onAdminLogin={() => setShowAdminLogin(true)}
          />
        </div>
      </header>

      <ModalManager
        showAdminLogin={showAdminLogin}
        showUserProfile={showUserProfile}
        onCloseAdminLogin={() => setShowAdminLogin(false)}
        onCloseUserProfile={() => setShowUserProfile(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />
    </>
  );
};

export default Header;
