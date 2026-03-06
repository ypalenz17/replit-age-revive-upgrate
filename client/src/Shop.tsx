import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import {
  ArrowRight,
  X,
} from 'lucide-react';
import { useParams } from 'wouter';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteNavbar from './components/SiteNavbar';
import Footer from './components/Footer';
import { BrandName } from './productsData';
import { useCart } from './cartStore';

gsap.registerPlugin(ScrollTrigger);

function hexToRgba(hex: string, alpha = 1) {
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

const COPY_MAP = {
  cellunad: {
    overline: 'Foundation Layer',
    subtitle: 'Precision NAD+ support with methylation co-factors. Every dose disclosed.',
    microLine: '2 capsules daily \u2022 NAD+ metabolism + methylation support',
    narrative: {
      label: 'Foundation Layer',
      headline: 'Your energy system has a supply chain.',
      bodyLines: [
        'Energy rarely collapses overnight. It erodes.',
        'When NAD+ pools decline, repair slows.',
        'When repair slows, output drifts.',
        'CELLUNAD+ keeps the baseline intact.'
      ]
    },
    telemetry: {
      headline: 'Biological response, quantified.',
      body: 'If you can\'t measure change, you\'re guessing. Protocol inputs paired with measurable feedback.',
      rows: [
        { label: 'NAD+ Pathway Activity', metric: 'Substrate + cofactor alignment' },
        { label: 'Redox Balance', metric: 'Steady-state output support' },
        { label: 'Methylation Support', metric: 'Cofactor sufficiency cues' }
      ]
    },
    spec: {
      meta: 'Actives: 8 \u2022 Serving: 2 capsules daily',
      reassurance: 'All dosages reflect clinically studied ranges and bioavailable forms.',
      declaration: 'No proprietary formulations.'
    },
    arc: {
      headline: 'What you may notice over time.',
      subline: 'Response varies. Consistency compounds.',
      phases: [
        { phase: 'I', label: 'Calibration', time: 'Days 1\u20133', desc: 'Routine locks in. Inputs become consistent.' },
        { phase: 'II', label: 'Stabilization', time: 'Week 1\u20132', desc: 'Steady daily support. Less "spike," more baseline.' },
        { phase: 'III', label: 'Integration', time: 'Week 3\u20134', desc: 'Compounding effect. This becomes your default.' }
      ]
    },
    close: {
      headline: 'Build a baseline that doesn\'t rely on motivation.',
      body: 'If you\'re serious about longevity, consistency is the advantage.'
    }
  },
  cellubiome: {
    overline: 'Signal Stability',
    subtitle: 'Urolithin A + Tributyrin. Two ingredients, one gut-mitochondria axis.',
    microLine: '2 enteric-coated capsules daily \u2022 Gut barrier + mito renewal support',
    narrative: {
      label: 'Signal Stability',
      headline: 'Your gut is an energy organ.',
      bodyLines: [
        'When gut signaling is unstable, energy feels noisy.',
        'Not exhausted.',
        'Unstable.',
        'CELLUBIOME restores signal precision.'
      ]
    },
    telemetry: {
      headline: 'Signal, measured over time.',
      body: 'Signals show up before "feelings." Measurable feedback reduces guesswork.',
      rows: [
        { label: 'Gut Resilience Signals', metric: 'Consistency + tolerance cues' },
        { label: 'Mitochondrial Efficiency', metric: 'Recovery + output stability cues' },
        { label: 'Inflammation Balance', metric: 'Resilience trend cues' }
      ]
    },
    spec: {
      meta: 'Actives: 2 \u2022 Serving: 2 enteric caps daily',
      reassurance: 'Full dosing disclosed. Focused inputs, no filler complexity.',
      declaration: 'No proprietary formulations.'
    },
    arc: {
      headline: 'What you may notice over time.',
      subline: 'The signal stabilizes before it feels dramatic.',
      phases: [
        { phase: 'I', label: 'Calibration', time: 'Days 1\u20133', desc: 'Routine locks in. Consistent input begins.' },
        { phase: 'II', label: 'Stabilization', time: 'Week 1\u20132', desc: 'Tolerance cues become clearer.' },
        { phase: 'III', label: 'Integration', time: 'Week 3\u20134', desc: 'More reliable output, less "noise."' }
      ]
    },
    close: {
      headline: 'Fix the signal. Then everything performs better.',
      body: 'Build the foundation you can actually stack on.'
    }
  },
  cellunova: {
    overline: 'Controlled Reset',
    subtitle: 'Ten compounds. Seven days on. The off-cycle is part of the design.',
    microLine: '5 capsules daily \u2022 7-day monthly cycle \u2022 Autophagy + cellular maintenance',
    narrative: {
      label: 'Controlled Reset',
      headline: 'Progress requires renewal.',
      bodyLines: [
        'Daily inputs build.',
        'Cycles recalibrate.',
        'CELLUNOVA introduces structured renewal',
        'without extremes.'
      ]
    },
    telemetry: {
      headline: 'Cycles make signal easier to see.',
      body: 'A short window makes changes easier to observe and compare over time.',
      rows: [
        { label: 'Recovery Signal', metric: 'Sleep + training tolerance cues' },
        { label: 'Inflammation Balance', metric: 'Resilience trend cues' },
        { label: 'Output Stability', metric: 'Week-to-week consistency' }
      ]
    },
    spec: {
      meta: 'Actives: 10 \u2022 Protocol: 7 days (5 caps daily)',
      reassurance: 'Full dosing disclosed. Built as a cycle, not a daily stimulant.',
      declaration: 'No proprietary formulations.',
      microNote: 'Contains wheat (spermidine source).'
    },
    arc: {
      headline: 'What the 7-day cycle feels like.',
      subline: 'Keep the cadence. Don\'t chase intensity.',
      phases: [
        { phase: 'I', label: 'Initiation', time: 'Days 1\u20132', desc: 'You may feel different or feel nothing. Both are normal.' },
        { phase: 'II', label: 'Engagement', time: 'Days 3\u20135', desc: 'The cycle becomes steadier. Focus on routine.' },
        { phase: 'III', label: 'Completion', time: 'Days 6\u20137', desc: 'Finish clean. Consistency matters more than sensation.' },
        { phase: 'IV', label: 'Return', time: 'Post-cycle', desc: 'Resume your daily stack. Repeat monthly if it fits your system.' }
      ]
    },
    close: {
      headline: 'The reset is the advantage.',
      body: 'A short, repeatable cadence beats sporadic extremes.'
    }
  }
};

const SHARED_STANDARDS = [
  { label: 'Third-Party Tested', desc: 'Independent lab verification' },
  { label: 'Standardized Actives', desc: 'Precise concentration control' },
  { label: 'Delivery Matters', desc: 'Form + release designed per protocol' },
  { label: 'Quality Control', desc: 'Multi-stage review process' }
];

const PRODUCTS = {
  cellunad: {
    id: 'cellunad',
    name: 'CELLUNAD+',
    category: 'Daily NAD+ Foundation',
    tagline: 'Precision NAD+ support with methylation co-factors. Every dose disclosed.',
    description:
      'NR + TMG + Apigenin and 5 more actives. Full-dose transparency.',
    price: '$79.99',
    serving: '2 capsules daily',
    specRow: 'Glass bottle \u2022 UV-protected',
    accent: '#1e3a8a',
    accentText: '#60a5fa',
    heroImage: '/images/cellunad-render.png',
    outcomes: [
      'Cellular energy + resilience',
      'NAD+ metabolism + replenishment',
      'Redox + methylation support'
    ],
    ingredients: [
      { name: 'Nicotinamide Riboside (NR)', dose: '500 mg', purpose: 'NAD+ precursor support',
        mechanism: 'NR is phosphorylated by NR kinases to form NMN, then converted to NAD+ via the salvage pathway, bypassing rate-limiting NAMPT.',
        refs: [
          { title: 'Trammell SA et al. Nicotinamide riboside is uniquely and orally bioavailable in mice and humans. Nat Commun. 2016;7:12948.', doi: '10.1038/ncomms12948' },
          { title: 'Martens CR et al. Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD+ in healthy middle-aged and older adults. Nat Commun. 2018;9:1286.', doi: '10.1038/s41467-018-03421-7' }
        ]},
      { name: 'R-Lipoic Acid', dose: '200 mg', purpose: 'Mitochondrial redox balance support',
        mechanism: 'R-lipoic acid functions as a mitochondrial cofactor for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase, regenerating endogenous antioxidants including glutathione and vitamin C.',
        refs: [
          { title: 'Shay KP et al. Alpha-lipoic acid as a dietary supplement: molecular mechanisms and therapeutic potential. Biochim Biophys Acta. 2009;1790(10):1149-1160.', doi: '10.1016/j.bbagen.2009.07.026' }
        ]},
      { name: 'Apigenin', dose: '100 mg', purpose: 'NAD+ pathway support',
        mechanism: 'Apigenin inhibits CD38, a major NAD+-consuming enzyme, thereby preserving intracellular NAD+ pools and supporting sirtuin activity.',
        refs: [
          { title: 'Escande C et al. Flavonoid apigenin is an inhibitor of the NAD+ase CD38. J Biol Chem. 2013;288(15):10258-10266.', doi: '10.1074/jbc.M112.442103' }
        ]},
      { name: 'Betaine (TMG)', dose: '250 mg', purpose: 'Methylation support',
        mechanism: 'TMG donates methyl groups to homocysteine via betaine-homocysteine methyltransferase (BHMT), supporting the methionine cycle and reducing homocysteine accumulation.',
        refs: [
          { title: 'Olthof MR et al. Effect of homocysteine-lowering nutrients on blood lipids: results from randomised placebo-controlled studies. PLoS Med. 2005;2(5):e135.', doi: '10.1371/journal.pmed.0020135' }
        ]},
      { name: 'P-5-P (active B6)', dose: '10 mg', purpose: 'Cofactor support',
        mechanism: 'Pyridoxal-5\'-phosphate is the active coenzyme form of vitamin B6, required for over 100 enzymatic reactions including transamination, decarboxylation, and one-carbon metabolism.',
        refs: [
          { title: 'Leklem JE. Vitamin B-6: a status report. J Nutr. 1990;120(Suppl 11):1503-1507.', doi: '10.1093/jn/120.suppl_11.1503' }
        ]},
      { name: '5-MTHF', dose: '400 mcg DFE', purpose: 'Folate cycle support',
        mechanism: '5-methyltetrahydrofolate is the primary circulating form of folate and the direct methyl donor for homocysteine remethylation to methionine via methionine synthase.',
        refs: [
          { title: 'Scaglione F, Panzavolta G. Folate, folic acid and 5-methyltetrahydrofolate are not the same thing. Xenobiotica. 2014;44(5):480-488.', doi: '10.3109/00498254.2013.845705' }
        ]},
      { name: 'Methylcobalamin', dose: '1,000 mcg', purpose: 'B12 support',
        mechanism: 'Methylcobalamin serves as a cofactor for methionine synthase, directly participating in homocysteine remethylation and supporting myelin synthesis and neuronal function.',
        refs: [
          { title: 'Paul C, Brady DM. Comparative bioavailability and utilization of particular forms of B12 supplements. Integr Med (Encinitas). 2017;16(1):42-49.' }
        ]},
      { name: 'BioPerine', dose: '5 mg', purpose: 'Bioavailability support',
        mechanism: 'Piperine inhibits hepatic and intestinal glucuronidation, extending the bioavailability window of co-administered compounds.',
        refs: [
          { title: 'Shoba G et al. Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers. Planta Med. 1998;64(4):353-356.', doi: '10.1055/s-2006-957450' }
        ]}
    ],
    telemetry: ['NAD+ Support', 'Cellular Energy', 'Redox Balance']
  },

  cellubiome: {
    id: 'cellubiome',
    name: 'CELLUBIOME',
    category: 'Daily Gut-Mito Support',
    tagline: 'Urolithin A + Tributyrin. Two ingredients, one gut-mitochondria axis.',
    description:
      'Urolithin A + Tributyrin. Enteric-coated, two-compound precision.',
    price: '$110.00',
    serving: '2 enteric caps daily',
    specRow: 'Glass bottle \u2022 UV-protected',
    accent: '#19B3A6',
    accentText: '#5eead4',
    heroImage: '/images/cellubiome-render.png',
    outcomes: [
      'Gut barrier integrity + digestive resilience',
      'Mito efficiency + recovery support',
      'Output consistency (sleep, training, daily)'
    ],
    ingredients: [
      { name: 'Urolithin A (≥99%)', dose: '500 mg', purpose: 'Mitochondrial recycling signal support',
        mechanism: 'Urolithin A activates mitophagy via PINK1/Parkin-dependent and independent pathways, selectively clearing dysfunctional mitochondria and stimulating biogenesis of replacement organelles.',
        refs: [
          { title: 'Ryu D et al. Urolithin A induces mitophagy and prolongs lifespan in C. elegans and increases muscle function in rodents. Nat Med. 2016;22(8):879-888.', doi: '10.1038/nm.4132' },
          { title: 'Andreux PA et al. The mitophagy activator urolithin A is safe and induces a molecular signature of improved mitochondrial and cellular health in humans. Nat Metab. 2019;1(6):595-603.', doi: '10.1038/s42255-019-0073-4' }
        ]},
      { name: 'Tributyrin', dose: '500 mg', purpose: 'Postbiotic support (butyrate delivery)',
        mechanism: 'Tributyrin is a triglyceride pro-drug that releases butyrate in the intestinal lumen, supporting colonocyte energy metabolism, tight junction integrity, and HDAC inhibition-mediated anti-inflammatory signaling.',
        refs: [
          { title: 'Donohoe DR et al. The microbiome and butyrate regulate energy metabolism and autophagy in the mammalian colon. Cell Metab. 2011;13(5):517-526.', doi: '10.1016/j.cmet.2011.02.018' },
          { title: 'Cresci GA et al. Tributyrin supplementation protects from diet-induced obesity and from intestinal inflammation. FASEB J. 2014;28(1 Suppl):372.7.' }
        ]}
    ],
    telemetry: ['Gut Signaling', 'Mito Renewal', 'Postbiotic Support'],
  },

  cellunova: {
    id: 'cellunova',
    name: 'CELLUNOVA',
    category: '7-Day Monthly Protocol',
    tagline: 'Ten compounds. Seven days on. The off-cycle is part of the design.',
    description:
      '10 actives. 7-day monthly cycle. Fully disclosed dosing.',
    price: '$49.99',
    serving: '5 caps/day for 7 days',
    specRow: 'Glass bottle \u2022 UV-protected',
    warnings: 'Contains wheat (spermidine source).',
    accent: '#6C5CE7',
    accentText: '#a78bfa',
    heroImage: '/images/cellunova-trimmed.png',
    outcomes: [
      'Autophagy + renewal pathways',
      'Oxidative balance + antioxidant defense',
      'Resilience during higher load'
    ],
    ingredients: [
      { name: 'NAC', dose: '600 mg', purpose: 'Glutathione support',
        mechanism: 'N-acetylcysteine provides cysteine for glutathione synthesis, the primary intracellular antioxidant, and directly scavenges reactive oxygen species.',
        refs: [
          { title: 'Mokhtari V et al. A review on various uses of N-acetyl cysteine. Cell J. 2017;19(1):11-17.', doi: '10.22074/cellj.2016.4872' }
        ]},
      { name: 'Trans-Resveratrol', dose: '500 mg', purpose: 'Polyphenol support',
        mechanism: 'Trans-resveratrol activates SIRT1 and AMPK signaling, modulating mitochondrial biogenesis, autophagy, and inflammatory gene expression.',
        refs: [
          { title: 'Baur JA et al. Resveratrol improves health and survival of mice on a high-calorie diet. Nature. 2006;444(7117):337-342.', doi: '10.1038/nature05354' },
          { title: 'Timmers S et al. Calorie restriction-like effects of 30 days of resveratrol supplementation on energy metabolism and metabolic profile in obese humans. Cell Metab. 2011;14(5):612-622.', doi: '10.1016/j.cmet.2011.10.002' }
        ]},
      { name: 'Quercetin', dose: '500 mg', purpose: 'Cellular housekeeping support',
        mechanism: 'Quercetin is studied in senescence research for its effects on pro-survival networks in senescent cells, particularly the BCL-2/BCL-XL pathway.',
        refs: [
          { title: 'Zhu Y et al. The Achilles\' heel of senescent cells: from transcriptome to senolytic drugs. Aging Cell. 2015;14(4):644-658.', doi: '10.1111/acel.12344' }
        ]},
      { name: 'Fisetin', dose: '100 mg', purpose: 'Cellular maintenance support',
        mechanism: 'Fisetin is studied in senescence research for its effects on senescence-associated secretory phenotype (SASP) factors and senescent cell clearance pathways.',
        refs: [
          { title: 'Yousefzadeh MJ et al. Fisetin is a senotherapeutic that extends health and lifespan. EBioMedicine. 2018;36:18-28.', doi: '10.1016/j.ebiom.2018.09.015' }
        ]},
      { name: 'Green Tea Extract (50% EGCG)', dose: '300 mg', purpose: 'Antioxidant support',
        mechanism: 'EGCG modulates multiple signaling cascades including NF-kB, MAPK, and PI3K/Akt, while directly chelating metal ions and scavenging free radicals.',
        refs: [
          { title: 'Nagle DG et al. Epigallocatechin-3-gallate (EGCG): chemical and biomedical perspectives. Phytochemistry. 2006;67(17):1849-1855.', doi: '10.1016/j.phytochem.2006.06.020' }
        ]},
      { name: 'Spermidine (wheat germ)', dose: '15 mg', purpose: 'Autophagy pathway support',
        mechanism: 'Spermidine induces autophagy through inhibition of EP300 acetyltransferase and hypusination of eIF5A, promoting cellular renewal and extending lifespan in model organisms.',
        refs: [
          { title: 'Eisenberg T et al. Cardioprotection and lifespan extension by the natural polyamine spermidine. Nat Med. 2016;22(12):1428-1438.', doi: '10.1038/nm.4222' }
        ]},
      { name: 'Astaxanthin', dose: '4 mg', purpose: 'Oxidative stress defense support',
        mechanism: 'Astaxanthin spans the lipid bilayer, quenching singlet oxygen and peroxyl radicals in both the inner and outer membrane leaflets without pro-oxidant activity.',
        refs: [
          { title: 'Fassett RG, Coombes JS. Astaxanthin: a potential therapeutic agent in cardiovascular disease. Mar Drugs. 2011;9(3):447-465.', doi: '10.3390/md9030447' }
        ]},
      { name: 'PQQ', dose: '10 mg', purpose: 'Mitochondrial cofactor support',
        mechanism: 'Pyrroloquinoline quinone activates PGC-1α signaling, promoting mitochondrial biogenesis and protecting against oxidative stress-induced mitochondrial dysfunction.',
        refs: [
          { title: 'Chowanadisai W et al. Pyrroloquinoline quinone stimulates mitochondrial biogenesis through cAMP response element-binding protein phosphorylation. J Biol Chem. 2010;285(1):142-152.', doi: '10.1074/jbc.M109.030130' }
        ]},
      { name: 'Calcium Alpha-Ketoglutarate', dose: '300 mg', purpose: 'Metabolic support',
        mechanism: 'Alpha-ketoglutarate is a key TCA cycle intermediate and co-substrate for alpha-ketoglutarate-dependent dioxygenases including TET enzymes involved in DNA demethylation.',
        refs: [
          { title: 'Asadi Shahmirzadi A et al. Alpha-ketoglutarate, an endogenous metabolite, extends lifespan and compresses morbidity in aging mice. Cell Metab. 2020;32(3):447-456.', doi: '10.1016/j.cmet.2020.08.004' }
        ]},
      { name: 'BioPerine', dose: '5 mg', purpose: 'Bioavailability support',
        mechanism: 'Piperine inhibits hepatic and intestinal glucuronidation, extending the bioavailability window of co-administered compounds.',
        refs: [
          { title: 'Shoba G et al. Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers. Planta Med. 1998;64(4):353-356.', doi: '10.1055/s-2006-957450' }
        ]}
    ],
    telemetry: ['Autophagy Support', 'Mitochondrial Resilience', 'Phase Design']
  }
};

type ProductId = keyof typeof PRODUCTS;
type ProductData = (typeof PRODUCTS)[ProductId];
type ProductIngredient = ProductData['ingredients'][number];
type ProductIngredientRef = NonNullable<ProductIngredient['refs']>[number];
type ProductCopy = (typeof COPY_MAP)[ProductId];
type SidePanelKey = 'ingredients' | 'rationale';

type CompoundRowProps = {
  ing: ProductIngredient;
  accentText: string;
  isLast: boolean;
  index: number;
};

type IngredientPanelProps = {
  ingredients: ProductIngredient[];
  accentText: string;
};

type MagneticButtonProps = {
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
};

type SideSheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

type ProductTemplateProps = {
  product: ProductData;
};

function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.035]" aria-hidden="true">
      <svg width="100%" height="100%">
        <filter id="shopNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#shopNoise)" />
      </svg>
    </div>
  );
}


function CompoundRow({ ing, accentText, isLast, index }: CompoundRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-baseline justify-between py-3 gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-sans font-bold text-white leading-tight break-words">{ing.name}</p>
          <p className="text-[11px] font-mono text-white/65 mt-0.5 uppercase tracking-[0.03em]">{ing.purpose}</p>
          {ing.refs && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[8px] font-mono tracking-[0.04em] mt-0.5 hover:opacity-80"
              style={{ color: accentText, opacity: 0.6 }}
              data-testid={`ref-toggle-${ing.name.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {expanded ? 'Close' : 'References'}
            </button>
          )}
        </div>
        <span className="text-[13px] font-mono font-bold text-white shrink-0 tabular-nums">{ing.dose}</span>
      </div>

      {expanded && (
        <div className="pb-3 pt-0.5" data-testid={`ref-panel-${ing.name.replace(/\s+/g, '-').toLowerCase()}`}>
          {ing.mechanism && (
            <div className="mb-3">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-white/35 block mb-1">Mechanism</span>
              <p className="text-[11px] font-sans text-white/55 leading-relaxed">{ing.mechanism}</p>
            </div>
          )}
          {ing.refs && ing.refs.length > 0 && (
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-white/35 block mb-1.5">Clinical Evidence</span>
              <div className="space-y-1.5">
                {ing.refs.map((ref: ProductIngredientRef, ri: number) => (
                  <p key={ri} className="text-[10px] font-mono text-white/40 leading-relaxed break-words">
                    [{ri + 1}] {ref.title}
                    {'doi' in ref && ref.doi && (
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 hover:opacity-80 break-all"
                        style={{ color: accentText, opacity: 0.6 }}
                        data-testid={`doi-link-${index}-${ri}`}
                      >
                        doi:{ref.doi}
                      </a>
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLast && <div className="h-px bg-white/[0.025]" />}
    </div>
  );
}

function IngredientPanel({ ingredients, accentText }: IngredientPanelProps) {
  return (
    <div className="space-y-0">
      {ingredients.map((ing, i) => (
        <CompoundRow key={i} ing={ing} accentText={accentText} isLast={i === ingredients.length - 1} index={i} />
      ))}
    </div>
  );
}



function MagneticButton({ className = '', children, onClick, type = 'button', style = {} }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = btnRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

      const onMove = (e: MouseEvent) => {
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
    <button ref={btnRef} type={type} onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}

function SideSheet({ open, title, onClose, children }: SideSheetProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let ctx: gsap.Context | null = null;

    if (!reducedMotion && sheetRef.current) {
      const el = sheetRef.current;
      const panel = el.querySelector<HTMLElement>('[data-panel]');
      const overlay = el.querySelector<HTMLElement>('[data-overlay]');

      if (panel && overlay) {
        ctx = gsap.context(() => {
          gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
          gsap.fromTo(panel, { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
        }, sheetRef);
      }
    }

    return () => {
      ctx?.revert();
      document.body.style.overflow = prev;
    };
  }, [open, reducedMotion]);

  if (!open) return null;

  return (
    <div ref={sheetRef} className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div data-overlay className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div data-panel className="relative w-full max-w-md bg-[#111827] h-full shadow-float p-10 md:p-12 overflow-y-auto border-l border-white/[0.08] rounded-l-2xl">
        <button onClick={onClose} className="absolute top-7 right-7 p-2 rounded-lg hover:bg-white/10 transition-colors text-white min-h-[44px]" aria-label="Close panel" data-testid="button-close-sidesheet-shop">
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

function ProductTemplate({ product }: ProductTemplateProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeSidePanel, setActiveSidePanel] = useState<SidePanelKey | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const cart = useCart();

  const addCurrentProductToCart = () => {
    const parsedPrice = Number.parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    cart.addItem({
      slug: product.id,
      name: product.name,
      image: product.heroImage,
      price,
      isSubscribe: true,
      frequency: product.id === 'cellunova' ? '7-day cycle' : 'Delivered monthly',
    });
  };

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());
    ScrollTrigger.clearScrollMemory?.();

    const ctx = gsap.context(() => {
      gsap.from('.hero-content', { opacity: 0, y: 46, duration: 1.05, ease: 'power4.out', delay: 0.18 });
      gsap.from('.buy-panel', { opacity: 0, x: 34, duration: 1.05, ease: 'power4.out', delay: 0.28 });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          opacity: 0,
          y: 28,
          duration: 0.9,
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

  const accent = product.accent;
  const accentGlow = hexToRgba(accent, 0.55);
  const accentText = product.accentText || accent;
  const copy: ProductCopy = COPY_MAP[product.id as ProductId];
  const productWarnings = 'warnings' in product ? product.warnings : undefined;
  const specMicroNote = 'microNote' in copy.spec ? copy.spec.microNote : undefined;
  const productThemeVars = {
    '--accent': accent,
    '--accentGlow': accentGlow,
  } as CSSProperties & { '--accent': string; '--accentGlow': string };

  return (
    <main ref={containerRef} style={productThemeVars} className="relative bg-[#131d2e] text-white selection:bg-ar-teal selection:text-white">
      <div className="fixed inset-0 z-0 bg-[#131d2e]">
        <img
          src="https://images.unsplash.com/photo-1614850523296-e8c041de4398?auto=format&fit=crop&q=80&w=2400"
          className="w-full h-full object-cover grayscale opacity-30 mix-blend-screen"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#182840_0%,_#131d2e_120%)] opacity-80" />
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.012]"
        style={{
          backgroundImage: 'linear-gradient(#F4F1EA 1px, transparent 1px), linear-gradient(90deg, #F4F1EA 1px, transparent 1px)',
          backgroundSize: '120px 120px'
        }}
      />
      <div className="relative z-[2]">
      <NoiseOverlay />
      <SiteNavbar />

      <section className="hero relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, #162336 0%, rgba(15,23,42,0.85) 12%, transparent 35%)' }} />
        <div className="absolute inset-0 z-[2] opacity-[0.20] pointer-events-none" style={{ background: `radial-gradient(700px 500px at 20% 75%, ${accentGlow}, transparent 60%)` }} />

        {product.id === 'cellubiome' && (
          <>
            <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(600px 500px at 60% 55%, rgba(20,184,166,0.15), transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-[20%] z-[3] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.5), transparent)' }} />
          </>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 px-5 md:px-8 pt-28 md:pt-32 pb-10 md:pb-16 md:items-center min-h-[100dvh] md:min-h-0">

          <div className="w-full md:w-3/5 hero-content text-white text-center md:text-left relative">
            <div className="relative">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: accentText }} data-testid="text-overline">{copy.overline}</span>

              <h1 className="font-head font-normal text-white tracking-[-0.04em] leading-[0.88] uppercase mb-3" style={{ fontSize: 'clamp(2.8rem, 9vw, 5.5rem)' }} data-testid="text-product-name"><BrandName name={product.name} /></h1>

              <p className="text-[15px] md:text-[17px] font-sans font-medium text-white/80 max-w-md mb-3 leading-snug mx-auto md:mx-0">{copy.subtitle}</p>

              <p className="text-[11px] font-mono text-white/70 tracking-[0.01em] max-w-md mx-auto md:mx-0" data-testid="text-micro-line">{copy.microLine}</p>
            </div>
          </div>

          <div className="w-full md:w-2/5 buy-panel">
            <div className="relative">
              <div className="absolute inset-0 -inset-x-4 pointer-events-none" style={{ background: `radial-gradient(ellipse 90% 70% at 50% 45%, ${hexToRgba(accent, 0.12)}, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="relative flex items-end justify-center px-6 pt-4 pb-8 md:px-10 md:pt-6 md:pb-3">
                  <div className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[80%] h-[70%] blur-[40px] opacity-20 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 60%, ${hexToRgba(accent, 0.5)}, transparent 70%)` }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[6px] rounded-[50%] blur-sm opacity-50 pointer-events-none" style={{ background: 'rgba(0,0,0,0.7)' }} />
                  <img src={product.heroImage} alt={product.name} className="relative z-10 w-[45%] md:w-[55%] max-h-[180px] md:max-h-none h-auto object-contain" style={{ filter: `drop-shadow(0 8px 16px ${hexToRgba(accent, 0.2)}) drop-shadow(0 3px 6px rgba(0,0,0,0.35))` }} />
                </div>

                <div className="px-3 pb-3 md:px-4 md:pb-4 space-y-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[11px] font-mono uppercase tracking-[0.10em] font-bold text-white/65">{product.id === 'cellunova' ? '7-Day Cycle' : 'Daily Protocol'}</span>
                    <span className="text-[22px] md:text-[24px] font-sans font-black text-white leading-none tracking-[-0.03em]">{product.price}</span>
                  </div>

                  <p className="text-[14px] md:text-[15px] text-white/75 leading-snug font-sans tracking-[-0.01em]">{product.description}</p>

                  <div className="border-t border-white/[0.06] pt-3 mt-2">
                    <div className="flex flex-col gap-1">
                      {product.outcomes.map((item, i) => (
                        <span key={i} className="text-[14px] font-sans font-medium text-white leading-[1.8]">{item}</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-white/60 tracking-[0.08em] uppercase whitespace-nowrap mt-1">{product.specRow}</p>

                  {productWarnings && (
                    <p className="text-[10px] font-mono text-white/60 tracking-[0.02em]">{productWarnings}</p>
                  )}

                  <div className="space-y-2.5 pt-0.5">
                    <MagneticButton
                      className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg py-2.5 text-white font-mono font-bold tracking-[0.12em] text-[11px] uppercase active:scale-[0.98] transition-all relative overflow-hidden group"
                      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.18)' }}
                      onClick={addCurrentProductToCart}
                    >
                      <span className="relative z-10">Add to Stack</span>
                      <ArrowRight size={13} className="relative z-10" />
                      <div className="absolute inset-0 bg-white/[0.06] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </MagneticButton>

                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setActiveSidePanel('ingredients')}
                        className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium text-white/50 hover:text-white/75 transition-colors duration-200"
                        data-testid="button-ingredients-pdp"
                      >
                        Ingredients
                      </button>
                      <span className="w-px h-3 bg-white/15" />
                      <button
                        onClick={() => setActiveSidePanel('rationale')}
                        className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium text-white/50 hover:text-white/75 transition-colors duration-200"
                        data-testid="button-evidence-pdp"
                      >
                        Evidence
                      </button>
                      <span className="w-px h-3 bg-white/15" />
                      <a
                        href={`/product/${product.id}`}
                        className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium text-white/50 hover:text-white/75 transition-colors duration-200"
                        data-testid="link-full-details"
                      >
                        Full Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NARRATIVE */}
      <section className="relative py-12 md:py-16" data-testid="section-narrative">
        {product.id === 'cellubiome' && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(20,184,166,0.06), transparent 70%)', filter: 'blur(20px)' }} />
        )}
        {product.id === 'cellunova' && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(108,92,231,0.04), transparent 70%)' }} />
        )}
        <div className="relative z-[1] max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10">
          <div className="reveal md:grid md:grid-cols-2 md:gap-16 md:items-start">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] block mb-4" style={{ color: accentText }} data-testid="text-narrative-label">{copy.narrative.label}</span>
              <h2 className="text-[22px] md:text-[32px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-6 md:mb-0" data-testid="text-narrative-headline">{copy.narrative.headline}</h2>
            </div>
            <div className="space-y-1" data-testid="text-narrative-body">
              {copy.narrative.bodyLines.map((line, i) => (
                <p key={i} className="text-[14px] md:text-[15px] font-sans text-white/70 leading-[1.75]">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10"><div className="h-px bg-white/[0.06]" /></div>

      {/* TELEMETRY */}
      <section className="relative py-12 md:py-20" data-testid="section-telemetry">
        <div className="relative z-[1] max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10">
          <div className="reveal md:grid md:grid-cols-2 md:gap-16 md:items-start">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] block mb-2" style={{ color: accentText }}>Telemetry</span>
              <h2 className="text-[22px] md:text-[32px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-3">{copy.telemetry.headline}</h2>
              <p className="text-[14px] font-sans text-white/65 leading-relaxed max-w-xl mb-6 md:mb-0">{copy.telemetry.body}</p>
            </div>

            <div className="flex flex-col gap-0">
              {copy.telemetry.rows.map((row, i) => (
                <div key={i} className="flex items-baseline gap-4 py-2.5" data-testid={`telemetry-row-${i}`}>
                  <span className="font-mono text-[14px] font-black tracking-[0.04em] shrink-0 w-6 text-right" style={{ color: accentText }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-0 flex-1 border-b border-white/[0.06] pb-3">
                    <span className="text-[13px] font-sans font-bold text-white/90">{row.label}</span>
                    <span className="text-[12px] font-mono text-white/50 tracking-[0.02em] mt-0.5">{row.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10"><div className="h-px bg-white/[0.06]" /></div>

      {/* STANDARDS */}
      <section className="relative py-12 md:py-20" data-testid="section-standards">
        <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10">
          <div className="reveal">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] block mb-5" style={{ color: accentText }}>Formulation Standards</span>
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {SHARED_STANDARDS.map((item, i) => (
                <div key={i} className="flex items-start gap-5 md:flex-col md:gap-2" data-testid={`standard-${i}`}>
                  <span className="font-mono text-[14px] font-black tracking-[0.04em] shrink-0 w-6 text-right md:text-left" style={{ color: accentText }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-sans font-bold text-white/90">{item.label}</span>
                    <span className="text-[13px] font-sans text-white/60 leading-snug">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10"><div className="h-px bg-white/[0.06]" /></div>

      {/* COMPOUND SPECIFICATION */}
      <section className="relative py-12 md:py-20" data-testid="section-spec">
        <div className="relative z-[1] max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10">
          <div className="reveal mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] block mb-2" style={{ color: accentText }}>Compound Specification</span>
            <p className="text-[12px] font-mono text-white/55 tracking-[0.04em] uppercase mb-1.5">{copy.spec.meta}</p>
            <p className="text-[14px] font-sans text-white/65 leading-relaxed mb-1.5">{copy.spec.reassurance}</p>
            <p className="text-[12px] font-mono text-white/50 tracking-[0.04em]">{copy.spec.declaration}</p>
            {specMicroNote && <p className="text-[11px] font-mono text-white/45 tracking-[0.04em] mt-1">{specMicroNote}</p>}
          </div>

          <div className="reveal border-t border-white/[0.06] pt-5 max-w-4xl">
            <IngredientPanel ingredients={product.ingredients} accentText={accentText} />
          </div>

          <div className="mt-5 space-y-1 max-w-4xl">
            <p className="text-[11px] font-mono text-white/50 tracking-[0.06em] leading-relaxed">All dosages reflect clinically studied ranges</p>
            <p className="text-[11px] font-mono text-white/50 tracking-[0.06em] leading-relaxed">All compounds listed in bioavailable forms</p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10"><div className="h-px bg-white/[0.06]" /></div>

      {/* PROTOCOL ARC */}
      <section className="relative py-12 md:py-20" data-testid="section-arc">
        <div className="relative z-[1] max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10">
          <div className="reveal md:grid md:grid-cols-2 md:gap-16 md:items-start">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] block mb-2" style={{ color: accentText }}>Protocol Arc</span>
              <h2 className="text-[22px] md:text-[32px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-1.5">{copy.arc.headline}</h2>
              <p className="text-[13px] font-mono text-white/45 tracking-[-0.01em] mb-8 md:mb-0">{copy.arc.subline}</p>
            </div>

            <div className="relative">
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/[0.06]" />

              <div className="space-y-0">
                {copy.arc.phases.map((step, i) => (
                  <div key={i} className="relative pl-8 py-5 md:py-6 reveal" data-testid={`arc-phase-${i}`}>
                    <div className="absolute left-0 top-[26px] w-[15px] h-[15px] flex items-center justify-center">
                      <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentText, opacity: 0.55 }} />
                    </div>

                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.06em]" style={{ color: accentText }}>Phase {step.phase}</span>
                      <span className="text-[10px] font-mono text-white/45 uppercase tracking-[0.08em]">{step.time}</span>
                    </div>
                    <h4 className="text-[15px] md:text-[16px] font-sans font-bold text-white/90 tracking-[-0.01em] mb-1">{step.label}</h4>
                    <p className="text-[14px] font-sans text-white/65 leading-relaxed">{step.desc}</p>

                    {i < copy.arc.phases.length - 1 && <div className="h-px bg-white/[0.04] mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10"><div className="h-px bg-white/[0.06]" /></div>

      {/* CLOSE */}
      <section className="relative py-12 md:py-20" data-testid="section-close">
        <div className="max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-6 md:px-10 text-center">
          <div className="reveal">
            <h2 className="text-[22px] md:text-[28px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-3" data-testid="text-close-headline">{copy.close.headline}</h2>
            <p className="text-[14px] font-sans text-white/65 leading-relaxed max-w-md mx-auto mb-8">{copy.close.body}</p>

            <div className="flex flex-col items-center gap-3">
              <MagneticButton
                className="min-h-[44px] min-w-[200px] flex items-center justify-center gap-2 py-3 px-8 rounded-lg text-white font-mono font-bold tracking-[0.12em] text-[11px] uppercase active:scale-[0.98] transition-all relative overflow-hidden group"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.18)' }}
                onClick={addCurrentProductToCart}
              >
                <span className="relative z-10">Add to Stack</span>
                <ArrowRight size={13} className="relative z-10" />
                <div className="absolute inset-0 bg-white/[0.06] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </MagneticButton>

              <button
                onClick={() => setActiveSidePanel('rationale')}
                className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium text-white/50 hover:text-white/70 transition-colors duration-200"
                data-testid="link-view-evidence"
              >
                View Evidence →
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>

      <SideSheet open={activeSidePanel === 'ingredients'} title="Full Ingredient Panel" onClose={() => setActiveSidePanel(null)}>
        <div className="space-y-0">
          {product.ingredients.map((ing, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline py-3.5 gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-sans font-bold text-[13px] uppercase text-white">{ing.name}</p>
                  <p className="text-[11px] font-mono text-white/45 uppercase tracking-[0.10em]">{ing.purpose}</p>
                </div>
                <span className="font-mono text-[13px] font-bold whitespace-nowrap shrink-0" style={{ color: accent }}>{ing.dose}</span>
              </div>
              {i < product.ingredients.length - 1 && <div className="h-px bg-white/[0.06]" />}
            </div>
          ))}
        </div>

        {productWarnings && (
          <p className="mt-6 text-[11px] font-mono text-white/45 tracking-[0.02em]">{productWarnings}</p>
        )}
      </SideSheet>

      <SideSheet open={activeSidePanel === 'rationale'} title="Evidence" onClose={() => setActiveSidePanel(null)}>
        <div className="space-y-6">
          {copy.telemetry.rows.map((row, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-bold tracking-[0.10em] text-white/40 shrink-0 w-5">0{i + 1}</span>
                <h4 className="font-head font-normal uppercase tracking-[-0.01em] text-white text-[15px]">{row.label}</h4>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed font-sans font-medium pl-8">{row.metric}</p>
            </div>
          ))}

          <div className="pt-6 border-t border-white/[0.06]">
            <p className="text-[11px] text-white/35 font-mono uppercase tracking-[0.08em] leading-relaxed">Evidence summarizes peer-reviewed research directions. It is not medical advice.</p>
          </div>
        </div>
      </SideSheet>
    </main>
  );
}

const BASE_DARK = '#0A1220';
const SECONDARY_DARK = '#101B2D';
const LIGHT = '#F4F1EA';
const CARD_SURFACE = '#15202F';

const SHOP_PRODUCTS = [
  {
    id: 'cellunad' as const,
    name: 'CELLUNAD+',
    role: 'Daily Foundation',
    bestFor: 'Energy, repair & NAD+ support',
    cadence: '2 capsules daily',
    supply: '30-day supply',
    price: 79.99,
    priceSub: 67.99,
    image: '/images/cellunad-render.png',
    accent: '#60a5fa',
    anchors: ['NR 500 mg', 'TMG 250 mg', 'Apigenin 100 mg'],
    startHere: true,
    note: 'Most people start here',
    isDaily: true,
  },
  {
    id: 'cellubiome' as const,
    name: 'CELLUBIOME',
    role: 'Signal Stability',
    bestFor: 'Gut-mito axis & steady output',
    cadence: '2 enteric caps daily',
    supply: '30-day supply',
    price: 110.00,
    priceSub: 93.50,
    image: '/images/cellubiome-render.png',
    accent: '#5eead4',
    anchors: ['Urolithin A 500 mg', 'Tributyrin 500 mg'],
    startHere: false,
    note: 'Enteric-coated delivery',
    isDaily: true,
  },
  {
    id: 'cellunova' as const,
    name: 'CELLUNOVA',
    role: 'Periodic Reset',
    bestFor: 'Autophagy + periodic renewal',
    cadence: '5 caps/day · 7-day cycle',
    supply: '7-day monthly cycle',
    price: 49.99,
    priceSub: 42.49,
    image: '/images/cellunova_cropped.png',
    accent: '#a78bfa',
    anchors: ['Fisetin', 'Spermidine', 'Quercetin'],
    startHere: false,
    note: 'Contains wheat (spermidine source)',
    isDaily: false,
  },
];

const TRUST_ITEMS = [
  'Full dose disclosure',
  'No proprietary blends',
  'Third-party tested',
  'Lot-level traceability',
];

const COMPARISON_ROWS = [
  { label: 'Protocol Role', cellunad: 'Daily NAD+ foundation', cellubiome: 'Gut–mito signal stability', cellunova: 'Monthly cellular reset' },
  { label: 'Best For', cellunad: 'Energy, repair, baseline', cellubiome: 'Gut barrier, steady output', cellunova: 'Autophagy, periodic renewal' },
  { label: 'Use Pattern', cellunad: 'Daily — ongoing', cellubiome: 'Daily — ongoing', cellunova: '7 days per month' },
  { label: 'Serving', cellunad: '2 capsules', cellubiome: '2 enteric capsules', cellunova: '5 capsules' },
  { label: 'Key Actives', cellunad: 'NR, TMG, Apigenin + 5 more', cellubiome: 'Urolithin A, Tributyrin', cellunova: 'Fisetin, Quercetin + 8 more' },
  { label: 'Supply', cellunad: '30-day', cellubiome: '30-day', cellunova: '7-day cycle' },
  { label: 'Pairs With', cellunad: 'CELLUBIOME + CELLUNOVA', cellubiome: 'CELLUNAD+ + CELLUNOVA', cellunova: 'CELLUNAD+ + CELLUBIOME' },
  { label: 'Note', cellunad: 'Non-stimulant', cellubiome: 'Enteric-coated', cellunova: 'Contains wheat' },
];

const BUNDLES = [
  {
    id: 'single',
    label: 'Start with One',
    desc: 'Begin with the daily foundation most people choose first.',
    products: ['cellunad'] as string[],
  },
  {
    id: 'daily',
    label: 'Daily Foundation',
    desc: 'Pair the two daily protocols for full baseline coverage.',
    products: ['cellunad', 'cellubiome'] as string[],
  },
  {
    id: 'full',
    label: 'Full System',
    desc: 'All three protocols. Daily foundation plus monthly reset.',
    products: ['cellunad', 'cellubiome', 'cellunova'] as string[],
  },
];

function ShopCatalog() {
  const cart = useCart();
  const comparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addProduct = (productId: string, subscribe = false) => {
    const p = SHOP_PRODUCTS.find((sp) => sp.id === productId);
    if (!p) return;
    cart.addItem({
      slug: p.id,
      name: p.name,
      image: p.image,
      price: subscribe ? p.priceSub : p.price,
      isSubscribe: subscribe,
      frequency: subscribe ? (p.id === 'cellunova' ? '7-day cycle' : 'Delivered monthly') : 'One-time',
    });
  };

  const addBundle = (productIds: string[]) => {
    productIds.forEach((id) => addProduct(id, false));
  };

  const getBundleTotal = (productIds: string[]) => {
    return productIds.reduce((sum, id) => {
      const p = SHOP_PRODUCTS.find((sp) => sp.id === id);
      return sum + (p?.price || 0);
    }, 0);
  };

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-white" data-testid="shop-page">
      <SiteNavbar />

      {/* ═══ S1 · HERO / SYSTEM INTRO ═══ (BASE_DARK) */}
      <section style={{ background: BASE_DARK }} data-testid="section-shop-hero">
        <div className="mx-auto max-w-6xl px-5 md:px-8 pt-28 md:pt-36 lg:pt-28 pb-20 md:pb-28 lg:pb-20">
          <div className="text-center mb-14 md:mb-16 lg:mb-12">
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-teal-400/80 mb-5 lg:mb-4" data-testid="text-shop-eyebrow">Three fully disclosed formulas. One system.</span>
            <h1 className="font-head font-normal uppercase tracking-[-0.04em] leading-[0.88] text-white mb-5 lg:mb-4" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)' }} data-testid="text-shop-title">
              Daily NAD+. Gut Resilience. Monthly Reset.
            </h1>
            <p className="max-w-xl mx-auto text-[15px] md:text-[16px] font-sans text-white/60 leading-relaxed">
              Each formula has a distinct role. Every dose is disclosed.
              Together, they cover the full protocol.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl lg:max-w-5xl mx-auto mb-14 md:mb-16 lg:mb-12">
            {SHOP_PRODUCTS.map((p) => (
              <div key={p.id} className="flex flex-col items-center text-center" data-testid={`hero-product-${p.id}`}>
                <div className="relative mb-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-[90px] md:h-[130px] w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45))' }}
                  />
                </div>
                <span className="text-[11px] md:text-[12px] font-head font-normal uppercase tracking-[-0.01em] text-white mb-0.5" data-testid={`text-hero-name-${p.id}`}>
                  <BrandName name={p.name} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-white/40 mb-1">{p.role}</span>
                <span className="text-[14px] md:text-[15px] font-sans font-bold text-white" data-testid={`text-hero-price-${p.id}`}>${p.price.toFixed(2)}</span>
                <span className="text-[10px] font-mono text-white/35">{p.isDaily ? 'daily' : '7-day cycle'}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={scrollToComparison}
              className="min-h-[48px] px-8 py-3 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] text-white transition-all duration-300 hover:brightness-110"
              style={{ background: '#19B3A6' }}
              data-testid="button-compare-protocols"
            >
              Compare All Three
            </button>
            <a
              href="#build-protocol"
              className="min-h-[48px] px-8 py-3 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.14em] text-white/60 hover:text-white/85 transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.10)' }}
              data-testid="link-build-protocol"
            >
              Build Your Protocol
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap" data-testid="trust-strip-hero">
            {TRUST_ITEMS.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.04em] text-white/45" data-testid={`text-trust-item-${i}`}>{item}</span>
                {i < TRUST_ITEMS.length - 1 && <span className="text-white/20">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ S2 · START HERE / GUIDED SELECTOR ═══ (LIGHT) */}
      <section style={{ background: LIGHT }} data-testid="section-start-here">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-5 md:px-8 py-[72px] md:py-[110px] lg:py-[80px]">
          <div className="text-center mb-8 md:mb-12 lg:mb-10">
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.20em] font-bold mb-3" style={{ color: '#19B3A6' }}>Where to Start</span>
            <h2 className="text-[22px] md:text-[34px] font-head font-normal uppercase tracking-[-0.03em] leading-tight text-[#0A1220]" data-testid="text-start-here-title">Choose Your Starting Point</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-7 mb-10 md:mb-14 lg:mb-10">
            {SHOP_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="relative rounded-xl flex flex-col"
                style={{
                  background: '#FFFFFF',
                  border: p.startHere ? '2px solid rgba(25,179,166,0.40)' : '1px solid rgba(10,18,32,0.07)',
                  boxShadow: p.startHere
                    ? '0 6px 28px rgba(25,179,166,0.10), 0 1px 4px rgba(0,0,0,0.06)'
                    : '0 1px 4px rgba(0,0,0,0.04)',
                }}
                data-testid={`start-card-${p.id}`}
              >
                {p.startHere && (
                  <span
                    className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-white"
                    style={{ background: '#19B3A6' }}
                    data-testid="badge-start-here"
                  >
                    Most people start here
                  </span>
                )}

                <div className="px-6 lg:px-5 pt-6 md:pt-7 lg:pt-5 pb-2 lg:pb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] font-bold block mb-1" style={{ color: '#19B3A6', opacity: p.startHere ? 1 : 0.55 }}>{p.role}</span>
                  <h3 className="text-lg font-head font-normal uppercase tracking-[-0.02em] text-[#0A1220] mb-1.5">
                    <BrandName name={p.name} />
                  </h3>
                </div>

                <div className="px-6 lg:px-5 pb-2 lg:pb-1.5">
                  <div className="flex items-baseline justify-between lg:gap-2">
                    <span className="text-[20px] font-sans font-bold text-[#0A1220]" data-testid={`text-start-price-${p.id}`}>${p.price.toFixed(2)}</span>
                    <span className="text-[11px] font-mono text-[#0A1220]/40 uppercase tracking-[0.04em]">{p.isDaily ? 'daily' : '7-day monthly cycle'}</span>
                  </div>
                </div>

                <div className="px-6 lg:px-5 pb-4 lg:pb-3">
                  <p className="text-[13px] font-sans text-[#0A1220]/55 leading-relaxed">{p.bestFor}</p>
                  {!p.isDaily && (
                    <p className="text-[10px] font-mono text-[#0A1220]/35 mt-1.5">{p.note}</p>
                  )}
                </div>

                <div className="mt-auto px-5 pb-5 flex flex-col gap-1.5">
                  <button
                    onClick={() => addProduct(p.id)}
                    className="w-full min-h-[44px] flex items-center justify-center rounded-lg py-2.5 font-mono font-bold uppercase text-[11px] tracking-[0.12em] transition-all duration-300 text-white hover:brightness-110"
                    style={{ background: '#19B3A6' }}
                    data-testid={`button-add-cart-start-${p.id}`}
                  >
                    Add to Cart — ${p.price.toFixed(2)}
                  </button>
                  <a
                    href={`/product/${p.id}`}
                    className="w-full min-h-[40px] flex items-center justify-center rounded-lg py-2 font-mono uppercase text-[10px] tracking-[0.12em] font-medium text-[#0A1220]/45 hover:text-[#0A1220]/70 transition-colors duration-200"
                    data-testid={`button-view-details-${p.id}`}
                  >
                    View Full Details
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto rounded-lg px-6 py-5" style={{ background: 'rgba(10,18,32,0.04)', border: '1px solid rgba(10,18,32,0.06)' }} data-testid="guidance-block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-[13px] font-sans text-[#0A1220]/60 leading-relaxed">
              <p data-testid="guidance-item-0"><span className="font-bold text-[#0A1220]/80">New?</span> Start with CELLUNAD+. It's the daily foundation.</p>
              <p data-testid="guidance-item-1"><span className="font-bold text-[#0A1220]/80">Gut priority?</span> Start with CELLUBIOME. Enteric-coated.</p>
              <p data-testid="guidance-item-2"><span className="font-bold text-[#0A1220]/80">Have a baseline?</span> Add CELLUNOVA monthly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ S3 · SIDE-BY-SIDE COMPARISON ═══ (SECONDARY_DARK) */}
      <section ref={comparisonRef} style={{ background: SECONDARY_DARK }} data-testid="section-comparison-cards">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-5 md:px-8 py-[72px] md:py-[110px] lg:py-[80px]">
          <div className="text-center mb-8 md:mb-12 lg:mb-10">
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.20em] font-bold text-teal-400/60 mb-3">Compare</span>
            <h2 className="text-[22px] md:text-[34px] font-head font-normal uppercase tracking-[-0.03em] leading-tight text-white" data-testid="text-comparison-title">Side by Side</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-7">
            {SHOP_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="relative rounded-xl flex flex-col"
                style={{
                  background: CARD_SURFACE,
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
                }}
                data-testid={`compare-card-${p.id}`}
              >
                <div className="flex items-end justify-center pt-5 pb-3 px-4 h-[130px] md:h-[155px]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-[100px] md:h-[120px] w-auto object-contain"
                    style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }}
                  />
                </div>

                <div className="px-5 pb-5 flex flex-col flex-1">
                  <span className="text-[9px] font-mono uppercase tracking-[0.16em] font-bold mb-1" style={{ color: p.accent }}>{p.role}</span>
                  <h3 className="text-lg font-head font-normal uppercase tracking-[-0.02em] text-white mb-1">
                    <BrandName name={p.name} />
                  </h3>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[19px] font-sans font-bold text-white" data-testid={`text-compare-price-${p.id}`}>${p.price.toFixed(2)}</span>
                    <span className="text-[10px] font-mono text-white/35 uppercase tracking-[0.04em]">{p.isDaily ? 'daily' : '7-day cycle'}</span>
                  </div>

                  <p className="text-[13px] font-sans text-white/50 leading-relaxed mb-3">{p.bestFor}</p>

                  <div className="border-t border-white/[0.05] pt-2.5 mb-3">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.06em] block mb-1.5">{p.cadence} · {p.supply}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.anchors.map((a, ai) => (
                        <span key={a} className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }} data-testid={`text-anchor-${p.id}-${ai}`}>{a}</span>
                      ))}
                    </div>
                  </div>

                  {p.note && (
                    <p className="text-[10px] font-mono text-white/30 tracking-[0.02em] mb-3" data-testid={`text-note-${p.id}`}>{p.note}</p>
                  )}

                  <div className="mt-auto flex flex-col gap-1.5">
                    <button
                      onClick={() => addProduct(p.id)}
                      className="w-full min-h-[44px] flex items-center justify-center rounded-lg py-2.5 font-mono font-bold uppercase text-[11px] tracking-[0.12em] transition-all duration-300 text-white hover:brightness-110"
                      style={{ background: '#19B3A6' }}
                      data-testid={`button-add-cart-compare-${p.id}`}
                    >
                      Add to Cart — ${p.price.toFixed(2)}
                    </button>
                    <a
                      href={`/product/${p.id}`}
                      className="w-full min-h-[40px] flex items-center justify-center gap-1.5 rounded-lg py-2 font-mono uppercase text-[10px] tracking-[0.12em] font-medium text-white/40 hover:text-white/60 transition-colors duration-200"
                      data-testid={`button-view-details-compare-${p.id}`}
                    >
                      View Full Details <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ S4 · BUILD YOUR PROTOCOL ═══ (LIGHT) */}
      <section id="build-protocol" style={{ background: LIGHT }} data-testid="section-build-protocol">
        <div className="mx-auto max-w-5xl lg:max-w-7xl px-5 md:px-8 py-[72px] md:py-[110px] lg:py-[72px]">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.20em] font-bold mb-3" style={{ color: '#19B3A6' }}>Build</span>
            <h2 className="text-[22px] md:text-[34px] font-head font-normal uppercase tracking-[-0.03em] leading-tight text-[#0A1220]" data-testid="text-build-title">Build Your Protocol</h2>
            <p className="mt-3 max-w-md mx-auto text-[13px] md:text-[14px] font-sans text-[#0A1220]/50 leading-relaxed">
              Choose one product or build the full system. Totals computed from current prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-7">
            {BUNDLES.map((bundle) => {
              const total = getBundleTotal(bundle.products);
              const bundleProducts = bundle.products.map((pid) => SHOP_PRODUCTS.find((sp) => sp.id === pid)!);
              const isFull = bundle.id === 'full';

              return (
                <div
                  key={bundle.id}
                  className="relative rounded-xl flex flex-col"
                  style={{
                    background: '#FFFFFF',
                    border: isFull ? '2px solid rgba(25,179,166,0.35)' : '1px solid rgba(10,18,32,0.07)',
                    boxShadow: isFull
                      ? '0 6px 28px rgba(25,179,166,0.10), 0 1px 4px rgba(0,0,0,0.06)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  data-testid={`bundle-card-${bundle.id}`}
                >
                  {isFull && (
                    <span
                      className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-white"
                      style={{ background: '#19B3A6' }}
                      data-testid="badge-full-system"
                    >
                      Complete Protocol
                    </span>
                  )}

                  <div className="px-6 lg:px-5 pt-6 md:pt-7 lg:pt-5 pb-3 lg:pb-2">
                    <h3 className="text-[16px] font-head font-normal uppercase tracking-[-0.02em] text-[#0A1220] mb-1">{bundle.label}</h3>
                    <p className="text-[12px] font-sans text-[#0A1220]/45 leading-relaxed">{bundle.desc}</p>
                  </div>

                  <div className="px-6 lg:px-5 pb-3 lg:pb-2 space-y-2 flex-1">
                    {bundleProducts.map((bp) => (
                      <div key={bp.id} className="flex items-center gap-3 py-1" data-testid={`bundle-item-${bundle.id}-${bp.id}`}>
                        <img src={bp.image} alt={bp.name} className="h-[32px] w-auto object-contain shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-sans font-bold text-[#0A1220] block leading-tight">{bp.name}</span>
                          <span className="text-[10px] font-mono text-[#0A1220]/35">{bp.isDaily ? 'Daily' : '7-day cycle'}</span>
                        </div>
                        <span className="text-[13px] font-sans font-bold text-[#0A1220] shrink-0" data-testid={`text-bundle-item-price-${bundle.id}-${bp.id}`}>${bp.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pb-5">
                    <div className="border-t border-[#0A1220]/[0.06] pt-3 mb-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-mono text-[#0A1220]/35 uppercase tracking-[0.06em]">{bundle.products.length === 1 ? '1 product' : `${bundle.products.length} products`}</span>
                        <span className="text-[18px] font-sans font-bold text-[#0A1220]" data-testid={`text-bundle-total-${bundle.id}`}>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addBundle(bundle.products)}
                      className="w-full min-h-[44px] flex items-center justify-center rounded-lg py-2.5 font-mono font-bold uppercase text-[11px] tracking-[0.12em] transition-all duration-300 text-white hover:brightness-110"
                      style={{ background: '#19B3A6' }}
                      data-testid={`button-add-bundle-${bundle.id}`}
                    >
                      Add to Cart — ${total.toFixed(2)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ S5 · TRUST + COMPARISON MATRIX ═══ (SECONDARY_DARK) */}
      <section style={{ background: SECONDARY_DARK }} data-testid="section-trust">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-5 md:px-8 py-[72px] md:py-[110px] lg:py-[72px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-16 md:mb-20 lg:mb-14" data-testid="trust-grid">
            {[
              { title: 'Transparent Dosing', desc: 'Every active listed with exact dose. No proprietary blends.' },
              { title: 'Third-Party Tested', desc: 'Independent lab verification on every production lot.' },
              { title: 'Lot Traceability', desc: 'Every bottle lot-coded. Documentation by request.' },
              { title: 'Delivery Integrity', desc: 'Form and release selected per compound. Enteric where needed.' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg px-4 py-4 md:px-5 md:py-5"
                style={{ background: CARD_SURFACE, border: '1px solid rgba(255,255,255,0.05)' }}
                data-testid={`trust-card-${i}`}
              >
                <h4 className="text-[13px] font-sans font-bold text-white/85 mb-1">{item.title}</h4>
                <p className="text-[12px] font-sans text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[20px] md:text-[28px] font-head font-normal uppercase tracking-[-0.03em] leading-tight text-white" data-testid="text-matrix-title">How They Compare</h2>
          </div>

          <div className="hidden md:block" data-testid="comparison-table-desktop">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-[0.10em] text-white/30 font-bold border-b border-white/[0.06] w-[20%]" />
                  {SHOP_PRODUCTS.map((p) => (
                    <th key={p.id} className="py-3 px-4 text-[13px] font-head font-normal uppercase tracking-[-0.01em] text-white/80 border-b border-white/[0.06]">
                      <BrandName name={p.name} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2.5 lg:py-3 px-4 lg:px-5 text-[10px] font-mono uppercase tracking-[0.06em] text-white/30 font-bold border-b border-white/[0.03]">{row.label}</td>
                    <td className="py-2.5 lg:py-3 px-4 lg:px-5 text-[12px] font-sans text-white/55 leading-snug border-b border-white/[0.03]">{row.cellunad}</td>
                    <td className="py-2.5 lg:py-3 px-4 lg:px-5 text-[12px] font-sans text-white/55 leading-snug border-b border-white/[0.03]">{row.cellubiome}</td>
                    <td className="py-2.5 lg:py-3 px-4 lg:px-5 text-[12px] font-sans text-white/55 leading-snug border-b border-white/[0.03]">{row.cellunova}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4" data-testid="comparison-table-mobile">
            {SHOP_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="rounded-lg px-4 py-4"
                style={{ background: CARD_SURFACE, border: '1px solid rgba(255,255,255,0.05)' }}
                data-testid={`comparison-mobile-${p.id}`}
              >
                <h4 className="text-[13px] font-head font-normal uppercase tracking-[-0.01em] text-white/80 mb-2"><BrandName name={p.name} /></h4>
                {COMPARISON_ROWS.map((row) => {
                  const val = row[p.id as keyof typeof row];
                  return (
                    <div key={row.label} className="flex justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                      <span className="text-[10px] font-mono uppercase tracking-[0.06em] text-white/30 font-bold">{row.label}</span>
                      <span className="text-[11px] font-sans text-white/50 text-right max-w-[55%]">{val}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ S6 · FINAL CTA ═══ (BASE_DARK) */}
      <section style={{ background: BASE_DARK }} data-testid="section-final-cta">
        <div className="mx-auto max-w-3xl lg:max-w-4xl px-5 md:px-8 py-[72px] md:py-[100px] lg:py-[56px] text-center">
          <h2 className="text-[22px] md:text-[34px] font-head font-normal uppercase tracking-[-0.03em] leading-tight text-white mb-4" data-testid="text-final-cta">Build Your Age Revive Protocol</h2>
          <p className="text-[14px] font-sans text-white/45 leading-relaxed max-w-md mx-auto mb-8">
            Start with one product or build the full system. Every formula is independently useful and designed to pair.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/product/cellunad"
              className="min-h-[48px] px-8 py-3 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] text-white transition-all duration-300 hover:brightness-110"
              style={{ background: '#19B3A6' }}
              data-testid="link-start-daily-foundation"
            >
              Start with the Daily Foundation
            </a>
            <button
              onClick={() => addBundle(['cellunad', 'cellubiome', 'cellunova'])}
              className="min-h-[48px] px-8 py-3 rounded-lg font-mono font-bold uppercase text-[11px] tracking-[0.12em] text-white/55 hover:text-white/80 transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.10)' }}
              data-testid="button-add-full-system"
            >
              Add Full System — ${getBundleTotal(['cellunad', 'cellubiome', 'cellunova']).toFixed(2)}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ShopProductDetail({ slug: paramSlug }: { slug: string }) {
  const isProductId = (value: string): value is ProductId => value in PRODUCTS;
  const initialSlug: ProductId = isProductId(paramSlug) ? paramSlug : 'cellunad';
  const [slug, setSlug] = useState<ProductId>(initialSlug);
  const [railVisible, setRailVisible] = useState(true);
  const currentProduct = PRODUCTS[slug];
  const footerSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isProductId(paramSlug) && paramSlug !== slug) {
      setSlug(paramSlug);
    }
  }, [paramSlug, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const el = footerSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setRailVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [slug]);

  return (
    <div className="min-h-screen" style={{ paddingBottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' }}>
      <ProductTemplate key={currentProduct.id} product={currentProduct} />
      <div ref={footerSentinelRef} className="h-px" />

      <div
        className="transition-opacity duration-300"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          padding: '0 0 max(12px, env(safe-area-inset-bottom))',
          display: 'flex',
          justifyContent: 'center',
          background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 60%, transparent 100%)',
          opacity: railVisible ? 1 : 0,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{ pointerEvents: railVisible ? 'auto' : 'none', display: 'flex', gap: '0', padding: '0 8px', background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          {Object.values(PRODUCTS).map((p) => (
            <button
              key={p.id}
              onClick={() => setSlug(p.id as ProductId)}
              className={[
                'px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.14em] transition-all min-h-[44px] relative',
                slug === p.id ? 'text-white' : 'text-white/55 hover:text-white/75'
              ].join(' ')}
              data-testid={`switcher-${p.id}`}
            >
              <BrandName name={p.name} />
              {slug === p.id && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px]" style={{ background: p.accentText || p.accent, opacity: 0.85 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const params = useParams<{ slug?: string }>();

  if (!params.slug) {
    return <ShopCatalog />;
  }

  return <ShopProductDetail slug={params.slug} />;
}
