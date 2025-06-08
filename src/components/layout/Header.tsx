
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";
import CartIcon from "@/components/shop/CartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png" 
              alt="Super D1 Logo" 
              className="h-12 w-12 object-contain"
            />
            <span className="font-bold text-xl text-fmf-green">Super D1</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIcon />
            
            {/* User Account Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || 'Mon Compte'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    {profile?.full_name || 'Mon Compte'}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-gray-400">
                    {profile?.role === 'user' ? 'Utilisateur' : 
                     profile?.role === 'admin_general' ? 'Admin Général' : 
                     profile?.role === 'super_admin' ? 'Super Admin' : 'Utilisateur'}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <CartIcon />
            
            {/* Mobile User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    {profile?.full_name || 'Mon Compte'}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-gray-400">
                    {profile?.role === 'user' ? 'Utilisateur' : 
                     profile?.role === 'admin_general' ? 'Admin Général' : 
                     profile?.role === 'super_admin' ? 'Super Admin' : 'Utilisateur'}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            )}

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
  );
};

export default Header;
