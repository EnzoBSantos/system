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
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Usamos .maybeSingle() em vez de .single() para evitar o erro de 'JSON coercion'
        // se o registro não existir.
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("[useAdmin] Query error:", error.message);
          setIsAdmin(false);
        } else if (!profile) {
          console.log("[useAdmin] Profile record missing for user:", user.id);
          setIsAdmin(false);
        } else {
          console.log("[useAdmin] Current role:", profile.role);
          setIsAdmin(profile.role === 'admin');
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