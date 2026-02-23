"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">aligning aura...</span>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <SpeedInsights />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            {/* Handle Root Path */}
            <Route 
              path="/" 
              element={<Navigate to={session ? "/home" : "/login"} replace />} 
            />
            
            {/* Protected Home Route */}
            <Route 
              path="/home" 
              element={session ? <Index /> : <Navigate to="/login" replace />} 
            />
            
            {/* Public Login Route */}
            <Route 
              path="/login" 
              element={!session ? <Login /> : <Navigate to="/home" replace />} 
            />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;