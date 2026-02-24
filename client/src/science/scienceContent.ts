export const SCIENCE_META = {
  title: "Science | Age Revive",
  description:
    "Learn the protocol design behind Age Revive: NAD+ restoration, gut-mitochondria support, and periodic cellular reset. Clinically studied compounds, transparent doses, and third-party testing.",
  canonicalPath: "/science",
};

export type TocItem = { id: string; label: string };
export const SCIENCE_TOC: TocItem[] = [
  { id: "protocol", label: "Protocol architecture" },
  { id: "standards", label: "Our standards" },
  { id: "nad", label: "NAD+ foundation" },
  { id: "gut-mito", label: "Gut-mitochondria axis" },
  { id: "reset", label: "Controlled reset" },
  { id: "delivery", label: "Delivery matters" },
  { id: "quality", label: "Quality and testing" },
  { id: "evidence", label: "Evidence and dosing" },
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

export type LayerCard = {
  eyebrow: string;
  productName: string;
  roleTitle: string;
  roleBody: string;
  bullets: string[];
  entities: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export const LAYERS: LayerCard[] = [
  {
    eyebrow: "FOUNDATION LAYER",
    productName: "CELLUNAD+",
    roleTitle: "Daily NAD+ and metabolic foundation",
    roleBody:
      "Supports NAD+ regeneration and mitochondrial energy metabolism with methylation co-factor support designed for consistent daily use.",
    bullets: [
      "500 mg Nicotinamide Riboside (NR) per serving",
      "Methylation support: TMG, 5-MTHF, methyl-B12, P-5-P",
      "Mitochondrial cofactor: R-Lipoic Acid",
    ],
    entities: ["Nicotinamide Riboside (NR)", "NAD+", "Mitochondria", "Methylation", "R-Lipoic Acid"],
    primaryCtaLabel: "Explore CELLUNAD+",
    primaryCtaHref: "/product/cellunad",
    secondaryCtaLabel: "How to stack",
    secondaryCtaHref: "#protocol",
  },
  {
    eyebrow: "SIGNAL STABILITY",
    productName: "CELLUBIOME",
    roleTitle: "Gut barrier and mitochondrial renewal support",
    roleBody:
      "Pairs mitochondrial recycling support (mitophagy) with gut barrier support to stabilize core inputs that influence cellular signaling and resilience.",
    bullets: [
      "Urolithin A for mitophagy support",
      "Tributyrin to supply bioavailable butyrate",
      "Enteric protection to reach the intestines intact",
    ],
    entities: ["Urolithin A", "Mitophagy", "Tributyrin", "Butyrate", "Gut barrier"],
    primaryCtaLabel: "Explore CELLUBIOME",
    primaryCtaHref: "/product/cellubiome",
    secondaryCtaLabel: "Why enteric delivery",
    secondaryCtaHref: "#delivery",
  },
  {
    eyebrow: "CONTROLLED RESET",
    productName: "CELLUNOVA",
    roleTitle: "7-day monthly cellular cleanup protocol",
    roleBody:
      "A periodic protocol designed to support autophagy-related pathways, mitochondrial resilience, and exposure to senescence research compounds.",
    bullets: [
      "7-day protocol format, repeated monthly",
      "Autophagy support: spermidine, trans-resveratrol, EGCG",
      "Senescence research compounds: quercetin, fisetin",
      "Mitochondrial resilience: NAC, PQQ, astaxanthin, Ca-AKG",
    ],
    entities: ["Autophagy", "Senescence", "Quercetin", "Fisetin", "Spermidine", "NAC", "PQQ", "Ca-AKG"],
    primaryCtaLabel: "Explore CELLUNOVA",
    primaryCtaHref: "/product/cellunova",
    secondaryCtaLabel: "Protocol timeline",
    secondaryCtaHref: "#reset",
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
      "No proprietary blends. Every ingredient and dose is listed so you can evaluate the protocol like an adult.",
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
      "CELLUNAD+ is designed as a daily NAD+ foundation using NR with co-factor support for balanced metabolism.",
    rows: [
      { ingredient: "Nicotinamide Riboside (NR)", dose: "500 mg", why: "Used in published human studies evaluating NAD+ elevation and tolerability.", notes: "See Martens 2018; Trammell 2016." },
      { ingredient: "R-Lipoic Acid", dose: "200 mg", why: "Mitochondrial cofactor studied for oxidative balance and metabolic support.", notes: "Human literature varies by indication and dose." },
      { ingredient: "Apigenin", dose: "100 mg", why: "Included as a supportive flavone often studied for cellular stress-response signaling.", notes: "Evidence base varies by endpoint." },
      { ingredient: "Betaine (TMG)", dose: "250 mg", why: "Co-factor support for methylation pathways associated with NAD+ metabolism.", notes: "Used to support methyl donor availability." },
      { ingredient: "P-5-P", dose: "10 mg", why: "Active B6 form, supports amino acid and methylation-related enzymatic processes." },
      { ingredient: "5-MTHF", dose: "400 mcg DFE", why: "Active folate form used to support methylation pathways.", notes: "DFE = dietary folate equivalents." },
      { ingredient: "Methylcobalamin", dose: "1,000 mcg", why: "Active B12 form used in methylation support stacks." },
      { ingredient: "BioPerine", dose: "5 mg", why: "Included to support absorption of select compounds." },
    ],
  },
  {
    product: "CELLUBIOME",
    caption:
      "CELLUBIOME targets the gut-mitochondria interface by pairing mitophagy support with butyrate delivery and gut barrier support.",
    rows: [
      { ingredient: "Urolithin A", dose: "500 mg", why: "Dose aligned with published human studies evaluating safety and mitochondrial-related biomarkers.", notes: "See Andreux 2019." },
      { ingredient: "Tributyrin", dose: "500 mg", why: "Butyrate precursor designed to resist gastric conditions and deliver butyrate downstream.", notes: "Butyrate barrier literature includes cell and animal models; tributyrin research includes in vitro GI simulation models." },
      { ingredient: "Enteric protection", dose: "Formulation", why: "Used when upstream digestion reduces the fraction reaching the intestine intact.", notes: "Design choice, not an ingredient." },
    ],
  },
  {
    product: "CELLUNOVA",
    caption:
      "CELLUNOVA is a periodic 7-day protocol that combines autophagy support compounds, senescence research compounds, and mitochondrial resilience support.",
    rows: [
      { ingredient: "NAC", dose: "600 mg", why: "Commonly used to support glutathione-related antioxidant pathways." },
      { ingredient: "Trans-Resveratrol", dose: "500 mg", why: "Studied for cellular stress-response signaling; evidence varies by endpoint." },
      { ingredient: "Quercetin", dose: "500 mg", why: "Studied in senescence research; human data for senolytics is early and often in combination protocols.", notes: "See Hickson 2019 (D+Q) for context." },
      { ingredient: "Fisetin", dose: "100 mg", why: "Studied in senescence-related research and preclinical models.", notes: "Evidence in humans is still emerging." },
      { ingredient: "Green Tea Extract (50% EGCG)", dose: "300 mg", why: "Studied for cellular stress-response signaling and metabolic support." },
      { ingredient: "Spermidine (wheat germ)", dose: "15 mg", why: "Linked to autophagy-related pathways across model systems; human data often observational or indirect.", notes: "Contains wheat." },
      { ingredient: "Astaxanthin", dose: "4 mg", why: "Studied for oxidative defense support." },
      { ingredient: "PQQ", dose: "10 mg", why: "Studied in mitochondrial biogenesis signaling contexts; evidence varies by endpoint." },
      { ingredient: "Ca-AKG", dose: "300 mg", why: "Studied in metabolic contexts; evidence varies by endpoint." },
      { ingredient: "BioPerine", dose: "5 mg", why: "Included to support absorption of select compounds." },
    ],
  },
];

export type GlossaryItem = { term: string; definition: string };
export const GLOSSARY: GlossaryItem[] = [
  {
    term: "NAD+",
    definition:
      "Nicotinamide adenine dinucleotide (NAD+) is a coenzyme involved in cellular energy metabolism and multiple enzymatic processes tied to cellular maintenance.",
  },
  {
    term: "Nicotinamide Riboside (NR)",
    definition:
      "NR is a precursor used by cells to synthesize NAD+. Human studies have evaluated NR supplementation for NAD+ elevation and tolerability.",
  },
  {
    term: "Mitochondria",
    definition:
      "Mitochondria are organelles involved in energy production and metabolic signaling. Mitochondrial function influences cellular resilience.",
  },
  {
    term: "Mitophagy",
    definition:
      "Mitophagy is a cellular process involved in recycling damaged mitochondria as part of broader cellular maintenance systems.",
  },
  {
    term: "Butyrate",
    definition:
      "Butyrate is a short-chain fatty acid produced by gut microbes and also delivered via precursors. It is studied for gut barrier and metabolic signaling roles.",
  },
  {
    term: "Gut barrier integrity",
    definition:
      "A term used to describe structural and functional properties of the intestinal lining, including tight junction regulation and mucus layer support.",
  },
  {
    term: "Autophagy",
    definition:
      "Autophagy is a cellular recycling process that helps clear damaged components and supports cellular homeostasis.",
  },
  {
    term: "Cellular senescence",
    definition:
      "A state where cells stop dividing and can change signaling output. Human interventions targeting senescence are an active research area.",
  },
  {
    term: "Enteric protection",
    definition:
      "A formulation approach that helps protect capsules from stomach acid so contents release further downstream in the digestive tract.",
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

export type ReferenceItem = { label: string; url: string; note?: string };
export const REFERENCES: ReferenceItem[] = [
  {
    label:
      "Andreux PA, et al. The mitophagy activator urolithin A is safe and induces a molecular signature of improved mitochondrial and cellular health in humans. Nature Metabolism (2019). DOI:10.1038/s42255-019-0073-4",
    url: "https://pubmed.ncbi.nlm.nih.gov/32694802/",
  },
  {
    label:
      "Martens CR, et al. Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD+ in healthy middle-aged and older adults. Nature Communications (2018). DOI:10.1038/s41467-018-03421-7",
    url: "https://pubmed.ncbi.nlm.nih.gov/29599478/",
  },
  {
    label:
      "Trammell SAJ, et al. Nicotinamide riboside is uniquely and orally bioavailable in mice and humans. Nature Communications (2016). DOI:10.1038/ncomms12948",
    url: "https://pubmed.ncbi.nlm.nih.gov/27721479/",
  },
  {
    label:
      "Peng L, et al. Butyrate enhances the intestinal barrier by facilitating tight junction assembly via AMPK in Caco-2 monolayers. Journal of Nutrition (2009).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2728689/",
    note: "Cell model evidence relevant to barrier mechanism.",
  },
  {
    label:
      "Donohoe DR, et al. The microbiome and butyrate regulate energy metabolism and autophagy in the mammalian colon. Cell Metabolism (2011).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3099420/",
    note: "Mechanistic link between microbial metabolites and colonocyte mitochondria.",
  },
  {
    label:
      "Duysburgh C, et al. Tributyrin (CoreBiome) modulates butyrate levels and barrier function in vitro GI simulation models. Frontiers in Nutrition (2025). DOI:10.3389/fnut.2025.1712993",
    url: "https://pubmed.ncbi.nlm.nih.gov/41473189/",
    note: "In vitro simulation model, not a clinical outcomes trial.",
  },
  {
    label:
      "Hofer SJ, et al. Spermidine is essential for fasting-mediated autophagy and longevity. Nature Cell Biology (2024).",
    url: "https://www.nature.com/articles/s41556-024-01468-x",
    note: "Mechanistic paper that connects spermidine and autophagy pathways.",
  },
  {
    label:
      "Hickson LJ, et al. Senolytics decrease senescent cells in humans: preliminary report from a clinical trial of dasatinib plus quercetin in diabetic kidney disease. EBioMedicine (2019). DOI:10.1016/j.ebiom.2019.08.069",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6796530/",
    note: "Context: this is D+Q combination research, not quercetin alone.",
  },
  {
    label:
      "Salminen S, et al. ISAPP consensus statement on the definition and scope of postbiotics. Nature Reviews Gastroenterology and Hepatology (2021). DOI:10.1038/s41575-021-00440-6",
    url: "https://pubmed.ncbi.nlm.nih.gov/33948025/",
  },
];

export const FINAL_CTA = {
  eyebrow: "READY TO APPLY THIS",
  headline: "Build your protocol",
  body:
    "Start with the daily foundation, add gut-mitochondria stability, then layer in a periodic reset. Simple structure. Clear intent.",
  cards: [
    {
      title: "CELLUNAD+",
      tag: "Daily foundation",
      body: "NAD+ restoration with methylation co-factor support.",
      href: "/product/cellunad",
      cta: "Shop CELLUNAD+",
    },
    {
      title: "CELLUBIOME",
      tag: "Signal stability",
      body: "Mitophagy support plus butyrate delivery for gut barrier integrity support.",
      href: "/product/cellubiome",
      cta: "Shop CELLUBIOME",
    },
    {
      title: "CELLUNOVA",
      tag: "Monthly reset",
      body: "7-day protocol supporting autophagy-related pathways and mitochondrial resilience.",
      href: "/product/cellunova",
      cta: "Shop CELLUNOVA",
    },
  ],
};
