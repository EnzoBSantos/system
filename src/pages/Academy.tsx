"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { BookOpen, Play, CheckCircle2, Star, Clock, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Academy = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            units (
              *,
              lessons (*)
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        console.error("Academy fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">unlocking knowledge...</span>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-1">
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">academy</h2>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter lowercase">wisdom paths.</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col"
          >
            <div className="aspect-[21/9] relative overflow-hidden">
              <img 
                src={course.image_url || "https://images.unsplash.com/photo-1519681393784-d120267903ae?q=80&w=1200&auto=format&fit=crop"} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                alt={course.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
                  {course.total_xp_available || 0} XP available
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight lowercase">{course.title}</h3>
                <p className="text-zinc-500 text-sm font-medium lowercase line-clamp-2">
                  {course.description || "master the ancient arts of focus and discipline."}
                </p>
              </div>

              <div className="space-y-4 flex-1">
                {course.units?.length > 0 ? (
                  course.units.map((unit: any) => (
                    <div key={unit.id} className="space-y-3">
                      <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2">{unit.title}</h4>
                      <div className="space-y-2">
                        {unit.lessons?.length > 0 ? (
                          unit.lessons.map((lesson: any) => (
                            <button
                              key={lesson.id}
                              onClick={() => navigate(`/lesson/${lesson.id}`)}
                              className="w-full group/lesson flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-2xl hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover/lesson:text-white transition-colors">
                                  <Play size={14} fill="currentColor" />
                                </div>
                                <span className="text-sm font-bold lowercase">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">+{lesson.xp_reward || 0} XP</span>
                            </button>
                          ))
                        ) : (
                          <p className="text-[10px] text-zinc-700 italic px-2">no lessons in this unit yet.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center border border-dashed border-zinc-800 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">path content under construction.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-auto">
                <Button 
                  disabled={!course.units?.[0]?.lessons?.[0]}
                  onClick={() => {
                    const firstLesson = course.units?.[0]?.lessons?.[0];
                    if (firstLesson) navigate(`/lesson/${firstLesson.id}`);
                  }}
                  className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black lowercase text-lg shadow-xl"
                >
                  {course.units?.[0]?.lessons?.[0] ? "start path." : "coming soon."}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-32 border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-800">
              <BookOpen size={40} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">the library is being curated.</p>
              <p className="text-zinc-800 text-sm font-medium">published courses will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academy;