import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Menu,
  ShoppingBag,
  X
} from 'lucide-react';

import { gsap } from 'gsap';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import imgCellubiome from '@assets/FRONT_RENDER_TRANSPARENT_1771623631843.png';
import imgCellunad from '@assets/CELLUNAD_1771623812381.png';
import imgCellunova from '@assets/CELLUNAD_CELLUNOVA_1771623812382.png';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS as SELECTOR_PRODUCTS } from './productsData';
import ProtocolSelectorCard from './components/ProtocolSelectorCard';

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------
   Data: Real Age Revive SKUs
------------------------------ */
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
    color: '#6C5CE7',
    image: imgCellubiome,
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
    color: '#19B3A6',
    image: imgCellunad,
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
    color: '#212535',
    image: imgCellunova,
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
  { title: 'Genomic Stability', protocol: 'CELLUNAD+', desc: 'Supports DNA maintenance pathways as part of daily cellular resilience.*' },
  { title: 'Telomere Integrity', protocol: 'CELLUNAD+', desc: 'Supports healthy cellular aging biology through consistent energy support.*' },
  { title: 'Epigenetic Signaling', protocol: 'CELLUBIOME', desc: 'Supports signaling pathways tied to gut-derived metabolites and energy.*' },
  { title: 'Nutrient Sensing', protocol: 'CELLUNOVA', desc: 'Supports cellular maintenance signals through cyclical protocol design.*' },
  { title: 'Mitochondrial Function', protocol: 'CELLUBIOME', desc: 'Supports mitochondrial renewal signaling and energy efficiency.*' },
  { title: 'Cellular Senescence', protocol: 'CELLUNOVA', desc: 'Supports cellular cleanup processes as part of a periodic cycle.*' }
];

/* -----------------------------
   Small helpers
------------------------------ */
const NoiseOverlay = () => (
  <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.045]" aria-hidden="true">
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

const SideSheet = ({ isOpen, onClose, title, children }) => {
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
      <div data-panel className="relative w-full max-w-xl bg-ar-paper h-full shadow-float p-10 md:p-12 overflow-y-auto border-l border-black/5">
        <button onClick={onClose} className="absolute top-7 right-7 z-10 p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Close" data-testid="button-close-sidesheet">
          <X size={22} />
        </button>
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ar-teal">Clinical Archive</p>
            <h3 className="text-3xl md:text-4xl font-sans font-extrabold tracking-[-0.03em] uppercase">{title}</h3>
          </div>

          <div className="text-sm text-black/60 font-medium leading-relaxed space-y-4">
            {children}
          </div>

          <div className="pt-10 border-t border-black/10">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/35 mb-3">Supporting Data</p>
            <ul className="space-y-2 text-[11px] font-mono text-black/45 list-none p-0">
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
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav
      className={[
        'fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[92%] max-w-6xl',
        'transition-all duration-700 rounded-full border px-8 py-4 flex items-center justify-between',
        scrolled ? 'bg-ar-paper/80 backdrop-blur-xl border-black/5 shadow-float' : 'bg-transparent border-white/10'
      ].join(' ')}
    >
      <a href="/" aria-label="Go to homepage">
        <img
          src={brandLogo}
          alt="AGE REVIVE"
          className={['h-8 md:h-9 w-auto transition-all duration-500', scrolled ? '' : 'brightness-0 invert'].join(' ')}
        />
      </a>

      <div className="hidden md:flex items-center gap-10 font-mono font-medium text-[10px] uppercase tracking-[0.2em]">
        {[
          { label: 'Shop', href: '/shop' },
          { label: 'The Axis', href: '#axis' },
          { label: 'Science', href: '#pillars' },
          { label: 'Journal', href: '#journal' }
        ].map((l) => (
          <a key={l.label} href={l.href} className={['transition-all hover:text-ar-teal', scrolled ? 'text-ar-navy/60' : 'text-white/60'].join(' ')}>
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <button className={scrolled ? 'text-ar-navy' : 'text-white'} aria-label="Cart"><ShoppingBag size={20} /></button>
        <button className={scrolled ? 'text-ar-navy' : 'text-white'} aria-label="Menu"><Menu size={20} /></button>
      </div>
    </nav>
  );
};

/* -----------------------------
   Sections
------------------------------ */
const TelemetryTypewriter = () => {
  const [text, setText] = useState('');
  const phrases = useMemo(
    () => [
      'THE_AXIS: ONLINE',
      'MITO_SIGNAL: ACTIVE',
      'NAD_LAYER: STABLE',
      'CYCLE: 7_DAY_RESET',
      'ADHERENCE: LOCKED'
    ],
    []
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let charIdx = 0;
    const t = setInterval(() => {
      setText(phrases[idx].slice(0, charIdx));
      charIdx++;
      if (charIdx > phrases[idx].length + 12) {
        setIdx((prev) => (prev + 1) % phrases.length);
        charIdx = 0;
      }
    }, 75);
    return () => clearInterval(t);
  }, [idx, phrases]);

  return <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.2em]">{text}_</span>;
};

const Hero = ({ onOpenEvidence, onOpenProduct }) => {
  return (
    <section className="relative min-h-[100dvh] flex flex-col md:flex-row overflow-hidden">

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6 pt-32 pb-12">
        <div className="w-full md:w-1/2 space-y-10 hero-text">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-ar-teal" />
              <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.22em]">Protocol Infrastructure</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-sans font-extrabold text-white tracking-[-0.05em] leading-[0.85]">
              Cellular Energy.
              <br />
              Gut Resilience.
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-white/70 font-medium max-w-xl leading-snug">
            Three protocols designed as a system: daily NAD+ support, the gut–mito signaling layer, and a 7-day monthly renewal cadence.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'CELLUNAD+ daily NAD+ support*',
                'CELLUBIOME gut–mito signaling support*',
                'CELLUNOVA 7-day protocol cycle*'
              ].map((o) => (
                <div key={o} className="flex items-center gap-3 text-white/60 text-xs font-mono font-bold uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-ar-teal shrink-0" /> {o}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group relative px-10 py-5 bg-ar-teal text-ar-navy rounded-full font-mono font-bold uppercase text-[10px] tracking-[0.22em] overflow-hidden transition-transform hover:scale-105 active:scale-95">
                <span className="relative z-10">Start Full Protocol</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              <button
                onClick={onOpenEvidence}
                className="px-8 py-5 border border-white/20 text-white rounded-full font-mono font-bold uppercase text-[10px] tracking-[0.22em] hover:bg-white/5 transition-all"
              >
                View Evidence
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4 opacity-70">
              <span className="font-mono text-[10px] text-ar-teal font-bold tracking-[0.14em]">4.9 / 5.0</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-[10px] text-white uppercase font-mono font-bold tracking-[0.22em]">
                "Built like a protocol, not a supplement."
              </span>
            </div>

            <p className="text-[10px] font-mono text-white/35 uppercase tracking-[0.22em]">
              *Structure/function support statements. Not medical advice.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/3 mt-16 md:mt-0 hero-panel">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-sans font-extrabold uppercase tracking-[-0.02em] text-white">Protocol Selector</h3>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.22em]">Select your starting system</p>
            </div>

            <div className="space-y-4">
              {SELECTOR_PRODUCTS.map((p) => (
                <ProtocolSelectorCard key={p.slug} p={p} />
              ))}
            </div>

            <button className="w-full py-5 bg-ar-teal text-ar-navy rounded-full font-mono font-bold uppercase text-[10px] tracking-[0.22em] hover:brightness-110 transition-all">
              Explore The Axis
            </button>

            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.22em]">
              Subscription cadence is selected at checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TheAxis = ({ onOpenEvidence }) => {
  return (
    <section id="axis" className="py-32 bg-ar-paper px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="max-w-2xl reveal">
          <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.22em]">The Foundation</span>
          <h2 className="text-6xl font-sans font-extrabold tracking-[-0.04em] uppercase mt-4">
            The Age Revive
            <br />
            Systems Axis.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
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
            <div key={i} className="space-y-8 reveal group">
              <div className="w-16 h-16 rounded-ar-2xl bg-ar-navy text-ar-paper flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="font-mono text-xs font-bold tracking-[0.14em]">{item.tag}</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-sans font-extrabold uppercase tracking-tight">{item.name}</h3>
                <p className="text-sm font-medium text-black/60 leading-relaxed">{item.desc}</p>
              </div>

              <ul className="space-y-3">
                {item.steps.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-black/45">
                    <div className="w-1.5 h-1.5 rounded-full bg-ar-teal" /> {s}
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenEvidence}
                className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ar-teal flex items-center gap-2 hover:gap-3 transition-all"
              >
                View Evidence <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SixPillars = () => {
  return (
    <section id="pillars" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 reveal">
          <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.22em]">Framework</span>
          <h2 className="text-5xl font-sans font-extrabold tracking-[-0.04em] uppercase">6 Pillars of Systemic Aging</h2>
          <p className="text-sm text-black/55 font-medium max-w-2xl mx-auto">
            A framework for mapping protocols to systems. Not medical advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <div key={p.title} className="reveal group p-10 bg-ar-paper rounded-ar-3xl border border-black/5 hover:border-ar-teal/20 transition-all hover:shadow-float hover:-translate-y-1">
              <div className="space-y-6">
                <h4 className="text-xl font-sans font-extrabold uppercase tracking-tight">{p.title}</h4>
                <p className="text-xs font-medium text-black/45 leading-relaxed min-h-[46px]">{p.desc}</p>
                <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-black/35 uppercase tracking-[0.22em]">Mapped Protocol</span>
                  <span className="text-[10px] font-mono font-bold text-ar-teal uppercase tracking-[0.22em]">{p.protocol}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Journal = () => {
  const posts = [
    { title: 'Mitophagy Signaling', cat: 'System', img: 'https://images.unsplash.com/photo-1579389083395-4507e9f4a171?auto=format&fit=crop&q=80&w=800' },
    { title: 'NAD+ Metabolism', cat: 'Mechanism', img: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=800' },
    { title: 'Autophagy Cadence', cat: 'Protocol', img: 'https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <section id="journal" className="py-32 px-6 bg-ar-paper">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 reveal">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-ar-teal uppercase tracking-[0.22em]">Scientific Literacy</span>
            <h2 className="text-5xl font-sans font-extrabold tracking-[-0.04em] uppercase">The Age Revive Journal.</h2>
          </div>
          <button className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] border-b border-black/20 pb-2 hover:text-ar-teal hover:border-ar-teal transition-all flex items-center gap-2">
            Read the science <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((j) => (
            <div key={j.title} className="reveal group cursor-pointer space-y-6">
              <div className="aspect-[4/5] overflow-hidden rounded-ar-3xl bg-ar-navy">
                <img src={j.img} className="w-full h-full object-cover grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700" alt="" />
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-black/35 uppercase tracking-[0.22em]">{j.cat}</span>
                <h4 className="text-xl font-sans font-extrabold uppercase tracking-tight group-hover:text-ar-teal transition-colors">{j.title}</h4>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-mono text-black/40 uppercase tracking-[0.22em]">
          Editorial placeholders. Replace with real posts when ready.
        </p>
      </div>
    </section>
  );
};

/* -----------------------------
   App
------------------------------ */
export default function Home() {
  const containerRef = useRef(null);
  const [evidencePanel, setEvidencePanel] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      gsap.from('.hero-text', { opacity: 0, x: -50, duration: 1.2, ease: 'power4.out' });
      gsap.from('.hero-panel', { opacity: 0, x: 50, duration: 1.2, ease: 'power4.out', delay: 0.2 });

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          opacity: 0,
          y: 30,
          duration: 0.9,
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
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.04]"
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

      {/* Proof Row */}
      <section className="bg-white border-y border-black/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-x-8 gap-y-4 opacity-60">
          {['3rd Party Testing', 'Standardized Actives', 'Enteric Delivery', 'Quality Controls'].map((p, i) => (
            <div key={p} className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold text-ar-teal tracking-[0.14em]">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-px h-3 bg-black/10" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-black/55 whitespace-nowrap">{p}</span>
            </div>
          ))}
        </div>
      </section>

      <TheAxis onOpenEvidence={() => setEvidencePanel(true)} />

      {/* Signature Micro-UI Bar */}
      <section className="bg-ar-navy py-6 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-ar-teal animate-pulse" />
            <TelemetryTypewriter />
          </div>
          <div className="hidden md:flex gap-12 items-center font-mono text-[9px] text-white/25 uppercase tracking-[0.3em]">
            <span>Latency: 24ms</span>
            <span>Sync: Stable</span>
            <span>Cadence: Locked</span>
          </div>
        </div>
      </section>

      <SixPillars />
      <Journal />

      {/* Final CTA */}
      <section className="py-40 px-6 bg-ar-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1579389083395-4507e9f4a171?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10 reveal">
          <h2 className="text-6xl md:text-8xl font-sans font-extrabold tracking-[-0.05em] uppercase leading-[0.85]">
            Build your baseline.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-12 py-6 bg-ar-teal text-ar-navy rounded-full font-mono font-bold uppercase text-xs tracking-[0.22em] hover:scale-105 transition-all">
              Start Full Protocol
            </button>
            <button className="px-12 py-6 border border-white/20 text-white rounded-full font-mono font-bold uppercase text-xs tracking-[0.22em] hover:bg-white/5 transition-all">
              Build your stack
            </button>
          </div>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.22em]">
            *These statements have not been evaluated by the Food and Drug Administration. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-black/5 bg-ar-paper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <img src={brandLogo} alt="AGE REVIVE" className="h-8 w-auto" />
            <p className="text-[10px] font-mono text-black/40 uppercase tracking-[0.22em] leading-relaxed max-w-xs">
              * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-[0.22em]">Shop</h5>
              <ul className="space-y-2 text-[10px] font-mono font-medium text-black/50 uppercase list-none p-0">
                <li><a href="/shop" className="hover:text-black transition-colors">CELLUBIOME</a></li>
                <li><a href="/shop" className="hover:text-black transition-colors">CELLUNAD+</a></li>
                <li><a href="/shop" className="hover:text-black transition-colors">CELLUNOVA</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-[0.22em]">Info</h5>
              <ul className="space-y-2 text-[10px] font-mono font-medium text-black/50 uppercase list-none p-0">
                <li><a href="#axis" className="hover:text-black transition-colors">The Axis</a></li>
                <li><a href="#journal" className="hover:text-black transition-colors">Journal</a></li>
                <li><a href="#" className="hover:text-black transition-colors">References</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-[0.22em]">Connect</h5>
              <ul className="space-y-2 text-[10px] font-mono font-medium text-black/50 uppercase list-none p-0">
                <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-black transition-colors">X</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[9px] font-mono text-black/30 uppercase tracking-[0.22em]">© 2026 Age Revive</span>
          <div className="flex gap-8 text-[9px] font-mono text-black/30 uppercase tracking-[0.22em]">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Shipping</a>
          </div>
        </div>
      </footer>
      </div>

      {/* Evidence SideSheet */}
      <SideSheet isOpen={evidencePanel} onClose={() => setEvidencePanel(false)} title="Scientific Evidence & Rationale">
        <div className="space-y-6">
          <section className="space-y-2">
            <h4 className="font-sans font-extrabold uppercase tracking-tight text-ar-navy">Designed as a system</h4>
            <p>
              Age Revive protocols are built around standardized actives, defined cadence, and quality controls.
              We keep claims clinically responsible and focus on repeatable execution.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-sans font-extrabold uppercase tracking-tight text-ar-navy">What you will see here</h4>
            <p>
              This panel summarizes protocol intent. Full research references can be linked in the Science section when ready.
            </p>
          </section>

          <div className="p-6 bg-ar-teal/5 border border-ar-teal/10 rounded-ar-2xl">
            <p className="text-sm italic">
              "Science is the substrate. Purity is the standard. Design is the interface."
            </p>
          </div>
        </div>
      </SideSheet>

      {/* Product SideSheet */}
      <SideSheet isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} title={activeProduct?.name || 'Protocol'}>
        {activeProduct && (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">{activeProduct.category}</p>
              <p className="text-xl font-sans font-extrabold uppercase tracking-[-0.02em]">{activeProduct.tagline}</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/40">{activeProduct.serving}</p>
              {activeProduct.warning && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-ar-2xl">
                  <p className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-[0.22em] mb-1">Warning</p>
                  <p className="text-sm font-medium">{activeProduct.warning}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">Key outcomes</p>
              {activeProduct.outcomes.map((o) => (
                <div key={o} className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-ar-teal shrink-0" />
                  <span className="text-black/75">{o}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">Full ingredient panel</p>
              {activeProduct.fullIngredients.map((ing) => (
                <div key={ing.name} className="flex justify-between items-end border-b border-black/10 pb-3 gap-6">
                  <div className="space-y-1">
                    <p className="font-sans font-extrabold text-sm uppercase tracking-[-0.01em]">{ing.name}</p>
                    <p className="text-[10px] font-mono text-black/45 uppercase tracking-[0.22em]">{ing.purpose}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-ar-teal">{ing.dose}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-black/45">Rationale</p>
              {activeProduct.rationale.map((r) => (
                <div key={r.title} className="rounded-ar-2xl bg-white border border-black/5 p-4">
                  <p className="text-xs font-sans font-extrabold uppercase tracking-[0.12em]">{r.title}</p>
                  <p className="mt-2 text-sm text-black/60 font-medium leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-5 bg-ar-navy text-white rounded-full font-mono font-bold uppercase text-[10px] tracking-[0.22em] hover:bg-ar-ink transition-colors flex items-center justify-center gap-2">
              Add to Cart <ArrowRight size={14} />
            </button>

            <p className="text-[10px] font-mono text-black/40 uppercase tracking-[0.22em]">
              *These statements have not been evaluated by the FDA.
            </p>
          </div>
        )}
      </SideSheet>
    </div>
  );
}
