
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AdminProvider } from "@/contexts/AdminContext";

import HomePage from "./pages/HomePage";
import StandingsPage from "./pages/StandingsPage";
import CupPage from "./pages/CupPage";
import ShopPage from "./pages/ShopPage";
import NewsPage from "./pages/NewsPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import TeamPage from "./pages/TeamPage";
import TeamsPage from "./pages/TeamsPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import LiveScoresPage from "./pages/LiveScoresPage";
import StatisticsPage from "./pages/StatisticsPage";
import CalendarPage from "./pages/CalendarPage";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="classement" element={<StandingsPage />} />
            <Route path="equipes" element={<TeamsPage />} />
            <Route path="coupe" element={<CupPage />} />
            <Route path="boutique" element={<ShopPage />} />
            <Route path="actualites" element={<NewsPage />} />
            <Route path="live" element={<LiveScoresPage />} />
            <Route path="statistiques" element={<StatisticsPage />} />
            <Route path="calendrier" element={<CalendarPage />} />
            <Route path="match/:id" element={<MatchDetailPage />} />
            <Route path="equipe/:id" element={<TeamPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
