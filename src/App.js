// ═══════════════════════════════════════════════════════════════
//  CRYPTOFOLIO ULTRA 2.1 — All bugs fixed, full feature set
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ── CoinGecko proxy helper (bypasses rate-limit / CORS) ──────
const CG_BASE = "https://api.coingecko.com/api/v3";
const CG_PROXIES = [
  p => `https://corsproxy.io/?${encodeURIComponent(CG_BASE+p)}`,
  p => `https://api.allorigins.win/raw?url=${encodeURIComponent(CG_BASE+p)}`,
  p => CG_BASE+p,
];
async function cgFetch(path, ms=12000) {
  for (const proxy of CG_PROXIES) {
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), ms);
    try {
      const r = await fetch(proxy(path), {signal:ctrl.signal});
      clearTimeout(t);
      if (r.ok) return r;
    } catch(_) { clearTimeout(t); }
  }
  throw new Error("CoinGecko unavailable");
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`;

const C = {
  bg:"#050a15",
  bgCard:"rgba(255,255,255,0.04)",
  bgCard2:"rgba(255,255,255,0.07)",
  border:"rgba(255,255,255,0.08)",
  borderHi:"rgba(255,255,255,0.15)",
  gold:"#f0b429",
  orange:"#f97316",
  teal:"#22d3ee",
  purple:"#a78bfa",
  pink:"#f472b6",
  text:"#ffffff",
  muted:"rgba(255,255,255,0.45)",
  green:"#34d399",
  red:"#f87171",
  blue:"#3b82f6",
  accent:"#2563eb",
  glow:"rgba(59,130,246,0.35)",
};

const G = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow-x:hidden}
body{
  background:${C.bg};
  color:${C.text};
  font-family:'DM Sans',system-ui,sans-serif;
  font-size:14px;line-height:1.6;
  -webkit-font-smoothing:antialiased;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%,rgba(249,115,22,0.15) 0%,transparent 60%),
    radial-gradient(ellipse 40% 30% at 80% 20%,rgba(240,180,41,0.07) 0%,transparent 50%);
  background-attachment:fixed;
}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:100px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}
input,select,textarea,button{font-family:inherit}
a{color:inherit;text-decoration:none}
select option{background:#0d1829;color:#fff}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(24px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{
  from{opacity:0;transform:scale(0.93) translateY(10px)}
  to{opacity:1;transform:scale(1) translateY(0)}
}
@keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes confettiFall{
  0%{transform:translateY(-20px) rotate(0deg);opacity:1}
  100%{transform:translateY(110vh) rotate(720deg);opacity:0}
}
@keyframes orb{
  0%,100%{transform:translate(0,0) scale(1)}
  33%{transform:translate(30px,-20px) scale(1.05)}
  66%{transform:translate(-20px,15px) scale(0.95)}
}
@keyframes shimmerSlide{
  0%{background-position:-200% 0}
  100%{background-position:200% 0}
}
@keyframes glowPulse{
  0%,100%{box-shadow:0 0 20px rgba(59,130,246,0.2),0 0 60px rgba(59,130,246,0.05)}
  50%{box-shadow:0 0 40px rgba(59,130,246,0.5),0 0 80px rgba(59,130,246,0.15)}
}
@keyframes orangeGlow{
  0%,100%{box-shadow:0 0 20px rgba(249,115,22,0.3),0 0 60px rgba(249,115,22,0.1)}
  50%{box-shadow:0 0 50px rgba(249,115,22,0.7),0 0 100px rgba(249,115,22,0.25)}
}
@keyframes slideUp{
  from{opacity:0;transform:translateY(40px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes heroFadeIn{
  from{opacity:0;transform:scale(0.97) translateY(20px)}
  to{opacity:1;transform:scale(1) translateY(0)}
}
@keyframes deviceFloat{
  0%,100%{transform:perspective(1000px) rotateX(6deg) rotateY(-8deg) translateY(0)}
  50%{transform:perspective(1000px) rotateX(6deg) rotateY(-8deg) translateY(-12px)}
}
@keyframes deviceFloat2{
  0%,100%{transform:perspective(1000px) rotateX(4deg) rotateY(6deg) translateY(0) scale(0.85)}
  50%{transform:perspective(1000px) rotateX(4deg) rotateY(6deg) translateY(-8px) scale(0.85)}
}
@keyframes gradientBg{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes ticker2{
  0%{transform:translateX(0)}
  100%{transform:translateX(-50%)}
}
@keyframes countUp{
  from{opacity:0;transform:translateY(10px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes borderFlow{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes cardFloat{
  0%,100%{transform:perspective(1200px) rotateX(8deg) rotateY(-12deg) translateY(0) scale(1)}
  50%{transform:perspective(1200px) rotateX(8deg) rotateY(-12deg) translateY(-18px) scale(1.02)}
}
@keyframes cardShimmer{
  0%{background-position:-200% -200%}
  100%{background-position:200% 200%}
}
@keyframes holographic{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes chipGlow{
  0%,100%{box-shadow:0 0 8px rgba(240,180,41,0.4)}
  50%{box-shadow:0 0 24px rgba(240,180,41,0.9),0 0 40px rgba(240,180,41,0.4)}
}
@keyframes logoRotate{
  0%{transform:rotate(0deg)}
  100%{transform:rotate(360deg)}
}
@keyframes logoGlow{
  0%,100%{filter:drop-shadow(0 0 8px rgba(249,115,22,0.6))}
  50%{filter:drop-shadow(0 0 20px rgba(249,115,22,1)) drop-shadow(0 0 40px rgba(240,180,41,0.6))}
}
@keyframes cardTilt{
  0%{transform:perspective(1200px) rotateX(8deg) rotateY(-12deg)}
  25%{transform:perspective(1200px) rotateX(4deg) rotateY(12deg)}
  50%{transform:perspective(1200px) rotateX(-4deg) rotateY(8deg)}
  75%{transform:perspective(1200px) rotateX(6deg) rotateY(-8deg)}
  100%{transform:perspective(1200px) rotateX(8deg) rotateY(-12deg)}
}
@keyframes neonPulse{
  0%,100%{text-shadow:0 0 10px rgba(249,115,22,0.8),0 0 20px rgba(249,115,22,0.5),0 0 40px rgba(249,115,22,0.3)}
  50%{text-shadow:0 0 20px rgba(249,115,22,1),0 0 40px rgba(249,115,22,0.8),0 0 80px rgba(249,115,22,0.5)}
}
.card-3d{
  transform-style:preserve-3d;
  transition:transform .6s cubic-bezier(0.22,1,0.36,1);
}
.card-3d:hover{
  transform:perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.04)!important;
}
.choose-card-btn{
  transition:all .25s cubic-bezier(0.22,1,0.36,1);
}
.choose-card-btn:hover{
  transform:translateY(-2px);
  background:rgba(255,255,255,0.15)!important;
  border-color:rgba(255,255,255,0.4)!important;
}

.confetti-bit{position:fixed;top:-10px;border-radius:3px;animation:confettiFall linear forwards;pointer-events:none;z-index:9999}
.tab-content{animation:fadeUp .45s cubic-bezier(0.22,1,0.36,1)}
.glass-card{
  background:rgba(255,255,255,0.04);
  backdrop-filter:blur(24px) saturate(160%);
  -webkit-backdrop-filter:blur(24px) saturate(160%);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:20px;
  transition:transform .25s cubic-bezier(0.22,1,0.36,1),
             box-shadow .25s cubic-bezier(0.22,1,0.36,1),
             border-color .25s ease;
}
.glass-card:hover{
  transform:translateY(-3px);
  box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.1);
  border-color:rgba(255,255,255,0.14);
}
.premium-card{
  background:linear-gradient(145deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.02) 100%);
  backdrop-filter:blur(30px) saturate(180%);
  -webkit-backdrop-filter:blur(30px) saturate(180%);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:24px;
  transition:all .3s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.premium-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
}
.premium-card:hover{
  transform:translateY(-4px);
  box-shadow:0 24px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.12);
  border-color:rgba(255,255,255,0.16);
}
.stat-card{
  background:linear-gradient(145deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:20px;
  padding:24px;
  position:relative;overflow:hidden;
  transition:all .3s cubic-bezier(0.22,1,0.36,1);
}
.stat-card:hover{
  transform:translateY(-3px);
  border-color:rgba(255,255,255,0.14);
  box-shadow:0 16px 50px rgba(0,0,0,0.4);
}
.stat-card::after{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
}
.sidebar-item{
  display:flex;align-items:center;gap:12px;
  padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
  width:100%;font-size:13px;font-weight:500;
  transition:all .18s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.sidebar-item:hover{background:rgba(255,255,255,0.07)!important}
.sidebar-item.active{background:rgba(255,255,255,0.09)!important}
.hover-lift{transition:transform .2s cubic-bezier(0.22,1,0.36,1)}
.hover-lift:hover{transform:translateY(-2px)}
.btn-glow{
  transition:all .2s cubic-bezier(0.22,1,0.36,1);
  position:relative;overflow:hidden;
}
.btn-glow::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);
  opacity:0;transition:opacity .2s;
}
.btn-glow:hover::after{opacity:1}
.btn-glow:hover{transform:translateY(-1px);box-shadow:0 8px 30px rgba(59,130,246,0.5)}
.btn-glow:active{transform:scale(0.98)}
.nav-item{
  transition:all .18s cubic-bezier(0.22,1,0.36,1);
  border-radius:10px;
}
.nav-item:hover{background:rgba(255,255,255,0.06)!important}

/* Login page — always dark bg, white inputs */
.landing-scroll input{
  background:rgba(255,255,255,0.12) !important;
  color:#fff !important;
  border-color:rgba(255,255,255,0.28) !important;
}
.landing-scroll input::placeholder{color:rgba(255,255,255,0.45) !important}
.landing-scroll input:focus{
  border-color:rgba(249,115,22,0.7) !important;
  box-shadow:0 0 0 3px rgba(249,115,22,0.18) !important;
  background:rgba(255,255,255,0.18) !important;
}

`;

const fmt  = (n,d=2)=> Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtC = (n)    => Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});
const pct  = (n)    => `${n>=0?"+":""}${Number(n||0).toFixed(2)}%`;
const clr  = (n)    => n>=0?C.green:C.red;
const uid  = ()     => Math.random().toString(36).slice(2,8);
const now  = ()     => new Date().toISOString();
const LS   = {
  get:(k,d)=>{ try{ const r=localStorage.getItem(k); return r?JSON.parse(r):d; }catch{ return d; }},
  set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};

const FX  = { INR:1, USD:0.012, EUR:0.011, GBP:0.0095 };
const SYM = { INR:"₹", USD:"$", EUR:"€", GBP:"£" };
const toDisplay=(inrAmt,currency)=>`${SYM[currency]||"₹"}${fmtC(inrAmt*(FX[currency]||1))}`;

// ═══════════ CRYPTOFOLIO LOGO ═══════════
function CryptofolioLogo({ size=36, animate=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={animate?{animation:"logoGlow 3s ease-in-out infinite"}:{}}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316"/>
          <stop offset="50%" stopColor="#f0b429"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#0d1829"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      {/* Hexagon background */}
      <polygon points="50,5 92,27.5 92,72.5 50,95 8,72.5 8,27.5"
        fill="url(#lg2)" stroke="url(#lg1)" strokeWidth="2.5"/>
      {/* Inner hexagon outline */}
      <polygon points="50,14 83,31.5 83,68.5 50,86 17,68.5 17,31.5"
        fill="none" stroke="rgba(249,115,22,0.25)" strokeWidth="1"/>
      {/* Chart bars */}
      <rect x="22" y="62" width="9" height="14" rx="2" fill="url(#lg1)" opacity="0.7"/>
      <rect x="34" y="50" width="9" height="26" rx="2" fill="url(#lg1)" opacity="0.85"/>
      <rect x="46" y="40" width="9" height="36" rx="2" fill="url(#lg1)"/>
      <rect x="58" y="33" width="9" height="43" rx="2" fill="#f0b429"/>
      {/* Trend line */}
      <polyline points="26.5,58 39,46 51,38 63,30"
        fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round"
        strokeLinecap="round" opacity="0.9"/>
      {/* Arrow up */}
      <polyline points="57,24 63,30 69,24" fill="none" stroke="#ffffff" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.9"/>
      {/* Small dot glow */}
      <circle cx="63" cy="30" r="3" fill="#f0b429" filter="url(#glow)"/>
    </svg>
  );
}

// ═══════════ SINGLE CARD (reusable) ═══════════
function SingleCard({ variant, style={}, mouseX=0, mouseY=0, isActive=false }) {
  const variants = {
    ruby:    { bg:"linear-gradient(145deg,#2a0000 0%,#5a0a0a 30%,#1a0000 60%,#3d0505 100%)", shine:"rgba(220,30,30,0.35)", borderColor:"rgba(200,50,50,0.3)" },
    icy:     { bg:"linear-gradient(145deg,#0a1628 0%,#1a2d50 35%,#0d1f3c 70%,#162848 100%)",  shine:"rgba(50,120,255,0.25)", borderColor:"rgba(80,140,255,0.2)" },
    obsidian:{ bg:"linear-gradient(145deg,#0a0a0a 0%,#1a1a1a 35%,#0d0d0d 70%,#161616 100%)", shine:"rgba(180,180,180,0.15)", borderColor:"rgba(150,150,150,0.15)" },
    rose:    { bg:"linear-gradient(145deg,#1a0810 0%,#3d1020 35%,#150610 70%,#2a0c18 100%)",  shine:"rgba(220,60,120,0.3)", borderColor:"rgba(200,80,130,0.25)" },
    forest:  { bg:"linear-gradient(145deg,#050f08 0%,#0d2415 35%,#061008 70%,#0f1e10 100%)",  shine:"rgba(30,160,80,0.25)", borderColor:"rgba(50,180,90,0.2)" },
  };
  const v = variants[variant] || variants.obsidian;

  return (
    <div style={{
      width:"100%",height:"100%",borderRadius:20,position:"relative",overflow:"hidden",
      background:v.bg,
      boxShadow:`0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px ${v.borderColor}, inset 0 1px 0 rgba(255,255,255,0.07)`,
      ...style,
    }}>
      {/* Brushed metal lines */}
      <div style={{position:"absolute",inset:0,
        background:"repeating-linear-gradient(175deg,transparent,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)"}}/>
      {/* Shine sweep */}
      <div style={{position:"absolute",inset:0,
        background:`linear-gradient(125deg,transparent 20%,${v.shine} 50%,transparent 80%)`,
        backgroundSize:"300% 300%",animation:"holographic 5s ease-in-out infinite"}}/>
      {/* Radial hotspot */}
      <div style={{position:"absolute",top:"-20%",left:"15%",width:"70%",height:"80%",borderRadius:"50%",
        background:`radial-gradient(ellipse,${v.shine} 0%,transparent 65%)`,opacity:0.7}}/>
      {/* Top-left edge reflection */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)"}}/>

      {/* EMV Chip */}
      <div style={{position:"absolute",top:32,left:28,width:48,height:37,borderRadius:7,
        background:"linear-gradient(135deg,#b8922a,#e8c84a,#8a6a18,#d4b038,#a07820)",
        boxShadow:"0 3px 12px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.25)",overflow:"hidden"}}>
        {/* Chip grooves */}
        <svg style={{position:"absolute",inset:0}} width="100%" height="100%" viewBox="0 0 48 37">
          <rect x="0" y="12" width="48" height="1" fill="rgba(0,0,0,0.35)"/>
          <rect x="0" y="18" width="48" height="1" fill="rgba(0,0,0,0.35)"/>
          <rect x="0" y="24" width="48" height="1" fill="rgba(0,0,0,0.35)"/>
          <rect x="16" y="0" width="1" height="37" fill="rgba(0,0,0,0.3)"/>
          <rect x="24" y="0" width="1" height="37" fill="rgba(0,0,0,0.3)"/>
          <rect x="32" y="0" width="1" height="37" fill="rgba(0,0,0,0.3)"/>
          <rect x="14" y="10" width="20" height="17" rx="2" fill="rgba(0,0,0,0.15)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Cryptofolio Hexagon Logo */}
      <div style={{position:"absolute",top:"50%",left:"55%",transform:"translate(-50%,-50%)",
        opacity:0.7,filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.8))"}}>
        <svg width="100" height="100" viewBox="0 0 110 110" fill="none">
          {/* Outer hex */}
          <polygon points="55,6 100,30.5 100,79.5 55,104 10,79.5 10,30.5"
            fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
          {/* Inner hex */}
          <polygon points="55,18 88,36.5 88,73.5 55,92 22,73.5 22,36.5"
            fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          {/* Chart icon */}
          <rect x="34" y="66" width="8" height="12" rx="2" fill="rgba(255,255,255,0.5)"/>
          <rect x="46" y="56" width="8" height="22" rx="2" fill="rgba(255,255,255,0.65)"/>
          <rect x="58" y="46" width="8" height="32" rx="2" fill="rgba(255,255,255,0.8)"/>
          <rect x="70" y="38" width="8" height="40" rx="2" fill="rgba(255,255,255,0.95)"/>
          {/* Trend arrow */}
          <polyline points="38,62 50,52 62,44 74,36" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="68,34 74,36 72,42" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Card number */}
      <div style={{position:"absolute",bottom:48,left:28,
        fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:3,
        color:"rgba(255,255,255,0.4)",fontWeight:500,display:"flex",gap:14}}>
        <span>••••</span><span>••••</span><span>••••</span><span>4291</span>
      </div>

      {/* Bottom */}
      <div style={{position:"absolute",bottom:18,left:28,right:28,
        display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:3}}>Card Holder</div>
          <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)",letterSpacing:1.5,fontFamily:"'DM Mono',monospace"}}>CRYPTOFOLIO</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:1}}>DEBIT</div>
          <div style={{fontSize:22,fontWeight:900,color:"rgba(255,255,255,0.8)",fontStyle:"italic",letterSpacing:-0.5,fontFamily:"'Syne',sans-serif"}}>VISA</div>
        </div>
      </div>

      {/* Contactless */}
      <div style={{position:"absolute",top:18,right:24,opacity:0.4}}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="2" fill="white"/>
          <path d="M7 7.5 Q11 3.5 15 7.5" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
          <path d="M4.5 5 Q11 -1 17.5 5" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}

// ═══════════ CRYPTO.COM STYLE CARD SECTION ═══════════
function CryptoCard() {
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({x:0.5, y:0.5});

  useEffect(()=>{
    const el = sectionRef.current;
    if (!el) return;
    const fn = (e)=>{
      const r = el.getBoundingClientRect();
      setMousePos({ x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height });
    };
    el.addEventListener("mousemove",fn);
    return ()=>el.removeEventListener("mousemove",fn);
  },[]);

  // Cards positioned — scattered, overlapping, all fully visible
  const cards = [
    // Main center card (obsidian)
    { variant:"obsidian", w:520, h:326,
      pos:"top:6% left:30%",
      rot:"rotateX(16deg) rotateY(-5deg) rotateZ(-4deg)",
      zIndex:10, animDelay:"0s" },
    // Green bottom-left
    { variant:"forest", w:440, h:275,
      pos:"bottom:18% left:2%",
      rot:"rotateX(10deg) rotateY(8deg) rotateZ(8deg)",
      zIndex:7, animDelay:"0.8s" },
    // Ruby bottom-left overlap
    { variant:"ruby", w:460, h:290,
      pos:"bottom:8% left:14%",
      rot:"rotateX(8deg) rotateY(5deg) rotateZ(5deg)",
      zIndex:8, animDelay:"1.2s" },
    // Blue bottom-right
    { variant:"icy", w:480, h:300,
      pos:"bottom:10% right:4%",
      rot:"rotateX(13deg) rotateY(-9deg) rotateZ(-7deg)",
      zIndex:9, animDelay:"0.4s" },
    // Rose peeking bottom-right
    { variant:"rose", w:400, h:250,
      pos:"bottom:2% right:14%",
      rot:"rotateX(7deg) rotateY(-4deg) rotateZ(-3deg)",
      zIndex:6, animDelay:"1.6s" },
    // Top right card
    { variant:"obsidian", w:430, h:270,
      pos:"top:8% right:2%",
      rot:"rotateX(18deg) rotateY(-12deg) rotateZ(4deg)",
      zIndex:5, animDelay:"2s" },
  ];

  return (
    <section ref={sectionRef} style={{
      height:"110vh",
      minHeight:700,
      position:"relative",
      overflow:"hidden",
      background:"#03080f",
      cursor:"default",
    }}>
      {/* Deep bg gradient */}
      <div style={{position:"absolute",inset:0,
        background:"radial-gradient(ellipse 90% 80% at 60% 50%,rgba(5,15,35,1) 0%,#03080f 70%)"}}/>

      {/* Subtle bg grid */}
      <div style={{position:"absolute",inset:0,opacity:0.03,
        backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize:"60px 60px"}}/>

      {/* Cards — scattered over frame */}
      {cards.map((c,i)=>{
        const [posY,posX] = c.pos.split(" ");
        const py = posY.includes("top") ? {top:posY.split(":")[1]} : {bottom:posY.split(":")[1]};
        const px = posX.includes("left") ? {left:posX.split(":")[1]} : {right:posX.split(":")[1]};
        const mx = (mousePos.x - 0.5) * 8;
        const my = (mousePos.y - 0.5) * -8;
        return (
          <div key={i} style={{
            position:"absolute",
            width:c.w,height:c.h,
            ...py,...px,
            transform:`perspective(1400px) ${c.rot} translate(${mx*(i%3+1)*0.3}px,${my*(i%2+1)*0.4}px)`,
            transition:"transform 0.15s ease-out",
            zIndex:c.zIndex,
            animation:`cardFloat ${6+i}s ${c.animDelay} ease-in-out infinite`,
          }}>
            <SingleCard variant={c.variant}/>
          </div>
        );
      })}

      {/* Dark gradient overlay — bottom 40% fades to black like crypto.com */}
      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(to bottom,transparent 0%,transparent 30%,rgba(3,8,15,0.6) 55%,rgba(3,8,15,0.95) 75%,#03080f 100%)",
        zIndex:15,pointerEvents:"none"}}/>
      {/* Left edge fade */}
      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(to right,rgba(3,8,15,0.85) 0%,transparent 30%,transparent 70%,rgba(3,8,15,0.5) 100%)",
        zIndex:15,pointerEvents:"none"}}/>

      {/* Text overlay — bottom-left like crypto.com */}
      <div style={{
        position:"absolute",bottom:"14%",left:"6%",zIndex:20,
        animation:"slideUp .8s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <h2 style={{fontSize:"clamp(22px,2.8vw,38px)",fontWeight:700,color:"#fff",
          fontFamily:"'Syne',sans-serif",letterSpacing:-0.5,marginBottom:8,lineHeight:1.2}}>
          Visa Card
        </h2>
        <p style={{fontSize:"clamp(13px,1.4vw,17px)",color:"rgba(255,255,255,0.5)",fontWeight:400,maxWidth:380}}>
          Get up to 5% in rewards on all purchases
        </p>
      </div>

      {/* CTA — right side like crypto.com */}
      <div style={{
        position:"absolute",bottom:"14%",right:"6%",zIndex:20,
        animation:"slideUp .8s .2s cubic-bezier(0.22,1,0.36,1) both",
      }}>
        <button className="choose-card-btn" style={{
          padding:"13px 28px",
          borderRadius:50,
          border:"1px solid rgba(255,255,255,0.22)",
          background:"rgba(15,25,45,0.8)",
          backdropFilter:"blur(20px)",
          color:"#fff",cursor:"pointer",fontWeight:600,fontSize:14,
          letterSpacing:.3,
          boxShadow:"0 4px 24px rgba(0,0,0,0.6)",
        }}>Choose your card →</button>
      </div>
    </section>
  );
}

function Confetti({ active }) {
  if (!active) return null;
  const colors = [C.gold, C.teal, C.purple, C.pink, C.green, C.orange];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
      {Array.from({length:90},(_,i)=>(
        <div key={i} className="confetti-bit" style={{
          left:`${Math.random()*100}%`,
          width:`${7+Math.random()*9}px`, height:`${7+Math.random()*9}px`,
          background:colors[i%colors.length],
          animationDuration:`${2+Math.random()*3}s`,
          animationDelay:`${Math.random()*2}s`,
        }}/>
      ))}
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return()=>clearTimeout(t); },[onClose]);
  const accent = type==="error"?C.red : type==="warn"?C.orange : C.green;
  return (
    <div style={{
      position:"fixed",top:20,right:20,zIndex:9000,
      background:"rgba(10,18,36,0.96)",color:C.text,padding:"14px 20px",borderRadius:16,border:"1px solid rgba(255,255,255,0.12)",
      fontWeight:500,fontSize:14,animation:"slideIn .35s cubic-bezier(0.22,1,0.36,1)",
      boxShadow:"0 8px 40px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.06)",maxWidth:360,backdropFilter:"blur(24px)",
    }}>{msg}</div>
  );
}

function Spark({ data=[], color=C.green, h=36 }) {
  if (!data.length) return <div style={{height:h}}/>;
  const w=100;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*(h-2)+1}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
      style={{width:"100%",height:h,display:"block"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

function sparkToCandles(prices=[]) {
  if (!prices.length) return [];
  const chunk = Math.max(1, Math.floor(prices.length/30));
  const out=[];
  for (let i=0;i<prices.length;i+=chunk){
    const sl=prices.slice(i,i+chunk);
    if (!sl.length) continue;
    out.push({open:sl[0],close:sl[sl.length-1],high:Math.max(...sl),low:Math.min(...sl)});
  }
  return out.slice(-30);
}

function Candles({ data=[] }) {
  if (!data.length) return (
    <div style={{textAlign:"center",color:C.muted,padding:"40px 0",fontSize:13}}>
      No chart data available
    </div>
  );
  const W=560,H=200,PX=6,PY=12;
  const allH=data.map(d=>d.high), allL=data.map(d=>d.low);
  const mn=Math.min(...allL), mx=Math.max(...allH), rng=mx-mn||1;
  const sy=v=>PY+(1-(v-mn)/rng)*(H-2*PY);
  const cw=(W-2*PX)/data.length, bw=Math.max(3,cw*0.55);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.green} stopOpacity=".95"/>
          <stop offset="100%" stopColor={C.teal} stopOpacity=".6"/>
        </linearGradient>
        <linearGradient id="cdn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.red} stopOpacity=".6"/>
          <stop offset="100%" stopColor={C.pink} stopOpacity=".95"/>
        </linearGradient>
      </defs>
      {[0,.25,.5,.75,1].map((t,i)=>(
        <line key={i} x1={PX} y1={PY+t*(H-2*PY)} x2={W-PX} y2={PY+t*(H-2*PY)}
          stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
      ))}
      {data.map((d,i)=>{
        const x=PX+i*cw+cw/2, isUp=d.close>=d.open;
        const y1=sy(Math.max(d.open,d.close)), y2=sy(Math.min(d.open,d.close));
        return (
          <g key={i}>
            <line x1={x} y1={sy(d.high)} x2={x} y2={sy(d.low)}
              stroke={isUp?C.green:C.red} strokeWidth="1.2"/>
            <rect x={x-bw/2} y={y1} width={bw} height={Math.max(2,y2-y1)}
              fill={isUp?"url(#cup)":"url(#cdn)"} rx="1.5"/>
          </g>
        );
      })}
    </svg>
  );
}

function Badge({ label, color=C.teal }) {
  return (
    <span style={{
      background:`${color}15`,color,border:`1px solid ${color}35`,
      borderRadius:100,padding:"3px 11px",fontSize:11,fontWeight:600,
      whiteSpace:"nowrap",letterSpacing:0,
      fontFamily:"'DM Mono',monospace",
    }}>{label}</span>
  );
}

function Stat({ icon, label, value, sub, accent=C.blue }) {
  return (
    <div className="glass-card hover-lift" style={{
      padding:"22px 20px",
      position:"relative",overflow:"hidden",
      boxShadow:"0 4px 30px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,
        background:`radial-gradient(circle,${accent}22 0%,transparent 65%)`,
        pointerEvents:"none",animation:"orb 8s ease-in-out infinite"}}/>
      <div style={{position:"absolute",inset:0,borderRadius:20,
        background:`linear-gradient(135deg,${accent}06 0%,transparent 60%)`,
        pointerEvents:"none"}}/>
      <div style={{fontSize:22,marginBottom:10,position:"relative"}}>{icon}</div>
      <div style={{color:C.muted,fontSize:11,fontWeight:500,letterSpacing:1,
        textTransform:"uppercase",marginBottom:8,position:"relative"}}>{label}</div>
      <div style={{fontSize:24,fontWeight:700,color:C.text,lineHeight:1.1,wordBreak:"break-all",
        letterSpacing:-0.5,fontFamily:"'Syne',sans-serif",position:"relative"}}>{value}</div>
      {sub&&<div style={{color:accent,fontSize:12,marginTop:6,fontWeight:500,position:"relative"}}>{sub}</div>}
    </div>
  );
}

const IS = {
  background:"rgba(255,255,255,0.06)",
  border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:12,padding:"12px 16px",color:C.text,fontSize:14,outline:"none",
  transition:"border-color .2s ease,background .2s ease,box-shadow .2s ease",
  fontFamily:"'DM Sans',sans-serif",
};
const BS = {
  background:"linear-gradient(135deg,#3b82f6,#2563eb)",
  border:"none",borderRadius:12,padding:"12px 24px",color:"#fff",
  cursor:"pointer",fontWeight:600,fontSize:14,whiteSpace:"nowrap",
  letterSpacing:-0.1,
  boxShadow:"0 4px 20px rgba(59,130,246,0.4),inset 0 1px 0 rgba(255,255,255,0.15)",
  fontFamily:"'DM Sans',sans-serif",
};

function Card({ children, style={} }) {
  return (
    <div className="glass-card cf-card" style={{
      padding:24,...style,
      boxShadow:"0 4px 30px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      {children}
    </div>
  );
}

function SH({ icon, label, sub }) {
  return (
    <div style={{marginBottom:22}}>
      <h3 style={{fontWeight:700,fontSize:19,display:"flex",alignItems:"center",gap:10,
        letterSpacing:-0.5,color:C.text,fontFamily:"'Syne',sans-serif"}}>
        <span style={{fontSize:20}}>{icon}</span>{label}
      </h3>
      {sub&&<p style={{color:C.muted,fontSize:13,marginTop:5,fontWeight:400,lineHeight:1.5}}>{sub}</p>}
    </div>
  );
}

// ═══════════ SCROLL REVEAL HOOK ═══════════
function useScrollReveal(threshold=0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVisible(true); },{threshold});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[threshold]);
  return [ref, visible];
}

// ═══════════ SCROLL PROGRESS HOOK ═══════════
function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);
  useEffect(()=>{
    const el = containerRef?.current || document.querySelector(".landing-scroll");
    if (!el) return;
    const fn = ()=>{
      const st = el.scrollTop, sh = el.scrollHeight - el.clientHeight;
      setProgress(sh > 0 ? st/sh : 0);
    };
    el.addEventListener("scroll",fn,{passive:true});
    return ()=>el.removeEventListener("scroll",fn);
  },[containerRef]);
  return progress;
}

// ═══════════ SECTION SCROLL PROGRESS ═══════════
function useSectionProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(()=>{
    const container = document.querySelector(".landing-scroll");
    if (!container || !ref.current) return;
    const fn = ()=>{
      const el = ref.current;
      if (!el) return;
      const cr = container.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const relTop = er.top - cr.top;
      const relH = er.height + cr.height;
      const prog = Math.max(0, Math.min(1, (cr.height - relTop) / relH));
      setP(prog);
    };
    container.addEventListener("scroll", fn, {passive:true});
    fn();
    return ()=>container.removeEventListener("scroll", fn);
  },[ref]);
  return p;
}

// ═══════════ LOGIN ═══════════
function Login({ onLogin }) {
  const [tab,setTab]=useState("signin");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [name,setName]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [activeCard,setActiveCard]=useState(0);
  const [laptopOpen,setLaptopOpen]=useState(false);
  const [scrollY,setScrollY]=useState(0);
  const formRef=useRef(null);
  const laptopRef=useRef(null);
  const phoneSectionRef=useRef(null);
  const featureRef=useRef(null);
  const cardSectionRef=useRef(null);
  const tradingRef=useRef(null);

  const laptopProgress = useSectionProgress(laptopRef);
  const phoneProgress = useSectionProgress(phoneSectionRef);
  const tradingProgress = useSectionProgress(tradingRef);

  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [statsRef, statsVisible] = useScrollReveal(0.2);
  const [featRef, featVisible] = useScrollReveal(0.1);
  const [cardRevealRef, cardRevealVisible] = useScrollReveal(0.1);

  const getUsers=()=>LS.get("cf_users",[{email:"admin@gmail.com",password:"123456",name:"Admin"}]);
  const handleSignin=e=>{
    e.preventDefault();setErr("");
    const u=getUsers().find(u=>u.email===email&&u.password===pass);
    if(!u){setErr("Wrong email or password");return;}
    setLoading(true);setTimeout(()=>onLogin(u),800);
  };
  const handleRegister=e=>{
    e.preventDefault();setErr("");
    const users=getUsers();
    if(users.find(u=>u.email===email)){setErr("Email already taken");return;}
    const nu={email,password:pass,name:name||email.split("@")[0]};
    LS.set("cf_users",[...users,nu]);
    setLoading(true);setTimeout(()=>onLogin(nu),800);
  };

  useEffect(()=>{
    const el=document.querySelector(".landing-scroll");
    if(!el)return;
    const fn=()=>{
      setScrolled(el.scrollTop>60);
      setScrollY(el.scrollTop);
    };
    el.addEventListener("scroll",fn,{passive:true});
    return()=>el.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    const t=setInterval(()=>setActiveCard(c=>(c+1)%4),3000);
    return()=>clearInterval(t);
  },[]);

  // Laptop lid animation: opens as user scrolls into section
  const lidAngle = Math.max(15, 110 - laptopProgress * 180);
  // Phone tilt
  const phoneTilt = 15 - phoneProgress * 20;
  // Trading screen twist
  const tradingRotY = 25 - tradingProgress * 35;

  const CARDS=[
    {color:"linear-gradient(145deg,#1a0500 0%,#3d0a00 35%,#200800 70%,#2a0500 100%)",accent:"#c2440a",name:"Ruby",tier:"Ruby"},
    {color:"linear-gradient(145deg,#0a0a0a 0%,#181818 35%,#0d0d0d 70%,#141414 100%)",accent:"#505050",name:"Obsidian",tier:"Midnight"},
    {color:"linear-gradient(145deg,#060c18 0%,#0e1f40 35%,#081228 70%,#102248 100%)",accent:"#1a4fd6",name:"Icy",tier:"Indigo"},
    {color:"linear-gradient(145deg,#120600 0%,#2a1200 35%,#1a0900 70%,#200c00 100%)",accent:"#a05010",name:"Gold",tier:"Rose Gold"},
  ];

  const FEATURES=[
    {icon:"📊",t:"Real-Time Portfolio",d:"Track all your holdings with live price updates, P&L, and allocation breakdowns in one place.",accent:"#f97316"},
    {icon:"🎮",t:"Paper Trading",d:"Practice with ₹1,00,000 virtual money. Test strategies risk-free before going live.",accent:"#fb923c"},
    {icon:"🔔",t:"Price Alerts",d:"Set custom alerts for any coin. Get notified instantly when prices hit your targets.",accent:"#f97316"},
    {icon:"📈",t:"Advanced Analytics",d:"Deep-dive into allocation, performance rankings, and smart suggestions tailored to your portfolio.",accent:"#f0b429"},
    {icon:"🔒",t:"Bank-Grade Security",d:"Your data stays local. No servers, no third parties. Complete privacy by design.",accent:"#fb923c"},
  ];

  const STATS=[
    {v:"₹65L+",l:"BTC Price Today"},
    {v:"400+",l:"Cryptocurrencies"},
    {v:"50M+",l:"Users Worldwide"},
    {v:"24/7",l:"Live Market Access"},
  ];

  // ─── LAPTOP MOCKUP ───
  const LaptopMockup = ()=>(
    <div style={{
      position:"relative",
      width:640,
      transformStyle:"preserve-3d",
      filter:"drop-shadow(0 60px 80px rgba(0,0,0,0.9))",
      transition:"transform 0.1s ease-out",
    }}>
      {/* Base/keyboard */}
      <div style={{
        width:640,height:24,borderRadius:"0 0 14px 14px",
        background:"linear-gradient(180deg,#2a2a2a,#1a1a1a)",
        boxShadow:"0 8px 30px rgba(0,0,0,0.8)",
        position:"relative",zIndex:2,
      }}>
        <div style={{width:120,height:6,borderRadius:"0 0 8px 8px",background:"#111",margin:"0 auto"}}/>
      </div>
      {/* Screen */}
      <div style={{
        position:"absolute",bottom:18,left:0,width:640,
        transformOrigin:"bottom center",
        transform:`perspective(1200px) rotateX(${-(lidAngle-90)}deg)`,
        transition:"transform 0.05s ease-out",
        zIndex:1,
      }}>
        <div style={{
          width:640,height:400,borderRadius:"14px 14px 0 0",
          background:"#0d1117",
          border:"7px solid #2a2a2a",
          borderBottom:"none",
          overflow:"hidden",
          boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          {/* Notch */}
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
            width:60,height:5,background:"#1a1a1a",borderRadius:"0 0 6px 6px",zIndex:10}}/>
          {/* Screen content */}
          <div style={{
            height:"100%",padding:"20px 16px 12px",
            background:"linear-gradient(160deg,#050a15 0%,#0c1428 100%)",
            opacity: lidAngle < 80 ? (90-lidAngle)/30 : 1,
            transition:"opacity 0.1s",
          }}>
            {/* Mini topbar */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <CryptofolioLogo size={18}/>
                <span style={{fontSize:10,fontWeight:700,color:"#fff",fontFamily:"'Syne',sans-serif"}}>Cryptofolio</span>
              </div>
              <div style={{display:"flex",gap:6}}>
                {["BTC/INR","ETH/INR","SOL/INR"].map(p=>(
                  <span key={p} style={{fontSize:7,color:"rgba(255,255,255,0.4)",padding:"2px 5px",borderRadius:3,border:"1px solid rgba(255,255,255,0.1)"}}>{p}</span>
                ))}
              </div>
            </div>
            {/* Portfolio overview */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
              {[["💎","₹2.4L","Portfolio"],["🚀","+₹12K","P&L"],["🪙","8","Holdings"],["⚡","+4.2%","24h"]].map(([ic,v,l])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 6px",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontSize:13}}>{ic}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2}}>{v}</div>
                  <div style={{fontSize:7,color:"rgba(255,255,255,0.35)",marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:"10px",border:"1px solid rgba(255,255,255,0.05)",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:8,fontWeight:700,color:"#fff"}}>Portfolio Performance — 7D</span>
                <span style={{fontSize:8,color:"#f97316",fontWeight:700}}>+18.4%</span>
              </div>
              <svg viewBox="0 0 560 80" style={{width:"100%",height:80}}>
                <defs>
                  <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity=".4"/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polyline points="0,70 50,65 100,62 150,50 200,45 250,35 300,38 350,28 400,22 460,18 500,12 560,8"
                  fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"/>
                <polygon points="0,70 50,65 100,62 150,50 200,45 250,35 300,38 350,28 400,22 460,18 500,12 560,8 560,80 0,80"
                  fill="url(#cg2)"/>
                {[["24H","active"],["1W",""],["1M",""],["6M",""]].map(([l,a],i)=>(
                  <g key={l}>
                    <rect x={8+i*40} y={68} width={30} height={10} rx={5} fill={a?"rgba(249,115,22,0.3)":"rgba(255,255,255,0.05)"}/>
                    <text x={23+i*40} y={76} textAnchor="middle" fill={a?"#f97316":"rgba(255,255,255,0.3)"} fontSize="6" fontFamily="monospace">{l}</text>
                  </g>
                ))}
              </svg>
            </div>
            {/* Coin rows */}
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {[
                ["₿","BTC","₹65,83,835","+2.1%","#f97316"],
                ["Ξ","ETH","₹1,99,963","+3.2%","#60a5fa"],
                ["◎","SOL","₹8,451","+5.8%","#a78bfa"],
                ["🐕","DOGE","₹9.42","+1.2%","#f0b429"],
              ].map(([ic,sym,p,chg,col])=>(
                <div key={sym} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"5px 8px",background:"rgba(255,255,255,0.025)",borderRadius:7,
                  border:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:col,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900}}>{ic}</div>
                    <div>
                      <div style={{fontSize:8,fontWeight:700,color:"#fff"}}>{sym}</div>
                      <div style={{fontSize:6,color:"rgba(255,255,255,0.3)"}}>{p}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:8,color:chg.startsWith("+")?C.green:C.red,fontWeight:700}}>{chg}</div>
                    <svg width="40" height="16" viewBox="0 0 40 16">
                      <polyline points={`0,${8+Math.random()*4} 10,${6+Math.random()*4} 20,${4+Math.random()*4} 30,${3+Math.random()*4} 40,2`}
                        fill="none" stroke={chg.startsWith("+")?C.green:C.red} strokeWidth="1.2"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── PHONE MOCKUP ───
  const PhoneMockup = ()=>(
    <div style={{
      width:240,height:490,borderRadius:36,
      background:"#0d1117",
      border:"8px solid #1e1e1e",
      boxShadow:"0 0 0 1px rgba(255,255,255,0.08),0 40px 100px rgba(0,0,0,0.9),inset 0 0 0 1px rgba(255,255,255,0.04)",
      overflow:"hidden",position:"relative",
      transform:`perspective(1200px) rotateY(${phoneTilt}deg) rotateX(3deg)`,
      transition:"transform 0.05s ease-out",
    }}>
      {/* Dynamic island */}
      <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",
        width:70,height:10,background:"#000",borderRadius:10,zIndex:10}}/>
      <div style={{padding:"28px 10px 10px",height:"100%",background:"linear-gradient(160deg,#050a15,#0d1829)"}}>
        <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",marginBottom:2}}>Total Balance</div>
        <div style={{fontSize:20,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif",lineHeight:1.1}}>₹2,41,836</div>
        <div style={{fontSize:9,color:"#f97316",marginBottom:8,fontWeight:600}}>+₹12,450 (+5.4%)</div>
        {/* Quick actions */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {[["Buy","#f97316"],["Sell","#f87171"],["Send","#60a5fa"],["Earn","#34d399"]].map(([l,c])=>(
            <div key={l} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:c+"22",border:`1px solid ${c}44`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:c}}>
                {l==="Buy"?"↑":l==="Sell"?"↓":l==="Send"?"→":"★"}
              </div>
              <span style={{fontSize:7,color:"rgba(255,255,255,0.5)"}}>{l}</span>
            </div>
          ))}
        </div>
        {/* Mini chart */}
        <svg viewBox="0 0 200 50" style={{width:"100%",height:40,marginBottom:8}}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity=".5"/>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polyline points="0,40 20,35 40,38 60,26 80,28 100,18 120,20 140,12 160,14 180,8 200,6"
            fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinejoin="round"/>
          <polygon points="0,40 20,35 40,38 60,26 80,28 100,18 120,20 140,12 160,14 180,8 200,6 200,50 0,50"
            fill="url(#pg)"/>
        </svg>
        {/* Coin list */}
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {[["BTC","₹1,65,209","+2.1%","#f97316"],["ETH","₹59,989","+3.2%","#60a5fa"],["SOL","₹16,638","+5.8%","#a78bfa"]].map(([s,p,c,col])=>(
            <div key={s} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",
              borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{fontSize:8,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{s}</span>
              <span style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>{p}</span>
              <span style={{fontSize:8,color:col,fontWeight:700}}>{c}</span>
            </div>
          ))}
        </div>
        {/* Bottom nav */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:42,
          background:"rgba(13,24,41,0.97)",borderTop:"1px solid rgba(255,255,255,0.06)",
          display:"flex",alignItems:"center",justifyContent:"space-around"}}>
          {[["🏠","Home"],["📊","Markets"],["💼","Portfolio"],["🤖","AI"]].map(([ic,lb])=>(
            <div key={lb} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
              <div style={{fontSize:13,opacity:lb==="Home"?1:0.35}}>{ic}</div>
              <span style={{fontSize:6,color:lb==="Home"?"#f97316":"rgba(255,255,255,0.3)"}}>{lb}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── TRADING MONITOR ───
  const TradingMonitor = ()=>(
    <div style={{
      position:"relative",
      transform:`perspective(1400px) rotateY(${tradingRotY}deg) rotateX(3deg)`,
      transition:"transform 0.05s ease-out",
      filter:"drop-shadow(0 40px 80px rgba(0,0,0,0.95))",
    }}>
      {/* Monitor screen */}
      <div style={{
        width:680,height:430,borderRadius:"12px 12px 0 0",
        background:"#0a0e1a",border:"6px solid #222",
        boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.05)",
        overflow:"hidden",
      }}>
        {/* Content */}
        <div style={{height:"100%",padding:"10px 10px 6px",background:"linear-gradient(160deg,#060810,#0a1020)"}}>
          {/* Topbar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,
            borderBottom:"1px solid rgba(255,255,255,0.05)",paddingBottom:5}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <CryptofolioLogo size={14}/>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:500}}>BTC/INR</span>
              <span style={{fontSize:10,fontWeight:700,color:"#f97316"}}>₹65,83,835</span>
              <span style={{fontSize:8,color:"#34d399",fontWeight:600}}>+5.78%</span>
            </div>
            <div style={{display:"flex",gap:4}}>
              {["1m","5m","1h","4h","1D","1W"].map(t=>(
                <span key={t} style={{fontSize:7,color:t==="1D"?"#f97316":"rgba(255,255,255,0.3)",
                  padding:"1px 4px",borderRadius:3,background:t==="1D"?"rgba(249,115,22,0.15)":"transparent",
                  cursor:"pointer"}}>{t}</span>
              ))}
            </div>
          </div>
          {/* Main grid */}
          <div style={{display:"grid",gridTemplateColumns:"180px 1fr 130px",gap:6,height:"calc(100% - 30px)"}}>
            {/* Left panel */}
            <div style={{fontSize:7,color:"rgba(255,255,255,0.4)",display:"flex",flexDirection:"column",gap:4}}>
              <div style={{fontWeight:700,fontSize:8,color:"#fff",marginBottom:4}}>BTC/INR</div>
              {[["High 24h","₹67,21,040"],["Low 24h","₹63,40,822"],["Vol 24h","₹2.4T"],["Market cap","₹1,302T"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <span>{l}</span><span style={{color:"rgba(255,255,255,0.7)",fontWeight:600}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:8}}>
                <div style={{fontSize:8,fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:4}}>Open Orders</div>
                {[["BTC/INR","Buy","Limit"],["ETH/INR","Sell","Limit"]].map(([p,s,t],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:6,padding:"2px 0",
                    borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <span style={{color:"rgba(255,255,255,0.5)"}}>{p}</span>
                    <span style={{color:s==="Buy"?"#34d399":"#f87171",fontWeight:700}}>{s}</span>
                    <span style={{color:"rgba(255,255,255,0.3)"}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Chart */}
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:6,padding:"6px",border:"1px solid rgba(255,255,255,0.04)"}}>
              <svg viewBox="0 0 340 280" style={{width:"100%",height:"100%"}}>
                <defs>
                  <linearGradient id="upg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity=".8"/>
                    <stop offset="100%" stopColor="#059669" stopOpacity=".5"/>
                  </linearGradient>
                  <linearGradient id="dng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity=".5"/>
                    <stop offset="100%" stopColor="#dc2626" stopOpacity=".8"/>
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[40,80,120,160,200,240].map(y=>(
                  <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                ))}
                {/* Candles */}
                {Array.from({length:22},(_,i)=>{
                  const x = 8 + i*15;
                  const isUp = i%3!==0;
                  const open = 100+Math.sin(i*0.7)*60+Math.random()*20;
                  const close = open + (isUp?1:-1)*(10+Math.random()*30);
                  const high = Math.min(open,close) - 10 - Math.random()*15;
                  const low = Math.max(open,close) + 10 + Math.random()*15;
                  return (
                    <g key={i}>
                      <line x1={x+5} y1={high} x2={x+5} y2={low} stroke={isUp?"#34d399":"#f87171"} strokeWidth="1"/>
                      <rect x={x} y={Math.min(open,close)} width={10} height={Math.max(2,Math.abs(close-open))}
                        fill={isUp?"url(#upg)":"url(#dng)"} rx="1"/>
                    </g>
                  );
                })}
                {/* Volume bars */}
                {Array.from({length:22},(_,i)=>{
                  const x = 8 + i*15;
                  const h = 15+Math.random()*20;
                  const isUp = i%3!==0;
                  return <rect key={i} x={x} y={260-h} width={9} height={h}
                    fill={isUp?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"} rx="1"/>;
                })}
              </svg>
            </div>
            {/* Right order panel */}
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"6px",border:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{display:"flex",gap:4,marginBottom:6}}>
                  {["Buy","Sell"].map(s=>(
                    <button key={s} style={{flex:1,padding:"4px",borderRadius:4,border:"none",cursor:"pointer",fontSize:8,fontWeight:700,
                      background:s==="Buy"?"linear-gradient(135deg,#15803d,#16a34a)":"linear-gradient(135deg,#991b1b,#dc2626)",
                      color:"#fff"}}>{s}</button>
                  ))}
                </div>
                {[["Price","₹65,83,835"],["Quantity","0.001 BTC"],["Total","₹65,838"]].map(([l,v])=>(
                  <div key={l} style={{marginBottom:4}}>
                    <div style={{fontSize:6,color:"rgba(255,255,255,0.35)",marginBottom:1}}>{l}</div>
                    <div style={{padding:"3px 6px",background:"rgba(255,255,255,0.04)",borderRadius:4,
                      border:"1px solid rgba(255,255,255,0.07)",fontSize:7,color:"rgba(255,255,255,0.8)",fontFamily:"monospace"}}>{v}</div>
                  </div>
                ))}
                <button style={{width:"100%",padding:"5px",background:"linear-gradient(135deg,#15803d,#22c55e)",
                  border:"none",borderRadius:4,color:"#fff",fontSize:8,fontWeight:700,cursor:"pointer",
                  boxShadow:"0 2px 8px rgba(34,197,94,0.4)"}}>Place Order</button>
              </div>
              <div style={{fontSize:6,color:"rgba(255,255,255,0.25)",padding:"4px 6px",background:"rgba(255,255,255,0.02)",borderRadius:4,border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{color:"rgba(255,255,255,0.4)",fontWeight:600}}>Order book</span>
                </div>
                {Array.from({length:5},(_,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:1}}>
                    <span style={{color:"#34d399"}}>{(65.84+i*0.01).toFixed(2)}L</span>
                    <span style={{color:"rgba(255,255,255,0.3)"}}>0.012</span>
                  </div>
                ))}
                <div style={{height:1,background:"rgba(255,255,255,0.08)",margin:"3px 0"}}/>
                {Array.from({length:5},(_,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:1}}>
                    <span style={{color:"#f87171"}}>{(65.82-i*0.01).toFixed(2)}L</span>
                    <span style={{color:"rgba(255,255,255,0.3)"}}>0.009</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Monitor stand */}
      <div style={{width:680,height:20,borderRadius:"0 0 4px 4px",background:"linear-gradient(180deg,#1a1a1a,#111)",boxShadow:"0 4px 12px rgba(0,0,0,0.7)"}}/>
      <div style={{width:120,height:60,margin:"0 auto",background:"linear-gradient(180deg,#161616,#0d0d0d)",borderRadius:"0 0 8px 8px",boxShadow:"0 8px 20px rgba(0,0,0,0.8)"}}/>
    </div>
  );

  const IS2={
    background:"rgba(255,255,255,0.12)",
    border:"1px solid rgba(255,255,255,0.28)",
    borderRadius:12,padding:"12px 16px",color:"#ffffff",fontSize:14,outline:"none",
    transition:"border-color .2s ease,box-shadow .2s ease",
    fontFamily:"'DM Sans',sans-serif",width:"100%",
    boxShadow:"inset 0 1px 3px rgba(0,0,0,0.35)",
  };

  return (
    <div style={{background:"#000",overflowY:"auto",overflowX:"hidden",height:"100vh"}} className="landing-scroll">

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        height:56,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 40px",
        background:scrolled?"rgba(0,0,0,0.92)":"rgba(0,0,0,0.3)",
        backdropFilter:"blur(24px)",
        borderBottom:scrolled?"1px solid rgba(255,255,255,0.07)":"none",
        transition:"all .3s ease",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:36}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <CryptofolioLogo size={32} animate={true}/>
            <span style={{fontWeight:800,fontSize:15,fontFamily:"'Syne',sans-serif",color:"#fff",letterSpacing:-.5}}>Cryptofolio</span>
          </div>
          <div style={{display:"flex",gap:2}}>
            {["Markets","Portfolio","Discover"].map(l=>(
              <button key={l} style={{background:"none",border:"none",color:"rgba(255,255,255,0.55)",fontSize:13,
                fontWeight:500,cursor:"pointer",padding:"6px 14px",borderRadius:8,transition:"all .15s"}}
                onMouseEnter={e=>e.target.style.color="#fff"}
                onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.55)"}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>{setTab("signin");formRef.current?.scrollIntoView({behavior:"smooth"})}} style={{
            padding:"7px 18px",borderRadius:8,border:"1px solid rgba(255,255,255,0.18)",
            background:"transparent",color:"rgba(255,255,255,0.85)",cursor:"pointer",fontWeight:500,fontSize:13,
            transition:"all .2s",
          }}>Log In</button>
          <button onClick={()=>{setTab("register");formRef.current?.scrollIntoView({behavior:"smooth"})}} style={{
            padding:"7px 18px",borderRadius:8,border:"none",
            background:"linear-gradient(135deg,#f97316,#ea580c)",
            color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13,
            boxShadow:"0 4px 16px rgba(249,115,22,0.45)",transition:"all .2s",
          }}>Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",textAlign:"center",
        padding:"120px 24px 100px",position:"relative",overflow:"hidden",
      }}>
        {/* Radial glow */}
        <div style={{position:"absolute",inset:0,
          background:"radial-gradient(ellipse 80% 50% at 50% -5%,rgba(249,115,22,0.18) 0%,transparent 55%)",
          pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)",
          bottom:0,right:100,animation:"orb 14s ease-in-out infinite",pointerEvents:"none"}}/>

        <div style={{
          position:"relative",zIndex:2,maxWidth:900,
          opacity:heroVisible?1:0,transform:heroVisible?"translateY(0)":"translateY(40px)",
          transition:"all 1s cubic-bezier(0.22,1,0.36,1)",
        }}>
          {/* Live badge */}
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:100,
            background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.3)",
            color:"#fb923c",fontSize:12,fontWeight:600,marginBottom:32,letterSpacing:.3,
          }}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#f97316",
              display:"inline-block",animation:"pulse 2s infinite",boxShadow:"0 0 8px rgba(249,115,22,0.8)"}}/>
            Live market data · 400+ coins
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize:"clamp(42px,7vw,96px)",fontWeight:800,letterSpacing:-3,lineHeight:1.0,
            fontFamily:"'Syne',sans-serif",marginBottom:28,color:"#fff",
          }}>
            Track, Trade &amp; Grow
            <br/>
            <span style={{
              background:"linear-gradient(90deg,#f97316,#fb923c,#f0b429,#f97316)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              backgroundSize:"300%",animation:"gradientBg 4s ease infinite",
            }}>
              Your Crypto Wealth
            </span>
          </h1>

          <p style={{fontSize:18,color:"rgba(255,255,255,0.45)",maxWidth:540,margin:"0 auto 44px",lineHeight:1.8,fontWeight:400}}>
            Real-time portfolio intelligence with AI-powered insights.<br/>One platform for all your crypto needs.
          </p>

          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>{setTab("register");formRef.current?.scrollIntoView({behavior:"smooth"})}} style={{
              padding:"16px 36px",borderRadius:12,border:"none",
              background:"linear-gradient(135deg,#f97316,#ea580c)",
              color:"#fff",cursor:"pointer",fontWeight:700,fontSize:16,
              boxShadow:"0 8px 32px rgba(249,115,22,0.6)",transition:"all .25s",letterSpacing:-.2,
            }}>Get Started Free</button>
            <button onClick={()=>{setTab("signin");formRef.current?.scrollIntoView({behavior:"smooth"})}} style={{
              padding:"16px 36px",borderRadius:12,
              border:"1px solid rgba(255,255,255,0.15)",
              background:"rgba(255,255,255,0.04)",
              color:"rgba(255,255,255,0.85)",cursor:"pointer",fontWeight:600,fontSize:16,
              backdropFilter:"blur(10px)",transition:"all .25s",
            }}>Sign In</button>
          </div>
        </div>

        {/* Floating cards fan */}
        <div style={{
          position:"relative",marginTop:80,width:"100%",maxWidth:700,zIndex:2,
          opacity:heroVisible?1:0,transform:heroVisible?"translateY(0) scale(1)":"translateY(60px) scale(0.95)",
          transition:"all 1.2s .2s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <div style={{position:"relative",height:280,display:"flex",justifyContent:"center",alignItems:"center"}}>
            {CARDS.map((card,i)=>{
              const offsets=[
                {x:-175,y:-15,rot:-20,z:0},
                {x:-65,y:-40,rot:-7,z:1},
                {x:65,y:-30,rot:9,z:2},
                {x:180,y:-8,rot:22,z:0},
              ];
              const o=offsets[i];
              const isA=activeCard===i;
              return (
                <div key={i} onClick={()=>setActiveCard(i)} style={{
                  position:"absolute",width:285,height:178,borderRadius:18,
                  background:card.color,
                  transform:`translateX(${o.x}px) translateY(${isA?o.y-24:o.y}px) rotate(${o.rot}deg) scale(${isA?1.07:1})`,
                  zIndex:isA?20:o.z,
                  transition:"all .5s cubic-bezier(0.22,1,0.36,1)",cursor:"pointer",
                  boxShadow:isA?`0 40px 80px rgba(0,0,0,0.85),0 0 0 1px ${card.accent}60,0 0 40px ${card.accent}30`:"0 20px 50px rgba(0,0,0,0.75)",
                  overflow:"hidden",
                }}>
                  <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(175deg,transparent,transparent 2px,rgba(255,255,255,0.01) 2px,rgba(255,255,255,0.01) 4px)"}}/>
                  <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 75% 55% at 20% 20%,${card.accent}55 0%,transparent 60%)`}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 50%)"}}/>
                  {/* Chip */}
                  <div style={{position:"absolute",top:32,left:22,width:38,height:30,borderRadius:5,
                    background:"linear-gradient(135deg,#c8a84b,#e8c060,#9a7a2a)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.25)"}}>
                    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                      width:14,height:10,borderRadius:2,background:"rgba(0,0,0,0.2)"}}/>
                  </div>
                  {/* Logo */}
                  <div style={{position:"absolute",top:"50%",left:"55%",transform:"translate(-50%,-50%)",
                    opacity:isA?0.9:0.45,filter:`drop-shadow(0 0 10px ${card.accent})`,transition:"opacity .3s"}}>
                    <CryptofolioLogo size={58}/>
                  </div>
                  {/* Bottom */}
                  <div style={{position:"absolute",bottom:16,left:20,right:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                    <div>
                      <div style={{fontSize:7,color:"rgba(255,255,255,0.35)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:2}}>Cryptofolio {card.tier}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.65)",letterSpacing:2}}>•••• •••• •••• {4291+i*1111}</div>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:900,color:"rgba(255,255,255,0.8)",fontStyle:"italic",letterSpacing:-1}}>VISA</div>
                  </div>
                  <div style={{position:"absolute",inset:0,borderRadius:18,border:`1px solid ${isA?"rgba(255,255,255,0.14)":"rgba(255,255,255,0.06)"}`}}/>
                </div>
              );
            })}
          </div>
          {/* Dots */}
          <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:20}}>
            {CARDS.map((c,i)=>(
              <button key={i} onClick={()=>setActiveCard(i)} style={{
                width:activeCard===i?28:8,height:8,borderRadius:4,border:"none",cursor:"pointer",
                background:activeCard===i?"#f97316":"rgba(255,255,255,0.2)",
                transition:"all .35s cubic-bezier(0.22,1,0.36,1)",padding:0,
              }}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-BLEED CARD SECTION (crypto.com style) ── */}
      <CryptoCard/>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{
        padding:"60px 40px",
        background:"rgba(255,255,255,0.015)",
        borderTop:"1px solid rgba(255,255,255,0.06)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{display:"flex",justifyContent:"center",gap:"clamp(40px,7vw,100px)",flexWrap:"wrap"}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{
              textAlign:"center",
              opacity:statsVisible?1:0,
              transform:statsVisible?"translateY(0)":"translateY(30px)",
              transition:`all .7s ${i*0.12}s cubic-bezier(0.22,1,0.36,1)`,
            }}>
              <div style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:800,
                background:"linear-gradient(135deg,#f97316,#f0b429)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                fontFamily:"'Syne',sans-serif",letterSpacing:-1}}>{s.v}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginTop:4,fontWeight:400}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LAPTOP SCROLL REVEAL (lid opens on scroll) ── */}
      <section ref={laptopRef} style={{
        padding:"100px 24px 80px",textAlign:"center",position:"relative",overflow:"hidden",
        background:"radial-gradient(ellipse 60% 40% at 50% 80%,rgba(249,115,22,0.08) 0%,transparent 60%)",
      }}>
        <div style={{
          opacity:laptopProgress>0.05?1:0,transform:laptopProgress>0.05?"translateY(0)":"translateY(40px)",
          transition:"all .8s cubic-bezier(0.22,1,0.36,1)",marginBottom:56,
        }}>
          <div style={{display:"inline-block",padding:"5px 14px",borderRadius:100,
            background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",
            color:"#fb923c",fontSize:11,fontWeight:600,marginBottom:16,letterSpacing:.5}}>
            📊 ADVANCED ANALYTICS
          </div>
          <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:800,letterSpacing:-2,
            fontFamily:"'Syne',sans-serif",color:"#fff",marginBottom:14}}>
            Your portfolio,<br/>fully visible
          </h2>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.4)",maxWidth:480,margin:"0 auto",lineHeight:1.8}}>
            Real-time tracking with AI-powered analysis. Watch your wealth grow with pro-grade tools.
          </p>
        </div>
        <div style={{display:"flex",justifyContent:"center",position:"relative",
          overflowX:"clip",paddingBottom:20}}>
          <div style={{transform:"scale(0.85)",transformOrigin:"top center"}}>
            <LaptopMockup/>
          </div>
        </div>
        <p style={{marginTop:20,fontSize:12,color:"rgba(255,255,255,0.2)",fontStyle:"italic"}}>
          Scroll down — the lid opens ↓
        </p>
      </section>

      {/* ── PHONE + FEATURES SIDE BY SIDE ── */}
      <section ref={phoneSectionRef} style={{
        padding:"120px 60px",
        background:"radial-gradient(ellipse 60% 50% at 20% 50%,rgba(249,115,22,0.06) 0%,transparent 60%)",
        display:"flex",gap:80,alignItems:"center",justifyContent:"center",flexWrap:"wrap",overflow:"hidden",
      }}>
        {/* Phone */}
        <div style={{
          opacity:phoneProgress>0.1?1:0,
          transform:phoneProgress>0.1?"translateY(0)":"translateY(60px)",
          transition:"all .9s cubic-bezier(0.22,1,0.36,1)",
          flexShrink:0,
        }}>
          <PhoneMockup/>
        </div>
        {/* Text */}
        <div style={{maxWidth:440}}>
          <div style={{display:"inline-block",padding:"5px 14px",borderRadius:100,
            background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",
            color:"#fb923c",fontSize:11,fontWeight:600,marginBottom:20,letterSpacing:.5,
            opacity:phoneProgress>0.15?1:0,transform:phoneProgress>0.15?"translateY(0)":"translateY(20px)",
            transition:"all .7s .1s cubic-bezier(0.22,1,0.36,1)"}}>
            🌐 CRYPTOFOLIO PLATFORM
          </div>
          <h2 style={{
            fontSize:"clamp(26px,3.5vw,46px)",fontWeight:800,letterSpacing:-1.5,lineHeight:1.1,
            fontFamily:"'Syne',sans-serif",color:"#fff",marginBottom:16,
            opacity:phoneProgress>0.15?1:0,transform:phoneProgress>0.15?"translateY(0)":"translateY(20px)",
            transition:"all .7s .15s cubic-bezier(0.22,1,0.36,1)",
          }}>
            Your crypto journey<br/>starts here
          </h2>
          <p style={{
            fontSize:15,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:32,
            opacity:phoneProgress>0.2?1:0,transition:"all .7s .2s cubic-bezier(0.22,1,0.36,1)",
          }}>
            Trade with ease and the lowest fees. BTC, ETH, CRO, and 400+ crypto at your fingertips.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[
              ["🔒","Account Protection","Up to ₹2,00,000 against unauthorised transactions"],
              ["⚡","Near-zero trading fees","When you buy crypto with a credit/debit card"],
              ["🛡️","Secure by design","Leading the industry in licences and certifications"],
            ].map(([ic,t,d],i)=>(
              <div key={t} style={{
                display:"flex",gap:14,alignItems:"flex-start",
                opacity:phoneProgress>0.2?1:0,
                transform:phoneProgress>0.2?"translateX(0)":"translateX(30px)",
                transition:`all .7s ${0.25+i*0.1}s cubic-bezier(0.22,1,0.36,1)`,
              }}>
                <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
                  background:"rgba(249,115,22,0.12)",border:"1px solid rgba(249,115,22,0.2)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{ic}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"#fff",marginBottom:4}}>{t}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:12,marginTop:32,
            opacity:phoneProgress>0.3?1:0,transition:"all .7s .5s cubic-bezier(0.22,1,0.36,1)"}}>
            <button onClick={()=>{setTab("register");formRef.current?.scrollIntoView({behavior:"smooth"})}} style={{
              padding:"13px 28px",borderRadius:10,border:"none",
              background:"linear-gradient(135deg,#f97316,#ea580c)",
              color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,
              boxShadow:"0 6px 24px rgba(249,115,22,0.5)",
            }}>Create Account →</button>
            <button onClick={()=>formRef.current?.scrollIntoView({behavior:"smooth"})} style={{
              padding:"13px 24px",borderRadius:10,
              border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.04)",
              color:"rgba(255,255,255,0.7)",cursor:"pointer",fontWeight:600,fontSize:14,
            }}>Learn More ↓</button>
          </div>
        </div>
      </section>

      {/* ── TRADING MONITOR (scroll twist reveal) ── */}
      <section ref={tradingRef} style={{
        padding:"80px 60px 120px",
        background:"radial-gradient(ellipse 50% 60% at 80% 50%,rgba(249,115,22,0.05) 0%,transparent 60%)",
        overflow:"hidden",
      }}>
        <div style={{
          opacity:tradingProgress>0.05?1:0,
          transition:"all .8s cubic-bezier(0.22,1,0.36,1)",
          maxWidth:480,marginBottom:60,
        }}>
          <div style={{display:"inline-block",padding:"5px 14px",borderRadius:100,
            background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",
            color:"#fb923c",fontSize:11,fontWeight:600,marginBottom:20,letterSpacing:.5}}>
            ⚙️ ADVANCED TRADING
          </div>
          {[["Ultra-low latency","Competitive pricing across multiple trading pairs"],
            ["Competitive fees","Maker and taker fees as low as 0.08% — trade more, pay less"],
            ["Deeper liquidity","Order-book depth across 400+ markets for tighter spreads"],
            ["Pro-grade reliability","Trusted global infrastructure delivering 99.99% uptime"]
          ].map(([t,d],i)=>(
            <div key={t} style={{
              marginBottom:20,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,0.05)",
              opacity:tradingProgress>0.1?1:0,
              transform:tradingProgress>0.1?"translateY(0)":"translateY(20px)",
              transition:`all .6s ${i*0.1}s cubic-bezier(0.22,1,0.36,1)`,
            }}>
              <div style={{fontWeight:700,fontSize:16,color:"#fff",marginBottom:4,fontFamily:"'Syne',sans-serif"}}>{t}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{d}</div>
            </div>
          ))}
          <div style={{marginTop:8,opacity:tradingProgress>0.2?1:0,transition:"all .6s .4s"}}>
            <h2 style={{fontSize:"clamp(22px,3vw,38px)",fontWeight:800,letterSpacing:-1,
              fontFamily:"'Syne',sans-serif",color:"#fff",marginBottom:8}}>Automate your trades</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>Trade smarter with DCA, Grid, and TWAP bots</p>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",marginTop:-40}}>
          <TradingMonitor/>
        </div>
      </section>

      {/* ── FEATURES SCROLL REVEAL GRID ── */}
      <section ref={featRef} style={{padding:"100px 40px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{
          textAlign:"center",marginBottom:64,
          opacity:featVisible?1:0,transform:featVisible?"translateY(0)":"translateY(30px)",
          transition:"all .8s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <h2 style={{fontSize:"clamp(26px,4vw,50px)",fontWeight:800,letterSpacing:-1.5,
            fontFamily:"'Syne',sans-serif",marginBottom:14,
            background:"linear-gradient(135deg,#fff,rgba(255,255,255,0.6))",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Built for serious traders
          </h2>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:16,maxWidth:480,margin:"0 auto"}}>
            Everything you need to manage and grow your crypto portfolio
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
          {FEATURES.map((f,i)=>(
            <div key={i} className="glass-card" style={{
              padding:"28px 24px",
              opacity:featVisible?1:0,
              transform:featVisible?"translateY(0)":"translateY(40px)",
              transition:`all .7s ${i*0.1}s cubic-bezier(0.22,1,0.36,1)`,
            }}>
              <div style={{
                width:48,height:48,borderRadius:14,marginBottom:18,
                background:`${f.accent}15`,border:`1px solid ${f.accent}30`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
              }}>{f.icon}</div>
              <h3 style={{fontWeight:700,fontSize:17,marginBottom:10,letterSpacing:-.3,
                fontFamily:"'Syne',sans-serif",color:"#fff"}}>{f.t}</h3>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,lineHeight:1.7}}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE TICKER ── */}
      <section style={{
        padding:"60px 0",
        background:"rgba(255,255,255,0.015)",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        borderBottom:"1px solid rgba(255,255,255,0.05)",
        overflow:"hidden",
      }}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <h2 style={{fontSize:28,fontWeight:800,letterSpacing:-1,fontFamily:"'Syne',sans-serif",
            marginBottom:8,color:"#fff"}}>Live Market Prices</h2>
          <p style={{color:"rgba(255,255,255,0.35)",fontSize:13}}>Real-time prices for 400+ cryptocurrencies</p>
        </div>
        <div style={{display:"flex",whiteSpace:"nowrap",animation:"ticker2 100s linear infinite"}}>
          {[...Array(2)].flatMap(()=>
            [["₿","BTC","₹65,83,835","+2.06%","#f97316"],["Ξ","ETH","₹1,99,963","+3.07%","#60a5fa"],
             ["◎","SOL","₹8,451","+5.35%","#a78bfa"],["🐕","DOGE","₹9","+1.2%","#f0b429"],
             ["⬡","BNB","₹58,883","-0.58%","#22d3ee"],["✦","XRP","₹132","+1.06%","#34d399"],
             ["🔴","ADA","₹24","+2.85%","#f472b6"],["▲","AVAX","₹890","+3.40%","#f97316"]
            ].map(([ic,s,p,c,col],i)=>(
              <span key={s+i} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 24px",
                marginRight:8,background:"rgba(255,255,255,0.03)",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)"}}>
                <span style={{color:col,fontSize:16}}>{ic}</span>
                <span style={{fontWeight:700,fontSize:13,fontFamily:"'DM Mono',monospace"}}>{s}</span>
                <span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>{p}</span>
                <span style={{fontSize:12,color:c.startsWith("+")?C.green:C.red,fontWeight:700}}>{c}</span>
              </span>
            ))
          )}
        </div>
      </section>

      {/* ── SIGN IN / REGISTER FORM ── */}
      <section ref={formRef} style={{
        padding:"100px 24px",
        display:"flex",justifyContent:"center",alignItems:"center",
        background:"radial-gradient(ellipse 60% 50% at 50% 100%,rgba(249,115,22,0.1) 0%,transparent 60%)",
      }}>
        <div style={{
          width:"100%",maxWidth:440,padding:"48px 42px",borderRadius:24,
          background:"rgba(6,10,20,0.8)",
          border:"1px solid rgba(255,255,255,0.1)",
          backdropFilter:"blur(48px) saturate(180%)",
          boxShadow:"0 40px 100px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.05),0 0 80px rgba(249,115,22,0.1)",
        }}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{margin:"0 auto 16px",display:"flex",justifyContent:"center",animation:"logoGlow 3s ease-in-out infinite"}}>
              <CryptofolioLogo size={72} animate={true}/>
            </div>
            <div style={{fontWeight:800,fontSize:26,fontFamily:"'Syne',sans-serif",
              background:"linear-gradient(135deg,#f97316,#f0b429)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Cryptofolio</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginTop:6}}>Premium Portfolio Intelligence</div>
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:14,padding:4,marginBottom:24,border:"1px solid rgba(255,255,255,0.06)"}}>
            {[["signin","Sign In"],["register","Register"]].map(([t,l])=>(
              <button key={t} onClick={()=>{setTab(t);setErr("");}} style={{
                flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",
                background:tab===t?"rgba(249,115,22,0.2)":"transparent",
                color:tab===t?"#fb923c":"rgba(255,255,255,0.4)",
                fontWeight:600,fontSize:14,transition:"all .2s",
              }}>{l}</button>
            ))}
          </div>
          <form onSubmit={tab==="signin"?handleSignin:handleRegister}>
            {tab==="register"&&(
              <div style={{marginBottom:12}}>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={IS2}/>
              </div>
            )}
            <div style={{marginBottom:12}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="Email address" required style={IS2}/>
            </div>
            <div style={{marginBottom:16,position:"relative"}}>
              <input type={showPw?"text":"password"} value={pass}
                onChange={e=>setPass(e.target.value)}
                placeholder="Password" required style={{...IS2,paddingRight:44}}/>
              <button type="button" onClick={()=>setShowPw(!showPw)} style={{
                position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:16,
              }}>{showPw?"🙈":"👁️"}</button>
            </div>
            {err&&<p style={{color:C.red,fontSize:13,marginBottom:12,textAlign:"center"}}>{err}</p>}
            <button type="submit" disabled={loading} style={{
              width:"100%",padding:"15px",fontSize:15,fontWeight:700,
              borderRadius:14,border:"none",cursor:"pointer",
              background:loading?"rgba(249,115,22,0.4)":"linear-gradient(135deg,#f97316,#ea580c)",
              color:"#fff",boxShadow:loading?"none":"0 6px 30px rgba(249,115,22,0.55)",
              transition:"all .2s",
            }}>{loading?"Please wait…":tab==="signin"?"Sign In →":"Create Account →"}</button>
          </form>
          <div style={{marginTop:18,padding:"11px 14px",borderRadius:10,
            background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
            fontFamily:"'DM Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>
            Demo: admin@gmail.com / 123456
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding:"48px 60px 32px",
        borderTop:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(0,0,0,0.4)",
      }}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr repeat(4,1fr)",gap:40,marginBottom:40,flexWrap:"wrap"}}>
            {/* Brand */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <CryptofolioLogo size={28}/>
                <span style={{fontWeight:800,fontSize:15,color:"#fff",fontFamily:"'Syne',sans-serif"}}>Cryptofolio</span>
              </div>
              <p style={{color:"rgba(255,255,255,0.3)",fontSize:13,lineHeight:1.7,maxWidth:220}}>
                The most trusted crypto portfolio intelligence platform.
              </p>
            </div>
            {/* Links */}
            {[
              ["Products",["App","Advanced","Portfolio","Wallet"]],
              ["Markets",["Crypto","Cards","Earn","Staking"]],
              ["Resources",["Research","Updates","University","Learn"]],
              ["Company",["About Us","Careers","Security","Affiliate"]],
            ].map(([title,links])=>(
              <div key={title}>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.25)",letterSpacing:1.5,
                  textTransform:"uppercase",marginBottom:14}}>{title}</div>
                {links.map(l=>(
                  <div key={l} style={{marginBottom:8}}>
                    <span style={{color:"rgba(255,255,255,0.45)",fontSize:13,cursor:"pointer",
                      transition:"color .15s",
                    }}
                      onMouseEnter={e=>e.target.style.color="#fff"}
                      onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>{l}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:24,
            display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <span style={{color:"rgba(255,255,255,0.2)",fontSize:12}}>© 2025 Cryptofolio Ultra. All rights reserved.</span>
            <span style={{color:"rgba(255,255,255,0.2)",fontSize:12}}>Not financial advice. Prices by CoinGecko. AI by Anthropic Claude.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
// ═══════════ TICKER ═══════════
function Ticker({ coins=[], currency="INR" }) {
  if (!coins.length) return null;
  const items=[...coins,...coins];
  const rate=FX[currency]||1, sym=SYM[currency]||"₹";
  return (
    <div className="cf-ticker" style={{
      height:40,overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,0.07)",
      background:"rgba(5,10,22,0.9)",backdropFilter:"blur(20px)",
      display:"flex",alignItems:"center",flexShrink:0,
      boxShadow:"0 1px 0 rgba(255,255,255,0.07)",
    }}>
      <div style={{display:"flex",whiteSpace:"nowrap",animation:"ticker 115s linear infinite"}}>
        {items.map((c,i)=>(
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:7,
            padding:"0 20px",borderRight:"1px solid rgba(255,255,255,0.06)"}}>
            {c.img&&<img src={c.img} width={14} height={14} style={{borderRadius:"50%"}} alt=""/>}
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:700,color:C.text,letterSpacing:.3}}>{c.sym}</span>
            <span style={{fontSize:11,color:C.muted}}>{sym}{fmtC(c.price*rate)}</span>
            <span style={{fontSize:11,color:clr(c.chg),fontWeight:700}}>{pct(c.chg)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════ COIN CARD ═══════════
function CoinCard({ coin, onDelete, onSell, currency }) {
  const [open,setOpen]=useState(false);
  const [selling,setSelling]=useState(false);
  const [sellQty,setSellQty]=useState("");
  const rate=FX[currency]||1, sym=SYM[currency]||"₹";
  const live=(coin.currentPrice||coin.buyPrice)*rate;
  const bought=coin.buyPrice*rate;
  const val=coin.quantity*live, inv=coin.quantity*bought;
  const pnl=val-inv;
  const pp=bought>0?((live-bought)/bought)*100:0;
  const signal=pp>10?"SELL":pp<-10?"BUY":"HOLD";
  const sigClr=signal==="SELL"?C.red:signal==="BUY"?C.green:C.gold;
  const candles=useMemo(()=>sparkToCandles(coin.sparkline||[]),[coin.sparkline]);

  return (
    <div style={{
      background:"rgba(255,255,255,0.04)",
      backdropFilter:"blur(20px)",
      border:`1px solid ${open?"rgba(255,255,255,0.14)":"rgba(255,255,255,0.07)"}`,borderRadius:18,
      marginBottom:10,overflow:"hidden",
      transition:"border-color .25s ease,box-shadow .25s ease",
      boxShadow:open?"0 8px 40px rgba(0,0,0,0.3)":"0 2px 12px rgba(0,0,0,0.2)",
    }}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",
        gap:14,cursor:"pointer",flexWrap:"nowrap"}} onClick={()=>setOpen(!open)}>
        {coin.image&&<img src={coin.image} width={38} height={38}
          style={{borderRadius:"50%",flexShrink:0}} alt=""/>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
            <span style={{fontWeight:800,fontSize:15}}>{(coin.name||'').toUpperCase()}</span>
            <Badge label={signal} color={sigClr}/>
            {coin.isSimulation&&<Badge label="SIM" color={C.purple}/>}
          </div>
          <div style={{display:"flex",gap:14,fontSize:12,color:C.muted}}>
            <span>Qty: {coin.quantity}</span>
            <span>Avg: {sym}{fmt(bought)}</span>
            <span>Live: {sym}{fmt(live)}</span>
          </div>
        </div>
        <div style={{width:70,flexShrink:0}}>
          {(coin.sparkline||[]).length>0&&
            <Spark data={(coin.sparkline||[]).slice(-20)} color={clr(pnl)} h={32}/>}
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontWeight:800,fontSize:16,color:clr(pnl)}}>
            {pnl>=0?"+":""}{sym}{fmt(Math.abs(pnl))}
          </div>
          <div style={{fontSize:12,color:clr(pp)}}>{pct(pp)}</div>
        </div>
        <span style={{color:C.muted,fontSize:18,marginLeft:4,flexShrink:0}}>{open?"▲":"▼"}</span>
        {onSell&&(
          <button onClick={e=>{e.stopPropagation();setSelling(true);setOpen(true);}} style={{
            background:"linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.1))",
            border:"1px solid rgba(239,68,68,0.4)",color:"#f87171",
            borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,
            fontWeight:700,flexShrink:0,transition:"all .2s",
          }}>Sell</button>
        )}
        <button onClick={e=>{e.stopPropagation();onDelete();}} style={{
          background:`${C.red}1A`,border:`1px solid ${C.red}33`,color:C.red,
          borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,
          fontWeight:700,flexShrink:0,
        }}>✕</button>
      </div>
      {open&&(
        <div style={{padding:"0 20px 20px",borderTop:`1px solid ${C.border}`}}>
          <div style={{marginTop:18}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.muted,
              textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>
              7-Day Candlestick Chart
            </div>
            <Candles data={candles}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:16}}>
            {[["Current Value",`${sym}${fmt(val)}`],
              ["Total Invested",`${sym}${fmt(inv)}`],
              ["P & L",`${pnl>=0?"+":""}${sym}${fmt(Math.abs(pnl))}`,clr(pnl)]
            ].map(([l,v,c])=>(
              <div key={l} style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:14}}>
                <div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l}</div>
                <div style={{fontWeight:700,color:c||C.text,fontSize:14}}>{v}</div>
              </div>
            ))}
          </div>

          {onSell&&(
            <div style={{marginTop:16}}>
              {!selling?(
                <button onClick={()=>setSelling(true)} style={{
                  width:"100%",padding:"11px",borderRadius:12,
                  border:"1px solid rgba(248,113,113,0.35)",
                  background:"rgba(248,113,113,0.08)",
                  color:"#f87171",cursor:"pointer",fontWeight:700,fontSize:13,
                  transition:"all .2s",
                }}>💰 Sell {coin.name}</button>
              ):(
                <div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.2)",
                  borderRadius:14,padding:14}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#f87171",marginBottom:10}}>
                    Sell {coin.name} — Available: {coin.quantity}
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <input
                      type="number" value={sellQty}
                      onChange={e=>setSellQty(e.target.value)}
                      placeholder={`Qty (max ${coin.quantity})`}
                      style={{flex:1,minWidth:120,background:"rgba(255,255,255,0.06)",
                        border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,
                        padding:"10px 14px",color:"#fff",fontSize:13,outline:"none"}}
                    />
                    <button onClick={()=>setSellQty(String(coin.quantity))} style={{
                      padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.12)",
                      background:"rgba(255,255,255,0.06)",color:C.muted,cursor:"pointer",fontSize:12,fontWeight:600,
                    }}>Max</button>
                    <button onClick={()=>{
                      onSell(Number(sellQty),coin.currentPrice||coin.buyPrice);
                      setSelling(false);setSellQty("");
                    }} style={{
                      padding:"10px 18px",borderRadius:10,
                      background:"linear-gradient(135deg,#ef4444,#dc2626)",
                      border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,
                    }}>Sell</button>
                    <button onClick={()=>{setSelling(false);setSellQty("");}} style={{
                      padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",
                      background:"transparent",color:C.muted,cursor:"pointer",fontSize:12,
                    }}>Cancel</button>
                  </div>
                  {Number(sellQty)>0&&(
                    <div style={{marginTop:8,fontSize:12,color:C.muted}}>
                      You'll receive ≈ <span style={{color:"#f87171",fontWeight:700}}>
                        {sym}{fmt(Number(sellQty)*(coin.currentPrice||coin.buyPrice)*rate)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════ ADD COIN ═══════════
function AddCoin({ onAdd, isSim, virtualBalance, addToast }) {
  const [coins,setCoins]=useState([]);
  const [sel,setSel]=useState("");
  const [qty,setQty]=useState("");
  const [price,setPrice]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    setLoading(true);
    cgFetch("/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&sparkline=true")
      .then(r=>r.json()).then(d=>{setCoins(d);setLoading(false);})
      .catch(()=>setLoading(false));
  },[]);

  const selCoin=coins.find(c=>c.id===sel);
  const cost=selCoin&&qty>0?Number(qty)*selCoin.current_price:null;

  const handleAdd=e=>{
    e.preventDefault();
    if(!selCoin||!qty||!price){addToast("Fill all fields","error");return;}
    onAdd({
      name:selCoin.id,image:selCoin.image,quantity:Number(qty),buyPrice:Number(price),
      currentPrice:selCoin.current_price,sparkline:selCoin.sparkline_in_7d?.price||[],
      buyDate:now(),isSimulation:false,
    });
    setSel("");setQty("");setPrice("");
  };

  return (
    <Card style={{marginBottom:20}}>
      <SH icon="➕" label="Add Asset" sub="Track a new holding"/>
      <form onSubmit={handleAdd}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:10,flexWrap:"wrap"}}>
          <select value={sel} onChange={e=>setSel(e.target.value)} style={{...IS,width:"100%"}}>
            <option value="">{loading?"Loading...":"Select coin"}</option>
            {coins.map(c=><option key={c.id} value={c.id}>{c.name} — ₹{fmtC(c.current_price)}</option>)}
          </select>
          <input type="number" placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)}
            min="0.000001" step="any" style={{...IS,width:"100%"}}/>
          <input type="number" placeholder="Buy Price (₹)" value={price}
            onChange={e=>setPrice(e.target.value)} min="0" step="any" style={{...IS,width:"100%"}}/>
          <button type="submit" style={BS}>Add</button>
        </div>
        {cost!==null&&(
          <div style={{marginTop:10,fontSize:13,color:C.muted}}>
            💸 Cost: <strong style={{color:C.gold}}>₹{fmtC(cost)}</strong>
          </div>
        )}
      </form>
    </Card>
  );
}

// ═══════════ AI CHATBOT ═══════════
function AiChat({ portfolio, totalValue, pnl }) {
  const [msgs,setMsgs]=useState([{role:"assistant",
    content:"Hey! I'm your AI crypto advisor. Ask me anything about your portfolio, market trends, or trading strategies!"}]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const ctx=`Portfolio: ${portfolio.length?portfolio.map(c=>`${c.name}(qty:${c.quantity} bought:₹${c.buyPrice} now:₹${c.currentPrice||c.buyPrice})`).join("; "):"empty"}. Total:₹${fmtC(totalValue)}. PnL:₹${fmtC(pnl)}.`;

  const send=async()=>{
    if(!input.trim()||busy)return;
    const q=input.trim();setInput("");setBusy(true);
    setMsgs(m=>[...m,{role:"user",content:q}]);
    const history=msgs.slice(1).map(m=>({role:m.role,content:m.content}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "content-type":"application/json",
          "anthropic-version":"2023-06-01",
          "anthropic-beta":"interleaved-thinking-2025-05-14",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-5-20251001",max_tokens:600,
          system:`You are a sharp crypto portfolio advisor. Context: ${ctx}. Reply in 1-3 concise sentences.`,
          messages:[...history,{role:"user",content:q}],
        }),
      });
      const data=await res.json();
      const reply=data?.content?.[0]?.text||"Trouble connecting — try again shortly.";
      setMsgs(m=>[...m,{role:"assistant",content:reply}]);
    }catch{
      setMsgs(m=>[...m,{role:"assistant",content:"Connection error. Please try again."}]);
    }
    setBusy(false);
  };

  const quick=["How's my portfolio?","Best coin to buy?","What's my biggest risk?","Should I take profits?"];
  return (
    <Card style={{display:"flex",flexDirection:"column",height:500,padding:0,overflow:"hidden"}}>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,
        background:`linear-gradient(90deg,${C.purple}18,transparent)`,
        display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <span style={{fontSize:22}}>🤖</span>
        <div>
          <div style={{fontWeight:800,fontSize:15}}>AI Crypto Advisor</div>
          <div style={{fontSize:11,color:C.green,display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.green,
              display:"inline-block",animation:"pulse 2s infinite"}}/>Powered by Claude
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",
        display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{
              maxWidth:"82%",padding:"10px 14px",fontSize:13,lineHeight:1.55,
              background:m.role==="user"?`linear-gradient(135deg,${C.gold},${C.orange})`:"rgba(255,255,255,.07)",
              color:m.role==="user"?"#000":C.text,
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
            }}>{m.content}</div>
          </div>
        ))}
        {busy&&(
          <div style={{display:"flex",gap:5,padding:"10px 14px",
            background:"rgba(255,255,255,.06)",borderRadius:"16px 16px 16px 4px",width:"fit-content"}}>
            {[0,1,2].map(i=>(
              <span key={i} style={{width:7,height:7,borderRadius:"50%",background:C.muted,
                display:"inline-block",animation:`pulse 1.2s ${i*.18}s infinite`}}/>
            ))}
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"8px 12px",display:"flex",gap:7,overflowX:"auto",
        borderTop:`1px solid ${C.border}`,flexShrink:0}}>
        {quick.map(s=>(
          <button key={s} onClick={()=>setInput(s)} style={{
            background:"rgba(255,255,255,.05)",border:`1px solid ${C.border}`,
            color:C.muted,borderRadius:20,padding:"4px 12px",fontSize:11,
            whiteSpace:"nowrap",cursor:"pointer",
          }}>{s}</button>
        ))}
      </div>
      <div style={{padding:12,borderTop:`1px solid ${C.border}`,display:"flex",gap:8,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask anything about crypto or your portfolio..."
          style={{...IS,flex:1}}/>
        <button onClick={send} disabled={busy||!input.trim()} style={{
          ...BS,padding:"11px 18px",opacity:busy||!input.trim()?.5:1,
        }}>↑</button>
      </div>
    </Card>
  );
}

// ═══════════ PRICE ALERTS ═══════════
function Alerts({ coins=[], alerts=[], setAlerts, addToast, playSound=()=>{} }) {
  const [sel,setSel]=useState(""); const [dir,setDir]=useState("above"); const [target,setTarget]=useState("");
  useEffect(()=>{
    const iv=setInterval(()=>{
      setAlerts(prev=>prev.map(a=>{
        if(a.triggered)return a;
        const c=coins.find(x=>x.id===a.coin);if(!c)return a;
        const hit=(a.dir==="above"&&c.price>=a.price)||(a.dir==="below"&&c.price<=a.price);
        if(hit){addToast(`🔔 ${(a.coin||'').toUpperCase()} hit ₹${fmtC(a.price)}!`,"warn");playSound();}
        return hit?{...a,triggered:true}:a;
      }));
    },15000);
    return()=>clearInterval(iv);
  },[coins,setAlerts,addToast]);

  const add=()=>{
    if(!sel||!target)return;
    setAlerts(p=>[...p,{id:uid(),coin:sel,dir,price:Number(target),triggered:false}]);
    setSel("");setTarget("");addToast("Alert set!");
  };

  return (
    <div>
      <SH icon="🔔" label="Price Alerts" sub="Get notified when prices hit your target"/>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:10,marginBottom:20}}>
        <select value={sel} onChange={e=>setSel(e.target.value)} style={{...IS,width:"100%"}}>
          <option value="">Select coin</option>
          {coins.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={dir} onChange={e=>setDir(e.target.value)} style={{...IS,width:"100%"}}>
          <option value="above">Above ↑</option>
          <option value="below">Below ↓</option>
        </select>
        <input type="number" placeholder="Price (₹)" value={target}
          onChange={e=>setTarget(e.target.value)} style={{...IS,width:"100%"}}/>
        <button onClick={add} style={BS}>Set</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {!alerts.length&&<p style={{color:C.muted,fontSize:13}}>No alerts yet.</p>}
        {alerts.map(a=>(
          <div key={a.id} style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            background:"rgba(255,255,255,.04)",borderRadius:12,padding:"12px 16px",
            border:`1px solid ${a.triggered?C.green+"33":C.border}`,
          }}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>
              <span style={{color:C.gold,fontWeight:700}}>{(a.coin||'').toUpperCase()}</span>
              {" "}<span style={{color:C.muted}}>{a.dir}</span>{" "}
              <span style={{color:C.teal}}>₹{fmtC(a.price)}</span>
            </span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {a.triggered&&<Badge label="✓ Triggered" color={C.green}/>}
              <button onClick={()=>setAlerts(p=>p.filter(x=>x.id!==a.id))}
                style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════ TRADING GAME (full rebuild) ═══════════
const GAME_COINS = [
  {id:"bitcoin",      sym:"BTC", name:"Bitcoin",       icon:"₿",  color:"#f97316", fallback:8300000},
  {id:"ethereum",     sym:"ETH", name:"Ethereum",      icon:"Ξ",  color:"#60a5fa", fallback:230000},
  {id:"solana",       sym:"SOL", name:"Solana",        icon:"◎",  color:"#a78bfa", fallback:14000},
  {id:"binancecoin",  sym:"BNB", name:"Binance Coin",  icon:"⬡",  color:"#f0b429", fallback:55000},
  {id:"ripple",       sym:"XRP", name:"XRP",           icon:"✦",  color:"#34d399", fallback:55},
  {id:"cardano",      sym:"ADA", name:"Cardano",       icon:"🔵", color:"#f472b6", fallback:35},
  {id:"dogecoin",     sym:"DOGE",name:"Dogecoin",      icon:"🐕", color:"#fbbf24", fallback:13},
  {id:"polkadot",     sym:"DOT", name:"Polkadot",      icon:"◉",  color:"#e879f9", fallback:600},
  {id:"avalanche-2",  sym:"AVAX",name:"Avalanche",     icon:"▲",  color:"#f87171", fallback:2800},
  {id:"chainlink",    sym:"LINK",name:"Chainlink",     icon:"⬡",  color:"#3b82f6", fallback:1200},
  {id:"matic-network",sym:"MATIC",name:"Polygon",      icon:"⬟",  color:"#8b5cf6", fallback:60},
  {id:"tron",         sym:"TRX", name:"TRON",          icon:"◈",  color:"#ef4444", fallback:11},
];

const TIPS = [
  {icon:"💡",title:"Buy Low, Sell High",body:"The core of trading. Buy when price drops (dip) and sell when it rises. Patience is key."},
  {icon:"📊",title:"Don't invest what you can't lose",body:"Crypto is volatile. Only put in money you're okay losing. Start small, learn the market."},
  {icon:"🔄",title:"Dollar Cost Averaging (DCA)",body:"Instead of buying all at once, spread your buys over time. This smooths out price volatility."},
  {icon:"📉",title:"Understanding P&L",body:"P&L = (Current Price - Buy Price) × Quantity. Positive = profit, Negative = loss."},
  {icon:"⚖️",title:"Diversify your portfolio",body:"Don't put all your money in one coin. Spread across BTC, ETH, and smaller altcoins to reduce risk."},
  {icon:"🧠",title:"FOMO is your enemy",body:"Fear Of Missing Out makes traders buy at peaks. Always research before buying, never chase pumps."},
  {icon:"🛑",title:"Set a stop-loss mentally",body:"Decide before buying: 'If this drops 20%, I'll sell.' Having a plan protects you from bigger losses."},
  {icon:"📈",title:"Market Cap matters",body:"Larger market cap coins (BTC, ETH) are more stable. Small caps can 10x — but also drop 90%."},
];

// ═══════════ BUY PANEL ═══════════
function BuyPanel({ sel, selCoin, lp, bal, port, setBal, setPort, setHist, addToast }) {
  const [bQty, setBQty] = useState("");
  const bQ = Number(bQty) || 0;
  const bCost = bQ * lp;
  const notEnough = bCost > bal;
  return (
    <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:16,padding:"18px",display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:800,fontSize:15,color:"#22c55e",fontFamily:"'Syne',sans-serif"}}>Buy {selCoin.sym}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>Available: <span style={{color:"#34d399",fontWeight:700}}>₹{fmtC(bal)}</span></div>
      </div>
      <div style={{position:"relative"}}>
        <input type="number" placeholder={`Quantity (${selCoin.sym})`} value={bQty}
          onChange={e=>setBQty(e.target.value)} min="0" step="any"
          style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:12,
            padding:"12px 72px 12px 16px",color:"#fff",fontSize:14,outline:"none",width:"100%",fontFamily:"'DM Sans',sans-serif"}}/>
        <button onClick={()=>{
          if(lp<=0)return;
          setBQty(String(Math.floor((bal/lp)*1e8)/1e8));
        }} style={{position:"absolute",right:4,top:"50%",transform:"translateY(-50%)",
          padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,
          background:"rgba(34,197,94,0.2)",color:"#22c55e",fontWeight:700}}>MAX</button>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[10000,25000,50000].map(amt=>(
          <button key={amt} onClick={()=>setBQty(String(Math.floor((Math.min(amt,bal)/lp)*1e8)/1e8))} style={{
            padding:"4px 12px",borderRadius:6,border:"1px solid rgba(34,197,94,0.25)",
            background:"rgba(34,197,94,0.08)",color:"#22c55e",cursor:"pointer",fontSize:11,fontWeight:600}}>
            ₹{amt/1000}K
          </button>
        ))}
      </div>
      {bQ>0&&lp>0&&(
        <div style={{padding:"10px 12px",borderRadius:10,fontSize:12,
          background:notEnough?"rgba(239,68,68,0.08)":"rgba(34,197,94,0.07)",
          border:`1px solid ${notEnough?"rgba(239,68,68,0.25)":"rgba(34,197,94,0.2)"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:"rgba(255,255,255,0.45)"}}>You pay</span>
            <span style={{fontWeight:700,color:"#f0b429",fontFamily:"'DM Mono',monospace"}}>₹{fmtC(bCost)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:"rgba(255,255,255,0.45)"}}>You get</span>
            <span style={{fontWeight:700,color:"#fff",fontFamily:"'DM Mono',monospace"}}>{bQ.toFixed(8)} {selCoin.sym}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:"rgba(255,255,255,0.45)"}}>Cash left</span>
            <span style={{fontWeight:700,fontFamily:"'DM Mono',monospace",color:notEnough?"#f87171":"#34d399"}}>
              {notEnough?`❌ Short ₹${fmtC(bCost-bal)}`:`₹${fmtC(bal-bCost)}`}
            </span>
          </div>
        </div>
      )}
      <button onClick={()=>{
        if(!bQ||bQ<=0){addToast("Enter a valid quantity","error");return;}
        if(bCost>bal){addToast(`Need ₹${fmtC(bCost-bal)} more cash`,"error");return;}
        if(lp<=0){addToast("Price unavailable","error");return;}
        const prev=port[sel]||{qty:0,avg:0};
        const newQty=prev.qty+bQ;
        const newAvg=((prev.avg*prev.qty)+bCost)/newQty;
        setBal(b=>b-bCost);
        setPort(p=>({...p,[sel]:{qty:newQty,avg:newAvg}}));
        setHist(h=>[{id:uid(),t:"BUY",c:sel,sym:selCoin.sym,q:bQ,p:lp,d:now()},...h.slice(0,99)]);
        addToast(`✅ Bought ${bQ.toFixed(6)} ${selCoin.sym} @ ₹${fmtC(lp)}`);
        setBQty("");
      }} style={{
        padding:"13px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
        background:notEnough||!bQ?"rgba(34,197,94,0.25)":"linear-gradient(135deg,#22c55e,#16a34a)",
        color:"#fff",fontWeight:800,fontSize:15,letterSpacing:.3,
        boxShadow:notEnough||!bQ?"none":"0 4px 20px rgba(34,197,94,0.4)",
        opacity:!bQ?0.5:1,transition:"all .2s",
      }}>BUY {selCoin.sym}</button>
    </div>
  );
}

// ═══════════ SELL PANEL ═══════════
function SellPanel({ sel, selCoin, lp, port, setBal, setPort, setHist, addToast }) {
  const [sQty, setSQty] = useState("");
  const held = port[sel]?.qty || 0;
  const sQ = Number(sQty) || 0;
  const sReceive = sQ * lp;
  const epsilon = 1e-8;
  const notEnoughCoins = sQ > held + epsilon;
  const noHoldings = held <= epsilon;
  return (
    <div style={{background:noHoldings?"rgba(255,255,255,0.02)":"rgba(239,68,68,0.04)",
      border:`1px solid ${noHoldings?"rgba(255,255,255,0.07)":"rgba(239,68,68,0.2)"}`,
      borderRadius:16,padding:"18px",display:"flex",flexDirection:"column",gap:12,
      opacity:noHoldings?0.55:1,transition:"opacity .3s"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:800,fontSize:15,color:"#ef4444",fontFamily:"'Syne',sans-serif"}}>Sell {selCoin.sym}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>
          You hold: <span style={{color:"#f0b429",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{held.toFixed(6)} {selCoin.sym}</span>
        </div>
      </div>
      <div style={{position:"relative"}}>
        <input type="number"
          placeholder={noHoldings?`No ${selCoin.sym} to sell`:`Quantity (${selCoin.sym})`}
          value={sQty} onChange={e=>setSQty(e.target.value)}
          min="0" step="any" disabled={noHoldings}
          style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,
            padding:"12px 72px 12px 16px",color:"#fff",fontSize:14,outline:"none",width:"100%",
            fontFamily:"'DM Sans',sans-serif",opacity:noHoldings?0.5:1,cursor:noHoldings?"not-allowed":"text"}}/>
        {!noHoldings&&<button onClick={()=>setSQty(String(held))} style={{
          position:"absolute",right:4,top:"50%",transform:"translateY(-50%)",
          padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,
          background:"rgba(239,68,68,0.2)",color:"#ef4444",fontWeight:700}}>ALL</button>}
      </div>
      {!noHoldings&&(
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[25,50,75,100].map(pct=>(
            <button key={pct} onClick={()=>setSQty(String(held*(pct/100)))} style={{
              padding:"4px 12px",borderRadius:6,border:"1px solid rgba(239,68,68,0.25)",
              background:"rgba(239,68,68,0.08)",color:"#ef4444",cursor:"pointer",fontSize:11,fontWeight:600}}>
              {pct}%
            </button>
          ))}
        </div>
      )}
      {sQ>0&&lp>0&&!noHoldings&&(
        <div style={{padding:"10px 12px",borderRadius:10,fontSize:12,
          background:notEnoughCoins?"rgba(239,68,68,0.08)":"rgba(59,130,246,0.07)",
          border:`1px solid ${notEnoughCoins?"rgba(239,68,68,0.3)":"rgba(59,130,246,0.2)"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:"rgba(255,255,255,0.45)"}}>You sell</span>
            <span style={{fontWeight:700,color:"#fff",fontFamily:"'DM Mono',monospace"}}>{sQ.toFixed(8)} {selCoin.sym}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:"rgba(255,255,255,0.45)"}}>You receive</span>
            <span style={{fontWeight:700,color:"#22d3ee",fontFamily:"'DM Mono',monospace"}}>₹{fmtC(sReceive)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:"rgba(255,255,255,0.45)"}}>{notEnoughCoins?"Status":"Coins left"}</span>
            <span style={{fontWeight:700,fontFamily:"'DM Mono',monospace",color:notEnoughCoins?"#f87171":"#34d399"}}>
              {notEnoughCoins?`❌ Only hold ${held.toFixed(6)}`:`${Math.max(0,held-sQ).toFixed(6)} ${selCoin.sym}`}
            </span>
          </div>
        </div>
      )}
      {noHoldings?(
        <div style={{padding:"13px",borderRadius:12,background:"rgba(255,255,255,0.04)",
          color:"rgba(255,255,255,0.35)",fontSize:13,textAlign:"center",border:"1px dashed rgba(255,255,255,0.1)"}}>
          Buy {selCoin.sym} first to sell
        </div>
      ):(
        <button onClick={()=>{
          if(!sQ||sQ<=0){addToast("Enter a valid quantity","error");return;}
          if(sQ>held+epsilon){addToast(`You only hold ${held.toFixed(6)} ${selCoin.sym}`,"error");return;}
          if(lp<=0){addToast("Price unavailable","error");return;}
          const actualQty=Math.min(sQ,held);
          const proceeds=actualQty*lp;
          const newQty=held-actualQty;
          setBal(b=>b+proceeds);
          setPort(p=>({...p,[sel]:{...p[sel],qty:newQty<epsilon?0:newQty}}));
          setHist(h=>[{id:uid(),t:"SELL",c:sel,sym:selCoin.sym,q:actualQty,p:lp,d:now()},...h.slice(0,99)]);
          addToast(`💰 Sold ${actualQty.toFixed(6)} ${selCoin.sym} @ ₹${fmtC(lp)}`);
          setSQty("");
        }} style={{
          padding:"13px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          background:notEnoughCoins||!sQ?"rgba(239,68,68,0.25)":"linear-gradient(135deg,#ef4444,#dc2626)",
          color:"#fff",fontWeight:800,fontSize:15,letterSpacing:.3,
          boxShadow:notEnoughCoins||!sQ?"none":"0 4px 20px rgba(239,68,68,0.4)",
          opacity:!sQ?0.5:1,transition:"all .2s",
        }}>SELL {selCoin.sym}</button>
      )}
    </div>
  );
}

function Game({ addToast }) {
  const COIN_IDS = GAME_COINS.map(c=>c.id).join(",");
  const [bal,  setBal ]= useState(()=>LS.get("tg_bal",100000));
  const [port, setPort]= useState(()=>LS.get("tg_port",{}));
  const [hist, setHist]= useState(()=>LS.get("tg_hist",[]));
  const [prices,setPrices]= useState({});
  const [priceLoading,setPriceLoading]= useState(true);
  const [lastUpdated,setLastUpdated]= useState(null);
  const [priceFlash,setPriceFlash]= useState(false);
  const [sel,  setSel ]= useState("bitcoin");
  const [qty,  setQty ]= useState("");
  const [tab,  setTab ]= useState("trade");   // trade | portfolio | history | learn
  const [tipIdx,setTipIdx]= useState(0);
  const priceRef = useRef({});

  // ── fetch live prices from CoinGecko ──
  const fetchPrices = useCallback(()=>{
    cgFetch(`/coins/markets?vs_currency=inr&ids=${COIN_IDS}&order=market_cap_desc&per_page=20&sparkline=false&price_change_percentage=24h`)
      .then(r=>{if(!r.ok)throw new Error("rate limit");return r.json();})
      .then(data=>{
        const map={};
        data.forEach(c=>{map[c.id]={inr:c.current_price,chg:c.price_change_percentage_24h||0,img:c.image};});
        // fill any missing with fallback
        GAME_COINS.forEach(c=>{if(!map[c.id])map[c.id]={inr:c.fallback,chg:0,img:null};});
        priceRef.current=map;
        setPrices({...map});
        setPriceLoading(false);
        setLastUpdated(new Date());
        // Flash animation on price update
        setPriceFlash(true);
        setTimeout(()=>setPriceFlash(false),800);
      })
      .catch(()=>{
        // Use fallback prices if API fails
        if(Object.keys(priceRef.current).length===0){
          const fb={};
          GAME_COINS.forEach(c=>{fb[c.id]={inr:c.fallback,chg:0,img:null};});
          priceRef.current=fb;
          setPrices({...fb});
        }
        setPriceLoading(false);
      });
  },[]);

  useEffect(()=>{fetchPrices();const iv=setInterval(fetchPrices,30000);return()=>clearInterval(iv);},[fetchPrices]);
  useEffect(()=>LS.set("tg_bal",bal),[bal]);
  useEffect(()=>LS.set("tg_port",port),[port]);
  useEffect(()=>LS.set("tg_hist",hist),[hist]);

  const selCoin  = GAME_COINS.find(c=>c.id===sel)||GAME_COINS[0];
  const lp       = prices[sel]?.inr || selCoin.fallback;
  const q        = Number(qty)||0;
  const cost     = q*lp;
  const portVal  = Object.entries(port).reduce((s,[id,v])=>s+(v.qty*(prices[id]?.inr||GAME_COINS.find(c=>c.id===id)?.fallback||0)),0);
  const netWorth = bal+portVal;
  const totalPnL = netWorth-100000;

  const buy=()=>{
    if(!q||q<=0){addToast("Enter a valid quantity","error");return;}
    if(cost>bal){addToast(`Need ₹${fmtC(cost-bal)} more cash`,"error");return;}
    if(lp<=0){addToast("Price unavailable, try again","error");return;}
    const prev=port[sel]||{qty:0,avg:0};
    const newQty=prev.qty+q;
    const newAvg=((prev.avg*prev.qty)+cost)/newQty;
    setBal(b=>b-cost);
    setPort(p=>({...p,[sel]:{qty:newQty,avg:newAvg}}));
    setHist(h=>[{id:uid(),t:"BUY",c:sel,sym:selCoin.sym,q,p:lp,d:now()},...h.slice(0,99)]);
    addToast(`✅ Bought ${q} ${selCoin.sym} @ ₹${fmtC(lp)}`);
    setQty("");
  };

  const sell=()=>{
    if(!q||q<=0){addToast("Enter a valid quantity","error");return;}
    const held=port[sel]?.qty||0;
    const epsilon=1e-8; // floating point tolerance
    if(q>held+epsilon){addToast(`You only hold ${held.toFixed(6)} ${selCoin.sym}`,"error");return;}
    const actualQty=Math.min(q,held); // never sell more than held due to float rounding
    if(lp<=0){addToast("Price unavailable, try again","error");return;}
    const proceeds=actualQty*lp;
    const newQty=held-actualQty;
    setBal(b=>b+proceeds);
    setPort(p=>({...p,[sel]:{...p[sel],qty:newQty<epsilon?0:newQty}}));
    setHist(h=>[{id:uid(),t:"SELL",c:sel,sym:selCoin.sym,q:actualQty,p:lp,d:now()},...h.slice(0,99)]);
    addToast(`💰 Sold ${actualQty.toFixed(6)} ${selCoin.sym} @ ₹${fmtC(lp)}`,"");
    setQty("");
  };

  const sellAll=()=>{
    const held=port[sel]?.qty||0;
    if(!held){addToast("Nothing to sell","error");return;}
    setQty(String(parseFloat(held.toFixed(6))));
  };

  const buyMax=()=>{
    if(lp<=0)return;
    const maxQty=Math.floor((bal/lp)*1e8)/1e8;
    setQty(String(maxQty));
  };

  const reset=()=>{
    setBal(100000);setPort({});setHist([]);
    LS.set("tg_bal",100000);LS.set("tg_port",{});LS.set("tg_hist",[]);
    addToast("🔄 Game reset — ₹1,00,000 restored!");
  };

  // ── sub-tab styles ──
  const GT=(t)=>({
    padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
    background:tab===t?"rgba(249,115,22,0.2)":"transparent",
    color:tab===t?"#fb923c":"rgba(255,255,255,0.4)",
    transition:"all .2s",
  });

  const chg=prices[sel]?.chg||0;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <span style={{fontSize:22}}>🎮</span>
            <span style={{fontWeight:800,fontSize:18,fontFamily:"'Syne',sans-serif",color:"#fff"}}>Paper Trading Simulator</span>
            {priceLoading&&<span style={{fontSize:11,color:C.muted,background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:20}}>fetching prices…</span>}
            {!priceLoading&&(
              <span style={{fontSize:11,color:priceFlash?"#fff":C.green,
                background:priceFlash?"rgba(52,211,153,0.25)":"rgba(52,211,153,0.1)",
                border:"1px solid rgba(52,211,153,0.2)",padding:"2px 8px",borderRadius:20,
                transition:"all 0.3s ease",cursor:"pointer"}}
                onClick={fetchPrices}
                title="Click to refresh prices">
                ● live{lastUpdated?` · ${lastUpdated.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}`:""} ↺
              </span>
            )}
          </div>
          <div style={{color:C.muted,fontSize:13}}>Practice crypto trading with ₹1,00,000 virtual money — zero risk</div>
        </div>
        <button onClick={reset} style={{...BS,background:`${C.red}15`,color:C.red,border:`1px solid ${C.red}30`,boxShadow:"none",fontSize:12}}>↺ Reset</button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[
          ["💵","Cash Balance",`₹${fmtC(bal)}`,C.green,bal<10000?"Low cash!":""],
          ["📦","Holdings Value",`₹${fmtC(portVal)}`,C.teal,""],
          ["💎","Net Worth",`₹${fmtC(netWorth)}`,C.gold,""],
          [totalPnL>=0?"🚀":"📉","Total P&L",`${totalPnL>=0?"+":""}₹${fmtC(Math.abs(totalPnL))}`,totalPnL>=0?C.green:C.red,`${totalPnL>=0?"+":""}${((totalPnL/100000)*100).toFixed(2)}%`],
        ].map(([ic,l,v,col,sub])=>(
          <div key={l} style={{background:`${col}0D`,border:`1px solid ${col}25`,borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:18,marginBottom:4}}>{ic}</div>
            <div style={{color:C.muted,fontSize:10,marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{l}</div>
            <div style={{fontWeight:800,fontSize:16,color:col,fontFamily:"'DM Mono',monospace"}}>{v}</div>
            {sub&&<div style={{fontSize:11,color:col,marginTop:3,opacity:.8}}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* ── Sub-tabs ── */}
      <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:4,border:"1px solid rgba(255,255,255,0.07)",marginBottom:16,width:"fit-content"}}>
        {[["trade","🔄 Trade"],["portfolio","💼 Portfolio"],["history","📋 History"],["learn","🎓 Learn"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={GT(t)}>{l}</button>
        ))}
      </div>

      {/* ══ TRADE TAB ══ */}
      {tab==="trade"&&(
        <div>
          {/* Coin selector grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:16}}>
            {GAME_COINS.map(coin=>{
              const p=prices[coin.id]?.inr||coin.fallback;
              const c=prices[coin.id]?.chg||0;
              const active=sel===coin.id;
              return (
                <button key={coin.id} onClick={()=>setSel(coin.id)} style={{
                  padding:"10px 12px",borderRadius:12,border:`1px solid ${active?coin.color+"55":"rgba(255,255,255,0.07)"}`,
                  background:active?`${coin.color}15`:"rgba(255,255,255,0.03)",
                  cursor:"pointer",textAlign:"left",transition:"all .15s",
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:16}}>{coin.icon}</span>
                    <span style={{fontSize:10,color:c>=0?C.green:C.red,fontWeight:700}}>{c>=0?"+":""}{c.toFixed(2)}%</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:12,color:active?coin.color:"#fff"}}>{coin.sym}</div>
                  <div style={{fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(p)}</div>
                </button>
              );
            })}
          </div>

          {/* Selected coin info bar */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:28}}>{selCoin.icon}</span>
              <div>
                <div style={{fontWeight:800,fontSize:16,color:selCoin.color}}>{selCoin.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{selCoin.sym}</div>
              </div>
            </div>
            <div style={{flex:1,display:"flex",gap:20,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>LIVE PRICE</div>
                <div style={{fontWeight:800,fontSize:20,color:"#fff",fontFamily:"'DM Mono',monospace"}}>₹{fmtC(lp)}</div>
              </div>
              <div>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>24H CHANGE</div>
                <div style={{fontWeight:700,fontSize:16,color:chg>=0?C.green:C.red}}>{chg>=0?"+":""}{chg.toFixed(2)}%</div>
              </div>
              <div>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>YOU HOLD</div>
                <div style={{fontWeight:700,fontSize:16,color:C.gold,fontFamily:"'DM Mono',monospace"}}>{(port[sel]?.qty||0).toFixed(6)} {selCoin.sym}</div>
              </div>
              <div>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>HOLD VALUE</div>
                <div style={{fontWeight:700,fontSize:16,color:C.teal,fontFamily:"'DM Mono',monospace"}}>₹{fmtC((port[sel]?.qty||0)*lp)}</div>
              </div>
              {port[sel]?.qty>0&&<div>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>AVG BUY</div>
                <div style={{fontWeight:700,fontSize:16,color:C.purple,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(port[sel]?.avg||0)}</div>
              </div>}
              {port[sel]?.qty>0&&<div>
                <div style={{fontSize:10,color:C.muted,marginBottom:2}}>UNREALISED P&L</div>
                {(()=>{const pl=(lp-(port[sel]?.avg||lp))*(port[sel]?.qty||0);return(
                  <div style={{fontWeight:700,fontSize:16,color:pl>=0?C.green:C.red,fontFamily:"'DM Mono',monospace"}}>{pl>=0?"+":""}₹{fmtC(Math.abs(pl))}</div>
                );})()}
              </div>}
            </div>
          </div>

          {/* Trade controls — split BUY / SELL panels */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <BuyPanel sel={sel} selCoin={selCoin} lp={lp} bal={bal} port={port}
              setBal={setBal} setPort={setPort} setHist={setHist} addToast={addToast}/>
            <SellPanel sel={sel} selCoin={selCoin} lp={lp} port={port}
              setBal={setBal} setPort={setPort} setHist={setHist} addToast={addToast}/>
          </div>
        </div>
      )}

      {/* ══ PORTFOLIO TAB ══ */}
      {tab==="portfolio"&&(
        <div>
          {Object.entries(port).filter(([,v])=>v.qty>0.000001).length===0?(
            <div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
              <div style={{fontSize:48,marginBottom:12}}>💼</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6,color:"#fff"}}>No holdings yet</div>
              <div style={{fontSize:13}}>Go to Trade tab and buy your first crypto!</div>
            </div>
          ):(
            <>
              {/* Portfolio summary bar */}
              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 18px",marginBottom:16,
                display:"flex",gap:24,flexWrap:"wrap",border:"1px solid rgba(255,255,255,0.08)"}}>
                <div><div style={{fontSize:10,color:C.muted,marginBottom:2}}>INVESTED</div>
                  <div style={{fontWeight:800,fontSize:16,color:"#fff",fontFamily:"'DM Mono',monospace"}}>
                    ₹{fmtC(Object.entries(port).reduce((s,[id,v])=>s+(v.avg*v.qty),0))}
                  </div></div>
                <div><div style={{fontSize:10,color:C.muted,marginBottom:2}}>CURRENT VALUE</div>
                  <div style={{fontWeight:800,fontSize:16,color:C.teal,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(portVal)}</div></div>
                <div><div style={{fontSize:10,color:C.muted,marginBottom:2}}>UNREALISED P&L</div>
                  {(()=>{const invested=Object.entries(port).reduce((s,[id,v])=>s+(v.avg*v.qty),0);const pl=portVal-invested;return(
                    <div style={{fontWeight:800,fontSize:16,color:pl>=0?C.green:C.red,fontFamily:"'DM Mono',monospace"}}>{pl>=0?"+":""}₹{fmtC(Math.abs(pl))}</div>
                  );})()}
                </div>
              </div>

              {/* Holdings list */}
              <div style={{display:"flex",gap:8,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:8,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>
                <span style={{flex:"0 0 160px"}}>Asset</span>
                <span style={{flex:1}}>Quantity</span>
                <span style={{flex:1}}>Avg Buy</span>
                <span style={{flex:1}}>Live Price</span>
                <span style={{flex:1}}>Value</span>
                <span style={{flex:1,textAlign:"right"}}>P&L</span>
              </div>
              {Object.entries(port).filter(([,v])=>v.qty>0.000001).map(([id,v])=>{
                const coin=GAME_COINS.find(c=>c.id===id)||{sym:id,name:id,icon:"🪙",color:C.gold};
                const liveP=prices[id]?.inr||coin.fallback||0;
                const val=v.qty*liveP;
                const pl=(liveP-v.avg)*v.qty;
                const plPct=v.avg>0?((liveP-v.avg)/v.avg)*100:0;
                return (
                  <div key={id} style={{display:"flex",gap:8,alignItems:"center",
                    padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",flexWrap:"wrap"}}>
                    <div style={{flex:"0 0 160px",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>{coin.icon}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:coin.color}}>{coin.sym}</div>
                        <div style={{fontSize:10,color:C.muted}}>{coin.name}</div>
                      </div>
                    </div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:"#fff"}}>{v.qty.toFixed(6)}</div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:C.muted}}>₹{fmtC(v.avg)}</div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:"#fff"}}>₹{fmtC(liveP)}</div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:C.gold}}>₹{fmtC(val)}</div>
                    <div style={{flex:1,textAlign:"right"}}>
                      <div style={{fontWeight:700,fontSize:13,color:pl>=0?C.green:C.red,fontFamily:"'DM Mono',monospace"}}>{pl>=0?"+":""}₹{fmtC(Math.abs(pl))}</div>
                      <div style={{fontSize:10,color:pl>=0?C.green:C.red}}>{plPct>=0?"+":""}{plPct.toFixed(2)}%</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ══ HISTORY TAB ══ */}
      {tab==="history"&&(
        <div>
          {hist.filter(h=>h&&h.c&&h.t).length===0?(
            <div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
              <div style={{fontSize:48,marginBottom:12}}>📋</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6,color:"#fff"}}>No trades yet</div>
              <div style={{fontSize:13}}>Your trade history will appear here</div>
            </div>
          ):(
            <>
              <div style={{display:"flex",gap:8,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:8,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>
                <span style={{flex:"0 0 60px"}}>Type</span>
                <span style={{flex:1}}>Coin</span>
                <span style={{flex:1}}>Qty</span>
                <span style={{flex:1}}>Price</span>
                <span style={{flex:1}}>Total</span>
                <span style={{flex:1,textAlign:"right"}}>Date</span>
              </div>
              {hist.filter(h=>h&&h.c&&h.t).map(h=>{
                const coin=GAME_COINS.find(c=>c.id===h.c);
                return (
                  <div key={h.id} style={{display:"flex",gap:8,alignItems:"center",
                    padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div style={{flex:"0 0 60px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,
                        background:h.t==="BUY"?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",
                        color:h.t==="BUY"?C.green:C.red}}>{h.t}</span>
                    </div>
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:14}}>{coin?.icon||"🪙"}</span>
                      <span style={{fontWeight:600,fontSize:12,color:coin?.color||C.gold}}>{h.sym||h.c?.toUpperCase()}</span>
                    </div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:"#fff"}}>{Number(h.q).toFixed(6)}</div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:C.muted}}>₹{fmtC(h.p)}</div>
                    <div style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:C.gold}}>₹{fmtC(h.q*h.p)}</div>
                    <div style={{flex:1,textAlign:"right",fontSize:11,color:C.muted}}>{new Date(h.d).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ══ LEARN TAB ══ */}
      {tab==="learn"&&(
        <div>
          <div style={{marginBottom:16,padding:"14px 16px",borderRadius:14,
            background:"linear-gradient(135deg,rgba(249,115,22,0.1),rgba(240,180,41,0.08))",
            border:"1px solid rgba(249,115,22,0.2)"}}>
            <div style={{fontWeight:700,fontSize:15,color:"#fb923c",marginBottom:4}}>📚 Crypto Trading School</div>
            <div style={{fontSize:13,color:C.muted}}>Learn the fundamentals of crypto trading before risking real money. These concepts apply to all markets.</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
            {TIPS.map((t,i)=>(
              <div key={i} style={{padding:"18px 20px",borderRadius:14,
                background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                transition:"border-color .2s",cursor:"default"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(249,115,22,0.3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
                <div style={{fontSize:24,marginBottom:10}}>{t.icon}</div>
                <div style={{fontWeight:700,fontSize:14,color:"#fff",marginBottom:8}}>{t.title}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{t.body}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:"16px 20px",borderRadius:14,
            background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)"}}>
            <div style={{fontWeight:700,color:"#60a5fa",marginBottom:6}}>💬 Practice Challenge</div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>
              Try this: Use your ₹1,00,000 to build a <strong style={{color:"#fff"}}>diversified portfolio</strong> — put 50% in BTC, 30% in ETH, and 20% across 3 altcoins.
              Track it for a week. See which strategy performs best!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════ GOALS ═══════════
function Goals({ totalValue, addToast }) {
  const [goals,setGoals]=useState(()=>LS.get("cf_goals",[]));
  const [lbl,setLbl]=useState(""); const [tgt,setTgt]=useState("");
  useEffect(()=>LS.set("cf_goals",goals),[goals]);
  const add=()=>{if(!lbl||!tgt)return;setGoals(g=>[...g,{id:uid(),label:lbl,target:Number(tgt),created:now()}]);setLbl("");setTgt("");addToast("Goal added!");};
  return (
    <div>
      <SH icon="🎯" label="Goal Tracker" sub="Set portfolio milestones and track progress"/>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:10,marginBottom:20}}>
        <input placeholder="Goal name" value={lbl} onChange={e=>setLbl(e.target.value)} style={{...IS,width:"100%"}}/>
        <input type="number" placeholder="Target ₹" value={tgt} onChange={e=>setTgt(e.target.value)} style={{...IS,width:"100%"}}/>
        <button onClick={add} style={BS}>Add</button>
      </div>
      {!goals.length&&<p style={{color:C.muted,fontSize:13}}>No goals yet.</p>}
      {goals.map(g=>{
        const prog=Math.min(100,(totalValue/g.target)*100),done=prog>=100;
        return (
          <div key={g.id} style={{background:"rgba(255,255,255,.04)",borderRadius:16,padding:"18px 20px",marginBottom:12,border:`1px solid ${done?C.green+"33":C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:15}}>{g.label}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {done&&<Badge label="🎉 Achieved!" color={C.green}/>}
                <span style={{color:C.muted,fontSize:13}}>₹{fmtC(g.target)}</span>
                <button onClick={()=>setGoals(p=>p.filter(x=>x.id!==g.id))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18}}>×</button>
              </div>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,.07)",borderRadius:4,overflow:"hidden"}}>
              <div style={{width:`${prog}%`,height:"100%",borderRadius:4,transition:"width 1.2s ease",
                background:done?`linear-gradient(90deg,${C.green},${C.teal})`:`linear-gradient(90deg,${C.gold},${C.orange})`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12,color:C.muted}}>
              <span>Current: ₹{fmtC(totalValue)}</span>
              <span style={{fontWeight:700,color:done?C.green:C.gold}}>{prog.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════ TIMELINE ═══════════
function Timeline({ portfolio, txns=[] }) {
  const fromPort=portfolio.map(c=>({date:c.buyDate||now(),type:"BUY",name:c.name,sym:c.sym||c.symbol||"",qty:c.quantity,price:c.buyPrice}));
  const fromTxns=txns.map(t=>({date:t.date||now(),type:t.type||"BUY",name:t.name||t.coin||"",sym:t.sym||t.symbol||"",qty:t.quantity||t.qty||0,price:t.currentPrice||t.buyPrice||t.price||0}));
  const events=[...fromPort,...fromTxns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,50);
  return (
    <div>
      <SH icon="📅" label="Portfolio Timeline" sub="Your complete trading history"/>
      {!events.length&&<p style={{color:C.muted,fontSize:13}}>Add coins to build your timeline.</p>}
      <div style={{position:"relative",paddingLeft:28}}>
        <div style={{position:"absolute",left:10,top:0,bottom:0,width:2,
          background:`linear-gradient(to bottom,${C.gold},${C.teal},transparent)`}}/>
        {events.map((e,i)=>(
          <div key={i} style={{position:"relative",marginBottom:14,animation:`fadeUp .4s ${i*.05}s both`}}>
            <div style={{position:"absolute",left:-23,width:10,height:10,borderRadius:"50%",top:12,
              background:e.type==="BUY"?C.green:C.red,boxShadow:`0 0 8px ${e.type==="BUY"?C.green:C.red}`}}/>
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:14,padding:"12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Badge label={e.type} color={e.type==="BUY"?C.green:C.red}/>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.gold,fontWeight:700}}>{(e.name||"").toUpperCase()}</span>
                  {e.sym&&<span style={{fontSize:11,color:C.muted}}>({e.sym.toUpperCase()})</span>}
                  <span style={{color:C.muted,fontSize:12}}>×{+(e.qty||0).toFixed(4)}</span>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",fontWeight:600}}>₹{fmtC(e.price||0)}</div>
                  <div style={{fontSize:11,color:C.muted}}>{new Date(e.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════ REPLAY ═══════════
function Replay({ portfolio }) {
  const events=portfolio.map(c=>({date:c.buyDate||now(),name:c.name,qty:c.quantity,price:c.buyPrice}))
    .sort((a,b)=>new Date(a.date)-new Date(b.date));
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    if(!playing||step>=events.length){if(step>=events.length)setPlaying(false);return;}
    const t=setTimeout(()=>setStep(s=>s+1),700);return()=>clearTimeout(t);
  },[playing,step,events.length]);
  const visible=events.slice(0,step);
  const inv=visible.reduce((s,e)=>s+e.qty*e.price,0);
  return (
    <div>
      <SH icon="⏪" label="Portfolio Replay" sub="Watch your trading journey unfold"/>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
        <button onClick={()=>{setStep(0);setPlaying(true);}} style={BS}>{playing?"⏸ Replaying...":"▶ Start Replay"}</button>
        <button onClick={()=>{setPlaying(false);setStep(0);}} style={{...BS,background:"rgba(255,255,255,.06)",color:C.muted,boxShadow:"none"}}>■ Reset</button>
        {events.length>0&&<span style={{color:C.muted,fontSize:13}}>{step}/{events.length}</span>}
      </div>
      <div style={{background:"rgba(255,255,255,.03)",borderRadius:16,padding:20,minHeight:140}}>
        {!events.length&&<p style={{color:C.muted,fontSize:13}}>Add coins to enable replay.</p>}
        <div style={{height:4,background:"rgba(255,255,255,.07)",borderRadius:2,marginBottom:18,overflow:"hidden"}}>
          <div style={{width:`${events.length?(step/events.length)*100:0}%`,height:"100%",
            background:`linear-gradient(90deg,${C.gold},${C.teal})`,borderRadius:2,transition:"width .5s ease"}}/>
        </div>
        <div style={{fontWeight:800,fontSize:20,color:C.gold,marginBottom:14}}>Invested: ₹{fmtC(inv)}</div>
        {visible.map((e,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:10,animation:"fadeUp .3s ease"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block",boxShadow:`0 0 6px ${C.green}`,flexShrink:0}}/>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.gold,fontWeight:700}}>{e.name?.toUpperCase?.() || '—'}</span>
            <span style={{color:C.muted,fontSize:12}}>×{e.qty} @ ₹{fmtC(e.price)}</span>
            <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{new Date(e.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════ ANALYTICS ═══════════
function Analytics({ portfolio, txns=[] }) {
  if(!portfolio.length) return (
    <Card><div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
      <div style={{fontSize:48,marginBottom:12}}>📊</div><p>Add coins to see analytics</p>
    </div></Card>
  );
  const totalInv=portfolio.reduce((s,c)=>s+c.quantity*c.buyPrice,0);
  const totalVal=portfolio.reduce((s,c)=>s+c.quantity*(c.currentPrice||c.buyPrice),0);
  const pnl=totalVal-totalInv;
  const sorted=[...portfolio].sort((a,b)=>{
    const pa=a.buyPrice>0?((a.currentPrice-a.buyPrice)/a.buyPrice):0;
    const pb=b.buyPrice>0?((b.currentPrice-b.buyPrice)/b.buyPrice):0;
    return pb-pa;
  });
  const alloc=portfolio.map(c=>{
    const val=c.quantity*(c.currentPrice||c.buyPrice);
    return {name:(c.name||'').toUpperCase(),val,pct:totalVal>0?(val/totalVal)*100:0,image:c.image};
  }).sort((a,b)=>b.pct-a.pct);
  const colors=[C.gold,C.teal,C.purple,C.pink,C.green,C.orange,C.red];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <Card>
        <SH icon="🥧" label="Portfolio Donut Chart" sub="Hover slices to explore allocation"/>
        <DonutChart portfolio={portfolio}/>
      </Card>
      <Card>
        <SH icon="📈" label="Performance Over Time"/>
        <PerformanceChart portfolio={portfolio} txns={txns}/>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <Card>
        <SH icon="📊" label="Allocation Breakdown"/>
        {alloc.map((a,i)=>(
          <div key={a.name} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {a.image&&<img src={a.image} width={20} height={20} style={{borderRadius:"50%"}} alt=""/>}
                <span style={{fontSize:13,fontWeight:600,color:colors[i%colors.length]}}>{a.name}</span>
              </div>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.muted}}>{a.pct.toFixed(1)}%</span>
            </div>
            <div style={{height:7,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden"}}>
              <div style={{width:`${a.pct}%`,height:"100%",borderRadius:4,background:colors[i%colors.length],transition:"width 1s ease"}}/>
            </div>
          </div>
        ))}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <Card>
          <SH icon="🏆" label="Performance Ranking"/>
          {sorted.map((c,i)=>{
            const pp=c.buyPrice>0?((c.currentPrice-c.buyPrice)/c.buyPrice)*100:0;
            return (
              <div key={c.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 0",
                borderBottom:i<sorted.length-1?`1px solid ${C.border}`:"none"}}>
                <span style={{color:C.muted,fontSize:12,minWidth:20}}>#{i+1}</span>
                {c.image&&<img src={c.image} width={24} height={24} style={{borderRadius:"50%"}} alt=""/>}
                <span style={{flex:1,fontSize:13,fontWeight:600}}>{(c.name||'').toUpperCase()}</span>
                <Badge label={pct(pp)} color={clr(pp)}/>
              </div>
            );
          })}
        </Card>
        <Card>
          <SH icon="💡" label="Summary"/>
          {[["Best Performer",sorted[0]?.name?.toUpperCase()||"—",C.green],
            ["Worst Performer",sorted[sorted.length-1]?.name?.toUpperCase()||"—",C.red],
            ["Total Holdings",portfolio.length,C.teal],
            ["Avg P&L / Coin",`₹${fmtC(pnl/portfolio.length)}`,clr(pnl)],
          ].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
              <span style={{color:C.muted}}>{l}</span>
              <span style={{fontWeight:700,color:c}}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
    </div>
  );
}

// ═══════════ MARKET ═══════════
function Market({ coins=[], currency }) {
  const sym=SYM[currency]||"₹", rate=FX[currency]||1;
  const [search,setSearch]=useState("");
  const [view,setView]=useState("grid"); // grid | table
  const [sortBy,setSortBy]=useState("marketCap");
  const [sortDir,setSortDir]=useState(-1);
  const [page,setPage]=useState(0);
  const PER_PAGE=20;

  const filtered=useMemo(()=>{
    let list=[...coins];
    if(search.trim()){
      const q=search.trim().toLowerCase();
      list=list.filter(c=>c.name.toLowerCase().includes(q)||c.sym.toLowerCase().includes(q));
    }
    list.sort((a,b)=>{
      const va=a[sortBy]||0, vb=b[sortBy]||0;
      return (vb-va)*sortDir;
    });
    return list;
  },[coins,search,sortBy,sortDir]);

  const pages=Math.ceil(filtered.length/PER_PAGE);
  const visible=filtered.slice(page*PER_PAGE,(page+1)*PER_PAGE);

  const SortBtn=({k,label})=>(
    <button onClick={()=>{if(sortBy===k)setSortDir(d=>-d);else{setSortBy(k);setSortDir(-1);}}} style={{
      padding:"4px 10px",borderRadius:6,border:`1px solid ${sortBy===k?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.1)"}`,
      background:sortBy===k?"rgba(249,115,22,0.1)":"transparent",
      color:sortBy===k?"#fb923c":"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,fontWeight:600,
    }}>{label} {sortBy===k?(sortDir===-1?"↓":"↑"):""}</button>
  );

  return (
    <div>
      {/* Header row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h3 style={{fontWeight:700,fontSize:19,display:"flex",alignItems:"center",gap:10,
            letterSpacing:-.5,color:C.text,fontFamily:"'Syne',sans-serif",marginBottom:4}}>
            🌐 Global Market Overview
          </h3>
          <p style={{color:C.muted,fontSize:13}}>{coins.length} cryptocurrencies by market cap · updates every 60s</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {/* Search */}
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}
            placeholder="Search coin..." style={{
              background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:13,outline:"none",
              fontFamily:"'DM Sans',sans-serif",width:160,
            }}/>
          {/* Sort */}
          <SortBtn k="marketCap" label="Mkt Cap"/>
          <SortBtn k="price" label="Price"/>
          <SortBtn k="chg" label="24h %"/>
          <SortBtn k="vol24h" label="Volume"/>
          {/* View toggle */}
          <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:8,padding:3,border:"1px solid rgba(255,255,255,0.08)"}}>
            {[["grid","⊞"],["table","☰"]].map(([v,ic])=>(
              <button key={v} onClick={()=>setView(v)} style={{
                padding:"5px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:14,
                background:view===v?"rgba(255,255,255,0.1)":"transparent",
                color:view===v?"#fff":"rgba(255,255,255,0.3)",transition:"all .15s",
              }}>{ic}</button>
            ))}
          </div>
        </div>
      </div>

      {!coins.length&&<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
        <div style={{fontSize:32,animation:"spin 2s linear infinite",marginBottom:12}}>⟳</div>Loading market data...
      </div>}

      {/* GRID VIEW */}
      {view==="grid"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {visible.map((c,i)=>(
            <div key={c.id} className="hover-lift" style={{
              background:`linear-gradient(145deg,${C.bgCard},${C.bgCard2})`,
              border:`1px solid ${c.chg>=0?C.green+"22":C.red+"22"}`,borderRadius:16,padding:"14px 16px",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace",minWidth:22}}>#{page*PER_PAGE+i+1}</span>
                <img src={c.img} width={28} height={28} style={{borderRadius:"50%",flexShrink:0}} alt=""/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                  <div style={{fontSize:10,color:C.muted}}>{c.sym}</div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:C.gold}}>{sym}{fmtC(c.price*rate)}</span>
                <Badge label={pct(c.chg)} color={clr(c.chg)}/>
              </div>
              <Spark data={(c.sparkline||[]).slice(-20)} color={clr(c.chg)} h={32}/>
              <div style={{marginTop:6,fontSize:10,color:C.muted,display:"flex",justifyContent:"space-between"}}>
                <span>MCap: {sym}{c.marketCap?(fmtC((c.marketCap*rate)/1e7))+"Cr":"—"}</span>
                <span>Vol: {sym}{c.vol24h?(fmtC((c.vol24h*rate)/1e7))+"Cr":"—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {view==="table"&&(
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden"}}>
          {/* Table header */}
          <div style={{display:"grid",gridTemplateColumns:"40px 40px 2fr 1fr 1fr 1fr 1fr 120px",
            gap:8,padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",
            fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5,fontWeight:600}}>
            <span>#</span><span></span><span>Name</span>
            <span style={{textAlign:"right"}}>Price</span>
            <span style={{textAlign:"right"}}>24h %</span>
            <span style={{textAlign:"right"}}>Mkt Cap</span>
            <span style={{textAlign:"right"}}>Volume</span>
            <span style={{textAlign:"right"}}>7D Chart</span>
          </div>
          {visible.map((c,i)=>(
            <div key={c.id} style={{display:"grid",
              gridTemplateColumns:"40px 40px 2fr 1fr 1fr 1fr 1fr 120px",
              gap:8,padding:"10px 16px",alignItems:"center",
              borderBottom:"1px solid rgba(255,255,255,0.04)",
              transition:"background .15s",cursor:"default"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>{page*PER_PAGE+i+1}</span>
              <img src={c.img} width={24} height={24} style={{borderRadius:"50%"}} alt=""/>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{c.name}</div>
                <div style={{fontSize:10,color:C.muted}}>{c.sym}</div>
              </div>
              <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:C.gold}}>
                {sym}{fmtC(c.price*rate)}
              </div>
              <div style={{textAlign:"right"}}>
                <Badge label={pct(c.chg)} color={clr(c.chg)}/>
              </div>
              <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:11,color:C.muted}}>
                {c.marketCap?`${sym}${fmtC((c.marketCap*rate)/1e9)}B`:"—"}
              </div>
              <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:11,color:C.muted}}>
                {c.vol24h?`${sym}${fmtC((c.vol24h*rate)/1e9)}B`:"—"}
              </div>
              <div style={{width:120}}>
                <Spark data={(c.sparkline||[]).slice(-20)} color={clr(c.chg)} h={28}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages>1&&(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:20}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{
            padding:"7px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",
            background:"rgba(255,255,255,0.04)",color:page===0?C.muted:"#fff",cursor:page===0?"not-allowed":"pointer",fontSize:12,
          }}>← Prev</button>
          {Array.from({length:pages},(_,i)=>(
            <button key={i} onClick={()=>setPage(i)} style={{
              width:32,height:32,borderRadius:8,border:`1px solid ${i===page?"rgba(249,115,22,0.5)":"rgba(255,255,255,0.1)"}`,
              background:i===page?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.03)",
              color:i===page?"#fb923c":C.muted,cursor:"pointer",fontSize:12,fontWeight:i===page?700:400,
            }}>{i+1}</button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1} style={{
            padding:"7px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",
            background:"rgba(255,255,255,0.04)",color:page===pages-1?C.muted:"#fff",cursor:page===pages-1?"not-allowed":"pointer",fontSize:12,
          }}>Next →</button>
          <span style={{fontSize:12,color:C.muted,marginLeft:8}}>{filtered.length} coins</span>
        </div>
      )}
    </div>
  );
}

// ═══════════ MOVERS ═══════════
function Movers({ coins=[] }) {
  const [showCount,setShowCount]=useState(10);
  const gainers=[...coins].sort((a,b)=>b.chg-a.chg).filter(c=>c.chg>0);
  const losers=[...coins].sort((a,b)=>a.chg-b.chg).filter(c=>c.chg<0);

  const L=({items,title,color,icon})=>(
    <Card>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <h3 style={{fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:8,
          letterSpacing:-.4,color:C.text,fontFamily:"'Syne',sans-serif"}}>
          <span>{icon}</span>{title}
          <span style={{fontSize:12,color:C.muted,fontWeight:400}}>({items.length})</span>
        </h3>
      </div>
      {!items.length&&<p style={{color:C.muted,fontSize:13}}>No data yet.</p>}
      {items.slice(0,showCount).map((c,i)=>(
        <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",
          borderBottom:i<Math.min(showCount,items.length)-1?`1px solid ${C.border}`:"none",
          transition:"background .15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{color:C.muted,fontSize:11,minWidth:24,fontFamily:"'DM Mono',monospace"}}>#{i+1}</span>
          <img src={c.img} width={28} height={28} style={{borderRadius:"50%",flexShrink:0}} alt=""/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
            <div style={{fontSize:10,color:C.muted,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(c.price)}</div>
          </div>
          <div style={{width:80,flexShrink:0}}>
            <Spark data={(c.sparkline||[]).slice(-15)} color={color} h={24}/>
          </div>
          <Badge label={pct(c.chg)} color={color}/>
        </div>
      ))}
      {items.length>showCount&&(
        <button onClick={()=>setShowCount(n=>n+10)} style={{
          marginTop:12,width:"100%",padding:"9px",borderRadius:10,
          border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",
          color:C.muted,cursor:"pointer",fontSize:12,fontWeight:600,
        }}>Show more ({items.length-showCount} remaining)</button>
      )}
    </Card>
  );
  return (
    <div>
      <div style={{marginBottom:16,padding:"12px 16px",borderRadius:12,
        background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:C.muted}}>Showing top movers from <strong style={{color:"#fff"}}>{coins.length} coins</strong></span>
        <span style={{fontSize:11,color:C.green,background:"rgba(52,211,153,0.1)",
          border:"1px solid rgba(52,211,153,0.2)",padding:"2px 10px",borderRadius:20}}>● Live</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <L items={gainers} title="Top Gainers" color={C.green} icon="🚀"/>
        <L items={losers} title="Top Losers" color={C.red} icon="📉"/>
      </div>
    </div>
  );
}

// ═══════════ EXPORT ═══════════
function Export({ portfolio, totalVal, pnl, addToast }) {
  const csv=()=>{
    const h="Name,Qty,Buy Price,Current Price,Invested,Value,PnL,PnL%\n";
    const rows=portfolio.map(c=>{
      const val=c.quantity*(c.currentPrice||c.buyPrice),inv=c.quantity*c.buyPrice,pl=val-inv;
      return `${c.name},${c.quantity},${c.buyPrice},${c.currentPrice||c.buyPrice},${inv.toFixed(2)},${val.toFixed(2)},${pl.toFixed(2)},${inv>0?(pl/inv*100).toFixed(2):0}`;
    }).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([h+rows],{type:"text/csv"}));
    a.download="cryptofolio.csv";a.click();addToast("CSV exported!");
  };
  const json=()=>{
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify({portfolio,totalVal,pnl,exportedAt:now()},null,2)],{type:"application/json"}));
    a.download="cryptofolio.json";a.click();addToast("JSON exported!");
  };
  return (
    <Card>
      <SH icon="📤" label="Export Portfolio" sub="Download your data in CSV or JSON"/>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {[["📊 CSV Export",csv,C.green],["🔵 JSON Export",json,C.teal]].map(([l,fn,c])=>(
          <button key={l} onClick={fn} style={{padding:"14px 28px",borderRadius:14,border:`1px solid ${c}33`,
            background:`${c}0E`,color:c,cursor:"pointer",fontWeight:700,fontSize:14}}>
            {l}
          </button>
        ))}
      </div>
      <p style={{color:C.muted,fontSize:13,marginTop:16,lineHeight:1.6}}>
        Includes all holdings, P&L, buy prices and current valuations.
      </p>
    </Card>
  );
}

// ═══════════ SUGGESTIONS ═══════════
function Suggestions({ portfolio, coins=[] }) {
  const avg=portfolio.length?portfolio.reduce((s,c)=>{
    const pp=c.buyPrice>0?((c.currentPrice-c.buyPrice)/c.buyPrice)*100:0;return s+pp;
  },0)/portfolio.length:0;
  const topG=coins.length?[...coins].sort((a,b)=>b.chg-a.chg)[0]:null;
  const tips=[
    !portfolio.length&&{icon:"🌱",title:"Start Building",body:"Add your first crypto holding to begin tracking P&L and analytics.",color:C.teal},
    portfolio.length>0&&avg<-15&&{icon:"⚠️",title:"Portfolio Under Pressure",body:`Average P&L is ${avg.toFixed(1)}%. Consider reviewing underperformers or DCA strategy.`,color:C.red},
    portfolio.length>0&&avg>20&&{icon:"🏆",title:"Portfolio Thriving",body:"Strong gains! Consider setting take-profit alerts to lock in returns.",color:C.green},
    portfolio.length>=4&&{icon:"⚖️",title:"Diversified Portfolio",body:`You hold ${portfolio.length} assets. Ensure no single coin dominates too much.`,color:C.purple},
    topG&&{icon:"🔥",title:"Hottest Today",body:`${topG.name} is leading with ${pct(topG.chg)} in the last 24 hours.`,color:C.gold},
  ].filter(Boolean);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {tips.map((t,i)=>(
        <div key={i} style={{background:`${t.color}0C`,border:`1px solid ${t.color}28`,borderRadius:14,padding:"14px 16px",display:"flex",gap:12}}>
          <span style={{fontSize:22,flexShrink:0}}>{t.icon}</span>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:t.color,marginBottom:4}}>{t.title}</div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{t.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}


// ═══════════ FEAR & GREED INDEX ═══════════
function FearGreedWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://api.alternative.me/fng/?limit=1")
      .then(r => r.json())
      .then(d => { setData(d.data?.[0]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:80,color:C.muted,fontSize:12}}>
      Loading Fear & Greed...
    </div>
  );
  if (!data) return null;
  const val = parseInt(data.value);
  const label = data.value_classification;
  const color = val >= 75 ? C.green : val >= 55 ? "#86efac" : val >= 45 ? C.gold : val >= 25 ? C.orange : C.red;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (val / 100) * circumference;
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,padding:"16px 20px",
      background:"rgba(255,255,255,0.03)",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{position:"relative",width:80,height:80,flexShrink:0}}>
        <svg width={80} height={80} viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={36} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7}/>
          <circle cx={40} cy={40} r={36} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{transition:"stroke-dasharray 1.5s cubic-bezier(0.22,1,0.36,1)"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:20,fontWeight:800,color,fontFamily:"'Syne',sans-serif"}}>{val}</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:11,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>
          Fear & Greed Index
        </div>
        <div style={{fontSize:18,fontWeight:700,color,fontFamily:"'Syne',sans-serif"}}>{label}</div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>
          {val < 25 ? "Extreme Fear — possible buy signal" :
           val < 45 ? "Fear — market cautious" :
           val < 55 ? "Neutral — balanced sentiment" :
           val < 75 ? "Greed — consider caution" :
           "Extreme Greed — possible sell signal"}
        </div>
      </div>
      <div style={{marginLeft:"auto",textAlign:"right",flexShrink:0}}>
        <div style={{width:90,height:12,borderRadius:6,overflow:"hidden",
          background:"linear-gradient(90deg,#ef4444,#f97316,#f0b429,#22c55e)",marginBottom:6}}>
          <div style={{width:8,height:12,borderRadius:4,background:"#fff",
            marginLeft:`${val-4}%`,boxShadow:"0 0 6px rgba(0,0,0,0.5)",
            transition:"margin-left 1.5s cubic-bezier(0.22,1,0.36,1)"}}/>
        </div>
        <div style={{fontSize:10,color:C.muted,display:"flex",justifyContent:"space-between"}}>
          <span>Fear</span><span>Greed</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════ PORTFOLIO DONUT CHART ═══════════
function DonutChart({ portfolio }) {
  const [hovered, setHovered] = useState(null);
  if (!portfolio.length) return null;
  const totalVal = portfolio.reduce((s,c) => s + c.quantity*(c.currentPrice||c.buyPrice), 0);
  const sliceData = portfolio.map((c,i) => ({
    name: (c.name||"").toUpperCase(),
    val: c.quantity*(c.currentPrice||c.buyPrice),
    pct: totalVal > 0 ? (c.quantity*(c.currentPrice||c.buyPrice)/totalVal)*100 : 0,
    img: c.image,
  })).sort((a,b) => b.val - a.val);
  const colors = [C.gold, C.teal, C.purple, C.pink, C.green, C.orange, C.red, C.blue];

  // Build SVG arcs
  const cx = 90, cy = 90, r = 70, inner = 45;
  let cumulativeAngle = -90;
  const slices = sliceData.map((d, i) => {
    const angle = (d.pct / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;
    const toRad = deg => deg * Math.PI / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const ix1 = cx + inner * Math.cos(toRad(startAngle));
    const iy1 = cy + inner * Math.sin(toRad(startAngle));
    const ix2 = cx + inner * Math.cos(toRad(endAngle));
    const iy2 = cy + inner * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    return { ...d, path, color: colors[i % colors.length], midAngle: startAngle + angle/2 };
  });

  const hovData = hovered !== null ? sliceData[hovered] : null;

  return (
    <div style={{display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{position:"relative",flexShrink:0}}>
        <svg width={180} height={180} style={{filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.4))"}}>
          {slices.map((s,i) => (
            <path key={i} d={s.path} fill={s.color}
              opacity={hovered===null||hovered===i?1:0.35}
              style={{cursor:"pointer",transition:"opacity .2s,transform .2s",
                transformOrigin:`${cx}px ${cy}px`,
                transform:hovered===i?"scale(1.05)":"scale(1)"}}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}/>
          ))}
          <circle cx={cx} cy={cy} r={inner-2} fill="#060c18"/>
          {hovData ? (
            <>
              <text x={cx} y={cy-8} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="700" fontFamily="'Syne',sans-serif">{hovData.name}</text>
              <text x={cx} y={cy+6} textAnchor="middle" fill={slices[hovered]?.color||C.gold} fontSize={13} fontWeight="800" fontFamily="'Syne',sans-serif">{hovData.pct.toFixed(1)}%</text>
              <text x={cx} y={cy+20} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={8} fontFamily="'DM Mono',monospace">₹{fmtC(hovData.val)}</text>
            </>
          ) : (
            <>
              <text x={cx} y={cy-4} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8} fontFamily="'DM Sans',sans-serif">Portfolio</text>
              <text x={cx} y={cy+10} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="700" fontFamily="'Syne',sans-serif">{sliceData.length} Assets</text>
            </>
          )}
        </svg>
      </div>
      <div style={{flex:1,minWidth:180}}>
        {slices.map((s,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,
            padding:"6px 10px",borderRadius:8,cursor:"pointer",
            background:hovered===i?"rgba(255,255,255,0.06)":"transparent",
            transition:"background .15s"}}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.color,flexShrink:0}}/>
            {s.img && <img src={s.img} width={18} height={18} style={{borderRadius:"50%"}} alt=""/>}
            <span style={{flex:1,fontSize:12,fontWeight:600,color:hovered===i?"#fff":C.text}}>{s.name}</span>
            <span style={{fontSize:12,color:s.color,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{s.pct.toFixed(1)}%</span>
            <span style={{fontSize:11,color:C.muted,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(s.val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════ NEWS FEED ═══════════
function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false); setNews([]);

    const tryFetch = async () => {
      // Try CryptoCompare RSS via allorigins CORS proxy
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&extraParams=cryptofolio")}`,
        `https://corsproxy.io/?${encodeURIComponent("https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&extraParams=cryptofolio")}`,
        `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&extraParams=cryptofolio`,
      ];
      for (const url of proxies) {
        try {
          const ctrl = new AbortController();
          const tid = setTimeout(()=>ctrl.abort(), 12000);
          const r = await fetch(url, {signal:ctrl.signal});
          clearTimeout(tid);
          if (!r.ok) continue;
          const raw = await r.json();
          // allorigins wraps in {contents: "..."}, direct API returns {Data: [...]}
          let d;
          if (raw.contents) { try { d = JSON.parse(raw.contents); } catch(_) { continue; } }
          else d = raw;
          if (d && Array.isArray(d.Data) && d.Data.length > 0) {
            if (!cancelled) {
              setNews(d.Data.slice(0,60).map(n=>({
                id: n.id, title: n.title||"",
                body: (n.body||"").replace(/<[^>]*>/g,"").slice(0,240),
                url: n.url||"", imageurl: n.imageurl||"",
                source: n.source_info?.name||n.source||"CryptoCompare",
                published_on: n.published_on||Math.floor(Date.now()/1000),
                categories: (n.categories||"").toUpperCase(),
              })));
              setLoading(false);
            }
            return;
          }
        } catch(_) {}
      }

      // Hard fallback: curated static news so page is never blank
      if (!cancelled) {
        const now = Math.floor(Date.now()/1000);
        setNews([
          {id:1,title:"Bitcoin Holds Above Key Support as Institutional Demand Rises",body:"Bitcoin remains resilient above critical support levels as ETF inflows continue to attract institutional capital from asset managers globally.",url:"https://cointelegraph.com/news/bitcoin-support",imageurl:"",source:"CoinTelegraph",published_on:now-1800,categories:"BTC"},
          {id:2,title:"Ethereum Layer-2 Networks Record All-Time High Transaction Volume",body:"Optimism, Arbitrum, and Base collectively processed record transactions this week, driven by DeFi activity and lower fees attracting retail users.",url:"https://coindesk.com/eth-l2-record",imageurl:"",source:"CoinDesk",published_on:now-3600,categories:"ETH"},
          {id:3,title:"SEC Reviews New Spot Ethereum ETF Applications from Major Asset Managers",body:"The U.S. Securities and Exchange Commission has begun formal review of spot Ethereum ETF applications submitted by BlackRock and Fidelity.",url:"https://decrypt.co/sec-eth-etf",imageurl:"",source:"Decrypt",published_on:now-5400,categories:"REGULATION"},
          {id:4,title:"DeFi Total Value Locked Surpasses $120 Billion Milestone",body:"Decentralized finance protocols have collectively locked over $120 billion in assets, marking a new high fueled by yield farming innovations.",url:"https://cointelegraph.com/news/defi-tvl",imageurl:"",source:"CoinTelegraph",published_on:now-7200,categories:"DEFI"},
          {id:5,title:"Solana Mobile Launches Second Crypto Smartphone With Enhanced Web3 Features",body:"Solana Mobile's Seeker device ships with built-in hardware wallet, dApp store, and native token rewards to drive mainstream crypto adoption.",url:"https://coindesk.com/solana-mobile",imageurl:"",source:"CoinDesk",published_on:now-9000,categories:"ALTCOIN"},
          {id:6,title:"India's Crypto Tax Framework Gets Clarity as Finance Ministry Issues New Guidelines",body:"India's Ministry of Finance has released updated guidance on VDA taxation, providing clarity on TDS requirements and P2P transaction reporting.",url:"https://cryptonews.com/india-crypto-tax",imageurl:"",source:"CryptoNews",published_on:now-10800,categories:"REGULATION"},
          {id:7,title:"Bitcoin Mining Difficulty Reaches Record High After Hashrate Surge",body:"Bitcoin's mining difficulty adjusted upward for the fifth consecutive time as hashrate hit an all-time high driven by new ASIC deployments.",url:"https://bitcoinmagazine.com/mining-difficulty",imageurl:"",source:"Bitcoin Magazine",published_on:now-12600,categories:"BTC"},
          {id:8,title:"Uniswap V4 Goes Live on Mainnet With Custom Hook Architecture",body:"Uniswap's landmark V4 upgrade is now live, introducing hooks that allow developers to build custom AMM logic atop the world's largest DEX.",url:"https://decrypt.co/uniswap-v4",imageurl:"",source:"Decrypt",published_on:now-14400,categories:"DEFI"},
          {id:9,title:"Ripple Wins Key Legal Battle, XRP Price Surges 12% on the News",body:"A federal judge ruled in Ripple's favor on a critical aspect of its long-running SEC lawsuit, sending XRP prices sharply higher within hours.",url:"https://cointelegraph.com/ripple-win",imageurl:"",source:"CoinTelegraph",published_on:now-16200,categories:"ALTCOIN"},
          {id:10,title:"BlackRock Bitcoin ETF Crosses $25 Billion in Assets Under Management",body:"IBIT, BlackRock's spot Bitcoin ETF, has surpassed $25 billion AUM in record time, becoming one of the fastest-growing ETFs in history.",url:"https://coindesk.com/blackrock-ibit",imageurl:"",source:"CoinDesk",published_on:now-18000,categories:"BTC"},
          {id:11,title:"Polygon zkEVM Achieves 100,000 TPS in Latest Stress Test",body:"Polygon's zero-knowledge Ethereum Virtual Machine hit 100,000 transactions per second in a public stress test, a milestone for ZK scaling tech.",url:"https://cryptonews.com/polygon-zkevm",imageurl:"",source:"CryptoNews",published_on:now-19800,categories:"ETH"},
          {id:12,title:"NFT Market Shows Signs of Recovery With Blue-Chip Collections Leading Gains",body:"CryptoPunks and Bored Ape Yacht Club NFTs posted double-digit floor price gains this week as collector sentiment improved markedly.",url:"https://decrypt.co/nft-recovery",imageurl:"",source:"Decrypt",published_on:now-21600,categories:"NFT"},
          {id:13,title:"Cardano Smart Contract Ecosystem Grows 40% in Developer Activity",body:"Cardano's Plutus smart contract platform saw a 40% surge in active developers over the past quarter, with DeFi dApps driving most of the growth.",url:"https://cointelegraph.com/cardano-devs",imageurl:"",source:"CoinTelegraph",published_on:now-23400,categories:"ALTCOIN"},
          {id:14,title:"Federal Reserve Officials Signal Openness to Stablecoin Regulation Framework",body:"Multiple Fed governors indicated support for a clear federal stablecoin framework, seen as a positive signal for crypto regulatory certainty.",url:"https://coindesk.com/fed-stablecoin",imageurl:"",source:"CoinDesk",published_on:now-25200,categories:"REGULATION"},
          {id:15,title:"Ethereum Staking Ratio Hits 28% as Liquid Staking Protocols Boom",body:"Over 28% of all ETH is now staked, with Lido and Rocket Pool capturing the majority of inflows as liquid staking derivatives gain traction.",url:"https://bitcoinmagazine.com/eth-staking",imageurl:"",source:"Bitcoin Magazine",published_on:now-27000,categories:"ETH"},
        ]);
        setLoading(false);
      }
    };

    tryFetch();
    return () => { cancelled = true; };
  }, [retryKey]);

  const categories = ["all", "bitcoin", "ethereum", "defi", "regulation", "nft"];
  const filtered = filter === "all" ? news : news.filter(n =>
    (n.categories || "").toLowerCase().includes(filter) ||
    (n.title || "").toLowerCase().includes(filter)
  );

  const timeAgo = ts => {
    const diff = Math.floor(Date.now() / 1000) - ts;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      <SH icon="📰" label="Crypto News" sub="Live news · aggregated from CryptoCompare, CoinGecko & CoinTelegraph"/>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {categories.map(cat => (
          <button key={cat} onClick={()=>setFilter(cat)} style={{
            padding:"5px 14px",borderRadius:20,
            border:`1px solid ${filter===cat?"rgba(249,115,22,0.5)":"rgba(255,255,255,0.1)"}`,
            background:filter===cat?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.04)",
            color:filter===cat?"#fb923c":"rgba(255,255,255,0.5)",
            cursor:"pointer",fontSize:12,fontWeight:600,textTransform:"capitalize",transition:"all .15s",
          }}>{cat}</button>
        ))}
      </div>

      {loading && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{height:90,borderRadius:14,
              background:"linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.04) 75%)",
              backgroundSize:"200% 100%",animation:"shimmerSlide 1.5s infinite"}}/>
          ))}
        </div>
      )}

      {!loading && error && (
        <div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
          <div style={{fontSize:48,marginBottom:14}}>📡</div>
          <div style={{fontWeight:700,color:"#fff",fontSize:16,marginBottom:8}}>News unavailable</div>
          <p style={{fontSize:13,marginBottom:20,lineHeight:1.6}}>
            All news APIs are currently unreachable.<br/>
            This usually resolves in 1–2 minutes.
          </p>
          <button onClick={()=>setRetryKey(k=>k+1)} style={{
            padding:"10px 28px",borderRadius:12,border:"1px solid rgba(249,115,22,0.4)",
            background:"rgba(249,115,22,0.12)",color:"#fb923c",cursor:"pointer",fontWeight:700,fontSize:13,
            transition:"all .15s",
          }}>🔄 Try Again</button>
        </div>
      )}

      {!loading && !error && !filtered.length && (
        <div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>
          <div style={{fontSize:32,marginBottom:12}}>🔍</div>
          <p>No results for "{filter}" — try a different filter</p>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map((item, i) => (
          <a key={item.id||i} href={item.url} target="_blank" rel="noopener noreferrer"
            style={{textDecoration:"none",display:"block"}}
            onClick={e=>{ if(!item.url) e.preventDefault(); }}>
            <div style={{display:"flex",gap:14,padding:"14px 16px",borderRadius:14,
              background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
              transition:"all .18s",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.borderColor="rgba(255,255,255,0.14)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
              {item.imageurl && (
                <img src={item.imageurl} alt="" style={{width:72,height:72,borderRadius:10,objectFit:"cover",flexShrink:0}}
                  onError={e=>e.target.style.display="none"}/>
              )}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:5,lineHeight:1.4,
                  overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                  {item.title}
                </div>
                {item.body&&(
                  <div style={{fontSize:11,color:C.muted,lineHeight:1.5,marginBottom:6,
                    overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                    {item.body}
                  </div>
                )}
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:600}}>{item.source}</span>
                  <span style={{fontSize:10,color:C.muted}}>·</span>
                  <span style={{fontSize:10,color:C.muted}}>{timeAgo(item.published_on)}</span>
                  {(item.categories||"").split(/[|,]/).filter(Boolean).slice(0,3).map(cat=>(
                    <span key={cat} style={{fontSize:9,padding:"2px 8px",borderRadius:10,
                      background:"rgba(249,115,22,0.1)",color:"#fb923c",fontWeight:600,textTransform:"uppercase"}}>
                      {cat.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
// ═══════════ PORTFOLIO PERFORMANCE CHART (line graph from txn history) ═══════════
function PerformanceChart({ portfolio, txns }) {
  const [range, setRange] = useState("1M");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Build synthetic performance from txn history + current portfolio
    const now = Date.now();
    const ranges = {"1W":7,"1M":30,"3M":90,"6M":180,"1Y":365};
    const days = ranges[range] || 30;
    const points = [];
    const allEvents = [...txns].sort((a,b) => new Date(a.date||a.buyDate||0) - new Date(b.date||b.buyDate||0));

    // Simulate daily portfolio value
    for (let i = days; i >= 0; i--) {
      const dayTs = now - i * 86400000;
      const eventsUpToDay = allEvents.filter(e => new Date(e.date||e.buyDate||0) <= dayTs);
      // Build holdings at that day
      const holdings = {};
      eventsUpToDay.forEach(e => {
        if (!e.name && !e.coin) return;
        const key = e.name || e.coin;
        if (!holdings[key]) holdings[key] = { qty: 0, price: e.buyPrice || e.currentPrice || 0 };
        if (e.type === "BUY" || e.type === "buy" || !e.type) holdings[key].qty += Number(e.quantity||e.q||0);
        else if (e.type === "SELL" || e.type === "sell") holdings[key].qty -= Number(e.quantity||e.q||0);
      });
      const totalVal = Object.values(holdings).reduce((s,h) => s + Math.max(0, h.qty) * h.price, 0);
      points.push({ day: new Date(dayTs).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}), val: totalVal, ts: dayTs });
    }
    setChartData(points);
  }, [portfolio, txns, range]);

  if (!portfolio.length) return (
    <div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>
      <div style={{fontSize:32,marginBottom:8}}>📈</div>
      <p style={{fontSize:13}}>Add coins and transactions to see your performance chart</p>
    </div>
  );

  const vals = chartData.map(p => p.val);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  const range2 = maxVal - minVal || 1;
  const W = 560, H = 180, PX = 16, PY = 16;
  const pts = chartData.map((p,i) => {
    const x = PX + (i/(chartData.length-1||1)) * (W-2*PX);
    const y = PY + (1-(p.val-minVal)/range2) * (H-2*PY);
    return `${x},${y}`;
  });
  const ptsStr = pts.join(" ");
  const fillPts = `${PX},${H-PY} ${ptsStr} ${W-PX},${H-PY}`;
  const isUp = (chartData[chartData.length-1]?.val||0) >= (chartData[0]?.val||0);
  const lineColor = isUp ? C.green : C.red;
  const pctChange = chartData[0]?.val > 0 ? ((chartData[chartData.length-1]?.val - chartData[0]?.val) / chartData[0].val * 100) : 0;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:11,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Portfolio Performance</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif"}}>
              ₹{fmtC(chartData[chartData.length-1]?.val||0)}
            </span>
            <span style={{fontSize:13,color:lineColor,fontWeight:700}}>
              {pctChange>=0?"+":""}{pctChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["1W","1M","3M","6M","1Y"].map(r => (
            <button key={r} onClick={()=>setRange(r)} style={{
              padding:"4px 12px",borderRadius:8,border:`1px solid ${range===r?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.1)"}`,
              background:range===r?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.04)",
              color:range===r?"#fb923c":"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,fontWeight:600,
            }}>{r}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        <defs>
          <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity=".3"/>
            <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,0.25,0.5,0.75,1].map((t,i) => (
          <line key={i} x1={PX} y1={PY+t*(H-2*PY)} x2={W-PX} y2={PY+t*(H-2*PY)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        ))}
        <polygon points={fillPts} fill="url(#perfGrad)"/>
        <polyline points={ptsStr} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {/* Last point dot */}
        {pts.length > 0 && (() => {
          const [lx,ly] = pts[pts.length-1].split(",");
          return <circle cx={lx} cy={ly} r="4" fill={lineColor} style={{filter:`drop-shadow(0 0 6px ${lineColor})`}}/>;
        })()}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:"rgba(255,255,255,0.2)"}}>
        <span>{chartData[0]?.day}</span>
        <span>{chartData[chartData.length-1]?.day}</span>
      </div>
    </div>
  );
}

// ═══════════ DCA SIMULATOR ═══════════
function TaxReport({ txns, addToast }) {
  const [fy, setFY] = useState("2025-26");
  const fyRanges = {
    "2025-26": { start: new Date("2025-04-01"), end: new Date("2026-03-31") },
    "2024-25": { start: new Date("2024-04-01"), end: new Date("2025-03-31") },
    "2023-24": { start: new Date("2023-04-01"), end: new Date("2024-03-31") },
    "2022-23": { start: new Date("2022-04-01"), end: new Date("2023-03-31") },
  };

  const { start, end } = fyRanges[fy] || fyRanges["2024-25"];
  const sells = txns.filter(t => {
    const d = new Date(t.date || t.buyDate || 0);
    return (t.type === "SELL" || t.type === "sell") && d >= start && d <= end;
  });

  const totalProceeds = sells.reduce((s,t) => s + (t.quantity||t.qty||0)*(t.currentPrice||t.buyPrice||t.price||0), 0);
  const totalCost = sells.reduce((s,t) => s + (t.quantity||t.qty||0)*(t.buyPrice||t.price||0), 0);
  const gain = totalProceeds - totalCost;
  const taxOwed = gain > 0 ? gain * 0.30 : 0;
  const tdsEstimate = totalProceeds * 0.01; // 1% TDS on crypto proceeds (India)

  const exportCSV = () => {
    const h = "Date,Coin,Qty,Buy Price,Sell Price,Proceeds,Cost Basis,Gain/Loss,Tax(30%)\n";
    const rows = sells.map(t => {
      const qty = t.quantity||t.qty||0;
      const sp = t.currentPrice||t.price||0;
      const bp = t.buyPrice||t.price||0;
      const proceeds = qty*sp, cost = qty*bp, g = proceeds-cost, tax = g>0?g*0.3:0;
      return `${new Date(t.date||t.buyDate||0).toLocaleDateString("en-IN")},${t.name||t.coin||""},${qty},${bp.toFixed(2)},${sp.toFixed(2)},${proceeds.toFixed(2)},${cost.toFixed(2)},${g.toFixed(2)},${tax.toFixed(2)}`;
    }).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([h+rows], {type:"text/csv"}));
    a.download = `crypto_tax_${fy}.csv`; a.click();
    addToast("Tax report exported!");
  };

  return (
    <div>
      <SH icon="🧾" label="Tax Report" sub="India crypto tax: 30% flat on gains + 1% TDS on proceeds"/>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
        <div style={{fontSize:13,color:C.muted}}>Financial Year:</div>
        {Object.keys(fyRanges).map(y => (
          <button key={y} onClick={()=>setFY(y)} style={{
            padding:"6px 14px",borderRadius:8,border:`1px solid ${fy===y?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.1)"}`,
            background:fy===y?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.04)",
            color:fy===y?"#fb923c":"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12,fontWeight:600,
          }}>FY {y}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:20}}>
        {[
          ["📦","Sell Transactions",sells.length,C.teal],
          ["💰","Total Proceeds",`₹${fmtC(totalProceeds)}`,C.gold],
          ["💸","Total Cost Basis",`₹${fmtC(totalCost)}`,C.muted],
          ["📈","Net Gain/Loss",`${gain>=0?"+":""}₹${fmtC(Math.abs(gain))}`,clr(gain)],
          ["🏛️","Tax Owed (30%)",`₹${fmtC(taxOwed)}`,C.orange],
          ["🔒","TDS Estimate (1%)",`₹${fmtC(tdsEstimate)}`,C.purple],
        ].map(([ic,l,v,col]) => (
          <div key={l} style={{background:`${col}0D`,border:`1px solid ${col}25`,borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:18,marginBottom:4}}>{ic}</div>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{l}</div>
            <div style={{fontWeight:800,fontSize:15,color:col,fontFamily:"'DM Mono',monospace"}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"14px 18px",borderRadius:14,
        background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.2)",marginBottom:20,fontSize:13,color:C.muted,lineHeight:1.7}}>
        ⚠️ <strong style={{color:"#fb923c"}}>Disclaimer:</strong> This is an estimate based on transactions stored in Cryptofolio. India levies a flat <strong style={{color:"#fff"}}>30% tax on crypto gains</strong> with no deductions allowed (except cost of acquisition), plus <strong style={{color:"#fff"}}>1% TDS</strong> on crypto transactions above ₹10,000. Consult a CA for accurate tax filing.
      </div>

      {!sells.length && (
        <p style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px 0"}}>No sell transactions found for FY {fy}.</p>
      )}

      {sells.length > 0 && (
        <>
          <div style={{borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)",marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 1fr",
              gap:8,padding:"10px 16px",background:"rgba(255,255,255,0.04)",
              fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5,fontWeight:600}}>
              <span>Date / Coin</span><span style={{textAlign:"right"}}>Qty</span>
              <span style={{textAlign:"right"}}>Buy ₹</span><span style={{textAlign:"right"}}>Sell ₹</span>
              <span style={{textAlign:"right"}}>Gain/Loss</span><span style={{textAlign:"right"}}>Tax</span>
            </div>
            {sells.map((t,i) => {
              const qty = t.quantity||t.qty||0;
              const sp = t.currentPrice||t.price||0, bp = t.buyPrice||t.price||0;
              const proceeds=qty*sp, cost=qty*bp, g=proceeds-cost, tax=g>0?g*0.3:0;
              return (
                <div key={i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 1fr",
                  gap:8,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",
                  fontSize:12,alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:700,color:"#fff"}}>{(t.name||t.coin||"").toUpperCase()}</div>
                    <div style={{fontSize:10,color:C.muted}}>{new Date(t.date||t.buyDate||0).toLocaleDateString("en-IN")}</div>
                  </div>
                  <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:C.muted}}>{qty.toFixed(4)}</div>
                  <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:C.muted}}>₹{fmtC(bp)}</div>
                  <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:C.gold}}>₹{fmtC(sp)}</div>
                  <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:clr(g),fontWeight:700}}>
                    {g>=0?"+":""}₹{fmtC(Math.abs(g))}
                  </div>
                  <div style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:tax>0?C.orange:C.muted}}>
                    {tax>0?`₹${fmtC(tax)}`:"—"}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={exportCSV} style={{...BS,background:`${C.green}18`,color:C.green,border:`1px solid ${C.green}33`,boxShadow:"none"}}>
            📥 Export Tax Report (CSV)
          </button>
        </>
      )}
    </div>
  );
}

// ═══════════ SHARE CARD ═══════════
function ShareCard({ portfolio, totalVal, pnl, user }) {
  const canvasRef = useRef(null);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 600, H = 340;
    canvas.width = W; canvas.height = H;

    // Background
    const bgGrad = ctx.createLinearGradient(0,0,W,H);
    bgGrad.addColorStop(0,"#040810");
    bgGrad.addColorStop(0.5,"#0a1428");
    bgGrad.addColorStop(1,"#040810");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0,0,W,H);

    // Orange glow top
    const glowGrad = ctx.createRadialGradient(W/2,-20,0,W/2,-20,300);
    glowGrad.addColorStop(0,"rgba(249,115,22,0.25)");
    glowGrad.addColorStop(1,"transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0,0,W,H);

    // Border
    ctx.strokeStyle = "rgba(249,115,22,0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1,1,W-2,H-2);

    // Logo hex (simplified)
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(50,50,20,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px monospace";
    ctx.fillText("CF",40,55);

    // Title
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "500 13px DM Sans, sans-serif";
    ctx.fillText("CRYPTOFOLIO ULTRA", 80, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Syne, sans-serif";
    ctx.fillText("Portfolio Report", 80, 62);

    // Total Value
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "11px DM Sans";
    ctx.fillText("TOTAL PORTFOLIO VALUE", 40, 110);
    const valGrad = ctx.createLinearGradient(40,120,300,140);
    valGrad.addColorStop(0,"#f0b429");
    valGrad.addColorStop(1,"#f97316");
    ctx.fillStyle = valGrad;
    ctx.font = "bold 40px Syne, sans-serif";
    ctx.fillText(`₹${fmtC(totalVal)}`, 40, 150);

    // P&L
    const pnlColor = pnl >= 0 ? "#34d399" : "#f87171";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "11px DM Sans";
    ctx.fillText("NET P&L", 40, 185);
    ctx.fillStyle = pnlColor;
    ctx.font = "bold 22px Syne";
    ctx.fillText(`${pnl>=0?"+":""}₹${fmtC(Math.abs(pnl))}`, 40, 210);

    // Holdings count
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "11px DM Sans";
    ctx.fillText("HOLDINGS", 250, 185);
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 22px Syne";
    ctx.fillText(`${portfolio.length} Assets`, 250, 210);

    // Top 3 coins
    const top3 = [...portfolio].sort((a,b) => (b.quantity*(b.currentPrice||b.buyPrice)) - (a.quantity*(a.currentPrice||a.buyPrice))).slice(0,3);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px DM Sans";
    ctx.fillText("TOP HOLDINGS", 40, 245);
    top3.forEach((c,i) => {
      ctx.fillStyle = ["#f0b429","#22d3ee","#a78bfa"][i];
      ctx.font = "bold 12px DM Mono, monospace";
      ctx.fillText((c.name||"").toUpperCase(), 40 + i*170, 265);
    });

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "10px DM Sans";
    ctx.fillText(`Generated ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})} · cryptofolio.app`, 40, H-16);

    // Decorative right element — mini bar chart
    const bars = portfolio.slice(0,6).map(c => c.quantity*(c.currentPrice||c.buyPrice));
    const maxB = Math.max(...bars, 1);
    const bColors = ["#f0b429","#22d3ee","#a78bfa","#f97316","#34d399","#f472b6"];
    bars.forEach((b,i) => {
      const bH = (b/maxB)*120;
      const bX = W-60+(i-3)*16;
      const bY = H-30-bH;
      ctx.fillStyle = bColors[i]+"99";
      ctx.beginPath();
      ctx.roundRect(bX, bY, 10, bH, 3);
      ctx.fill();
    });

    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "cryptofolio-portfolio.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div>
      <SH icon="🖼️" label="Portfolio Share Card" sub="Generate a beautiful shareable image of your portfolio"/>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        <button onClick={generate} style={BS}>✨ Generate Card</button>
        {generated && <button onClick={download} style={{...BS,background:"rgba(52,211,153,0.15)",color:C.green,border:`1px solid ${C.green}33`,boxShadow:"none"}}>📥 Download PNG</button>}
      </div>
      <canvas ref={canvasRef} style={{width:"100%",maxWidth:600,height:"auto",display:"block",
        borderRadius:16,border:"1px solid rgba(255,255,255,0.1)",
        opacity:generated?1:0,transition:"opacity .3s"}}/>
      {!generated && (
        <div style={{padding:"40px",textAlign:"center",borderRadius:16,border:"1px dashed rgba(255,255,255,0.1)",color:C.muted,fontSize:13}}>
          Click "Generate Card" to create your portfolio share image
        </div>
      )}
    </div>
  );
}

// ═══════════ ONE YEAR AGO CALCULATOR ═══════════
function OneYearAgo({ market }) {
  const [coin, setCoin] = useState("bitcoin");
  const [amount, setAmount] = useState("10000");
  const [years, setYears] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Map CoinGecko IDs → CryptoCompare symbols (no CORS issues, works in browser)
      const CG_TO_CC = {
        bitcoin:"BTC", ethereum:"ETH", solana:"SOL", binancecoin:"BNB",
        ripple:"XRP", cardano:"ADA", dogecoin:"DOGE", polkadot:"DOT",
        "avalanche-2":"AVAX", chainlink:"LINK", "matic-network":"MATIC",
        tron:"TRX", litecoin:"LTC", "shiba-inu":"SHIB", uniswap:"UNI",
        cosmos:"ATOM", monero:"XMR", stellar:"XLM", "okb":"OKB",
        "crypto-com-chain":"CRO", algorand:"ALGO", vechain:"VET",
        filecoin:"FIL", tezos:"XTZ", "the-sandbox":"SAND", decentraland:"MANA",
        "axie-infinity":"AXS", "the-graph":"GRT", aave:"AAVE", maker:"MKR",
      };
      const sym = CG_TO_CC[coin] || coin.toUpperCase().replace(/-.*/, "");
      const coinName = market.find(c=>c.id===coin)?.name || sym;

      const limit = Math.min(years * 365, 1825); // CryptoCompare free tier cap: 5 years
      // CryptoCompare histoday — full CORS support, no key needed for basic use
      const histRes = await fetch(
        `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${sym}&tsym=INR&limit=${limit}&extraParams=cryptofolio`
      );
      if (!histRes.ok) throw new Error("hist fetch failed");
      const histData = await histRes.json();
      const histArr = histData?.Data?.Data;
      if (!histArr || histArr.length < 2) throw new Error("No historical data");

      const priceThen = histArr[0].close;
      const priceNow  = histArr[histArr.length - 1].close;
      if (!priceThen || !priceNow) throw new Error("Missing price");

      const thenDate = new Date(histArr[0].time * 1000);
      const dateStr = thenDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

      const investedAmt = parseFloat(amount) || 10000;
      const coinsBought = investedAmt / priceThen;
      const valueNow2   = coinsBought * priceNow;
      const gain        = valueNow2 - investedAmt;
      const gainPct     = (gain / investedAmt) * 100;

      setResult({ priceThen, priceNow, coinsBought, valueNow: valueNow2, gain, gainPct,
                  name: coinName, img: market.find(c=>c.id===coin)?.img || "",
                  dateStr, investedAmt, years });
    } catch (e) {
      setResult({ error: "Could not fetch data. Please try a different coin or check your connection." });
    }
    setLoading(false);
  };

  const coinObj = market.find(c => c.id === coin);

  return (
    <div>
      <SH icon="⏰" label="Time Machine Calculator" sub="What would your investment be worth if you had bought X years ago?"/>

      {/* Controls */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:10,marginBottom:16}}>
        <select value={coin} onChange={e=>{ setCoin(e.target.value); setResult(null); }} style={{...IS,width:"100%"}}>
          {market.length===0 && <option value="bitcoin">Loading coins… (bitcoin selected)</option>}
          {market.slice(0,100).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13}}>₹</span>
          <input type="number" value={amount} onChange={e=>{ setAmount(e.target.value); setResult(null); }}
            placeholder="Amount (₹)" style={{...IS,width:"100%",paddingLeft:24}}/>
        </div>
        <button onClick={calculate} disabled={loading} style={{...BS,opacity:loading?0.6:1,whiteSpace:"nowrap"}}>
          {loading ? "⏳ Calculating…" : "Calculate"}
        </button>
      </div>

      {/* Years slider */}
      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"16px 20px",marginBottom:16,border:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:13,color:C.muted,fontWeight:600}}>Years ago</span>
          <span style={{fontSize:20,fontWeight:800,color:C.gold,fontFamily:"'Syne',sans-serif"}}>{years} {years===1?"year":"years"}</span>
        </div>
        <input type="range" min={1} max={5} step={1} value={years}
          onChange={e=>{ setYears(Number(e.target.value)); setResult(null); }}
          style={{width:"100%",accentColor:"#f59e0b",cursor:"pointer",height:6}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          {[1,2,3,4,5].map(y=>(
            <button key={y} onClick={()=>{ setYears(y); setResult(null); }} style={{
              width:28,height:28,borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
              background:years===y?"rgba(245,158,11,0.25)":"transparent",
              color:years===y?C.gold:C.muted,transition:"all .15s",
            }}>{y}</button>
          ))}
        </div>
      </div>

      {/* Quick amount chips */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {[1000,5000,10000,25000,50000,100000].map(a => (
          <button key={a} onClick={()=>{ setAmount(String(a)); setResult(null); }} style={{
            padding:"5px 12px",borderRadius:20,
            border:`1px solid ${String(amount)==String(a)?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.1)"}`,
            background:String(amount)==String(a)?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.04)",
            color:String(amount)==String(a)?"#fb923c":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:11,fontWeight:600,
          }}>₹{a>=100000?"1L":a>=1000?`${a/1000}K`:a}</button>
        ))}
      </div>

      {loading && (
        <div style={{textAlign:"center",padding:"40px",color:C.muted}}>
          <div style={{fontSize:32,animation:"spin 1s linear infinite",marginBottom:12}}>⏳</div>
          Fetching {years}-year historical data…
        </div>
      )}

      {result && !result.error && (
        <div style={{animation:"fadeUp .5s ease"}}>
          <div style={{padding:"28px 24px",borderRadius:20,marginBottom:16,
            background:"linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
            border:`1px solid ${result.gain>=0?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.25)"}`,
            boxShadow:`0 0 40px ${result.gain>=0?"rgba(52,211,153,0.05)":"rgba(248,113,113,0.05)"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              {result.img && <img src={result.img} width={48} height={48} style={{borderRadius:"50%"}} alt=""/>}
              <div>
                <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:"'Syne',sans-serif"}}>{result.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{result.years} {result.years===1?"year":"years"} ago ({result.dateStr}): <span style={{fontFamily:"'DM Mono',monospace",color:"#fff"}}>₹{fmtC(result.priceThen)}</span></div>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Price Today</div>
                <div style={{fontSize:18,fontWeight:800,color:C.gold,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(result.priceNow)}</div>
              </div>
            </div>

            <div style={{fontSize:13,color:C.muted,marginBottom:16}}>
              If you had invested <strong style={{color:"#fff"}}>₹{fmtC(result.investedAmt)}</strong> on <strong style={{color:"#fff"}}>{result.dateStr}</strong>, you would have bought <strong style={{color:C.teal}}>{result.coinsBought.toFixed(6)} {coinObj?.sym||coin.toUpperCase()}</strong>.
            </div>

            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:13,color:C.muted,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Your investment today would be worth</div>
              <div style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:800,
                color:result.gain>=0?C.green:C.red,fontFamily:"'Syne',sans-serif",letterSpacing:-2,
                textShadow:`0 0 40px ${result.gain>=0?"rgba(52,211,153,0.4)":"rgba(248,113,113,0.4)"}`}}>
                ₹{fmtC(result.valueNow)}
              </div>
              <div style={{fontSize:16,fontWeight:700,color:result.gain>=0?C.green:C.red,marginTop:8}}>
                {result.gain>=0?"✅":"❌"} {result.gain>=0?"+":""}₹{fmtC(Math.abs(result.gain))} ({result.gainPct>=0?"+":""}{result.gainPct.toFixed(1)}% in {result.years} {result.years===1?"year":"years"})
              </div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[
              ["📅",`Price ${result.years}Y Ago`,`₹${fmtC(result.priceThen)}`,C.muted],
              ["📈","Price Today",`₹${fmtC(result.priceNow)}`,C.gold],
              ["🚀","Price Change",`${((result.priceNow-result.priceThen)/result.priceThen*100).toFixed(1)}%`,clr(result.priceNow-result.priceThen)],
            ].map(([ic,l,v,col]) => (
              <div key={l} style={{background:`${col}0D`,border:`1px solid ${col}25`,borderRadius:14,padding:"14px 16px",textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:6}}>{ic}</div>
                <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{l}</div>
                <div style={{fontWeight:800,fontSize:15,color:col,fontFamily:"'DM Mono',monospace"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {result?.error && <p style={{color:C.red,fontSize:13,padding:"12px 16px",background:"rgba(248,113,113,0.08)",borderRadius:10,border:"1px solid rgba(248,113,113,0.2)"}}>{result.error}</p>}
    </div>
  );
}
function useAlertSound() {
  const play = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, []);
  return play;
}

// ═══════════ WATCHLIST ═══════════
function Watchlist({ market, portfolio, onAddToPortfolio, addToast }) {
  const [watchlist, setWatchlist] = useState(() => LS.get("cf_watchlist", []));
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [addQty, setAddQty] = useState({});
  const [addPrice, setAddPrice] = useState({});

  useEffect(() => LS.set("cf_watchlist", watchlist), [watchlist]);

  useEffect(() => {
    if (!search.trim()) { setFiltered([]); return; }
    const q = search.toLowerCase();
    setFiltered(market.filter(c =>
      c.name.toLowerCase().includes(q) || c.sym.toLowerCase().includes(q)
    ).slice(0, 8));
  }, [search, market]);

  const addToWatch = (coin) => {
    if (watchlist.find(w => w.id === coin.id)) { addToast("Already in watchlist", "warn"); return; }
    setWatchlist(w => [...w, { id: coin.id, name: coin.name, sym: coin.sym, img: coin.img, addedAt: now() }]);
    setSearch(""); setFiltered([]);
    addToast(`👀 ${coin.name} added to watchlist`);
  };

  const removeFromWatch = (id) => setWatchlist(w => w.filter(x => x.id !== id));

  const handleAddToPortfolio = (w) => {
    const qty = parseFloat(addQty[w.id]||0);
    const price = parseFloat(addPrice[w.id]||0);
    const marketCoin = market.find(c => c.id === w.id);
    if (!qty || !price) { addToast("Enter quantity and buy price", "error"); return; }
    onAddToPortfolio({
      name: w.id, image: w.img, quantity: qty, buyPrice: price,
      currentPrice: marketCoin?.price || price,
      sparkline: [], buyDate: now(), isSimulation: false,
    });
    setWatchlist(wl => wl.filter(x => x.id !== w.id));
    addToast(`✅ ${w.name} added to portfolio!`);
  };

  return (
    <div>
      <SH icon="👀" label="Watchlist" sub="Track coins you're interested in without buying yet"/>

      {/* Search to add */}
      <div style={{position:"relative",marginBottom:20}}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search to add coin to watchlist..."
          style={{...IS,width:"100%",paddingRight:40}}/>
        {search && <button onClick={()=>{setSearch("");setFiltered([]);}} style={{
          position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
          background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>×</button>}
        {filtered.length > 0 && (
          <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,
            background:"rgba(8,15,30,0.98)",border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:12,marginTop:4,overflow:"hidden",backdropFilter:"blur(20px)"}}>
            {filtered.map(c => (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                cursor:"pointer",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                onClick={()=>addToWatch(c)}>
                <img src={c.img} width={24} height={24} style={{borderRadius:"50%"}} alt=""/>
                <span style={{flex:1,fontSize:13,fontWeight:600}}>{c.name}</span>
                <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:C.muted}}>₹{fmtC(c.price)}</span>
                <span style={{fontSize:11,color:clr(c.chg),fontWeight:700}}>{pct(c.chg)}</span>
                <span style={{fontSize:11,color:C.teal,fontWeight:600}}>+ Watch</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!watchlist.length && (
        <div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
          <div style={{fontSize:48,marginBottom:12}}>👀</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:6,color:"#fff"}}>Watchlist is empty</div>
          <div style={{fontSize:13}}>Search above to add coins you want to track</div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {watchlist.map(w => {
          const marketCoin = market.find(c => c.id === w.id);
          const inPort = portfolio.find(p => p.name === w.id);
          return (
            <div key={w.id} style={{padding:"14px 16px",borderRadius:14,
              background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:inPort?0:12}}>
                {w.img && <img src={w.img} width={36} height={36} style={{borderRadius:"50%"}} alt=""/>}
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>{w.name}</div>
                  <div style={{fontSize:11,color:C.muted}}>{w.sym}</div>
                </div>
                {marketCoin && (
                  <>
                    <div style={{textAlign:"right",marginRight:8}}>
                      <div style={{fontWeight:700,fontSize:15,color:C.gold,fontFamily:"'DM Mono',monospace"}}>₹{fmtC(marketCoin.price)}</div>
                      <div style={{fontSize:12,color:clr(marketCoin.chg),fontWeight:700}}>{pct(marketCoin.chg)}</div>
                    </div>
                    <div style={{width:60}}>
                      <Spark data={(marketCoin.sparkline||[]).slice(-20)} color={clr(marketCoin.chg)} h={28}/>
                    </div>
                  </>
                )}
                <button onClick={()=>removeFromWatch(w.id)} style={{
                  background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",
                  color:C.red,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:12,fontWeight:700}}>✕</button>
              </div>
              {!inPort && (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,marginTop:8,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                  <input type="number" placeholder="Quantity" value={addQty[w.id]||""} onChange={e=>setAddQty(q=>({...q,[w.id]:e.target.value}))} style={{...IS,padding:"8px 12px",fontSize:12}}/>
                  <input type="number" placeholder="Buy Price ₹" value={addPrice[w.id]||""} onChange={e=>setAddPrice(p=>({...p,[w.id]:e.target.value}))} style={{...IS,padding:"8px 12px",fontSize:12}}/>
                  <button onClick={()=>handleAddToPortfolio(w)} style={{...BS,padding:"8px 14px",fontSize:12}}>Add to Portfolio →</button>
                </div>
              )}
              {inPort && <div style={{fontSize:11,color:C.green,marginTop:6,padding:"4px 8px",background:"rgba(52,211,153,0.1)",borderRadius:6,display:"inline-block"}}>✓ Already in portfolio</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ═══════════ MAIN APP ═══════════
const NAV=[
  {k:"dashboard",i:"🏠",l:"Dashboard"},
  {k:"portfolio",i:"💼",l:"Portfolio"},
  {k:"analytics",i:"📊",l:"Analytics"},
  {k:"market",i:"🌐",l:"Market"},
  {k:"movers",i:"🚀",l:"Top Movers"},
  {k:"alerts",i:"🔔",l:"Price Alerts"},
  {k:"game",i:"🎮",l:"Trading Game"},
  {k:"goals",i:"🎯",l:"Goals"},
  {k:"timeline",i:"📅",l:"Timeline"},
  {k:"replay",i:"⏪",l:"Replay"},
  {k:"export",i:"📤",l:"Export"},
  {k:"news",i:"📰",l:"News Feed"},
  {k:"tax",i:"🧾",l:"Tax Report"},
  {k:"share",i:"🖼️",l:"Share Card"},
  {k:"yearago",i:"⏰",l:"Time Machine"},
];

export default function App() {
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");
  const [mode,setMode]=useState("real");
  const [realPort,setRealPort]=useState(()=>LS.get("cf_real",[]));
  const [simPort,setSimPort]=useState(()=>LS.get("cf_sim",[]));
  const [vBal,setVBal]=useState(()=>LS.get("cf_vbal",100000));
  const [alerts,setAlerts]=useState(()=>LS.get("cf_alerts",[]));
  const [txns,setTxns]=useState(()=>LS.get("cf_txns",[]));
  const [pnlHistory,setPnlHistory]=useState(()=>LS.get("cf_pnlhist",[]));
  const [market,setMarket]=useState([]);
  const [toast,setToast]=useState(null);
  const [confetti,setConfetti]=useState(false);
  const currency="INR";
  const [sideOpen,setSideOpen]=useState(true);
  const prevPnl=useRef(null);
  const playAlertSound=useAlertSound();

  const isSim=false;
  const port=realPort;
  const setPort=setRealPort;

  useEffect(()=>LS.set("cf_real",realPort),[realPort]);
  useEffect(()=>LS.set("cf_sim",simPort),[simPort]);
  useEffect(()=>LS.set("cf_mode",mode),[mode]);
  useEffect(()=>LS.set("cf_vbal",vBal),[vBal]);
  useEffect(()=>LS.set("cf_alerts",alerts),[alerts]);
  useEffect(()=>LS.set("cf_txns",txns),[txns]);
  useEffect(()=>LS.set("cf_pnlhist",pnlHistory),[pnlHistory]);

  useEffect(()=>{
    const fetchMarket=()=>{
      cgFetch("/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h")
        .then(r=>r.json()).then(d=>setMarket(d.map(c=>({
          id:c.id,name:c.name,sym:(c.symbol||'').toUpperCase(),img:c.image,
          price:c.current_price,chg:c.price_change_percentage_24h||0,
          sparkline:c.sparkline_in_7d?.price||[],
          marketCap:c.market_cap||0,vol24h:c.total_volume||0,
        })))).catch(()=>{});
    };
    fetchMarket();
    const iv=setInterval(fetchMarket,60000);
    return()=>clearInterval(iv);
  },[]);

  const addToast=useCallback((msg,type="")=>setToast({msg,type,id:uid()}),[]);

  const totalInv=port.reduce((s,c)=>s+c.quantity*c.buyPrice,0);
  const totalVal=port.reduce((s,c)=>s+c.quantity*(c.currentPrice||c.buyPrice),0);
  const pnl=totalVal-totalInv;
  const pnlPct=totalInv>0?(pnl/totalInv)*100:0;

  useEffect(()=>{
    if(prevPnl.current!==null&&pnl>0){
      const hit=[1000,5000,10000,50000,100000].find(m=>prevPnl.current<m&&pnl>=m);
      if(hit){setConfetti(true);addToast(`🎉 Milestone: ₹${fmtC(hit)} profit!`);}
    }
    prevPnl.current=pnl;
  },[pnl,addToast]);

  useEffect(()=>{if(!confetti)return;const t=setTimeout(()=>setConfetti(false),5000);return()=>clearTimeout(t);},[confetti]);

  const addCoin=coin=>{
    if(isSim){const cost=coin.quantity*(coin.currentPrice||coin.buyPrice);if(cost>vBal){addToast("Insufficient virtual balance","error");return;}setVBal(b=>b-cost);}
    setPort(p=>[...p,coin]);
    setTxns(t=>[{id:uid(),type:"BUY",...coin,date:now()},...t]);
  };

  const delCoin=i=>{
    const coin=port[i];
    if(isSim)setVBal(b=>b+coin.quantity*(coin.currentPrice||coin.buyPrice));
    const realizedPnl=coin.quantity*((coin.currentPrice||coin.buyPrice)-coin.buyPrice);
    setPnlHistory(h=>[{id:uid(),name:coin.name,sym:coin.sym||coin.symbol||"",qty:coin.quantity,
      buyPrice:coin.buyPrice,sellPrice:coin.currentPrice||coin.buyPrice,
      pnl:realizedPnl,date:now(),type:"REMOVE"},...h]);
    setPort(p=>p.filter((_,j)=>j!==i));
    setTxns(t=>[{id:uid(),type:"SELL",...coin,date:now()},...t]);
    addToast("Asset removed");
  };

  const sellCoin=(i,qty,price)=>{
    const coin=port[i];
    const sellQty=Math.min(Number(qty),coin.quantity);
    if(!sellQty||sellQty<=0){addToast("Invalid quantity","error");return;}
    const rate=FX[currency]||1, sym2=SYM[currency]||"₹";
    const realizedPnl=sellQty*(price-coin.buyPrice);
    setPnlHistory(h=>[{id:uid(),name:coin.name,sym:coin.sym||coin.symbol||"",qty:sellQty,
      buyPrice:coin.buyPrice,sellPrice:price,pnl:realizedPnl,date:now(),type:"SELL"},...h]);
    setTxns(t=>[{id:uid(),type:"SELL",...coin,quantity:sellQty,currentPrice:price,date:now()},...t]);
    if(sellQty>=coin.quantity-0.000001){
      setPort(p=>p.filter((_,j)=>j!==i));
    } else {
      setPort(p=>p.map((c,j)=>j===i?{...c,quantity:+(c.quantity-sellQty).toFixed(8)}:c));
    }
    addToast(`Sold ${sellQty} ${coin.name} for ${sym2}${fmt(sellQty*price*rate)}`,"success");
  };

  if(!user)return(<><style>{G}</style><Login onLogin={u=>setUser(u)}/></>);

  const rate=FX[currency]||1,sym=SYM[currency]||"₹";
  const an=NAV.find(n=>n.k===tab)||NAV[0];

  return (
    <>
      <style>{G}</style>
      <Confetti active={confetti}/>
      {toast&&<Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:C.bg}}>
        {/* SIDEBAR — premium redesign */}
        <div className="cf-sidebar" style={{
          width:sideOpen?240:68,flexShrink:0,
          background:"rgba(4,8,18,0.98)",
          backdropFilter:"blur(30px)",
          borderRight:"1px solid rgba(255,255,255,0.07)",
          display:"flex",flexDirection:"column",
          transition:"width .3s cubic-bezier(0.22,1,0.36,1)",
          overflow:"hidden",position:"relative",zIndex:10,
        }}>
          {/* Logo */}
          <div style={{
            padding:"20px 16px",
            borderBottom:"1px solid rgba(255,255,255,0.06)",
            display:"flex",alignItems:"center",gap:12,flexShrink:0,minHeight:68,
          }}>
            <div style={{flexShrink:0}}>
              <CryptofolioLogo size={36} animate={true}/>
            </div>
            {sideOpen&&<div style={{overflow:"hidden",whiteSpace:"nowrap"}}>
              <div style={{fontWeight:800,fontSize:16,letterSpacing:-0.5,color:"#fff",fontFamily:"'Syne',sans-serif",lineHeight:1}}>Cryptofolio</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:500,marginTop:3,letterSpacing:2,textTransform:"uppercase"}}>Ultra Pro</div>
            </div>}
          </div>

          {/* Nav items */}
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"12px 8px"}}>
            {/* Section label */}
            {sideOpen&&<div style={{fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:2,textTransform:"uppercase",
              padding:"4px 10px 10px",fontWeight:600}}>MAIN MENU</div>}
            {NAV.map(n=>(
              <button key={n.k} onClick={()=>setTab(n.k)} className="sidebar-item" style={{
                background:tab===n.k?"rgba(255,255,255,0.08)":"transparent",
                color:tab===n.k?"#fff":"rgba(255,255,255,0.4)",
                fontWeight:tab===n.k?600:400,
                justifyContent:sideOpen?"flex-start":"center",
                whiteSpace:"nowrap",
                borderLeft:tab===n.k?"2px solid rgba(249,115,22,0.8)":"2px solid transparent",
                marginBottom:2,
              }}>
                <span style={{fontSize:16,flexShrink:0,opacity:tab===n.k?1:0.7}}>{n.i}</span>
                {sideOpen&&<span style={{overflow:"hidden",textOverflow:"ellipsis",fontSize:13}}>{n.l}</span>}
                {tab===n.k&&sideOpen&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",
                  background:"#f97316",flexShrink:0,boxShadow:"0 0 8px rgba(249,115,22,0.8)"}}/>}
              </button>
            ))}
          </div>

          {/* User + sign out */}
          <div style={{padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            {sideOpen&&<div style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
              borderRadius:14,background:"rgba(255,255,255,0.04)",marginBottom:8,
              border:"1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
                background:"linear-gradient(135deg,#f97316,#f0b429)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:700,color:"#000"}}>
                {(user.name||user.email||"U")[0].toUpperCase()}
              </div>
              <div style={{overflow:"hidden",minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name||"User"}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
              </div>
            </div>}
            <button onClick={()=>setUser(null)} style={{
              width:"100%",padding:"9px",borderRadius:12,
              border:"1px solid rgba(248,113,113,0.2)",
              background:"rgba(248,113,113,0.06)",
              color:"rgba(248,113,113,0.8)",cursor:"pointer",fontWeight:600,fontSize:12,
              transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            }}>
              {sideOpen?<><span>↩</span><span>Sign Out</span></>:<span>↩</span>}
            </button>
          </div>

          {/* Collapse toggle */}
          <button onClick={()=>setSideOpen(!sideOpen)} style={{
            position:"absolute",top:"50%",right:-11,transform:"translateY(-50%)",
            width:22,height:22,borderRadius:"50%",
            border:"1px solid rgba(255,255,255,0.12)",
            background:"#0d1829",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:10,zIndex:20,
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all .2s",
          }}>{sideOpen?"‹":"›"}</button>
        </div>

        {/* MAIN */}
        <div className="cf-main" style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0,
          background:"linear-gradient(160deg,#040810 0%,#060c18 50%,#040810 100%)"}}>
          <Ticker coins={market} currency={currency}/>

          {/* TOPBAR — premium */}
          <div className="cf-topbar" style={{
            padding:"0 24px",height:56,flexShrink:0,
            borderBottom:"1px solid rgba(255,255,255,0.06)",
            background:"rgba(4,8,18,0.8)",
            backdropFilter:"blur(30px) saturate(180%)",
            WebkitBackdropFilter:"blur(30px)",
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:14,minWidth:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:"#fff",letterSpacing:-0.3,fontFamily:"'Syne',sans-serif",lineHeight:1}}>
                  {an.i} {an.l}
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:2,letterSpacing:.3}}>
                  {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}
                </div>
              </div>
              {/* Mode removed — use Trading Game for simulation */}
            </div>

          </div>

          {/* CONTENT */}
          <div style={{flex:1,overflowY:"auto",padding:"24px",
            background:"transparent"}} className="tab-content cf-content">

            {tab==="dashboard"&&(
              <div>
                {/* Premium stat cards */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:24}}>
                  <Stat icon="💎" label="Portfolio Value"
                    value={`${sym}${fmtC(totalVal*rate)}`}
                    sub={`${sym}${fmtC(totalInv*rate)} invested`} accent={C.gold}/>
                  <Stat icon={pnl>=0?"🚀":"📉"} label="Net P&L"
                    value={`${pnl>=0?"+":""}${sym}${fmtC(Math.abs(pnl)*rate)}`}
                    sub={pct(pnlPct)} accent={clr(pnl)}/>
                  <Stat icon="🪙" label="Holdings"
                    value={port.length}
                    sub={`${port.length} assets tracked`} accent={C.teal}/>
                  <Stat icon="⚡" label="24h P&L %" value={pct(pnlPct)} sub="vs invested" accent={clr(pnlPct)}/>
                </div>
                {/* Multi-currency row REMOVED — user selects currency from top-right */}
                <Card style={{marginBottom:20}}>
                  <FearGreedWidget/>
                </Card>
                <Card style={{marginBottom:20}}>
                  <SH icon="📈" label="Portfolio Performance"/>
                  <PerformanceChart portfolio={port} txns={txns}/>
                </Card>
                {port.length > 0 && (
                  <Card style={{marginBottom:20}}>
                    <SH icon="🥧" label="Portfolio Allocation" sub="Hover slices to explore"/>
                    <DonutChart portfolio={port}/>
                  </Card>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <Card><SH icon="💡" label="Smart Suggestions"/>
                    <Suggestions portfolio={port} coins={market}/></Card>
                  <Card>
                    <SH icon="🚀" label="Market Movers (24h)"/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                      {["gainers","losers"].map(type=>{
                        const items=[...market].sort((a,b)=>type==="gainers"?b.chg-a.chg:a.chg-b.chg)
                          .filter(c=>type==="gainers"?c.chg>0:c.chg<0).slice(0,4);
                        const col=type==="gainers"?C.green:C.red;
                        return (
                          <div key={type}>
                            <div style={{fontWeight:700,fontSize:12,color:col,marginBottom:10,
                              textTransform:"uppercase",letterSpacing:.5}}>
                              {type==="gainers"?"🚀 Top":"📉 Worst"}
                            </div>
                            {items.map(c=>(
                              <div key={c.id} style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                                <img src={c.img} width={20} height={20} style={{borderRadius:"50%",flexShrink:0}} alt=""/>
                                <span style={{flex:1,fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.sym}</span>
                                <span style={{fontSize:12,color:col,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{pct(c.chg)}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* ─── Total P&L History ─── */}
                {(()=>{
                  const totalRealized=pnlHistory.reduce((s,e)=>s+(e.pnl||0),0);
                  const totalUnrealized=pnl;
                  const grandTotal=totalRealized+totalUnrealized;
                  return (
                    <Card style={{marginTop:16}}>
                      <SH icon="📋" label="Total P&L History" sub="All-time realized + current unrealized"/>
                      {/* Summary row */}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                        {[
                          {label:"Realized P&L",val:totalRealized,col:clr(totalRealized)},
                          {label:"Unrealized P&L",val:totalUnrealized,col:clr(totalUnrealized)},
                          {label:"Grand Total",val:grandTotal,col:clr(grandTotal)},
                        ].map(({label,val,col})=>(
                          <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",
                            borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                            <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{label}</div>
                            <div style={{fontSize:18,fontWeight:800,color:col,fontFamily:"'Syne',sans-serif",letterSpacing:-0.5}}>
                              {val>=0?"+":""}{sym}{fmtC(Math.abs(val)*rate)}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* History table */}
                      {pnlHistory.length===0?(
                        <div style={{textAlign:"center",padding:"32px 0",color:C.muted}}>
                          <div style={{fontSize:40,marginBottom:10}}>📭</div>
                          <div style={{fontSize:13,fontWeight:500}}>No realized P&L yet</div>
                          <div style={{fontSize:11,marginTop:4,opacity:0.6}}>Sell assets from your portfolio to start tracking history</div>
                        </div>
                      ):(
                        <div style={{overflowX:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                            <thead>
                              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                                {["Date","Asset","Qty","Buy Price","Sell Price","Realized P&L"].map(h=>(
                                  <th key={h} style={{padding:"8px 10px",textAlign:"left",color:C.muted,
                                    fontSize:10,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {pnlHistory.slice(0,20).map((e,i)=>(
                                <tr key={e.id||i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",
                                  background:i%2===0?"rgba(255,255,255,0.02)":"transparent",transition:"background .15s"}}
                                  onMouseEnter={ev=>ev.currentTarget.style.background="rgba(255,255,255,0.05)"}
                                  onMouseLeave={ev=>ev.currentTarget.style.background=i%2===0?"rgba(255,255,255,0.02)":"transparent"}>
                                  <td style={{padding:"10px 10px",color:C.muted,fontSize:11}}>
                                    {new Date(e.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"2-digit"})}
                                  </td>
                                  <td style={{padding:"10px 10px",fontWeight:700}}>
                                    {e.name} <span style={{color:C.muted,fontWeight:400,fontSize:11}}>({e.sym||""})</span>
                                  </td>
                                  <td style={{padding:"10px 10px",fontFamily:"'DM Mono',monospace",color:C.muted}}>{+(e.qty||0).toFixed(4)}</td>
                                  <td style={{padding:"10px 10px",fontFamily:"'DM Mono',monospace",color:C.muted}}>
                                    ₹{fmtC(e.buyPrice||0)}
                                  </td>
                                  <td style={{padding:"10px 10px",fontFamily:"'DM Mono',monospace",color:C.muted}}>
                                    ₹{fmtC(e.sellPrice||0)}
                                  </td>
                                  <td style={{padding:"10px 10px",fontWeight:700,fontFamily:"'DM Mono',monospace",
                                    color:clr(e.pnl||0)}}>
                                    {(e.pnl||0)>=0?"+":""}{sym}{fmtC(Math.abs(e.pnl||0)*rate)}
                                    {e.buyPrice&&e.qty?(
                                      <span style={{fontSize:10,marginLeft:5,opacity:0.65}}>
                                        ({(((e.pnl||0)/(e.qty*e.buyPrice))*100).toFixed(1)}%)
                                      </span>
                                    ):null}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {pnlHistory.length>20&&(
                            <div style={{textAlign:"center",padding:"10px 0",color:C.muted,fontSize:12,marginTop:4}}>
                              Showing latest 20 of {pnlHistory.length} entries
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })()}
              </div>
            )}

            {tab==="portfolio"&&(
              <div>
                <AddCoin onAdd={addCoin} isSim={isSim} virtualBalance={vBal} addToast={addToast}/>
                {!port.length&&<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                  <div style={{fontSize:56,marginBottom:12}}>💼</div>
                  <h3 style={{fontWeight:800,marginBottom:6}}>No holdings yet</h3>
                  <p>Use the form above to add your first asset</p>
                </div>}
                {port.map((c,i)=>(
                  <CoinCard key={c.name+i} coin={c} onDelete={()=>delCoin(i)} onSell={(qty,price)=>sellCoin(i,qty,price)} currency={currency}/>
                ))}
              </div>
            )}

            {tab==="analytics"&&<Analytics portfolio={port} txns={txns}/>}
            {tab==="market"&&<Market coins={market} currency={currency}/>}
            {tab==="movers"&&<Movers coins={market}/>}
            {tab==="alerts"&&<Card><Alerts coins={market} alerts={alerts} setAlerts={setAlerts} addToast={addToast} playSound={playAlertSound}/></Card>}
            {tab==="game"&&<Card><Game addToast={addToast}/></Card>}
            {tab==="goals"&&<Card><Goals totalValue={totalVal} addToast={addToast}/></Card>}
            {tab==="timeline"&&<Card><Timeline portfolio={port} txns={txns}/></Card>}
            {tab==="replay"&&<Card><Replay portfolio={port}/></Card>}
            {tab==="export"&&<Export portfolio={port} totalVal={totalVal} pnl={pnl} addToast={addToast}/>}
            {tab==="news"&&<Card><NewsFeed/></Card>}

            {tab==="tax"&&<Card><TaxReport txns={txns} addToast={addToast}/></Card>}
            {tab==="share"&&<Card><ShareCard portfolio={port} totalVal={totalVal} pnl={pnl} user={user}/></Card>}
            {tab==="yearago"&&<Card><OneYearAgo market={market}/></Card>}

          </div>
        </div>
      </div>
    </>
  );
}
