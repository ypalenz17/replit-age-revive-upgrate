import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  X,
} from 'lucide-react';

import { gsap } from 'gsap';
import SiteNavbar from './components/SiteNavbar';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandName } from './productsData';
import Footer from './components/Footer';
import { useCart } from './cartStore';
import { PRODUCT_DETAIL_DATA } from './productData';

gsap.registerPlugin(ScrollTrigger);

const BASE_DARK = '#0A1220';
const SECONDARY_DARK = '#101B2D';
const LIGHT_CLINICAL = '#F4F1EA';
const CARD_DARK = '#162235';

const PRODUCTS = [
  {
    slug: 'cellunad',
    name: 'CELLUNAD+',
    category: 'Daily NAD+ Foundation',
    role: 'Best place to start',
    bestFor: '500 mg NR with methylation and mitochondrial co-factors.',
    cadence: '2 capsules daily',
    price: '$79.99',
    subPrice: '$67.99/mo',
    tagline: 'Precision NAD+ support with methylation co-factors. Every dose disclosed.',
    serving: '2 capsules daily',
    ingredientsBadges: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
    outcomes: [
      'Supports NAD+ metabolism*',
      'Supports mitochondrial energy production*',
      'Supports healthy methylation pathways*'
    ],
    color: '#1e3a8a',
    textColor: '#60a5fa',
    image: '/images/cellunad-render.png',
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
    slug: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Daily Gut-Mito Support',
    role: 'Best if gut support is the priority',
    bestFor: 'Urolithin A plus enteric tributyrin for gut-barrier and mitochondrial support.',
    cadence: '2 enteric-coated capsules daily',
    price: '$110.00',
    subPrice: '$93.50/mo',
    tagline: 'Urolithin A + Tributyrin. Two ingredients, one gut-mitochondria axis.',
    serving: '2 enteric-coated capsules daily',
    ingredientsBadges: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
    outcomes: [
      'Supports mitophagy signaling*',
      'Supports mitochondrial renewal pathways*',
      'Supports gut-derived short-chain fatty acid signaling*'
    ],
    color: '#19B3A6',
    textColor: '#5eead4',
    image: '/images/cellubiome-render.png',
    fullIngredients: [
      { name: 'Urolithin A (>=99%)', dose: '500 mg', purpose: 'Mitophagy support' },
      { name: 'Tributyrin', dose: '500 mg', purpose: 'Butyrate delivery support' }
    ],
    rationale: [
      { title: 'Mitophagy signal support', text: 'Urolithin A supports mitochondrial recycling signaling (mitophagy support).' },
      { title: 'Postbiotic support', text: 'Tributyrin supports short-chain fatty acid activity through butyrate delivery.' },
      { title: 'Enteric precision', text: 'Enteric-coated delivery supports release beyond the upper GI environment.' }
    ]
  },
  {
    slug: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Monthly Protocol',
    role: 'Add as a periodic layer',
    bestFor: 'Periodic support for autophagy-related pathways and mitochondrial resilience.',
    cadence: '7-day monthly cycle',
    price: '$49.99',
    subPrice: '$42.49/mo',
    tagline: 'Ten compounds. Seven days on. The off-cycle is part of the design.',
    serving: '5 capsules daily · 7-day cycle',
    warning: 'Contains wheat (spermidine source).',
    ingredientsBadges: ['10 Compounds', 'Periodic Protocol', 'Fully Disclosed'],
    outcomes: [
      'Supports autophagy pathways*',
      'Supports autophagy-related cellular maintenance pathways*',
      'Supports oxidative stress defense*'
    ],
    color: '#6C5CE7',
    textColor: '#a78bfa',
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
type HomeProduct = (typeof PRODUCTS)[number];

const TRUST_POINTS = [
  { num: '01', title: 'Transparent Doses', desc: 'Every ingredient and its exact amount listed on the label. No hidden proprietary blends.' },
  { num: '02', title: 'Third-Party Tested', desc: 'Independent lab verification for purity, potency, and heavy metals on every batch.' },
  { num: '03', title: 'Clinically Studied Ingredients', desc: 'Standardized actives backed by published research, dosed at effective levels.' },
  { num: '04', title: 'CoA Available by Lot', desc: 'Certificate of Analysis available for every production lot, on request.' },
  { num: '05', title: 'Glass Packaging', desc: 'UV-protected glass bottles. No plastic leaching. Better ingredient preservation.' },
  { num: '06', title: 'Shipping Included', desc: 'Every order ships free. Price on the label is the price you pay.' },
];

const HOME_FAQS = [
  { q: 'Where should I start?', a: 'Most customers start with CELLUNAD+, our daily NAD+ protocol. It provides foundational cellular energy support that pairs well with any lifestyle. You can add CELLUBIOME or CELLUNOVA later as your system grows.' },
  { q: 'How long until I notice a difference?', a: 'Individual timelines vary. Many customers report noticing changes in energy and recovery within 2-4 weeks of consistent daily use. Cellular-level support builds over time -- we recommend at least 8 weeks for a meaningful assessment.' },
  { q: 'Are there any proprietary blends?', a: 'No. Every ingredient and its exact dose is listed on the label and on our website. We believe transparency is non-negotiable in supplement formulation.' },
  { q: 'Can I take all three products together?', a: 'Yes. The three protocols are designed to work as a system. CELLUNAD+ and CELLUBIOME are taken daily. CELLUNOVA is a 7-day monthly cycle. There are no overlapping ingredients at concerning levels.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return window on unopened products. If you have questions about whether a protocol is right for you, our support team is available to help before you order.' },
];

const SectionDivider = ({ bg }: { bg: string }) => (
  <div style={{ backgroundColor: bg }}>
    <div className="max-w-5xl mx-auto px-5 md:px-8">
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
    </div>
  </div>
);

const LightDivider = () => (
  <div style={{ backgroundColor: LIGHT_CLINICAL }}>
    <div className="max-w-5xl mx-auto px-5 md:px-8">
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(10,18,32,0.06), transparent)' }} />
    </div>
  </div>
);

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ar-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

const SideSheet = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode }) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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
      <div data-overlay className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div data-panel className="relative w-full max-w-xl bg-[#F8F6F1] h-full p-8 md:p-12 overflow-y-auto border-l border-black/5" style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}>
        <button onClick={onClose} className={`absolute top-5 right-5 z-10 p-3 rounded-lg hover:bg-black/5 transition-colors ${focusRing}`} aria-label="Close" data-testid="button-close-sidesheet">
          <X size={20} />
        </button>
        <div className="space-y-8 pt-2">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ar-teal">Clinical Archive</p>
            <h3 className="text-2xl md:text-3xl font-head font-normal tracking-[-0.03em] uppercase text-[#0A1220]">{title}</h3>
          </div>
          <div className="text-[14px] text-[#0A1220]/60 font-medium leading-relaxed space-y-4">
            {children}
          </div>
          <div className="pt-8 border-t border-black/8">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-black/30 mb-3">Supporting Data</p>
            <ul className="space-y-2 text-[11px] font-mono text-black/40 list-none p-0">
              <li>[01] References available upon request</li>
              <li>[02] Full science library in the Science section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


const Hero = () => {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative min-h-[100dvh] lg:min-h-[72vh] flex flex-col overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
      <video
        autoPlay loop muted playsInline
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 hidden md:block transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        src="/images/hero_video_cropped.mp4"
        preload="auto"
      />
      <video
        autoPlay loop muted playsInline
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 md:hidden transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        src="/images/hero_video_portrait.mp4"
        preload="auto"
      />
      <div className="absolute inset-0 z-[1] pointer-events-none hidden md:block" style={{ background: `linear-gradient(180deg, ${BASE_DARK}dd 0%, ${BASE_DARK}44 30%, ${BASE_DARK}66 60%, ${BASE_DARK}aa 80%, ${BASE_DARK} 100%)` }} />
      <div className="absolute inset-0 z-[1] pointer-events-none md:hidden" style={{ background: `linear-gradient(180deg, ${BASE_DARK}cc 0%, ${BASE_DARK}77 25%, ${BASE_DARK}99 55%, ${BASE_DARK}dd 75%, ${BASE_DARK} 100%)` }} />

      <div className="relative z-10 w-full max-w-3xl lg:max-w-6xl mx-auto flex flex-col justify-center text-center lg:text-left px-6 md:px-8 lg:px-12 pt-24 md:pt-40 lg:pt-36 pb-12 md:pb-20 lg:pb-20 min-h-[100dvh] lg:min-h-[72vh]">
        <div className="flex flex-col hero-text w-full items-center lg:items-start">

          <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.16em] mb-4 md:mb-5">Three fully disclosed formulas. One system.</span>

          <h1 className="font-head font-normal text-white tracking-[-0.04em] leading-[0.88] uppercase" style={{ fontSize: 'clamp(34px, 8.5vw, 68px)' }}>
            Daily NAD+. Gut resilience.
            <br />
            <span className="text-white/55">One smarter longevity system.</span>
          </h1>

          <p className="mt-5 md:mt-7 text-[15px] md:text-[17px] text-white/65 font-sans font-normal max-w-[40ch] leading-[1.6] mx-auto lg:mx-0">
            Start with CELLUNAD+, add CELLUBIOME, and layer in CELLUNOVA as a 7-day monthly protocol.
          </p>

          <div className="mt-7 lg:mt-9 flex flex-col sm:flex-row gap-3 w-full max-w-[360px] sm:max-w-none mx-auto lg:mx-0">
            <a
              href="/shop"
              className={`group relative w-full sm:w-auto px-9 lg:px-11 min-h-[48px] lg:min-h-[52px] flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] ${focusRing}`}
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(45,212,191,0.2), 0 0 20px rgba(45,212,191,0.08)' }}
              data-testid="button-shop-system"
            >
              <span className="relative z-10">Shop the System</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
            <a
              href="/science"
              className={`w-full sm:w-auto px-7 min-h-[48px] lg:min-h-[52px] flex items-center justify-center text-white/50 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] hover:text-white/75 transition-all border border-white/[0.10] hover:border-white/[0.20] ${focusRing}`}
              data-testid="button-explore-science"
            >
              Explore the Science
            </a>
          </div>

          <div className="mt-10 lg:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-0 gap-y-2" data-testid="hero-trust-strip">
            {['Full dose disclosure', 'No proprietary blends', 'Third-party tested', 'Lot traceability'].map((item, i) => (
              <span key={item} className="flex items-center">
                <span className="text-[10px] md:text-[11px] text-white/40 uppercase tracking-[0.10em] font-mono whitespace-nowrap">{item}</span>
                {i < 3 && <span className="w-px h-[10px] bg-white/12 mx-3 md:mx-4 shrink-0" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const TrustSection = () => (
  <section className="relative py-[80px] md:py-[110px] lg:py-[72px] px-6 md:px-8" style={{ backgroundColor: SECONDARY_DARK }}>
    <div className="max-w-5xl lg:max-w-6xl mx-auto">
      <div className="text-center mb-12 md:mb-16 lg:mb-12 reveal-stagger">
        <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">Why Age Revive</span>
        <h2 className="mt-4 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)' }}>
          Built on transparency,
          <br className="hidden sm:block" />
          <span className="text-white/45"> not marketing claims.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {TRUST_POINTS.map((tp) => (
          <div
            key={tp.num}
            className="reveal-stagger rounded-lg px-5 py-5 md:px-6 md:py-6 lg:px-5 lg:py-5 relative overflow-hidden"
            style={{ backgroundColor: CARD_DARK, border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(45,212,191,0.15), transparent 90%)' }} />
            <span className="font-mono text-[10px] font-bold text-ar-teal/60 tracking-[0.12em]">{tp.num}</span>
            <h3 className="mt-2.5 text-[14px] font-sans font-semibold text-white/90 tracking-[-0.01em] leading-snug">{tp.title}</h3>
            <p className="mt-2 text-[13px] font-sans text-white/45 leading-[1.6]">{tp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const ProductSystemSection = ({ onOpenProduct }: { onOpenProduct: (slug: string) => void }) => {
  const cart = useCart();

  const handleAdd = (product: HomeProduct) => {
    const detailData = PRODUCT_DETAIL_DATA[product.slug as keyof typeof PRODUCT_DETAIL_DATA];
    if (!detailData) return;
    cart.addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: detailData.priceOneTime,
      isSubscribe: false,
    });
  };

  return (
    <section className="relative py-[80px] md:py-[120px] lg:py-[80px] px-6 md:px-8" style={{ backgroundColor: LIGHT_CLINICAL }}>
      <div className="max-w-5xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 lg:mb-12 reveal-stagger">
          <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">The System</span>
          <h2 className="mt-4 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', color: BASE_DARK }}>
            Choose your starting point.
          </h2>
          <p className="mt-4 text-[14px] md:text-[15px] font-sans text-[#0A1220]/50 max-w-[42ch] mx-auto leading-[1.6]">
            Three protocols that work independently or together. Most customers start with CELLUNAD+.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7 items-start">
          {PRODUCTS.map((p) => (
            <div
              key={p.slug}
              className="reveal-stagger group relative rounded-xl overflow-hidden bg-white flex flex-col transition-shadow duration-300 hover:shadow-lg"
              style={{ border: '1px solid rgba(10,18,32,0.07)', boxShadow: '0 1px 2px rgba(10,18,32,0.04), 0 4px 20px rgba(10,18,32,0.04)' }}
            >
              {p.slug === 'cellunad' && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: '#19B3A6', boxShadow: '0 2px 8px rgba(25,179,166,0.25)' }}>
                  Start Here
                </div>
              )}

              <div className="relative flex items-center justify-center py-10 lg:py-7 px-8" style={{ background: `linear-gradient(180deg, #ece9e1 0%, #f7f5f0 50%, #ffffff 100%)` }}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-[150px] md:h-[170px] lg:h-[150px] w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 8px 16px rgba(10,18,32,0.08))' }}
                  loading="lazy"
                />
              </div>

              <div className="flex-1 flex flex-col px-5 pb-6 pt-5 md:px-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#0A1220]/35">{p.category}</span>
                <h3 className="mt-1.5 text-[18px] md:text-[20px] font-head font-normal uppercase tracking-[-0.02em] text-[#0A1220]">
                  <BrandName name={p.name} />
                </h3>
                <p className="mt-2 text-[13px] font-sans text-[#0A1220]/50 leading-[1.55]">{p.bestFor}</p>

                <div className="mt-5 pt-4 border-t border-[#0A1220]/[0.06]">
                  <div className="grid grid-cols-2 gap-y-1">
                    <div>
                      <span className="font-mono uppercase tracking-[0.10em] text-[#0A1220]/30 text-[9px] block">Cadence</span>
                      <span className="font-sans text-[12px] text-[#0A1220]/65 mt-0.5 block leading-snug">{p.cadence}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono uppercase tracking-[0.10em] text-[#0A1220]/30 text-[9px] block">Price</span>
                      <span className="font-sans font-bold text-[15px] text-[#0A1220] mt-0.5 block">{p.price}</span>
                    </div>
                  </div>
                  <div className="text-right mt-0.5">
                    <span className="font-mono text-ar-teal text-[10px] uppercase tracking-[0.08em]">{p.subPrice} with subscription</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.ingredientsBadges.slice(0, 3).map((badge) => (
                    <span key={badge} className="text-[9px] font-mono uppercase tracking-[0.06em] px-2 py-1 rounded-md text-[#0A1220]/50" style={{ backgroundColor: 'rgba(10,18,32,0.04)', border: '1px solid rgba(10,18,32,0.05)' }}>{badge}</span>
                  ))}
                </div>

                <div className="mt-auto pt-6 flex flex-col gap-2.5">
                  <button
                    onClick={() => handleAdd(p)}
                    className={`w-full min-h-[46px] flex items-center justify-center gap-2 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] transition-all duration-200 bg-ar-teal text-[#0A1220] hover:brightness-110 active:scale-[0.98] ${focusRing}`}
                    style={{ boxShadow: '0 1px 3px rgba(45,212,191,0.2)' }}
                    data-testid={`button-add-${p.slug}`}
                  >
                    Add to Cart <ShoppingBag size={14} />
                  </button>
                  <button
                    onClick={() => onOpenProduct(p.slug)}
                    className={`w-full min-h-[42px] flex items-center justify-center gap-1.5 rounded-lg font-mono font-bold uppercase text-[10px] tracking-[0.10em] text-[#0A1220]/45 hover:text-[#0A1220]/75 transition-all duration-200 border border-[#0A1220]/[0.08] hover:border-[#0A1220]/[0.18] hover:bg-[#0A1220]/[0.02] ${focusRing}`}
                    data-testid={`button-view-${p.slug}`}
                  >
                    View Full Protocol <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const ScienceSection = () => {
  const axes = [
    {
      tag: '01',
      name: 'NAD+ Infrastructure',
      protocol: 'CELLUNAD+',
      slug: 'cellunad',
      desc: 'NAD+ declines with age. NR, a clinically studied precursor, supports daily NAD+ replenishment alongside essential methylation cofactors.',
      accentColor: '#60a5fa',
    },
    {
      tag: '02',
      name: 'Gut-Mitochondria Axis',
      protocol: 'CELLUBIOME',
      slug: 'cellubiome',
      desc: 'Urolithin A supports mitochondrial recycling (mitophagy). Tributyrin delivers butyrate to support gut barrier integrity and signaling.',
      accentColor: '#2dd4bf',
    },
    {
      tag: '03',
      name: 'Autophagy Activation',
      protocol: 'CELLUNOVA',
      slug: 'cellunova',
      desc: 'A 7-day monthly cycle of polyphenols and senescence-research compounds designed to support autophagy pathways, then step back. The off-period is part of the protocol.',
      accentColor: '#a78bfa',
    },
  ];

  return (
    <section className="relative py-[80px] md:py-[120px] lg:py-[72px] px-6 md:px-8" style={{ backgroundColor: SECONDARY_DARK }}>
      <div className="max-w-5xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 lg:mb-10 reveal-stagger">
          <span className="font-mono text-[10px] md:text-[11px] text-ar-teal/80 uppercase tracking-[0.20em]">The Science</span>
          <h2 className="mt-4 font-head font-normal tracking-[-0.03em] uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)' }}>
            Three biological axes.
            <br className="hidden sm:block" />
            <span className="text-white/45"> One coordinated system.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
          {axes.map((axis) => (
            <div
              key={axis.tag}
              className="reveal-stagger rounded-lg px-5 py-6 md:px-6 md:py-7 flex flex-col relative overflow-hidden"
              style={{ backgroundColor: CARD_DARK, border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent 5%, ${axis.accentColor}40, transparent 95%)` }} />
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] font-bold tracking-[0.12em]" style={{ color: axis.accentColor }}>{axis.tag}</span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${axis.accentColor}15, transparent)` }} />
              </div>
              <h3 className="text-[15px] md:text-[16px] font-head font-normal uppercase tracking-[-0.01em] text-white/90">{axis.name}</h3>
              <p className="mt-2.5 text-[13px] font-sans text-white/45 leading-[1.6] flex-1">{axis.desc}</p>
              <a
                href={`/product/${axis.slug}`}
                className={`mt-5 self-start flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.12em] transition-all duration-200 hover:gap-2.5 ${focusRing} rounded px-1 -mx-1`}
                style={{ color: axis.accentColor }}
                data-testid={`science-link-${axis.slug}`}
              >
                {axis.protocol} <ArrowRight size={10} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center reveal">
          <a
            href="/science"
            className={`inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-white/35 hover:text-white/60 transition-all duration-200 border border-white/[0.08] hover:border-white/[0.16] rounded-lg px-7 py-3 min-h-[44px] ${focusRing}`}
            data-testid="link-explore-science"
          >
            Explore the Science <ArrowRight size={11} />
          </a>
        </div>
      </div>
    </section>
  );
};


const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-[80px] md:py-[120px] lg:py-[72px] px-6 md:px-8" style={{ backgroundColor: LIGHT_CLINICAL }}>
      <div className="max-w-2xl lg:max-w-6xl mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:items-start">
          <div className="text-center lg:text-left mb-12 md:mb-16 lg:mb-0 lg:sticky lg:top-32 reveal-stagger">
            <span className="font-mono text-[10px] md:text-[11px] text-ar-teal uppercase tracking-[0.20em]">Common Questions</span>
            <h2 className="mt-4 font-head font-normal tracking-[-0.03em] uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', color: BASE_DARK }}>
              Before you begin.
            </h2>
            <div className="hidden lg:flex flex-col gap-5 mt-10">
              <a
                href="/faq"
                className={`text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#0A1220]/40 hover:text-[#0A1220]/70 transition-colors flex items-center gap-2 min-h-[44px] ${focusRing} rounded px-2`}
                data-testid="link-full-faq-desktop"
              >
                View all questions <ArrowRight size={11} />
              </a>
              <a
                href="/quality"
                className={`text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#0A1220]/40 hover:text-[#0A1220]/70 transition-colors flex items-center gap-2 min-h-[44px] ${focusRing} rounded px-2`}
                data-testid="link-quality-desktop"
              >
                Quality standards <ArrowRight size={11} />
              </a>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'rgba(10,18,32,0.08)' }}>
            {HOME_FAQS.map((faq, i) => (
              <div
                key={i}
                className="reveal-stagger border-b"
                style={{ borderColor: 'rgba(10,18,32,0.08)' }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full flex items-center justify-between py-5 md:py-6 text-left gap-6 min-h-[60px] ${focusRing} rounded`}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="text-[14px] md:text-[16px] font-sans font-semibold text-[#0A1220]/80 leading-snug">{faq.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[#0A1220]/25 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openIndex === i ? '400px' : '0', opacity: openIndex === i ? 1 : 0 }}
                >
                  <p className="pb-6 text-[14px] md:text-[15px] font-sans text-[#0A1220]/50 leading-[1.65] pr-10">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 reveal lg:hidden">
          <a
            href="/faq"
            className={`text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#0A1220]/40 hover:text-[#0A1220]/70 transition-colors flex items-center gap-2 min-h-[44px] ${focusRing} rounded px-2`}
            data-testid="link-full-faq"
          >
            View all questions <ArrowRight size={11} />
          </a>
          <span className="hidden sm:block w-px h-4 bg-[#0A1220]/10" />
          <a
            href="/quality"
            className={`text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#0A1220]/40 hover:text-[#0A1220]/70 transition-colors flex items-center gap-2 min-h-[44px] ${focusRing} rounded px-2`}
            data-testid="link-quality"
          >
            Quality standards <ArrowRight size={11} />
          </a>
        </div>
      </div>
    </section>
  );
};


const FinalCTA = () => (
  <section className="relative py-[88px] md:py-[120px] lg:py-[56px] px-6 md:px-8 text-white overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,212,191,0.03) 0%, transparent 70%)` }} />
    <div className="max-w-2xl mx-auto text-center relative z-10 reveal">
      <span className="font-mono text-[10px] text-ar-teal/60 uppercase tracking-[0.20em]">Get Started</span>
      <h2 className="mt-4 font-head font-normal tracking-[-0.04em] uppercase text-white leading-[0.92]" style={{ fontSize: 'clamp(1.7rem, 5.5vw, 3rem)' }}>
        Your system starts
        <br />
        <span className="text-white/35">with one protocol.</span>
      </h2>
      <p className="mt-5 text-[14px] md:text-[15px] font-sans text-white/40 max-w-[36ch] mx-auto leading-[1.6]">
        Most customers begin with CELLUNAD+. Add protocols as your routine evolves.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/shop"
          className={`group relative px-10 min-h-[50px] flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform ${focusRing}`}
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(45,212,191,0.2), 0 0 24px rgba(45,212,191,0.08)' }}
          data-testid="button-cta-shop-system"
        >
          <span className="relative z-10">Shop the System</span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </a>
        <a
          href="/shop"
          className={`text-[10px] font-mono uppercase tracking-[0.10em] text-white/35 hover:text-white/60 transition-colors inline-flex items-center gap-1.5 min-h-[44px] ${focusRing} rounded px-3`}
          data-testid="button-cta-explore"
        >
          Explore individual protocols <ArrowRight size={10} />
        </a>
      </div>
    </div>
  </section>
);


export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [evidencePanel, setEvidencePanel] = useState(false);
  const [activeProduct, setActiveProduct] = useState<HomeProduct | null>(null);
  const cart = useCart();

  useEffect(() => {
    if (!containerRef.current) return;
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.hero-text', { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' });

      gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          opacity: 0, y: 20, duration: 0.9, ease: 'power3.out'
        });
      });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          opacity: 0, y: 20, duration: 0.9, ease: 'power3.out'
        });
      });
    }, containerRef);

    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const productBySlug = useMemo<Record<string, HomeProduct>>(
    () => Object.fromEntries(PRODUCTS.map((p) => [p.slug, p])),
    [],
  );

  const addActiveProductToCart = () => {
    if (!activeProduct) return;
    const detailData = PRODUCT_DETAIL_DATA[activeProduct.slug as keyof typeof PRODUCT_DETAIL_DATA];
    if (!detailData) return;
    cart.addItem({
      slug: activeProduct.slug,
      name: activeProduct.name,
      image: activeProduct.image,
      price: detailData.priceSubscribe,
      isSubscribe: true,
      frequency: activeProduct.slug === 'cellunova' ? '7-day cycle' : 'Delivered monthly',
    });
  };

  return (
    <div ref={containerRef} className="relative selection:bg-ar-teal selection:text-white" style={{ backgroundColor: BASE_DARK }}>
      <SiteNavbar />

      <Hero />

      <TrustSection />

      <ProductSystemSection onOpenProduct={(slug: string) => setActiveProduct(productBySlug[slug] ?? null)} />

      <ScienceSection />

      <FaqSection />

      <LightDivider />

      <FinalCTA />

      <div style={{ backgroundColor: BASE_DARK }}>
        <Footer />
      </div>

      <SideSheet isOpen={evidencePanel} onClose={() => setEvidencePanel(false)} title="Scientific Evidence & Rationale">
        <div className="space-y-6">
          <section className="space-y-2">
            <h4 className="font-head font-normal uppercase tracking-tight text-[#0A1220]">Designed as a system</h4>
            <p>
              Age Revive protocols are built around standardized actives, defined cadence, and quality controls.
              We keep claims clinically responsible and focus on repeatable execution.
            </p>
          </section>
          <section className="space-y-2">
            <h4 className="font-head font-normal uppercase tracking-tight text-[#0A1220]">What you will see here</h4>
            <p>
              This panel summarizes protocol intent. Full research references live in the Science section.
            </p>
          </section>
        </div>
      </SideSheet>

      <SideSheet isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} title={activeProduct ? <BrandName name={activeProduct.name} /> : 'Protocol'}>
        {activeProduct && (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.20em] text-[#0A1220]/40">{activeProduct.category}</p>
              <p className="text-lg md:text-xl font-sans font-bold uppercase tracking-[-0.02em] text-[#0A1220]">{activeProduct.tagline}</p>
              <p className="text-[11px] font-mono uppercase tracking-[0.20em] text-[#0A1220]/35">{activeProduct.serving}</p>
              {activeProduct.warning && (
                <div className="p-4 bg-red-50 border border-red-200/50 rounded-lg mt-3">
                  <p className="text-[10px] font-mono font-bold text-red-600/80 uppercase tracking-[0.18em] mb-1">Allergen Notice</p>
                  <p className="text-[13px] font-medium text-red-700/70">{activeProduct.warning}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.20em] text-[#0A1220]/40">Key outcomes</p>
              {activeProduct.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-3 text-[13px] md:text-[14px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-ar-teal shrink-0 mt-1.5" />
                  <span className="text-[#0A1220]/65 leading-snug">{o}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.20em] text-[#0A1220]/40">Full ingredient panel</p>
              {activeProduct.fullIngredients.map((ing) => (
                <div key={ing.name} className="flex justify-between items-end border-b border-[#0A1220]/8 pb-3 gap-4">
                  <div className="space-y-0.5">
                    <p className="font-sans font-bold text-[13px] uppercase tracking-[-0.01em] text-[#0A1220]/80">{ing.name}</p>
                    <p className="text-[10px] font-mono text-[#0A1220]/40 uppercase tracking-[0.16em]">{ing.purpose}</p>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-ar-teal shrink-0">{ing.dose}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-[0.20em] text-[#0A1220]/40">Rationale</p>
              {activeProduct.rationale.map((r) => (
                <div key={r.title} className="rounded-lg bg-[#F4F1EA] border border-[#0A1220]/5 p-4">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-[#0A1220]/60">{r.title}</p>
                  <p className="mt-1.5 text-[13px] text-[#0A1220]/55 font-normal leading-[1.6]">{r.text}</p>
                </div>
              ))}
            </div>

            <button onClick={addActiveProductToCart} className={`w-full min-h-[52px] bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.16em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${focusRing}`} style={{ boxShadow: '0 2px 8px rgba(45,212,191,0.2)' }} data-testid="button-add-to-cart">
              Add to Cart <ArrowRight size={14} />
            </button>

            <p className="text-[10px] font-mono text-[#0A1220]/35 uppercase tracking-[0.18em] text-center">
              *These statements have not been evaluated by the FDA.
            </p>
          </div>
        )}
      </SideSheet>
    </div>
  );
}
