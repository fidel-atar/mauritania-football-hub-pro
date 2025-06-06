
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/matches" element={<MatchDetailPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:id" element={<TeamPage />} />
              <Route path="/cup" element={<CupPage />} />
              <Route path="/standings" element={<StandingsPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
