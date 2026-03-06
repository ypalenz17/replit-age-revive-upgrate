export const SCIENCE_META = {
  title: "Science | Age Revive",
  description:
    "Learn the protocol design behind Age Revive: NAD+ restoration, gut-mitochondria support, and periodic renewal. Research-aligned compounds, transparent doses, and third-party testing.",
  canonicalPath: "/science",
};

export type TocItem = { id: string; label: string };
export const SCIENCE_TOC: TocItem[] = [
  { id: "how-to-read", label: "How to read this" },
  { id: "protocol", label: "Protocol architecture" },
  { id: "standards", label: "Our standards" },
  { id: "deep-dives", label: "Formulation logic" },
  { id: "evidence", label: "Evidence & dosing" },
  { id: "glossary", label: "Glossary" },
  { id: "faq", label: "FAQ" },
  { id: "references", label: "References" },
];

export type TrustMarker = { title: string; detail: string };
export const TRUST_MARKERS: TrustMarker[] = [
  { title: "Clinically studied compounds", detail: "Selected for mechanism relevance and human research where available." },
  { title: "Transparent dosing", detail: "Full label disclosure. No proprietary blends." },
  { title: "Delivery designed for biology", detail: "Enteric protection where stomach exposure compromises usefulness." },
  { title: "Third-party testing", detail: "Purity, potency, and contaminants verified by independent labs." },
];

export type EvidenceContext = "Human data" | "Emerging human data" | "Mechanistic / preclinical" | "Formulation choice";

export const EVIDENCE_FRAMEWORK: { label: EvidenceContext; description: string }[] = [
  { label: "Human data", description: "Published research in human subjects evaluating safety, biomarkers, or functional endpoints." },
  { label: "Emerging human data", description: "Early-stage human research or observational data. Promising but not yet robust." },
  { label: "Mechanistic / preclinical", description: "Cell, animal, or in vitro models establishing biological plausibility." },
  { label: "Formulation choice", description: "Design decision based on delivery, stability, or absorption logic." },
];

export type LayerCard = {
  eyebrow: string;
  productName: string;
  roleTitle: string;
  cadence: string;
  roleBody: string;
  keyIngredients: string;
  distinctionNote: string;
  ctaHref: string;
};

export const LAYERS: LayerCard[] = [
  {
    eyebrow: "FOUNDATION",
    productName: "CELLUNAD+",
    roleTitle: "Daily NAD+ and metabolic foundation",
    cadence: "2 capsules daily",
    roleBody:
      "Supports NAD+ regeneration and mitochondrial energy metabolism with methylation co-factor support.",
    keyIngredients: "500 mg NR, TMG, 5-MTHF, B12, P-5-P, R-Lipoic Acid, Apigenin",
    distinctionNote: "Designed for consistent daily use. Non-stimulant.",
    ctaHref: "/product/cellunad",
  },
  {
    eyebrow: "SIGNAL STABILITY",
    productName: "CELLUBIOME",
    roleTitle: "Gut barrier and mitochondrial renewal support",
    cadence: "2 enteric capsules daily",
    roleBody:
      "Pairs mitochondrial recycling support (mitophagy) with gut barrier support via bioavailable butyrate.",
    keyIngredients: "500 mg Urolithin A, 500 mg Tributyrin, enteric-coated delivery",
    distinctionNote: "Enteric protection ensures intestinal delivery.",
    ctaHref: "/product/cellubiome",
  },
  {
    eyebrow: "CONTROLLED RESET",
    productName: "CELLUNOVA",
    roleTitle: "7-day monthly renewal protocol",
    cadence: "5 capsules daily × 7 days, monthly",
    roleBody:
      "A periodic protocol supporting autophagy-related pathways, mitochondrial resilience, and exposure to senescence research compounds.",
    keyIngredients: "Spermidine, trans-resveratrol, EGCG, quercetin, fisetin, NAC, PQQ, Ca-AKG",
    distinctionNote: "Intentionally not daily. Periodic protocol format.",
    ctaHref: "/product/cellunova",
  },
];

export type Standard = { title: string; body: string };
export const STANDARDS: Standard[] = [
  {
    title: "Dose",
    body:
      "We prioritize doses that match or align with published human research when available, and we state doses clearly on the label.",
  },
  {
    title: "Delivery",
    body:
      "If a compound needs to reach the intestine intact, delivery is not optional. Enteric protection is used when stomach exposure reduces effectiveness.",
  },
  {
    title: "Mechanism",
    body:
      "We formulate around biological pathways, not buzzwords: NAD+ metabolism, mitophagy, gut barrier integrity, autophagy-related processes.",
  },
  {
    title: "Transparency",
    body:
      "No proprietary blends. Every ingredient and dose is listed so you can evaluate the protocol directly.",
  },
  {
    title: "Testing",
    body:
      "Third-party testing for purity, potency, and contaminants. We prefer measurable trust over marketing trust.",
  },
];

export type EvidenceRow = {
  ingredient: string;
  dose: string;
  why: string;
  evidence: EvidenceContext;
  notes?: string;
};

export type EvidenceTable = {
  product: string;
  caption: string;
  rows: EvidenceRow[];
};

export const EVIDENCE_TABLES: EvidenceTable[] = [
  {
    product: "CELLUNAD+",
    caption:
      "Daily NAD+ foundation using NR with co-factor support for balanced metabolism.",
    rows: [
      { ingredient: "Nicotinamide Riboside (NR)", dose: "500 mg", why: "Used in published human studies evaluating NAD+ elevation and tolerability.", evidence: "Human data", notes: "See Martens 2018; Trammell 2016." },
      { ingredient: "R-Lipoic Acid", dose: "200 mg", why: "Mitochondrial cofactor studied for oxidative balance and metabolic support.", evidence: "Emerging human data", notes: "Human literature varies by indication and dose." },
      { ingredient: "Apigenin", dose: "100 mg", why: "Supportive flavone studied for cellular stress-response signaling.", evidence: "Mechanistic / preclinical", notes: "Evidence base varies by endpoint." },
      { ingredient: "Betaine (TMG)", dose: "250 mg", why: "Co-factor support for methylation pathways associated with NAD+ metabolism.", evidence: "Human data" },
      { ingredient: "P-5-P", dose: "10 mg", why: "Active B6 form supporting amino acid and methylation-related enzymatic processes.", evidence: "Human data" },
      { ingredient: "5-MTHF", dose: "400 mcg DFE", why: "Active folate form used to support methylation pathways.", evidence: "Human data", notes: "DFE = dietary folate equivalents." },
      { ingredient: "Methylcobalamin", dose: "1,000 mcg", why: "Active B12 form used in methylation support stacks.", evidence: "Human data" },
      { ingredient: "BioPerine", dose: "5 mg", why: "Included to support absorption of select compounds.", evidence: "Formulation choice" },
    ],
  },
  {
    product: "CELLUBIOME",
    caption:
      "Gut-mitochondria interface: mitophagy support paired with butyrate delivery and gut barrier support.",
    rows: [
      { ingredient: "Urolithin A", dose: "500 mg", why: "Dose aligned with published human studies evaluating safety and mitochondrial-related biomarkers.", evidence: "Human data", notes: "See Andreux 2019." },
      { ingredient: "Tributyrin", dose: "500 mg", why: "Butyrate precursor designed to resist gastric conditions and deliver butyrate downstream.", evidence: "Mechanistic / preclinical", notes: "Butyrate barrier literature includes cell and animal models; tributyrin research includes in vitro GI simulation models." },
      { ingredient: "Enteric protection", dose: "Formulation", why: "Used when upstream digestion reduces the fraction reaching the intestine intact.", evidence: "Formulation choice", notes: "Design choice, not an ingredient." },
    ],
  },
  {
    product: "CELLUNOVA",
    caption:
      "Periodic 7-day protocol combining autophagy support, senescence research compounds, and mitochondrial resilience support.",
    rows: [
      { ingredient: "NAC", dose: "600 mg", why: "Commonly used to support glutathione-related antioxidant pathways.", evidence: "Human data" },
      { ingredient: "Trans-Resveratrol", dose: "500 mg", why: "Studied for cellular stress-response signaling; evidence varies by endpoint.", evidence: "Emerging human data" },
      { ingredient: "Quercetin", dose: "500 mg", why: "Studied in senescence research; human data for senolytics is early and often in combination protocols.", evidence: "Emerging human data", notes: "See Hickson 2019 (D+Q) for context." },
      { ingredient: "Fisetin", dose: "100 mg", why: "Studied in senescence-related research and preclinical models.", evidence: "Mechanistic / preclinical", notes: "Evidence in humans is still emerging." },
      { ingredient: "Green Tea Extract (50% EGCG)", dose: "300 mg", why: "Studied for cellular stress-response signaling and metabolic support.", evidence: "Human data" },
      { ingredient: "Spermidine (wheat germ)", dose: "15 mg", why: "Linked to autophagy-related pathways across model systems; human data often observational or indirect.", evidence: "Emerging human data", notes: "Contains wheat." },
      { ingredient: "Astaxanthin", dose: "4 mg", why: "Studied for oxidative defense support.", evidence: "Human data" },
      { ingredient: "PQQ", dose: "10 mg", why: "Studied in mitochondrial biogenesis signaling contexts; evidence varies by endpoint.", evidence: "Mechanistic / preclinical" },
      { ingredient: "Ca-AKG", dose: "300 mg", why: "Studied in metabolic contexts; evidence varies by endpoint.", evidence: "Emerging human data" },
      { ingredient: "BioPerine", dose: "5 mg", why: "Included to support absorption of select compounds.", evidence: "Formulation choice" },
    ],
  },
];

export type DeepDive = {
  product: string;
  whatItIsFor: string;
  whatItIsNot: string;
  howItIsUsed: string;
  formulationRationale: string;
  confidenceNote: string;
};

export const DEEP_DIVES: DeepDive[] = [
  {
    product: "CELLUNAD+",
    whatItIsFor: "Daily NAD+ restoration. NR (Nicotinamide Riboside) is a precursor used by cells to synthesize NAD+, a coenzyme central to cellular energy metabolism. The formula includes methylation co-factors (TMG, 5-MTHF, B12, P-5-P) because NAD+ metabolism intersects with methylation pathways.",
    whatItIsNot: "Not a stimulant. Not a single-ingredient stack. Not designed for transient energy spikes.",
    howItIsUsed: "2 capsules daily. Evaluate over 8–12 weeks of consistent use. Consistency matters more than timing.",
    formulationRationale: "NR dose (500 mg) aligns with published human studies. Methylation co-factors are included to support balanced pathway activity rather than isolated precursor loading.",
    confidenceNote: "NR has published human research for NAD+ elevation and tolerability. Co-factors like TMG and active B vitamins have well-established biochemistry. Apigenin and R-Lipoic Acid have mechanistic support with varying human evidence by endpoint.",
  },
  {
    product: "CELLUBIOME",
    whatItIsFor: "Gut barrier support and mitochondrial renewal. Urolithin A supports mitophagy pathways. Tributyrin delivers bioavailable butyrate downstream to support gut barrier integrity.",
    whatItIsNot: "Not a probiotic. Not intended to treat gut disease. It is a targeted compound approach for gut barrier integrity and mitochondrial maintenance pathways.",
    howItIsUsed: "2 enteric capsules daily. Enteric protection ensures the contents reach the intestine intact.",
    formulationRationale: "Urolithin A dose (500 mg) matches published human studies. Tributyrin is used instead of direct butyrate because butyrate is unstable upstream. Enteric protection is a deliberate design choice — without it, the formula would not match its intent.",
    confidenceNote: "Urolithin A has published human research on safety and mitochondrial biomarkers. Butyrate has strong mechanistic literature (cell and animal models). Tributyrin-specific evidence includes in vitro GI simulation models — not yet clinical outcomes trials.",
  },
  {
    product: "CELLUNOVA",
    whatItIsFor: "Periodic support for autophagy-related pathways, exposure to senescence research compounds, and mitochondrial resilience during a defined protocol window.",
    whatItIsNot: "Not daily. Not a maintenance supplement. Not a senolytic drug protocol. Referencing senescence research does not mean identical outcomes from different protocols, doses, or combinations.",
    howItIsUsed: "5 capsules daily for 7 consecutive days, repeated monthly. Periodic format reflects how these pathways are explored in research settings.",
    formulationRationale: "Combines autophagy support (spermidine, resveratrol, EGCG), senescence research compounds (quercetin, fisetin), and mitochondrial resilience (NAC, PQQ, astaxanthin, Ca-AKG). Contains wheat (spermidine source).",
    confidenceNote: "Spermidine has emerging human data, often observational. Quercetin and fisetin appear in senescence research — human clinical data is early and often involves combination protocols (e.g., D+Q). NAC and EGCG have broader human evidence. PQQ and Ca-AKG evidence varies by endpoint.",
  },
];

export type GlossaryItem = { term: string; definition: string };
export const GLOSSARY: GlossaryItem[] = [
  {
    term: "NAD+",
    definition:
      "Nicotinamide adenine dinucleotide. A coenzyme involved in cellular energy metabolism and multiple enzymatic processes tied to cellular maintenance.",
  },
  {
    term: "NR (Nicotinamide Riboside)",
    definition:
      "A precursor used by cells to synthesize NAD+. Human studies have evaluated NR supplementation for NAD+ elevation and tolerability.",
  },
  {
    term: "Mitochondria",
    definition:
      "Organelles involved in energy production and metabolic signaling. Mitochondrial function influences cellular resilience.",
  },
  {
    term: "Mitophagy",
    definition:
      "A cellular process involved in recycling damaged mitochondria as part of broader cellular maintenance systems.",
  },
  {
    term: "Butyrate",
    definition:
      "A short-chain fatty acid produced by gut microbes and also delivered via precursors. Studied for gut barrier and metabolic signaling roles.",
  },
  {
    term: "Gut barrier integrity",
    definition:
      "Structural and functional properties of the intestinal lining, including tight junction regulation and mucus layer support.",
  },
  {
    term: "Autophagy",
    definition:
      "A cellular recycling process that helps clear damaged components and supports cellular homeostasis.",
  },
  {
    term: "Cellular senescence",
    definition:
      "A state where cells stop dividing and can change signaling output. Human interventions targeting senescence are an active research area.",
  },
  {
    term: "Enteric protection",
    definition:
      "A formulation approach that protects capsule contents from stomach acid so they release further downstream in the digestive tract.",
  },
];

export type FaqItem = { q: string; a: string };
export const FAQ: FaqItem[] = [
  {
    q: "Is this page medical advice?",
    a: "No. This is educational information about ingredients, dosing, and formulation choices. It is not medical advice.",
  },
  {
    q: 'What does "clinically studied" mean here?',
    a: "It means the ingredient has published human research evaluating safety, biomarkers, or functional endpoints. It does not guarantee a specific outcome for every individual.",
  },
  {
    q: "Do you use proprietary blends?",
    a: "No. We disclose every ingredient and dose so you can evaluate the protocol directly.",
  },
  {
    q: "Do you publish third-party testing?",
    a: "We third-party test for purity, potency, and contaminants. COAs can be made available through support depending on lot and product.",
  },
  {
    q: "Why does delivery matter?",
    a: "Some compounds are degraded or absorbed too early. Enteric protection is used when the goal is to reach the intestines intact.",
  },
  {
    q: "How do the three products fit together?",
    a: "CELLUNAD+ is a daily NAD+ foundation, CELLUBIOME supports gut-mitochondria signaling stability, and CELLUNOVA is a periodic 7-day monthly reset protocol.",
  },
  {
    q: "How long should I evaluate a protocol?",
    a: "Most people assess meaningful changes after 8 to 12 weeks of consistent use for daily products.*",
  },
  {
    q: "Any safety notes?",
    a: "Consult your healthcare provider before use if you are pregnant, nursing, on medication, or managing a medical condition. CELLUNOVA contains wheat (spermidine source).",
  },
];

export type ReferenceItem = { label: string; url: string; note?: string; group: string };
export const REFERENCES: ReferenceItem[] = [
  {
    group: "NAD+ / Nicotinamide Riboside",
    label:
      "Martens CR, et al. Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD+ in healthy middle-aged and older adults. Nature Communications (2018).",
    url: "https://pubmed.ncbi.nlm.nih.gov/29599478/",
    note: "Human trial: NR safety, tolerability, and NAD+ elevation.",
  },
  {
    group: "NAD+ / Nicotinamide Riboside",
    label:
      "Trammell SAJ, et al. Nicotinamide riboside is uniquely and orally bioavailable in mice and humans. Nature Communications (2016).",
    url: "https://pubmed.ncbi.nlm.nih.gov/27721479/",
    note: "Human and preclinical: oral bioavailability of NR.",
  },
  {
    group: "Gut barrier / Butyrate / Urolithin A",
    label:
      "Andreux PA, et al. The mitophagy activator urolithin A is safe and induces a molecular signature of improved mitochondrial and cellular health in humans. Nature Metabolism (2019).",
    url: "https://pubmed.ncbi.nlm.nih.gov/32694802/",
    note: "Human trial: Urolithin A safety and mitochondrial biomarkers.",
  },
  {
    group: "Gut barrier / Butyrate / Urolithin A",
    label:
      "Peng L, et al. Butyrate enhances the intestinal barrier by facilitating tight junction assembly via AMPK in Caco-2 monolayers. Journal of Nutrition (2009).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2728689/",
    note: "Cell model: butyrate and barrier mechanism.",
  },
  {
    group: "Gut barrier / Butyrate / Urolithin A",
    label:
      "Donohoe DR, et al. The microbiome and butyrate regulate energy metabolism and autophagy in the mammalian colon. Cell Metabolism (2011).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3099420/",
    note: "Mechanistic: microbial metabolites and colonocyte mitochondria.",
  },
  {
    group: "Gut barrier / Butyrate / Urolithin A",
    label:
      "Duysburgh C, et al. Tributyrin (CoreBiome) modulates butyrate levels and barrier function in vitro GI simulation models. Frontiers in Nutrition (2025).",
    url: "https://pubmed.ncbi.nlm.nih.gov/41473189/",
    note: "In vitro simulation model, not a clinical outcomes trial.",
  },
  {
    group: "Autophagy / Spermidine / Senescence",
    label:
      "Hofer SJ, et al. Spermidine is essential for fasting-mediated autophagy and longevity. Nature Cell Biology (2024).",
    url: "https://www.nature.com/articles/s41556-024-01468-x",
    note: "Mechanistic: spermidine and autophagy pathways.",
  },
  {
    group: "Autophagy / Spermidine / Senescence",
    label:
      "Hickson LJ, et al. Senolytics decrease senescent cells in humans: preliminary report from a clinical trial of dasatinib plus quercetin in diabetic kidney disease. EBioMedicine (2019).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6796530/",
    note: "Context: D+Q combination research, not quercetin alone.",
  },
  {
    group: "General / Consensus",
    label:
      "Salminen S, et al. ISAPP consensus statement on the definition and scope of postbiotics. Nature Reviews Gastroenterology and Hepatology (2021).",
    url: "https://pubmed.ncbi.nlm.nih.gov/33948025/",
    note: "Consensus: postbiotic definitions and scope.",
  },
];

export const REFERENCE_GROUPS = [
  "NAD+ / Nicotinamide Riboside",
  "Gut barrier / Butyrate / Urolithin A",
  "Autophagy / Spermidine / Senescence",
  "General / Consensus",
];

export const FINAL_CTA = {
  headline: "Build your protocol",
  body:
    "Start with the daily foundation, add gut-mitochondria stability, then layer in a periodic reset. Simple structure. Clear intent.",
  cards: [
    {
      title: "CELLUNAD+",
      tag: "Daily foundation",
      body: "NAD+ restoration with methylation co-factor support.",
      href: "/product/cellunad",
    },
    {
      title: "CELLUBIOME",
      tag: "Signal stability",
      body: "Mitophagy support plus butyrate delivery for gut barrier integrity.",
      href: "/product/cellubiome",
    },
    {
      title: "CELLUNOVA",
      tag: "Monthly reset",
      body: "7-day protocol supporting autophagy-related pathways and mitochondrial resilience.",
      href: "/product/cellunova",
    },
  ],
};
