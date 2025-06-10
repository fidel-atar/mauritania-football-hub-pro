
import React, { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // Set page title based on route
    let title = "FMF - Fédération Mauritanienne de Football";
    
    if (location.pathname.includes('/equipe/') && params.id) {
      title = `Équipe - Super D1`;
    }
    else if (location.pathname === '/') {
      title = "Super D1 - Fédération Mauritanienne de Football";
    }
    else if (location.pathname === '/classement') {
      title = "Classement Super D1 - FMF";
    }
    else if (location.pathname === '/coupe') {
      title = "Coupe du Président - FMF";
    }
    else if (location.pathname === '/boutique') {
      title = "Boutique Officielle - FMF";
    }
    else if (location.pathname === '/actualites') {
      title = "Actualités - FMF";
    }
    else if (location.pathname.includes('/match/') && params.id) {
      title = `Match #${params.id} - Super D1`;
    }
    
    document.title = title;
  }, [location, params]);

  // Determine if we're on a match or team detail page for styling adjustments
  const isDetailPage = location.pathname.includes('/match/') || location.pathname.includes('/equipe/');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className={`flex-1 pb-16 md:pb-20 ${isDetailPage ? '' : 'pt-1 md:pt-4'} min-h-0`}>
        <div className="w-full max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: "text-sm",
          duration: 3000,
        }}
      />
    </div>
  );
};

export default Layout;
