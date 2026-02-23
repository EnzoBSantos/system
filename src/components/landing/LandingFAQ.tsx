"use client";

import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  delay?: string;
}

const FAQItem = ({ question, answer, isOpen, onClick, delay }: FAQItemProps) => (
  <div className={`border-t border-[#222] py-7 cursor-pointer reveal ${delay}`} onClick={onClick}>
    <div className="text-[17px] font-bold tracking-[-0.02em] text-white flex justify-between items-center gap-6">
      {question} 
      <span className={`text-xl text-[#888] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
    </div>
    <div className={`text-[13px] leading-[1.8] text-[#888] overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 mt-4' : 'max-h-0'}`}>
      {answer}
    </div>
  </div>
);

const LandingFAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    { q: "is this just another task manager?", a: "no. aura has no to-do lists, no reminders, no streaks to obsess over. it's a structured curriculum that teaches you the principles of a productive life." },
    { q: "i've tried everything. why would this work?", a: "because most systems treat symptoms, not causes. aura addresses why people fail to follow through and teaches you to fix each one permanently." }
  ];

  return (
    <section id="faq" className="px-5 md:px-10 py-24">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#888] mb-5 reveal">questions</p>
      <h2 className="text-[clamp(32px,6vw,80px)] font-black tracking-[-0.04em] leading-[0.95] text-white max-w-[680px] reveal d1">
        frequently<br/>asked.
      </h2>
      <div className="mt-14 max-w-[720px]">
        {faqs.map((faq, i) => (
          <FAQItem 
            key={i}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            delay={`d${i}`}
          />
        ))}
      </div>
    </section>
  );
};

export default LandingFAQ;