"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Droplet, Shield, Leaf, Award, ArrowRight, ChevronDown, X, Sparkles } from "lucide-react";

function WaterDrop({
  size = 40, opacity = 0.7, color = "#60a5fa", style = {}, className = "",
}: {
  size?: number; opacity?: number; color?: string; style?: React.CSSProperties; className?: string;
}) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ opacity, ...style }} className={className}>
      <path d="M20 2 C20 2, 2 22, 2 34 C2 43.9 10.1 50 20 50 C29.9 50 38 43.9 38 34 C38 22, 20 2, 20 2 Z"
        fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M12 30 C11 35, 14 42, 20 44" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
      <ellipse cx="15" cy="22" rx="3" ry="5" fill="white" fillOpacity="0.15" transform="rotate(-20 15 22)" />
    </svg>
  );
}

function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0: number;
    const raf = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredBottle, setHoveredBottle] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveFeature(p => (p + 1) % 4), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const customers = useCounter(50000, 2000, statsVisible);
  const springs   = useCounter(12, 1500, statsVisible);
  const purity    = useCounter(99, 1800, statsVisible);
  const awards    = useCounter(25, 1600, statsVisible);

  const features = [
    { icon: <Droplet size={26} />, title: "Pure & Natural",  desc: "Sourced from pristine mountain springs, untouched by pollution", color: "#3b82f6", bg: "rgba(59,130,246,.1)" },
    { icon: <Shield  size={26} />, title: "Quality Tested",  desc: "Rigorous lab testing ensures the highest purity every batch",    color: "#0ea5e9", bg: "rgba(14,165,233,.1)" },
    { icon: <Leaf    size={26} />, title: "Eco-Friendly",    desc: "Sustainable packaging and fully carbon-neutral production",      color: "#10b981", bg: "rgba(16,185,129,.1)" },
    { icon: <Award   size={26} />, title: "Award Winning",   desc: "Recognised globally for exceptional taste and water quality",    color: "#f59e0b", bg: "rgba(245,158,11,.1)" },
  ];

  const bottles = [
    { src: "/images/bottle1.png", label: "500ml",   sub: "On-the-Go", badge: "Best Seller",   bColor: "#ef4444", grad: "linear-gradient(145deg,#dbeafe,#bfdbfe)", accent: "#1d4ed8" },
    { src: "/images/bottle2.png", label: "1 Litre", sub: "Daily Use", badge: "Most Popular",  bColor: "#7c3aed", grad: "linear-gradient(145deg,#d1fae5,#a7f3d0)", accent: "#065f46" },
    { src: "/images/bottle3.png", label: "2 Litre", sub: "Family",    badge: "Family Pack",   bColor: "#d97706", grad: "linear-gradient(145deg,#fef9c3,#fde68a)", accent: "#92400e" },
  ];

  const reviews = [
    { name: "Rahul Sharma", loc: "Mumbai",    text: "Unmatched purity — it's become our entire family's daily choice. You can genuinely taste the difference.", av: "RS", aColor: "#1e40af", aBg: "#dbeafe" },
    { name: "Priya Verma",  loc: "Delhi",     text: "The eco-friendly packaging feels luxurious and the water quality is exceptional. I'm fully converted!",       av: "PV", aColor: "#065f46", aBg: "#d1fae5" },
    { name: "Amit Patel",   loc: "Ahmedabad", text: "Perfect for office and home. The quality speaks for itself — we've switched permanently to Lave.",            av: "AP", aColor: "#92400e", aBg: "#fef9c3" },
  ];

  const tickerItems = [
    "🏆 Award Winning", "✅ 99% Purity", "🚚 Pan-India Delivery",
    "💎 Premium Quality", "🌊 Naturally Refreshing", "❄️ Naturally Chilled",
    "💧 Pure Mountain Water", "🌿 Eco Friendly",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root { --navy:#071830; --deep:#0c2a5e; --royal:#1d4ed8; --sky:#0ea5e9; }
        *, *::before, *::after { box-sizing: border-box; }
        .fd { font-family: 'Cormorant Garamond', serif; }
        .fb { font-family: 'Outfit', sans-serif; }

        @keyframes bannerIn  { from{opacity:0;transform:translateY(-110%)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn     { from{opacity:0;transform:scale(.55)} 65%{transform:scale(1.07)} to{opacity:1;transform:scale(1)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatYR   { 0%,100%{transform:translateY(0) rotate(8deg)} 50%{transform:translateY(-14px) rotate(12deg)} }
        @keyframes rippleOut { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.8);opacity:0} }
        @keyframes rotateSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes shimmer   { 0%{background-position:-300% center} 100%{background-position:300% center} }
        @keyframes scrollBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(9px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 50%{box-shadow:0 0 0 14px rgba(59,130,246,0)} }
        @keyframes glowPulse { 0%,100%{opacity:.3;filter:blur(60px)} 50%{opacity:.6;filter:blur(40px)} }
        @keyframes borderRot { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes wave1     { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(-8px) scaleY(.95)} }
        @keyframes wave2     { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(8px) scaleY(1.05)} }
        @keyframes sparkle   { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }

        .a-banner { animation: bannerIn .55s cubic-bezier(.34,1.4,.64,1) both; }
        .a-logo   { animation: popIn   .9s  cubic-bezier(.34,1.56,.64,1) both .1s; }
        .a-badge  { animation: popIn   .7s  cubic-bezier(.34,1.56,.64,1) both .4s; }
        .a-h1     { animation: fadeUp  .8s  ease both .6s; }
        .a-p      { animation: fadeUp  .8s  ease both .78s; }
        .a-b1     { animation: popIn   .8s  cubic-bezier(.34,1.56,.64,1) both .95s; }
        .a-b2     { animation: popIn   .8s  cubic-bezier(.34,1.56,.64,1) both 1.1s; }

        .drop-1  { animation: floatY  5.5s ease-in-out infinite; }
        .drop-2  { animation: floatY  7s   ease-in-out infinite 1s; }
        .drop-3  { animation: floatY  6.5s ease-in-out infinite 2s; }
        .drop-4  { animation: floatYR 8s   ease-in-out infinite .5s; }
        .drop-5  { animation: floatY  4.8s ease-in-out infinite 1.5s; }
        .drop-6  { animation: floatYR 6s   ease-in-out infinite 3s; }
        .scroll-bob { animation: scrollBob 2.2s ease-in-out infinite; }

        .btn-shim {
          background: linear-gradient(90deg,#0f3d91,#1d4ed8,#3b82f6,#60a5fa,#3b82f6,#1d4ed8,#0f3d91);
          background-size: 300% auto;
          animation: shimmer 4s linear infinite;
        }
        .btn-shim:hover { filter:brightness(1.14) saturate(1.1); transform:scale(1.06) translateY(-2px); box-shadow:0 20px 48px rgba(29,78,216,.5) !important; }

        .g-orb { position:absolute; border-radius:50%; pointer-events:none; animation:glowPulse 6s ease-in-out infinite; }

        .ripple-ring { position:absolute; border-radius:50%; border:1.5px solid rgba(96,165,250,.3); pointer-events:none; animation:rippleOut 3.5s ease-out infinite; }
        .ripple-ring:nth-child(2) { animation-delay:1.2s; }
        .ripple-ring:nth-child(3) { animation-delay:2.4s; }

        .logo-wrap { position:relative; display:inline-flex; }
        .logo-wrap::after { content:''; position:absolute; inset:-10px; border-radius:50%; background:radial-gradient(circle,rgba(59,130,246,.35) 0%,transparent 70%); animation:pulseGlow 2.5s ease-in-out infinite; }

        .feat-card { transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease; cursor:pointer; position:relative; overflow:hidden; }
        .feat-card:hover { transform:translateY(-16px) scale(1.025); box-shadow:0 40px 80px rgba(29,78,216,.18); }

        .bot-card { transition:transform .5s cubic-bezier(.34,1.56,.64,1),box-shadow .5s ease; position:relative; }
        .bot-card:hover { transform:translateY(-20px); }
        .bot-card .b-img { transition:transform .6s cubic-bezier(.34,1.56,.64,1),filter .4s ease; }
        .bot-card:hover .b-img { transform:translateY(-14px) scale(1.06) rotate(1.5deg); filter:drop-shadow(0 24px 48px rgba(0,0,0,.2)); }

        .stat-card { transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease; position:relative; overflow:hidden; }
        .stat-card:hover { transform:translateY(-12px) scale(1.05); }

        .rev-card { transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease; }
        .rev-card:hover { transform:translateY(-14px) rotate(.4deg); box-shadow:0 40px 80px rgba(29,78,216,.13); }

        .cta-link { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
        .cta-link:hover { transform:scale(1.07) translateY(-2px); box-shadow:0 20px 48px rgba(29,78,216,.45); }

        /* ── TICKER FIX: bright white text, bigger font, more padding ── */
        .ticker-wrap { display:flex; animation:ticker 28s linear infinite; white-space:nowrap; }
        .ticker-wrap:hover { animation-play-state:paused; }
        .ticker-item {
          display:inline-flex; align-items:center; gap:12px;
          padding: 0 28px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .ticker-dot { color: rgba(96,165,250,0.7); font-size: 8px; }

        .glass { background:rgba(255,255,255,.07); backdrop-filter:blur(18px); border:1px solid rgba(255,255,255,.12); }

        .anim-border {
          background: linear-gradient(white,white) padding-box, linear-gradient(90deg,#1d4ed8,#0ea5e9,#1d4ed8) border-box;
          border: 2px solid transparent;
          background-size: 200% auto;
          animation: borderRot 3s linear infinite;
        }

        .num { font-family:'Cormorant Garamond',serif; font-weight:700; line-height:1; }

        .s-pill {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(29,78,216,.08); border:1px solid rgba(29,78,216,.2);
          border-radius:100px; padding:4px 16px;
          font-size:10px; font-weight:700; letter-spacing:.14em;
          text-transform:uppercase; color:#1d4ed8; margin-bottom:16px;
        }
        .grad-rule { width:56px; height:3px; border-radius:2px; background:linear-gradient(90deg,#1d4ed8,#0ea5e9); margin:0 auto 28px; }

        .cursor-glow {
          position:fixed; width:280px; height:280px; border-radius:50%;
          background:radial-gradient(circle,rgba(59,130,246,.06) 0%,transparent 70%);
          pointer-events:none; transform:translate(-50%,-50%); z-index:9999;
          transition:left .1s ease,top .1s ease;
        }

        .sp { position:absolute; width:4px; height:4px; border-radius:50%; background:white; pointer-events:none; }
        .sp-1 { animation:sparkle 2.1s ease-in-out infinite .0s; }
        .sp-2 { animation:sparkle 2.1s ease-in-out infinite .7s; }
        .sp-3 { animation:sparkle 2.1s ease-in-out infinite 1.4s; }
      `}</style>

      {/* Cursor glow */}
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      <main className="fb w-full overflow-x-hidden bg-white">

        {/* ── BANNER ── */}
        {showBanner && (
          <div className="a-banner relative z-50 w-full" role="alert">
            <div className="flex items-center justify-between gap-3 px-5 py-3 text-white"
              style={{ background:"linear-gradient(90deg,#071830,#0c2a5e,#1d4ed8,#0ea5e9,#1d4ed8,#0c2a5e,#071830)", backgroundSize:"300% auto", animation:"shimmer 8s linear infinite" }}>
              <div className="flex flex-1 items-center justify-center gap-4">
                <span className="hidden sm:flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-80" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400 inline-flex" />
                  </span>
                  Live
                </span>
                <span className="hidden sm:block w-px h-4 bg-white/25" />
                <span className="text-[14px] font-semibold tracking-wide text-center leading-snug text-white">
                  {"✦ "}<strong>{"Now Delivering"}</strong>{" — Pure mineral water from nature's finest mountain springs ✦"}
                </span>
                <span className="hidden sm:block w-px h-4 bg-white/25" />
                <Link href="/explore" className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/40 px-5 py-1.5 text-[12px] font-bold text-white hover:bg-white/30 transition-all">
                  Shop Now <ArrowRight size={11} />
                </Link>
              </div>
              <button onClick={() => setShowBanner(false)} className="flex-shrink-0 rounded-full p-1.5 hover:bg-white/20 transition ml-2 text-white" aria-label="Close">
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 text-center"
          style={{ backgroundImage:"url('/images/hero-bg.png')", backgroundSize:"cover", backgroundPosition:"center" }}>
          <div className="absolute inset-0" style={{ background:"linear-gradient(160deg,rgba(240,249,255,.96) 0%,rgba(219,234,254,.9) 45%,rgba(186,230,255,.82) 100%)" }} />

          <div className="g-orb" style={{ width:600,height:600,top:"-15%",left:"-8%",background:"rgba(59,130,246,.09)",filter:"blur(80px)" }} />
          <div className="g-orb" style={{ width:500,height:500,bottom:"-12%",right:"-6%",background:"rgba(14,165,233,.07)",filter:"blur(80px)",animationDelay:"3s" }} />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:700,height:700,borderRadius:"50%",border:"1px solid rgba(59,130,246,.12)",animation:"rotateSlow 40s linear infinite" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:950,height:950,borderRadius:"50%",border:"1px solid rgba(59,130,246,.07)",animation:"rotateSlow 65s linear infinite reverse" }} />

          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,height:280,pointerEvents:"none" }}>
            <div className="ripple-ring" style={{ inset:0 }} /><div className="ripple-ring" style={{ inset:0 }} /><div className="ripple-ring" style={{ inset:0 }} />
          </div>

          <WaterDrop size={52} color="#3b82f6" opacity={0.55} className="drop-1 absolute" style={{ top:"12%",left:"6%" }} />
          <WaterDrop size={32} color="#0ea5e9" opacity={0.4}  className="drop-2 absolute" style={{ top:"20%",right:"9%" }} />
          <WaterDrop size={72} color="#60a5fa" opacity={0.3}  className="drop-3 absolute" style={{ bottom:"15%",left:"4%" }} />
          <WaterDrop size={28} color="#38bdf8" opacity={0.5}  className="drop-4 absolute" style={{ top:"55%",right:"6%" }} />
          <WaterDrop size={44} color="#1d4ed8" opacity={0.35} className="drop-5 absolute" style={{ bottom:"25%",right:"18%" }} />
          <WaterDrop size={36} color="#93c5fd" opacity={0.45} className="drop-6 absolute" style={{ top:"65%",left:"14%" }} />

          <div className="sp sp-1" style={{ top:"28%",left:"32%",background:"rgba(96,165,250,.7)" }} />
          <div className="sp sp-2" style={{ top:"55%",right:"28%",background:"rgba(14,165,233,.7)" }} />
          <div className="sp sp-3" style={{ top:"18%",right:"38%",background:"rgba(99,102,241,.7)" }} />

          <div className="relative z-10 mx-auto w-full max-w-5xl py-32 flex flex-col items-center">
            <div className="a-logo logo-wrap mb-10">
              <Image src="/images/logo2.png" alt="Lave Mineral" width={130} height={130} priority
                style={{ width:"130px",height:"auto",filter:"drop-shadow(0 8px 32px rgba(29,78,216,.25))" }} />
            </div>

            <div className="a-badge anim-border inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-blue-700 mb-8 shadow-lg shadow-blue-100/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Now Delivering
              <WaterDrop size={14} color="#1d4ed8" opacity={0.8} style={{ display:"inline-block",verticalAlign:"middle" }} />
            </div>

            <h1 className="a-h1 fd font-bold leading-[1.03] text-[#071830]" style={{ fontSize:"clamp(3.2rem,8.5vw,6.5rem)" }}>
              Pure Water,
              <span className="block italic" style={{ background:"linear-gradient(135deg,#1d4ed8 0%,#0ea5e9 60%,#38bdf8 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
                Pure Life
              </span>
            </h1>

            <div className="flex items-center gap-2 my-5 opacity-50">
              {[10,14,10,8,12].map((s,i) => <WaterDrop key={i} size={s} color="#1d4ed8" opacity={1} />)}
            </div>

            <p className="a-p mx-auto max-w-lg text-slate-500 leading-relaxed" style={{ fontSize:"clamp(1rem,2.2vw,1.18rem)" }}>
              Experience the essence of nature in every drop. Premium mineral water crafted from the purest mountain springs — naturally refreshing, endlessly pure.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Link href="/explore"
                className="a-b1 inline-flex min-w-[220px] items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-white transition-all"
                style={{ background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)",boxShadow:"0 16px 40px rgba(29,78,216,.4),0 4px 12px rgba(14,165,233,.3)",border:"1px solid rgba(255,255,255,.2)" }}>
                Explore Products <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link href="/customize"
                className="a-b2 inline-flex min-w-[220px] items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-[#1d4ed8] transition-all hover:bg-blue-600 hover:text-white group"
                style={{ background:"rgba(255,255,255,0.92)",boxShadow:"0 8px 32px rgba(29,78,216,.15),0 2px 8px rgba(0,0,0,.08)",border:"2px solid rgba(29,78,216,.25)",backdropFilter:"blur(12px)" }}>
                Customize Bottle <Sparkles size={15} className="text-blue-400 group-hover:text-white transition-colors" />
              </Link>
            </div>

            <div className="scroll-bob mt-16 flex flex-col items-center gap-1.5 text-slate-400 text-[11px] tracking-[.2em] uppercase">
              <span>Scroll to explore</span>
              <ChevronDown size={15} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none" style={{ height:80 }}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width:"100%",height:"100%" }}>
              <path d="M0,40 Q180,10 360,40 Q540,70 720,40 Q900,10 1080,40 Q1260,70 1440,40 L1440,80 L0,80 Z" fill="white" fillOpacity=".9" style={{ animation:"wave1 5s ease-in-out infinite" }} />
              <path d="M0,55 Q180,25 360,55 Q540,80 720,55 Q900,25 1080,55 Q1260,80 1440,55 L1440,80 L0,80 Z" fill="white" fillOpacity=".5" style={{ animation:"wave2 6s ease-in-out infinite" }} />
            </svg>
          </div>
        </section>

        {/* ── TICKER — FIXED: white text, bigger, proper spacing ── */}
        <div className="w-full overflow-hidden border-y-2 border-blue-900"
          style={{ background:"linear-gradient(90deg,#040f2d,#071830,#0c2a5e,#071830,#040f2d)", paddingTop:"14px", paddingBottom:"14px" }}>
          <div className="ticker-wrap">
            {[...Array(2)].map((_,r) => (
              <span key={r} className="flex items-center">
                {["🏆 Award Winning","✅ 99% Purity","🚚 Pan-India Delivery","💎 Premium Quality","🌊 Naturally Refreshing","❄️ Naturally Chilled","💧 Pure Mountain Water","🌿 Eco Friendly"].map((t,i) => (
                  <span key={i} className="ticker-item">
                    {t}<span className="ticker-dot">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <section ref={statsRef} className="relative w-full py-24 overflow-hidden"
          style={{ background:"linear-gradient(135deg,#040d1f 0%,#071830 30%,#0c2a5e 65%,#1a3a7a 100%)" }}>

          {/* Ambient glows */}
          <div className="g-orb" style={{ width:800,height:400,top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(29,78,216,.14)",filter:"blur(100px)" }} />
          <div className="g-orb" style={{ width:300,height:300,top:"-20%",right:"5%",background:"rgba(14,165,233,.12)",filter:"blur(70px)",animationDelay:"2s" }} />
          <div className="g-orb" style={{ width:250,height:250,bottom:"-15%",left:"8%",background:"rgba(99,102,241,.1)",filter:"blur(60px)",animationDelay:"4s" }} />

          {/* Subtle grid lines */}
          <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none" }} />

          <div className="relative mx-auto max-w-6xl px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <p className="s-pill" style={{ background:"rgba(255,255,255,.06)",borderColor:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.75)" }}>
                <Droplet size={10} /> Our Impact
              </p>
              <h2 className="fd text-white font-bold" style={{ fontSize:"clamp(2rem,4.5vw,3.4rem)",letterSpacing:"-0.01em" }}>
                Numbers That <em style={{ background:"linear-gradient(90deg,#60a5fa,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Speak</em>
              </h2>
            </div>

            {/* 4 stat cards in a row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { v:customers, s:"+", l:"Happy Customers",  icon:"😊", color:"#3b82f6", accent:"rgba(59,130,246,.2)",  glow:"rgba(59,130,246,.35)"  },
                { v:springs,   s:"",  l:"Mountain Springs",  icon:"⛰️", color:"#10b981", accent:"rgba(16,185,129,.2)",  glow:"rgba(16,185,129,.35)"  },
                { v:purity,    s:"%", l:"Purity Guaranteed", icon:"💧", color:"#0ea5e9", accent:"rgba(14,165,233,.2)",  glow:"rgba(14,165,233,.35)"  },
                { v:awards,    s:"+", l:"Awards Won",        icon:"🏆", color:"#f59e0b", accent:"rgba(245,158,11,.2)",  glow:"rgba(245,158,11,.35)"  },
              ].map((s,i) => (
                <div key={i} className="stat-card relative rounded-2xl p-6 text-center overflow-hidden group"
                  style={{ background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(20px)",boxShadow:"0 4px 24px rgba(0,0,0,.3)" }}>

                  {/* Hover glow bg */}
                  <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${s.accent},transparent 70%)`,opacity:0,transition:"opacity .4s",pointerEvents:"none" }} className="group-hover:opacity-100" />

                  {/* Top accent line */}
                  <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:"2px",background:`linear-gradient(90deg,transparent,${s.color},transparent)`,borderRadius:"2px" }} />

                  {/* Icon */}
                  <div className="relative flex justify-center mb-3">
                    <div style={{ width:44,height:44,borderRadius:"14px",background:s.accent,border:`1px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",boxShadow:`0 8px 24px ${s.glow}` }}>
                      {s.icon}
                    </div>
                  </div>

                  {/* Number */}
                  <div className="num text-white relative" style={{ fontSize:"clamp(2.2rem,5vw,3.2rem)",textShadow:`0 0 40px ${s.glow}` }}>
                    {s.v.toLocaleString()}{s.s}
                  </div>

                  {/* Drop decoration */}
                  <div className="flex justify-center my-2">
                    <WaterDrop size={16} color={s.color} opacity={0.6} />
                  </div>

                  {/* Label */}
                  <div style={{ color:"rgba(255,255,255,.55)",fontSize:"10px",fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase" }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE ── */}
        <section className="w-full pt-24 pb-32 relative overflow-hidden" style={{ background:"linear-gradient(160deg,#f8faff 0%,#eff6ff 60%,#f0f9ff 100%)" }}>
          <div className="g-orb" style={{ width:500,height:500,top:"-10%",right:"-5%",background:"rgba(59,130,246,.05)",filter:"blur(70px)" }} />
          <WaterDrop size={48} color="#3b82f6" opacity={0.12} className="drop-4 absolute" style={{ top:"8%",left:"2%" }} />
          <WaterDrop size={32} color="#0ea5e9" opacity={0.1}  className="drop-6 absolute" style={{ bottom:"5%",right:"3%" }} />

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            {/* NO pill here - just heading directly */}
            <div className="grad-rule" />
            <h2 className="fd font-bold text-[#071830]" style={{ fontSize:"clamp(2.5rem,6vw,4.5rem)" }}>
              Why Choose <em>Lave?</em>
            </h2>
            <p className="mt-4 text-slate-400 max-w-md mx-auto text-base leading-relaxed">
              Committed to delivering the finest mineral water experience, every single time
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {features.map((f,i) => (
                <div key={i} onClick={() => setActiveFeature(i)}
                  className="feat-card rounded-3xl p-8 text-center border-2"
                  style={ activeFeature===i
                    ? { background:"linear-gradient(145deg,#071830,#0c2a5e,#1e40af)",borderColor:"#3b82f6",color:"white",boxShadow:"0 40px 80px rgba(29,78,216,.28)" }
                    : { background:"white",borderColor:"transparent",color:"#071830",boxShadow:"0 4px 28px rgba(0,0,0,.06)" }
                  }>
                  <div className="relative mx-auto flex items-center justify-center rounded-2xl mb-5"
                    style={{ width:72,height:72,background:activeFeature===i?"rgba(255,255,255,.12)":f.bg,boxShadow:activeFeature===i?"none":`0 8px 24px ${f.color}1a` }}>
                    <div style={{ color:activeFeature===i?"white":f.color }}>{f.icon}</div>
                    <WaterDrop size={14} color={activeFeature===i?"rgba(255,255,255,.6)":f.color} opacity={0.7} style={{ position:"absolute",top:-6,right:-4 }} />
                  </div>
                  <h3 className="text-lg font-bold mb-3 tracking-tight">{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${activeFeature===i?"text-blue-100/80":"text-slate-400"}`}>{f.desc}</p>
                  {activeFeature===i && (
                    <div className="mt-5 inline-flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTLE SHOWCASE ── */}
        <section className="w-full py-32 bg-white relative overflow-hidden">
          <WaterDrop size={200} color="#dbeafe" opacity={0.5} style={{ position:"absolute",top:"-5%",right:"-3%",pointerEvents:"none" }} />
          <WaterDrop size={150} color="#e0f2fe" opacity={0.4} style={{ position:"absolute",bottom:"-5%",left:"-2%",pointerEvents:"none" }} />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              {/* Removed "Our Collection" pill - just heading */}
              <div className="grad-rule" />
              <h2 className="fd font-bold text-[#071830]" style={{ fontSize:"clamp(2.5rem,6vw,4.5rem)" }}>Premium Bottles</h2>
              <p className="mt-4 text-slate-400 text-base">Pure. Fresh. Naturally Filtered.</p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {bottles.map((b,i) => (
                <div key={i} className="bot-card rounded-3xl overflow-hidden border border-gray-100"
                  style={{ background:b.grad,boxShadow:hoveredBottle===i?`0 48px 96px ${b.accent}28`:"0 6px 40px rgba(0,0,0,.07)" }}
                  onMouseEnter={() => setHoveredBottle(i)} onMouseLeave={() => setHoveredBottle(null)}>
                  <div className="relative pt-6 pb-2 px-6 flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color:b.accent,background:`${b.accent}18`,border:`1px solid ${b.accent}30` }}>{b.sub}</span>
                    <span className="text-[11px] font-bold text-white px-3 py-1.5 rounded-full" style={{ background:b.bColor,boxShadow:`0 4px 12px ${b.bColor}55` }}>{b.badge}</span>
                  </div>
                  <div className="relative flex items-end justify-center px-6 pt-2 pb-0" style={{ minHeight:280 }}>
                    <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:160,height:60,borderRadius:"50%",background:`${b.accent}20`,filter:"blur(24px)",pointerEvents:"none" }} />
                    <WaterDrop size={20} color={b.accent} opacity={0.4} style={{ position:"absolute",top:20,left:16,animation:"floatY 4.5s ease-in-out infinite" }} />
                    <WaterDrop size={16} color={b.accent} opacity={0.3} style={{ position:"absolute",top:60,right:18,animation:"floatY 5.5s ease-in-out infinite .8s" }} />
                    <Image src={b.src} alt={b.label} width={200} height={280} className="b-img object-contain relative z-10"
                      style={{ width:"200px",height:"auto",filter:`drop-shadow(0 20px 40px ${b.accent}30)` }} />
                  </div>
                  <div className="px-8 py-7 bg-white/60 backdrop-blur-sm mt-4">
                    <h3 className="fd font-bold text-[#071830]" style={{ fontSize:"1.9rem" }}>{b.label}</h3>
                    <p className="mt-1.5 text-slate-400 text-sm leading-relaxed">{b.sub} size — perfect for any occasion</p>
                    <Link href="/explore" className="mt-5 inline-flex items-center gap-2 font-bold text-sm rounded-full px-5 py-2.5 transition-all hover:gap-3.5"
                      style={{ color:b.accent,background:`${b.accent}10`,border:`1.5px solid ${b.accent}28` }}>
                      Order Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPACER between bottles and dark section ── */}
        <div style={{ height:"80px",background:"white" }} />

        {/* ── PURITY STRIP ── */}
        <section className="w-full py-24 relative overflow-hidden" style={{ background:"linear-gradient(135deg,#0c2a5e,#1e3a8a)" }}>
          <div className="g-orb" style={{ width:600,height:300,top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(59,130,246,.15)",filter:"blur(80px)" }} />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="text-white md:col-span-1">
                <div className="s-pill" style={{ background:"rgba(255,255,255,.1)",borderColor:"rgba(255,255,255,.2)",color:"rgba(255,255,255,.8)" }}>Our Promise</div>
                <h3 className="fd font-bold mt-2" style={{ fontSize:"clamp(2rem,4vw,3rem)" }}>
                  The Purest<br /><em className="text-blue-300">Drop of Nature</em>
                </h3>
                <p className="mt-4 text-blue-200/70 text-sm leading-relaxed max-w-xs">
                  Every bottle goes through 27-stage purification before it reaches your hands — tested, certified, and delivered with care.
                </p>
                <Link href="/explore" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white border border-white/30 rounded-full px-6 py-2.5 hover:bg-white/10 transition-all">
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex justify-center items-center relative md:col-span-1" style={{ minHeight:240 }}>
                <div style={{ position:"relative",width:160,height:160 }}>
                  <div className="ripple-ring" style={{ inset:0 }} /><div className="ripple-ring" style={{ inset:0 }} /><div className="ripple-ring" style={{ inset:0 }} />
                  <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <WaterDrop size={90} color="#60a5fa" opacity={0.9} style={{ filter:"drop-shadow(0 0 30px rgba(96,165,250,.6))",animation:"floatY 4s ease-in-out infinite" }} />
                  </div>
                  <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",color:"white",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:700,textAlign:"center",lineHeight:1,pointerEvents:"none",zIndex:10 }}>
                    99%<br /><span style={{ fontSize:".7rem",fontFamily:"'Outfit',sans-serif",letterSpacing:".1em",fontWeight:400,opacity:.8,textTransform:"uppercase" }}>Pure</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 flex flex-col gap-3">
                {["27-Stage Filtration","BIS Certified Quality","Zero Artificial Additives","Mineral-Rich Composition","Eco-Recyclable Bottles"].map((f,i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3 glass">
                    <WaterDrop size={18} color="#60a5fa" opacity={0.8} />
                    <span className="text-white text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SPACER before CTA ── */}
        <div style={{ height:"60px",background:"linear-gradient(180deg,#f0f7ff,#e8f4ff)" }} />

        {/* ── FEEDBACK SECTION ── */}
        <FeedbackSection />

        {/* ── WAVE DIVIDER ── */}
        <div style={{ marginTop:"-80px",lineHeight:0,pointerEvents:"none",position:"relative",zIndex:2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width:"100%",height:"80px",display:"block" }}>
            <path d="M0,0 Q360,80 720,40 Q1080,0 1440,60 L1440,80 L0,80 Z" fill="#040f2d" />
          </svg>
        </div>

        {/* ── FINAL CTA ── */}
        <section className="relative flex min-h-[580px] w-full items-center justify-center overflow-hidden px-6 text-center text-white"
          style={{ backgroundImage:"url('/images/ready-water.png')",backgroundSize:"cover",backgroundPosition:"center" }}>
          <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(4,15,45,.95) 0%,rgba(12,42,94,.9) 40%,rgba(6,84,149,.82) 100%)" }} />

          <WaterDrop size={200} color="#60a5fa" opacity={0.07} style={{ position:"absolute",top:"-10%",left:"-3%",pointerEvents:"none",animation:"floatY 10s ease-in-out infinite" }} />
          <WaterDrop size={160} color="#38bdf8" opacity={0.06} style={{ position:"absolute",bottom:"-8%",right:"-2%",pointerEvents:"none",animation:"floatY 8s ease-in-out infinite 2s" }} />
          <WaterDrop size={80}  color="#93c5fd" opacity={0.12} style={{ position:"absolute",top:"20%",right:"8%",pointerEvents:"none",animation:"floatYR 6s ease-in-out infinite" }} />

          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:400,pointerEvents:"none" }}>
            <div className="ripple-ring" style={{ inset:0 }} /><div className="ripple-ring" style={{ inset:0 }} /><div className="ripple-ring" style={{ inset:0 }} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-semibold text-blue-200 mb-8 border border-white/15 backdrop-blur-md" style={{ background:"rgba(255,255,255,.07)" }}>
              <WaterDrop size={14} color="#60a5fa" opacity={0.9} /> Experience the Difference
            </div>

            <h2 className="fd font-bold leading-[1.06] mb-6" style={{ fontSize:"clamp(2.6rem,6vw,4.8rem)" }}>
              Ready to Experience<br />
              <span className="italic" style={{ background:"linear-gradient(90deg,#60a5fa,#38bdf8,#93c5fd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
                Pure Perfection?
              </span>
            </h2>

            <div className="flex justify-center gap-2 mb-6 opacity-40">
              {[12,16,12,10,14,10].map((s,i) => <WaterDrop key={i} size={s} color="#60a5fa" opacity={1} />)}
            </div>

            <p className="mx-auto mb-10 max-w-lg text-blue-100/70 text-base leading-relaxed">
              Refresh your life with the finest quality mineral water — crafted for purity, excellence, and your wellbeing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore" className="btn-shim inline-flex items-center justify-center gap-2.5 rounded-full px-10 py-4 font-bold text-white text-base shadow-2xl transition-all">
                Get Started Today <ArrowRight size={18} />
              </Link>
              <Link href="/customize" className="inline-flex items-center justify-center rounded-full border border-white/30 px-10 py-4 font-bold text-white text-base backdrop-blur-sm hover:bg-white/10 transition-all cta-link" style={{ background:"rgba(255,255,255,.07)" }}>
                Customize Bottle
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

/* ─────────────────────────────────────────
   FEEDBACK SECTION COMPONENT
───────────────────────────────────────── */
function FeedbackSection() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reviews = [
    { name: "Rahul Sharma", loc: "Mumbai",    text: "Unmatched purity — it's become our entire family's daily choice. You can genuinely taste the difference.", av: "RS", aColor: "#1e40af", aBg: "#dbeafe", accent:"#3b82f6", stars: 5 },
    { name: "Priya Verma",  loc: "Delhi",     text: "Eco-friendly packaging and exceptional water quality. Fully converted — nothing compares!", av: "PV", aColor: "#065f46", aBg: "#d1fae5", accent:"#10b981", stars: 5 },
    { name: "Amit Patel",   loc: "Ahmedabad", text: "Perfect for office and home. The quality speaks for itself — switched permanently to Lave.", av: "AP", aColor: "#92400e", aBg: "#fef3c7", accent:"#f59e0b", stars: 5 },
  ];

  const handleSubmit = async () => {
    if (!rating || !message.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitted(true);
    setSubmitting(false);
  };

  const ratingLabels = ["","Poor","Fair","Good","Great","Excellent!"];
  const ratingColors = ["","#ef4444","#f97316","#eab308","#22c55e","#1d4ed8"];

  return (
    <section className="w-full py-24 relative overflow-hidden fb">
      {/* Background */}
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(160deg,#f0f7ff 0%,#e8f2ff 50%,#f5f0ff 100%)" }} />
      <div style={{ position:"absolute",top:"-20%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"rgba(29,78,216,.06)",filter:"blur(80px)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"-20%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"rgba(14,165,233,.05)",filter:"blur(70px)",pointerEvents:"none" }} />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <span style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(29,78,216,.08)",border:"1px solid rgba(29,78,216,.15)",borderRadius:100,padding:"4px 16px",fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#1d4ed8",marginBottom:14 }}>
            ★ Customer Reviews
          </span>
          <h2 className="fd font-bold text-[#071830]" style={{ fontSize:"clamp(2.4rem,5vw,4rem)",lineHeight:1.1 }}>
            What Our Customers Say
          </h2>
          <p className="mt-3 text-slate-400 text-sm">Trusted by thousands of happy families across India</p>
        </div>

        {/* Main grid */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,alignItems:"start" }} className="lg:grid-cols-2 grid-cols-1">

          {/* ── LEFT: Review cards ── */}
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {reviews.map((r,i) => (
              <div key={i} style={{
                position:"relative",
                background:"white",
                borderRadius:20,
                padding:"20px 24px",
                border:"1px solid rgba(29,78,216,.08)",
                boxShadow:"0 4px 28px rgba(29,78,216,.07)",
                overflow:"hidden",
                transition:"transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow=`0 16px 48px rgba(29,78,216,.14)` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow="0 4px 28px rgba(29,78,216,.07)" }}
              >
                {/* Coloured left border */}
                <div style={{ position:"absolute",top:0,left:0,bottom:0,width:4,background:`linear-gradient(180deg,${r.accent},${r.accent}44)`,borderRadius:"20px 0 0 20px" }} />

                {/* Big quote */}
                <div style={{ position:"absolute",top:10,right:18,fontFamily:"Georgia,serif",fontSize:"4.5rem",color:r.aBg,lineHeight:1,userSelect:"none",fontWeight:700,pointerEvents:"none" }}>&ldquo;</div>

                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
                  {/* Avatar */}
                  <div style={{ width:44,height:44,borderRadius:14,background:r.aBg,color:r.aColor,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,flexShrink:0,boxShadow:`0 4px 12px ${r.accent}30` }}>
                    {r.av}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700,color:"#071830",fontSize:14,margin:0 }}>{r.name}</p>
                    <p style={{ color:"#94a3b8",fontSize:11,margin:0,display:"flex",alignItems:"center",gap:4 }}>
                      <span style={{ width:5,height:5,borderRadius:"50%",background:r.accent,display:"inline-block" }} />
                      {r.loc}
                    </p>
                  </div>
                  {/* Stars */}
                  <div style={{ display:"flex",gap:2 }}>
                    {Array(5).fill(0).map((_,j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p style={{ color:"#64748b",fontSize:13.5,lineHeight:1.65,margin:0,paddingLeft:4 }}>&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}

            {/* Trust badge row */}
            <div style={{ display:"flex",gap:12,marginTop:4 }}>
              {[["⭐","4.9 Rating"],["💬","2,400+ Reviews"],["✅","Verified Buyers"]].map(([icon,label],i) => (
                <div key={i} style={{ flex:1,background:"white",borderRadius:14,padding:"10px 12px",border:"1px solid rgba(29,78,216,.08)",display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:"0 2px 12px rgba(29,78,216,.05)" }}>
                  <span style={{ fontSize:14 }}>{icon}</span>
                  <span style={{ fontSize:11,fontWeight:700,color:"#475569" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Feedback form ── */}
          <div style={{ position:"sticky",top:100 }}>
            <div style={{
              background:"white",
              borderRadius:24,
              overflow:"hidden",
              boxShadow:"0 20px 60px rgba(29,78,216,.12),0 4px 20px rgba(0,0,0,.06)",
              border:"1px solid rgba(29,78,216,.1)",
            }}>
              {/* Form header bar */}
              <div style={{ background:"linear-gradient(135deg,#071830,#1d4ed8)",padding:"24px 28px",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-30,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.06)" }} />
                <div style={{ position:"absolute",bottom:-20,right:30,width:70,height:70,borderRadius:"50%",background:"rgba(255,255,255,.04)" }} />
                <p style={{ color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",margin:"0 0 4px" }}>Share Your Experience</p>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.7rem",color:"white",margin:0,lineHeight:1.2 }}>Write a Review</h3>
                <p style={{ color:"rgba(255,255,255,.55)",fontSize:12,margin:"6px 0 0" }}>Your honest feedback helps others choose better</p>
              </div>

              {/* Form body */}
              <div style={{ padding:"28px" }}>
                {submitted ? (
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",textAlign:"center" }}>
                    <div style={{ width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,boxShadow:"0 12px 32px rgba(29,78,216,.35)" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.8rem",color:"#071830",margin:"0 0 8px" }}>Thank You! 💧</h3>
                    <p style={{ color:"#94a3b8",fontSize:14,margin:0 }}>Your feedback has been submitted and means the world to us.</p>
                  </div>
                ) : (
                  <>
                    {/* Star rating */}
                    <div style={{ marginBottom:20 }}>
                      <p style={{ fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10 }}>Your Rating</p>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        {[1,2,3,4,5].map(star => (
                          <button key={star} type="button"
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(star)}
                            style={{ background:"none",border:"none",cursor:"pointer",padding:2,lineHeight:0,transition:"transform .15s" }}
                            onMouseDownCapture={e => (e.currentTarget.style.transform="scale(.9)")}
                            onMouseUpCapture={e => (e.currentTarget.style.transform="scale(1.2)")}>
                            <svg width="36" height="36" viewBox="0 0 24 24"
                              style={{ transition:"all .15s",filter:(hovered||rating)>=star?"drop-shadow(0 3px 8px rgba(245,158,11,.5))":"none",transform:(hovered||rating)>=star?"scale(1.1)":"scale(1)" }}
                              fill={(hovered||rating)>=star?"#f59e0b":"#e2e8f0"}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </button>
                        ))}
                        {(hovered||rating) > 0 && (
                          <span style={{ fontSize:13,fontWeight:800,color:ratingColors[hovered||rating],marginLeft:4,transition:"color .15s" }}>
                            {ratingLabels[hovered||rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name input */}
                    <div style={{ marginBottom:16 }}>
                      <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8 }}>Your Name</label>
                      <div style={{ position:"relative" }}>
                        <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none" }}>👤</span>
                        <input type="text" placeholder="e.g. Rahul Sharma"
                          value={name} onChange={e => setName(e.target.value)}
                          style={{ width:"100%",padding:"11px 14px 11px 38px",borderRadius:12,border:"1.5px solid #e8f0fe",outline:"none",fontSize:14,color:"#1e293b",background:"#f8faff",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .2s,box-shadow .2s" }}
                          onFocus={e => { e.target.style.borderColor="#1d4ed8"; e.target.style.boxShadow="0 0 0 3px rgba(29,78,216,.1)"; }}
                          onBlur={e => { e.target.style.borderColor="#e8f0fe"; e.target.style.boxShadow="none"; }} />
                      </div>
                    </div>

                    {/* Message textarea */}
                    <div style={{ marginBottom:22 }}>
                      <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8 }}>Your Feedback</label>
                      <textarea placeholder="Tell us about your experience with Lave Mineral..."
                        rows={4} value={message} onChange={e => setMessage(e.target.value)}
                        style={{ width:"100%",padding:"11px 14px",borderRadius:12,border:"1.5px solid #e8f0fe",outline:"none",fontSize:14,color:"#1e293b",background:"#f8faff",resize:"none",fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.6,transition:"border-color .2s,box-shadow .2s" }}
                        onFocus={e => { e.target.style.borderColor="#1d4ed8"; e.target.style.boxShadow="0 0 0 3px rgba(29,78,216,.1)"; }}
                        onBlur={e => { e.target.style.borderColor="#e8f0fe"; e.target.style.boxShadow="none"; }} />
                      <p style={{ fontSize:11,color:"#cbd5e1",textAlign:"right",marginTop:4 }}>{message.length}/300</p>
                    </div>

                    {/* Submit button */}
                    <button type="button" onClick={handleSubmit}
                      disabled={!rating || !message.trim() || submitting}
                      style={{
                        width:"100%",padding:"13px 20px",borderRadius:14,border:"none",
                        cursor:(!rating||!message.trim())?"not-allowed":"pointer",
                        fontWeight:700,fontSize:15,color:"white",fontFamily:"inherit",
                        background:(!rating||!message.trim())
                          ? "linear-gradient(135deg,#cbd5e1,#94a3b8)"
                          : "linear-gradient(135deg,#071830,#1d4ed8,#0ea5e9)",
                        boxShadow:(!rating||!message.trim())?"none":"0 10px 28px rgba(29,78,216,.4)",
                        transition:"all .25s",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                        letterSpacing:"0.02em",
                      }}
                      onMouseEnter={e => { if(rating&&message.trim()) { (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 16px 36px rgba(29,78,216,.5)"; }}}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow=(!rating||!message.trim())?"none":"0 10px 28px rgba(29,78,216,.4)"; }}>
                      {submitting ? (
                        <>
                          <span style={{ width:18,height:18,borderRadius:"50%",border:"2.5px solid rgba(255,255,255,.4)",borderTopColor:"white",display:"inline-block",animation:"rotateSlow .7s linear infinite" }} />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                          Submit My Review
                        </>
                      )}
                    </button>

                    <p style={{ textAlign:"center",fontSize:11,color:"#cbd5e1",marginTop:12 }}>🔒 Your review is 100% anonymous and safe</p>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}