
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
    
    document.title = title;
  }, [location, params]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
