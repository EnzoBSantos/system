"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Loader2, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useToast } from '@/components/ui/use-toast';
import BlockRenderer from '@/components/learning/BlockRenderer';
import { LessonPage } from '@/types/lesson';

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<any>(null);
  const [pages, setPages] = useState<LessonPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessonData() {
      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*, exercises(*)')
          .eq('id', lessonId)
          .single();

        if (lessonError) throw lessonError;

        setLesson(lessonData);
        
        if (lessonData.content && Array.isArray(lessonData.content) && lessonData.content.length > 0) {
          setPages(lessonData.content);
        } 
        else if (lessonData.exercises && lessonData.exercises.length > 0) {
          const sortedExercises = [...lessonData.exercises].sort((a, b) => a.order - b.order);
          const fetchedPages = sortedExercises.map(ex => ({
            id: ex.id,
            title: ex.content?.title || 'Untitled Page',
            blocks: ex.content?.blocks || []
          }));
          setPages(fetchedPages as any);
        }
      } catch (err: any) {
        toast({ title: "Failed to load lesson", description: err.message, variant: "destructive" });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchLessonData();
  }, [lessonId, navigate, toast]);

  const handleNext = async () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await finishLesson();
    }
  };

  const finishLesson = async () => {
    setCompleted(true);
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 },
      colors: ['#ffffff', '#333333']
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('lesson_completions').insert({
        user_id: user.id,
        lesson_id: lessonId,
        score: 100
      });

      await supabase.rpc('award_karma', { points: lesson?.xp_reward || 50 });
      toast({ title: "ritual complete.", description: `you earned ${lesson?.xp_reward || 50} XP!` });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">drawing wisdom...</span>
    </div>
  );

  if (pages.length === 0) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <p className="text-zinc-500">This lesson has no pages yet.</p>
      <Button onClick={() => navigate('/dashboard')}>Go Back</Button>
    </div>
  );

  const progress = ((currentPageIndex + 1) / pages.length) * 100;
  const activePage = pages[currentPageIndex];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900/20 to-black pointer-events-none" />

      <header className="relative z-50 p-6 md:p-10 flex items-center gap-6 max-w-4xl mx-auto w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-zinc-500 hover:text-white rounded-full">
          <X size={24} />
        </Button>
        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 20 }}
          />
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{currentPageIndex + 1}/{pages.length}</span>
      </header>

      <main className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={activePage.id || currentPageIndex}
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              className="space-y-4"
            >
              {activePage.blocks.map((block, bIdx) => (
                <BlockRenderer 
                  key={bIdx} 
                  block={block} 
                  onAction={handleNext} 
                />
              ))}

              {!activePage.blocks.some(b => b.type.toLowerCase() === 'button') && (
                <div className="pt-8">
                  <Button 
                    onClick={handleNext}
                    className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-zinc-200 text-2xl font-black tracking-tight lowercase shadow-xl"
                  >
                    Continue <ArrowRight size={24} className="ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-12 py-12"
            >
              <div className="space-y-6">
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                  <Trophy size={48} className="text-black" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter lowercase">ritual complete.</h2>
              </div>
              <Button onClick={() => navigate('/dashboard')} className="w-full h-20 rounded-[2rem] bg-white text-black font-black text-2xl lowercase">Return to Sanctuary</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonView;