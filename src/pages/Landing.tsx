"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingDashboardPreview from '@/components/landing/LandingDashboardPreview';
import LandingPhilosophy from '@/components/landing/LandingPhilosophy';
import LandingFAQ from '@/components/landing/LandingFAQ';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Efeito de scroll para a Nav
    const handleScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Observador para efeitos de revelação (reveal)
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    
    reveals.forEach(r => obs.observe(r));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      obs.disconnect();
    };
  }, []);

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="landing-wrapper">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-wrapper {
          background: #0a0a0a;
          color: white;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          overflow-x: hidden;
          min-height: 100vh;
        }

        nav.scrolled {
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(16px);
          border-color: #222 !important;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible { opacity: 1; transform: none; }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.2s; }
        .d3 { transition-delay: 0.3s; }
      `}</style>

      <LandingNav onStart={handleStart} />
      
      <main>
        <LandingHero onStart={handleStart} />
        <LandingDashboardPreview />
        <LandingPhilosophy />
        
        {/* Seção 30-Day Challenge (Simplificada) */}
        <section id="challenge" className="bg-[#141414] px-5 md:px-10 py-24">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#888] mb-5 reveal">the 30-day curriculum</p>
              <h2 className="text-[clamp(32px,6vw,80px)] font-black tracking-[-0.04em] leading-[0.95] text-white max-w-[680px] reveal d1">
                learn to live<br/>intentionally.
              </h2>
              <p className="text-[15px] text-[#888] max-w-[480px] leading-[1.7] mt-5 reveal d2">
                each week builds on the last. by day 30, the system isn't something you use — it's something you are.
              </p>

              <div className="mt-10 space-y-0">
                {[
                  { week: 'week 01', title: 'foundation — know yourself.', desc: 'audit your time, energy and values. build your first real morning ritual.' },
                  { week: 'week 02', title: 'architecture — build the plan.', desc: 'break any goal into a sequence of daily, non-negotiable actions.' }
                ].map((item, i) => (
                  <div key={i} className={`py-7 border-b border-[#222] ${i === 0 ? 'border-t' : ''} reveal d${i}`}>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#444] bg-[#222] rounded-full px-2.5 py-1">{item.week}</span>
                      <span className="text-lg font-extrabold tracking-[-0.03em] text-white">{item.title}</span>
                    </div>
                    <p className="text-xs leading-[1.7] text-[#888]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <LandingFAQ />
      </main>

      {/* Footer Simples */}
      <footer className="border-t border-[#222] px-5 md:px-10 py-14">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4"><path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <span className="text-lg font-black tracking-[-0.04em] text-white">aura.</span>
          </div>
          <p className="text-xs text-[#444] font-medium italic">"amor fati — love your fate."</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;