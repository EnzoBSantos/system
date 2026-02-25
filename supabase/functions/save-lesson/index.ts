// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[save-lesson] Function invoked");

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Manual authentication handling
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error("[save-lesson] No authorization header provided");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error("[save-lesson] Auth error:", authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const body = await req.json()
    const { lessonId, courseId, title, content, order } = body
    
    console.log("[save-lesson] Request body received", { lessonId, courseId, title, pageCount: content?.length });

    if (!title || !Array.isArray(content)) {
      console.error("[save-lesson] Validation failed: Title or content missing");
      return new Response(
        JSON.stringify({ error: "Title and content array are required." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let targetUnitId = null;

    // 1. If editing existing lesson, find its unit
    if (lessonId && lessonId !== 'undefined') {
      console.log("[save-lesson] Checking existing lesson unit", lessonId);
      const { data: existingLesson } = await supabaseClient
        .from('lessons')
        .select('unit_id')
        .eq('id', lessonId)
        .maybeSingle();
      
      if (existingLesson?.unit_id) {
        targetUnitId = existingLesson.unit_id;
        console.log("[save-lesson] Found existing unit_id", targetUnitId);
      }
    }

    // 2. If no unit found yet, we need a courseId to find/create one
    if (!targetUnitId && courseId && courseId !== 'null') {
      console.log("[save-lesson] Looking for unit in course", courseId);
      const { data: units } = await supabaseClient
        .from('units')
        .select('id')
        .eq('course_id', courseId)
        .order('order', { ascending: true })
        .limit(1);

      if (units && units.length > 0) {
        targetUnitId = units[0].id;
        console.log("[save-lesson] Using first available unit", targetUnitId);
      } else {
        console.log("[save-lesson] No units found, creating default unit for course", courseId);
        const { data: newUnit, error: unitError } = await supabaseClient
          .from('units')
          .insert({ 
            course_id: courseId, 
            title: 'Module 1', 
            order: 1 
          })
          .select()
          .single();
        
        if (unitError) {
          console.error("[save-lesson] Failed to create unit", unitError.message);
          throw unitError;
        }
        targetUnitId = newUnit.id;
        console.log("[save-lesson] Created new unit", targetUnitId);
      }
    }

    // Prepare data for upsert
    const lessonData: any = {
      title,
      content,
      order: order || 1,
    };

    if (lessonId && lessonId !== 'undefined') lessonData.id = lessonId;
    if (targetUnitId) lessonData.unit_id = targetUnitId;

    console.log("[save-lesson] Upserting lesson data", { id: lessonData.id, unit_id: lessonData.unit_id });

    const { data, error } = await supabaseClient
      .from('lessons')
      .upsert(lessonData)
      .select()
      .single()

    if (error) {
      console.error("[save-lesson] Upsert error:", error.message);
      throw error;
    }

    console.log("[save-lesson] Lesson saved successfully", data.id);

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error("[save-lesson] Critical error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})