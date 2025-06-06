
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-fmf-green text-white py-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
            <img 
              src="/lovable-uploads/c3f543fe-e10f-4b4a-8e3a-a88246d17aa6.png" 
              alt="Super D1 Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-lg">Super D1</span>
        </Link>
        
        <Link to="/admin">
          <Button variant="outline" className="bg-white text-fmf-green hover:bg-gray-100">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
