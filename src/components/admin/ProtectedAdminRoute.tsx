
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SecureAdminLogin from "./SecureAdminLogin";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  console.log('ProtectedAdminRoute - user:', user?.email, 'isAdmin:', isAdmin, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-4"></div>
          <p>Vérification des permissions administrateur...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show admin login form
  if (!user) {
    console.log('ProtectedAdminRoute: No user found, showing admin login');
    return <SecureAdminLogin />;
  }

  // If user is logged in but not admin, redirect to home with message
  if (!isAdmin) {
    console.log('ProtectedAdminRoute: User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin, show admin content
  console.log('ProtectedAdminRoute: User is admin, showing admin content');
  return <>{children}</>;
};

export default ProtectedAdminRoute;
