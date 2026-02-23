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
    subtitle: "Daily NAD+ Support for Energy + DNA Maintenance",
    form: "Capsules",
    serving: "2 capsules daily with a meal (morning or afternoon)",
    servingsPerContainer: 30,
    priceOneTime: 79.99,
    priceSubscribe: 67.99,
    accent: '#1e3a8a',
    accentText: '#60a5fa',
    accentTailwind: 'teal',
    heroCode: 'SYS_COMPONENT // CN_01',
    heroSplit: ['CELLU', 'NAD+.'],
    heroSubExtra: 'Molecular repletion for cellular metabolic flux.',
    supplyLabel: '30 Days',
    purchaseLabel: 'Baseline Protocol',
    subscribeLabel: 'Protocol Sync',
    subscribeDesc: 'Ships monthly. Cancel anytime.',
    onetimeLabel: 'One-time Deployment',
    onetimeDesc: 'Standard retail value.',
    heroClaims: [
      "Supports NAD+ levels*",
      "Supports cellular energy*",
      "Supports DNA maintenance pathways*",
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
      { name: "Nicotinamide Riboside (NR)", dose: "500 mg", role: "NAD+ precursor", explanation: "Supports NAD+ production through well-studied precursor pathways." },
      { name: "Apigenin", dose: "100 mg", role: "NAD+ preservation support", explanation: "Supports NAD+ availability by modulating enzymes involved in NAD+ turnover." },
      { name: "TMG + Methylated B Complex", dose: "TMG 250 mg + B-Complex", role: "Methylation support", explanation: "Supports one-carbon metabolism and methylation balance while running NAD+ support consistently." },
      { name: "R-Lipoic Acid", dose: "200 mg", role: "Mitochondrial cofactor support", explanation: "Supports metabolic enzyme function and oxidative balance." },
      { name: "BioPerine", dose: "5 mg", role: "Absorption support", explanation: "Added to support bioavailability of select compounds." }
    ],
    scienceSection: {
      label: 'Scientific Context',
      headline: 'Why NAD+ Matters',
      paragraphs: [
        'NAD+ is a fundamental coenzyme found in every living cell. It serves as a critical electron transporter in cellular energy metabolism, helping convert nutrients into ATP.',
        'Beyond energy, NAD+ is required for the activity of enzymes involved in DNA maintenance and cellular signaling pathways. Biological NAD+ levels are associated with age and metabolic demands.'
      ],
      diagramLabel: 'SIGNAL_DISTRIBUTION_PATHWAY',
      diagramCenter: { label: 'NAD+ Pool', icon: '' } as { label: string; icon: string } | null,
      diagramNodes: [
        { label: "Energy Metabolism", icon: 'Zap' },
        { label: "DNA Maintenance", icon: 'Dna' },
        { label: "Cellular Signaling", icon: 'Activity' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    mechanisms: [
      { step: "01", label: "Support NAD+ supply", text: "NR provides precursor support for maintaining NAD+ availability." },
      { step: "02", label: "Support NAD+ preservation", text: "Apigenin supports healthy NAD+ turnover dynamics." },
      { step: "03", label: "Support the system that runs it", text: "TMG + methylated Bs support methylation balance; R-lipoic acid supports metabolic function." }
    ],
    mechanismLabel: 'Methodology',
    mechanismHeadline: 'Triple-Action System',
    suitability: [
      "People seeking daily NAD+ support",
      "Focused on energy metabolism",
      "Stacking longevity protocols",
      "Seeking methylation support"
    ],
    safetyNote: 'Consult your clinician prior to deployment if you are pregnant, nursing, on medication, or managing a chronic medical condition.',
    allergenDisclosure: null,
    stack: [
      { name: "CELLUBIOME", slug: "cellubiome", role: "Mitochondria + Gut Barrier", add: "Pairs NAD+ support with mitochondrial quality and gut barrier support.", when: "Daily baseline" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Autophagy + Senescence Support", add: "Periodic reset to complement daily NAD+ support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long does it take to notice effects?", a: "Many assess changes over weeks, with more meaningful evaluation over 2\u20133 months of consistent daily use." },
      { q: "When should I take it?", a: "Take 2 capsules daily with a meal, typically morning or afternoon. Consistency matters more than timing." },
      { q: "Does it break a fast?", a: "It has no meaningful caloric load for most people, but fasting rules vary. If you fast strictly, take it with your first meal." },
      { q: "Can I stack it with CELLUNOVA?", a: "Yes. CELLUNAD+ is designed for daily use, while CELLUNOVA is a periodic protocol." },
      { q: "Why include methylation support?", a: "NAD+ pathways intersect with one-carbon metabolism. TMG and methylated B vitamins support methylation balance during consistent use." },
      { q: "Who should avoid it?", a: "Consult your clinician if pregnant, nursing, on medication, or managing a medical condition." }
    ],
    trust: ["cGMP manufactured", "Third-party tested", "Full-label disclosure", "Glass packaging (if available)"],
    ctaHeadline: ['Initialize', 'Baseline.'],
    ctaBody: 'Deploy CELLUNAD+ for daily mitochondrial infrastructure support.',
    ctaButton: 'Add to Protocol',
    footerTitle: 'CELLUNAD+ PRODUCT SPECIFICATION',
    footerSlide: 'PDP_V1.2'
  },

  cellubiome: {
    name: "CELLUBIOME",
    subtitle: "Mitochondrial + Gut Axis Optimization",
    form: "Enteric Capsules",
    serving: "2 capsules daily",
    servingsPerContainer: 30,
    priceOneTime: 110.00,
    priceSubscribe: 93.50,
    accent: '#19B3A6',
    accentText: '#5eead4',
    accentTailwind: 'teal',
    heroCode: 'CB_01 // COMPONENT',
    heroSplit: ['CELLU', 'BIOME.'],
    heroSubExtra: 'Molecular maintenance for the gut\u2013mitochondria axis.',
    supplyLabel: '30 Day Supply',
    purchaseLabel: 'System Protocol',
    subscribeLabel: 'Protocol Sync',
    subscribeDesc: 'Monthly delivery. Cancel anytime.',
    onetimeLabel: 'One-time Deployment',
    onetimeDesc: 'Standard retail protocol.',
    heroClaims: [
      "Supports mitophagy signaling*",
      "Supports gut barrier integrity*",
      "Enhances mitochondrial renewal*",
      "Supports systemic signal control*"
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
      { name: "Urolithin A", dose: "500 mg", role: "Mitophagy Inducer", explanation: "A clinical-grade dose associated with the activation of mitochondrial recycling pathways (mitophagy)." },
      { name: "Tributyrin", dose: "500 mg", role: "Butyrate Precursor", explanation: "A stable triglyceride form of butyrate that supports intestinal epithelial integrity and fuels colonocytes." },
      { name: "Enteric Delivery", dose: "Targeted Release", role: "Bioavailability Infrastructure", explanation: "Ensures compound protection against gastric acid for precise intestinal deployment." }
    ],
    scienceSection: {
      label: 'Biological Architecture',
      headline: 'The Mitochondria\u2013Gut Axis',
      paragraphs: [
        'Mitochondrial dysfunction drives epithelial stress, while a compromised gut barrier allows biological entropy to inhibit cellular energy production.',
        'CELLUBIOME coordinates mitophagy induction with tight-junction reinforcement to stabilize the feedback loop where systemic energy and inflammatory signaling intersect.'
      ],
      diagramLabel: 'SIGNAL_AXIS_SCHEMATIC',
      diagramCenter: { label: 'Mitochondria', icon: 'Zap' },
      diagramNodes: [
        { label: "Tight Junction Integrity", icon: 'Layers' },
        { label: "Mitophagy Flux", icon: 'ShieldCheck' },
        { label: "Barrier Defense", icon: 'ShieldCheck' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    mechanisms: [
      { step: "01", label: "Support Mitophagy", text: "Urolithin A supports the clearance of dysfunctional mitochondria to maintain energy efficiency." },
      { step: "02", label: "Support Gut Barrier", text: "Tributyrin supports tight junction proteins to maintain intestinal integrity." },
      { step: "03", label: "Synchronize Axis", text: "Coordinated support for mitochondrial function and gut barrier defense to promote healthy aging." }
    ],
    mechanismLabel: 'Mechanism',
    mechanismHeadline: 'Systemic Optimization',
    deliveryRationale: {
      headline: 'Why Enteric Delivery Matters',
      text: 'Tributyrin and Urolithin A require targeted intestinal release. Gastric acid bypass is critical to prevent premature degradation, ensuring high-integrity molecular delivery to the designated intestinal absorption sites.'
    },
    suitability: [
      "Longevity Strategy",
      "Mitochondrial Efficiency",
      "Gut Barrier Defense",
      "NAD+ Protocol Stacking"
    ],
    safetyNote: 'Consult your clinician prior to deployment if you are pregnant, nursing, on medication, or managing a chronic medical condition. Not for pediatric use.',
    allergenDisclosure: null,
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "NAD+ Support", add: "Pairs mitochondrial renewal with NAD+ repletion infrastructure.", when: "Daily baseline" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Autophagy Protocol", add: "Scheduled cellular cleanup phase to complement daily signaling.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long before I notice anything?", a: "Biological priming starts within 72 hours. Measurable evaluation of mitochondrial and barrier markers typically occurs over 8\u201312 weeks of consistent daily use." },
      { q: "Can I take it with food?", a: "Yes. CELLUBIOME is optimized for bioavailability and can be taken with or without a meal. Consistency is more critical than timing." },
      { q: "Is this a probiotic?", a: "No. CELLUBIOME is a signaling protocol. It provides the postbiotic precursor Tributyrin and the mitophagy inducer Urolithin A, not live cultures." },
      { q: "Why 500 mg Urolithin A?", a: "500 mg represents the validated clinical threshold shown in human research to induce significant mitophagy signals at the cellular level." },
      { q: "Why Tributyrin instead of butyrate salts?", a: "Tributyrin is a stable triglyceride that bypasses early GI degradation, ensuring concentrated butyrate delivery directly to the colonocytes." }
    ],
    trust: ["cGMP manufactured", "Third-party tested", "Full-label disclosure", "Enteric-protected"],
    ctaHeadline: ['Initialize', 'Interface.'],
    ctaBody: 'Deploy CELLUBIOME for systemic gut\u2013mitochondria infrastructure support.',
    ctaButton: 'Add to Protocol',
    footerTitle: 'CELLUBIOME PRODUCT SPECIFICATION',
    footerSlide: 'PDP_CB_V1.0'
  },

  cellunova: {
    name: "CELLUNOVA",
    subtitle: "7-Day Autophagy + Senolytic Protocol",
    form: "Capsules",
    serving: "5 capsules daily for 7 consecutive days",
    servingsPerContainer: 7,
    priceOneTime: 145.00,
    priceSubscribe: 123.25,
    accent: '#6C5CE7',
    accentText: '#a78bfa',
    accentTailwind: 'violet',
    heroCode: 'PULSE_PROTOCOL // CV_01',
    heroSplit: ['CELLU', 'NOVA.'],
    heroSubExtra: 'Periodic cellular maintenance and cleanup infrastructure.',
    supplyLabel: '7-Day Cycle',
    purchaseLabel: 'Protocol Access',
    subscribeLabel: 'Protocol Subscription',
    subscribeDesc: 'Scheduled delivery every cycle.',
    onetimeLabel: 'Single Pulse Only',
    onetimeDesc: 'Standard retail protocol.',
    heroClaims: [
      "Supports autophagy pathways*",
      "Supports cellular cleanup processes*",
      "Manages senescent cell burden*",
      "Promotes healthy aging biology*"
    ],
    heroSpecs: [
      { label: "Pulse Mode", dose: "7 Days / Month" },
      { label: "Serving", dose: "5 Capsules" },
      { label: "Target", dose: "Autophagy" }
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
      { name: "Spermidine + Resveratrol", dose: "15 mg / 500 mg", role: "Autophagy Inducers", explanation: "Synergistic activation of macro-autophagy pathways to support the recycling of cytoplasmic components." },
      { name: "Fisetin + Quercetin", dose: "100 mg / 500 mg", role: "Senolytic Support", explanation: "Bioactive flavonoids associated with the management of senescent cell burden and SASP-related signaling." },
      { name: "NAC + Calcium AKG", dose: "600 mg / 300 mg", role: "Metabolic Support", explanation: "Cofactors that support cellular oxidative stress defense and metabolic efficiency during the cleanup phase." }
    ],
    scienceSection: {
      label: 'Scientific Context',
      headline: 'Autophagy & Senescence',
      paragraphs: [
        'Biological aging is associated with the accumulation of dysfunctional protein aggregates and senescent cells. These \u201czombie\u201d cells remain metabolically active but no longer function as intended.',
        'CELLUNOVA is a targeted intervention designed to support the biological mechanisms of autophagy (cellular self-cleaning) and provide senolytic support to manage the systemic burden of aged cellular components.'
      ],
      diagramLabel: 'PULSE_PROTOCOL_MAP',
      diagramCenter: null as { label: string; icon: string } | null,
      diagramNodes: [
        { label: "Cleanup", icon: 'RotateCcw' },
        { label: "Removal", icon: 'Wind' },
        { label: "Recovery", icon: 'Zap' }
      ],
      diagramFooter: { label: 'Scheduled Pulse Model', text: '7 days of high-intensity signaling to support systemic renewal.' }
    },
    mechanisms: [
      { step: "01", label: "Induce Autophagy Pulse", text: "Triggers the biological \u2018cleanup\u2019 mechanism to clear accumulated protein aggregates and damaged organelles." },
      { step: "02", label: "Support Senescent Management", text: "Provides senolytic compounds that help the system manage lingering dysfunctional cells." },
      { step: "03", label: "Systemic Reset", text: "A cyclical protocol designed to refresh cellular infrastructure periodically, rather than daily repletion." }
    ],
    mechanismLabel: 'Protocol Stages',
    mechanismHeadline: 'Triple-Action Reset',
    suitability: [
      "Longevity Strategy",
      "Periodic Cellular Cleanup",
      "Advanced Protocol Users",
      "Aging Biomarker Management"
    ],
    safetyNote: 'Consult your clinician prior to deployment if you are pregnant, nursing, or managing a medical condition.',
    allergenDisclosure: 'ALLERGEN DISCLOSURE: CONTAINS WHEAT (GERM DERIVED SPERMIDINE)',
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "Daily Repletion", add: "Runs NAD+ repletion daily; use CELLUNOVA as a monthly protocol reset.", when: "Daily baseline" },
      { name: "CELLUBIOME", slug: "cellubiome", role: "Mitochondria + Gut", add: "Pair gut signaling maintenance with a periodic cellular cleanup pulse.", when: "Daily baseline" }
    ],
    faq: [
      { q: "Is this a daily supplement?", a: "No. CELLUNOVA is a high-intensity pulse protocol. It is designed to be taken for 7 consecutive days once per month to facilitate periodic cellular maintenance." },
      { q: "Does it contain wheat?", a: "Yes. The Spermidine in CELLUNOVA is derived from Wheat Germ. Those with gluten sensitivities should exercise caution." },
      { q: "Why 5 capsules daily?", a: "To achieve the clinical thresholds required for autophagy signaling and senolytic support, a higher volume of bioactive compounds is necessary." },
      { q: "Can I stack it with daily NAD+ support?", a: "Yes. Many users continue their CELLUNAD+ protocol alongside the 7-day CELLUNOVA cycle to maintain metabolic flux during the cleanup phase." },
      { q: "How often should I run the protocol?", a: "Most clinicians suggest a monthly 7-day cycle. Some advanced users run the protocol every 60 or 90 days depending on biological age markers." }
    ],
    trust: ["Contains Wheat", "7-Day Pulse Model", "Third-Party Tested", "cGMP Verified"],
    ctaHeadline: ['Initialize', 'Cleanup.'],
    ctaBody: 'Deploy CELLUNOVA for periodic cellular reset and senolytic support.',
    ctaButton: 'Initialize Pulse',
    footerTitle: 'CELLUNOVA PRODUCT SPECIFICATION',
    footerSlide: 'PDP_CV_V1.0'
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
            <p className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] opacity-40 leading-none mb-1">Add to Protocol</p>
            <h4 className="text-sm font-head font-bold tracking-tight uppercase leading-none">{data.name}</h4>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none text-right pr-4 border-r border-black/10">
              <span className="text-lg font-head font-bold tracking-tighter">${(currentPrice * quantity).toFixed(2)}</span>
            </div>
            <button className="flex-1 sm:flex-none py-3 px-8 bg-[#0b1120] text-white font-mono text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-black transition-all min-h-[44px]" data-testid="sticky-cta">
              Initialize
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
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px]" style={{ background: accentColor }} />
                <span className="font-mono text-[11px] font-bold tracking-[0.20em] uppercase" style={{ color: accentColor }}>{data.heroCode}</span>
              </div>
              <h1 className="text-[56px] md:text-[80px] lg:text-[90px] font-head font-bold tracking-[-0.04em] leading-[0.85] uppercase">
                {data.heroSplit[0]}<br /><span className="text-white/40">{data.heroSplit[1]}</span>
              </h1>
              <p className="text-[20px] md:text-[24px] text-white/70 font-sans font-light leading-snug max-w-xl">
                {data.subtitle}. <br />
                <span className="text-white font-normal">{data.heroSubExtra}</span>
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
            <div className="bg-[#F4F1EA] text-[#0b1120] p-7 md:p-9 shadow-[30px_30px_100px_rgba(0,0,0,0.4)] space-y-7">
              <div className="flex justify-between items-baseline border-b border-black/5 pb-5">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase font-bold tracking-[0.12em] opacity-40">{data.purchaseLabel}</p>
                  <h3 className="text-4xl md:text-5xl font-head font-bold tracking-tighter">
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

              <button className="w-full py-5 bg-[#0b1120] text-white font-mono text-[12px] font-bold uppercase tracking-[0.18em] hover:bg-black transition-all flex items-center justify-center gap-3 min-h-[52px]" data-testid="add-to-protocol">
                Add to Protocol <ArrowRight size={16} />
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
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold" style={{ color: accentColor }}>{data.scienceSection.label}</p>
                <h2 className="text-[34px] md:text-[40px] font-head font-bold tracking-[-0.02em] uppercase leading-none">{data.scienceSection.headline}</h2>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold" style={{ color: accentColor }}>{data.mechanismLabel}</p>
            <h2 className="text-[34px] md:text-[40px] font-head font-bold uppercase tracking-tight">{data.mechanismHeadline}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {data.mechanisms.map((m, i) => (
              <div key={i} className="p-8 md:p-10 border border-white/10 bg-white/[0.03] space-y-5 group hover:border-opacity-30 transition-all" style={{ ['--hover-border' as string]: accentColor }}>
                <span className="font-mono text-[10px] font-bold uppercase opacity-40" style={{ color: accentColor }}>Step_{m.step}</span>
                <div className="space-y-3">
                  <h4 className="text-lg md:text-xl font-head font-bold uppercase tracking-tight group-hover:opacity-90 transition-colors">{m.label}</h4>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold" style={{ color: accentColor }}>Specifications</p>
            <h2 className="text-[34px] md:text-[40px] font-head font-bold uppercase tracking-tight leading-none">Active Inputs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.keyActives.map((active, i) => (
              <div key={i} className="p-7 md:p-8 border border-white/10 bg-[#0b1120] space-y-5 flex flex-col justify-between hover:bg-white/[0.03] transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-base md:text-lg font-head font-bold uppercase tracking-tight max-w-[70%]">{active.name}</h4>
                    <span className="font-mono text-[10px] font-bold uppercase shrink-0" style={{ color: accentColor }}>{active.dose}</span>
                  </div>
                  <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.12em]">{active.role}</p>
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
        <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px] text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center p-4 border-2 border-dashed rounded-full" style={{ borderColor: `${accentColor}30` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${data.accent}15` }}>
                <FlaskConical size={20} style={{ color: accentColor }} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-head font-bold uppercase tracking-tight">{(data as any).deliveryRationale.headline}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-sans font-medium">{(data as any).deliveryRationale.text}</p>
            </div>
          </div>
        </section>
      )}

      <section className="pdp-reveal py-20 md:py-24 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
            <h2 className="text-[34px] md:text-[40px] font-head font-bold uppercase leading-none tracking-tight">System Suitability</h2>
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
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em]">Protocol Directive</p>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold" style={{ color: accentColor }}>Synergy</p>
            <h2 className="text-[34px] md:text-[40px] font-head font-bold uppercase tracking-tight">Built to Stack</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.stack.map((item, i) => (
              <div key={i} className="border border-white/10 bg-[#0b1120] p-8 md:p-10 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] transition-all" style={{ background: `${data.accent}08` }} />
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center gap-3">
                    <h4 className="text-xl md:text-2xl font-head font-bold uppercase tracking-tight">{item.name}</h4>
                    <span className="font-mono text-[9px] border px-2 py-1 uppercase shrink-0" style={{ color: accentColor, borderColor: `${accentColor}30` }}>{item.role}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-sans font-medium">{item.add}</p>
                </div>
                <div className="flex items-center gap-3 font-mono text-[9px] text-white/30 uppercase tracking-[0.14em] relative z-10">
                  <Clock size={12} /> Sync: {item.when}
                </div>
                <div className="flex gap-3 pt-2 relative z-10">
                  <a href={`/product/${item.slug}`} className="flex-1 py-3.5 border border-white/10 font-mono text-[10px] font-bold uppercase tracking-[0.10em] hover:bg-white/[0.04] transition-all text-center min-h-[44px] flex items-center justify-center" data-testid={`stack-view-${item.slug}`}>View</a>
                  <button className="flex-1 py-3.5 bg-white text-[#0b1120] font-mono text-[10px] font-bold uppercase tracking-[0.10em] hover:opacity-90 transition-all min-h-[44px]" data-testid={`stack-add-${item.slug}`}>Add</button>
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
        <h3 className="text-2xl md:text-3xl font-head font-bold uppercase tracking-tight text-center">Protocol Queries</h3>
        <Accordion items={data.faq} />
      </section>

      <section className="py-28 md:py-40 px-5 md:px-10 lg:px-[60px] relative overflow-hidden border-t border-white/10 text-center">
        <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(circle at center, ${data.accent} 0%, #0b1120 120%)` }} />
        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-head font-bold uppercase tracking-[-0.04em] leading-[0.85]">
              {data.ctaHeadline[0]} <br /> {data.ctaHeadline[1]}
            </h2>
            <p className="font-mono text-[11px] md:text-[12px] text-white/40 uppercase tracking-[0.20em]">{data.ctaBody}</p>
          </div>
          <button className="px-12 md:px-16 py-5 md:py-6 bg-white text-[#0b1120] font-mono text-[11px] md:text-[12px] font-bold tracking-[0.20em] uppercase hover:opacity-90 transition-all shadow-2xl min-h-[52px]" data-testid="final-cta">
            {data.ctaButton}
          </button>
        </div>
      </section>

      <div className="w-full h-[70px] md:h-[80px] px-5 md:px-[60px] flex items-center justify-between z-50 border-t border-white/[0.05] bg-[#0b1120]">
        <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.14em]">
          {data.footerTitle} // AR_SYS_ID_V1.0
        </div>
        <div className="hidden md:flex items-center gap-10 font-mono text-[9px] text-white/30 uppercase tracking-[0.14em]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: accentColor }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: accentColor }} />
            </span>
            <span>PROTOCOL_SYNCED</span>
          </div>
          <span>SYS_DATA_{data.footerSlide}</span>
        </div>
      </div>

      <div className="bg-[#0b1120] py-12 md:py-16 px-5 md:px-[60px] border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.10em] leading-relaxed">
            * These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. // Age Revive Precision Longevity // &copy; 2026.
          </p>
        </div>
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
