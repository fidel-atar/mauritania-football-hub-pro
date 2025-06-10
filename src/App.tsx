
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import TeamsPage from "@/pages/TeamsPage";
import TeamPage from "@/pages/TeamPage";
import StandingsPage from "@/pages/StandingsPage";
import CalendarPage from "@/pages/CalendarPage";
import LiveScoresPage from "@/pages/LiveScoresPage";
import MatchDetailPage from "@/pages/MatchDetailPage";
import NewsPage from "@/pages/NewsPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import StatisticsPage from "@/pages/StatisticsPage";
import ShopPage from "@/pages/ShopPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import CupPage from "@/pages/CupPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="home" element={<HomePage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="teams/:id" element={<TeamPage />} />
              <Route path="standings" element={<StandingsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="live-scores" element={<LiveScoresPage />} />
              <Route path="match/:id" element={<MatchDetailPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:id" element={<NewsDetailPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="cup" element={<CupPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
