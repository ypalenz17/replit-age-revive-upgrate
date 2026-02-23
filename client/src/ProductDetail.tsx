import { useState, useEffect, useRef } from 'react';
import { useParams } from 'wouter';
import {
  ArrowRight,
  Check,
  Activity,
  Zap,
  Clock,
  Microscope,
  ChevronDown,
  ShieldCheck,
  Dna,
  Layers,
  FlaskConical,
  Plus,
  Minus,
  Info,
  Shield,
  X,
  FileText,
  Menu,
  ShoppingBag,
  RotateCcw,
  Wind
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_DETAIL_DATA = {
  cellunad: {
    name: "CELLUNAD+",
    subtitle: "Daily NAD+ support for energy and DNA maintenance.",
    form: "Capsules",
    serving: "2 capsules daily with a meal",
    servingsPerContainer: 30,
    priceOneTime: 79.99,
    priceSubscribe: 67.99,
    accent: '#1e3a8a',
    accentText: '#60a5fa',
    accentTailwind: 'teal',
    heroOverline: 'Daily NAD+ Optimization',
    heroSplit: ['CELLU', 'NAD+.'],
    supplyLabel: '30-Day Supply',
    subscribeLabel: 'Subscribe & Save 15%',
    subscribeDesc: 'Ships monthly. Cancel anytime.',
    onetimeLabel: 'One-Time Purchase',
    onetimeDesc: 'No commitment.',
    heroClaims: [
      "Supports NAD+ levels*",
      "Supports cellular energy*",
      "Supports DNA maintenance*",
      "Supports methylation balance*"
    ],
    heroSpecs: [
      { label: "Nicotinamide Riboside", dose: "500 mg" },
      { label: "Apigenin", dose: "100 mg" },
      { label: "R-Lipoic Acid", dose: "200 mg" }
    ],
    supplementFacts: {
      servingSize: "2 Capsules",
      servingsPerContainer: "30",
      items: [
        { name: "Vitamin B6 (as P-5-P)", amount: "10 mg", dv: "588%" },
        { name: "Folate (5-MTHF)", amount: "400 mcg DFE", dv: "100%" },
        { name: "Vitamin B12 (Methylcobalamin)", amount: "1,000 mcg", dv: "41,667%" },
        { name: "Betaine (TMG)", amount: "250 mg", dv: "" },
        { name: "Nicotinamide Riboside", amount: "500 mg", dv: "" },
        { name: "R-Lipoic Acid", amount: "200 mg", dv: "" },
        { name: "Apigenin", amount: "100 mg", dv: "" },
        { name: "BioPerine (Black Pepper Extract)", amount: "5 mg", dv: "*" }
      ],
      otherIngredients: "Veg. cellulose (capsule), rice flour, magnesium stearate, silica.",
      allergenNote: null as string | null
    },
    keyActives: [
      { name: "Nicotinamide Riboside (NR)", dose: "500 mg", role: "NAD+ Precursor", explanation: "A well-studied precursor that supports NAD+ production in every cell." },
      { name: "Apigenin", dose: "100 mg", role: "NAD+ Preservation", explanation: "Helps maintain NAD+ availability by supporting healthy enzyme balance." },
      { name: "TMG + Methylated B Complex", dose: "TMG 250 mg + B-Complex", role: "Methylation Support", explanation: "Supports methylation balance alongside consistent NAD+ supplementation." },
      { name: "R-Lipoic Acid", dose: "200 mg", role: "Mitochondrial Cofactor", explanation: "Supports metabolic enzyme function and antioxidant balance." },
      { name: "BioPerine", dose: "5 mg", role: "Absorption", explanation: "Black pepper extract included to support bioavailability." }
    ],
    scienceSection: {
      label: 'The Science',
      headline: 'Why NAD+ Matters',
      paragraphs: [
        'NAD+ is a coenzyme found in every living cell. It plays a central role in converting nutrients into energy and is required by enzymes that maintain DNA and regulate cellular signaling.',
        'NAD+ levels naturally decline with age. CELLUNAD+ is formulated to support daily NAD+ replenishment with clinically studied doses and essential co-factors.'
      ],
      diagramLabel: 'NAD+ Pathway',
      diagramCenter: { label: 'NAD+ Pool', icon: '' } as { label: string; icon: string } | null,
      diagramNodes: [
        { label: "Energy Metabolism", icon: 'Zap' },
        { label: "DNA Maintenance", icon: 'Dna' },
        { label: "Cellular Signaling", icon: 'Activity' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    mechanisms: [
      { step: "01", label: "Replenish NAD+", text: "NR provides a direct precursor to support NAD+ availability every day." },
      { step: "02", label: "Preserve NAD+", text: "Apigenin helps maintain healthy NAD+ levels by supporting enzyme balance." },
      { step: "03", label: "Complete the System", text: "TMG and methylated B vitamins provide cofactor support for the pathways that use NAD+." }
    ],
    mechanismLabel: 'How It Works',
    mechanismHeadline: 'Three-Step Approach',
    suitability: [
      "Daily NAD+ support",
      "Energy and focus",
      "Longevity-focused routines",
      "Methylation balance"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.',
    allergenDisclosure: null as string | null,
    stack: [
      { name: "CELLUBIOME", slug: "cellubiome", role: "Gut + Mitochondria", add: "Pair NAD+ support with gut barrier and mitochondrial quality.", when: "Take daily" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Monthly Reset", add: "Add a periodic 7-day reset to complement daily NAD+ support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long does it take to notice effects?", a: "Most people evaluate changes over 2\u20133 months of consistent daily use." },
      { q: "When should I take it?", a: "Take 2 capsules daily with a meal, morning or afternoon. Consistency matters more than timing." },
      { q: "Does it break a fast?", a: "It has no meaningful caloric load, but if you fast strictly, take it with your first meal." },
      { q: "Can I take it with CELLUNOVA?", a: "Yes. CELLUNAD+ is designed for daily use. CELLUNOVA is a separate 7-day monthly cycle." },
      { q: "Why include methylation support?", a: "NAD+ and methylation pathways are closely linked. TMG and methylated B vitamins help keep both in balance." },
      { q: "Who should avoid it?", a: "Check with your doctor if pregnant, nursing, on medication, or managing a medical condition." }
    ],
    trust: ["cGMP Manufactured", "Third-Party Tested", "Full Label Disclosure", "Glass Packaging"],
    ctaHeadline: ['Start your', 'daily foundation.'],
    ctaBody: 'Add CELLUNAD+ to your routine for daily NAD+ and energy support.',
    ctaButton: 'Add to Cart',
  },

  cellubiome: {
    name: "CELLUBIOME",
    subtitle: "Daily gut barrier and mitochondrial renewal support.",
    form: "Enteric Capsules",
    serving: "2 capsules daily",
    servingsPerContainer: 30,
    priceOneTime: 110.00,
    priceSubscribe: 93.50,
    accent: '#19B3A6',
    accentText: '#5eead4',
    accentTailwind: 'teal',
    heroOverline: 'Gut\u2013Mitochondria Axis',
    heroSplit: ['CELLU', 'BIOME.'],
    supplyLabel: '30-Day Supply',
    subscribeLabel: 'Subscribe & Save 15%',
    subscribeDesc: 'Ships monthly. Cancel anytime.',
    onetimeLabel: 'One-Time Purchase',
    onetimeDesc: 'No commitment.',
    heroClaims: [
      "Supports mitochondrial renewal*",
      "Supports gut barrier integrity*",
      "Supports healthy aging*",
      "Enteric-coated delivery*"
    ],
    heroSpecs: [
      { label: "Urolithin A", dose: "500 mg" },
      { label: "Tributyrin", dose: "500 mg" },
      { label: "Delivery", dose: "Enteric" }
    ],
    supplementFacts: {
      servingSize: "2 Capsules",
      servingsPerContainer: "30",
      items: [
        { name: "Urolithin A (\u226599% Purity)", amount: "500 mg", dv: "" },
        { name: "Tributyrin (Butyrate Precursor)", amount: "500 mg", dv: "" }
      ],
      otherIngredients: "Veg. cellulose (capsule), rice flour, magnesium stearate, silica.",
      allergenNote: null as string | null
    },
    keyActives: [
      { name: "Urolithin A", dose: "500 mg", role: "Mitochondrial Renewal", explanation: "Clinically studied at 500 mg to support mitochondrial recycling (mitophagy)." },
      { name: "Tributyrin", dose: "500 mg", role: "Gut Barrier Support", explanation: "A stable form of butyrate that supports intestinal lining integrity and gut health." },
      { name: "Enteric Coating", dose: "Targeted Release", role: "Absorption", explanation: "Protects active compounds from stomach acid for release in the intestines where they're needed." }
    ],
    scienceSection: {
      label: 'The Science',
      headline: 'The Gut\u2013Mitochondria Connection',
      paragraphs: [
        'Your gut health and mitochondrial function are deeply connected. When either weakens, the other suffers\u2014creating a cycle that accelerates aging.',
        'CELLUBIOME addresses both sides: Urolithin A supports mitochondrial renewal, while Tributyrin supports gut barrier strength. Together, they help break the cycle.'
      ],
      diagramLabel: 'Gut\u2013Mito Axis',
      diagramCenter: { label: 'Mitochondria', icon: 'Zap' },
      diagramNodes: [
        { label: "Gut Barrier", icon: 'Layers' },
        { label: "Mitochondrial Renewal", icon: 'ShieldCheck' },
        { label: "Barrier Defense", icon: 'ShieldCheck' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    mechanisms: [
      { step: "01", label: "Renew Mitochondria", text: "Urolithin A supports the recycling of old, damaged mitochondria so new ones can take their place." },
      { step: "02", label: "Strengthen the Gut Barrier", text: "Tributyrin provides butyrate to support the tight junctions that keep your intestinal lining intact." },
      { step: "03", label: "Connect Both Systems", text: "By supporting both gut health and mitochondrial function daily, you address two pillars of healthy aging together." }
    ],
    mechanismLabel: 'How It Works',
    mechanismHeadline: 'Three-Step Approach',
    deliveryRationale: {
      headline: 'Why Enteric Delivery Matters',
      text: 'Tributyrin and Urolithin A need to reach the intestines intact. Our enteric coating protects them from stomach acid so they arrive where your body can use them most.'
    },
    suitability: [
      "Healthy aging support",
      "Mitochondrial health",
      "Gut barrier support",
      "Pairs well with NAD+ support"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.',
    allergenDisclosure: null as string | null,
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "Daily NAD+", add: "Pair mitochondrial renewal with daily NAD+ support.", when: "Take daily" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Monthly Reset", add: "Add a periodic cellular cleanup cycle alongside daily support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long before I notice anything?", a: "Give it 8\u201312 weeks of consistent daily use for a meaningful evaluation." },
      { q: "Can I take it with food?", a: "Yes. Take it with or without a meal. Consistency is more important than timing." },
      { q: "Is this a probiotic?", a: "No. CELLUBIOME provides Urolithin A and Tributyrin\u2014targeted compounds, not live cultures." },
      { q: "Why 500 mg Urolithin A?", a: "500 mg is the dose used in published clinical research on mitochondrial health." },
      { q: "Why Tributyrin instead of butyrate salts?", a: "Tributyrin is more stable and survives digestion better, delivering butyrate directly to the gut lining." }
    ],
    trust: ["cGMP Manufactured", "Third-Party Tested", "Full Label Disclosure", "Enteric Protected"],
    ctaHeadline: ['Strengthen the', 'foundation.'],
    ctaBody: 'Add CELLUBIOME for daily gut barrier and mitochondrial support.',
    ctaButton: 'Add to Cart',
  },

  cellunova: {
    name: "CELLUNOVA",
    subtitle: "A 7-day cycle for cellular cleanup and renewal.",
    form: "Capsules",
    serving: "5 capsules daily for 7 consecutive days",
    servingsPerContainer: 7,
    priceOneTime: 145.00,
    priceSubscribe: 123.25,
    accent: '#6C5CE7',
    accentText: '#a78bfa',
    accentTailwind: 'violet',
    heroOverline: '7-Day Autophagy Cycle',
    heroSplit: ['CELLU', 'NOVA.'],
    supplyLabel: '7-Day Cycle',
    subscribeLabel: 'Subscribe & Save 15%',
    subscribeDesc: 'Ships monthly. Cancel anytime.',
    onetimeLabel: 'One-Time Purchase',
    onetimeDesc: 'No commitment.',
    heroClaims: [
      "Supports autophagy pathways*",
      "Supports cellular cleanup*",
      "Supports senescent cell management*",
      "Supports healthy aging*"
    ],
    heroSpecs: [
      { label: "Cycle", dose: "7 Days / Month" },
      { label: "Serving", dose: "5 Capsules" },
      { label: "Focus", dose: "Autophagy" }
    ],
    supplementFacts: {
      servingSize: "5 Capsules",
      servingsPerContainer: "7",
      items: [
        { name: "NAC", amount: "600 mg", dv: "" },
        { name: "Trans-Resveratrol", amount: "500 mg", dv: "" },
        { name: "Quercetin", amount: "500 mg", dv: "" },
        { name: "Fisetin", amount: "100 mg", dv: "" },
        { name: "Green Tea Extract (50% EGCG)", amount: "300 mg", dv: "" },
        { name: "Spermidine (from Wheat Germ)", amount: "15 mg", dv: "" },
        { name: "Calcium Alpha-Ketoglutarate", amount: "300 mg", dv: "" },
        { name: "Astaxanthin", amount: "4 mg", dv: "" },
        { name: "PQQ", amount: "10 mg", dv: "" },
        { name: "BioPerine", amount: "5 mg", dv: "*" }
      ],
      otherIngredients: "Veg. cellulose (capsule), rice flour, magnesium stearate, silica.",
      allergenNote: "Contains Wheat (Wheat Germ derived Spermidine)."
    },
    keyActives: [
      { name: "Spermidine + Resveratrol", dose: "15 mg / 500 mg", role: "Autophagy Support", explanation: "Two compounds that work together to support your body's natural cellular cleanup processes." },
      { name: "Fisetin + Quercetin", dose: "100 mg / 500 mg", role: "Senolytic Support", explanation: "Flavonoids that support the body's ability to manage aging, non-functional cells." },
      { name: "NAC + Calcium AKG", dose: "600 mg / 300 mg", role: "Antioxidant Support", explanation: "Cofactors that support antioxidant defenses and metabolic efficiency during the cleanup cycle." }
    ],
    scienceSection: {
      label: 'The Science',
      headline: 'Autophagy & Cellular Aging',
      paragraphs: [
        'As we age, damaged proteins and non-functional "zombie" cells accumulate. These cells stay active but stop doing their job, contributing to inflammation and decline.',
        'CELLUNOVA is designed as a short, focused cycle to support your body\'s natural cleanup processes\u2014autophagy and senescent cell management\u2014then step back and let your body recover.'
      ],
      diagramLabel: '7-Day Cycle',
      diagramCenter: null as { label: string; icon: string } | null,
      diagramNodes: [
        { label: "Cleanup", icon: 'RotateCcw' },
        { label: "Removal", icon: 'Wind' },
        { label: "Recovery", icon: 'Zap' }
      ],
      diagramFooter: { label: '7-Day Focused Cycle', text: 'Seven days of targeted support, then time off. The rest period is part of the design.' }
    },
    mechanisms: [
      { step: "01", label: "Activate Cleanup", text: "Supports your body's autophagy pathways to clear damaged proteins and worn-out cellular components." },
      { step: "02", label: "Support Cell Turnover", text: "Senolytic compounds help your body manage aging cells that no longer function properly." },
      { step: "03", label: "Rest and Recover", text: "After 7 days, you stop. The off-cycle lets your body integrate the cleanup and return to baseline." }
    ],
    mechanismLabel: 'How It Works',
    mechanismHeadline: 'The 7-Day Cycle',
    suitability: [
      "Healthy aging support",
      "Periodic cellular cleanup",
      "Experienced supplement users",
      "Longevity-focused routines"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, or managing a medical condition.',
    allergenDisclosure: 'Contains Wheat (from Wheat Germ derived Spermidine).',
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "Daily NAD+", add: "Continue daily NAD+ support while running the 7-day CELLUNOVA cycle.", when: "Take daily" },
      { name: "CELLUBIOME", slug: "cellubiome", role: "Gut + Mitochondria", add: "Support gut health and mitochondrial quality alongside periodic cleanup.", when: "Take daily" }
    ],
    faq: [
      { q: "Is this a daily supplement?", a: "No. CELLUNOVA is taken for 7 consecutive days, once per month. The off-period is part of the design." },
      { q: "Does it contain wheat?", a: "Yes. The Spermidine is derived from Wheat Germ. Not suitable for those with wheat or gluten sensitivities." },
      { q: "Why 5 capsules per day?", a: "The serving size reflects the amount needed to reach meaningful doses of each active ingredient during the 7-day window." },
      { q: "Can I take it with CELLUNAD+?", a: "Yes. Many people continue their daily CELLUNAD+ alongside the 7-day CELLUNOVA cycle." },
      { q: "How often should I do a cycle?", a: "Once per month is the standard recommendation. Some people space cycles every 60 or 90 days." }
    ],
    trust: ["Contains Wheat", "7-Day Cycle", "Third-Party Tested", "cGMP Verified"],
    ctaHeadline: ['Reset.', 'Renew.'],
    ctaBody: 'Add CELLUNOVA for a focused 7-day cellular cleanup cycle.',
    ctaButton: 'Add to Cart',
  }
};

const ICON_MAP = { Zap, Dna, Activity, Layers, ShieldCheck, RotateCcw, Wind };

function getIcon(name: string) {
  return ICON_MAP[name as keyof typeof ICON_MAP] || Activity;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Science', href: '/science' },
    { label: 'Quality', href: '/quality' },
    { label: 'FAQ', href: '/faq' }
  ];

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
            <img src={brandLogo} alt="AGE REVIVE" className="h-7 md:h-8 w-auto brightness-0 invert transition-opacity duration-500" />
          </a>
          <div className="hidden md:flex items-center gap-7 font-mono font-medium text-[11px] uppercase tracking-[0.14em]">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-white/55 hover:text-teal-300 transition-colors" data-testid={`nav-link-pdp-${l.label.toLowerCase()}`}>{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a href="/shop" className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors" aria-label="Cart" data-testid="nav-cart-pdp">
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] flex items-center justify-center text-[9px] font-mono font-bold rounded-sm leading-none text-teal-300 border border-teal-300/40 bg-white/[0.04]">0</span>
            </a>
            <button
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle-pdp"
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
                  data-testid={`mobile-nav-pdp-${l.label.toLowerCase()}`}
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

function ModalFacts({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: typeof PRODUCT_DETAIL_DATA.cellunad }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white text-[#0b1120] p-8 overflow-y-auto max-h-[90vh] shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-black/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" data-testid="button-close-facts">
          <X size={20} />
        </button>
        <div className="border-b-4 border-black pb-2 mb-4">
          <h2 className="text-3xl font-head font-bold uppercase tracking-tight">Supplement Facts</h2>
          {data.name === 'CELLUNOVA' && <p className="text-sm italic">Designed as a 7-day cyclical protocol.</p>}
          <p className="text-sm font-sans">Serving Size: {data.supplementFacts.servingSize}</p>
          <p className="text-sm font-sans">Servings Per Container: {data.supplementFacts.servingsPerContainer}</p>
        </div>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 font-bold">Amount Per Serving</th>
              <th className="py-2 text-right font-bold">%DV</th>
            </tr>
          </thead>
          <tbody>
            {data.supplementFacts.items.map((item, i) => (
              <tr key={i} className="border-b border-black/10">
                <td className="py-2">{item.name} <span className="font-bold ml-2">{item.amount}</span></td>
                <td className="py-2 text-right font-bold">{item.dv || "\u2020"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-[10px] leading-tight space-y-2">
          <p>\u2020 Daily Value (DV) not established.</p>
          <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
          {data.supplementFacts.allergenNote && (
            <p className="pt-2"><span className="font-bold uppercase">Allergens:</span> {data.supplementFacts.allergenNote}</p>
          )}
          <p className="pt-1"><span className="font-bold uppercase">Other Ingredients:</span> {data.supplementFacts.otherIngredients}</p>
        </div>
      </div>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="w-full space-y-1">
      {items.map((item, i) => (
        <div key={i} className="border border-white/10 bg-white/[0.03] overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="w-full p-5 md:p-6 flex justify-between items-center text-left hover:bg-white/[0.03] transition-colors gap-4"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/80 leading-snug">{item.q}</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 text-white/40 ${openIndex === i ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-5 md:px-6 pb-5 md:pb-6 text-white/50 text-[14px] leading-relaxed font-sans font-medium">
                {item.a}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductDetailPage({ data }: { data: typeof PRODUCT_DETAIL_DATA.cellunad }) {
  const [isSubscribe, setIsSubscribe] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const [isFactsOpen, setIsFactsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data.name]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pdp-reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%' },
          opacity: 0,
          y: 24,
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
  }, [data.name]);

  const currentPrice = isSubscribe ? data.priceSubscribe : data.priceOneTime;
  const accentColor = data.accentText;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0b1120] text-white selection:bg-teal-500/30 selection:text-white font-sans antialiased">
      <ModalFacts isOpen={isFactsOpen} onClose={() => setIsFactsOpen(false)} data={data} />

      <div className={`fixed bottom-0 left-0 w-full z-[110] bg-white text-[#0b1120] border-t border-black/10 py-3.5 px-5 transition-transform duration-500 transform ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <h4 className="text-sm font-head font-normal tracking-tight uppercase leading-none">{data.name}</h4>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none text-right pr-4 border-r border-black/10">
              <span className="text-lg font-head font-normal tracking-tighter">${(currentPrice * quantity).toFixed(2)}</span>
            </div>
            <button className="flex-1 sm:flex-none py-3 px-8 bg-ar-teal text-ar-navy rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all min-h-[44px]" data-testid="sticky-cta">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <Navbar />

      <section className="relative px-5 md:px-10 lg:px-[60px] pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] blur-[120px] pointer-events-none rounded-full" style={{ background: `${data.accent}22` }} />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] blur-[120px] pointer-events-none rounded-full" style={{ background: `${data.accent}15` }} />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="h-px w-4 bg-white/10" />
                <span className="font-mono text-[10px] uppercase tracking-[0.10em]" style={{ color: `${accentColor}CC` }}>{data.heroOverline}</span>
                <div className="h-px w-4 bg-white/10" />
              </div>
              <h1 className="font-head font-normal tracking-[-0.04em] leading-[0.85] uppercase text-white" style={{ fontSize: 'clamp(3rem, 9vw, 5.5rem)' }}>
                {data.heroSplit[0]}<br /><span className="text-white/50">{data.heroSplit[1]}</span>
              </h1>
              <p className="text-[15px] md:text-[17px] text-white/75 font-sans font-medium leading-snug max-w-md">
                {data.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.heroClaims.map((claim, i) => (
                <div key={i} className="p-3.5 border border-white/10 bg-white/[0.03] flex flex-col justify-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-white/50">{claim}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              {data.heroSpecs.map((item, i) => (
                <div key={i} className="flex items-center justify-between max-w-sm border-b border-white/[0.06] pb-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-white/30 tracking-[0.12em]">{item.label}</span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: accentColor }}>{item.dose}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="bg-[#F4F1EA] text-[#0b1120] p-7 md:p-9 shadow-[30px_30px_100px_rgba(0,0,0,0.4)] rounded-lg space-y-7">
              <div className="flex justify-between items-baseline border-b border-black/5 pb-5">
                <div className="space-y-1">
                  <h3 className="text-4xl md:text-5xl font-head font-normal tracking-tighter">
                    ${(currentPrice * quantity).toFixed(2)}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase font-bold opacity-40">{data.form}</p>
                  <p className="text-sm font-bold uppercase">{data.supplyLabel}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setIsSubscribe(true)}
                  className={`w-full p-5 border-2 text-left transition-all flex justify-between items-center ${isSubscribe ? 'border-[#0b1120] bg-[#0b1120] text-white' : 'border-black/10 hover:border-black/20'}`}
                  data-testid="option-subscribe"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">{data.subscribeLabel}</p>
                    <p className={`text-xs ${isSubscribe ? 'text-white/60' : 'text-black/40'}`}>{data.subscribeDesc}</p>
                  </div>
                  <span className="text-lg font-head font-bold">Save 15%</span>
                </button>
                <button
                  onClick={() => setIsSubscribe(false)}
                  className={`w-full p-5 border-2 text-left transition-all ${!isSubscribe ? 'border-[#0b1120] bg-[#0b1120] text-white' : 'border-black/10 hover:border-black/20'}`}
                  data-testid="option-onetime"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">{data.onetimeLabel}</p>
                  <p className={`text-xs ${!isSubscribe ? 'text-white/60' : 'text-black/40'}`}>{data.onetimeDesc}</p>
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-black/5">
                <span className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] opacity-40">Select Quantity</span>
                <div className="flex items-center gap-5 bg-black/5 p-2 px-4 rounded-full">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:opacity-70 transition-colors min-w-[30px] min-h-[30px] flex items-center justify-center" data-testid="qty-minus"><Minus size={16} /></button>
                  <span className="font-mono font-bold text-xl w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:opacity-70 transition-colors min-w-[30px] min-h-[30px] flex items-center justify-center" data-testid="qty-plus"><Plus size={16} /></button>
                </div>
              </div>

              <button className="w-full py-5 bg-ar-teal text-ar-navy rounded-lg font-mono text-[11px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all flex items-center justify-center gap-2 min-h-[52px]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 12px rgba(45,212,191,0.15)' }} data-testid="add-to-cart">
                Add to Cart <ArrowRight size={14} />
              </button>

              <div className="space-y-3 pt-1">
                <button
                  onClick={() => setIsFactsOpen(true)}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-[0.12em] opacity-60 hover:opacity-100 transition-all border-b border-black/10 pb-1"
                  data-testid="view-supplement-facts"
                >
                  <FileText size={12} /> View Supplement Facts
                </button>
                <div className="flex flex-wrap justify-between gap-3 opacity-40 font-mono text-[8px] font-bold uppercase tracking-[0.14em]">
                  <div className="flex items-center gap-1.5"><Shield size={10} /> cGMP Compliant</div>
                  <div className="flex items-center gap-1.5"><FlaskConical size={10} /> 3rd-Party Tested</div>
                  <div className="flex items-center gap-1.5"><Check size={10} /> Priority Dispatch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8" style={{ background: accentColor }} />
                  <span className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: accentColor }}>{data.scienceSection.label}</span>
                  <div className="h-[1px] w-8" style={{ background: accentColor }} />
                </div>
                <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>{data.scienceSection.headline}</h2>
              </div>
              <div className="space-y-6 text-white/55 text-[16px] md:text-[18px] leading-relaxed font-sans font-medium">
                {data.scienceSection.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="relative p-8 md:p-12 bg-[#0b1120] border border-white/10 flex flex-col justify-center items-center overflow-hidden">
              <div className="absolute top-4 left-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.14em]">{data.scienceSection.diagramLabel}</div>
              {data.scienceSection.diagramCenter ? (
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative w-full pt-6">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border flex flex-col items-center justify-center text-center p-4" style={{ borderColor: `${accentColor}40`, background: `${data.accent}10` }}>
                    {data.scienceSection.diagramCenter.icon && (() => { const Ic = getIcon(data.scienceSection.diagramCenter.icon); return <Ic size={24} style={{ color: accentColor }} className="mb-2" />; })()}
                    <p className="font-mono text-[10px] font-bold uppercase" style={{ color: accentColor }}>{data.scienceSection.diagramCenter.label}</p>
                  </div>
                  <ArrowRight size={24} className="text-white/10 hidden md:block" />
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    {data.scienceSection.diagramNodes.map((n, i) => {
                      const Ic = getIcon(n.icon);
                      return (
                        <div key={i} className="flex items-center gap-4 p-3.5 border border-white/10 bg-white/[0.03] w-full md:w-60">
                          <Ic size={16} style={{ color: `${accentColor}80` }} />
                          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.10em]">{n.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 relative w-full pt-6">
                  <div className="w-full grid grid-cols-3 gap-3">
                    {data.scienceSection.diagramNodes.map((n, i) => {
                      const Ic = getIcon(n.icon);
                      return (
                        <div key={i} className="flex flex-col items-center gap-3 p-4 md:p-6 border border-white/10 bg-white/[0.03] text-center">
                          <Ic size={22} style={{ color: `${accentColor}80` }} />
                          <span className="font-mono text-[9px] uppercase font-bold tracking-[0.10em]">{n.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {data.scienceSection.diagramFooter && (
                    <div className="p-5 border w-full text-center" style={{ borderColor: `${accentColor}30`, background: `${data.accent}08` }}>
                      <p className="font-mono text-[11px] font-bold uppercase mb-1.5" style={{ color: accentColor }}>{data.scienceSection.diagramFooter.label}</p>
                      <p className="text-[12px] text-white/40">{data.scienceSection.diagramFooter.text}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-ar-teal" />
              <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.18em]">{data.mechanismLabel}</span>
              <div className="h-[1px] w-12 bg-ar-teal" />
            </div>
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>{data.mechanismHeadline}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.mechanisms.map((m, i) => (
              <div key={i} className="p-6 md:p-8 border border-white/[0.06] bg-white/[0.02] space-y-4 group hover:border-white/[0.10] transition-all rounded-lg">
                <span className="font-mono text-[10px] font-bold uppercase text-white/40">Step {m.step}</span>
                <div className="space-y-3">
                  <h4 className="text-[15px] font-head font-normal uppercase tracking-[-0.01em] text-white">{m.label}</h4>
                  <p className="text-sm text-white/50 leading-relaxed font-sans font-medium">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8" style={{ background: accentColor }} />
              <span className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: accentColor }}>Key Ingredients</span>
              <div className="h-[1px] w-8" style={{ background: accentColor }} />
            </div>
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>What's Inside</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.keyActives.map((active, i) => (
              <div key={i} className="p-7 md:p-8 border border-white/[0.06] bg-white/[0.02] space-y-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-[15px] font-head font-normal uppercase tracking-[-0.01em] text-white max-w-[70%]">{active.name}</h4>
                    <span className="font-mono text-[10px] font-bold uppercase shrink-0" style={{ color: accentColor }}>{active.dose}</span>
                  </div>
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.12em]">{active.role}</p>
                  <p className="text-sm text-white/50 leading-relaxed font-sans font-medium">{active.explanation}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 opacity-20">
                  <div className="h-[1px] flex-1 bg-white" />
                  <Microscope size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {'deliveryRationale' in data && (data as any).deliveryRationale && (
        <section className="pdp-reveal py-16 md:py-20 px-5 md:px-10 lg:px-[60px] text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full" style={{ background: `${data.accent}10`, border: `1px solid ${accentColor}20` }}>
              <FlaskConical size={20} style={{ color: accentColor }} />
            </div>
            <div className="space-y-3">
              <h3 className="font-head font-normal uppercase tracking-[-0.02em] text-white" style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)' }}>{(data as any).deliveryRationale.headline}</h3>
              <p className="text-white/50 text-[14px] leading-relaxed font-sans font-medium max-w-lg mx-auto">{(data as any).deliveryRationale.text}</p>
            </div>
          </div>
        </section>
      )}

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Who It's For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.suitability.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="font-mono text-[11px] font-bold" style={{ color: accentColor }}>0{i + 1}</span>
                  <p className="text-sm font-bold uppercase tracking-[0.10em] text-white/60">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 md:p-10 border-2 border-dashed border-white/[0.08] bg-white/[0.03] space-y-5">
            <div className="flex items-center gap-3 text-white/40">
              <Info size={18} />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">Important</p>
            </div>
            <p className="text-white/40 text-[14px] md:text-[15px] italic leading-relaxed font-sans font-medium">{data.safetyNote}</p>
            {data.allergenDisclosure && (
              <div className="p-3.5 border text-[10px] font-mono uppercase tracking-[0.12em]" style={{ borderColor: `${accentColor}30`, background: `${data.accent}08`, color: accentColor }}>
                {data.allergenDisclosure}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] bg-white/[0.03] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-ar-teal" />
              <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.18em]">Works Together</span>
              <div className="h-[1px] w-12 bg-ar-teal" />
            </div>
            <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>Pairs Well With</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.stack.map((item, i) => (
              <div key={i} className="border border-white/10 bg-[#0b1120] p-8 md:p-10 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] transition-all" style={{ background: `${data.accent}08` }} />
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center gap-3">
                    <h4 className="text-xl md:text-2xl font-head font-normal uppercase tracking-tight">{item.name}</h4>
                    <span className="font-mono text-[9px] border px-2 py-1 uppercase shrink-0" style={{ color: accentColor, borderColor: `${accentColor}30` }}>{item.role}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-sans font-medium">{item.add}</p>
                </div>
                <div className="flex items-center gap-3 font-mono text-[9px] text-white/30 uppercase tracking-[0.14em] relative z-10">
                  <Clock size={12} /> {item.when}
                </div>
                <div className="flex gap-3 pt-2 relative z-10">
                  <a href={`/product/${item.slug}`} className="flex-1 py-3.5 border border-white/10 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.10em] hover:bg-white/[0.04] transition-all text-center min-h-[44px] flex items-center justify-center" data-testid={`stack-view-${item.slug}`}>View</a>
                  <button className="flex-1 py-3.5 bg-ar-teal text-ar-navy rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.10em] hover:bg-ar-teal/90 transition-all min-h-[44px]" data-testid={`stack-add-${item.slug}`}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pdp-reveal py-16 md:py-20 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {data.trust.map((t, i) => (
            <div key={i} className="text-center space-y-3 opacity-40">
              <div className="w-11 h-11 border border-white/10 flex items-center justify-center mx-auto rounded-full">
                <Check size={16} style={{ color: accentColor }} />
              </div>
              <p className="font-mono text-[10px] uppercase font-bold tracking-[0.14em]">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-ar-teal" />
            <span className="font-mono text-[12px] text-ar-teal uppercase tracking-[0.18em]">FAQ</span>
            <div className="h-[1px] w-12 bg-ar-teal" />
          </div>
          <h3 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Common Questions</h3>
        </div>
        <Accordion items={data.faq} />
      </section>

      <section className="relative py-10 md:py-14 px-6 text-white overflow-hidden">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-head font-normal tracking-[-0.04em] uppercase text-white leading-tight" style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}>
            {data.ctaHeadline[0]}
            <br />
            <span className="text-white/45">{data.ctaHeadline[1]}</span>
          </h2>
          <p className="mt-3 text-[13px] text-white/50 font-sans max-w-md mx-auto leading-relaxed">{data.ctaBody}</p>
          <a href="/shop" className="mt-5 inline-flex items-center justify-center px-8 py-3 min-h-[44px] bg-ar-teal text-ar-navy rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] hover:bg-ar-teal/90 transition-colors" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 12px rgba(45,212,191,0.15)' }} data-testid="final-cta">
            {data.ctaButton}
          </a>
          <div className="mt-3">
            <a href="/shop" className="text-[10px] font-mono uppercase tracking-[0.08em] text-white/50 hover:text-white/70 transition-colors inline-flex items-center gap-1">
              Browse all products <ArrowRight size={9} />
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6"><div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" /></div>

      <div className="py-8 px-6">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.10em] leading-relaxed text-center max-w-3xl mx-auto">
          * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || 'cellunad';
  const data = PRODUCT_DETAIL_DATA[slug as keyof typeof PRODUCT_DETAIL_DATA];

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-head font-bold uppercase">Product Not Found</h1>
          <a href="/shop" className="text-teal-400 font-mono text-sm uppercase tracking-wider hover:text-teal-300 transition-colors" data-testid="link-back-shop">Back to Shop</a>
        </div>
      </div>
    );
  }

  return <ProductDetailPage key={slug} data={data} />;
}
