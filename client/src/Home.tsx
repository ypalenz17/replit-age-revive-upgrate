import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  ShoppingBag,
  X
} from 'lucide-react';

import { gsap } from 'gsap';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import imgCellubiome from '@assets/cellubiome_cropped.png';
import imgCellunad from '@assets/cellunad_cropped.png';
import imgCellunova from '@assets/cellunova_cropped.png';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS as SELECTOR_PRODUCTS, BrandName } from './productsData';
import ProtocolSelectorCard from './components/ProtocolSelectorCard';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    slug: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Mitochondrial + Gut Signaling',
    tagline: 'The Gut–Mitochondria Axis, simplified.',
    serving: '2 enteric-coated capsules daily',
    ingredientsBadges: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
    outcomes: [
      'Supports mitophagy signaling*',
      'Supports mitochondrial renewal pathways*',
      'Supports gut-derived short-chain fatty acid signaling*'
    ],
    color: '#19B3A6',
    image: '/images/cellubiome-trimmed.png',
    fullIngredients: [
      { name: 'Urolithin A (≥99%)', dose: '500 mg', purpose: 'Mitophagy support' },
      { name: 'Tributyrin', dose: '500 mg', purpose: 'Butyrate delivery support' }
    ],
    rationale: [
      { title: 'Mitophagy signal support', text: 'Urolithin A supports mitochondrial recycling signaling (mitophagy support).' },
      { title: 'Postbiotic support', text: 'Tributyrin supports short-chain fatty acid activity through butyrate delivery.' },
      { title: 'Enteric precision', text: 'Enteric-coated delivery supports release beyond the upper GI environment.' }
    ]
  },
  {
    slug: 'cellunad',
    name: 'CELLUNAD+',
    category: 'Daily NAD+ Optimization',
    tagline: 'Precision NAD+ support with co-factors, not hype.',
    serving: '2 capsules daily',
    ingredientsBadges: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
    outcomes: [
      'Supports NAD+ metabolism*',
      'Supports mitochondrial energy production*',
      'Supports healthy methylation pathways*'
    ],
    color: '#1e3a8a',
    image: '/images/cellunad-trimmed.png',
    fullIngredients: [
      { name: 'Nicotinamide Riboside (NR)', dose: '500 mg', purpose: 'NAD+ precursor support' },
      { name: 'R-Lipoic Acid', dose: '200 mg', purpose: 'Redox balance support' },
      { name: 'Apigenin', dose: '100 mg', purpose: 'NAD+ pathway support' },
      { name: 'Betaine (TMG)', dose: '250 mg', purpose: 'Methylation support' },
      { name: 'P-5-P (active B6)', dose: '10 mg', purpose: 'Cofactor support' },
      { name: '5-MTHF', dose: '400 mcg DFE', purpose: 'Folate cycle support' },
      { name: 'Methylcobalamin', dose: '1,000 mcg', purpose: 'B12 support' },
      { name: 'BioPerine', dose: '5 mg', purpose: 'Bioavailability support' }
    ],
    rationale: [
      { title: 'Pool support', text: 'NR supports NAD+ pools as a daily input layer.' },
      { title: 'Pathway support', text: 'Apigenin supports NAD+ pathway activity as part of a daily routine.' },
      { title: 'Cofactor alignment', text: 'TMG + methylated B vitamins support methylation pathways.' }
    ]
  },
  {
    slug: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Autophagy + Senolytic Protocol',
    tagline: 'Seven days on. Designed as a cycle, not forever.',
    serving: '5 capsules daily for 7 consecutive days',
    warning: 'Contains wheat (spermidine source).',
    ingredientsBadges: ['Resveratrol 500 mg', 'Quercetin 500 mg', 'EGCG 300 mg', 'PQQ 10 mg'],
    outcomes: [
      'Supports autophagy pathways*',
      'Supports cellular cleanup processes*',
      'Supports oxidative stress defense*'
    ],
    color: '#6C5CE7',
    image: '/images/cellunova-trimmed.png',
    fullIngredients: [
      { name: 'NAC', dose: '600 mg', purpose: 'Glutathione support' },
      { name: 'Trans-Resveratrol', dose: '500 mg', purpose: 'Polyphenol support' },
      { name: 'Quercetin', dose: '500 mg', purpose: 'Cellular maintenance support' },
      { name: 'Fisetin', dose: '100 mg', purpose: 'Cellular maintenance support' },
      { name: 'Green Tea Extract (50% EGCG)', dose: '300 mg', purpose: 'Antioxidant support' },
      { name: 'Spermidine (wheat germ)', dose: '15 mg', purpose: 'Autophagy support' },
      { name: 'Astaxanthin', dose: '4 mg', purpose: 'Oxidative stress defense' },
      { name: 'PQQ', dose: '10 mg', purpose: 'Mitochondrial cofactor support' },
      { name: 'Calcium Alpha-Ketoglutarate', dose: '300 mg', purpose: 'Metabolic support' },
      { name: 'BioPerine', dose: '5 mg', purpose: 'Bioavailability support' }
    ],
    rationale: [
      { title: 'Phase design', text: 'Designed for short, intentional cycles. The off-cycle is part of the protocol.' },
      { title: 'Polyphenol stack', text: 'Resveratrol + Quercetin + EGCG support cellular maintenance pathways.' },
      { title: 'Defense layer', text: 'NAC + Astaxanthin support oxidative stress defense during the cycle.' }
    ]
  }
];

const PILLARS = [
  { title: 'Genomic Stability', what: 'NAD+ fuels enzymes that repair damaged DNA and maintain chromosomal integrity.', why: 'Without daily NAD+ replenishment, repair enzymes slow and mutations accumulate.', protocol: 'CELLUNAD+', slug: 'cellunad', tags: ['NAD+', 'Sirtuins'], accent: '#3B82F6' },
  { title: 'Telomere Integrity', what: 'Telomere-protective pathways preserve the replication fidelity of every cell division.', why: 'Shortened telomeres accelerate biological aging and reduce tissue regeneration.', protocol: 'CELLUNAD+', slug: 'cellunad', tags: ['NR', 'Longevity'], accent: '#3B82F6' },
  { title: 'Epigenetic Signaling', what: 'Gut-derived metabolites like butyrate modulate gene expression across tissues.', why: 'Disrupted gut signaling silences protective genes and amplifies inflammatory ones.', protocol: 'CELLUBIOME', slug: 'cellubiome', tags: ['Methylation', 'Gut Axis'], accent: '#19B3A6' },
  { title: 'Nutrient Sensing', what: 'AMPK and mTOR pathways detect energy status and trigger cellular maintenance.', why: 'Chronically active mTOR suppresses autophagy, letting damaged proteins accumulate.', protocol: 'CELLUNOVA', slug: 'cellunova', tags: ['AMPK', 'mTOR'], accent: '#6C5CE7' },
  { title: 'Mitochondrial Function', what: 'Urolithin A activates mitophagy, clearing damaged mitochondria for new ones.', why: 'Dysfunctional mitochondria leak free radicals, draining cellular energy output.', protocol: 'CELLUBIOME', slug: 'cellubiome', tags: ['Mitophagy', 'ATP'], accent: '#19B3A6' },
  { title: 'Cellular Senescence', what: 'Fisetin-driven senolytic cycles clear zombie cells that secrete inflammatory signals.', why: 'Senescent cell accumulation drives chronic inflammation and tissue breakdown.', protocol: 'CELLUNOVA', slug: 'cellunova', tags: ['Fisetin', 'Senolytic'], accent: '#6C5CE7' }
];

const NoiseOverlay = () => (
  <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.035]" aria-hidden="true">
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

const SideSheet = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: any; children: any }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);

    const ctx = gsap.context(() => {
      const panel = sheetRef.current?.querySelector('[data-panel]');
      const overlay = sheetRef.current?.querySelector('[data-overlay]');
      if (!panel || !overlay) return;
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo(panel, { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
    }, sheetRef);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      ctx.revert();
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={sheetRef} className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true">
      <div data-overlay className="absolute inset-0 bg-ar-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div data-panel className="relative w-full max-w-xl bg-ar-paper h-full shadow-float p-10 md:p-12 overflow-y-auto border-l border-black/5 rounded-l-ar-3xl">
        <button onClick={onClose} className="absolute top-7 right-7 z-10 p-2 rounded-lg hover:bg-black/5 transition-colors" aria-label="Close" data-testid="button-close-sidesheet">
          <X size={22} />
        </button>
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-ar-teal">Clinical Archive</p>
            <h3 className="text-3xl md:text-4xl font-head font-normal tracking-[-0.03em] uppercase">{title}</h3>
          </div>

          <div className="text-sm text-black/60 font-medium leading-relaxed space-y-4">
            {children}
          </div>

          <div className="pt-10 border-t border-black/10">
            <p className="text-[12px] font-mono uppercase tracking-[0.22em] text-black/35 mb-3">Supporting Data</p>
            <ul className="space-y-2 text-[12px] font-mono text-black/45 list-none p-0">
              <li>[01] References available upon request</li>
              <li>[02] Full science library lives in the Science section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
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
    { label: 'Science', href: '/science' },
    { label: 'Quality', href: '/quality' },
    { label: 'FAQ', href: '/faq' }
  ];

  const cartCount = 0;

  return (
    <>
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[150] transition-all duration-500',
          scrolled
            ? 'bg-white/[0.05] backdrop-blur-md border-b border-white/[0.10] shadow-[0_1px_12px_rgba(0,0,0,0.2)]'
            : 'bg-transparent border-b border-white/[0.04]'
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a href="/" aria-label="Go to homepage">
            <img
              src={brandLogo}
              alt="AGE REVIVE"
              className="h-7 md:h-8 w-auto brightness-0 invert transition-opacity duration-500"
            />
          </a>

          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[11px] uppercase tracking-[0.14em]">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-white/55 hover:text-teal-300 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a href="/shop" className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors" aria-label="Cart" data-testid="nav-cart">
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] flex items-center justify-center text-[9px] font-mono font-bold rounded-sm leading-none text-teal-300 border border-teal-300/40 bg-white/[0.04]">
                {cartCount}
              </span>
            </a>

            <button
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[140] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 pt-16 pb-6 px-6 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.08]">
            <div className="flex flex-col gap-0">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 min-h-[44px] flex items-center text-[13px] font-mono font-bold uppercase tracking-[0.10em] text-white/70 hover:text-teal-300 transition-colors border-b border-white/[0.05] last:border-0"
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
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
};

const Hero = ({ onOpenEvidence, onOpenProduct }) => {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">

      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[min(95vw,650px)] h-[min(95vw,650px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(8,12,26,0.9)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col justify-center text-center px-5 md:px-6 pt-20 md:pt-36 pb-6 md:pb-12 min-h-[100dvh]">
        <div className="flex flex-col hero-text w-full items-center">

          <div className="flex flex-col items-center md:items-start md:pl-[3%]">
            <div className="flex items-center gap-2 justify-center mb-3">
              <div className="h-px w-4 bg-white/10" />
              <span className="font-mono text-[10px] text-ar-teal/75 uppercase tracking-[0.10em]">Protocol-Grade Supplements</span>
              <div className="h-px w-4 bg-white/10" />
            </div>
            <h1 className="font-head font-normal text-white tracking-[-0.04em] leading-[0.88] uppercase" style={{ fontSize: 'clamp(38px, 9.5vw, 56px)' }}>
              Cellular Energy.
              <br />
              <span className="text-white/70">Gut Resilience.</span>
            </h1>
          </div>

          <p className="mt-5 md:mt-6 text-[14px] md:text-[16px] text-white/75 font-sans font-medium max-w-[32ch] md:max-w-[42ch] leading-[1.5] mx-auto md:ml-[3%] md:mr-auto md:text-left">
            Three protocol-grade supplements built as one system: daily <span className="text-white/95">NAD+</span>, daily <span className="text-white/95">gut-mito</span> signaling, and a <span className="text-white/95">7-day</span> monthly reset.
          </p>

          <div className="mt-5 flex flex-col items-center gap-0" data-testid="proof-bar">
            <div className="w-10 h-px bg-white/10 mb-3" />
            <div className="flex flex-col items-center gap-[2px] leading-snug">
              <span className="text-[11px] sm:text-[12px] text-white/80 uppercase tracking-[0.08em] font-mono">Bioavailability First</span>
              <span className="text-[11px] sm:text-[12px] text-white/80 uppercase tracking-[0.08em] font-mono">Standardized Actives</span>
              <span className="text-[11px] sm:text-[12px] text-white/80 uppercase tracking-[0.08em] font-mono">Clinical Doses</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-2 w-full max-w-[340px] mx-auto sm:w-auto sm:max-w-none md:justify-center">
            <a href="/shop" className="group relative w-full sm:w-auto px-7 min-h-[40px] flex items-center justify-center bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.10em] overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 12px rgba(45,212,191,0.15)' }} data-testid="button-shop-system">
              <span className="relative z-10">Shop the System</span>
              <div className="absolute inset-0 bg-white/12 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>

            <button
              onClick={onOpenEvidence}
              className="w-full sm:w-auto px-7 min-h-[40px] text-white/50 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.10em] hover:bg-white/[0.03] hover:text-white/75 transition-all"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
              data-testid="button-view-evidence"
            >
              View Evidence
            </button>
          </div>

          <p className="mt-2 text-[11px] text-white/40 font-sans tracking-normal">Start with the bundle or choose a protocol.</p>
        </div>
      </div>
    </section>
  );
};

const TheAxis = ({ onOpenEvidence }) => {
  return (
    <section id="axis" className="relative py-12 md:py-20 px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(25,179,166,0.04) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-8 md:mb-14 reveal-stagger">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-ar-teal" />
            <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.22em]">The Foundation</span>
            <div className="h-[1px] w-12 bg-ar-teal" />
          </div>
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}>
            Age Revive
            <br />
            <span className="text-white/50">Systems Axis.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Gut–Mito Axis',
              tag: 'GMA',
              desc: 'Postbiotic signaling and mitochondrial renewal support designed for daily repeatability.',
              steps: ['Enteric delivery', 'Barrier support', 'Mitophagy signaling']
            },
            {
              name: 'NAD+ Infrastructure',
              tag: 'NAD',
              desc: 'Daily NAD+ precursor support with co-factors for consistent pathway support.',
              steps: ['NAD+ pools', 'Redox support', 'Methylation support']
            },
            {
              name: 'Autophagy Pulse',
              tag: 'APC',
              desc: 'A 7-day cyclical protocol designed to support cellular cleanup processes and resilience.',
              steps: ['Short cycle', 'Defense layer', 'Return to base']
            }
          ].map((item, i) => (
            <div key={i} className="reveal-stagger group relative overflow-hidden rounded-ar-xl border border-white/[0.10] hover:border-white/[0.18] transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] group-hover:from-white/[0.12] group-hover:via-white/[0.06] group-hover:to-white/[0.03] transition-all duration-500" />
              <div className="absolute inset-0 backdrop-blur-2xl" />
              <div className="absolute inset-0 shadow-card-edge pointer-events-none" />
              <div className="relative z-10 p-8 space-y-6">
              <div className="w-14 h-14 rounded-ar-lg bg-ar-teal/10 border border-ar-teal/20 text-ar-teal flex items-center justify-center group-hover:scale-110 group-hover:bg-ar-teal/15 transition-all duration-500">
                <span className="font-mono text-xs font-bold tracking-[0.14em]">{item.tag}</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-head font-normal uppercase tracking-tight text-white group-hover:text-ar-teal transition-colors duration-300">{item.name}</h3>
                <p className="text-sm font-medium text-white/60 leading-relaxed">{item.desc}</p>
              </div>

              <ul className="space-y-2.5">
                {item.steps.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-[12px] font-mono font-bold uppercase tracking-[0.18em] text-white/55">
                    <div className="w-1.5 h-1.5 rounded-full bg-ar-teal" /> {s}
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenEvidence}
                className="text-[12px] font-mono font-bold uppercase tracking-[0.18em] text-ar-teal flex items-center gap-2 hover:gap-3 transition-all pt-3 border-t border-white/[0.08] w-full min-h-[44px]"
              >
                View Evidence <ArrowRight size={14} />
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SixPillars = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="pillars" className="relative py-12 md:py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(108,92,231,0.04) 0%, transparent 70%)' }} />
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-10 reveal-stagger">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-ar-teal" />
            <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.18em]">Framework</span>
            <div className="h-[1px] w-12 bg-ar-teal" />
          </div>
          <h2 className="text-4xl md:text-5xl font-head font-normal tracking-[-0.04em] uppercase text-white">6 Pillars of Systemic Aging</h2>
          <p className="text-sm text-white/55 font-medium max-w-xl mx-auto mt-3">
            A framework for mapping protocols to systems. Not medical advice.
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-8">
          {PILLARS.map((_, i) => (
            <button
              key={i}
              onClick={() => setOpenIdx(i)}
              className={[
                'w-8 h-1.5 rounded-sm transition-all duration-300',
                i === openIdx ? 'bg-ar-teal' : 'bg-white/15 hover:bg-white/25'
              ].join(' ')}
              aria-label={`Pillar ${i + 1}`}
              data-testid={`pillar-dot-${i}`}
            />
          ))}
          <span className="ml-3 font-mono text-[12px] text-white/50 tracking-[0.1em]">{openIdx + 1}/6</span>
        </div>

        <div className="space-y-2">
          {PILLARS.map((p, i) => {
            const isOpen = i === openIdx;
            return (
              <div
                key={p.title}
                className={[
                  'relative overflow-hidden rounded-ar-xl border transition-all duration-400',
                  isOpen ? 'border-white/[0.15] bg-white/[0.06]' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]'
                ].join(' ')}
                data-testid={`pillar-${i}`}
              >
                {isOpen && <div className="absolute inset-0 shadow-card-edge pointer-events-none" />}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`, opacity: isOpen ? 1 : 0 }}
                />

                <button
                  onClick={() => setOpenIdx(i)}
                  className="w-full flex items-center gap-4 px-5 py-4 min-h-[56px] text-left"
                  data-testid={`pillar-toggle-${i}`}
                >
                  <span className="font-mono text-[12px] font-bold tracking-[0.15em] shrink-0" style={{ color: isOpen ? p.accent : `${p.accent}55` }}>0{i + 1}</span>
                  <h4 className={['text-base md:text-lg font-head font-normal uppercase tracking-[-0.01em] leading-tight flex-1 transition-colors duration-300', isOpen ? 'text-white' : 'text-white/60'].join(' ')}>{p.title}</h4>
                  <ChevronDown size={18} className={['text-white/40 shrink-0 transition-transform duration-300', isOpen ? 'rotate-180' : ''].join(' ')} />
                </button>

                <div
                  className="overflow-hidden transition-all duration-400 ease-out"
                  style={{ maxHeight: isOpen ? '400px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-5 pb-5 space-y-4">
                    <div className="space-y-3 pl-9">
                      <div>
                        <p className="font-mono text-[12px] text-white/50 uppercase tracking-[0.12em] mb-1">What it is</p>
                        <p className="text-sm text-white/75 font-medium leading-relaxed">{p.what}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[12px] text-white/50 uppercase tracking-[0.12em] mb-1">Why it matters</p>
                        <p className="text-sm text-white/75 font-medium leading-relaxed">{p.why}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pl-9 pt-3 border-t border-white/[0.06]">
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map(tag => (
                          <span key={tag} className="text-[12px] font-mono uppercase tracking-[0.1em] px-3 py-1.5 rounded-md border bg-white/[0.04]" style={{ borderColor: `${p.accent}30`, color: `${p.accent}CC` }}>{tag}</span>
                        ))}
                      </div>
                      <a
                        href={`/product/${p.slug}`}
                        className="flex items-center gap-1.5 text-[12px] font-mono font-bold uppercase tracking-[0.12em] min-h-[44px] px-3 transition-colors hover:brightness-125"
                        style={{ color: p.accent }}
                        data-testid={`pillar-link-${p.slug}`}
                      >
                        {p.protocol} <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


export default function Home() {
  const containerRef = useRef(null);
  const [evidencePanel, setEvidencePanel] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      gsap.from('.hero-text', { opacity: 0, y: 20, duration: 1, ease: 'power3.out' });

      gsap.utils.toArray('.reveal-stagger').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%' },
          opacity: 0,
          y: 16,
          duration: 0.8,
          delay: i * 0.06,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          opacity: 0,
          y: 16,
          duration: 0.8,
          ease: 'power3.out'
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const productBySlug = useMemo(() => Object.fromEntries(PRODUCTS.map((p) => [p.slug, p])), []);

  return (
    <div ref={containerRef} className="relative bg-[#0f172a] selection:bg-ar-teal selection:text-white">
      <div className="fixed inset-0 z-0 bg-[#0f172a]">
        <img
          src="https://images.unsplash.com/photo-1614850523296-e8c041de4398?auto=format&fit=crop&q=80&w=2400"
          className="w-full h-full object-cover grayscale opacity-30 mix-blend-screen"
          alt=""
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

      <Hero
        onOpenEvidence={() => setEvidencePanel(true)}
        onOpenProduct={(slug) => setActiveProduct(productBySlug[slug])}
      />

      {/* Protocol Selector */}
      <section className="relative pt-8 pb-12 md:pt-12 md:pb-20 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(30,58,138,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-8 md:mb-14 reveal-stagger">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-ar-teal" />
              <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.22em]">Select Your Protocol</span>
              <div className="h-[1px] w-12 bg-ar-teal" />
            </div>
            <h2 className="text-4xl md:text-5xl font-head font-normal text-white tracking-[-0.04em] uppercase leading-tight">
              The System
            </h2>
            <p className="text-sm text-white/50 font-mono uppercase tracking-[0.12em] mt-3">Choose your starting point</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-0 sm:gap-y-6">
              {SELECTOR_PRODUCTS.map((p, i) => (
                <div key={p.slug}>
                  <ProtocolSelectorCard p={p} />
                  {i < SELECTOR_PRODUCTS.length - 1 && (
                    <div className="flex justify-center py-6 sm:hidden">
                      <div className="w-[60%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-3 mt-8 md:mt-12 px-1">
            {['3rd Party Testing', 'Standardized Actives', 'Enteric Delivery', 'Quality Controls'].map((p, i) => (
              <div key={p} className="flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 overflow-hidden">
                <span className="text-[12px] font-medium text-teal-300/90 tabular-nums shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="w-px h-4 bg-white/15 shrink-0" />
                <span className="text-[12px] tracking-[0.08em] uppercase text-white/70 leading-none truncate">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>

      <TheAxis onOpenEvidence={() => setEvidencePanel(true)} />

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>

      <SixPillars />

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>

      {/* Final CTA */}
      <section className="relative py-14 md:py-24 px-6 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(25,179,166,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative z-10 reveal">
          <h2 className="font-head font-normal tracking-[-0.05em] uppercase leading-[0.85]" style={{ fontSize: 'clamp(2.5rem, 9vw, 5.5rem)' }}>
            Build your
            <br />
            <span className="text-white/55">baseline.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-[420px] mx-auto sm:w-auto sm:max-w-none">
            <a href="/shop" className="w-full sm:w-auto px-10 py-4 min-h-[48px] flex items-center justify-center bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.18em] hover:scale-[1.02] transition-all" data-testid="button-cta-shop-system">
              Shop the System
            </a>
            <a href="/shop" className="w-full sm:w-auto px-10 py-4 min-h-[48px] flex items-center justify-center border border-white/20 text-white rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.18em] hover:bg-white/5 hover:border-white/30 transition-all" data-testid="button-cta-build-stack">
              Build your stack
            </a>
          </div>
          <p className="text-sm text-white/60 tracking-normal mt-2">Start with the bundle or choose a protocol.</p>
        </div>
      </section>

      <Footer />
      </div>

      {/* Evidence SideSheet */}
      <SideSheet isOpen={evidencePanel} onClose={() => setEvidencePanel(false)} title="Scientific Evidence & Rationale">
        <div className="space-y-6">
          <section className="space-y-2">
            <h4 className="font-head font-normal uppercase tracking-tight text-ar-navy">Designed as a system</h4>
            <p>
              Age Revive protocols are built around standardized actives, defined cadence, and quality controls.
              We keep claims clinically responsible and focus on repeatable execution.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-head font-normal uppercase tracking-tight text-ar-navy">What you will see here</h4>
            <p>
              This panel summarizes protocol intent. Full research references can be linked in the Science section when ready.
            </p>
          </section>

          <div className="p-6 bg-ar-teal/5 border border-ar-teal/10 rounded-ar-xl">
            <p className="text-sm italic">
              "Science is the substrate. Purity is the standard. Design is the interface."
            </p>
          </div>
        </div>
      </SideSheet>

      {/* Product SideSheet */}
      <SideSheet isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} title={activeProduct ? <BrandName name={activeProduct.name} /> : 'Protocol'}>
        {activeProduct && (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-black/45">{activeProduct.category}</p>
              <p className="text-xl font-sans font-extrabold uppercase tracking-[-0.02em]">{activeProduct.tagline}</p>
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-black/40">{activeProduct.serving}</p>
              {activeProduct.warning && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-ar-xl">
                  <p className="text-[12px] font-mono font-bold text-red-600 uppercase tracking-[0.18em] mb-1">Warning</p>
                  <p className="text-sm font-medium">{activeProduct.warning}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-black/45">Key outcomes</p>
              {activeProduct.outcomes.map((o) => (
                <div key={o} className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-ar-teal shrink-0" />
                  <span className="text-black/75">{o}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-black/45">Full ingredient panel</p>
              {activeProduct.fullIngredients.map((ing) => (
                <div key={ing.name} className="flex justify-between items-end border-b border-black/10 pb-3 gap-6">
                  <div className="space-y-1">
                    <p className="font-sans font-extrabold text-sm uppercase tracking-[-0.01em]">{ing.name}</p>
                    <p className="text-[12px] font-mono text-black/50 uppercase tracking-[0.18em]">{ing.purpose}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-ar-teal">{ing.dose}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-black/45">Rationale</p>
              {activeProduct.rationale.map((r) => (
                <div key={r.title} className="rounded-ar-xl bg-white border border-black/5 p-4">
                  <p className="text-xs font-sans font-extrabold uppercase tracking-[0.12em]">{r.title}</p>
                  <p className="mt-2 text-sm text-black/60 font-medium leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-5 min-h-[48px] bg-ar-navy text-white rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.18em] hover:bg-ar-ink transition-colors flex items-center justify-center gap-2" data-testid="button-add-to-cart">
              Add to Cart <ArrowRight size={14} />
            </button>

            <p className="text-[12px] font-mono text-black/45 uppercase tracking-[0.18em]">
              *These statements have not been evaluated by the FDA.
            </p>
          </div>
        )}
      </SideSheet>
    </div>
  );
}
