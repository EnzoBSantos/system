"use client";

import React from 'react';

interface LandingNavProps {
  onStart: (e: React.MouseEvent) => void;
}

const LandingNav = ({ onStart }: LandingNavProps) => {
  return (
    <nav id="nav" className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10 py-5 transition-all duration-300 border-b border-transparent">
      <a href="#" className="flex items-center gap-2.5 text-white no-underline">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0">
          <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
            <path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-[22px] font-extrabold tracking-[-0.04em]">aura.</span>
      </a>
      <ul className="hidden md:flex gap-9 list-none">
        <li><a href="#philosophy" className="text-[13px] text-[#888] hover:text-white transition-colors">philosophy</a></li>
        <li><a href="#challenge" className="text-[13px] text-[#888] hover:text-white transition-colors">30-day</a></li>
        <li><a href="#how" className="text-[13px] text-[#888] hover:text-white transition-colors">how it works</a></li>
        <li><a href="#faq" className="text-[13px] text-[#888] hover:text-white transition-colors">faq</a></li>
      </ul>
      <button 
        onClick={onStart} 
        className="text-[13px] font-semibold tracking-[-0.02em] text-[#0a0a0a] bg-white px-[22px] py-2.5 rounded-full hover:opacity-90 hover:-translate-y-px transition-all"
      >
        start now
      </button>
    </nav>
  );
};

export default LandingNav;