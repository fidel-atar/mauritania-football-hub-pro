
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface AdminButtonProps {
  isMobile?: boolean;
}

const AdminButton = ({ isMobile = false }: AdminButtonProps) => {
  return (
    <Link to="/admin-dashboard">
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "sm"}
        className="bg-fmf-green text-white hover:bg-fmf-green/90 border-fmf-green touch-target"
      >
        {isMobile ? (
          <Shield className="w-4 h-4" />
        ) : (
          <>
            <Shield className="w-4 h-4 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">Admin</span>
          </>
        )}
      </Button>
    </Link>
  );
};

export default AdminButton;
