<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>aura. — build the discipline. find the peace.</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
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

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    overflow-x: hidden;
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
  .nav-logo-text span { color: var(--white); }
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
  .hero-title .period { color: var(--white); }
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
  h2 .period { color: var(--white); }
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

  /* WIDE CARD */
  .wide-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 56px 56px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    margin-top: 56px;
  }
  .wide-card .card-title { font-size: 28px; }

  /* 30 DAY CHALLENGE */
  .challenge-section { background: var(--card); border-radius: 0; }
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
    padding-left: 0;
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

  /* METRICS SECTION — White card */
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

  /* CTA */
  .cta-section {
    text-align: center;
    padding: 140px 40px;
    position: relative;
    overflow: hidden;
  }
  .cta-section h2 { margin: 0 auto; text-align: center; max-width: 800px; }
  .cta-section .body-text { margin: 20px auto 0; text-align: center; }
  .cta-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 48px;
  }

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
  .footer-brand {}
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
  .d4 { transition-delay: 0.4s; }
</style>
</head>
<body>

<!-- NAV -->
<nav id="nav">
  <a href="#" class="nav-logo">
    <div class="nav-logo-icon">
      <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>
    <span class="nav-logo-text">aura.</span>
  </a>
  <ul class="nav-links">
    <li><a href="#philosophy">philosophy</a></li>
    <li><a href="#challenge">30-day</a></li>
    <li><a href="#how">how it works</a></li>
    <li><a href="#faq">faq</a></li>
  </ul>
  <a href="#" class="nav-cta">start now</a>
</nav>

<!-- HERO -->
<section class="hero">
  <p class="hero-eyebrow">stoic · antifragile · persistent</p>
  <h1 class="hero-title">build the<br/>discipline<span class="period">.</span><br/>find the peace<span class="period">.</span></h1>
  <p class="hero-sub">not a tracker. not a reminder. a curriculum that teaches you how to actually follow through — built on the philosophy of the stoics.</p>
  <div class="hero-actions">
    <a href="#" class="btn-white">begin the 30-day challenge</a>
    <a href="#philosophy" class="btn-outline">learn the philosophy →</a>
  </div>
</section>

<!-- DASHBOARD PREVIEW -->
<div class="dashboard-preview reveal">
  <div class="dash-bar">
    <div class="dash-dot"></div>
    <div class="dash-dot"></div>
    <div class="dash-dot"></div>
  </div>
  <div class="dash-inner">
    <!-- Sidebar -->
    <div class="dash-sidebar">
      <div class="dash-sidebar-logo">
        <div class="icon">
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/></svg>
        </div>
        <span style="font-size:15px;font-weight:900;letter-spacing:-0.04em;">aura.</span>
      </div>
      <div class="dash-nav-item active">
        <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>
        daily
      </div>
      <div class="dash-nav-item">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        rituals
      </div>
      <div class="dash-nav-item">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 8h5M8 5.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        focus
      </div>
      <div class="dash-inspiration">
        <div class="tag">inspiration</div>
        <div class="quote">"what you think, you become."</div>
      </div>
    </div>

    <!-- Main -->
    <div class="dash-main">
      <div class="dash-greeting">good morning.</div>
      <div class="dash-date">monday, february 23rd.</div>
      <div class="dash-stats">
        <div class="dash-stat-card">
          <div class="label">
            <span>progress</span>
            <svg viewBox="0 0 14 14" fill="none" width="12"><path d="M2 10L6 6l2 2 4-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="val">50%</div>
        </div>
        <div class="dash-stat-card">
          <div class="label">
            <span>rituals</span>
            <svg viewBox="0 0 14 14" fill="none" width="12"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3l2 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="val">1/2</div>
        </div>
        <div class="dash-stat-card">
          <div class="label">
            <span>focus</span>
            <svg viewBox="0 0 14 14" fill="none" width="12"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <div class="val">0</div>
        </div>
        <div class="dash-stat-card">
          <div class="label">
            <span>streak</span>
            <svg viewBox="0 0 14 14" fill="none" width="12"><path d="M7 2c0 3-3 4-3 7a3 3 0 006 0c0-3-3-4-3-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="val">1</div>
        </div>
      </div>
      <div class="dash-bottom">
        <div class="dash-flow-card">
          <div class="title">weekly flow.</div>
          <div class="flow-bars">
            <div class="flow-bar" style="height:30%"></div>
            <div class="flow-bar med" style="height:60%"></div>
            <div class="flow-bar" style="height:20%"></div>
            <div class="flow-bar active" style="height:85%"></div>
            <div class="flow-bar" style="height:10%"></div>
            <div class="flow-bar" style="height:5%"></div>
            <div class="flow-bar med" style="height:45%"></div>
          </div>
          <div class="flow-days">
            <span class="flow-day">tue</span><span class="flow-day">wed</span><span class="flow-day">thu</span><span class="flow-day">fri</span><span class="flow-day">sat</span><span class="flow-day">sun</span><span class="flow-day">mon</span>
          </div>
        </div>
        <div class="dash-ring-card">
          <div class="ring-wrap">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="#e0e0e0" stroke-width="5" fill="none"/>
              <circle cx="40" cy="40" r="32" stroke="#0a0a0a" stroke-width="5" fill="none"
                stroke-dasharray="201" stroke-dashoffset="100" stroke-linecap="round"/>
            </svg>
            <div class="ring-label">
              <span class="ring-pct">50%</span>
              <span class="ring-sub">rituals</span>
            </div>
          </div>
          <div class="ring-card-title">keep growing.</div>
          <div class="ring-card-sub">your discipline defines your peace.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PHILOSOPHY -->
<section id="philosophy" style="padding-top: 120px;">
  <p class="label-tag reveal">the foundation</p>
  <h2 class="reveal d1">you don't lack tools.<br/>you lack a system<span class="period">.</span></h2>
  <p class="body-text reveal d2">most apps give you lists and timers. aura gives you something rarer — the knowledge of how to actually follow through. we teach the inner architecture of a productive life, one day at a time.</p>

  <div class="cards-grid">
    <div class="card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="white" stroke-width="1.5"/><path d="M10 6v4l3 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="card-title">stoic clarity.</div>
      <p class="card-text">focus only on what is within your control. aura teaches you to separate intention from distraction so every single action carries real weight.</p>
    </div>
    <div class="card reveal d1">
      <div class="card-icon">
        <svg viewBox="0 0 20 20" fill="none"><path d="M4 16L10 4l6 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 12h7" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="card-title">antifragile habits.</div>
      <p class="card-text">habits that collapse under pressure aren't real habits. you'll build routines that grow stronger through setbacks — not despite them.</p>
    </div>
    <div class="card reveal d2">
      <div class="card-icon">
        <svg viewBox="0 0 20 20" fill="none"><path d="M10 3v14M3 10h14" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="card-title">persistent action.</div>
      <p class="card-text">motivation is fleeting. discipline is forged. aura trains the slow, relentless consistency that creates irreversible change over time.</p>
    </div>
    <div class="card reveal d1">
      <div class="card-icon">
        <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="white" stroke-width="1.5"/><path d="M7 10h6M10 7v6" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="card-title">objective architecture.</div>
      <p class="card-text">learn to set goals with surgical precision — breaking any objective into a clear, executable plan with daily actions you can actually trust.</p>
    </div>
    <div class="card reveal d2">
      <div class="card-icon">
        <svg viewBox="0 0 20 20" fill="none"><path d="M10 3C6 3 3 6 3 10s3 7 7 7 7-3 7-7-3-7-7-7z" stroke="white" stroke-width="1.5"/><path d="M10 7v3l2 2" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="card-title">daily rituals.</div>
      <p class="card-text">morning and evening rituals anchor your day. small, non-negotiable practices that signal to your brain: this is who i am now.</p>
    </div>
    <div class="card reveal d3">
      <div class="card-icon">
        <svg viewBox="0 0 20 20" fill="none"><path d="M4 13l4-4 3 3 5-6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="card-title">compound growth.</div>
      <p class="card-text">small improvements done consistently become impossible to ignore. aura is built on the long game — not the dopamine hit of a 7-day streak.</p>
    </div>
  </div>
</section>

<!-- QUOTES BAR -->
<div class="quotes-bar">
  <div class="quote-item reveal">
    <p class="quote-text">"you have power over your mind, not outside events. realize this, and you will find strength."</p>
    <p class="quote-attr">Marcus Aurelius</p>
  </div>
  <div class="quote-item reveal d1">
    <p class="quote-text">"the impediment to action advances action. what stands in the way becomes the way."</p>
    <p class="quote-attr">Marcus Aurelius · Meditations</p>
  </div>
  <div class="quote-item reveal d2">
    <p class="quote-text">"first say to yourself what you would be, and then do what you have to do."</p>
    <p class="quote-attr">Epictetus</p>
  </div>
</div>

<!-- 30-DAY CHALLENGE -->
<section id="challenge" style="background: var(--card);">
  <div class="challenge-inner">
    <div>
      <p class="label-tag reveal">the 30-day curriculum</p>
      <h2 class="reveal d1">learn to live<br/>intentionally<span class="period">.</span></h2>
      <p class="body-text reveal d2">each week builds on the last. by day 30, the system isn't something you use — it's something you are.</p>

      <div style="margin-top: 40px;">
        <div class="week-row reveal">
          <div class="week-header">
            <span class="week-badge">week 01</span>
            <span class="week-title">foundation — know yourself.</span>
          </div>
          <p class="week-desc">audit your time, energy and values. identify what you actually want versus what you think you should want. build your first real morning ritual.</p>
        </div>
        <div class="week-row reveal d1">
          <div class="week-header">
            <span class="week-badge">week 02</span>
            <span class="week-title">architecture — build the plan.</span>
          </div>
          <p class="week-desc">learn objective decomposition. break any goal into a sequence of daily, non-negotiable actions. build your personal planning ritual.</p>
        </div>
        <div class="week-row reveal d2">
          <div class="week-header">
            <span class="week-badge">week 03</span>
            <span class="week-title">execution — hold the line.</span>
          </div>
          <p class="week-desc">discipline over motivation. you will miss days — this week teaches you how to recover without collapsing. the comeback is the practice.</p>
        </div>
        <div class="week-row reveal d3">
          <div class="week-header">
            <span class="week-badge">week 04</span>
            <span class="week-title">compound — let it grow.</span>
          </div>
          <p class="week-desc">review, refine, and recommit. you exit week four with a self-sustaining system built on momentum. no reminders needed.</p>
        </div>
      </div>
    </div>

    <!-- Visual panel -->
    <div class="reveal d2" style="display:flex; flex-direction:column; gap:12px; padding-top: 80px;">
      <div style="background:#1c1c1c; border-radius:20px; padding:32px; border:1px solid var(--border);">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--grey);margin-bottom:20px;">daily progress</div>
        <div style="display:flex;gap:8px;align-items:flex-end;height:80px;">
          <div style="flex:1;height:40%;background:#2a2a2a;border-radius:6px;"></div>
          <div style="flex:1;height:60%;background:#333;border-radius:6px;"></div>
          <div style="flex:1;height:30%;background:#2a2a2a;border-radius:6px;"></div>
          <div style="flex:1;height:80%;background:#555;border-radius:6px;"></div>
          <div style="flex:1;height:50%;background:#333;border-radius:6px;"></div>
          <div style="flex:1;height:95%;background:#fff;border-radius:6px;"></div>
          <div style="flex:1;height:70%;background:#444;border-radius:6px;"></div>
        </div>
        <div style="font-size:28px;font-weight:900;letter-spacing:-0.04em;color:white;margin-top:20px;">day 30.</div>
        <div style="font-size:12px;color:var(--grey);margin-top:4px;">streak alive — keep going.</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:#1c1c1c;border:1px solid var(--border);border-radius:16px;padding:24px;">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--grey);margin-bottom:8px;">rituals</div>
          <div style="font-size:36px;font-weight:900;letter-spacing:-0.04em;">3/3</div>
          <div style="font-size:11px;color:#3a3;margin-top:4px;">✓ complete</div>
        </div>
        <div style="background:white;border-radius:16px;padding:24px;">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:8px;">focus</div>
          <div style="font-size:36px;font-weight:900;letter-spacing:-0.04em;color:#0a0a0a;">90<span style="font-size:16px;">m</span></div>
          <div style="font-size:11px;color:#888;margin-top:4px;">deep work</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="how">
  <p class="label-tag reveal">the process</p>
  <h2 class="reveal d1">simple to start.<br/>hard to regret<span class="period">.</span></h2>
  <div class="steps">
    <div class="step reveal">
      <div class="step-num">I</div>
      <div class="step-title">enter the system.</div>
      <p class="step-text">a short audit reveals your current patterns, blind spots, and hidden bottlenecks. aura builds a starting point unique to you — not a generic template.</p>
    </div>
    <div class="step reveal d1">
      <div class="step-num">II</div>
      <div class="step-title">follow the lessons.</div>
      <p class="step-text">one focused lesson per day. each one teaches a real concept — not motivation, not hacks. philosophy, structure, and execution, in that order.</p>
    </div>
    <div class="step reveal d2">
      <div class="step-num">III</div>
      <div class="step-title">apply the practice.</div>
      <p class="step-text">every lesson ends with one concrete action for today. small and deliberate. the compound effect of 30 days of right action is impossible to ignore.</p>
    </div>
  </div>
</section>

<!-- METRICS WHITE CARD -->
<div class="metrics-card reveal">
  <div>
    <p class="label-tag" style="color:#888;">the outcomes</p>
    <h2 style="font-size:clamp(36px,4vw,58px);">measure what actually matters<span class="period" style="color:#0a0a0a;">.</span></h2>
    <p class="body-text" style="color:#666;">aura tracks the things that build a life — not just tasks completed. because how you spend your days is how you spend your life.</p>
    <a href="#" class="btn-white" style="margin-top:32px;display:inline-block;">start building →</a>
  </div>
  <div class="metric-list">
    <div class="metric-item">
      <span class="m-label">ritual consistency</span>
      <span class="m-val">87%</span>
    </div>
    <div class="metric-bar-wrap"><div class="metric-bar" style="width:87%"></div></div>
    <div class="metric-item">
      <span class="m-label">deep focus hours</span>
      <span class="m-val">4.2h</span>
    </div>
    <div class="metric-bar-wrap"><div class="metric-bar" style="width:65%"></div></div>
    <div class="metric-item">
      <span class="m-label">goal progress</span>
      <span class="m-val">73%</span>
    </div>
    <div class="metric-bar-wrap"><div class="metric-bar" style="width:73%"></div></div>
    <div class="metric-item">
      <span class="m-label">current streak</span>
      <span class="m-val">12d</span>
    </div>
    <div class="metric-bar-wrap"><div class="metric-bar" style="width:40%"></div></div>
  </div>
</div>

<!-- FAQ -->
<section id="faq">
  <p class="label-tag reveal">questions</p>
  <h2 class="reveal d1">frequently<br/>asked<span class="period">.</span></h2>
  <div class="faq-list">
    <div class="faq-item reveal">
      <div class="faq-q">is this just another task manager? <span class="icon">+</span></div>
      <div class="faq-a">no. aura has no to-do lists, no reminders, no streaks to obsess over. it's a structured curriculum that teaches you the principles of a productive life — skills that transfer to every tool, system, or job you'll ever encounter.</div>
    </div>
    <div class="faq-item reveal d1">
      <div class="faq-q">i've tried everything. why would this work? <span class="icon">+</span></div>
      <div class="faq-a">because most systems treat symptoms, not causes. aura addresses why people fail to follow through — lack of clarity, weak identity, no recovery protocol — and teaches you to fix each one permanently, through daily practice.</div>
    </div>
    <div class="faq-item reveal d2">
      <div class="faq-q">how much time does it take each day? <span class="icon">+</span></div>
      <div class="faq-a">each lesson takes 10–15 minutes to read and reflect on. the practice can take anywhere from 5 minutes to an hour depending on the week. the point is depth, not duration.</div>
    </div>
    <div class="faq-item reveal d3">
      <div class="faq-q">what happens after 30 days? <span class="icon">+</span></div>
      <div class="faq-a">you'll have a personal system — your values clarified, your goals structured, your routine designed. advanced modules explore deeper stoic frameworks, antifragility in specific areas, and long-term 90-day and annual planning.</div>
    </div>
    <div class="faq-item reveal">
      <div class="faq-q">is this based on stoicism? <span class="icon">+</span></div>
      <div class="faq-a">yes, deeply. aura is built on the writings of marcus aurelius, epictetus, and seneca — distilled into practical, modern lessons. we don't teach philosophy for its own sake. we teach it because it works.</div>
    </div>
  </div>
</section>

<!-- CTA -->
<div class="cta-section">
  <p class="label-tag reveal" style="text-align:center;">the invitation</p>
  <h2 class="reveal d1">you are not broken.<br/>you are untrained<span class="period">.</span></h2>
  <p class="body-text reveal d2">aura exists for the person who is tired of starting over. who knows they are capable of more. who is ready to stop consuming and start becoming.</p>
  <div class="cta-actions reveal d3">
    <a href="#" class="btn-white">begin day one</a>
    <a href="#how" class="btn-outline">see how it works →</a>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-top">
    <div class="footer-brand">
      <div class="logo-row">
        <div class="logo-icon">
          <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L9 16M2 9L16 9" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/></svg>
        </div>
        <span class="logo-name">aura.</span>
      </div>
      <p>a system of productivity built on stoic philosophy, antifragile principles, and deliberate practice. not for those who want shortcuts — for those who want results.</p>
    </div>
    <div class="footer-col">
      <h4>product</h4>
      <a href="#">start the challenge</a>
      <a href="#">the curriculum</a>
      <a href="#">advanced modules</a>
      <a href="#">sign in</a>
    </div>
    <div class="footer-col">
      <h4>company</h4>
      <a href="#">about</a>
      <a href="#">contact</a>
      <a href="#">newsletter</a>
      <a href="#">privacy policy</a>
    </div>
    <div class="footer-col">
      <h4>philosophy</h4>
      <a href="#">the stoic method</a>
      <a href="#">what is antifragile?</a>
      <a href="#">reading list</a>
      <a href="#">blog</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>aura © 2025. all rights reserved.</p>
    <p class="footer-motto">"amor fati — love your fate."</p>
  </div>
</footer>

<script>
  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

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

  // FAQ
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
</script>
</body>
</html>
