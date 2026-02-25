"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Loader2, Trophy } from 'lucide-react';
import ExerciseCard from '../components/learning/ExerciseCard';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useToast } from '@/components/ui/use-toast';

const LessonView = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchLessonData() {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*, units(course_id)')
        .eq('id', lessonId)
        .single();

      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order', { ascending: true });

      setLesson(lessonData);
      setExercises(exercisesData || []);
      setLoading(false);
    }
    fetchLessonData();
  }, [lessonId]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) setScore(s => s + 1);

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await finishLesson();
    }
  };

  const finishLesson = async () => {
    setCompleted(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('lesson_completions').insert({
        user_id: user.id,
        lesson_id: lessonId,
        score: Math.round((score / exercises.length) * 100)
      });

      toast({ title: "lesson completed.", description: `you earned ${lesson.xp_reward} XP!` });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-white" size={32} />
    </div>
  );

  const progress = ((currentIndex) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="p-6 md:p-10 flex items-center gap-6 max-w-4xl mx-auto w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-zinc-500 hover:text-white">
          <X size={24} />
        </Button>
        <Progress value={progress} className="h-3 bg-zinc-900" />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{currentIndex + 1}/{exercises.length}</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <ExerciseCard 
                exercise={exercises[currentIndex]} 
                onAnswer={handleAnswer} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
                <Trophy size={48} className="text-black" />
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter lowercase">lesson complete.</h2>
                <p className="text-zinc-500 font-medium">you're building a stronger pillar.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">XP earned</p>
                  <p className="text-3xl font-black">+{lesson.xp_reward}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Accuracy</p>
                  <p className="text-3xl font-black">{Math.round((score / exercises.length) * 100)}%</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-xl lowercase"
              >
                continue journey.
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonView;