
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, BarChart2, ShoppingBag, User } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Accueil", path: "/", icon: <Home size={20} /> },
    { name: "Classement", path: "/classement", icon: <BarChart2 size={20} /> },
    { name: "Coupe", path: "/coupe", icon: <Trophy size={20} /> },
    { name: "Boutique", path: "/boutique", icon: <ShoppingBag size={20} /> },
    { name: "Admin", path: "/admin", icon: <User size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2 z-50 shadow-lg">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive 
                ? "text-fmf-green font-medium" 
                : "text-gray-500 hover:text-fmf-yellow"
            }`}
          >
            <div className={`mb-1 ${isActive ? 'animate-pulse' : ''}`}>{item.icon}</div>
            <span className="text-xs">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
