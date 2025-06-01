
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { useEffect, useState } from "react";
import AdminApp from "./pages/AdminApp";

const queryClient = new QueryClient();

function App() {
  const [isAdminApp, setIsAdminApp] = useState(false);

  useEffect(() => {
    // Check if this is the admin subdomain or path
    const isAdmin = window.location.pathname.startsWith('/admin') || 
                   window.location.hostname.startsWith('admin.');
    setIsAdminApp(isAdmin);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminApp />} />
            
            {/* Main app routes */}
            <Route path="/*" element={<Index />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
