"use client";

import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("[useAdmin] No user found in session.");
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("[useAdmin] Error fetching profile:", error.message);
          setIsAdmin(false);
        } else {
          console.log("[useAdmin] Current role:", profile?.role);
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (err) {
        console.error("[useAdmin] Unexpected error:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, []);

  return { isAdmin, loading };
}