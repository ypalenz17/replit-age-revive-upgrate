import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
  Activity,
  Clock,
  FlaskConical,
  Menu,
  ShoppingBag,
  Star,
  Info,
  X
} from 'lucide-react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

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
    category: 'Daily NAD+ Optimization Formula',
    tagline: 'Daily NAD+ support, engineered for consistency.',
    description:
      'A molecular-grade daily protocol that supports NAD+ metabolism with redox and methylation cofactors. Built to feel precise, not noisy.',
    price: '$92.00',
    serving: '2 capsules daily',
    accent: '#1e3a8a',
    heroImage:
      'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=2200',
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
      { title: 'NAD+ Pool Support', text: 'NR supports NAD+ pools as a daily input layer.' },
      { title: 'Redox Balance', text: 'R-Lipoic Acid supports mitochondrial redox balance for steady output.' },
      { title: 'Cofactor Alignment', text: 'Methylation cofactors support metabolic efficiency and daily consistency.' }
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
    heroImage:
      'https://images.unsplash.com/photo-1628595308665-ad528919623e?auto=format&fit=crop&q=80&w=2200',
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
      { title: 'Recycling Signal', text: 'Urolithin A supports mitochondrial recycling signaling (mitophagy support).' },
      { title: 'Postbiotic Support', text: 'Tributyrin supports short-chain fatty acid activity through butyrate delivery.' },
      { title: 'Enteric Precision', text: 'Enteric-coated delivery supports release beyond the upper GI environment.' }
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
    heroImage:
      'https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&q=80&w=2200',
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
      { title: 'Phase Design', text: 'Designed for 7-day bursts to support cellular maintenance pathways intentionally.' },
      { title: 'Polyphenol Stack', text: 'A focused blend of polyphenols and antioxidants for short-cycle intensity.' },
      { title: 'Off-Cycle Matters', text: 'The off-cycle is part of the protocol. This is a cadence, not a constant.' }
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
    <div className="hidden md:block fixed inset-0 pointer-events-none z-[90] opacity-[0.045]" aria-hidden="true">
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
    <div className="font-mono text-[11px] uppercase tracking-[0.22em] flex items-center gap-2">
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
    <div className="bg-ar-navy rounded-ar-4xl p-8 md:p-10 shadow-float border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ background: `radial-gradient(800px 500px at 80% 0%, ${hexToRgba(accent, 0.6)}, transparent 60%)` }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: accent }} />
            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.14em] text-white/50">Full Dose Disclosure</span>
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-[0.14em]" style={{ color: accent }}>{ingredients.length} Actives</span>
        </div>

        <div className="space-y-0">
          {ingredients.map((ing, i) => (
            <div key={i} className="group">
              <div className="flex items-baseline justify-between py-3 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white/90 leading-tight truncate">{ing.name}</p>
                  <p className="text-[10px] font-mono text-white/30 mt-0.5 uppercase tracking-[0.08em]">{ing.purpose}</p>
                </div>
                <span className="text-[13px] font-mono font-bold shrink-0" style={{ color: accent }}>{ing.dose}</span>
              </div>
              {i < ingredients.length - 1 && <div className="h-px bg-white/[0.06]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustStats({ product }) {
  const stats = [
    { value: String(product.ingredients.length), label: 'Standardized Actives' },
    { value: 'Full', label: 'Dose Disclosure' },
    { value: '3rd', label: 'Party Tested' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white border border-black/5 rounded-2xl p-4 text-center flex flex-col items-center justify-center min-h-[88px]">
          <p className="text-lg font-extrabold tracking-tight text-ar-navy whitespace-nowrap">{stat.value}</p>
          <p className="text-[9px] font-mono font-medium uppercase tracking-[0.1em] text-black/35 mt-1 whitespace-nowrap">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 54);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={[
        'fixed top-6 left-1/2 -translate-x-1/2 z-[80] w-[92%] max-w-5xl',
        'rounded-full border px-6 py-3 flex items-center justify-between',
        'transition-all duration-500',
        scrolled ? 'bg-ar-paper/80 backdrop-blur-md border-black/5 shadow-soft' : 'bg-transparent border-white/10'
      ].join(' ')}
      aria-label="Primary navigation"
    >
      <img
        src={brandLogo}
        alt="AGE REVIVE"
        className={['h-8 md:h-9 w-auto transition-all duration-500', scrolled ? '' : 'brightness-0 invert'].join(' ')}
      />

      <div className="hidden md:flex items-center gap-8 font-mono font-medium text-[11px] tracking-[0.14em] uppercase">
        {['Infrastructure', 'Protocols', 'Rationale', 'Journal'].map((link) => (
          <a
            key={link}
            href="#"
            className={[
              'transition-colors',
              scrolled ? 'text-black/55 hover:text-black' : 'text-white/55 hover:text-white',
              'hover:text-[color:var(--accent)]'
            ].join(' ')}
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className={['p-2 rounded-full transition-colors', scrolled ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'].join(' ')} aria-label="Bag">
          <ShoppingBag size={20} />
        </button>
        <button className={['md:hidden p-2 rounded-full transition-colors', scrolled ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'].join(' ')} aria-label="Menu">
          <Menu size={20} />
        </button>
      </div>
    </nav>
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
      <div data-overlay className="absolute inset-0 bg-ar-navy/45 backdrop-blur-sm" onClick={onClose} />
      <div data-panel className="relative w-full max-w-md bg-ar-paper h-full shadow-float p-10 md:p-12 overflow-y-auto border-l border-black/5">
        <button onClick={onClose} className="absolute top-7 right-7 p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Close panel">
          <X />
        </button>

        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-medium uppercase tracking-[0.14em] text-black/40">Overlay</p>
            <h3 className="text-3xl font-sans font-extrabold tracking-[-0.03em] uppercase">{title}</h3>
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

      gsap.to('.hero-bg', {
        scale: 1.08,
        y: 60,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

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
    <main ref={containerRef} style={{ '--accent': product.accent, '--accentGlow': accentGlow }} className="bg-ar-paper text-ar-navy">
      <NoiseOverlay />
      <Navbar />

      {/* Hero */}
      <section className="hero relative min-h-[100dvh] flex flex-col md:flex-row bg-ar-navy overflow-hidden">
        <div className="absolute inset-0">
          <img src={product.heroImage} className="hero-bg w-full h-full object-cover opacity-60 grayscale-[35%]" alt="" decoding="async" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-ar-navy via-ar-navy/35 to-transparent" />
          <div className="absolute inset-0 opacity-[0.25]" style={{ background: 'radial-gradient(900px 600px at 20% 85%, var(--accentGlow), transparent 60%)' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row px-6 md:px-12 pt-32 pb-12 items-end">
          <div className="w-full md:w-3/5 mb-12 md:mb-0 hero-content text-white">
            <div className="flex flex-wrap items-center gap-3 mb-7">
              <span className="px-3 py-1 border border-white/18 rounded-full text-[10px] uppercase font-mono tracking-[0.22em] text-[color:var(--accent)]">In Stock</span>

              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-[color:var(--accent)]" fill="currentColor" stroke="none" />
                ))}
                <span className="text-[10px] font-mono opacity-55 ml-1">4.9</span>
              </div>

              <span className="hidden sm:inline text-[10px] font-mono text-white/35 uppercase tracking-[0.22em]">
                Clinical boutique. Organic tech luxury.
              </span>
            </div>

            <h1 className="text-[clamp(3.25rem,7vw,6.5rem)] font-sans font-extrabold tracking-[-0.05em] mb-4 leading-[0.88]">{product.name}</h1>

            <p className="text-lg md:text-2xl font-medium text-white/80 max-w-xl mb-8 leading-tight">{product.tagline}</p>

            <div className="flex flex-wrap gap-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.22em]">Protocol</p>
                <p className="text-sm font-semibold tracking-[0.12em] uppercase">{product.serving}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.22em]">System Target</p>
                <p className="text-sm font-semibold tracking-[0.12em] uppercase">{product.category}</p>
              </div>
            </div>

            <div className="mt-10 inline-flex items-center gap-3 text-white/45">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em]">Scroll</span>
              <div className="w-10 h-[1px] bg-white/20" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em]">Protocol</span>
            </div>
          </div>

          <div className="w-full md:w-2/5 md:pl-12 buy-panel">
            <div className="bg-ar-paper p-8 md:p-10 rounded-ar-4xl shadow-float space-y-8 border border-black/5 relative overflow-hidden" style={{ boxShadow: `0 40px 110px -65px ${hexToRgba(product.accent, 0.55)}` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'var(--accent)' }} />

              <div className="space-y-2">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-2xl font-sans font-extrabold tracking-[-0.03em] uppercase">{product.name}</h3>
                  <span className="text-xl font-semibold">{product.price}</span>
                </div>
                <p className="text-sm text-black/55 leading-relaxed font-medium">{product.description}</p>
              </div>

              {product.warnings && (
                <div className="rounded-ar-2xl bg-black/[0.03] border border-black/5 p-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">Note</p>
                  <p className="text-sm font-semibold">{product.warnings}</p>
                </div>
              )}

              <div className="space-y-3">
                {product.outcomes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-semibold tracking-tight">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: hexToRgba(product.accent, 0.12), color: product.accent }}>
                      <Check size={12} />
                    </div>
                    <span className="text-black/80">{item}</span>
                  </div>
                ))}
              </div>

              <MagneticButton
                className="w-full py-5 bg-ar-navy text-ar-paper rounded-full font-mono font-bold tracking-[0.14em] text-xs uppercase flex items-center justify-center gap-3 active:scale-[0.99] transition-transform relative overflow-hidden group"
                onClick={() => {}}
              >
                <span className="relative z-10">Add to Protocol Archive</span>
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" style={{ background: 'var(--accent)' }} />
                <ArrowRight size={16} className="relative z-10" />
              </MagneticButton>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveSidePanel('rationale')} className="py-3 border border-black/10 rounded-full text-[10px] uppercase font-mono font-bold tracking-[0.14em] hover:bg-black/[0.03] transition-colors flex items-center justify-center gap-2">
                  <FlaskConical size={12} /> Evidence
                </button>
                <button onClick={() => setActiveSidePanel('ingredients')} className="py-3 border border-black/10 rounded-full text-[10px] uppercase font-mono font-bold tracking-[0.14em] hover:bg-black/[0.03] transition-colors flex items-center justify-center gap-2">
                  <Info size={12} /> Ingredients
                </button>
              </div>

              <p className="text-[10px] font-mono text-black/40 leading-relaxed uppercase tracking-[0.22em]">
                Subscription cadence is selected at checkout, not here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* De-risk Strip */}
      <section className="bg-white border-y border-black/5 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
          {[
            { Icon: ShieldCheck, text: '3rd Party Tested' },
            { Icon: Zap, text: 'Standardized Actives' },
            { Icon: Clock, text: 'Protocol Cadence' },
            { Icon: Activity, text: 'Quality Controls' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <item.Icon className="text-[color:var(--accent)] group-hover:scale-110 transition-transform shrink-0" size={18} />
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-black/40 whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-5 space-y-8 reveal md:sticky md:top-32">
            <TypewriterTelemetry phrases={product.telemetry} />
            <h2 className="text-5xl font-sans font-extrabold tracking-[-0.04em] leading-[1.06]">
              Every dose, <span className="italic text-[color:var(--accent)]">fully disclosed</span>.
            </h2>
            <p className="text-lg text-black/60 leading-relaxed font-medium">
              No proprietary blends. No hidden fillers. Each active is standardized, dosed at clinical-range levels, and listed with its exact purpose.
            </p>

            <TrustStats product={product} />

            <div className="pt-2">
              <p className="text-[10px] font-mono text-black/30 uppercase tracking-[0.14em] leading-relaxed">
                Certificate of Analysis available on request. All actives independently verified.
              </p>
            </div>
          </div>

          <div className="md:col-span-7 reveal">
            <IngredientPanel ingredients={product.ingredients} accent={product.accent} />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4 reveal">
            <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-[color:var(--accent)]">Protocol Arc</span>
            <h2 className="text-5xl font-sans font-extrabold tracking-[-0.04em]">What to expect over time</h2>
            <p className="text-sm text-black/55 font-medium max-w-2xl mx-auto">This is a support protocol. Individual responses vary. Consistency is the point.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {product.timeline.map((step, i) => (
              <div key={i} className="relative group reveal">
                <div className="timeline-card p-8 rounded-ar-2xl bg-ar-paper border border-black/5 transition-all duration-300 hover:shadow-soft hover:-translate-y-1">
                  <p className="text-[10px] font-mono text-[color:var(--accent)] mb-2 uppercase tracking-[0.22em]">{step.time}</p>
                  <h4 className="text-xl font-sans font-extrabold mb-3 tracking-[-0.02em]">{step.label}</h4>
                  <p className="text-xs text-black/55 leading-relaxed font-medium mb-6">{step.desc}</p>

                  <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${(i + 1) * 25}%`, background: 'var(--accent)' }} />
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] font-mono font-medium uppercase text-black/40 tracking-[0.18em]">{step.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanistic Rationale Archive */}
      <section className="bg-ar-navy py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center text-white mb-20 space-y-4 reveal">
            <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-[color:var(--accent)]">Mechanistic Layering</span>
            <h2 className="text-5xl font-sans font-extrabold tracking-[-0.04em]">Rationale, simplified</h2>
            <p className="text-sm text-white/55 font-medium max-w-2xl mx-auto">Clear intent. Clean inputs. Built to be scanned, not worshipped.</p>
          </div>

          {product.mechanics.map((item, i) => {
            const ArchiveIcon = i === 0 ? Zap : i === 1 ? Activity : ShieldCheck;
            return (
              <div key={i} className="archive-card w-full bg-ar-paper rounded-ar-4xl p-10 md:p-20 shadow-float flex flex-col justify-center items-center text-center overflow-hidden border border-black/5 relative">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                  <svg width="100%" height="100%">
                    <pattern id={`p-${product.id}-${i}`} x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#p-${product.id}-${i})`} />
                  </svg>
                </div>

                <div className="absolute inset-0 pointer-events-none opacity-[0.22]">
                  <div className="absolute top-[20%] left-0 right-0 h-[1px] animate-scan-x" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
                </div>

                <div className="relative z-10 max-w-xl space-y-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: hexToRgba(product.accent, 0.12), color: product.accent }}>
                    <ArchiveIcon size={40} />
                  </div>

                  <h3 className="text-4xl font-sans font-extrabold tracking-[-0.03em] uppercase leading-none">{item.title}</h3>

                  <p className="text-xl font-medium text-black/60 leading-relaxed italic">“{item.text}”</p>

                  <div className="pt-8 flex justify-center gap-4">
                    <div className="px-6 py-2 border border-black/10 rounded-full text-[10px] font-mono font-medium uppercase tracking-[0.14em]">Protocol intent</div>
                    <div className="px-6 py-2 rounded-full text-[10px] font-mono font-medium uppercase tracking-[0.14em] border" style={{ borderColor: hexToRgba(product.accent, 0.28), color: product.accent }}>
                      Clean inputs
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ + Disclaimer */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-sans font-extrabold tracking-[-0.03em] mb-16 text-center">Protocol Inquiries</h2>

        <div className="space-y-4 mb-24">
          {[
            { q: 'Is this protocol suitable for sensitive routines?', a: 'Start with the labeled serving. For sensitive systems, take with food and keep other variables stable for the first week.' },
            { q: 'How is this different from basic supplement stacks?', a: 'Age Revive is designed as infrastructure: standardized inputs, defined cadence, and clean intent. No noisy kitchen-sink blends.' },
            { q: 'Can I stack these products together?', a: 'They are designed to layer across different support systems. If you are unsure, start with one base product and add one layer at a time.' }
          ].map((faq, i) => (
            <details key={i} className="group bg-white border border-black/5 rounded-ar-2xl p-6 cursor-pointer hover:bg-black/[0.02] transition-colors">
              <summary className="list-none flex justify-between items-center font-sans font-extrabold tracking-[0.08em] uppercase text-sm">
                {faq.q}
                <ChevronDown className="group-open:rotate-180 transition-transform text-black/30" />
              </summary>
              <p className="mt-4 text-sm text-black/60 leading-relaxed font-medium">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="bg-ar-navy p-12 rounded-ar-4xl text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.18]" style={{ background: 'radial-gradient(900px 700px at 50% -10%, var(--accentGlow), transparent 60%)' }} />
          <p className="relative z-10 text-[10px] font-mono text-white/45 leading-relaxed uppercase tracking-[0.22em] max-w-2xl mx-auto">
            * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>

          <div className="relative z-10 flex justify-center gap-12 border-t border-white/10 pt-8">
            <div className="text-white">
              <p className="text-lg font-sans font-extrabold">100%</p>
              <p className="text-[10px] font-mono text-white/45 uppercase tracking-[0.22em]">Money-Back Guarantee</p>
            </div>
            <div className="text-white">
              <p className="text-lg font-sans font-extrabold">Priority</p>
              <p className="text-[10px] font-mono text-white/45 uppercase tracking-[0.22em]">Worldwide Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 pb-28 md:py-20 border-t border-black/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <img src={brandLogo} alt="AGE REVIVE" className="h-8 w-auto" />

          <div className="flex gap-12 text-[10px] font-mono font-medium uppercase tracking-[0.14em] text-black/40">
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Quality</a>
            <a href="#" className="hover:text-black transition-colors">Scientific Advisory</a>
          </div>

          <div className="text-[10px] font-mono text-black/40 uppercase tracking-[0.22em]">© 2026 AGE REVIVE</div>
        </div>
      </footer>

      {/* Side Sheets */}
      <SideSheet open={activeSidePanel === 'ingredients'} title="Full Ingredient Panel" onClose={() => setActiveSidePanel(null)}>
        <div className="space-y-6">
          {product.ingredients.map((ing, i) => (
            <div key={i} className="flex justify-between items-baseline border-b border-black/5 pb-4 gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-sans font-extrabold text-sm tracking-[-0.01em] uppercase">{ing.name}</p>
                <p className="text-[10px] font-mono text-black/45 uppercase tracking-[0.14em] leading-relaxed">{ing.purpose}</p>
              </div>
              <span className="font-mono text-sm font-extrabold whitespace-nowrap shrink-0" style={{ color: product.accent }}>{ing.dose}</span>
            </div>
          ))}
        </div>

        {product.warnings && (
          <div className="mt-10 p-6 bg-red-500/5 border border-red-500/10 rounded-ar-2xl">
            <p className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-[0.14em] mb-1">Warning</p>
            <p className="text-sm font-semibold">{product.warnings}</p>
          </div>
        )}
      </SideSheet>

      <SideSheet open={activeSidePanel === 'rationale'} title="Evidence Overlay" onClose={() => setActiveSidePanel(null)}>
        <div className="space-y-8">
          {product.mechanics.map((mech, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-bold" style={{ background: hexToRgba(product.accent, 0.12), color: product.accent }}>
                  {i + 1}
                </div>
                <h4 className="font-sans font-extrabold uppercase tracking-[0.12em]">{mech.title}</h4>
              </div>
              <p className="text-sm text-black/65 leading-relaxed font-medium pl-11">{mech.text}</p>
            </div>
          ))}

          <div className="pt-8 border-t border-black/5">
            <p className="text-xs text-black/45 italic leading-relaxed">Rationale summarizes peer-reviewed research directions. It is not medical advice.</p>
          </div>
        </div>
      </SideSheet>
    </main>
  );
}

/* -----------------------------
   App Shell + Product Switcher
------------------------------ */
export default function App() {
  const [slug, setSlug] = useState('cellunad');
  const currentProduct = PRODUCTS[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen">
      <div className="fixed bottom-6 left-6 z-[85] flex gap-2 p-2 bg-white/80 backdrop-blur rounded-full shadow-soft border border-black/5">
        {Object.values(PRODUCTS).map((p) => (
          <button
            key={p.id}
            onClick={() => setSlug(p.id)}
            className={[
              'px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.14em] transition-all',
              slug === p.id ? 'text-white' : 'hover:bg-black/5 text-ar-navy'
            ].join(' ')}
            style={slug === p.id ? { background: p.accent } : undefined}
          >
            {p.name}
          </button>
        ))}
      </div>

      <ProductTemplate key={currentProduct.id} product={currentProduct} />
    </div>
  );
}
