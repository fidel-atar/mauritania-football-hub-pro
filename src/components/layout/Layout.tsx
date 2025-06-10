
import React, { useEffect, useMemo } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  const location = useLocation();
  const params = useParams();

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    
    if ((path.includes('/equipe/') || path.includes('/teams/')) && params.id) {
      return `Équipe - Super D1`;
    }
    if (path === '/' || path === '/accueil' || path === '/home') {
      return "Super D1 - Fédération Mauritanienne de Football";
    }
    if (path === '/classement' || path === '/standings') {
      return "Classement Super D1 - FMF";
    }
    if (path === '/coupe' || path === '/cup') {
      return "Coupe du Président - FMF";
    }
    if (path === '/boutique' || path === '/shop') {
      return "Boutique Officielle - FMF";
    }
    if (path === '/actualites' || path === '/news') {
      return "Actualités - FMF";
    }
    if (path === '/statistiques' || path === '/statistics') {
      return "Statistiques - FMF";
    }
    if (path === '/calendrier' || path === '/calendar') {
      return "Calendrier - FMF";
    }
    if (path.includes('/match/') && params.id) {
      return `Match #${params.id} - Super D1`;
    }
    
    return "FMF - Fédération Mauritanienne de Football";
  }, [location.pathname, params.id]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const isDetailPage = useMemo(() => 
    location.pathname.includes('/match/') || 
    location.pathname.includes('/equipe/') || 
    location.pathname.includes('/teams/')
  , [location.pathname]);

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
          duration: 2000,
        }}
      />
    </div>
  );
};

export default Layout;
