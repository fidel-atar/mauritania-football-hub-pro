
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";

import HomePage from "./pages/HomePage";
import StandingsPage from "./pages/StandingsPage";
import CupPage from "./pages/CupPage";
import ShopPage from "./pages/ShopPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import TeamPage from "./pages/TeamPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="classement" element={<StandingsPage />} />
            <Route path="coupe" element={<CupPage />} />
            <Route path="boutique" element={<ShopPage />} />
            <Route path="match/:id" element={<MatchDetailPage />} />
            <Route path="equipe/:id" element={<TeamPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
