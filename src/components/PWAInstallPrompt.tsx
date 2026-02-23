"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, Zap, CloudOff, Bell, Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIos ? 'ios' : 'android');

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setIsVisible(true), 2000);
    };

    if (isIos) {
      setTimeout(() => setIsVisible(true), 2000);
    } else {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const benefits = [
    { icon: Zap, label: 'faster loading' },
    { icon: CloudOff, label: 'works offline' },
    { icon: Bell, label: 'notifications' },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={() => setIsVisible(false)}
        />
        
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden relative"
        >
          <div className="absolute top-6 right-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsVisible(false)}
              className="text-zinc-500 hover:text-white rounded-full h-10 w-10"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="p-8 pt-12 space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg">
                <Bird className="text-black" size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter lowercase">pillar.</h3>
                <p className="text-zinc-500 font-medium text-sm lowercase leading-tight">install for the best experience.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.label}
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full"
                >
                  <benefit.icon size={14} className="text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">{benefit.label}</span>
                </div>
              ))}
            </div>

            {platform === 'ios' ? (
              <div className="bg-white/5 rounded-3xl p-6 space-y-4 border border-white/5">
                <p className="text-sm font-bold lowercase text-zinc-400 text-center">ios installation guide:</p>
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                      <Share size={18} className="text-blue-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">1. tap share</span>
                  </div>
                  <div className="w-8 h-px bg-zinc-800" />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                      <PlusSquare size={18} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">2. add to home</span>
                  </div>
                  <div className="w-8 h-px bg-zinc-800" />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-black font-black text-xs">add</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">3. confirm</span>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleInstall}
                className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xl h-16 rounded-[1.5rem] tracking-tight lowercase transition-transform active:scale-95 shadow-xl"
              >
                install pillar.
              </Button>
            )}

            <button 
              onClick={() => setIsVisible(false)}
              className="w-full text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors py-2"
            >
              maybe later
            </button>
          </div>
          
          <div className="h-2 w-full bg-gradient-to-r from-zinc-800 via-white/20 to-zinc-800" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;