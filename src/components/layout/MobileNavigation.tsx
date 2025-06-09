
import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Trophy, 
  BarChart3, 
  ShoppingBag, 
  Users, 
  User,
  Shield
} from "lucide-react";

interface MobileNavigationProps {
  isMenuOpen: boolean;
  onMenuClose: () => void;
  onAdminLogin?: () => void;
}

const MobileNavigation = ({ isMenuOpen, onMenuClose, onAdminLogin }: MobileNavigationProps) => {
  if (!isMenuOpen) return null;

  const handleAdminLogin = () => {
    console.log('Admin login clicked from mobile menu');
    if (onAdminLogin) {
      onAdminLogin();
    }
    onMenuClose();
  };

  return (
    <div className="md:hidden bg-white border-t">
      <nav className="py-4">
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/" 
            className="flex flex-col items-center p-3 text-gray-700 hover:text-fmf-green transition-colors"
            onClick={onMenuClose}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          <Link 
            to="/calendrier" 
            className="flex flex-col items-center p-3 text-gray-700 hover:text-fmf-green transition-colors"
            onClick={onMenuClose}
          >
            <Calendar size={20} />
            <span className="text-xs mt-1">Calendrier</span>
          </Link>
          <Link 
            to="/classement" 
            className="flex flex-col items-center p-3 text-gray-700 hover:text-fmf-green transition-colors"
            onClick={onMenuClose}
          >
            <BarChart3 size={20} />
            <span className="text-xs mt-1">Classement</span>
          </Link>
          <Link 
            to="/coupe" 
            className="flex flex-col items-center p-3 text-gray-700 hover:text-fmf-green transition-colors"
            onClick={onMenuClose}
          >
            <Trophy size={20} />
            <span className="text-xs mt-1">Coupe</span>
          </Link>
          <Link 
            to="/equipes" 
            className="flex flex-col items-center p-3 text-gray-700 hover:text-fmf-green transition-colors"
            onClick={onMenuClose}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Équipes</span>
          </Link>
          <Link 
            to="/boutique" 
            className="flex flex-col items-center p-3 text-gray-700 hover:text-fmf-green transition-colors"
            onClick={onMenuClose}
          >
            <ShoppingBag size={20} />
            <span className="text-xs mt-1">Boutique</span>
          </Link>
        </div>
        
        {/* Admin Login Button */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={handleAdminLogin}
            className="w-full flex items-center justify-center p-3 text-red-600 hover:text-red-700 transition-colors bg-red-50 rounded-lg"
          >
            <Shield size={20} className="mr-2" />
            <span className="text-sm font-medium">Admin Principal</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
