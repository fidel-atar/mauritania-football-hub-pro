
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
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
