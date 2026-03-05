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
    category: 'Daily NAD+ Optimization',
    role: 'Best starting point',
    bestFor: 'Cellular energy and DNA maintenance',
    cadence: '2 capsules daily',
    price: '$79.99',
    subPrice: '$67.99/mo',
    tagline: 'Precision NAD+ support with co-factors, not hype.',
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
    category: 'Mitochondrial + Gut Signaling',
    role: 'Gut-mito axis support',
    bestFor: 'Mitochondrial renewal and gut barrier integrity',
    cadence: '2 enteric-coated capsules daily',
    price: '$110.00',
    subPrice: '$93.50/mo',
    tagline: 'The Gut-Mitochondria Axis, simplified.',
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
    category: '7-Day Autophagy + Senolytic Protocol',
    role: 'Monthly cellular reset',
    bestFor: 'Deep cellular cleanup and renewal',
    cadence: '5 capsules daily for 7 days (monthly)',
    price: '$49.99',
    subPrice: '$42.49/mo',
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
  { num: '01', title: 'Transparent Doses', desc: 'Every ingredient and amount listed. No hidden proprietary blends.' },
  { num: '02', title: 'Third-Party Tested', desc: 'Independent lab verification for purity, potency, and heavy metals.' },
  { num: '03', title: 'Clinically Studied Ingredients', desc: 'Standardized actives with published research at effective doses.' },
  { num: '04', title: 'CoA Available by Lot', desc: 'Certificate of Analysis available for every production lot on request.' },
  { num: '05', title: 'Glass Packaging', desc: 'UV-protected glass bottles. No plastic leaching. Better preservation.' },
  { num: '06', title: 'Free Shipping Included', desc: 'Every order ships free. No hidden fees at checkout.' },
];

const HOME_FAQS = [
  { q: 'Where should I start?', a: 'Most customers start with CELLUNAD+, our daily NAD+ protocol. It provides foundational cellular energy support that pairs well with any lifestyle. You can add CELLUBIOME or CELLUNOVA later as your system grows.' },
  { q: 'How long until I feel a difference?', a: 'Individual timelines vary. Many customers report noticing changes in energy and recovery within 2-4 weeks of consistent daily use. Cellular-level support builds over time, so we recommend at least 8 weeks for a meaningful assessment.' },
  { q: 'Are there any proprietary blends?', a: 'No. Every ingredient and its exact dose is listed on the label and on our website. We believe transparency is non-negotiable in supplement formulation.' },
  { q: 'Can I take all three products together?', a: 'Yes. The three protocols are designed to work as a system. CELLUNAD+ and CELLUBIOME are taken daily. CELLUNOVA is a 7-day monthly cycle. There are no overlapping ingredients at concerning levels.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return window on unopened products. If you have questions about whether a protocol is right for you, our support team is available to help before you purchase.' },
];

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
      <div data-panel className="relative w-full max-w-xl bg-[#F8F6F1] h-full shadow-float p-10 md:p-12 overflow-y-auto border-l border-black/5 rounded-l-2xl">
        <button onClick={onClose} className="absolute top-7 right-7 z-10 p-2 rounded-lg hover:bg-black/5 transition-colors" aria-label="Close" data-testid="button-close-sidesheet">
          <X size={22} />
        </button>
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-ar-teal">Clinical Archive</p>
            <h3 className="text-3xl md:text-4xl font-head font-normal tracking-[-0.03em] uppercase text-[#0A1220]">{title}</h3>
          </div>
          <div className="text-sm text-[#0A1220]/60 font-medium leading-relaxed space-y-4">
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


const Hero = ({ onOpenEvidence }: { onOpenEvidence: () => void }) => {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 hidden md:block transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        src="/images/hero_video_cropped.mp4"
        preload="auto"
      />
      <video
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 md:hidden transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        src="/images/hero_video_portrait.mp4"
        preload="auto"
      />
      <div className="absolute inset-0 z-[1] pointer-events-none hidden md:block" style={{ background: `linear-gradient(180deg, ${BASE_DARK}cc 0%, ${BASE_DARK}55 40%, ${BASE_DARK}99 80%, ${BASE_DARK} 100%)` }} />
      <div className="absolute inset-0 z-[1] pointer-events-none md:hidden" style={{ background: `linear-gradient(180deg, ${BASE_DARK}bb 0%, ${BASE_DARK}88 30%, ${BASE_DARK}cc 60%, ${BASE_DARK} 100%)` }} />

      <div className="relative z-10 w-full max-w-3xl lg:max-w-6xl mx-auto flex flex-col justify-center text-center lg:text-left px-5 md:px-8 lg:px-12 pt-20 md:pt-36 lg:pt-44 pb-10 md:pb-16 lg:pb-24 min-h-[100dvh]">
        <div className="flex flex-col hero-text w-full items-center lg:items-start">
          <h1 className="font-head font-normal text-white tracking-[-0.04em] leading-[0.90] uppercase" style={{ fontSize: 'clamp(36px, 9vw, 64px)' }}>
            Premium Longevity
            <br />
            <span className="text-white/60">Supplements.</span>
          </h1>

          <p className="mt-5 md:mt-7 text-[15px] md:text-[17px] text-white/70 font-sans font-medium max-w-[38ch] leading-[1.55] mx-auto lg:mx-0">
            Three protocols. Daily NAD+ support, daily gut-mitochondria repair, and a 7-day monthly cellular reset. One system built for longevity.
          </p>

          <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-[340px] mx-auto sm:w-auto sm:max-w-none lg:mx-0">
            <a
              href="/shop"
              className="group relative w-full sm:w-auto px-8 lg:px-10 min-h-[44px] lg:min-h-[48px] flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 16px rgba(45,212,191,0.15)' }}
              data-testid="button-shop-system"
            >
              <span className="relative z-10">Shop the System</span>
              <div className="absolute inset-0 bg-white/12 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
            <button
              onClick={onOpenEvidence}
              className="w-full sm:w-auto px-7 min-h-[44px] lg:min-h-[48px] text-white/45 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] hover:text-white/70 transition-all border border-white/[0.08] hover:border-white/[0.15]"
              data-testid="button-view-evidence"
            >
              See Ingredients & Evidence
            </button>
          </div>

          <div className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-1 gap-y-1" data-testid="hero-trust-strip">
            {['Transparent doses', 'No proprietary blends', 'Third-party tested', 'CoA available by lot'].map((item, i) => (
              <span key={item} className="flex items-center">
                <span className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-[0.08em] font-mono">{item}</span>
                {i < 3 && <span className="w-px h-3 bg-white/15 mx-2.5 md:mx-3" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const TrustSection = () => (
  <section className="relative py-[72px] md:py-[100px] px-5 md:px-8" style={{ backgroundColor: SECONDARY_DARK }}>
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10 md:mb-14 reveal-stagger">
        <span className="font-mono text-[11px] text-ar-teal uppercase tracking-[0.18em]">Why Age Revive</span>
        <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)' }}>
          Built on transparency,
          <br className="hidden sm:block" />
          <span className="text-white/50"> not marketing claims.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {TRUST_POINTS.map((tp) => (
          <div
            key={tp.num}
            className="reveal-stagger rounded-lg px-5 py-5 md:px-6 md:py-6"
            style={{ backgroundColor: CARD_DARK, border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="font-mono text-[11px] font-bold text-ar-teal/70 tracking-[0.10em]">{tp.num}</span>
            <h3 className="mt-2 text-[14px] md:text-[15px] font-sans font-semibold text-white tracking-[-0.01em]">{tp.title}</h3>
            <p className="mt-1.5 text-[13px] font-sans text-white/50 leading-[1.55]">{tp.desc}</p>
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
    <section className="relative py-[72px] md:py-[110px] px-5 md:px-8" style={{ backgroundColor: LIGHT_CLINICAL }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14 reveal-stagger">
          <span className="font-mono text-[11px] text-ar-teal uppercase tracking-[0.18em]">The System</span>
          <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-tight" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', color: '#0A1220' }}>
            Choose your starting point.
          </h2>
          <p className="mt-3 text-[14px] md:text-[15px] font-sans text-[#0A1220]/55 max-w-md mx-auto leading-[1.55]">
            Three protocols that work independently or together. Most customers start with CELLUNAD+.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {PRODUCTS.map((p) => (
            <div
              key={p.slug}
              className="reveal-stagger relative rounded-xl overflow-hidden bg-white flex flex-col"
              style={{ border: '1px solid rgba(10,18,32,0.08)', boxShadow: '0 1px 3px rgba(10,18,32,0.04), 0 4px 16px rgba(10,18,32,0.03)' }}
            >
              {p.slug === 'cellunad' && (
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-[0.10em] text-white" style={{ backgroundColor: '#19B3A6' }}>
                  Start Here
                </div>
              )}
              <div className="relative flex items-center justify-center pt-8 pb-4 px-6" style={{ background: 'linear-gradient(180deg, #f0ede6 0%, #ffffff 100%)' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-[160px] md:h-[180px] w-auto object-contain drop-shadow-lg"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 flex flex-col px-5 pb-6 pt-4 md:px-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#0A1220]/40">{p.category}</span>
                <h3 className="mt-1 text-[18px] font-head font-normal uppercase tracking-[-0.02em] text-[#0A1220]">
                  <BrandName name={p.name} />
                </h3>
                <p className="mt-1.5 text-[13px] font-sans text-[#0A1220]/55 leading-[1.5]">{p.bestFor}</p>

                <div className="mt-4 pt-3 border-t border-[#0A1220]/[0.06] grid grid-cols-2 gap-y-2 text-[12px]">
                  <div>
                    <span className="font-mono uppercase tracking-[0.08em] text-[#0A1220]/35 text-[10px] block">Cadence</span>
                    <span className="font-sans text-[#0A1220]/70 mt-0.5 block">{p.cadence}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono uppercase tracking-[0.08em] text-[#0A1220]/35 text-[10px] block">Price</span>
                    <span className="font-sans font-semibold text-[#0A1220] mt-0.5 block">{p.price}</span>
                    <span className="font-sans text-ar-teal text-[11px] block">{p.subPrice} subscribe</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.ingredientsBadges.slice(0, 3).map((badge) => (
                    <span key={badge} className="text-[10px] font-mono uppercase tracking-[0.06em] px-2 py-0.5 rounded bg-[#0A1220]/[0.04] text-[#0A1220]/55">{badge}</span>
                  ))}
                </div>

                <div className="mt-auto pt-5 flex flex-col gap-2">
                  <button
                    onClick={() => handleAdd(p)}
                    className="w-full min-h-[42px] flex items-center justify-center gap-2 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.10em] transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={{ backgroundColor: '#0A1220', color: '#F4F1EA' }}
                    data-testid={`button-add-${p.slug}`}
                  >
                    Add to Cart <ShoppingBag size={13} />
                  </button>
                  <button
                    onClick={() => onOpenProduct(p.slug)}
                    className="w-full min-h-[38px] flex items-center justify-center gap-1.5 rounded-lg font-mono font-bold uppercase text-[10px] tracking-[0.10em] text-[#0A1220]/50 hover:text-[#0A1220]/80 transition-colors border border-[#0A1220]/[0.08] hover:border-[#0A1220]/[0.15]"
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
      accentColor: 'rgba(96,165,250,0.6)',
    },
    {
      tag: '02',
      name: 'Gut-Mitochondria Axis',
      protocol: 'CELLUBIOME',
      slug: 'cellubiome',
      desc: 'Urolithin A supports mitochondrial recycling (mitophagy). Tributyrin delivers butyrate to support gut barrier integrity and short-chain fatty acid signaling.',
      accentColor: 'rgba(25,179,166,0.6)',
    },
    {
      tag: '03',
      name: 'Autophagy Activation',
      protocol: 'CELLUNOVA',
      slug: 'cellunova',
      desc: 'A 7-day monthly cycle of polyphenols and senolytics designed to support cellular cleanup, then step back. The off-period is part of the protocol.',
      accentColor: 'rgba(108,92,231,0.6)',
    },
  ];

  return (
    <section className="relative py-[72px] md:py-[110px] px-5 md:px-8" style={{ backgroundColor: SECONDARY_DARK }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14 reveal-stagger">
          <span className="font-mono text-[11px] text-ar-teal uppercase tracking-[0.18em]">The Science</span>
          <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)' }}>
            Three biological axes.
            <br className="hidden sm:block" />
            <span className="text-white/50"> One integrated system.</span>
          </h2>
          <p className="mt-3 text-[13px] md:text-[14px] font-sans text-white/45 max-w-lg mx-auto leading-[1.55]">
            Each protocol targets a distinct mechanism of cellular aging. Together, they form a coordinated system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {axes.map((axis) => (
            <div
              key={axis.tag}
              className="reveal-stagger rounded-lg px-5 py-6 md:px-6 md:py-7 flex flex-col"
              style={{ backgroundColor: CARD_DARK, border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[11px] font-bold tracking-[0.10em]" style={{ color: axis.accentColor }}>{axis.tag}</span>
                <div className="h-px flex-1" style={{ backgroundColor: `${axis.accentColor}20` }} />
              </div>
              <h3 className="text-[15px] md:text-[16px] font-head font-normal uppercase tracking-[-0.01em] text-white">{axis.name}</h3>
              <p className="mt-2 text-[13px] font-sans text-white/50 leading-[1.55] flex-1">{axis.desc}</p>
              <a
                href={`/product/${axis.slug}`}
                className="mt-4 self-start flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.10em] transition-colors duration-200"
                style={{ color: axis.accentColor }}
                data-testid={`science-link-${axis.slug}`}
              >
                {axis.protocol} <ArrowRight size={10} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-14 text-center reveal">
          <a
            href="/science"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.10em] text-white/40 hover:text-white/65 transition-colors border border-white/[0.08] hover:border-white/[0.15] rounded-lg px-6 py-2.5 min-h-[40px]"
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
    <section className="relative py-[72px] md:py-[110px] px-5 md:px-8" style={{ backgroundColor: LIGHT_CLINICAL }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-14 reveal-stagger">
          <span className="font-mono text-[11px] text-ar-teal uppercase tracking-[0.18em]">Common Questions</span>
          <h2 className="mt-3 font-head font-normal tracking-[-0.03em] uppercase leading-tight" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', color: '#0A1220' }}>
            Before you begin.
          </h2>
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
                className="w-full flex items-center justify-between py-5 text-left gap-4 min-h-[56px]"
                data-testid={`faq-toggle-${i}`}
              >
                <span className="text-[14px] md:text-[15px] font-sans font-semibold text-[#0A1220]/85">{faq.q}</span>
                <ChevronDown size={16} className={`shrink-0 text-[#0A1220]/30 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIndex === i ? '300px' : '0', opacity: openIndex === i ? 1 : 0 }}
              >
                <p className="pb-5 text-[13px] md:text-[14px] font-sans text-[#0A1220]/55 leading-[1.6] pr-8">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
          <a
            href="/faq"
            className="text-[11px] font-mono font-bold uppercase tracking-[0.10em] text-[#0A1220]/45 hover:text-[#0A1220]/75 transition-colors flex items-center gap-1.5"
            data-testid="link-full-faq"
          >
            View all questions <ArrowRight size={11} />
          </a>
          <span className="hidden sm:block w-px h-4 bg-[#0A1220]/10" />
          <a
            href="/quality"
            className="text-[11px] font-mono font-bold uppercase tracking-[0.10em] text-[#0A1220]/45 hover:text-[#0A1220]/75 transition-colors flex items-center gap-1.5"
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
  <section className="relative py-[72px] md:py-[100px] px-5 md:px-8 text-white overflow-hidden" style={{ backgroundColor: BASE_DARK }}>
    <div className="max-w-2xl mx-auto text-center relative z-10 reveal">
      <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.2rem)' }}>
        Your system starts
        <br />
        <span className="text-white/40">with one protocol.</span>
      </h2>
      <p className="mt-4 text-[14px] font-sans text-white/45 max-w-sm mx-auto leading-[1.5]">
        Most customers begin with CELLUNAD+. Add protocols as your system evolves.
      </p>
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/shop"
          className="group relative px-9 min-h-[46px] flex items-center justify-center bg-ar-teal text-[#0A1220] rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 16px rgba(45,212,191,0.12)' }}
          data-testid="button-cta-shop-system"
        >
          <span className="relative z-10">Shop the System</span>
          <div className="absolute inset-0 bg-white/12 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </a>
        <a
          href="/shop"
          className="text-[10px] font-mono uppercase tracking-[0.08em] text-white/40 hover:text-white/65 transition-colors inline-flex items-center gap-1 min-h-[40px]"
          data-testid="button-cta-explore"
        >
          Explore individual protocols <ArrowRight size={9} />
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

      gsap.from('.hero-text', { opacity: 0, y: 20, duration: 1, ease: 'power3.out' });

      gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
          opacity: 0, y: 16, duration: 0.8, ease: 'power3.out'
        });
      });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
          opacity: 0, y: 16, duration: 0.8, ease: 'power3.out'
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
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

      <Hero onOpenEvidence={() => setEvidencePanel(true)} />

      <TrustSection />

      <ProductSystemSection onOpenProduct={(slug: string) => setActiveProduct(productBySlug[slug] ?? null)} />

      <ScienceSection />

      <FaqSection />

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
              This panel summarizes protocol intent. Full research references can be linked in the Science section when ready.
            </p>
          </section>
          <div className="p-6 bg-ar-teal/5 border border-ar-teal/10 rounded-xl">
            <p className="text-sm italic">
              "Science is the substrate. Purity is the standard. Design is the interface."
            </p>
          </div>
        </div>
      </SideSheet>

      <SideSheet isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} title={activeProduct ? <BrandName name={activeProduct.name} /> : 'Protocol'}>
        {activeProduct && (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#0A1220]/45">{activeProduct.category}</p>
              <p className="text-xl font-sans font-extrabold uppercase tracking-[-0.02em] text-[#0A1220]">{activeProduct.tagline}</p>
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#0A1220]/40">{activeProduct.serving}</p>
              {activeProduct.warning && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <p className="text-[12px] font-mono font-bold text-red-600 uppercase tracking-[0.18em] mb-1">Warning</p>
                  <p className="text-sm font-medium text-[#0A1220]/70">{activeProduct.warning}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#0A1220]/45">Key outcomes</p>
              {activeProduct.outcomes.map((o) => (
                <div key={o} className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-ar-teal shrink-0" />
                  <span className="text-[#0A1220]/70">{o}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#0A1220]/45">Full ingredient panel</p>
              {activeProduct.fullIngredients.map((ing) => (
                <div key={ing.name} className="flex justify-between items-end border-b border-[#0A1220]/10 pb-3 gap-6">
                  <div className="space-y-1">
                    <p className="font-sans font-extrabold text-sm uppercase tracking-[-0.01em] text-[#0A1220]">{ing.name}</p>
                    <p className="text-[12px] font-mono text-[#0A1220]/50 uppercase tracking-[0.18em]">{ing.purpose}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-ar-teal">{ing.dose}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[#0A1220]/45">Rationale</p>
              {activeProduct.rationale.map((r) => (
                <div key={r.title} className="rounded-xl bg-white border border-[#0A1220]/5 p-4">
                  <p className="text-xs font-sans font-extrabold uppercase tracking-[0.12em] text-[#0A1220]">{r.title}</p>
                  <p className="mt-2 text-sm text-[#0A1220]/60 font-medium leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>

            <button onClick={addActiveProductToCart} className="w-full py-5 min-h-[48px] bg-[#0A1220] text-white rounded-lg font-mono font-bold uppercase text-[12px] tracking-[0.18em] hover:bg-[#162235] transition-colors flex items-center justify-center gap-2" data-testid="button-add-to-cart">
              Add to Cart <ArrowRight size={14} />
            </button>

            <p className="text-[12px] font-mono text-[#0A1220]/45 uppercase tracking-[0.18em]">
              *These statements have not been evaluated by the FDA.
            </p>
          </div>
        )}
      </SideSheet>
    </div>
  );
}
