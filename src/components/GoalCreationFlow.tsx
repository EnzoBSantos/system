"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Target, Heart, Search, Ruler, Footprints, Anchor, Calendar, Rocket, Sparkles, Lightbulb, Loader2, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';

interface GoalCreationFlowProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Moved outside to prevent re-creation and re-animation on every keystroke
const GoalContextPreview = ({ title }: { title: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-10 p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl"
  >
    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">current objective</p>
    <p className="text-xl font-bold tracking-tight text-white">{title}</p>
  </motion.div>
);

const StepTip = ({ title, text }: { title: string, text: string }) => (
  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-3 mt-6">
    <Lightbulb className="text-zinc-400 shrink-0" size={16} />
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">{title}</p>
      <p className="text-xs text-zinc-500 font-medium lowercase">{text}</p>
    </div>
  </div>
);

const GoalCreationFlow = ({ onClose, onSuccess }: GoalCreationFlowProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    why: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    deadline: '',
    requirements: [] as any[]
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, { title: '', first_action: '', weekly_commitment: '', deadline: '' }]
    }));
  };

  const updateRequirement = (index: number, field: string, value: string) => {
    const updated = [...formData.requirements];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, requirements: updated }));
  };

  const removeRequirement = (index: number) => {
    const updated = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, requirements: updated }));
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "session expired", description: "please log in again.", variant: "destructive" });
        return;
      }

      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .insert([{
          user_id: user.id,
          title: formData.title,
          why: formData.why,
          specific: formData.specific || '',
          measurable: formData.measurable || '',
          achievable: formData.achievable || '',
          relevant: formData.relevant || '',
          deadline: formData.deadline || null,
          xp: 100,
          level: 1,
          status: 'active'
        }])
        .select()
        .single();

      if (goalError) throw goalError;

      if (formData.requirements.length > 0) {
        const validReqs = formData.requirements
          .filter(r => r.title.trim() !== '')
          .map(r => ({
            goal_id: goalData.id,
            title: r.title,
            first_action: r.first_action || '',
            weekly_commitment: r.weekly_commitment || '',
            deadline: r.deadline || null,
            is_completed: false
          }));

        if (validReqs.length > 0) {
          const { error: reqError } = await supabase.from('goal_requirements').insert(validReqs);
          if (reqError) throw reqError;
        }
      }

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#a1a1aa']
      });

      toast({ title: "plan activated.", description: "your future starts now." });
      
      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (error: any) {
      console.error("Save error:", error);
      toast({ 
        title: "failed to save goal", 
        description: error.message || "check your database tables.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="p-6 md:p-10">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-zinc-500 hover:text-white">
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-12 text-right">
            {step}/{totalSteps}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="max-w-2xl mx-auto py-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center">
                    <Target size={32} className="text-black" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter lowercase">what is your main goal?</h2>
                  <p className="text-zinc-500 font-medium">start with the end in mind. be bold and concise.</p>
                </div>
                <div className="space-y-2">
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Launch my startup"
                    className="h-20 text-3xl font-bold bg-transparent border-b-2 border-t-0 border-x-0 border-zinc-800 focus:border-white rounded-none px-0 tracking-tight outline-none ring-0 focus-visible:ring-0"
                  />
                </div>
                <StepTip title="pro tip" text="the best goals are specific. instead of 'be healthy', try 'run a 5k in under 25 minutes'." />
                <Button disabled={!formData.title} onClick={nextStep} className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xl font-bold lowercase">continue</Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <GoalContextPreview title={formData.title} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center">
                    <Heart size={32} className="text-white" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter lowercase">why does this matter?</h2>
                  <p className="text-zinc-500 font-medium">strong reasons create strong execution.</p>
                </div>
                <Textarea 
                  value={formData.why}
                  onChange={(e) => setFormData({...formData, why: e.target.value})}
                  placeholder="this goal matters to me because..."
                  className="min-h-[200px] text-xl bg-zinc-900/50 border-zinc-800 rounded-3xl p-8 focus:border-white"
                />
                <StepTip title="think deeper" text="don't just say 'to make money'. ask yourself why that money matters—is it for freedom? for your family?" />
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={prevStep} className="h-16 px-8 rounded-2xl text-zinc-500 font-bold lowercase">back</Button>
                  <Button disabled={!formData.why} onClick={nextStep} className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xl font-bold lowercase">continue</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <GoalContextPreview title={formData.title} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center">
                    <Calendar size={32} className="text-white" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter lowercase">when is the deadline?</h2>
                  <p className="text-zinc-500 font-medium">a goal is just a dream with a deadline.</p>
                </div>
                <div className="space-y-4">
                  <Input 
                    type="date"
                    value={formData.deadline} 
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="h-20 text-3xl font-bold bg-transparent border-b-2 border-t-0 border-x-0 border-zinc-800 focus:border-white rounded-none px-0 tracking-tight outline-none ring-0 focus-visible:ring-0"
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={prevStep} className="h-16 px-8 rounded-2xl text-zinc-500 font-bold lowercase">back</Button>
                  <Button disabled={!formData.deadline} onClick={nextStep} className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xl font-bold lowercase">continue</Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <GoalContextPreview title={formData.title} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter lowercase">pillars of success.</h2>
                  <p className="text-zinc-500 font-medium">what big milestones must be true for this goal to happen?</p>
                </div>
                <div className="space-y-4">
                  {formData.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-4">
                      <Input 
                        value={req.title}
                        onChange={(e) => updateRequirement(idx, 'title', e.target.value)}
                        placeholder="e.g. Finish first draft, run 10km, find a mentor"
                        className="h-14 bg-zinc-900 border-zinc-800 rounded-2xl px-6 focus:border-white"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeRequirement(idx)} className="h-14 w-14 rounded-2xl text-zinc-500 hover:text-red-500">
                        <X size={20} />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addRequirement} className="w-full h-14 rounded-2xl border-dashed border-zinc-800 text-zinc-500 hover:text-white hover:border-white lowercase">+ add requirement</Button>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={prevStep} className="h-16 px-8 rounded-2xl text-zinc-500 font-bold lowercase">back</Button>
                  <Button disabled={formData.requirements.length === 0} onClick={nextStep} className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xl font-bold lowercase">continue</Button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <GoalContextPreview title={formData.title} />
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter lowercase">action blueprints.</h2>
                  <p className="text-zinc-500 font-medium">detail the plan for each requirement.</p>
                </div>
                <div className="space-y-12">
                  {formData.requirements.map((req, idx) => (
                    <div key={idx} className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 space-y-6">
                      <h4 className="text-xl font-black lowercase flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                        {req.title}
                      </h4>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">first action</label>
                          <Input 
                            value={req.first_action} 
                            onChange={(e) => updateRequirement(idx, 'first_action', e.target.value)}
                            placeholder="e.g. Buy running shoes, open new doc"
                            className="h-12 bg-zinc-800 border-zinc-700 rounded-xl px-4"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">weekly commitment</label>
                          <Input 
                            value={req.weekly_commitment} 
                            onChange={(e) => updateRequirement(idx, 'weekly_commitment', e.target.value)}
                            placeholder="e.g. 5 hours, 3 sessions"
                            className="h-12 bg-zinc-800 border-zinc-700 rounded-xl px-4"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={prevStep} className="h-16 px-8 rounded-2xl text-zinc-500 font-bold lowercase">back</Button>
                  <Button onClick={nextStep} className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xl font-bold lowercase">continue</Button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-12 text-center">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <Rocket size={48} className="text-black" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter lowercase">ready to commit?</h2>
                  <p className="text-zinc-500 font-medium">this goal will be added to your active path.</p>
                </div>
                <div className="bg-zinc-900/50 p-10 rounded-[3rem] border border-zinc-800 text-left space-y-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">primary objective</p>
                    <h3 className="text-3xl font-black leading-tight">{formData.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">requirements</p>
                      <p className="text-2xl font-black">{formData.requirements.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">deadline</p>
                      <p className="text-xl font-black text-white">{formData.deadline || 'not set'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button 
                    disabled={loading}
                    onClick={handleComplete}
                    className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-zinc-200 text-2xl font-black tracking-tight lowercase shadow-xl active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "🔥 start execution"}
                  </Button>
                  <Button variant="ghost" onClick={prevStep} className="text-zinc-500 font-bold lowercase">i need to change something</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GoalCreationFlow;