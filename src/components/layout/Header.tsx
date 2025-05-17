
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-fmf-green text-white py-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-fmf-green font-bold text-lg">FMFF</span>
          </div>
          <span className="font-bold text-lg">Fédération Mauritanienne de Football</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
