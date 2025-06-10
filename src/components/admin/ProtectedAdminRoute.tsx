
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

  // Security check: Only allow admin@fmf.mr or users with admin roles
  const isAuthorizedAdmin = user.email === 'admin@fmf.mr' || isAdmin;
  
  if (!isAuthorizedAdmin) {
    console.log('ProtectedAdminRoute: User is not authorized admin, redirecting to home. User:', user.email, 'isAdmin:', isAdmin);
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is authorized admin, show admin content
  console.log('ProtectedAdminRoute: User is authorized admin, showing admin content');
  return <>{children}</>;
};

export default ProtectedAdminRoute;
