
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import CartIcon from "@/components/shop/CartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SecureAdminLogin from "@/components/admin/SecureAdminLogin";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAdmin, user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUserTypeSelect = (userType: string) => {
    console.log(`Selected user type: ${userType}`);
    
    if (userType === 'admin-principal' || userType === 'mini-admin') {
      // Show the admin login modal
      setShowAdminLogin(true);
    }
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
              <CartIcon />
              
              {/* Compt Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Compt
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
                  <DropdownMenuItem 
                    onClick={() => handleUserTypeSelect('utilisateur')}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Utilisateur
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleUserTypeSelect('admin-principal')}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin Principal
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleUserTypeSelect('mini-admin')}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mini-Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <CartIcon />
              
              {/* Mobile Compt Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
                  <DropdownMenuItem 
                    onClick={() => handleUserTypeSelect('utilisateur')}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Utilisateur
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleUserTypeSelect('admin-principal')}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Admin Principal
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleUserTypeSelect('mini-admin')}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mini-Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button 
                onClick={toggleMenu}
                className="text-gray-700 hover:text-fmf-green transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-fmf-green transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  to="/actualites" 
                  className="text-gray-700 hover:text-fmf-green transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Actualités
                </Link>
                <Link 
                  to="/equipes" 
                  className="text-gray-700 hover:text-fmf-green transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Équipes
                </Link>
                <Link 
                  to="/classement" 
                  className="text-gray-700 hover:text-fmf-green transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Classement
                </Link>
                <Link 
                  to="/boutique" 
                  className="text-gray-700 hover:text-fmf-green transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Boutique
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-1 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowAdminLogin(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <SecureAdminLogin onLoginSuccess={() => {
              setShowAdminLogin(false);
              // Force redirect to admin dashboard
              window.location.href = '/admin-dashboard';
            }} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
