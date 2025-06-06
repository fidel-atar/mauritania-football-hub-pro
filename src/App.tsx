
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import MatchDetailPage from "@/pages/MatchDetailPage";
import NewsPage from "@/pages/NewsPage";
import TeamsPage from "@/pages/TeamsPage";
import TeamPage from "@/pages/TeamPage";
import CupPage from "@/pages/CupPage";
import StandingsPage from "@/pages/StandingsPage";
import ShopPage from "@/pages/ShopPage";
import AdminDashboard from "@/pages/AdminDashboard";
import LiveScoresPage from "@/pages/LiveScoresPage";
import CalendarPage from "@/pages/CalendarPage";
import StatisticsPage from "@/pages/StatisticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              {/* English routes */}
              <Route path="matches" element={<MatchDetailPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="teams/:id" element={<TeamPage />} />
              <Route path="cup" element={<CupPage />} />
              <Route path="standings" element={<StandingsPage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="live" element={<LiveScoresPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              {/* French routes */}
              <Route path="equipes" element={<TeamsPage />} />
              <Route path="equipe/:id" element={<TeamPage />} />
              <Route path="actualites" element={<NewsPage />} />
              <Route path="coupe" element={<CupPage />} />
              <Route path="classement" element={<StandingsPage />} />
              <Route path="boutique" element={<ShopPage />} />
              <Route path="calendrier" element={<CalendarPage />} />
              <Route path="statistiques" element={<StatisticsPage />} />
              {/* Admin routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
