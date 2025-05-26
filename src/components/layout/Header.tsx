
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-fmf-green text-white py-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
            <img 
              src="/lovable-uploads/ab2b0c67-0270-47b7-958a-30c825d9a30d.png" 
              alt="Super D1 Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-lg">Super D1</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
