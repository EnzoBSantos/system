"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Nav scroll effect
    const handleScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Scroll reveal
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

  const toggleFaq = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="landing-wrapper">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #0a0a0a;
          --card: #141414;
          --card-hover: #1a1a1a;
          --border: #222;
          --white: #ffffff;
          --off-white: #f5f5f5;
          --grey: #888;
          --grey-dim: #444;
          --grey-light: #bbb;
        }

        .landing-wrapper {
          background: var(--black);
          color: var(--white);
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          transition: background 0.3s, border-color 0.3s;
          border-bottom: 1px solid transparent;
        }
        nav.scrolled {
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(16px);
          border-color: var(--border);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: var(--white);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-logo-icon svg { width: 18px; height: 18px; }
        .nav-logo-text {
          font-size: 22px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.04em;
        }
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }
        .nav-links a {
          font-size: 13px;
          font-weight: 400;
          color: var(--grey);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: -0.01em;
        }
        .nav-links a:hover { color: var(--white); }
        .nav-cta {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--black);
          background: var(--white);
          padding: 10px 22px;
          border-radius: 100px;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 140px 40px 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-eyebrow {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--grey);
          margin-bottom: 28px;
          opacity: 0;
          animation: fadeUp 0.6s 0.1s forwards;
        }
        .hero-title {
          font-size: clamp(72px, 10vw, 148px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: var(--white);
          max-width: 900px;
          opacity: 0;
          animation: fadeUp 0.7s 0.2s forwards;
        }
        .hero-sub {
          font-size: 16px;
          font-weight: 400;
          color: var(--grey);
          max-width: 460px;
          line-height: 1.7;
          margin-top: 36px;
          letter-spacing: -0.01em;
          opacity: 0;
          animation: fadeUp 0.7s 0.35s forwards;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 48px;
          opacity: 0;
          animation: fadeUp 0.7s 0.5s forwards;
        }
        .btn-white {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--black);
          background: var(--white);
          padding: 14px 32px;
          border-radius: 100px;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .btn-white:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-outline {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--grey-light);
          padding: 14px 24px;
          border-radius: 100px;
          text-decoration: none;
          border: 1px solid var(--border);
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-outline:hover { border-color: #555; color: var(--white); }

        /* DASHBOARD PREVIEW */
        .dashboard-preview {
          margin: 0 40px;
          background: var(--card);
          border-radius: 20px;
          border: 1px solid var(--border);
          overflow: hidden;
          opacity: 0;
          animation: fadeUp 0.8s 0.7s forwards;
        }
        .dash-bar {
          background: #111;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border);
        }
        .dash-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #333;
        }
        .dash-inner {
          display: grid;
          grid-template-columns: 200px 1fr;
          min-height: 420px;
        }
        .dash-sidebar {
          background: #0f0f0f;
          border-right: 1px solid var(--border);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dash-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          padding: 0 8px;
        }
        .dash-sidebar-logo .icon {
          width: 28px; height: 28px;
          background: var(--white);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .dash-sidebar-logo .icon svg { width: 14px; height: 14px; }
        .dash-sidebar-logo span {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--grey);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .dash-nav-item.active {
          background: var(--white);
          color: var(--black);
        }
        .dash-nav-item svg { width: 14px; height: 14px; flex-shrink: 0; }
        .dash-inspiration {
          margin-top: auto;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 16px;
        }
        .dash-inspiration .tag {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--grey-dim);
          margin-bottom: 8px;
        }
        .dash-inspiration .quote {
          font-size: 13px;
          font-weight: 500;
          font-style: italic;
          color: var(--white);
          line-height: 1.5;
        }
        .dash-main {
          padding: 32px;
        }
        .dash-greeting {
          font-size: 42px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--white);
          line-height: 1;
          margin-bottom: 6px;
        }
        .dash-date {
          font-size: 13px;
          color: var(--grey);
          font-weight: 400;
          margin-bottom: 28px;
        }
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .dash-stat-card {
          background: #1c1c1c;
          border-radius: 14px;
          padding: 16px 18px;
        }
        .dash-stat-card .label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--grey);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dash-stat-card .val {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--white);
        }
        .dash-bottom {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 12px;
        }
        .dash-flow-card {
          background: #1c1c1c;
          border-radius: 14px;
          padding: 20px 22px;
        }
        .dash-flow-card .title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }
        .flow-bars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 60px;
        }
        .flow-bar {
          flex: 1;
          border-radius: 4px;
          background: #2a2a2a;
        }
        .flow-bar.active { background: var(--white); }
        .flow-bar.med { background: #555; }
        .flow-days {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .flow-day {
          flex: 1;
          font-size: 9px;
          font-weight: 500;
          color: var(--grey-dim);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dash-ring-card {
          background: var(--white);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .ring-wrap {
          position: relative;
          width: 80px; height: 80px;
          margin-bottom: 12px;
        }
        .ring-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ring-pct {
          font-size: 15px;
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .ring-sub {
          font-size: 7px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
        }
        .ring-card-title {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--black);
          line-height: 1.2;
        }
        .ring-card-sub {
          font-size: 10px;
          color: #888;
          margin-top: 4px;
          line-height: 1.4;
        }

        /* SECTIONS */
        section { padding: 100px 40px; }
        .label-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--grey);
          margin-bottom: 20px;
        }
        h2 {
          font-size: clamp(42px, 6vw, 80px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.95;
          color: var(--white);
          max-width: 680px;
        }
        .body-text {
          font-size: 15px;
          font-weight: 400;
          color: var(--grey);
          max-width: 480px;
          line-height: 1.7;
          margin-top: 20px;
          letter-spacing: -0.01em;
        }

        /* CARDS GRID */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 56px;
        }
        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px 32px;
          transition: background 0.2s, transform 0.3s;
          cursor: default;
        }
        .card:hover { background: var(--card-hover); transform: translateY(-3px); }
        .card-icon {
          width: 42px; height: 42px;
          background: #222;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .card-icon svg { width: 20px; height: 20px; color: var(--white); }
        .card-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--white);
          margin-bottom: 10px;
        }
        .card-text {
          font-size: 13px;
          line-height: 1.7;
          color: var(--grey);
          font-weight: 400;
        }

        /* 30 DAY CHALLENGE */
        .challenge-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .week-row {
          padding: 28px 0;
          border-bottom: 1px solid var(--border);
          cursor: default;
          transition: padding-left 0.2s;
        }
        .week-row:first-child { border-top: 1px solid var(--border); }
        .week-row:hover { padding-left: 6px; }
        .week-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }
        .week-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--grey-dim);
          background: #222;
          border-radius: 100px;
          padding: 4px 10px;
          flex-shrink: 0;
        }
        .week-title {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--white);
        }
        .week-desc {
          font-size: 12px;
          line-height: 1.7;
          color: var(--grey);
        }

        /* QUOTES BAR */
        .quotes-bar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 0 40px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .quote-item {
          padding: 52px 40px;
          border-right: 1px solid var(--border);
        }
        .quote-item:last-child { border-right: none; }
        .quote-text {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--white);
          line-height: 1.5;
          margin-bottom: 16px;
          font-style: italic;
        }
        .quote-attr {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--grey-dim);
        }

        /* HOW IT WORKS */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 56px;
        }
        .step {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px 32px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s;
        }
        .step:hover { background: var(--card-hover); }
        .step-num {
          font-size: 72px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #222;
          line-height: 1;
          margin-bottom: 24px;
        }
        .step-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--white);
          margin-bottom: 10px;
        }
        .step-text {
          font-size: 13px;
          line-height: 1.7;
          color: var(--grey);
        }

        /* METRICS SECTION */
        .metrics-card {
          background: var(--white);
          border-radius: 24px;
          padding: 64px 56px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin: 0 40px;
        }
        .metrics-card h2 { color: var(--black); }
        .metrics-card .body-text { color: #666; }
        .metric-list { display: flex; flex-direction: column; gap: 20px; }
        .metric-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: #f5f5f5;
          border-radius: 14px;
        }
        .metric-item .m-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          letter-spacing: -0.02em;
        }
        .metric-item .m-val {
          font-size: 22px;
          font-weight: 900;
          color: var(--black);
          letter-spacing: -0.04em;
        }
        .metric-bar-wrap {
          margin-top: 6px;
          height: 3px;
          background: #e0e0e0;
          border-radius: 100px;
          overflow: hidden;
        }
        .metric-bar {
          height: 100%;
          border-radius: 100px;
          background: var(--black);
        }

        /* FAQ */
        .faq-list { margin-top: 56px; max-width: 720px; }
        .faq-item {
          border-top: 1px solid var(--border);
          padding: 28px 0;
          cursor: pointer;
        }
        .faq-item:last-child { border-bottom: 1px solid var(--border); }
        .faq-q {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--white);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .faq-q .icon {
          font-size: 20px;
          color: var(--grey);
          flex-shrink: 0;
          transition: transform 0.3s;
          font-weight: 300;
          line-height: 1;
        }
        .faq-item.open .icon { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px;
          line-height: 1.8;
          color: var(--grey);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, margin-top 0.3s;
        }
        .faq-item.open .faq-a { max-height: 200px; margin-top: 16px; }

        /* FOOTER */
        footer {
          border-top: 1px solid var(--border);
          padding: 60px 40px 40px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid var(--border);
        }
        .footer-brand .logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .footer-brand .logo-icon {
          width: 32px; height: 32px;
          background: var(--white);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .footer-brand .logo-icon svg { width: 16px; height: 16px; }
        .footer-brand .logo-name {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--white);
        }
        .footer-brand p {
          font-size: 13px;
          line-height: 1.7;
          color: var(--grey);
          max-width: 260px;
        }
        .footer-col h4 {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--grey-dim);
          margin-bottom: 16px;
        }
        .footer-col a {
          display: block;
          font-size: 13px;
          font-weight: 400;
          color: var(--grey);
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .footer-col a:hover { color: var(--white); }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 28px;
        }
        .footer-bottom p {
          font-size: 12px;
          color: var(--grey-dim);
        }
        .footer-motto {
          font-size: 13px;
          font-weight: 500;
          font-style: italic;
          color: var(--grey-dim);
          letter-spacing: -0.01em;
        }

        /* ANIMATIONS */
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

        @media (max-width: 768px) {
          nav { padding: 20px; }
          .nav-links { display: none; }
          .hero { padding: 100px 20px; }
          .hero-title { font-size: 48px; }
          .dashboard-preview { margin: 0 20px; }
          .dash-inner { grid-template-columns: 1fr; }
          .dash-sidebar { display: none; }
          section { padding: 60px 20px; }
          .cards-grid { grid-template-columns: 1fr; }
          .challenge-inner { grid-template-columns: 1fr; gap: 40px; }
          .quotes-bar { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; }
          .metrics-card { grid-template-columns: 1fr; margin: 0 20px; padding: 40px 20px; }
          .footer-top { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>

      {/* NAV */}
      <nav id="nav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="nav-logo-text">aura.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#philosophy">philosophy</a></li>
          <li><a href="#challenge">30-day</a></li>
          <li><a href="#how">how it works</a></li>
          <li><a href="#faq">faq</a></li>
        </ul>
        <button onClick={handleStart} className="nav-cta">start now</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">stoic · antifragile · persistent</p>
        <h1 className="hero-title">build the<br/>discipline.<br/>find the peace.</h1>
        <p className="hero-sub">not a tracker. not a reminder. a curriculum that teaches you how to actually follow through — built on the philosophy of the stoics.</p>
        <div className="hero-actions">
          <button onClick={handleStart} className="btn-white">begin the 30-day challenge</button>
          <a href="#philosophy" className="btn-outline">learn the philosophy →</a>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <div className="dashboard-preview reveal">
        <div className="dash-bar">
          <div className="dash-dot"></div>
          <div className="dash-dot"></div>
          <div className="dash-dot"></div>
        </div>
        <div className="dash-inner">
          {/* Sidebar */}
          <div className="dash-sidebar">
            <div className="dash-sidebar-logo">
              <div className="icon">
                <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <span style={{fontSize:'15px', fontWeight:'900', letterSpacing:'-0.04em'}}>aura.</span>
            </div>
            <div className="dash-nav-item active">
              <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              daily
            </div>
            <div className="dash-nav-item">
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              rituals
            </div>
            <div className="dash-nav-item">
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              focus
            </div>
            <div className="dash-inspiration">
              <div className="tag">inspiration</div>
              <div className="quote">"what you think, you become."</div>
            </div>
          </div>

          {/* Main */}
          <div className="dash-main">
            <div className="dash-greeting">good morning.</div>
            <div className="dash-date">monday, february 23rd.</div>
            <div className="dash-stats">
              <div className="dash-stat-card">
                <div className="label">
                  <span>progress</span>
                  <svg viewBox="0 0 14 14" fill="none" width="12"><path d="M2 10L6 6l2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="val">50%</div>
              </div>
              <div className="dash-stat-card">
                <div className="label">
                  <span>rituals</span>
                  <svg viewBox="0 0 14 14" fill="none" width="12"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div className="val">1/2</div>
              </div>
              <div className="dash-stat-card">
                <div className="label">
                  <span>focus</span>
                  <svg viewBox="0 0 14 14" fill="none" width="12"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <div className="val">0</div>
              </div>
              <div className="dash-stat-card">
                <div className="label">
                  <span>streak</span>
                  <svg viewBox="0 0 14 14" fill="none" width="12"><path d="M7 2c0 3-3 4-3 7a3 3 0 006 0c0-3-3-4-3-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div className="val">1</div>
              </div>
            </div>
            <div className="dash-bottom">
              <div className="dash-flow-card">
                <div className="title">weekly flow.</div>
                <div className="flow-bars">
                  <div className="flow-bar" style={{height:'30%'}}></div>
                  <div className="flow-bar med" style={{height:'60%'}}></div>
                  <div className="flow-bar" style={{height:'20%'}}></div>
                  <div className="flow-bar active" style={{height:'85%'}}></div>
                  <div className="flow-bar" style={{height:'10%'}}></div>
                  <div className="flow-bar" style={{height:'5%'}}></div>
                  <div className="flow-bar med" style={{height:'45%'}}></div>
                </div>
                <div className="flow-days">
                  <span className="flow-day">tue</span><span className="flow-day">wed</span><span className="flow-day">thu</span><span className="flow-day">fri</span><span className="flow-day">sat</span><span className="flow-day">sun</span><span className="flow-day">mon</span>
                </div>
              </div>
              <div className="dash-ring-card">
                <div className="ring-wrap">
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" stroke="#e0e0e0" strokeWidth="5" fill="none"/>
                    <circle cx="40" cy="40" r="32" stroke="#0a0a0a" strokeWidth="5" fill="none"
                      strokeDasharray="201" strokeDashoffset="100" strokeLinecap="round"/>
                  </svg>
                  <div className="ring-label">
                    <span className="ring-pct">50%</span>
                    <span className="ring-sub">rituals</span>
                  </div>
                </div>
                <div className="ring-card-title">keep growing.</div>
                <div className="ring-card-sub">your discipline defines your peace.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHILOSOPHY */}
      <section id="philosophy" style={{paddingTop: '120px'}}>
        <p className="label-tag reveal">the foundation</p>
        <h2 className="reveal d1">you don't lack tools.<br/>you lack a system.</h2>
        <p className="body-text reveal d2">most apps give you lists and timers. aura gives you something rarer — the knowledge of how to actually follow through. we teach the inner architecture of a productive life, one day at a time.</p>

        <div className="cards-grid">
          <div className="card reveal">
            <div className="card-icon">
              <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/><path d="M10 6v4l3 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="card-title">stoic clarity.</div>
            <p className="card-text">focus only on what is within your control. aura teaches you to separate intention from distraction so every single action carries real weight.</p>
          </div>
          <div className="card reveal d1">
            <div className="card-icon">
              <svg viewBox="0 0 20 20" fill="none"><path d="M4 16L10 4l6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 12h7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="card-title">antifragile habits.</div>
            <p className="card-text">habits that collapse under pressure aren't real habits. you'll build routines that grow stronger through setbacks — not despite them.</p>
          </div>
          <div className="card reveal d2">
            <div className="card-icon">
              <svg viewBox="0 0 20 20" fill="none"><path d="M10 3v14M3 10h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="card-title">persistent action.</div>
            <p className="card-text">motivation is fleeting. discipline is forged. aura trains the slow, relentless consistency that creates irreversible change over time.</p>
          </div>
        </div>
      </section>

      {/* 30-DAY CHALLENGE */}
      <section id="challenge" style={{background: 'var(--card)'}}>
        <div className="challenge-inner">
          <div>
            <p className="label-tag reveal">the 30-day curriculum</p>
            <h2 className="reveal d1">learn to live<br/>intentionally.</h2>
            <p className="body-text reveal d2">each week builds on the last. by day 30, the system isn't something you use — it's something you are.</p>

            <div style={{marginTop: '40px'}}>
              <div className="week-row reveal">
                <div className="week-header">
                  <span className="week-badge">week 01</span>
                  <span className="week-title">foundation — know yourself.</span>
                </div>
                <p className="week-desc">audit your time, energy and values. identify what you actually want versus what you think you should want. build your first real morning ritual.</p>
              </div>
              <div className="week-row reveal d1">
                <div className="week-header">
                  <span className="week-badge">week 02</span>
                  <span className="week-title">architecture — build the plan.</span>
                </div>
                <p className="week-desc">learn objective decomposition. break any goal into a sequence of daily, non-negotiable actions. build your personal planning ritual.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <p className="label-tag reveal">questions</p>
        <h2 className="reveal d1">frequently<br/>asked.</h2>
        <div className="faq-list">
          <div className="faq-item reveal" onClick={toggleFaq}>
            <div className="faq-q">is this just another task manager? <span className="icon">+</span></div>
            <div className="faq-a">no. aura has no to-do lists, no reminders, no streaks to obsess over. it's a structured curriculum that teaches you the principles of a productive life.</div>
          </div>
          <div className="faq-item reveal d1" onClick={toggleFaq}>
            <div className="faq-q">i've tried everything. why would this work? <span className="icon">+</span></div>
            <div className="faq-a">because most systems treat symptoms, not causes. aura addresses why people fail to follow through and teaches you to fix each one permanently.</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-row">
              <div className="logo-icon">
                <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <span className="logo-name">aura.</span>
            </div>
            <p>a system of productivity built on stoic philosophy, antifragile principles, and deliberate practice.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>aura © 2025. all rights reserved.</p>
          <p className="footer-motto">"amor fati — love your fate."</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;