
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import CartIcon from "@/components/shop/CartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/ab2b0c67-0270-47b7-958a-30c825d9a30d.png" 
              alt="FMF Logo" 
              className="h-10 w-10"
            />
            <span className="font-bold text-xl text-fmf-green">FMF</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIcon />
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <CartIcon />
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
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
