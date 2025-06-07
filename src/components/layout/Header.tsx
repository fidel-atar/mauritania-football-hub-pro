
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-fmf-green text-white py-3 md:py-4 sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-3 md:px-4">
        <Link to="/" className="flex items-center space-x-2 md:space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center p-1">
            <img 
              src="/lovable-uploads/c3f543fe-e10f-4b4a-8e3a-a88246d17aa6.png" 
              alt="Super D1 Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-base md:text-lg">Super D1</span>
        </Link>
        
        <Link to="/admin">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="bg-white text-fmf-green hover:bg-gray-100 text-xs md:text-sm"
          >
            <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
