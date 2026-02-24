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
    benefitHighlights: [
      { icon: 'Zap', title: "NAD+ Replenishment", desc: "500 mg NR supports daily NAD+ production in every cell." },
      { icon: 'Dna', title: "DNA Maintenance", desc: "NAD+ is required by enzymes that maintain and repair DNA." },
      { icon: 'Brain', title: "Mental Clarity", desc: "Supports cellular energy production in the brain." },
      { icon: 'Shield', title: "Methylation Balance", desc: "TMG + B vitamins keep methylation pathways in balance." },
    ],
    benefitsTimeline: [
      { time: "1 Week", items: ["Initial energy support begins*", "NAD+ precursors begin building in your system*"] },
      { time: "2 Weeks", items: ["Noticeable improvement in daily energy*", "Supports mental clarity and focus*"] },
      { time: "4 Weeks", items: ["Sustained cellular energy support*", "Supports healthy methylation balance*"] },
      { time: "3 Months", items: ["Long-term NAD+ level support*", "Foundation for healthy aging*", "Supports DNA maintenance processes*"] },
    ],
    howToUse: {
      instruction: "Take 2 capsules daily with a meal, morning or afternoon.",
      tips: ["Consistency matters more than timing", "Take with food for best absorption", "Pairs well with CELLUBIOME"],
    },
    ingredientGroups: [
      {
        category: "NAD+ Support Complex",
        totalDose: "500 mg NR + 100 mg Apigenin",
        desc: "Core NAD+ precursor and preservation compounds for daily cellular energy.",
        ingredients: ["Nicotinamide Riboside (NR) — 500 mg", "Apigenin — 100 mg"],
      },
      {
        category: "Methylation Support",
        totalDose: "TMG 250 mg + B-Complex",
        desc: "Essential cofactors that keep methylation pathways balanced alongside NAD+ supplementation.",
        ingredients: ["Betaine (TMG) — 250 mg", "Vitamin B6 (P-5-P) — 10 mg", "Folate (5-MTHF) — 400 mcg", "Vitamin B12 (Methylcobalamin) — 1,000 mcg"],
      },
      {
        category: "Absorption & Bioavailability",
        totalDose: "R-Lipoic Acid 200 mg + BioPerine 5 mg",
        desc: "Supports metabolic enzyme function and enhances bioavailability of all active compounds.",
        ingredients: ["R-Lipoic Acid — 200 mg", "BioPerine (Black Pepper Extract) — 5 mg"],
      },
    ],
    qualityBadges: ["cGMP Manufactured", "Third-Party Tested", "Vegan", "No Artificial Fillers", "Full Label Disclosure", "Glass Packaging"],
    comparison: {
      us: ["500 mg clinically studied NR", "Complete methylation co-factors", "Third-party tested for purity", "Full label disclosure", "Bioavailability-enhanced"],
      them: ["Low-dose or unstudied forms", "Missing essential co-factors", "Rarely third-party tested", "Proprietary blends", "No absorption support"],
    },
    scienceSection: {
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
    deliveryRationale: null as { headline: string; text: string } | null,
    suitability: [
      "Adults seeking daily NAD+ support",
      "Those focused on energy and mental clarity",
      "Longevity-focused wellness routines",
      "Anyone looking to support healthy aging"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.',
    allergenDisclosure: null as string | null,
    stack: [
      { name: "CELLUBIOME", slug: "cellubiome", role: "Gut + Mitochondria", add: "Pair NAD+ support with gut barrier and mitochondrial quality.", when: "Take daily" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Monthly Reset", add: "Add a periodic 7-day reset to complement daily NAD+ support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long does it take to notice effects?", a: "Most people evaluate changes over 2–3 months of consistent daily use." },
      { q: "When should I take it?", a: "Take 2 capsules daily with a meal, morning or afternoon. Consistency matters more than timing." },
      { q: "Does it break a fast?", a: "It has no meaningful caloric load, but if you fast strictly, take it with your first meal." },
      { q: "Can I take it with CELLUNOVA?", a: "Yes. CELLUNAD+ is designed for daily use. CELLUNOVA is a separate 7-day monthly cycle." },
      { q: "Why include methylation support?", a: "NAD+ and methylation pathways are closely linked. TMG and methylated B vitamins help keep both in balance." },
      { q: "Who should avoid it?", a: "Check with your doctor if pregnant, nursing, on medication, or managing a medical condition." }
    ],
    ctaHeadline: ['Start your', 'daily foundation.'],
    ctaBody: 'Add CELLUNAD+ to your routine for daily NAD+ and energy support.',
    ctaButton: 'Start Now',
  },

  cellubiome: {
    name: "CELLUBIOME",
    tagline: "Gut–Mitochondria Axis",
    subtitle: "Recycle damaged mitochondria. Reinforce gut barrier integrity. Two clinically studied compounds working together to restore cellular energy from the inside out.*",
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
    benefitHighlights: [
      { icon: 'RotateCcw', title: "Mitochondrial Renewal", desc: "500 mg Urolithin A supports recycling of damaged mitochondria." },
      { icon: 'Layers', title: "Gut Barrier Integrity", desc: "Tributyrin delivers butyrate to strengthen intestinal lining." },
      { icon: 'ShieldCheck', title: "Enteric Protected", desc: "Coating protects compounds from stomach acid for targeted delivery." },
      { icon: 'Heart', title: "Healthy Aging", desc: "Addresses two pillars of aging — gut health and mitochondrial function." },
    ],
    benefitsTimeline: [
      { time: "2 Weeks", items: ["Gut comfort improvements begin*", "Butyrate begins supporting intestinal lining*"] },
      { time: "4 Weeks", items: ["Enhanced digestive regularity*", "Mitochondrial recycling pathways activated*"] },
      { time: "8 Weeks", items: ["Measurable gut barrier support*", "Sustained mitochondrial quality*"] },
      { time: "3 Months", items: ["Long-term gut–mitochondria axis support*", "Foundation for cellular longevity*", "Noticeable energy and resilience*"] },
    ],
    howToUse: {
      instruction: "Take 2 capsules daily. With or without food.",
      tips: ["Consistency is more important than timing", "Enteric coating handles digestion", "Pairs well with CELLUNAD+"],
    },
    ingredientGroups: [
      {
        category: "Mitochondrial Renewal",
        totalDose: "500 mg Urolithin A",
        desc: "Clinically studied at 500 mg to support mitochondrial recycling (mitophagy) and cellular energy.",
        ingredients: ["Urolithin A (≥99% Purity) — 500 mg"],
      },
      {
        category: "Gut Barrier Support",
        totalDose: "500 mg Tributyrin",
        desc: "A stable form of butyrate that supports intestinal lining integrity and gut health.",
        ingredients: ["Tributyrin (Butyrate Precursor) — 500 mg"],
      },
    ],
    qualityBadges: ["cGMP Manufactured", "Third-Party Tested", "Enteric Protected", "Vegan", "Full Label Disclosure", "No Artificial Fillers"],
    comparison: {
      us: ["500 mg clinical-dose Urolithin A", "Enteric-coated for targeted delivery", "Pure Tributyrin for gut support", "Third-party tested for purity", "Full label disclosure"],
      them: ["Sub-clinical doses common", "No enteric protection", "Generic butyrate salts", "Rarely third-party tested", "Proprietary blends"],
    },
    scienceSection: {
      headline: 'The Gut–Mitochondria Connection',
      paragraphs: [
        'Your gut health and mitochondrial function are deeply connected. When either weakens, the other suffers—creating a cycle that accelerates aging.',
        'CELLUBIOME addresses both sides: Urolithin A supports mitochondrial renewal, while Tributyrin supports gut barrier strength. Together, they help break the cycle.'
      ],
      diagramLabel: 'Gut–Mito Axis',
      diagramCenter: { label: 'Mitochondria', icon: 'Zap' },
      diagramNodes: [
        { label: "Gut Barrier", icon: 'Layers' },
        { label: "Mitochondrial Renewal", icon: 'ShieldCheck' },
        { label: "Barrier Defense", icon: 'ShieldCheck' }
      ],
      diagramFooter: null as { label: string; text: string } | null
    },
    deliveryRationale: {
      headline: 'Why Enteric Delivery Matters',
      text: 'Tributyrin and Urolithin A need to reach the intestines intact. Our enteric coating protects them from stomach acid so they arrive where your body can use them most.'
    },
    suitability: [
      "Adults focused on healthy aging",
      "Those seeking mitochondrial support",
      "Gut barrier and digestive health",
      "Pairs well with NAD+ support"
    ],
    safetyNote: 'Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition.',
    allergenDisclosure: null as string | null,
    stack: [
      { name: "CELLUNAD+", slug: "cellunad", role: "Daily NAD+", add: "Pair mitochondrial renewal with daily NAD+ support.", when: "Take daily" },
      { name: "CELLUNOVA", slug: "cellunova", role: "Monthly Reset", add: "Add a periodic cellular cleanup cycle alongside daily support.", when: "7-day monthly cycle" }
    ],
    faq: [
      { q: "How long before I notice anything?", a: "Give it 8–12 weeks of consistent daily use for a meaningful evaluation." },
      { q: "Can I take it with food?", a: "Yes. Take it with or without a meal. Consistency is more important than timing." },
      { q: "Is this a probiotic?", a: "No. CELLUBIOME provides Urolithin A and Tributyrin—targeted compounds, not live cultures." },
      { q: "Why 500 mg Urolithin A?", a: "500 mg is the dose used in published clinical research on mitochondrial health." },
      { q: "Why Tributyrin instead of butyrate salts?", a: "Tributyrin is more stable and survives digestion better, delivering butyrate directly to the gut lining." }
    ],
    ctaHeadline: ['Strengthen the', 'foundation.'],
    ctaBody: 'Add CELLUBIOME for daily gut barrier and mitochondrial support.',
    ctaButton: 'Start Now',
  },

  cellunova: {
    name: "CELLUNOVA",
    tagline: "7-Day Autophagy Cycle",
    subtitle: "A focused 7-day cycle with senolytics and autophagy activators for deep cellular cleanup and renewal.*",
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
    benefitHighlights: [
      { icon: 'RotateCcw', title: "Autophagy Activation", desc: "Supports your body's natural cellular cleanup processes." },
      { icon: 'Wind', title: "Senolytic Support", desc: "Helps manage aging, non-functional 'zombie' cells." },
      { icon: 'Flame', title: "Antioxidant Defense", desc: "NAC + Astaxanthin support antioxidant balance during cleanup." },
      { icon: 'Timer', title: "Cyclical by Design", desc: "7 days on, 3 weeks off. The rest period is part of the design." },
    ],
    benefitsTimeline: [
      { time: "Day 1–3", items: ["Autophagy pathways begin activating*", "Senolytic compounds start accumulating*"] },
      { time: "Day 4–7", items: ["Peak cellular cleanup activity*", "Antioxidant defenses fully engaged*"] },
      { time: "Week 2–3", items: ["Recovery and integration period*", "Body processes the cleanup cycle*"] },
      { time: "Monthly", items: ["Cumulative cellular renewal benefits*", "Reduced burden of aging cells over time*", "Foundation for long-term longevity*"] },
    ],
    howToUse: {
      instruction: "Take 5 capsules daily for 7 consecutive days, once per month.",
      tips: ["Take with a meal to minimize GI sensitivity", "The 3-week off period is part of the design", "Can be taken alongside CELLUNAD+"],
    },
    ingredientGroups: [
      {
        category: "Autophagy Activators",
        totalDose: "Spermidine 15 mg + Resveratrol 500 mg",
        desc: "Two compounds that work together to support your body's natural cellular cleanup processes.",
        ingredients: ["Spermidine (from Wheat Germ) — 15 mg", "Trans-Resveratrol — 500 mg", "Green Tea Extract (50% EGCG) — 300 mg"],
      },
      {
        category: "Senolytic Blend",
        totalDose: "Fisetin 100 mg + Quercetin 500 mg",
        desc: "Flavonoids that support the body's ability to manage aging, non-functional cells.",
        ingredients: ["Fisetin — 100 mg", "Quercetin — 500 mg"],
      },
      {
        category: "Recovery & Antioxidant Support",
        totalDose: "NAC 600 mg + Ca-AKG 300 mg",
        desc: "Cofactors that support antioxidant defenses and metabolic efficiency during the cleanup cycle.",
        ingredients: ["NAC — 600 mg", "Calcium Alpha-Ketoglutarate — 300 mg", "Astaxanthin — 4 mg", "PQQ — 10 mg", "BioPerine — 5 mg"],
      },
    ],
    qualityBadges: ["cGMP Manufactured", "Third-Party Tested", "Contains Wheat", "Full Label Disclosure", "No Artificial Fillers", "Cyclical Protocol"],
    comparison: {
      us: ["10 synergistic active ingredients", "Clinically studied doses", "Designed as a 7-day cycle", "Third-party tested for purity", "Full label disclosure"],
      them: ["1–2 ingredients at low doses", "Sub-clinical amounts common", "Daily use (not cyclical)", "Rarely third-party tested", "Proprietary blends"],
    },
    scienceSection: {
      headline: 'Autophagy & Cellular Aging',
      paragraphs: [
        'As we age, damaged proteins and non-functional "zombie" cells accumulate. These cells stay active but stop doing their job, contributing to inflammation and decline.',
        'CELLUNOVA is designed as a short, focused cycle to support your body\'s natural cleanup processes—autophagy and senescent cell management—then step back and let your body recover.'
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
    deliveryRationale: null as { headline: string; text: string } | null,
    suitability: [
      "Adults focused on healthy aging",
      "Periodic cellular cleanup support",
      "Experienced supplement users",
      "Longevity-focused wellness routines"
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
    ctaHeadline: ['Reset.', 'Renew.'],
    ctaBody: 'Add CELLUNOVA for a focused 7-day cellular cleanup cycle.',
    ctaButton: 'Start Now',
  }
};
