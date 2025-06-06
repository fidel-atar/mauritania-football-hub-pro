
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Matches from "@/pages/Matches";
import News from "@/pages/News";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import Cup from "@/pages/Cup";
import Standings from "@/pages/Standings";
import Shop from "@/pages/Shop";
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
              <Route path="/matches" element={<Matches />} />
              <Route path="/news" element={<News />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/cup" element={<Cup />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/shop" element={<Shop />} />
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
