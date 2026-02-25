"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import LessonView from "./pages/LessonView";
import AdminCourses from "./pages/admin/Courses";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">aligning pillar...</span>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/login" replace />} 
            />
            
            <Route 
              path="/login" 
              element={!session ? <Login /> : <Navigate to="/dashboard" replace />} 
            />
            
            <Route 
              path="/dashboard" 
              element={session ? <Index /> : <Navigate to="/login" replace />} 
            />

            <Route 
              path="/lesson/:lessonId" 
              element={session ? <LessonView /> : <Navigate to="/login" replace />} 
            />

            <Route 
              path="/admin/courses" 
              element={session ? <AdminCourses /> : <Navigate to="/login" replace />} 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;