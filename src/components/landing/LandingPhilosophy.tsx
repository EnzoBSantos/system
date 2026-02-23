"use client";

import React from 'react';

const LandingPhilosophy = () => {
  return (
    <section id="philosophy" className="px-5 md:px-10 py-24 md:pt-[120px]">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#888] mb-5 reveal">the foundation</p>
      <h2 className="text-[clamp(32px,6vw,80px)] font-black tracking-[-0.04em] leading-[0.95] text-white max-w-[680px] reveal d1">
        you don't lack tools.<br/>you lack a system.
      </h2>
      <p className="text-[15px] text-[#888] max-w-[480px] leading-[1.7] mt-5 tracking-[-0.01em] reveal d2">
        most apps give you lists and timers. aura gives you something rarer — the knowledge of how to actually follow through. we teach the inner architecture of a productive life, one day at a time.
      </p>

      <div className="grid md:grid-cols-3 gap-3 mt-14">
        {[
          { title: 'stoic clarity.', text: 'focus only on what is within your control. aura teaches you to separate intention from distraction so every single action carries real weight.' },
          { title: 'antifragile habits.', text: "habits that collapse under pressure aren't real habits. you'll build routines that grow stronger through setbacks — not despite them." },
          { title: 'persistent action.', text: 'motivation is fleeting. discipline is forged. aura trains the slow, relentless consistency that creates irreversible change over time.' }
        ].map((card, i) => (
          <div key={card.title} className={`bg-[#141414] border border-[#222] rounded-[20px] p-8 md:p-9 hover:bg-[#1a1a1a] hover:-translate-y-0.5 transition-all reveal d${i}`}>
            <div className="w-10 h-10 bg-[#222] rounded-xl flex items-center justify-center mb-6">
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/></svg>
            </div>
            <div className="text-xl font-extrabold tracking-[-0.03em] text-white mb-2.5">{card.title}</div>
            <p className="text-[13px] leading-[1.7] text-[#888] font-normal">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPhilosophy;