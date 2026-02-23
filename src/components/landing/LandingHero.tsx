"use client";

import React from 'react';

interface LandingHeroProps {
  onStart: (e: React.MouseEvent) => void;
}

const LandingHero = ({ onStart }: LandingHeroProps) => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-5 md:px-10 py-[140px] md:pb-20 relative overflow-hidden">
      <p className="hero-eyebrow text-xs font-medium tracking-[0.12em] uppercase text-[#888] mb-7 opacity-0 animate-[fadeUp_0.6s_0.1s_forwards]">
        stoic · antifragile · persistent
      </p>
      <h1 className="hero-title text-[clamp(48px,10vw,148px)] font-black leading-[0.9] tracking-[-0.04em] text-white max-w-[900px] opacity-0 animate-[fadeUp_0.7s_0.2s_forwards]">
        build the<br/>discipline.<br/>find the peace.
      </h1>
      <p className="hero-sub text-base text-[#888] max-w-[460px] leading-[1.7] mt-9 tracking-[-0.01em] opacity-0 animate-[fadeUp_0.7s_0.35s_forwards]">
        not a tracker. not a reminder. a curriculum that teaches you how to actually follow through — built on the philosophy of the stoics.
      </p>
      <div className="hero-actions flex items-center gap-4 mt-12 opacity-0 animate-[fadeUp_0.7s_0.5s_forwards]">
        <button onClick={onStart} className="text-sm font-semibold tracking-[-0.02em] text-[#0a0a0a] bg-white px-8 py-3.5 rounded-full hover:opacity-90 hover:-translate-y-px transition-all">
          begin the 30-day challenge
        </button>
        <a href="#philosophy" className="text-sm font-medium tracking-[-0.02em] text-[#bbb] px-6 py-3.5 rounded-full border border-[#222] hover:border-[#555] hover:text-white transition-all">
          learn the philosophy →
        </a>
      </div>
    </section>
  );
};

export default LandingHero;