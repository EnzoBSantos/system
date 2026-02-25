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
    console.log("[save-lesson] Function invoked");

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

    // Role check: Only admins can save lessons
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      console.error("[save-lesson] User is not an admin", user.id);
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403, headers: corsHeaders })
    }

    const body = await req.json()
    const { lessonId, courseId, title, content, order } = body
    
    if (!title || !Array.isArray(content)) {
      return new Response(
        JSON.stringify({ error: "Title and content array are required." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let targetUnitId = null;

    if (lessonId && lessonId !== 'undefined') {
      const { data: existingLesson } = await supabaseClient
        .from('lessons')
        .select('unit_id')
        .eq('id', lessonId)
        .maybeSingle();
      
      if (existingLesson?.unit_id) {
        targetUnitId = existingLesson.unit_id;
      }
    }

    if (!targetUnitId && courseId && courseId !== 'null') {
      const { data: units } = await supabaseClient
        .from('units')
        .select('id')
        .eq('course_id', courseId)
        .order('order', { ascending: true })
        .limit(1);

      if (units && units.length > 0) {
        targetUnitId = units[0].id;
      } else {
        const { data: newUnit, error: unitError } = await supabaseClient
          .from('units')
          .insert({ 
            course_id: courseId, 
            title: 'Module 1', 
            order: 1 
          })
          .select()
          .single();
        
        if (unitError) throw unitError;
        targetUnitId = newUnit.id;
      }
    }

    const lessonData: any = {
      title,
      content,
      order: order || 1,
    };

    if (lessonId && lessonId !== 'undefined') lessonData.id = lessonId;
    if (targetUnitId) lessonData.unit_id = targetUnitId;

    const { data, error } = await supabaseClient
      .from('lessons')
      .upsert(lessonData)
      .select()
      .single()

    if (error) throw error;

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