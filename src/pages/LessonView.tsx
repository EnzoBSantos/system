"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Loader2, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useToast } from '@/components/ui/use-toast';
import BlockRenderer from '@/components/learning/BlockRenderer';
import { LessonPage } from '@/types/lesson-builder';

// Mock data matching the builder's Atomic Habits demo
const MOCK_PAGES: LessonPage[] = [
  {
    id: '1',
    title: 'The 1% Rule',
    blocks: [
      { id: 'b1', type: 'HEADING', content: 'Small Steps, Big Results' },
      { id: 'b2', type: 'TEXT', content: 'Forget about big changes. If you get 1% better each day for one year, you’ll end up thirty-seven times better by the time you’re done.' },
      { id: 'b3', type: 'IMAGE', content: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop' },
      { id: 'b4', type: 'BUTTON', content: 'Proceed to Mastery' }
    ]
  },
  {
    id: '2',
    title: 'Identity over Outcomes',
    blocks: [
      { id: 'b5', type: 'HEADING', content: 'Identity-Based Habits' },
      { id: 'b6', type: 'TEXT', content: 'The ultimate form of intrinsic motivation is when a habit becomes part of your identity. It’s one thing to say I’m the type of person who wants this. It’s something quite different to say I’m the type of person who is this.' },
      { id: 'b7', type: 'BUTTON', content: 'Continue Flow' }
    ]
  }
];

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<any>(null);
  const [pages, setPages] = useState<LessonPage[]>(MOCK_PAGES);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessonData() {
      // In a real app, you'd fetch the pages and blocks from the DB here
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*, units(course_id)')
        .eq('id', lessonId)
        .single();

      setLesson(lessonData || { title: 'Atomic Rituals', xp_reward: 50 });
      setLoading(false);
    }
    fetchLessonData();
  }, [lessonId]);

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
      // Record completion
      await supabase.from('lesson_completions').insert({
        user_id: user.id,
        lesson_id: lessonId,
        score: 100
      });

      // Update XP
      await supabase.rpc('award_karma', { points: lesson?.xp_reward || 50 });
      
      toast({ title: "ritual complete.", description: `you earned ${lesson?.xp_reward || 50} XP!` });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-white" size={32} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">drawing wisdom...</span>
    </div>
  );

  const progress = ((currentPageIndex) / pages.length) * 100;
  const activePage = pages[currentPageIndex];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Immersive Background Gradient */}
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
              key={activePage.id}
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-4"
            >
              {activePage.blocks.map((block) => (
                <BlockRenderer 
                  key={block.id} 
                  block={block} 
                  onAction={handleNext} 
                />
              ))}

              {/* Automatic Fallback Button if creator forgot to add one */}
              {!activePage.blocks.some(b => b.type === 'BUTTON') && (
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
                <div className="space-y-3">
                  <h2 className="text-5xl font-black tracking-tighter lowercase">ritual complete.</h2>
                  <p className="text-zinc-500 font-medium text-lg">you've integrated these principles into your pillar.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] grid grid-cols-2 gap-8 shadow-2xl">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">XP achieved</p>
                  <p className="text-4xl font-black">+{lesson?.xp_reward || 50}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">status</p>
                  <p className="text-4xl font-black text-white">mastered</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-zinc-200 font-black text-2xl lowercase shadow-xl active:scale-95 transition-all"
              >
                Return to Sanctuary
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonView;