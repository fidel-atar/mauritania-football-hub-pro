import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/layout/Layout";
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
import DocumentationPage from "@/pages/DocumentationPage";
import ArabicDocumentationPage from "@/pages/ArabicDocumentationPage";
import ComprehensiveDocumentationPage from "@/pages/ComprehensiveDocumentationPage";
import NotFound from "@/pages/NotFound";
import PrivacyPolicyPage from "@/components/layout/PrivacyPolicyPage";
import TermsOfServicePage from "@/components/layout/TermsOfServicePage";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/auth/ErrorBoundary";
import OfflineIndicator from "@/components/offline/OfflineIndicator";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <OfflineIndicator />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="accueil" element={<HomePage />} />
                
                {/* Teams routes */}
                <Route path="equipes" element={<TeamsPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route path="equipes/:id" element={<TeamPage />} />
                <Route path="teams/:id" element={<TeamPage />} />
                
                {/* Standings routes */}
                <Route path="classement" element={<StandingsPage />} />
                <Route path="standings" element={<StandingsPage />} />
                
                {/* Calendar routes */}
                <Route path="calendrier" element={<CalendarPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                
                {/* Live scores routes */}
                <Route path="scores-en-direct" element={<LiveScoresPage />} />
                <Route path="live-scores" element={<LiveScoresPage />} />
                
                {/* Match detail routes */}
                <Route path="match/:id" element={<MatchDetailPage />} />
                
                {/* News routes */}
                <Route path="actualites" element={<NewsPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="actualites/:id" element={<NewsDetailPage />} />
                <Route path="news/:id" element={<NewsDetailPage />} />
                
                {/* Statistics routes */}
                <Route path="statistiques" element={<StatisticsPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                
                {/* Shop routes */}
                <Route path="boutique" element={<ShopPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-success" element={<OrderSuccessPage />} />
                
                {/* Cup routes */}
                <Route path="coupe" element={<CupPage />} />
                <Route path="cup" element={<CupPage />} />
                
                {/* Admin routes */}
                <Route path="admin-dashboard" element={<AdminDashboard />} />
                
                {/* Documentation routes */}
                <Route path="documentation" element={<DocumentationPage />} />
                <Route path="documentation-ar" element={<ArabicDocumentationPage />} />
                <Route path="التوثيق" element={<ArabicDocumentationPage />} />
                <Route path="comprehensive-docs" element={<ComprehensiveDocumentationPage />} />
                <Route path="docs-complete" element={<ComprehensiveDocumentationPage />} />
                
                {/* Legal pages */}
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="politique-confidentialite" element={<PrivacyPolicyPage />} />
                <Route path="terms-of-service" element={<TermsOfServicePage />} />
                <Route path="conditions-utilisation" element={<TermsOfServicePage />} />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                },
              }}
            />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
