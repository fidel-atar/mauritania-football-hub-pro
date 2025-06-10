
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, BarChart2, Newspaper, ShoppingBag } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Accueil", path: "/", icon: <Home size={18} /> },
    { name: "Actualités", path: "/actualites", icon: <Newspaper size={18} /> },
    { name: "Stats", path: "/statistiques", icon: <BarChart2 size={18} /> },
    { name: "Coupe", path: "/coupe", icon: <Trophy size={18} /> },
    { name: "Shop", path: "/boutique", icon: <ShoppingBag size={18} /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-1 z-50 shadow-lg safe-area-pb">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative touch-target ${
              isActive 
                ? "text-fmf-green font-medium scale-105" 
                : "text-gray-500 hover:text-fmf-yellow active:scale-95"
            }`}
          >
            {isActive && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-fmf-green rounded-b-full" />
            )}
            <div className={`mb-1 transition-transform ${isActive ? 'animate-pulse' : ''}`}>
              {item.icon}
            </div>
            <span className="text-xs leading-tight">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
