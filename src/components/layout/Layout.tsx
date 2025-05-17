
import React, { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { Toaster } from "@/components/ui/sonner";
import { teams } from "@/data/mockData";

const Layout = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // Set page title based on route
    let title = "FMF - Fédération Mauritanienne de Football";
    
    if (location.pathname.includes('/equipe/') && params.id) {
      const team = teams.find(t => t.id === Number(params.id));
      if (team) {
        title = `${team.name} - FMF`;
      }
    }
    else if (location.pathname === '/') {
      title = "FMF - Fédération Mauritanienne de Football";
    }
    else if (location.pathname === '/classement') {
      title = "Classement - FMF";
    }
    else if (location.pathname === '/coupe') {
      title = "Coupe du Président - FMF";
    }
    else if (location.pathname === '/boutique') {
      title = "Boutique Officielle - FMF";
    }
    else if (location.pathname.includes('/match/') && params.id) {
      title = `Match #${params.id} - FMF`;
    }
    
    document.title = title;
  }, [location, params]);

  // Determine if we're on a match or team detail page for styling adjustments
  const isDetailPage = location.pathname.includes('/match/') || location.pathname.includes('/equipe/');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className={`flex-1 pb-20 ${isDetailPage ? '' : 'pt-4'}`}>
        <Outlet />
      </main>
      <BottomNavigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
