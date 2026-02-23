"use client";

import React from 'react';

const LandingDashboardPreview = () => {
  return (
    <div className="dashboard-preview mx-5 md:mx-10 bg-[#141414] rounded-2xl border border-[#222] overflow-hidden opacity-0 animate-[fadeUp_0.8s_0.7s_forwards] reveal">
      <div className="bg-[#111] px-5 py-3.5 flex items-center gap-2 border-b border-[#222]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
      </div>
      <div className="grid md:grid-cols-[200px_1fr] min-h-[420px]">
        {/* Sidebar Mock */}
        <div className="hidden md:flex flex-col gap-1 bg-[#0f0f0f] border-r border-[#222] p-4 pt-6">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 18 18" fill="none" className="w-3.5 h-3.5"><path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <span className="text-[15px] font-black tracking-[-0.04em]">aura.</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-white text-[#0a0a0a]">
            daily
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#888]">
            rituals
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#888]">
            focus
          </div>
          <div className="mt-auto bg-[#1a1a1a] rounded-xl p-4">
            <div className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#444] mb-2">inspiration</div>
            <div className="text-[13px] font-medium italic text-white leading-[1.5]">"what you think, you become."</div>
          </div>
        </div>

        {/* Main Content Mock */}
        <div className="p-8">
          <div className="text-[42px] font-black tracking-[-0.04em] text-white leading-none mb-1.5">good morning.</div>
          <div className="text-[13px] text-[#888] mb-7">monday, february 23rd.</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'progress', val: '50%' },
              { label: 'rituals', val: '1/2' },
              { label: 'focus', val: '0' },
              { label: 'streak', val: '1' }
            ].map((s) => (
              <div key={s.label} className="bg-[#1c1c1c] rounded-2xl p-4">
                <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-[#888] mb-2.5 flex justify-between">
                  <span>{s.label}</span>
                </div>
                <div className="text-2xl font-extrabold tracking-[-0.04em] text-white">{s.val}</div>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1fr_200px] gap-3">
            <div className="bg-[#1c1c1c] rounded-2xl p-5">
              <div className="text-[15px] font-black tracking-[-0.03em] mb-4">weekly flow.</div>
              <div className="flex items-end gap-2 h-16">
                <div className="flex-1 bg-[#2a2a2a] rounded-[4px] h-[30%]"></div>
                <div className="flex-1 bg-[#555] rounded-[4px] h-[60%]"></div>
                <div className="flex-1 bg-[#2a2a2a] rounded-[4px] h-[20%]"></div>
                <div className="flex-1 bg-white rounded-[4px] h-[85%]"></div>
                <div className="flex-1 bg-[#2a2a2a] rounded-[4px] h-[10%]"></div>
                <div className="flex-1 bg-[#2a2a2a] rounded-[4px] h-[5%]"></div>
                <div className="flex-1 bg-[#555] rounded-[4px] h-[45%]"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e0e0e0" strokeWidth="5" fill="none"/>
                  <circle cx="40" cy="40" r="32" stroke="#0a0a0a" strokeWidth="5" fill="none" strokeDasharray="201" strokeDashoffset="100" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-[#0a0a0a] tracking-tight">50%</span>
                </div>
              </div>
              <div className="text-[13px] font-black tracking-tight text-[#0a0a0a]">keep growing.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingDashboardPreview;