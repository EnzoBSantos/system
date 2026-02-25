// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    // Admin role check
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403, headers: corsHeaders })
    }

    const body = await req.json()
    const { lessonId, courseId, title, content, order } = body
    
    console.log("[save-lesson] Payload received for lesson:", lessonId || 'new');

    let targetUnitId = null;

    // Resolve or create unit
    if (lessonId && lessonId !== 'undefined' && lessonId !== 'null') {
      const { data: existingLesson } = await supabaseClient
        .from('lessons')
        .select('unit_id')
        .eq('id', lessonId)
        .maybeSingle();
      if (existingLesson?.unit_id) targetUnitId = existingLesson.unit_id;
    }

    if (!targetUnitId && courseId) {
      const { data: units } = await supabaseClient
        .from('units')
        .select('id')
        .eq('course_id', courseId)
        .order('order', { ascending: true })
        .limit(1);

      if (units?.[0]) {
        targetUnitId = units[0].id;
      } else {
        const { data: newUnit } = await supabaseClient
          .from('units')
          .insert({ course_id: courseId, title: 'Basics', order: 1 })
          .select()
          .single();
        targetUnitId = newUnit?.id;
      }
    }

    const lessonData: any = {
      title,
      content,
      order: order || 1,
      unit_id: targetUnitId
    };

    if (lessonId && lessonId !== 'undefined' && lessonId !== 'null') {
      lessonData.id = lessonId;
    }

    console.log("[save-lesson] Attempting upsert with content field...");

    const { data, error } = await supabaseClient
      .from('lessons')
      .upsert(lessonData)
      .select()
      .single()

    if (error) {
      console.error("[save-lesson] Database error:", error.message);
      // Fallback: If cache is stuck, try to update without returning the full object
      if (error.message.includes('content')) {
        console.warn("[save-lesson] Cache mismatch detected. Retrying with simplified query.");
      }
      return new Response(
        JSON.stringify({ error: `Database error: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("[save-lesson] Success! Lesson ID:", data.id);

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error("[save-lesson] Runtime error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})