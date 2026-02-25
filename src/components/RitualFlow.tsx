"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, ArrowRight, Target, Sparkles, Rocket } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface RitualFlowProps {
  onClose: () => void;
  onSuccess: () => void;
}

const steps = [
  {
    id: 'vision',
    title: 'the vision.',
    description: 'what is the ultimate objective you want to manifest?',
    label: 'main goal title'
  },
  {
    id: 'why',
    title: 'the reason.',
    description: 'why does this matter? connect with the deeper purpose.',
    label: 'the deep why'
  }
];

const RitualFlow = ({ onClose, onSuccess }: RitualFlowProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ title: '', why: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast({ title: "unauthorized", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('goals').insert({
      user_id: userData.user.id,
      title: formData.title,
      why: formData.why,
      status: 'active',
      xp: 0,
      level: 1
    });

    if (error) {
      toast({ title: "error manifesting goal", variant: "destructive" });
    } else {
      toast({ title: "vision architected." });
      onSuccess();
    }
    setLoading(false);
  };

  const currentStep = steps[step];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
    >
      <button 
        onClick={onClose}
        className="absolute top-12 right-12 text-zinc-600 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="max-w-3xl w-full space-y-16">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-black">
            {step === 0 ? <Target size={32} /> : <Sparkles size={32} />}
          </div>
          <div className="h-px flex-1 bg-zinc-900" />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
            step {step + 1} of {steps.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-7xl font-black tracking-tighter lowercase leading-[0.8]">{currentStep.title}</h2>
              <p className="text-2xl text-zinc-500 font-medium lowercase">{currentStep.description}</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{currentStep.label}</label>
              {step === 0 ? (
                <Input 
                  autoFocus
                  value={formData.title}
                  onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                  placeholder="..."
                  className="h-24 bg-transparent border-b-2 border-t-0 border-x-0 border-zinc-800 rounded-none text-4xl font-bold lowercase px-0 focus:ring-0 focus:border-white transition-all placeholder:text-zinc-900"
                />
              ) : (
                <Textarea 
                  autoFocus
                  value={formData.why}
                  onChange={(e) => setFormData(f => ({ ...f, why: e.target.value }))}
                  placeholder="..."
                  className="min-h-[200px] bg-transparent border-b-2 border-t-0 border-x-0 border-zinc-800 rounded-none text-4xl font-bold lowercase px-0 focus:ring-0 focus:border-white transition-all resize-none placeholder:text-zinc-900"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end pt-8">
          <Button 
            disabled={loading || (step === 0 ? !formData.title : !formData.why)}
            onClick={handleNext}
            className="h-20 px-12 rounded-[2.5rem] bg-white text-black hover:bg-zinc-200 text-xl font-black lowercase gap-4 transition-all active:scale-95 shadow-2xl"
          >
            {loading ? "manifesting..." : step === steps.length - 1 ? "manifest vision" : "continue"} <ArrowRight size={24} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RitualFlow;