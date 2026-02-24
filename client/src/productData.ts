export const PRODUCT_IMAGES: Record<string, string[]> = {
  cellunad: ['/images/product-bottle_1.jpg', '/images/product-capsules_1.jpg', '/images/lifestyle-wellness_1.jpg', '/images/lab-testing.jpg'],
  cellubiome: ['/images/cellubiome-bottle.jpg', '/images/cellubiome-2.png', '/images/cellubiome-3.png', '/images/cellubiome-4.png', '/images/cellubiome-5.png'],
  cellunova: ['/images/product-bottle_3.jpg', '/images/product-bottle_1.jpg', '/images/product-capsules_1.jpg', '/images/how-to-use.jpg'],
};

export const PRODUCT_DETAIL_DATA = {
  cellunad: {
    name: "CELLUNAD+",
    tagline: "Daily NAD+ Optimization",
    subtitle: "Clinically studied NAD+ precursor with essential co-factors for energy, DNA maintenance, and healthy aging.*",
    heroBullets: {
      lead: "Clinically studied NAD+ precursor with essential co-factors.*",
      points: [
        "500 mg NR for daily cellular energy*",
        "Complete methylation support with TMG + B vitamins*",
        "Apigenin to help protect NAD+ levels*"
      ]
    },
    rating: 4.8,
    reviewCount: 847,
    form: "Capsules",
    serving: "2 capsules daily with a meal",
    servingsPerContainer: 30,
    priceOneTime: 79.99,
    priceSubscribe: 67.99,
    accent: '#1e3a8a',
    accentText: '#60a5fa',
    supplyLabel: '30-day supply delivered monthly.',
    subscribeNote: 'Pause or cancel anytime.',
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
    benefitSectionOverride: {
      eyebrow: "Biological Function",
      headlinePrimary: "Foundation",
      headlineSecondary: "Layer",
      subhead: "Supports NAD+ regeneration, mitochondrial energy metabolism, and methylation balance at the cellular level.",
    },
    benefitHighlights: [
      { icon: 'Zap', title: "NAD+ Restoration", desc: "Delivers 500 mg Nicotinamide Riboside (NR) to support intracellular NAD+ levels. NAD+ supports cellular energy production, DNA repair processes, and sirtuin pathway activity." },
      { icon: 'Shield', title: "Mitochondrial Support", desc: "Supports mitochondrial function and oxidative balance through R-Lipoic Acid and NAD+-dependent metabolic pathways." },
      { icon: 'Dna', title: "Methylation Support", desc: "Includes Betaine (TMG), P-5-P, 5-MTHF, and Methylcobalamin to support methylation processes associated with NAD+ metabolism and homocysteine balance." },
    ],
    timelineHeadline: 'Biological Improvements Over Time',
    timelineSubline: 'What consistent NAD+ support may look like.*',
    timelineConfidence: 'Designed for cumulative cellular adaptation, not temporary energy masking.',
    benefitsTimeline: [
      { time: "2 Weeks", items: ["Early improvements in daily energy consistency*", "Initial support for NAD+ biosynthesis pathways*", "More stable metabolic rhythm*"] },
      { time: "4 Weeks", items: ["Support for mitochondrial energy efficiency*", "Support for cellular repair and resilience pathways*", "Improved day-to-day performance consistency*"] },
      { time: "8 Weeks", items: ["Sustained NAD+ pathway support*", "Compounded mitochondrial support with consistent use*", "Greater metabolic stress resilience support*"] },
      { time: "3 Months", items: ["Long-term foundation for mitochondrial function support*", "Ongoing support for genomic stability processes*", "Stable methylation and metabolic balance support*"] },
    ],
    howToUse: {
      instruction: "Take 2 capsules daily. With or without food.",
      tips: ["Consistency matters more than timing.", "Designed for daily NAD+ pathway support.", "Stacks cleanly with CELLUBIOME for gut–mitochondria support."],
      microNote: "Tip: Take at the same time each day to build the habit.",
    },
    ingredientGroups: [
      {
        category: "NAD+ Restoration",
        totalDose: "500 mg Nicotinamide Riboside (NR)",
        desc: "Clinically studied dose used in published research on NAD+ support and mitochondrial function.",
        ingredients: ["Nicotinamide Riboside (NR) — 500 mg"],
      },
      {
        category: "Mitochondrial Cofactor Support",
        totalDose: "200 mg R-Lipoic Acid",
        desc: "Supports mitochondrial oxidative balance and metabolic efficiency.",
        ingredients: ["R-Lipoic Acid — 200 mg"],
      },
      {
        category: "Methylation Support Complex",
        totalDose: "Co-Factors",
        desc: "Supports methylation pathways associated with NAD+ metabolism.",
        ingredients: ["Betaine (TMG) — 250 mg", "P-5-P — 10 mg", "5-MTHF — 400 mcg DFE", "Methylcobalamin — 1,000 mcg", "Apigenin — 100 mg", "BioPerine — 5 mg"],
      },
    ],
    qualityBadges: ["cGMP Manufactured", "Third-Party Tested", "Vegan", "No Artificial Fillers", "Full Label Disclosure", "Glass Packaging"],
    comparison: {
      us: ["500 mg Nicotinamide Riboside (NR)", "Includes methylation co-factors (TMG, 5-MTHF, methyl-B12)", "Designed for daily NAD+ pathway support", "Third-party tested", "Full label disclosure (no proprietary blends)"],
      them: ["Lower NR dosing common", "Missing co-factor support", "Inconsistent testing standards", "Proprietary blends (unclear dosing)"],
    },
    scienceSection: {
      headline: 'NAD+ and Cellular Energy Metabolism',
      paragraphs: [
        '<strong>NAD+</strong> (nicotinamide adenine dinucleotide) is a core coenzyme in cellular energy metabolism and genomic stability. NAD+ availability influences mitochondrial efficiency and cellular stress resilience, and NAD+ levels tend to decline with age.',
        'CELLUNAD+ provides <strong>Nicotinamide Riboside (NR)</strong>, a precursor used by cells to synthesize NAD+, alongside <strong>methylation</strong> and cofactor support to maintain balanced NAD+ metabolism.'
      ],
      microProof: 'Formulated for sustained pathway support, not transient stimulation.',
      diagramLabel: 'NAD+ Pathway',
      diagramCenter: { label: 'NAD+ Pool', icon: '' } as { label: string; icon: string } | null,
      diagramNodes: [
        { label: "Energy Metabolism", icon: 'Zap' },
        { label: "DNA Maintenance", icon: 'Dna' },
        { label: "Cellular Signaling", icon: 'Activity' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    deliveryRationale: { headline: 'Why Co-Factors Matter', text: 'NR-driven NAD+ support interacts with methylation pathways. Betaine (TMG), P-5-P, 5-MTHF, and Methylcobalamin provide cofactor support designed to keep NAD+ metabolism balanced with consistent daily use.' } as { headline: string; text: string } | null,
    suitability: [
      "Adults focused on healthy aging and daily resilience",
      "Those supporting NAD+ and cellular energy metabolism",
      "Those prioritizing mitochondrial function support",
      "Stacks well with gut–mitochondria support (CELLUBIOME)"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.',
    allergenDisclosure: null as string | null,
    stack: [
      { name: "CELLUBIOME", slug: "cellubiome", role: "Gut + Mitochondria", add: "Pair NAD+ support with gut barrier integrity and mitochondrial renewal.", when: "Daily use" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Monthly Reset", add: "Add a periodic 7-day cellular cleanup cycle to complement daily NAD+ support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long before I notice anything?", a: "Most people evaluate meaningful changes after 8–12 weeks of consistent daily use.*" },
      { q: "Can I take it with food?", a: "Yes. Take with or without food. Consistency matters more than timing." },
      { q: "What is Nicotinamide Riboside (NR)?", a: "Nicotinamide Riboside (NR) is a precursor to NAD+, a coenzyme required for mitochondrial energy production and cellular repair processes." },
      { q: "Why include methylation support ingredients?", a: "NAD+ metabolism interacts with methylation pathways. Betaine (TMG), P-5-P, 5-MTHF, and Methylcobalamin support balanced NAD+ metabolism with consistent use." },
      { q: "Is this a stimulant?", a: "No. CELLUNAD+ supports cellular energy metabolism through NAD+ pathways, not stimulant compounds." }
    ],
    ctaHeadline: ['Start your', 'daily foundation.'],
    ctaBody: 'Add CELLUNAD+ to your routine for daily NAD+ and energy support.',
    ctaButton: 'Start Now',
  },

  cellubiome: {
    name: "CELLUBIOME",
    tagline: "Gut–Mitochondria Axis",
    subtitle: "Recycle damaged mitochondria. Reinforce gut barrier integrity. Two clinically studied compounds working together to restore cellular energy from the inside out.*",
    heroBullets: {
      lead: "Two clinically studied compounds for gut and mitochondrial health.*",
      points: [
        "Recycles damaged mitochondria for renewed energy*",
        "Reinforces gut barrier integrity*",
        "Restores cellular energy from the inside out*"
      ]
    },
    rating: 4.9,
    reviewCount: 623,
    form: "Enteric Capsules",
    serving: "2 capsules daily",
    servingsPerContainer: 30,
    priceOneTime: 110.00,
    priceSubscribe: 93.50,
    accent: '#19B3A6',
    accentText: '#5eead4',
    supplyLabel: '30-day supply delivered monthly.',
    subscribeNote: 'Pause or cancel anytime.',
    supplementFacts: {
      servingSize: "2 Capsules",
      servingsPerContainer: "30",
      items: [
        { name: "Urolithin A (≥99% Purity)", amount: "500 mg", dv: "" },
        { name: "Tributyrin (Butyrate Precursor)", amount: "500 mg", dv: "" }
      ],
      otherIngredients: "Veg. cellulose (capsule), rice flour, magnesium stearate, silica.",
      allergenNote: null as string | null
    },
    benefitSectionOverride: {
      eyebrow: "Biological Function",
      headlinePrimary: "Signal Stability",
      headlineSecondary: "Layer",
      subhead: "Supports mitochondrial renewal and gut barrier resilience to preserve internal signaling balance.",
    },
    benefitHighlights: [
      { icon: 'RotateCcw', title: "Mitochondrial Renewal", desc: "500 mg Urolithin A supports mitophagy and the renewal of aging mitochondria. Sustains cellular energy efficiency over time." },
      { icon: 'Layers', title: "Gut Barrier Integrity", desc: "Enteric Tributyrin delivers bioavailable butyrate to reinforce intestinal barrier integrity. Supports microbial balance and long-term signaling stability." },
    ],
    timelineHeadline: 'Biological Improvements Over Time',
    timelineSubline: 'What consistent cellular support may look like.*',
    timelineConfidence: 'Designed for cumulative biological adaptation, not temporary symptom masking.',
    benefitsTimeline: [
      { time: "2 Weeks", items: ["Early digestive comfort improvements*", "Butyrate begins supporting intestinal barrier cells*", "Initial cellular recycling support via mitophagy activation*"] },
      { time: "4 Weeks", items: ["Improved gut barrier resilience*", "More consistent mitochondrial energy efficiency*", "Reduction in digestive variability*"] },
      { time: "8 Weeks", items: ["Strengthened gut–mitochondria signaling*", "Enhanced cellular renewal dynamics*", "Greater systemic resilience*"] },
      { time: "3 Months", items: ["Compounded support for mitochondrial function*", "Sustained intestinal barrier integrity*", "Long-term biological stability foundation*"] },
    ],
    howToUse: {
      instruction: "Take 2 capsules daily. With or without food.",
      tips: ["Consistency matters more than timing.", "Enteric coating supports targeted intestinal release.", "Stacks cleanly with CELLUNAD+ for daily NAD+ support."],
      microNote: "Tip: Take at the same time each day to build the habit.",
    },
    ingredientGroups: [
      {
        category: "Mitochondrial Renewal",
        totalDose: "500 mg Urolithin A",
        desc: "Clinically studied at 500 mg to support mitochondrial recycling (mitophagy) and cellular energy efficiency.",
        ingredients: ["Urolithin A (≥99% Purity) — 500 mg"],
      },
      {
        category: "Gut Barrier Support",
        totalDose: "500 mg Tributyrin",
        desc: "A stable butyrate precursor that supports intestinal barrier integrity and microbiome-related gut resilience.",
        ingredients: ["Tributyrin (Butyrate Precursor) — 500 mg"],
      },
    ],
    qualityBadges: ["cGMP Manufactured", "Third-Party Tested", "Enteric Protected", "Vegan", "Full Label Disclosure", "No Artificial Fillers"],
    comparison: {
      us: ["500 mg clinically studied Urolithin A", "500 mg Tributyrin (butyrate precursor)", "Enteric-coated for targeted intestinal release", "Third-party tested for purity and contaminants", "Full label disclosure (no proprietary blends)"],
      them: ["Sub-clinical Urolithin A doses common", "No enteric protection", "Butyrate salts or low-potency forms", "Limited third-party testing", "Proprietary blends (unclear dosing)"],
    },
    scienceSection: {
      headline: 'The Gut–Mitochondria Axis',
      paragraphs: [
        'The gut barrier and mitochondrial function are biologically interconnected. Disruption in either system can amplify inflammation, impair cellular energy production, and accelerate biological aging.',
        'CELLUBIOME delivers clinically studied doses of <strong>Urolithin A</strong> and <strong>Tributyrin</strong> to support <strong>mitophagy</strong> activation, intestinal barrier integrity, and gut–mitochondria signaling resilience.',
      ],
      microProof: 'Formulated to target both mitochondrial renewal and butyrate-mediated gut repair.',
      ctaSupport: 'Restore internal signal stability at the cellular level.',
      diagramLabel: 'Gut–Mito Axis',
      diagramCenter: { label: 'Mitochondria', icon: 'Zap' },
      diagramNodes: [
        { label: "Gut Barrier", icon: 'Layers' },
        { label: "Mitophagy", icon: 'RotateCcw' },
        { label: "Butyrate Delivery", icon: 'ShieldCheck' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    deliveryRationale: {
      headline: 'Why Enteric Delivery Matters',
      paragraphs: [
        '<strong>Urolithin A</strong> and <strong>Tributyrin</strong> must reach the small intestine intact to activate <strong>mitophagy</strong> pathways and deliver bioavailable <strong>butyrate</strong>.',
        'Standard capsules can degrade in stomach acid. CELLUBIOME uses enteric delivery to protect active compounds until they reach the intestinal environment where absorption and barrier support occur.',
      ],
      microProof: 'Targeted intestinal release enhances biological efficacy and supports gut–mitochondria signaling stability.',
    },
    suitability: [
      "Adults focused on healthy aging and resilience",
      "Those supporting mitochondrial function and cellular renewal",
      "Those prioritizing gut barrier integrity and digestive consistency",
      "Stacks well with NAD+ support protocols (CELLUNAD+)"
    ],
    safetyNote: 'Consult your healthcare provider before use if pregnant, nursing, taking medication, or managing a medical condition.',
    allergenDisclosure: null as string | null,
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "Daily NAD+", add: "Pair mitochondrial renewal with daily NAD+ support for your Foundation Layer.", when: "Daily use" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Monthly Reset", add: "Add a periodic 7-day reset cycle to complement daily support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long before I notice anything?", a: "Most people evaluate meaningful changes after 8–12 weeks of consistent daily use.* Early digestive comfort may appear sooner.*" },
      { q: "Can I take it with food?", a: "Yes. Take with or without food. Consistency matters more than timing." },
      { q: "Is this a probiotic?", a: "No. CELLUBIOME is not a probiotic. It provides Urolithin A and Tributyrin to support mitochondrial function, mitophagy pathways, and gut barrier integrity." },
      { q: "Why 500 mg Urolithin A?", a: "500 mg is the clinically studied dose used in published research on mitochondrial function and cellular recycling (mitophagy)." },
      { q: "Why Tributyrin instead of butyrate salts?", a: "Tributyrin is a stable butyrate precursor designed to deliver bioavailable butyrate support without relying on common butyrate salts." }
    ],
    ctaHeadline: ['Strengthen the', 'foundation.'],
    ctaBody: 'Add CELLUBIOME for daily gut barrier and mitochondrial support.',
    ctaButton: 'Start Now',
  },

  cellunova: {
    name: "CELLUNOVA",
    tagline: "7-Day Autophagy Cycle",
    subtitle: "A focused 7-day cycle with senolytics and autophagy activators for deep cellular cleanup and renewal.*",
    heroBullets: {
      lead: "A focused 7-day cycle for deep cellular cleanup and renewal.*",
      points: [
        "Senolytic compounds target damaged cells*",
        "Autophagy activators promote cellular recycling*",
        "Cyclical protocol for sustained renewal*"
      ]
    },
    rating: 4.7,
    reviewCount: 412,
    form: "Capsules",
    serving: "5 capsules daily for 7 consecutive days",
    servingsPerContainer: 7,
    priceOneTime: 145.00,
    priceSubscribe: 123.25,
    accent: '#6C5CE7',
    accentText: '#a78bfa',
    supplyLabel: '7-day cycle, once per month.',
    subscribeNote: 'Ships monthly. Pause or cancel anytime.',
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
    benefitSectionOverride: {
      eyebrow: "Biological Function",
      headlinePrimary: "Controlled",
      headlineSecondary: "Reset",
      subhead: "Designed as a 7-day protocol to periodically support autophagy-related pathways, cellular cleanup, and mitochondrial resilience.",
    },
    benefitHighlights: [
      { icon: 'RotateCcw', title: "Autophagy Support", desc: "Includes Spermidine, Trans-Resveratrol, and Green Tea Extract (50% EGCG) to support autophagy pathways involved in cellular maintenance." },
      { icon: 'Wind', title: "Senolytic Support", desc: "Quercetin and Fisetin are studied for their role in supporting the body's natural clearance processes associated with cellular senescence." },
      { icon: 'Flame', title: "Mitochondrial Resilience", desc: "NAC, PQQ, Astaxanthin, and Ca-AKG support mitochondrial and oxidative defense pathways during metabolic stress." },
    ],
    timelineHeadline: 'Protocol Effects Over Time',
    timelineSubline: 'What a structured 7-day cycle may look like.*',
    timelineConfidence: 'Designed as a periodic cycle alongside daily support, not a daily baseline.',
    benefitsTimeline: [
      { time: "7-Day Cycle", items: ["Support for autophagy-related pathways*", "Senolytic compound exposure during the protocol window*", "Mitochondrial oxidative defense support*"] },
      { time: "Monthly", items: ["Compounded cellular cleanup support across cycles*", "Reinforcement of mitochondrial maintenance pathways*", "Structured reset layered onto daily foundation support*"] },
    ],
    howToUse: {
      instruction: "Take 5 capsules daily for 7 days. Repeat monthly.",
      tips: ["Designed as a periodic protocol, not daily use.", "Stacks with CELLUNAD+ and CELLUBIOME as daily foundation support.", "Take with food if preferred for comfort."],
      microNote: "Contains wheat (spermidine source).",
    },
    ingredientGroups: [
      {
        category: "Autophagy Support Complex",
        totalDose: "Pathway Support",
        desc: "Compounds studied for autophagy and cellular maintenance pathways.",
        ingredients: ["NAC — 600 mg", "Trans-Resveratrol — 500 mg", "Green Tea Extract (50% EGCG) — 300 mg", "Spermidine (wheat germ) — 15 mg", "BioPerine — 5 mg"],
      },
      {
        category: "Senolytic Support",
        totalDose: "Cellular Senescence",
        desc: "Compounds studied in senescence-related research.",
        ingredients: ["Quercetin — 500 mg", "Fisetin — 100 mg"],
      },
      {
        category: "Mitochondrial & Antioxidant Support",
        totalDose: "Resilience",
        desc: "Supports mitochondrial resilience during metabolic stress.",
        ingredients: ["Astaxanthin — 4 mg", "PQQ — 10 mg", "Ca-AKG — 300 mg"],
      },
    ],
    qualityBadges: ["cGMP Manufactured", "Third-Party Tested", "Contains Wheat", "Full Label Disclosure", "No Artificial Fillers", "Cyclical Protocol"],
    comparison: {
      us: ["7-day structured protocol format", "Autophagy + senolytic research compounds in disclosed doses", "Includes mitochondrial resilience support (NAC, PQQ, Astaxanthin, Ca-AKG)", "Third-party tested", "Full label disclosure (no proprietary blends)"],
      them: ["Low-dose daily blends", "Unclear dosing (proprietary blends)", "Incomplete pathway coverage", "Inconsistent testing standards"],
    },
    scienceSection: {
      headline: 'Autophagy, Senescence, and Cellular Renewal',
      paragraphs: [
        '<strong>Autophagy</strong> is a cellular recycling process involved in maintaining mitochondrial function and cellular homeostasis. Age-related decline in autophagy can contribute to accumulation and metabolic inefficiency.',
        'CELLUNOVA is structured as a 7-day protocol using compounds studied in <strong>autophagy</strong> and <strong>senolytic</strong> research, designed to complement daily foundational support.'
      ],
      microProof: 'Designed as a periodic cycle alongside daily support, not a daily baseline.',
      diagramLabel: '7-Day Cycle',
      diagramCenter: null as { label: string; icon: string } | null,
      diagramNodes: [
        { label: "Cleanup", icon: 'RotateCcw' },
        { label: "Removal", icon: 'Wind' },
        { label: "Recovery", icon: 'Zap' }
      ],
      diagramFooter: { label: '7-Day Focused Cycle', text: 'Seven days of targeted support, then time off. The rest period is part of the design.' }
    },
    deliveryRationale: null as { headline: string; text: string } | null,
    suitability: [
      "Adults focused on periodic cellular renewal support",
      "Those running structured longevity protocols",
      "Those stacking daily foundation support with periodic cycles",
      "Those supporting autophagy-related pathways"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.',
    allergenDisclosure: 'Contains Wheat (from Wheat Germ derived Spermidine).',
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "Daily NAD+", add: "Continue daily NAD+ support while running the 7-day CELLUNOVA cycle.", when: "Daily use" },
      { name: "CELLUBIOME", slug: "cellubiome", role: "Gut + Mitochondria", add: "Support gut barrier integrity and mitochondrial renewal alongside periodic cleanup.", when: "Daily use" }
    ],
    faq: [
      { q: "Is CELLUNOVA taken daily?", a: "No. CELLUNOVA is a 7-day protocol designed to be repeated monthly." },
      { q: "What is autophagy?", a: "Autophagy is a cellular recycling process involved in maintaining mitochondrial function and cellular homeostasis." },
      { q: "Can I stack it with CELLUNAD+ and CELLUBIOME?", a: "Yes. CELLUNOVA is designed as a periodic reset layered onto daily NAD+ and gut–mitochondria support." },
      { q: "Should I take it with food?", a: "You can take it with or without food. Many people prefer taking it with food for comfort." },
      { q: "Does it contain allergens?", a: "Contains wheat (spermidine source)." }
    ],
    ctaHeadline: ['Reset.', 'Renew.'],
    ctaBody: 'Add CELLUNOVA for a focused 7-day cellular cleanup cycle.',
    ctaButton: 'Start Now',
  }
};
