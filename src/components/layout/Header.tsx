
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import UserMenu from "./UserMenu";
import MobileNavigation from "./MobileNavigation";
import ModalManager from "./ModalManager";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { isAdmin, user, signOut } = useAuth();
  const { getTotalItems, isLoading } = useCart();
  const totalItems = getTotalItems();

  // Listen for admin login events from UserMenu
  useEffect(() => {
    const handleOpenAdminLogin = (event: CustomEvent) => {
      console.log(`Admin login requested for: ${event.detail}`);
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

  const handleUserTypeSelect = (userType: string) => {
    console.log(`Selected user type: ${userType}`);
    
    if (userType === 'admin-principal' || userType === 'mini-admin') {
      console.log('Opening admin login modal');
      setShowAdminLogin(true);
    } else if (userType === 'utilisateur') {
      setShowUserAuth(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleShowProfile = () => {
    setShowUserProfile(true);
  };

  const handleAdminLoginSuccess = () => {
    console.log('Admin login successful, closing modal');
    setShowAdminLogin(false);
    // The UserAuth component will handle the redirect to admin dashboard
  };

  const handleUserAuthSuccess = () => {
    setShowUserAuth(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png" 
                alt="Super D1-Mauritanie Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="font-bold text-xl text-fmf-green">Super D1-Mauritanie</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <UserMenu
                user={user}
                totalItems={totalItems}
                isLoading={isLoading}
                onSignOut={handleSignOut}
                onShowAuth={() => handleUserTypeSelect('utilisateur')}
                onShowProfile={handleShowProfile}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <UserMenu
                user={user}
                totalItems={totalItems}
                isLoading={isLoading}
                onSignOut={handleSignOut}
                onShowAuth={() => handleUserTypeSelect('utilisateur')}
                onShowProfile={handleShowProfile}
              />
              
              <button 
                onClick={toggleMenu}
                className="text-gray-700 hover:text-fmf-green transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <MobileNavigation 
            isMenuOpen={isMenuOpen} 
            onMenuClose={() => setIsMenuOpen(false)}
            onAdminLogin={() => handleUserTypeSelect('admin-principal')}
          />
        </div>
      </header>

      <ModalManager
        showAdminLogin={showAdminLogin}
        showUserAuth={showUserAuth}
        showUserProfile={showUserProfile}
        onCloseAdminLogin={() => setShowAdminLogin(false)}
        onCloseUserAuth={() => setShowUserAuth(false)}
        onCloseUserProfile={() => setShowUserProfile(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onUserAuthSuccess={handleUserAuthSuccess}
      />
    </>
  );
};

export default Header;
