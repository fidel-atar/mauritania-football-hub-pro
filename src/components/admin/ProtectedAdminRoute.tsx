
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SecureAdminLogin from "./SecureAdminLogin";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-4"></div>
          <p>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show login form
  if (!user) {
    return <SecureAdminLogin />;
  }

  // If user is logged in but not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin, show admin content
  return <>{children}</>;
};

export default ProtectedAdminRoute;
