
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  onMenuClose: () => void;
}

const MobileNavigation = ({ isMenuOpen, onMenuClose }: MobileNavigationProps) => {
  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden py-4 border-t">
      <nav className="flex flex-col space-y-4">
        <Link 
          to="/" 
          className="text-gray-700 hover:text-fmf-green transition-colors"
          onClick={onMenuClose}
        >
          Accueil
        </Link>
        <Link 
          to="/actualites" 
          className="text-gray-700 hover:text-fmf-green transition-colors"
          onClick={onMenuClose}
        >
          Actualités
        </Link>
        <Link 
          to="/equipes" 
          className="text-gray-700 hover:text-fmf-green transition-colors"
          onClick={onMenuClose}
        >
          Équipes
        </Link>
        <Link 
          to="/classement" 
          className="text-gray-700 hover:text-fmf-green transition-colors"
          onClick={onMenuClose}
        >
          Classement
        </Link>
        <Link 
          to="/boutique" 
          className="text-gray-700 hover:text-fmf-green transition-colors"
          onClick={onMenuClose}
        >
          Boutique
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavigation;
