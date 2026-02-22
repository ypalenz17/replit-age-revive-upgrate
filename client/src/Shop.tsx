import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  ShoppingBag,
  X
} from 'lucide-react';
import { useParams } from 'wouter';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import Footer from './components/Footer';
import imgCellubiome from '@assets/FRONT_RENDER_TRANSPARENT_1771623631843.png';
import imgCellunad from '@assets/CELLUNAD_1771623812381.png';
import imgCellunova from '@assets/CELLUNAD_CELLUNOVA_1771623812382.png';
import { BrandName } from './productsData';

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------
   Utilities
------------------------------ */
function hexToRgba(hex, alpha = 1) {
  const h = (hex || '').replace('#', '').trim();
  if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

/* -----------------------------
   Product Data (restored + tightened copy)
------------------------------ */
const PRODUCTS = {
  cellunad: {
    id: 'cellunad',
    name: 'CELLUNAD+',
    category: 'NAD+ Optimization',
    tagline: 'Daily NAD+ support, engineered for consistency.',
    description:
      'A molecular-grade daily protocol that supports NAD+ metabolism with redox and methylation cofactors. Built to feel precise, not noisy.',
    price: '$92.00',
    serving: '2 capsules daily',
    accent: '#1e3a8a',
    heroImage: '/images/cellunad-trimmed.png',
    outcomes: [
      'Supports NAD+ metabolism',
      'Supports mitochondrial energy production',
      'Supports cellular resilience',
      'Supports healthy methylation pathways'
    ],
    ingredients: [
      { name: 'Nicotinamide Riboside (NR)', dose: '500 mg', purpose: 'NAD+ precursor support' },
      { name: 'R-Lipoic Acid', dose: '200 mg', purpose: 'Mitochondrial redox balance support' },
      { name: 'Apigenin', dose: '100 mg', purpose: 'NAD+ pathway support' },
      { name: 'Betaine (TMG)', dose: '250 mg', purpose: 'Methylation support' },
      { name: 'P-5-P (active B6)', dose: '10 mg', purpose: 'Cofactor support' },
      { name: '5-MTHF', dose: '400 mcg DFE', purpose: 'Folate cycle support' },
      { name: 'Methylcobalamin', dose: '1,000 mcg', purpose: 'B12 support' },
      { name: 'BioPerine', dose: '5 mg', purpose: 'Bioavailability support' }
    ],
    mechanics: [
      { title: 'NAD+ Pool Support', text: 'NR supports NAD+ pools as a daily input layer.', tags: ['Precursor delivery', 'Daily input'] },
      { title: 'Redox Balance', text: 'R-Lipoic Acid supports mitochondrial redox balance for steady output.', tags: ['Mitochondrial', 'Steady state'] },
      { title: 'Cofactor Alignment', text: 'Methylation cofactors support metabolic efficiency and daily consistency.', tags: ['Methylation', 'Consistency'] }
    ],
    timeline: [
      { time: 'Days 1–3', label: 'Protocol Onboarding', desc: 'Routine locks in. Many people notice the first shift as consistency, not a spike.', value: 'Foundation' },
      { time: 'Week 1', label: 'Stability Layer', desc: 'Daily inputs become predictable. The goal is steady, repeatable adherence.', value: 'Cadence' },
      { time: 'Month 1', label: 'Compounding', desc: 'Consistency becomes the product. This is where protocols start to feel “owned.”', value: 'Momentum' },
      { time: 'Months 2–3', label: 'Infrastructure', desc: 'Sustained routine typically feels smoother than intermittent intensity.', value: 'Durability' }
    ],
    telemetry: ['NAD+ Support', 'Cellular Energy', 'Redox Balance']
  },

  cellubiome: {
    id: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Mitochondrial + Gut Signaling Support',
    tagline: 'Postbiotic signaling for the gut mitochondria axis.',
    description:
      'Enteric-coated delivery of Urolithin A plus tributyrin to support mitochondrial recycling signals and short-chain fatty acid activity.',
    price: '$110.00',
    serving: '2 enteric-coated capsules daily',
    accent: '#19B3A6',
    heroImage: '/images/cellubiome-trimmed.png',
    outcomes: [
      'Supports mitophagy signaling',
      'Supports mitochondrial renewal pathways',
      'Supports gut-derived short-chain fatty acid signaling',
      'Supports cellular energy efficiency'
    ],
    ingredients: [
      { name: 'Urolithin A (≥99%)', dose: '500 mg', purpose: 'Mitochondrial recycling signal support' },
      { name: 'Tributyrin', dose: '500 mg', purpose: 'Postbiotic support (butyrate delivery)' }
    ],
    mechanics: [
      { title: 'Recycling Signal', text: 'Urolithin A supports mitochondrial recycling signaling (mitophagy support).', tags: ['Mitophagy', 'Signal layer'] },
      { title: 'Postbiotic Support', text: 'Tributyrin supports short-chain fatty acid activity through butyrate delivery.', tags: ['SCFA delivery', 'Gut axis'] },
      { title: 'Enteric Precision', text: 'Enteric-coated delivery supports release beyond the upper GI environment.', tags: ['Targeted release', 'Bioavailability'] }
    ],
    telemetry: ['Gut Signaling', 'Mito Renewal', 'Postbiotic Support'],
    timeline: [
      { time: 'Days 1–3', label: 'Comfort + Consistency', desc: 'Enteric delivery supports a smoother start, especially for sensitive routines.', value: 'Settle In' },
      { time: 'Week 1', label: 'Signal Support', desc: 'Daily inputs support signaling layers that benefit from repetition.', value: 'Alignment' },
      { time: 'Month 1', label: 'Sustained Routine', desc: 'Support tends to feel more stable when it is truly daily.', value: 'Stability' },
      { time: 'Months 2–3', label: 'Compounding', desc: 'Consistency is the unlock. Protocols compound when adherence is effortless.', value: 'Momentum' }
    ]
  },

  cellunova: {
    id: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Autophagy + Protocol Cycle',
    tagline: 'Seven days on. High-definition cellular maintenance.',
    description:
      'A cyclical protocol featuring polyphenols, antioxidants, and metabolic cofactors designed for short, intentional phases. Not a daily forever stack.',
    price: '$145.00',
    serving: '5 capsules daily for 7 consecutive days',
    warnings: 'Contains wheat (spermidine source).',
    accent: '#6C5CE7',
    heroImage: '/images/cellunova-trimmed.png',
    outcomes: [
      'Supports autophagy pathways',
      'Supports cellular cleanup signaling',
      'Supports healthy aging biology',
      'Supports oxidative stress defense'
    ],
    ingredients: [
      { name: 'NAC', dose: '600 mg', purpose: 'Glutathione support' },
      { name: 'Trans-Resveratrol', dose: '500 mg', purpose: 'Polyphenol support' },
      { name: 'Quercetin', dose: '500 mg', purpose: 'Cellular housekeeping support' },
      { name: 'Fisetin', dose: '100 mg', purpose: 'Cellular maintenance support' },
      { name: 'Green Tea Extract (50% EGCG)', dose: '300 mg', purpose: 'Antioxidant support' },
      { name: 'Spermidine (wheat germ)', dose: '15 mg', purpose: 'Autophagy pathway support' },
      { name: 'Astaxanthin', dose: '4 mg', purpose: 'Oxidative stress defense support' },
      { name: 'PQQ', dose: '10 mg', purpose: 'Mitochondrial cofactor support' },
      { name: 'Calcium Alpha-Ketoglutarate', dose: '300 mg', purpose: 'Metabolic support' },
      { name: 'BioPerine', dose: '5 mg', purpose: 'Bioavailability support' }
    ],
    mechanics: [
      { title: 'Phase Design', text: 'Designed for 7-day bursts to support cellular maintenance pathways intentionally.', tags: ['Cyclical protocol', '7-day burst'] },
      { title: 'Polyphenol Stack', text: 'A focused blend of polyphenols and antioxidants for short-cycle intensity.', tags: ['Antioxidant', 'High density'] },
      { title: 'Off-Cycle Matters', text: 'The off-cycle is part of the protocol. This is a cadence, not a constant.', tags: ['Recovery phase', 'Cadence'] }
    ],
    telemetry: ['Autophagy Support', 'Cellular Cleanup', 'Phase Design'],
    timeline: [
      { time: 'Days 1–2', label: 'Ramp', desc: 'Phase begins. Keep hydration and routine tight. Consistency beats force.', value: 'Initiate' },
      { time: 'Days 3–5', label: 'Peak Week', desc: 'This is the center of the cycle. Keep variables stable and boring.', value: 'Center' },
      { time: 'Days 6–7', label: 'Finish', desc: 'Complete the cycle as designed. Do not extend just to “feel more.”', value: 'Complete' },
      { time: 'Weeks 2–4', label: 'Off-Cycle', desc: 'Return to your base protocol. Consolidation is part of the strategy.', value: 'Reset' }
    ]
  }
};

/* -----------------------------
   Helper Components
------------------------------ */
function NoiseOverlay() {
  return (
    <div className="hidden md:block fixed inset-0 pointer-events-none z-[50] opacity-[0.035]" aria-hidden="true">
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

function TypewriterTelemetry({ phrases: inputPhrases }) {
  const phrases = useMemo(() => inputPhrases || ['NAD+ Support', 'Cellular Energy', 'Redox Balance'], [inputPhrases]);

  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    setText('');
  }, [phrases]);

  useEffect(() => {
    let charIdx = 0;
    const interval = setInterval(() => {
      setText(phrases[index].slice(0, charIdx));
      charIdx++;
      if (charIdx > phrases[index].length + 8) {
        setIndex((prev) => (prev + 1) % phrases.length);
        charIdx = 0;
      }
    }, 75);
    return () => clearInterval(interval);
  }, [index, phrases]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setCursor((c) => !c), 450);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="font-mono text-[12px] uppercase tracking-[0.18em] flex items-center gap-2">
      <span className="opacity-40">[TELEMETRY]</span>
      <span className="text-[color:var(--accent)] inline-flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-dot" />
        {text}
        <span className="opacity-80">{cursor ? '_' : ' '}</span>
      </span>
    </div>
  );
}

function IngredientPanel({ ingredients, accent }) {
  return (
    <div className="relative overflow-hidden rounded-ar-4xl border border-white/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.05] to-white/[0.02]" />
      <div className="absolute inset-0 backdrop-blur-2xl" />
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ background: `radial-gradient(800px 500px at 80% 0%, ${hexToRgba(accent, 0.6)}, transparent 60%)` }} />

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse-dot bg-ar-teal" />
            <span className="text-[12px] font-mono font-bold uppercase tracking-[0.14em] text-white/70">Full Dose Disclosure</span>
          </div>
          <span className="text-[12px] font-mono font-bold uppercase tracking-[0.14em] text-ar-teal">{ingredients.length} Actives</span>
        </div>

        <div className="space-y-0">
          {ingredients.map((ing, i) => (
            <div key={i} className="group">
              <div className="flex items-baseline justify-between py-3.5 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white leading-tight truncate">{ing.name}</p>
                    <p className="text-[12px] font-mono text-white/60 mt-1 uppercase tracking-[0.12em]">{ing.purpose}</p>
                </div>
                <span className="text-[14px] font-mono font-bold text-white shrink-0">{ing.dose}</span>
              </div>
              {i < ingredients.length - 1 && <div className="h-px bg-white/[0.08]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustStats({ product }) {
  const stats = [
    { value: 'Actives', label: String(product.ingredients.length) },
    { value: 'Dose', label: 'Clinical' },
    { value: 'Tested', label: '3rd Party' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <div key={i} className="relative overflow-hidden rounded-2xl border border-white/[0.12] min-h-[88px]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.05] to-white/[0.02]" />
          <div className="absolute inset-0 backdrop-blur-2xl" />
          <div className="relative z-10 p-4 text-center flex flex-col items-center justify-center min-h-[88px]">
            <p className="text-[12px] font-mono font-medium uppercase tracking-[0.12em] text-white/40 mb-1 whitespace-nowrap">{stat.value}</p>
            <p className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 54);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Science', href: '/#pillars' },
    { label: 'Journal', href: '/#journal' }
  ];

  return (
    <>
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[150] transition-all duration-500',
          scrolled
            ? 'bg-ar-navy/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_2px_24px_rgba(0,0,0,0.25)]'
            : 'bg-transparent border-b border-transparent'
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16">
          <a href="/" aria-label="Go to homepage">
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert transition-all duration-500" />
          </a>
          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[12px] uppercase tracking-[0.16em]">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-white/60 hover:text-ar-teal transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/shop" className="flex items-center gap-2 px-4 sm:px-5 min-h-[44px] bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.14em] hover:bg-ar-teal/90 transition-colors" data-testid="nav-shop-button-pdp">Shop</a>
            <button className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 hover:text-ar-teal transition-colors" aria-label="Cart"><ShoppingBag size={20} /></button>
            <button
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 hover:text-ar-teal transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle-shop"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[140] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 pt-24 pb-10 px-8 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/[0.08]">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 text-lg font-sans font-extrabold uppercase tracking-[0.08em] text-white/80 hover:text-ar-teal transition-colors border-b border-white/[0.06] last:border-0 min-h-[44px]"
                  data-testid={`mobile-nav-shop-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MagneticButton({ className = '', children, onClick, type = 'button' }) {
  const btnRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = btnRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.06);
        yTo(dy * 0.10);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    }, btnRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <button ref={btnRef} type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function SideSheet({ open, title, onClose, children }) {
  const reducedMotion = usePrefersReducedMotion();
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!reducedMotion && sheetRef.current) {
      const el = sheetRef.current;
      const panel = el.querySelector('[data-panel]');
      const overlay = el.querySelector('[data-overlay]');

      const ctx = gsap.context(() => {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.fromTo(panel, { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
      }, sheetRef);

      return () => {
        ctx.revert();
        document.body.style.overflow = prev;
      };
    }

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, reducedMotion]);

  if (!open) return null;

  return (
    <div ref={sheetRef} className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div data-overlay className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div data-panel className="relative w-full max-w-md bg-[#111827] h-full shadow-float p-10 md:p-12 overflow-y-auto border-l border-white/[0.08] rounded-l-ar-3xl">
        <button onClick={onClose} className="absolute top-7 right-7 p-2 rounded-lg hover:bg-white/10 transition-colors text-white min-h-[44px]" aria-label="Close panel">
          <X />
        </button>

        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-[12px] font-mono font-medium uppercase tracking-[0.14em] text-white/40">Overlay</p>
            <h3 className="text-3xl font-head font-normal tracking-[-0.03em] uppercase text-white">{title}</h3>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Main PDP Template
------------------------------ */
function ProductTemplate({ product }) {
  const containerRef = useRef(null);
  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());
    ScrollTrigger.clearScrollMemory?.();

    const ctx = gsap.context(() => {
      gsap.from('.hero-content', { opacity: 0, y: 46, duration: 1.05, ease: 'power4.out', delay: 0.18 });
      gsap.from('.buy-panel', { opacity: 0, x: 34, duration: 1.05, ease: 'power4.out', delay: 0.28 });

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.timeline-card').forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 55%',
          toggleClass: { targets: card, className: 'is-active' }
        });
      });

      gsap.utils.toArray('.archive-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%' },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out'
        });
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [product.id, reducedMotion]);

  const accentGlow = hexToRgba(product.accent, 0.55);

  return (
    <main ref={containerRef} style={{ '--accent': product.accent, '--accentGlow': accentGlow }} className="relative bg-[#0f172a] text-white">
      <div className="fixed inset-0 z-0 bg-[#0f172a]">
        <img
          src="https://images.unsplash.com/photo-1614850523296-e8c041de4398?auto=format&fit=crop&q=80&w=2400"
          className="w-full h-full object-cover grayscale opacity-30 mix-blend-screen"
          alt=""
          decoding="async"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_#0f172a_120%)] opacity-70" />
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(#F4F1EA 1px, transparent 1px), linear-gradient(90deg, #F4F1EA 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
      <div className="relative z-[2]">
      <NoiseOverlay />
      <Navbar />

      {/* Hero */}
      <section className="hero relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 z-[2] opacity-[0.25]" style={{ background: 'radial-gradient(900px 600px at 20% 85%, var(--accentGlow), transparent 60%)' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 px-4 md:px-6 pt-32 md:pt-32 pb-10 md:pb-12 items-center">

          <div className="w-full md:w-3/5 hero-content text-white text-center md:text-left">
            <h1 className="text-[clamp(3rem,10vw,6.5rem)] font-head font-normal tracking-[-0.04em] mb-4 md:mb-4 leading-[0.9]"><BrandName name={product.name} /></h1>

            <p className="text-lg md:text-2xl font-medium text-white/70 max-w-xl mb-8 md:mb-8 leading-snug mx-auto md:mx-0">{product.tagline}</p>

            {/* Desktop: inline protocol/system cards */}
            <div className="hidden md:inline-flex items-stretch gap-0 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
              <div className="px-5 py-3.5">
                <p className="text-[12px] uppercase font-mono text-white/35 tracking-[0.18em] mb-1">Protocol</p>
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/80">{product.serving}</p>
              </div>
              <div className="w-px bg-white/[0.08]" />
              <div className="px-5 py-3.5">
                <p className="text-[12px] uppercase font-mono text-white/35 tracking-[0.18em] mb-1">System Target</p>
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/80">{product.category}</p>
              </div>
            </div>

            {/* Mobile: single card with divider */}
            <div className="flex md:hidden rounded-2xl border border-white/[0.10] bg-white/[0.04] backdrop-blur-sm overflow-hidden">
              <div className="flex-1 px-2 py-4 text-center">
                <p className="text-[12px] uppercase font-mono text-white/35 tracking-[0.18em] mb-1.5">Protocol</p>
                <p className="text-[12px] font-bold tracking-[0.04em] uppercase text-white/80 leading-none whitespace-nowrap">{product.serving}</p>
              </div>
              <div className="w-px bg-white/[0.08] my-2.5" />
              <div className="flex-1 px-2 py-4 text-center">
                <p className="text-[12px] uppercase font-mono text-white/35 tracking-[0.18em] mb-1.5">Target</p>
                <p className="text-[12px] font-bold tracking-[0.04em] uppercase text-white/80 leading-none whitespace-nowrap">{product.category}</p>
              </div>
            </div>
          </div>

          {/* Buy card — full width on mobile, 2/5 on desktop */}
          <div className="w-full md:w-2/5 buy-panel">
            <div
              className="relative overflow-hidden rounded-[20px] md:rounded-[28px] border border-white/[0.12]"
              style={{ boxShadow: `0 0 0 1px ${hexToRgba(product.accent, 0.08)}, 0 4px 24px rgba(0,0,0,0.4), 0 40px 80px -30px ${hexToRgba(product.accent, 0.35)}` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-white/[0.03]" />
              <div className="absolute inset-0 backdrop-blur-2xl" />

              <div className="relative z-10">
                {/* Bottle image inside card */}
                <div className="relative flex items-end justify-center px-6 pt-6 pb-2 md:px-10 md:pt-10 md:pb-4">
                  <div className="absolute inset-0 opacity-[0.25]" style={{ background: `radial-gradient(circle at 50% 55%, ${product.accent}, transparent 65%)` }} />
                  <img src={product.heroImage} alt={product.name} className="relative z-10 w-[40%] md:w-[55%] max-h-[160px] md:max-h-none h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
                </div>

                <div className="px-5 pb-5 md:px-10 md:pb-10 space-y-3 md:space-y-4">
                  <div>
                    <span className="inline-block text-[12px] font-mono uppercase tracking-[0.18em] font-bold text-white/60 border border-white/[0.15] bg-white/[0.04] rounded-md px-3 py-1.5 mb-2 md:mb-3">{product.id === 'cellunova' ? '7-Day Cycle' : 'Daily Protocol'}</span>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[20px] md:text-[24px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-none"><BrandName name={product.name} /></h3>
                      <span className="text-[18px] md:text-[20px] font-sans font-extrabold text-white leading-none">{product.price}</span>
                    </div>
                  </div>

                  <p className="text-[13px] md:text-[15px] text-white/80 leading-relaxed">{product.description}</p>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                  <div className="space-y-2">
                    {product.outcomes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-[6px]" />
                        <span className="text-[12px] md:text-[14px] text-white leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {product.warnings && (
                    <div className="rounded-xl md:rounded-2xl bg-amber-500/[0.08] border border-amber-400/20 px-4 py-3 flex items-start gap-2.5">
                      <span className="text-amber-400 text-sm mt-0.5">⚠</span>
                      <p className="text-[12px] md:text-[13px] text-amber-200/90 leading-snug">{product.warnings}</p>
                    </div>
                  )}

                  <MagneticButton
                    className="w-full py-3.5 md:py-4 text-white rounded-lg font-mono font-bold tracking-[0.12em] text-[12px] uppercase flex items-center justify-center gap-3 active:scale-[0.98] transition-all relative overflow-hidden group border border-white/20 min-h-[44px]"
                    style={{ background: `linear-gradient(135deg, ${product.accent}, ${hexToRgba(product.accent, 0.7)})`, boxShadow: `0 0 24px ${hexToRgba(product.accent, 0.4)}, inset 0 1px 0 rgba(255,255,255,0.15)` }}
                    onClick={() => {}}
                  >
                    <span className="relative z-10">Add to Protocol Archive</span>
                    <ArrowRight size={15} className="relative z-10" />
                  </MagneticButton>

                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <button onClick={() => setActiveSidePanel('rationale')} className="py-2.5 md:py-3 rounded-xl text-[12px] uppercase font-mono font-bold tracking-[0.12em] text-white/80 bg-white/[0.08] border border-white/[0.14] hover:bg-white/[0.14] hover:text-white hover:border-white/[0.22] transition-all flex items-center justify-center gap-2 min-h-[44px]">
                      Evidence <ArrowRight size={9} />
                    </button>
                    <button onClick={() => setActiveSidePanel('ingredients')} className="py-2.5 md:py-3 rounded-xl text-[12px] uppercase font-mono font-bold tracking-[0.12em] text-white/80 bg-white/[0.08] border border-white/[0.14] hover:bg-white/[0.14] hover:text-white hover:border-white/[0.22] transition-all flex items-center justify-center gap-2 min-h-[44px]">
                      Ingredients <ArrowRight size={9} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* De-risk Strip */}
      <section className="border-y border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-4">
          {['3rd Party Tested', 'Standardized Actives', 'Protocol Cadence', 'Quality Controls'].map((text, i) => (
            <div key={i} className="flex items-center gap-2.5" data-testid={`trust-badge-${i}`}>
              <span className="font-mono text-[12px] font-bold tracking-[0.14em] text-[color:var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-px h-3 bg-white/[0.12]" />
              <span className="text-[12px] font-mono font-medium uppercase tracking-[0.12em] text-white/55 whitespace-nowrap">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 space-y-6 reveal">
            <TypewriterTelemetry phrases={product.telemetry} />
            <h2 className="text-5xl font-head font-normal tracking-[-0.04em] leading-[1.06] text-white">
              Every dose,{' '}<span className="text-white/60 underline decoration-white/20 underline-offset-4 decoration-[1.5px]">fully disclosed</span>.
            </h2>
            <p className="text-lg text-white/55 leading-relaxed font-medium">
              No proprietary blends. No hidden fillers. Each active is standardized, dosed at clinical-range levels, and listed with its exact purpose.
            </p>

            <TrustStats product={product} />

            <p className="text-[12px] font-mono text-white/45 uppercase tracking-[0.14em] leading-relaxed">
              All actives third-party tested in an ISO-certified laboratory. Full certificates of analysis available.
            </p>
          </div>

          <div className="md:col-span-7 reveal">
            <IngredientPanel ingredients={product.ingredients} accent={product.accent} />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4 reveal">
            <span className="text-[12px] font-mono uppercase tracking-[0.24em] text-white/50">Protocol Arc</span>
            <h2 className="text-5xl font-head font-normal tracking-[-0.04em] text-white">What to expect over time</h2>
            <p className="text-sm text-white/50 font-medium max-w-2xl mx-auto">This is a support protocol. Individual responses vary. Consistency is the point.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {product.timeline.map((step, i) => (
              <div key={i} className="relative group reveal">
                <div className="timeline-card relative overflow-hidden rounded-ar-2xl border border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:border-ar-teal/30 hover:shadow-[0_0_30px_rgba(25,179,166,0.08)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.05] to-white/[0.02] group-hover:from-white/[0.14] group-hover:via-white/[0.08] group-hover:to-white/[0.04] transition-all duration-300" />
                  <div className="absolute inset-0 backdrop-blur-2xl" />
                  <div className="relative z-10 p-8">
                    <p className="text-[12px] font-mono text-white/70 mb-2 uppercase tracking-[0.18em]">{step.time}</p>
                    <h4 className="text-xl font-head font-normal mb-3 tracking-[-0.02em] text-white">{step.label}</h4>
                    <p className="text-[13px] text-white/70 leading-relaxed font-medium mb-6">{step.desc}</p>

                    <div className="h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-white/70" style={{ width: `${(i + 1) * 25}%` }} />
                    </div>

                    <div className="mt-4">
                      <span className="text-[12px] font-mono font-bold uppercase text-white/70 tracking-[0.18em]">{step.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanistic Rationale Archive */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center text-white mb-20 space-y-4 reveal">
            <span className="text-[12px] font-mono uppercase tracking-[0.24em] text-white/50">Mechanistic Layering</span>
            <h2 className="text-5xl font-head font-normal tracking-[-0.04em]">Rationale, simplified</h2>
            <p className="text-sm text-white/55 font-medium max-w-2xl mx-auto">Clear intent. Clean inputs. Built to be scanned, not worshipped.</p>
          </div>

          {product.mechanics.map((item, i) => (
              <div key={i} className="archive-card w-full relative overflow-hidden rounded-ar-4xl border border-white/[0.12] hover:border-ar-teal/20 transition-all duration-300" data-testid={`rationale-card-${i}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.05] to-white/[0.02]" />
                <div className="absolute inset-0 backdrop-blur-2xl" />
                <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
                  <div className="absolute top-[20%] left-0 right-0 h-[1px] animate-scan-x" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
                </div>

                <div className="relative z-10 p-10 md:p-16 flex flex-col justify-center items-center text-center max-w-xl mx-auto space-y-6">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[40px] font-mono font-bold leading-none text-white/20">{`${String(i + 1).padStart(2, '0')}`}</span>
                    <div className="w-10 h-[1.5px] rounded-full bg-white/40" />
                  </div>

                  <h3 className="text-3xl md:text-4xl font-head font-normal tracking-[-0.03em] uppercase leading-none text-white">{item.title}</h3>

                  <p className="text-lg md:text-xl font-medium text-white/70 leading-relaxed italic max-w-md mx-auto">“{item.text}”</p>

                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    {item.tags.map((tag, t) => (
                      <span
                        key={t}
                        className="px-4 py-1.5 rounded-md text-[12px] font-mono font-medium uppercase tracking-[0.12em] border border-white/[0.12] bg-white/[0.04] text-white/70"
                      >{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </section>

      {/* FAQ + Disclaimer */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-head font-normal tracking-[-0.03em] mb-16 text-center text-white">Protocol Inquiries</h2>

        <div className="space-y-4 mb-24">
          {[
            { q: 'Is this protocol suitable for sensitive routines?', a: 'Start with the labeled serving. For sensitive systems, take with food and keep other variables stable for the first week.' },
            { q: 'How is this different from basic supplement stacks?', a: 'Age Revive is designed as infrastructure: standardized inputs, defined cadence, and clean intent. No noisy kitchen-sink blends.' },
            { q: 'Can I stack these products together?', a: 'They are designed to layer across different support systems. If you are unsure, start with one base product and add one layer at a time.' }
          ].map((faq, i) => (
            <details key={i} className="group relative overflow-hidden rounded-ar-2xl border border-white/[0.12] cursor-pointer hover:border-ar-teal/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.05] to-white/[0.02]" />
              <div className="absolute inset-0 backdrop-blur-2xl" />
              <summary className="relative z-10 list-none flex justify-between items-center font-sans font-extrabold tracking-[0.08em] uppercase text-sm text-white p-6">
                {faq.q}
                <ChevronDown className="group-open:rotate-180 transition-transform text-white/50" />
              </summary>
              <p className="relative z-10 px-6 pb-6 text-sm text-white/50 leading-relaxed font-medium">{faq.a}</p>
            </details>
          ))}
        </div>

      </section>

      <Footer />
      </div>

      {/* Side Sheets */}
      <SideSheet open={activeSidePanel === 'ingredients'} title="Full Ingredient Panel" onClose={() => setActiveSidePanel(null)}>
        <div className="space-y-6">
          {product.ingredients.map((ing, i) => (
            <div key={i} className="flex justify-between items-baseline border-b border-white/[0.08] pb-4 gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-sans font-extrabold text-sm tracking-[-0.01em] uppercase text-white">{ing.name}</p>
                <p className="text-[12px] font-mono text-white/40 uppercase tracking-[0.14em] leading-relaxed">{ing.purpose}</p>
              </div>
              <span className="font-mono text-sm font-extrabold whitespace-nowrap shrink-0" style={{ color: product.accent }}>{ing.dose}</span>
            </div>
          ))}
        </div>

        {product.warnings && (
          <div className="mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-ar-2xl">
            <p className="text-[12px] font-mono font-bold text-red-400 uppercase tracking-[0.14em] mb-1">Warning</p>
            <p className="text-sm font-semibold text-white/80">{product.warnings}</p>
          </div>
        )}
      </SideSheet>

      <SideSheet open={activeSidePanel === 'rationale'} title="Evidence Overlay" onClose={() => setActiveSidePanel(null)}>
        <div className="space-y-8">
          {product.mechanics.map((mech, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-mono font-bold text-white" style={{ background: hexToRgba(product.accent, 0.12), color: product.accent }}>
                  {i + 1}
                </div>
                <h4 className="font-head font-normal uppercase tracking-[0.12em] text-white">{mech.title}</h4>
              </div>
              <p className="text-sm text-white/55 leading-relaxed font-medium pl-11">{mech.text}</p>
            </div>
          ))}

          <div className="pt-8 border-t border-white/[0.08]">
            <p className="text-xs text-white/40 italic leading-relaxed">Rationale summarizes peer-reviewed research directions. It is not medical advice.</p>
          </div>
        </div>
      </SideSheet>
    </main>
  );
}

/* -----------------------------
   App Shell + Product Switcher
------------------------------ */
export default function Shop() {
  const params = useParams<{ slug?: string }>();
  const initialSlug = (params.slug && PRODUCTS[params.slug]) ? params.slug : 'cellunad';
  const [slug, setSlug] = useState(initialSlug);
  const currentProduct = PRODUCTS[slug];

  useEffect(() => {
    if (params.slug && PRODUCTS[params.slug] && params.slug !== slug) {
      setSlug(params.slug);
    }
  }, [params.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen">
      <ProductTemplate key={currentProduct.id} product={currentProduct} />

      <div
        style={{ position: 'sticky', bottom: 0, zIndex: 99999, padding: '16px 0 24px', display: 'flex', justifyContent: 'center', pointerEvents: 'none', background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 60%, transparent 100%)' }}
      >
        <div
          style={{ pointerEvents: 'auto', display: 'flex', gap: '6px', padding: '6px', background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          {Object.values(PRODUCTS).map((p) => (
            <button
              key={p.id}
              onClick={() => setSlug(p.id)}
              className={[
                'px-4 py-2 rounded-lg text-[12px] font-mono font-bold uppercase tracking-[0.14em] transition-all min-h-[44px]',
                slug === p.id ? 'text-white' : 'hover:bg-white/[0.08] text-white/50'
              ].join(' ')}
              style={slug === p.id ? { background: p.accent } : undefined}
            >
              <BrandName name={p.name} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
