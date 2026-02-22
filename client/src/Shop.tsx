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
import imgCellubiome from '@assets/cellubiome_cropped.png';
import imgCellunad from '@assets/cellunad_cropped.png';
import imgCellunova from '@assets/cellunova_cropped.png';
import { BrandName } from './productsData';

gsap.registerPlugin(ScrollTrigger);

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

const COPY_MAP = {
  cellunad: {
    overline: 'Daily Input Layer',
    subtitle: 'Daily NAD+ support engineered for consistency, not hype.',
    microLine: 'Protocol: 2 caps daily · Target: energy + repair',
    why: {
      label: 'Why Daily Input Matters',
      headline: 'Energy doesn\'t crash. It quietly loses efficiency.',
      body: 'Most people don\'t notice the drift until output drops. CELLUNAD+ is built as a steady daily input, supporting the pathways that keep energy production and cellular maintenance running clean.'
    },
    what: {
      label: 'What It Supports',
      headline: 'A cleaner baseline you can build on.',
      lines: [
        'Supports cellular energy production and resilience',
        'Supports NAD+ metabolism and daily replenishment',
        'Supports healthy redox balance and mitochondrial function',
        'Supports methylation cofactors for normal cellular processes'
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
      meta: 'Actives: 8 · Serving: 2 capsules daily',
      reassurance: 'All dosages reflect clinically studied ranges and bioavailable forms.',
      declaration: 'No proprietary formulations.'
    },
    arc: {
      headline: 'What you may notice over time.',
      subline: 'Response varies. Consistency compounds.',
      phases: [
        { phase: 'I', label: 'Calibration', time: 'Days 1–3', desc: 'Routine locks in. Inputs become consistent.' },
        { phase: 'II', label: 'Stabilization', time: 'Week 1–2', desc: 'Steady daily support. Less "spike," more baseline.' },
        { phase: 'III', label: 'Integration', time: 'Week 3–4', desc: 'Compounding effect. This becomes your default.' }
      ]
    },
    close: {
      headline: 'Build a baseline that doesn\'t rely on motivation.',
      body: 'If you\'re serious about longevity, consistency is the advantage.'
    }
  },
  cellubiome: {
    overline: 'Signaling Layer',
    subtitle: 'Daily gut-mito support designed to reinforce your foundation.',
    microLine: 'Protocol: 2 enteric-coated capsules daily · System target: Gut–mito signaling + resilience',
    why: {
      label: 'Why Signaling Matters',
      headline: 'Your gut is not separate from your energy.',
      body: 'When gut signaling is off, output feels noisy: energy, recovery, and consistency drift. CELLUBIOME supports the gut–mito connection with a focused, daily input.'
    },
    what: {
      label: 'What It Supports',
      headline: 'A steadier system signal.',
      lines: [
        'Supports gut barrier integrity and digestive resilience',
        'Supports mitochondrial renewal signals (cellular efficiency support)',
        'Supports short-chain fatty acid activity for gut environment support',
        'Supports consistency across sleep, training, and daily output'
      ]
    },
    telemetry: {
      headline: 'Biological response, quantified.',
      body: 'Signals show up before "feelings." Age Revive uses measurable feedback to reduce guesswork and keep the protocol honest.',
      rows: [
        { label: 'Gut Resilience Signals', metric: 'Consistency + tolerance cues' },
        { label: 'Mitochondrial Efficiency', metric: 'Recovery + output stability cues' },
        { label: 'Inflammation Balance', metric: 'Resilience trend cues' }
      ]
    },
    spec: {
      meta: 'Actives: 2 · Serving: 2 enteric-coated capsules daily',
      reassurance: 'Full dosing disclosed. Focused inputs, no filler complexity.',
      declaration: 'No proprietary formulations.'
    },
    arc: {
      headline: 'What you may notice over time.',
      subline: 'The signal stabilizes before it feels dramatic.',
      phases: [
        { phase: 'I', label: 'Calibration', time: 'Days 1–3', desc: 'Routine locks in. The system gets consistent input.' },
        { phase: 'II', label: 'Stabilization', time: 'Week 1–2', desc: 'Digestion and tolerance cues become clearer.' },
        { phase: 'III', label: 'Integration', time: 'Week 3–4', desc: 'More reliable output, less "noise."' }
      ]
    },
    close: {
      headline: 'Fix the signal. Then everything performs better.',
      body: 'Build the foundation you can actually stack on.'
    }
  },
  cellunova: {
    overline: 'Cycle Layer',
    subtitle: 'A 7-day monthly reset protocol designed for discipline, not extremes.',
    microLine: 'Protocol: 5 capsules daily for 7 days · System target: Renewal cadence + cleanup pathways',
    why: {
      label: 'Why a Cycle Exists',
      headline: 'Daily inputs build. Cycles recalibrate.',
      body: 'Most people either do nothing or do too much. CELLUNOVA is a controlled cadence: a short, repeatable cycle designed to support renewal pathways without turning your life into a protocol.'
    },
    what: {
      label: 'What It Supports',
      headline: 'A reset you can actually repeat.',
      lines: [
        'Supports cellular cleanup and renewal pathways',
        'Supports antioxidant defense and oxidative balance',
        'Supports healthy inflammatory response balance',
        'Supports resilience during periods of higher stress or load'
      ]
    },
    telemetry: {
      headline: 'Cycles are where signal becomes obvious.',
      body: 'A short protocol window makes changes easier to observe and compare over time. Age Revive uses feedback to keep cycles consistent and measurable.',
      rows: [
        { label: 'Recovery Signal', metric: 'Sleep + training tolerance cues' },
        { label: 'Inflammation Balance', metric: 'Resilience trend cues' },
        { label: 'Output Stability', metric: 'Consistency across the week' }
      ]
    },
    spec: {
      meta: 'Actives: 10 · Protocol: 7 days (5 capsules daily)',
      reassurance: 'Full dosing disclosed. Built as a cycle, not a daily stimulant.',
      declaration: 'No proprietary formulations.',
      microNote: 'Contains wheat (spermidine source).'
    },
    arc: {
      headline: 'What the 7-day cycle feels like.',
      subline: 'Keep the cadence. Don\'t chase intensity.',
      phases: [
        { phase: 'I', label: 'Initiation', time: 'Days 1–2', desc: 'You may feel "different" or feel nothing. Both are normal.' },
        { phase: 'II', label: 'Engagement', time: 'Days 3–5', desc: 'The cycle becomes steadier. Focus on routine.' },
        { phase: 'III', label: 'Completion', time: 'Days 6–7', desc: 'Finish clean. Consistency matters more than sensation.' },
        { phase: 'IV', label: 'Return to Baseline', time: 'Post-cycle', desc: 'Resume your daily stack. Repeat monthly if it fits your system.' }
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
    category: 'NAD+ Optimization',
    tagline: 'Daily NAD+ support engineered for consistency, not hype.',
    description:
      'NR + cofactors. 8 actives. Clinically aligned.',
    price: '$92.00',
    serving: '2 capsules daily',
    accent: '#1e3a8a',
    accentText: '#60a5fa',
    heroImage: '/images/cellunad-trimmed.png',
    outcomes: [
      'Supports cellular energy production and resilience',
      'Supports NAD+ metabolism and daily replenishment',
      'Supports healthy redox balance and mitochondrial function',
      'Supports methylation cofactors for normal cellular processes'
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
    category: 'Gut–Mito Signaling',
    tagline: 'Daily gut-mito support designed to reinforce your foundation.',
    description:
      'Urolithin A + tributyrin. Enteric-coated, 2-compound precision.',
    price: '$110.00',
    serving: '2 enteric-coated capsules daily',
    accent: '#19B3A6',
    accentText: '#5eead4',
    heroImage: '/images/cellubiome-trimmed.png',
    outcomes: [
      'Supports gut barrier integrity and digestive resilience',
      'Supports mitochondrial renewal signals (cellular efficiency support)',
      'Supports short-chain fatty acid activity for gut environment support',
      'Supports consistency across sleep, training, and daily output'
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
    category: 'Renewal Cadence + Cleanup',
    tagline: 'A 7-day monthly reset protocol designed for discipline, not extremes.',
    description:
      'Polyphenol + senolytic stack. 10 actives, 7-day phase design.',
    price: '$145.00',
    serving: '5 capsules daily for 7 consecutive days',
    warnings: 'Contains wheat (spermidine source).',
    accent: '#6C5CE7',
    accentText: '#a78bfa',
    heroImage: '/images/cellunova-trimmed.png',
    outcomes: [
      'Supports cellular cleanup and renewal pathways',
      'Supports antioxidant defense and oxidative balance',
      'Supports healthy inflammatory response balance',
      'Supports resilience during periods of higher stress or load'
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
        mechanism: 'Quercetin acts as a senolytic agent by transiently disabling pro-survival networks in senescent cells, particularly the BCL-2/BCL-XL anti-apoptotic pathway.',
        refs: [
          { title: 'Zhu Y et al. The Achilles\' heel of senescent cells: from transcriptome to senolytic drugs. Aging Cell. 2015;14(4):644-658.', doi: '10.1111/acel.12344' }
        ]},
      { name: 'Fisetin', dose: '100 mg', purpose: 'Cellular maintenance support',
        mechanism: 'Fisetin demonstrates senolytic activity by reducing senescence-associated secretory phenotype (SASP) factors and selectively inducing apoptosis in senescent cells.',
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
    telemetry: ['Autophagy Support', 'Cellular Cleanup', 'Phase Design']
  }
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


function CompoundRow({ ing, accentText, isLast, index }) {
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
                {ing.refs.map((ref, ri) => (
                  <p key={ri} className="text-[10px] font-mono text-white/40 leading-relaxed break-words">
                    [{ri + 1}] {ref.title}
                    {ref.doi && (
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

function IngredientPanel({ ingredients, accentText }) {
  return (
    <div className="space-y-0">
      {ingredients.map((ing, i) => (
        <CompoundRow key={i} ing={ing} accentText={accentText} isLast={i === ingredients.length - 1} index={i} />
      ))}
    </div>
  );
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
              <a key={l.label} href={l.href} className="text-white/55 hover:text-teal-300 transition-colors" data-testid={`nav-link-shop-${l.label.toLowerCase()}`}>{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a href="/shop" className="relative min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-teal-300 transition-colors" aria-label="Cart" data-testid="nav-cart-shop">
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] flex items-center justify-center text-[9px] font-mono font-bold rounded-sm leading-none text-teal-300 border border-teal-300/40 bg-white/[0.04]">0</span>
            </a>
            <button
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Menu"
              data-testid="mobile-menu-toggle-shop"
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

function MagneticButton({ className = '', children, onClick, type = 'button', style = {} }) {
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
    <button ref={btnRef} type={type} onClick={onClick} className={className} style={style}>
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
  const copy = COPY_MAP[product.id];

  return (
    <main ref={containerRef} style={{ '--accent': accent, '--accentGlow': accentGlow }} className="relative bg-[#0f172a] text-white selection:bg-ar-teal selection:text-white">
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
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.004]"
        style={{
          backgroundImage: 'linear-gradient(#F4F1EA 1px, transparent 1px), linear-gradient(90deg, #F4F1EA 1px, transparent 1px)',
          backgroundSize: '120px 120px'
        }}
      />
      <div className="relative z-[2]">
      <NoiseOverlay />
      <Navbar />

      <section className="hero relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 z-[2] opacity-[0.20] pointer-events-none" style={{ background: `radial-gradient(700px 500px at 20% 75%, ${accentGlow}, transparent 60%)` }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 px-5 md:px-8 pt-28 md:pt-32 pb-10 md:pb-16 items-center">

          <div className="w-full md:w-3/5 hero-content text-white text-center md:text-left relative">
            <div className="absolute -inset-x-8 -inset-y-4 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(15,23,42,0.65) 0%, transparent 100%)' }} />
            <div className="relative">
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.18em] font-bold mb-3 opacity-90" style={{ color: accentText }} data-testid="text-overline">{copy.overline}</span>

              <h1 className="font-head font-normal text-white tracking-[-0.04em] leading-[0.88] uppercase mb-3" style={{ fontSize: 'clamp(2.8rem, 9vw, 5.5rem)' }} data-testid="text-product-name"><BrandName name={product.name} /></h1>

              <p className="text-[15px] md:text-[17px] font-sans font-medium text-white/70 max-w-md mb-3 leading-snug mx-auto md:mx-0">{copy.subtitle}</p>

              <p className="text-[11px] font-mono text-white/40 tracking-[0.02em] max-w-md mx-auto md:mx-0" data-testid="text-micro-line">{copy.microLine}</p>
            </div>
          </div>

          <div className="w-full md:w-2/5 buy-panel">
            <div className="relative">
              <div className="absolute inset-0 -inset-x-4 pointer-events-none" style={{ background: `radial-gradient(ellipse 90% 70% at 50% 45%, ${hexToRgba(accent, 0.12)}, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="relative flex items-end justify-center px-6 pt-4 pb-2 md:px-10 md:pt-6 md:pb-3">
                  <div className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[80%] h-[70%] blur-[40px] opacity-20 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 60%, ${hexToRgba(accent, 0.5)}, transparent 70%)` }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[6px] rounded-[50%] blur-sm opacity-50 pointer-events-none" style={{ background: 'rgba(0,0,0,0.7)' }} />
                  <img src={product.heroImage} alt={product.name} className="relative z-10 w-[45%] md:w-[55%] max-h-[180px] md:max-h-none h-auto object-contain" style={{ filter: `drop-shadow(0 8px 16px ${hexToRgba(accent, 0.2)}) drop-shadow(0 3px 6px rgba(0,0,0,0.35))` }} />
                </div>

                <div className="px-2 pb-2 md:px-4 md:pb-4 space-y-2">
                  <div>
                    <span className="inline-block text-[10px] font-mono uppercase tracking-[0.14em] font-bold mb-1" style={{ color: accentText, textShadow: `0 0 12px ${hexToRgba(accent, 0.4)}` }}>{product.id === 'cellunova' ? '7-Day Cycle' : 'Daily Protocol'}</span>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[20px] md:text-[22px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-none"><BrandName name={product.name} /></h3>
                      <span className="text-[22px] md:text-[24px] font-sans font-black text-white leading-none tracking-[-0.03em]">{product.price}</span>
                    </div>
                  </div>

                  <p className="text-[13px] md:text-[14px] text-white/65 leading-snug font-sans tracking-[-0.01em]">{product.description}</p>

                  <div className="border-t border-white/[0.06] pt-2.5 mt-1">
                    <div className="flex flex-col gap-[2px]">
                      {product.outcomes.map((item, i) => (
                        <span key={i} className="text-[12px] font-sans font-medium text-white/75 leading-[1.75]">{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/25 tracking-[0.06em] uppercase">
                    <span>Glass bottle</span>
                    <span className="w-px h-2.5 bg-white/8" />
                    <span>UV-protected</span>
                    <span className="w-px h-2.5 bg-white/8" />
                    <span>{product.serving}</span>
                  </div>

                  {product.warnings && (
                    <div className="border-l-2 border-amber-400/30 pl-3 py-1">
                      <p className="text-[11px] text-amber-200/60 leading-snug font-sans">{product.warnings}</p>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-0.5">
                    <MagneticButton
                      className="w-full min-h-[40px] flex items-center justify-center gap-2 rounded-lg py-2 text-white font-mono font-bold tracking-[0.12em] text-[11px] uppercase active:scale-[0.98] transition-all relative overflow-hidden group"
                      style={{ background: `linear-gradient(145deg, ${hexToRgba(accent, 0.95)}, ${hexToRgba(accent, 0.65)})`, boxShadow: `0 0 8px ${hexToRgba(accent, 0.15)}, inset 0 1px 0 rgba(255,255,255,0.08)` }}
                      onClick={() => {}}
                    >
                      <span className="relative z-10">Add to Stack</span>
                      <ArrowRight size={13} className="relative z-10" />
                      <div className="absolute inset-0 bg-white/8 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </MagneticButton>

                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => setActiveSidePanel('ingredients')}
                        className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium text-white/35 hover:text-white/60 transition-colors duration-200"
                        data-testid="button-ingredients-pdp"
                      >
                        Ingredients
                      </button>
                      <span className="w-px h-3 bg-white/6" />
                      <button
                        onClick={() => setActiveSidePanel('rationale')}
                        className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium text-white/35 hover:text-white/60 transition-colors duration-200"
                        data-testid="button-evidence-pdp"
                      >
                        Evidence
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-12 md:py-16" data-testid="section-why">
        <div className="max-w-3xl mx-auto px-6">
          <div className="reveal">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] text-white/60 block mb-2" data-testid="text-why-label">{copy.why.label}</span>
            <h2 className="text-[22px] md:text-[28px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-3" data-testid="text-why-headline">{copy.why.headline}</h2>
            <p className="text-[14px] md:text-[15px] font-sans text-white/65 leading-relaxed max-w-xl" data-testid="text-why-body">{copy.why.body}</p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6"><div className="h-px bg-white/[0.06]" /></div>

      {/* WHAT */}
      <section className="py-12 md:py-16" data-testid="section-what">
        <div className="max-w-3xl mx-auto px-6">
          <div className="reveal">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] text-white/60 block mb-2" data-testid="text-what-label">{copy.what.label}</span>
            <h2 className="text-[22px] md:text-[28px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-4" data-testid="text-what-headline">{copy.what.headline}</h2>
            <div className="flex flex-col gap-1">
              {copy.what.lines.map((line, i) => (
                <span key={i} className="text-[13px] md:text-[14px] font-sans font-medium text-white/70 leading-[1.8]" data-testid={`what-line-${i}`}>{line}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6"><div className="h-px bg-white/[0.06]" /></div>

      {/* TELEMETRY */}
      <section className="py-12 md:py-16" data-testid="section-telemetry">
        <div className="max-w-3xl mx-auto px-6">
          <div className="reveal">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] text-white/60 block mb-2">Telemetry</span>
            <h2 className="text-[22px] md:text-[28px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-1.5">{copy.telemetry.headline}</h2>
            <p className="text-[13px] font-sans text-white/55 leading-relaxed max-w-xl mb-6">{copy.telemetry.body}</p>

            <div className="flex flex-col gap-0">
              {copy.telemetry.rows.map((row, i) => (
                <div key={i} className="flex items-baseline gap-4 py-2.5" data-testid={`telemetry-row-${i}`}>
                  <span className="font-mono text-[14px] font-black tracking-[0.04em] shrink-0 w-6 text-right" style={{ color: accentText }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-0 flex-1 border-b border-white/[0.05] pb-3">
                    <span className="text-[13px] font-sans font-bold text-white/90">{row.label}</span>
                    <span className="text-[11px] font-mono text-white/45 tracking-[0.02em] mt-0.5">{row.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6"><div className="h-px bg-white/[0.06]" /></div>

      {/* STANDARDS */}
      <section className="py-12 md:py-16" data-testid="section-standards">
        <div className="max-w-3xl mx-auto px-6">
          <div className="reveal">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] text-white/60 block mb-5">Formulation Standards</span>
            <div className="flex flex-col gap-4">
              {SHARED_STANDARDS.map((item, i) => (
                <div key={i} className="flex items-start gap-5" data-testid={`standard-${i}`}>
                  <span className="font-mono text-[14px] font-black tracking-[0.04em] shrink-0 w-6 text-right" style={{ color: accentText }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-sans font-bold text-white/90">{item.label}</span>
                    <span className="text-[12px] font-sans text-white/50 leading-snug">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6"><div className="h-px bg-white/[0.06]" /></div>

      {/* COMPOUND SPECIFICATION */}
      <section className="py-12 md:py-16" data-testid="section-spec">
        <div className="max-w-3xl mx-auto px-6">
          <div className="reveal mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] text-white/60 block mb-2">Compound Specification</span>
            <p className="text-[12px] font-mono text-white/50 tracking-[0.04em] uppercase mb-1">{copy.spec.meta}</p>
            <p className="text-[13px] font-sans text-white/55 leading-relaxed max-w-lg mb-1">{copy.spec.reassurance}</p>
            <p className="text-[11px] font-mono text-white/45 tracking-[0.04em]">{copy.spec.declaration}</p>
            {copy.spec.microNote && <p className="text-[11px] font-mono text-amber-300/50 tracking-[0.04em] mt-1">{copy.spec.microNote}</p>}
          </div>

          <div className="reveal border-t border-white/[0.06] pt-5">
            <IngredientPanel ingredients={product.ingredients} accentText={accentText} />
          </div>

          <div className="mt-5 space-y-1">
            <p className="text-[10px] font-mono text-white/50 tracking-[0.06em] leading-relaxed">All dosages reflect clinically studied ranges</p>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.06em] leading-relaxed">All compounds listed in bioavailable forms</p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6"><div className="h-px bg-white/[0.06]" /></div>

      {/* PROTOCOL ARC */}
      <section className="py-12 md:py-16" data-testid="section-arc">
        <div className="max-w-3xl mx-auto px-6">
          <div className="reveal">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.20em] text-white/60 block mb-2">Protocol Arc</span>
            <h2 className="text-[22px] md:text-[28px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-1.5">{copy.arc.headline}</h2>
            <p className="text-[13px] font-mono text-white/40 tracking-[-0.01em] mb-8">{copy.arc.subline}</p>

            <div className="relative">
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/[0.05]" />

              <div className="space-y-0">
                {copy.arc.phases.map((step, i) => (
                  <div key={i} className="relative pl-8 py-5 md:py-6 reveal" data-testid={`arc-phase-${i}`}>
                    <div className="absolute left-0 top-[26px] w-[15px] h-[15px] flex items-center justify-center">
                      <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accentText, opacity: 0.45 }} />
                    </div>

                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[11px] font-mono font-black uppercase tracking-[0.06em]" style={{ color: accentText }}>Phase {step.phase}</span>
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.08em]">{step.time}</span>
                    </div>
                    <h4 className="text-[15px] md:text-[16px] font-sans font-bold text-white/90 tracking-[-0.01em] mb-1">{step.label}</h4>
                    <p className="text-[13px] font-sans text-white/55 leading-relaxed max-w-md">{step.desc}</p>

                    {i < copy.arc.phases.length - 1 && <div className="h-px bg-white/[0.03] mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6"><div className="h-px bg-white/[0.06]" /></div>

      {/* CLOSE */}
      <section className="py-12 md:py-16" data-testid="section-close">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="reveal">
            <h2 className="text-[22px] md:text-[28px] font-head font-normal tracking-[-0.03em] uppercase text-white leading-tight mb-3" data-testid="text-close-headline">{copy.close.headline}</h2>
            <p className="text-[14px] font-sans text-white/55 leading-relaxed max-w-md mx-auto mb-6">{copy.close.body}</p>

            <div className="flex flex-col items-center gap-3">
              <MagneticButton
                className="min-h-[44px] min-w-[200px] flex items-center justify-center gap-2 py-3 px-8 text-white font-mono font-bold tracking-[0.12em] text-[11px] uppercase active:scale-[0.98] transition-all relative overflow-hidden group"
                style={{ background: `linear-gradient(145deg, ${hexToRgba(accent, 0.95)}, ${hexToRgba(accent, 0.65)})`, boxShadow: `0 0 8px ${hexToRgba(accent, 0.15)}, inset 0 1px 0 rgba(255,255,255,0.08)` }}
                onClick={() => {}}
              >
                <span className="relative z-10">Add to Stack</span>
                <ArrowRight size={13} className="relative z-10" />
                <div className="absolute inset-0 bg-white/8 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </MagneticButton>

              <button
                onClick={() => setActiveSidePanel('rationale')}
                className="font-mono uppercase text-[10px] tracking-[0.14em] font-medium hover:opacity-80 transition-opacity"
                style={{ color: accentText }}
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

        {product.warnings && (
          <div className="mt-8 p-5 bg-red-500/[0.06] border border-red-500/15 rounded-lg">
            <p className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-[0.12em] mb-1">Warning</p>
            <p className="text-[13px] font-sans font-medium text-white/75">{product.warnings}</p>
          </div>
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

export default function Shop() {
  const params = useParams<{ slug?: string }>();
  const initialSlug = (params.slug && PRODUCTS[params.slug]) ? params.slug : 'cellunad';
  const [slug, setSlug] = useState(initialSlug);
  const [railVisible, setRailVisible] = useState(true);
  const currentProduct = PRODUCTS[slug];
  const footerSentinelRef = useRef(null);

  useEffect(() => {
    if (params.slug && PRODUCTS[params.slug] && params.slug !== slug) {
      setSlug(params.slug);
    }
  }, [params.slug]);

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
              onClick={() => setSlug(p.id)}
              className={[
                'px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.14em] transition-all min-h-[44px] relative',
                slug === p.id ? 'text-white' : 'text-white/40 hover:text-white/65'
              ].join(' ')}
              data-testid={`switcher-${p.id}`}
            >
              <BrandName name={p.name} />
              {slug === p.id && (
                <span className="absolute bottom-0 left-3 right-3 h-[1.5px]" style={{ background: p.accentText || p.accent, opacity: 0.6 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
